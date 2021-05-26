export type SelectionMethodNames = 'sequential' | 'uniform' | 'highestPriority' | 'exponential';
export type StudyActionNames =
    'IF' | 'DO' |
    'IFTHEN' | 'UPDATE_STUDY_STATUS' | 'UPDATE_FLAG' | 'REMOVE_FLAG' | 'ADD_NEW_SURVEY' | 'REMOVE_ALL_SURVEYS' | 'REMOVE_SURVEY_BY_KEY' | 'REMOVE_SURVEYS_BY_KEY' | 'ADD_REPORT' | 'REMOVE_ALL_REPORTS' | 'REMOVE_REPORT_BY_KEY' | 'REMOVE_REPORTS_BY_KEY';
export type SurveyContextRuleNames = 'LAST_RESPONSES_BY_KEY' | 'ALL_RESPONSES_SINCE' | 'RESPONSES_SINCE_BY_KEY';
export type SurveyPrefillRuleNames = 'GET_LAST_SURVEY_ITEM';

export type StudyEngineExpNames =
    'checkEventType' |
    // Response checkers:
    'checkConditionForOldResponses' |
    'checkSurveyResponseKey' | 'responseHasKeysAny' | 'getResponseValueAsNum' | 'getResponseValueAsStr' | 'countResponseItems' |
    // Participant state:
    'getStudyEntryTime' | 'hasSurveyKeyAssigned' | 'getSurveyKeyAssignedFrom' | 'getSurveyKeyAssignedUntil' |
    'hasStudyStatus' | 'lastSubmissionDateOlderThan' | 'hasParticipantFlag' |
    // Logical:
    'eq' | 'lt' | 'lte' | 'gt' | 'gte' | 'or' | 'and' | 'not' |
    // Other:
    'timestampWithOffset';

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
    // client side shortcut methods:
    'hasResponse' | 'getResponseItem' | 'getResponseValueAsNum' | 'getResponseValueAsStr' | 'checkResponseValueWithRegex' | 'responseHasKeysAny' | 'responseHasKeysAll' | 'responseHasOnlyKeysOtherThan' | 'getSurveyItemValidation' |
    'timestampWithOffset' | 'dateResponseDiffFromNow' | 'countResponseItems';

export type ExpressionName =
    ClientSideSurveyExpName |
    SelectionMethodNames |
    SurveyContextRuleNames |
    SurveyPrefillRuleNames |
    StudyEngineExpNames |
    StudyActionNames;

export interface Expression {
    name: ExpressionName;
    returnType?: string;
    data?: ExpressionArg[];
}

export const isExpression = (value: Expression | any): value is Expression => {
    return typeof (value) === 'object' && (value as Expression).name !== undefined && (value as Expression).name.length > 0;
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
            return arg.num;
        case 'str':
            return arg.str;
        case 'exp':
            return arg.exp;
        default:
            return arg.str;
    }
}