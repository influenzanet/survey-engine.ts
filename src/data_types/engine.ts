import { RenderedQuestionGroup } from "./rendered";
import { SurveyGroupItemResponse } from "./response";
import { SurveyContext } from "./context";


export interface SurveyEngineCoreInterface {
    setContext: (context: SurveyContext) => void;
    setResponse: (targetKey: string, response: any) => void;

    getRenderedSurvey: () => RenderedQuestionGroup;
    questionDisplayed: (questionID: string) => void; // should be called by the client when displaying a question

    getResponses: () => SurveyGroupItemResponse;
}
