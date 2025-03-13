export type SelectionMethodNames = 'sequential' | 'uniform' | 'highestPriority' | 'exponential';
export type SurveyContextRuleNames = 'LAST_RESPONSES_BY_KEY' | 'ALL_RESPONSES_SINCE' | 'RESPONSES_SINCE_BY_KEY';
export type SurveyPrefillRuleNames = 'GET_LAST_SURVEY_ITEM';


export type ClientSideSurveyExpName =
  // logic expression:
  'or' | 'and' | 'not' |
  // comparision methods:
  'eq' | 'lt' | 'lte' | 'gt' | 'gte' |
  'isDefined' |
  // client reference methods:
  'getContext' | 'getResponses' | 'getRenderedItems' |
  // client side object access methods:
  'getAttribute' | 'getArrayItemAtIndex' | 'getArrayItemByKey' | 'getObjByHierarchicalKey' | 'getNestedObjectByKey' |
  // query methods for previous names:
  'findPreviousSurveyResponsesByKey' | 'getLastFromSurveyResponses' | 'getPreviousResponses' | 'filterResponsesByIncludesKeys' | 'filterResponsesByValue' | 'getLastFromSurveyItemResponses' |
  'getSecondsSince' |
  'parseValueAsNum' |
  // client side shortcut methods:
  'hasResponse' | 'getResponseItem' | 'getResponseValueAsNum' | 'getResponseValueAsStr' | 'checkResponseValueWithRegex' | 'responseHasKeysAny' | 'responseHasKeysAll' | 'responseHasOnlyKeysOtherThan' | 'getSurveyItemValidation' |
  'timestampWithOffset' | 'dateResponseDiffFromNow' | 'countResponseItems' |
  'hasParticipantFlagKey' | 'hasParticipantFlagKeyAndValue' | 'getParticipantFlagValue'
  | 'validateSelectedOptionHasValueDefined';


type StudyEngineExpNames = string;

export type ExpressionName =
  ClientSideSurveyExpName |
  SelectionMethodNames |
  SurveyContextRuleNames |
  SurveyPrefillRuleNames |
  StudyEngineExpNames;

export interface Expression {
  name: ExpressionName;
  returnType?: string;
  data?: ExpressionArg[];
}

export const isExpression = (value: Expression | any): value is Expression => {
  return value !== undefined && typeof (value) === 'object' && (value as Expression).name !== undefined && (value as Expression).name.length > 0;
}

export type ExpressionArgDType = 'exp' | 'num' | 'str';

export interface ExpressionArg {
  dtype?: ExpressionArgDType; // should default to str;
  exp?: Expression;
  str?: string;
  num?: number;
}

export const expressionArgParser = (arg: ExpressionArg): any => {
  switch (arg.dtype) {
    case 'num':
      if (arg.num === undefined) {
        return 0;
      }
      return arg.num;
    case 'str':
      if (arg.str === undefined) {
        return '';
      }
      return arg.str;
    case 'exp':
      return arg.exp;
    default:
      return arg.str;
  }
}
