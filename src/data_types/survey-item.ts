import { Expression } from './expression';
import { ItemComponent } from './survey-item-component';


interface SurveyItemBase {
    key: string;
    version: number;
    versionTags?: Array<string>;
    follows?: Array<string>;
    condition?: Expression;
    priority?: number; // can be used to sort items in the list
}

export type SurveyItem = SurveyGroupItem | SurveySingleItem;

// ----------------------------------------------------------------------
export interface SurveyGroupItem extends SurveyItemBase {
    items: Array<SurveyItem>;
    selectionMethod?: Expression; // what method to use to pick next item if ambigous - default uniform random
}

export const isSurveyGroupItem = (item: SurveyItem): item is SurveyGroupItem => {
    const items = (item as SurveyGroupItem).items;
    return items !== undefined && items.length > 0;
}

// ----------------------------------------------------------------------
// Single Survey Items: (Questions, Titles etc.)
export type SurveyItemTypes =
    'basic.static.title' |
    'basic.static.description' |
    'basic.input.numeric' |
    'basic.input.single-choice' |
    'basic.input.multiple-choice' |
    'concepts.v1.age.simple-age'
    ;

export interface SurveySingleItem extends SurveyItemBase {
    type?: SurveyItemTypes;
    components: Array<ItemComponent>; // any sub-type of ItemComponent
    validations: Array<Validation>;
}

export interface Validation {
    key: string;
    type: string; // hard or softvalidation
    rule: Expression | boolean;
}
