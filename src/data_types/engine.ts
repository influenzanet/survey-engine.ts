import { SurveySingleItemResponse } from "./response";
import { SurveyContext } from "./context";
import { SurveyGroupItem, SurveySingleItem } from "./survey-item";

export type ScreenSize = "small" | "large";

export interface SurveyEngineCoreInterface {
    setContext: (context: SurveyContext) => void;
    setResponse: (targetKey: string, response: any) => void;

    getRenderedSurvey: () => SurveyGroupItem;
    getSurveyPages: (size?: ScreenSize) => SurveySingleItem[][]
    questionDisplayed: (questionID: string) => void; // should be called by the client when displaying a question

    getResponses: () => SurveySingleItemResponse[];
}
