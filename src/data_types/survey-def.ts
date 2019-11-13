export interface Expression {
    name: string;
    data?: any;
    dtype?: string;
}

export const isExpression = (value: Expression | any): value is Expression => {
    return typeof(value) === 'object' && (value as Expression).name !== undefined;
}

export interface SurveyItem {
    key: string;
    follows?: Array<string>;
    condition?: Expression;
    priority?: number; // can be used to sort items in the list
}

export interface Question extends SurveyItem {
    // TODO: define question related properties
}

export interface QuestionGroup extends SurveyItem {
    // TODO: define group related properties
    items: Array<QuestionGroup | Question>;
    selectionMethod?: Expression; // what method to use to pick next item if ambigous - default uniform random
}

export const isQuestionGroup = (item: QuestionGroup | Question): item is QuestionGroup => {
    return (item as QuestionGroup).items !== undefined;
}
