import { LocalizedObject, SurveyGroupItem } from ".";

export interface Survey {
    id?: string;
    name?: LocalizedObject[];
    description?: LocalizedObject[];
    current: SurveyVersion;
    history?: SurveyVersion[];
    maxItemsPerPage?: { large: number, small: number };
}

export interface SurveyVersion {
    surveyDefinition: SurveyGroupItem;
    published?: number;
    unpublished?: number;
}