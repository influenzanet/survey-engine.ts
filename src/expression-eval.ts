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
    ExpressionArg,
    ResponseItem,
    SurveyItem
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
    ): any {
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
            case 'isDefined':
                return this.isDefined(expression);
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

    private isDefined(exp: Expression): boolean {
        if (!Array.isArray(exp.data) || exp.data.length !== 1) {
            console.warn('lte: data attribute is missing or wrong: ' + exp.data);
            return false;
        }
        const arg1 = expressionArgParser(exp.data[0]);
        if (!isExpression(arg1)) {
            return arg1;
        }

        const value = this.evalExpression(arg1);
        return value !== null && value !== undefined;
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
        if (attributeRef.returnType) {
            return this.typeConvert(attr, attributeRef.returnType);
        }
        return attr;
    }

    private getArrayItem(itemRef: Expression): any {
        if (!Array.isArray(itemRef.data) || itemRef.data.length !== 2) {
            console.warn('getArrayItem: data attribute is missing or wrong: ' + itemRef.data);
            return null;
        }
        const arg1 = expressionArgParser(itemRef.data[0]);
        const arg2 = expressionArgParser(itemRef.data[1]);
        if (!isExpression(arg1)) {
            console.warn('first argument is not a valid expression');
            return null;
        }
        if (typeof (arg2) !== 'number') {
            console.warn('second argument is not a valid number', arg2);
            return null;
        }

        const arr = this.evalExpression(arg1);
        if (!arr || !Array.isArray(arr)) {
            console.warn('getArrayItem: received wrong type for referenced array: ' + arr);
            return null;
        }
        const item = arr[arg2];
        if (itemRef.returnType) {
            return this.typeConvert(item, itemRef.returnType);
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
        if (exp.returnType) {
            return this.typeConvert(item, exp.returnType);
        }
        return item;
    }


    private getObjByHierarchicalKey(exp: Expression): any {
        if (!Array.isArray(exp.data) || exp.data.length !== 2) {
            console.warn('getObjByHierarchicalKey: data attribute is missing or wrong: ' + exp.data);
            return null;
        }

        const arg1 = expressionArgParser(exp.data[0]);
        const key = expressionArgParser(exp.data[1]);
        if (!isExpression(arg1)) {
            console.warn('first argument is not a valid expression');
            return null;
        }
        if (!key || typeof (key) !== 'string') {
            console.warn('second argument is not a valid string');
            return null;
        }

        // find root:
        let root = this.evalExpression(arg1);

        if (!root.items || root.items.length < 1) {
            console.warn('getObjByHierarchicalKey: root is not a group: ' + root);
            return null;
        }

        const ids = key.split('.');
        let obj: SurveyItem | SurveyItemResponse | ResponseItem | RenderedQuestionGroup | RenderedQuestion | undefined;
        let compID = '';


        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];

            if (!obj) {
                if (root.key !== id) {
                    console.warn('getObjByHierarchicalKey: cannot find root object for: ' + id);
                    return;
                }
                obj = root;
                compID += id;
                continue;
            }

            compID += '.' + id;
            const ind = (obj as { items: any[] }).items.findIndex(item => item.key === compID);
            if (ind < 0) {
                console.warn('getObjByHierarchicalKey: cannot find object for : ' + compID);
                return null;
            }
            obj = (obj as { items: any[] }).items[ind];
        }

        if (exp.returnType) {
            return this.typeConvert(obj, exp.returnType);
        }
        return obj;
    }


    private typeConvert(value: any, dtype: string): any {
        switch (dtype) {
            case 'int':
                return typeof (value) === 'string' ? parseInt(value) : Math.floor(value);
            case 'float':
                return typeof (value) === 'string' ? parseFloat(value) : value;
            default:
                console.warn('typeConvert: dtype is not known: ' + dtype);
                return value;
        }
    }

}

const expressionArgParser = (arg: ExpressionArg): any => {
    switch (arg.dtype) {
        case 'num':
            return arg.num;
        case 'str':
            return arg.str;
        case 'exp':
            return arg.exp;
        default:
            console.warn('expression arg could not be parsed', arg);
            return undefined;
    }
}