import { SurveyGroupItemResponse } from "./response";

export interface SurveyContext {
    previousResponses?: Array<SurveyGroupItemResponse>;
    profile?: any; // TODO: define
    mode?: string;
    // TODO: have geolocation and other attributes
}