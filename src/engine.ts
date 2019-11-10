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
    isResponseGroup,
    RenderedQuestion,
    isRenderedQuestionGroup
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
        this.setTimestampFor('rendered', definitions.key);
        this.initRenderedGroup(definitions, definitions.key);
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

    private initRenderedGroup(groupDef: QuestionGroup, parentKey: string) {
        const parent = this.findRenderedItem(parentKey);
        if (!parent || !isRenderedQuestionGroup(parent)) {
            console.warn('initRenderedGroup: parent not found or not a group: ' + parentKey);
            return;
        }
        console.log(parent);

        // TODO: add logic with follows and conditions

        groupDef.items.forEach(item => {

            if (isQuestionGroup(item)) {
                // TODO: setTimestamp for rendered
                // TODO :
                // add item to parent
                const newGroup: RenderedQuestionGroup = {
                    key: item.key,
                    items: []
                };
                parent.items.push(newGroup);
                // TODO: add method to insert or push to array
                this.setTimestampFor('rendered', item.key);
                this.initRenderedGroup(item, item.key);

            } else {
                // add item to parent
                parent.items.push(item);
                this.setTimestampFor('rendered', item.key);
            }
        });
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

    findRenderedItem(itemID: string): RenderedQuestion | RenderedQuestionGroup | undefined {
        const ids = itemID.split('.');
        let obj: RenderedQuestion | RenderedQuestionGroup | undefined;
        let compID = '';
        ids.forEach(id => {
            if (compID === '') {
                compID = id;
            } else {
                compID += '.' + id;
            }
            if (!obj) {
                if (compID === this.renderedSurvey.key) {
                    obj = this.renderedSurvey;
                }
                return;
            }
            if (!isRenderedQuestionGroup(obj)) {
                return;
            }
            const ind = obj.items.findIndex(item => item.key === compID);
            if (ind < 0) {
                console.warn('findRenderedItem: cannot find object for : ' + compID);
                obj = undefined;
                return;
            }
            obj = obj.items[ind];

        });
        return obj;
    }

    findResponseItem(itemID: string): QResponse | ResponseGroup | undefined {
        const ids = itemID.split('.');
        let obj: QResponse | ResponseGroup | undefined;
        let compID = '';
        ids.forEach(id => {
            if (compID === '') {
                compID = id;
            } else {
                compID += '.' + id;
            }
            if (!obj) {
                if (compID === this.responses.responses.key) {
                    obj = this.responses.responses;
                }
                return;
            }
            if (!isRenderedQuestionGroup(obj)) {
                return;
            }
            const ind = obj.items.findIndex(item => item.key === compID);
            if (ind < 0) {
                console.warn('findResponseItem: cannot find object for : ' + compID);
                obj = undefined;
                return;
            }
            obj = obj.items[ind];

        });
        return obj;
    }

}