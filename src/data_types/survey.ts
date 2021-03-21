import { LocalizedObject, SurveyGroupItem } from ".";
import { Expression } from "./expression";
import { SurveyContextDef } from "./context";

export interface Survey {
    id?: string;
    props?: SurveyProps;
    current: SurveyVersion;
    history?: SurveyVersion[];
    prefillRules?: Expression[];
    contextRules?: SurveyContextDef;
    maxItemsPerPage?: { large: number, small: number };
}

export interface SurveyVersion {
    versionId: string;
    surveyDefinition: SurveyGroupItem;
    published?: number;
    unpublished?: number;
}

export interface SurveyProps {
    name?: LocalizedObject[];
    description?: LocalizedObject[];
    typicalDuration?: LocalizedObject[];
}