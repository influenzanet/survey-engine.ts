import { SurveyItemGroupResponse } from "./response";

export interface SurveyContext {
    previousResponses?: Array<SurveyItemGroupResponse>;
    profile?: any; // TODO: define
    mode?: string;
    // TODO: have geolocation and other attributes
}