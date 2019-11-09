import { RenderedQuestionGroup, SurveyContext, SurveyResponse, Expression } from "./data_types";

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
}