export interface Expression {
    name: string;
    data?: any;
    dtype?: string;
}

export interface Validation {
    key: string;
    type: string; // hard or softvalidation
    rule: Expression;
}

export const isExpression = (value: Expression | any): value is Expression => {
    return typeof (value) === 'object' && (value as Expression).name !== undefined;
}

export interface SurveyItem {
    key: string;
    version: number;
    versionTags: Array<string>;
    follows?: Array<string>;
    condition?: Expression;
    priority?: number; // can be used to sort items in the list
}

export interface QuestionGroup extends SurveyItem {
    // TODO: define group related properties
    items: Array<QuestionGroup | Question>;
    selectionMethod?: Expression; // what method to use to pick next item if ambigous - default uniform random
}

export const isQuestionGroup = (item: QuestionGroup | Question): item is QuestionGroup => {
    return (item as QuestionGroup).items !== undefined;
}

export type QuestionTypes =
    'basic.static.title' |
    'basic.static.description' |
    'basic.input.numeric' |
    'basic.input.single-choice' |
    'basic.input.multiple-choice' |
    'concepts.v1.age.simple-age'
    ;

export interface Question extends SurveyItem {
    type: QuestionTypes;
    components: Array<any>; // any sub-type of QComponent
    mandatory?: boolean; // only relevant if rendered
}

export interface QComponent {
    key: string; // unique identifier
    role: string; // purpose of the component
    content?: Array<any>; // array with item that are a sub-type of LocalizedObject
    displayCondition?: Expression;
}

export interface LocalizedObject {
    code: string;
}

export interface LocalizedMedia extends LocalizedObject {
    // TODO: define common properties
    // TODO: define image object
    // TODO: define video object
    // TODO: define audio object
}

export interface LocalizedString extends LocalizedObject {
    parts: Array<string | Expression>; // in case of an expression it should return a string
}

export interface ResponseOptionItem extends QComponent {
    key: string;
    validations: Array<Validation>;
    disabled?: Expression;
}

export interface ResponseOption extends ResponseOptionItem {
    dtype: string;
    // TODO: define properties of an response item
}

export type OptionOrderTypes = 'sequential' | 'random';

export interface ResponseOptionGroup extends ResponseOptionItem {
    items: Array<ResponseOptionGroup | ResponseOption>;
    order: OptionOrderTypes;
}

export const isResponseOptionGroup = (item: ResponseOptionGroup | ResponseOption): item is ResponseOptionGroup => {
    return (item as ResponseOptionGroup).items !== undefined;
}