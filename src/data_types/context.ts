import { SurveyResponse } from "./response";

export interface SurveyContext {
    previousResponses?: Array<SurveyResponse>;
    profile?: any; // TODO: define
    mode?: string;
    // TODO: have geolocation and other attributes
}