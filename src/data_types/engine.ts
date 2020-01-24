import { SurveyGroupItemResponse } from "./response";
import { SurveyContext } from "./context";
import { SurveyGroupItem } from "./survey-item";


export interface SurveyEngineCoreInterface {
    setContext: (context: SurveyContext) => void;
    setResponse: (targetKey: string, response: any) => void;

    getRenderedSurvey: () => SurveyGroupItem;
    questionDisplayed: (questionID: string) => void; // should be called by the client when displaying a question

    getResponses: () => SurveyGroupItemResponse;
}
