import { Expression } from './expression';
import { ItemGroupComponent } from './survey-item-component';


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
// Single Survey Items:
export type SurveyItemTypes =
  'pageBreak' | 'test' | 'surveyEnd'
  ;

export interface SurveySingleItem extends SurveyItemBase {
  type?: SurveyItemTypes;
  components?: ItemGroupComponent; // any sub-type of ItemComponent
  validations?: Array<Validation>;
  confidentialMode?: ConfidentialMode;
}

export interface Validation {
  key: string;
  type: 'soft' | 'hard'; // hard or softvalidation
  rule: Expression | boolean;
}

export type ConfidentialMode = 'add' | 'replace';
