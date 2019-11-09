import {
    RenderedQuestionGroup,
    SurveyContext,
    SurveyResponse,
    Expression,
    isExpression
} from "./data_types";


export class ExpressionEval {
    renderedSurvey?: RenderedQuestionGroup;
    context?: SurveyContext;
    responses?: SurveyResponse;

    public eval(
        expression?: Expression,
        renderedSurvey?: RenderedQuestionGroup,
        context?: SurveyContext,
        responses?: SurveyResponse
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
                return this.getResponse(expression);
            case 'getRenderedItems':
                console.warn('getRenderedItems not implemented');
                return;
            case 'getAttribute':
                return this.getAttribute(expression);
            case 'getArrayItemAtIndex':
                return this.getArrayItem(expression);
            case 'getArrayItemByKey':
                console.warn('getArrayItemByKey not implemented');
                return;
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
        return exp.data.some((value) => isExpression(value) ? this.evalExpression(value) : value);
    }

    private and(exp: Expression): boolean {
        if (!Array.isArray(exp.data)) {
            console.warn('and: data attribute is missing or wrong: ' + exp.data);
            return false;
        }
        return exp.data.every((value) => isExpression(value) ? this.evalExpression(value) : value);
    }

    private not(exp: Expression): boolean {
        if (!exp.data || !isExpression(exp)) {
            console.warn('not: method expects a sinlge Expression as an argument ');
            return false;
        }
        return !this.evalExpression(exp.data as Expression);
    }

    // ---------- COMPARISONS ----------------
    private eq(exp: Expression): boolean {
        if (!Array.isArray(exp.data)) {
            console.warn('eq: data attribute is missing or wrong: ' + exp.data);
            return false;
        }
        let values = [];
        for (let ind = 0; ind < exp.data.length; ind++) {
            const val = exp.data[ind];
            if (isExpression(val)) {
                values.push(this.evalExpression(val));
            } else {
                values.push(val);
            }

        }

        // check if all values are equal
        return values.every((val, i, arr) => val === arr[0]);
    }

    private gt(exp: Expression): boolean {
        if (!Array.isArray(exp.data) || exp.data.length !== 2) {
            console.warn('gt: data attribute is missing or wrong: ' + exp.data);
            return false;
        }

        const a = isExpression(exp.data[0]) ?
            this.evalExpression(exp.data[0]) : exp.data[0];
        const b = isExpression(exp.data[1]) ?
            this.evalExpression(exp.data[1]) : exp.data[1];
        return a > b;
    }

    private gte(exp: Expression): boolean {
        if (!Array.isArray(exp.data) || exp.data.length !== 2) {
            console.warn('gte: data attribute is missing or wrong: ' + exp.data);
            return false;
        }

        const a = isExpression(exp.data[0]) ?
            this.evalExpression(exp.data[0]) : exp.data[0];
        const b = isExpression(exp.data[1]) ?
            this.evalExpression(exp.data[1]) : exp.data[1];
        return a >= b;
    }

    private lt(exp: Expression): boolean {
        if (!Array.isArray(exp.data) || exp.data.length !== 2) {
            console.warn('lt: data attribute is missing or wrong: ' + exp.data);
            return false;
        }

        const a = isExpression(exp.data[0]) ?
            this.evalExpression(exp.data[0]) : exp.data[0];
        const b = isExpression(exp.data[1]) ?
            this.evalExpression(exp.data[1]) : exp.data[1];
        return a < b;
    }

    private lte(exp: Expression): boolean {
        if (!Array.isArray(exp.data) || exp.data.length !== 2) {
            console.warn('lte: data attribute is missing or wrong: ' + exp.data);
            return false;
        }

        const a = isExpression(exp.data[0]) ?
            this.evalExpression(exp.data[0]) : exp.data[0];
        const b = isExpression(exp.data[1]) ?
            this.evalExpression(exp.data[1]) : exp.data[1];
        return a <= b;
    }


}