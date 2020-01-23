import {
    RenderedQuestionGroup,
    SurveyContext,
    Expression,
    isExpression,
    RenderedQuestion,
    isRenderedQuestionGroup,
    SurveyGroupItemResponse,
    SurveyItemResponse,
    isSurveyGroupItemResponse,
    ExpressionArg
} from "./data_types";


export class ExpressionEval {
    renderedSurvey?: RenderedQuestionGroup;
    context?: SurveyContext;
    responses?: SurveyGroupItemResponse;

    public eval(
        expression?: Expression,
        renderedSurvey?: RenderedQuestionGroup,
        context?: SurveyContext,
        responses?: SurveyGroupItemResponse
    ): boolean {
        // Default if no conditions found:
        if (!expression) {
            return true;
        }

        this.renderedSurvey = renderedSurvey;
        this.context = context;
        this.responses = responses;

        return this.evalExpression(expression);
    }

    private evalExpression(expression: Expression): any {
        switch (expression.name) {
            // logical operators -->
            case 'or':
                return this.or(expression);
            case 'and':
                return this.and(expression);
            case 'not':
                return this.not(expression);
            // comparision methods -->
            case 'eq':
                return this.eq(expression);
            case 'lt':
                return this.lt(expression);
            case 'lte':
                return this.lte(expression);
            case 'gt':
                return this.gt(expression);
            case 'gte':
                return this.gte(expression);
            case 'regex':
                console.warn('regex not implemented');
                return;
            // reference methods to access variables and their items/attributes -->
            case 'getContext':
                return this.getContext();
            case 'getResponses':
                return this.getResponses();
            case 'getRenderedItems':
                return this.getRenderedItems();
            case 'getAttribute':
                return this.getAttribute(expression);
            case 'getArrayItemAtIndex':
                return this.getArrayItem(expression);
            case 'getArrayItemByKey':
                return this.getArrayItemByKey(expression);
            case 'getObjByHierarchicalKey':
                return this.getObjByHierarchicalKey(expression);
            default:
                console.warn('expression name unknown for the current engine: ' + expression.name + '. Default return value is false.');
                break;
        }
        return false;
    }

    // ---------- LOGIC OPERATORS ----------------
    private or(exp: Expression): boolean {
        if (!Array.isArray(exp.data)) {
            console.warn('or: data attribute is missing or wrong: ' + exp.data);
            return false;
        }
        return exp.data.some((value) => {
            const arg = expressionArgParser(value);
            return isExpression(arg) ? this.evalExpression(arg) : arg
        });
    }

    private and(exp: Expression): boolean {
        if (!Array.isArray(exp.data)) {
            console.warn('and: data attribute is missing or wrong: ' + exp.data);
            return false;
        }
        return exp.data.every((value) => {
            const arg = expressionArgParser(value);
            return isExpression(arg) ? this.evalExpression(arg) : arg
        });
    }

    private not(exp: Expression): boolean {
        if (!Array.isArray(exp.data) || exp.data?.length !== 1) {
            console.warn('not: method expects a sinlge Expression as an argument ');
            return false;
        }

        return !this.evalExpression(expressionArgParser(exp.data[0]) as Expression);
    }

    // ---------- COMPARISONS ----------------
    private eq(exp: Expression): boolean {
        if (!Array.isArray(exp.data) || exp.data.length < 1) {
            console.warn('eq: data attribute is missing or wrong: ' + exp.data);
            return false;
        }

        let values = [];
        for (let ind = 0; ind < exp.data.length; ind++) {
            const val = expressionArgParser(exp.data[ind]);
            if (isExpression(val)) {
                values.push(this.evalExpression(val));
            } else {
                values.push(val);
            }

        }

        // check if all values are equal
        return values.every((val, i, arr) => typeof (val) === 'string' ? (val.localeCompare(arr[0]) === 0) : (arr[0] === val));
    }

    private gt(exp: Expression): boolean {
        if (!Array.isArray(exp.data) || exp.data.length !== 2) {
            console.warn('gt: data attribute is missing or wrong: ' + exp.data);
            return false;
        }

        const arg1 = expressionArgParser(exp.data[0]);
        const arg2 = expressionArgParser(exp.data[1]);

        const a = isExpression(arg1) ? this.evalExpression(arg1) : arg1;
        const b = isExpression(arg2) ? this.evalExpression(arg2) : arg2;
        return typeof (a) === "string" ? a.localeCompare(b) > 0 : a > b;
    }

    private gte(exp: Expression): boolean {
        if (!Array.isArray(exp.data) || exp.data.length !== 2) {
            console.warn('gte: data attribute is missing or wrong: ' + exp.data);
            return false;
        }

        const arg1 = expressionArgParser(exp.data[0]);
        const arg2 = expressionArgParser(exp.data[1]);

        const a = isExpression(arg1) ? this.evalExpression(arg1) : arg1;
        const b = isExpression(arg2) ? this.evalExpression(arg2) : arg2;
        return typeof (a) === "string" ? a.localeCompare(b) >= 0 : a >= b;
    }

    private lt(exp: Expression): boolean {
        if (!Array.isArray(exp.data) || exp.data.length !== 2) {
            console.warn('lt: data attribute is missing or wrong: ' + exp.data);
            return false;
        }

        const arg1 = expressionArgParser(exp.data[0]);
        const arg2 = expressionArgParser(exp.data[1]);

        const a = isExpression(arg1) ? this.evalExpression(arg1) : arg1;
        const b = isExpression(arg2) ? this.evalExpression(arg2) : arg2;
        return typeof (a) === "string" ? a.localeCompare(b) < 0 : a < b;
    }

