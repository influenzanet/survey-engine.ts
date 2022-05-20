import { SurveyResponse } from "./response";
import { ExpressionArg, Expression } from "./expression";

export interface SurveyContext {
  previousResponses?: Array<SurveyResponse>;
  profile?: any; // TODO: define
  mode?: string;
  isLoggedIn?: boolean;
  participantFlags?: any; // string key value pairs
  // TODO: have geolocation and other attributes
}

export interface SurveyContextDef {
  mode?: ExpressionArg;
  previousResponses?: Expression[];
}
