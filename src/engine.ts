import {
    SurveyEngineCoreInterface,
    QuestionGroup,
    RenderedQuestionGroup,
    SurveyContext,
    SurveyResponse,
    ResponseGroup,
    isQuestionGroup,
    TimestampType,
    QResponse,
    isResponseGroup
} from "./data_types";
import { ExpressionEval } from "./expression-eval";

export const printResponses = (responses: ResponseGroup | QResponse, prefix: string) => {
    console.log(prefix + responses.key);
    console.log(prefix + responses.meta);
    if (isResponseGroup(responses)) {
        responses.items.forEach(i => {
            printResponses(i, prefix + '\t');
        })
    }
}

export class SurveyEngineCore implements SurveyEngineCoreInterface {
    private surveyDef: QuestionGroup;
    private renderedSurvey: RenderedQuestionGroup;
    private responses: SurveyResponse;
    private context: SurveyContext;

    private evalEngine: ExpressionEval;

    constructor(
        definitions: QuestionGroup,
        reporter: string,
        profileID: string,
        context?: SurveyContext
    ) {
        console.log('core engine')
        this.evalEngine = new ExpressionEval();

        this.surveyDef = definitions;
        this.context = context ? context : {};
        this.responses = this.createResponseContainer(reporter, profileID);
        this.renderedSurvey = {
            key: definitions.key,
            items: []
        };
        this.initRenderedSurvey();
    }

    // PUBLIC METHODS
    setContext(context: SurveyContext) {
        this.context = context;
    }

    setResponse(response: any) {
        this.setTimestampFor('responded', response.key);
        console.warn('todo');
    }

    getRenderedSurvey(): RenderedQuestionGroup {
        return {
            ...this.renderedSurvey,
            items: this.renderedSurvey.items.slice()
        };
    };

    questionDisplayed(questionID: string) {
        console.warn('todo');
    }

    getResponses(): SurveyResponse {
        console.warn('todo - get current index for each question, and do final checkings');
        return {
            ...this.responses,
        };
    }

    // INIT METHODS
    private initResponseObject(qGroup: RenderedQuestionGroup): ResponseGroup {
        const respGroup: ResponseGroup = {
            key: qGroup.key,
            meta: {
                rendered: [],
                displayed: [],
                responded: [],
                position: -1
            },
            items: [],
        };

        qGroup.items.forEach(item => {
            if (isQuestionGroup(item)) {
                respGroup.items.push(this.initResponseObject(item));
            } else {
                respGroup.items.push({
                    key: item.key,
                    meta: {
                        rendered: [],
                        displayed: [],
                        responded: [],
                        position: -1
                    },
                })
            }
        });

        return respGroup;
    }

    private createResponseContainer(reporter: string, profileID: string): SurveyResponse {
        const resp: SurveyResponse = {
            reporter: reporter,
            for: profileID,
            responses: this.initResponseObject(this.surveyDef),
        }
        return resp;
    }

    private initRenderedSurvey() {
        console.warn('todo');
    }

    private setTimestampFor(type: TimestampType, itemID: string) {
        const obj = this.findResponseItem(itemID);
        if (!obj) {
            return;
        }

        switch (type) {
            case 'rendered':
                obj.meta.rendered.push(Date.now());
                break;
            case 'displayed':
                obj.meta.displayed.push(Date.now());
                break;
            case 'responded':
                obj.meta.responded.push(Date.now());
                break;
        }
    }

    findResponseItem(itemID: string): QResponse | ResponseGroup | undefined {
        const ids = itemID.split('.');
        let obj: ResponseGroup | QResponse | undefined;
        let compID = ''
        ids.forEach(id => {
            if (!obj) {
                if (!isResponseGroup(this.responses.responses)) {
                    console.warn('findResponseItem: root should be a group but is not');
                    return null;
                }
                const ind = this.responses.responses.items.findIndex(item => item.key === id);
                if (ind < 0) {
                    console.warn('findResponseItem: cannot find root object for: ' + id);
                    return null;
                }
                obj = this.responses.responses.items[ind];
                compID += id;
                return null;
            }
            if (!isResponseGroup(obj)) {
                console.warn('findResponseItem: this should be a group but is not: ' + obj.key);
                return null;
            }
            compID += '.' + id;
            const ind = obj.items.findIndex(item => item.key === compID);
            if (ind < 0) {
                console.warn('findResponseItem: cannot find object for : ' + compID);
                return null;
            }
            obj = obj.items[ind];
        });
        return obj;
    }

}