    private lte(exp: Expression): boolean {
        if (!Array.isArray(exp.data) || exp.data.length !== 2) {
            console.warn('lte: data attribute is missing or wrong: ' + exp.data);
            return false;
        }

        const arg1 = expressionArgParser(exp.data[0]);
        const arg2 = expressionArgParser(exp.data[1]);

        const a = isExpression(arg1) ? this.evalExpression(arg1) : arg1;
        const b = isExpression(arg2) ? this.evalExpression(arg2) : arg2;
        return typeof (a) === "string" ? a.localeCompare(b) <= 0 : a <= b;
    }

    // ---------- ROOT REFERENCES ----------------
    private getContext(): any {
        return this.context;
    }

    private getResponses(): SurveyGroupItemResponse | undefined {
        return this.responses;
    }

    private getRenderedItems(): RenderedQuestionGroup | undefined {
        return this.renderedSurvey;
    }

    // ---------- WORKING WITH OBJECT/ARRAYS ----------------
    private getAttribute(attributeRef: Expression): any {
        if (!Array.isArray(attributeRef.data) || attributeRef.data.length !== 2) {
            console.warn('getAttribute: data attribute is missing or wrong: ' + attributeRef.data);
            return null;
        }

        if (!isExpression(attributeRef.data[0].exp)) {
            console.warn('first argument is not a valid expression');
            return null;
        }
        if (!attributeRef.data[1].str) {
            console.warn('second argument is not a valid string');
            return null;
        }

        const obj = this.evalExpression(attributeRef.data[0].exp);
        if (!obj || typeof (obj) !== 'object') {
            console.warn('getAttribute: received wrong type for referenced object: ' + obj);
            return null;
        }
        const attr = obj[attributeRef.data[1].str];
        if (attributeRef.dtype) {
            return this.typeConvert(attr, attributeRef.dtype);
        }
        return attr;
    }

    private getArrayItem(itemRef: Expression): any {
        if (!Array.isArray(itemRef.data) || itemRef.data.length !== 2) {
            console.warn('getArrayItem: data attribute is missing or wrong: ' + itemRef.data);
            return null;
        }
        if (!isExpression(itemRef.data[0].exp)) {
            console.warn('first argument is not a valid expression');
            return null;
        }
        if (!itemRef.data[1].num) {
            console.warn('second argument is not a valid string');
            return null;
        }

        const arr = this.evalExpression(itemRef.data[0].exp);
        if (!arr || !Array.isArray(arr)) {
            console.warn('getArrayItem: received wrong type for referenced array: ' + arr);
            return null;
        }
        const item = arr[itemRef.data[1].num];
        if (itemRef.dtype) {
            return this.typeConvert(item, itemRef.dtype);
        }
        return item;
    }

    private getArrayItemByKey(exp: Expression): any {
        if (!exp.data || !Array.isArray(exp.data) || exp.data.length !== 2) {
            console.warn('getArrayItem: data attribute is missing or wrong: ' + exp.data);
            return null;
        }

        if (!isExpression(exp.data[0].exp)) {
            console.warn('first argument is not a valid expression');
            return null;
        }
        if (!exp.data[1].str) {
            console.warn('second argument is not a valid string');
            return null;
        }
        const key = exp.data[1].str;

        const arr = this.evalExpression(exp.data[0].exp);
        if (!arr || !Array.isArray(arr)) {
            console.warn('getArrayItemByKey: received wrong type for referenced array: ' + arr);
            return null;
        }
        const item = arr.find(a => a.key === key);
        if (!item) {
            return null;
        }
        if (exp.dtype) {
            return this.typeConvert(item, exp.dtype);
        }
        return item;
    }


    private getObjByHierarchicalKey(exp: Expression): any {
        if (!Array.isArray(exp.data) || exp.data.length !== 2) {
            console.warn('getObjByHierarchicalKey: data attribute is missing or wrong: ' + exp.data);
            return null;
        }

        if (!isExpression(exp.data[0].exp)) {
            console.warn('first argument is not a valid expression');
            return null;
        }
        if (!exp.data[1].str) {
            console.warn('second argument is not a valid string');
            return null;
        }
        const key = exp.data[1].str;

        let root = this.evalExpression(exp.data[0].exp);
        if (!isSurveyGroupItemResponse(root) && !isRenderedQuestionGroup(root)) {
            console.warn('getObjByHierarchicalKey: root is not a group: ' + root);
            return null;
        }

        const ids = key.split('.');
        let obj: SurveyItemResponse | Response | RenderedQuestionGroup | RenderedQuestion | undefined;
        let compID = ''
        ids.forEach(id => {
            if (!obj) {
                if (root.key !== id) {
                    console.warn('getObjByHierarchicalKey: cannot find root object for: ' + id);
                    return;
                }
                obj = root;
                compID += id;
                return;
            }

            compID += '.' + id;
            const ind = (obj as SurveyGroupItemResponse).items.findIndex(item => item.key === compID);
            if (ind < 0) {
                console.warn('getObjByHierarchicalKey: cannot find object for : ' + compID);
                return null;
            }
            obj = (obj as SurveyGroupItemResponse).items[ind];
        });

        if (exp.dtype) {
            return this.typeConvert(obj, exp.dtype);
        }
        return obj;
    }


    private typeConvert(value: any, dtype: string): any {
        switch (dtype) {
            case 'int':
                return typeof (value) === 'string' ? parseInt(value) : Math.floor(value);
            default:
                console.warn('typeConvert: dtype is not known: ' + dtype);
                return value;
        }
    }

}

const expressionArgParser = (arg: ExpressionArg): any => {
    switch (arg.dtype) {
        case 'number':
            return arg.num;
        case 'string':
            return arg.str;
        case 'exp':
            return arg.exp;
        default:
            console.warn('expression arg could not be parsed', arg);
            return undefined;
    }
}