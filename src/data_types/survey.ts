import { LocalizedObject, SurveyGroupItem } from ".";
import { Expression } from "./expression";
import { SurveyContextDef } from "./context";

export interface Survey {
    id?: string;
    name?: LocalizedObject[];
    description?: LocalizedObject[];
    current: SurveyVersion;
    history?: SurveyVersion[];
    prefillRules?: Expression[];
    contextRules?: SurveyContextDef;
    maxItemsPerPage?: { large: number, small: number };
}

export interface SurveyVersion {
    surveyDefinition: SurveyGroupItem;
    published?: number;
    unpublished?: number;
}