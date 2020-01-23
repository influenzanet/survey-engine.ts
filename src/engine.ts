import {
    SurveyEngineCoreInterface,
    RenderedQuestionGroup,
    SurveyContext,
    TimestampType,
    RenderedQuestion,
    isRenderedQuestionGroup,
    Expression,
    SurveyItemResponse,
    isSurveyGroupItemResponse,
    SurveyGroupItem,
    SurveyGroupItemResponse,
    SurveyItem,
    isSurveyGroupItem,
    SurveySingleItemResponse,
    ResponseItem,
} from "./data_types";
import {
    removeItemByKey
} from './utils';
import { ExpressionEval } from "./expression-eval";
import { SelectionMethod } from "./selection-method";

export const printResponses = (responses: SurveyItemResponse, prefix: string) => {
    console.log(prefix + responses.key);
    console.log(prefix + responses.meta);
    if (isSurveyGroupItemResponse(responses)) {
        responses.items.forEach(i => {
            printResponses(i, prefix + '\t');
        })
    } else {
        console.log(prefix + responses.response);
    }

}

export const printSurveyItem = (surveyItem: SurveyItem, prefix: string) => {
    console.log(prefix + surveyItem.key);
    if (isSurveyGroupItem(surveyItem)) {
        surveyItem.items.forEach(i => {
            printSurveyItem(i, prefix + '\t');
        })
    }
}

export class SurveyEngineCore implements SurveyEngineCoreInterface {
    private surveyDef: SurveyGroupItem;
    private renderedSurvey: RenderedQuestionGroup;
    private responses: SurveyGroupItemResponse;
    private context: SurveyContext;

    private evalEngine: ExpressionEval;

    constructor(
        definitions: SurveyGroupItem,
        context?: SurveyContext
    ) {
        console.log('core engine')
        this.evalEngine = new ExpressionEval();

        this.surveyDef = definitions;
        this.context = context ? context : {};
        this.responses = this.initResponseObject(this.surveyDef);
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

    setResponse(targetKey: string, response: ResponseItem) {
        const target = this.findResponseItem(targetKey);
        if (!target) {
            console.error('setResponse: cannot find target object for key: ' + targetKey);
            return;
        }
        if (isSurveyGroupItemResponse(target)) {
            console.error('setResponse: object is a response group - not defined: ' + targetKey);
            return;
        }
        target.response = response;
        this.setTimestampFor('responded', targetKey);

        // Re-render whole tree
        this.reRenderGroup(this.renderedSurvey.key);
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

    getResponses(): SurveyGroupItemResponse {
        console.warn('todo - get current index for each question, and do final checkings');
        return {
            ...this.responses,
        };
    }

    // INIT METHODS
    private initResponseObject(qGroup: SurveyGroupItem): SurveyGroupItemResponse {
        const respGroup: SurveyGroupItemResponse = {
            key: qGroup.key,
            meta: {
                rendered: [],
                displayed: [],
                responded: [],
                position: -1,
                localeCode: '',
                version: qGroup.version,
            },
            items: [],
        };

        qGroup.items.forEach(item => {
            if (isSurveyGroupItem(item)) {
                respGroup.items.push(this.initResponseObject(item));
            } else {
                const itemResp: SurveySingleItemResponse = {
                    key: item.key,
                    meta: {
                        rendered: [],
                        displayed: [],
                        responded: [],
                        position: -1,
                        localeCode: '',
                        version: item.version,
                    },
                    response: undefined,
                };
                respGroup.items.push(itemResp);
            }
        });

        return respGroup;
    }


    private initRenderedGroup(groupDef: SurveyGroupItem, parentKey: string) {
        const parent = this.findRenderedItem(parentKey);
        if (!parent || !isRenderedQuestionGroup(parent)) {
            console.warn('initRenderedGroup: parent not found or not a group: ' + parentKey);
            return;
        }

        let nextItem = this.getNextItem(groupDef, parent, parent.key, false);
        while (nextItem !== null) {
            if (!nextItem) {
                break;
            }
            this.addRenderedItem(nextItem, parent);
            if (isSurveyGroupItem(nextItem)) {
                this.initRenderedGroup(nextItem, nextItem.key);
            }
            nextItem = this.getNextItem(groupDef, parent, nextItem.key, false);
        }
    }

    private reRenderGroup(groupKey: string) {
        const renderedGroup = this.findRenderedItem(groupKey);
        if (!renderedGroup || !isRenderedQuestionGroup(renderedGroup)) {
            console.warn('reRenderGroup: renderedGroup not found or not a group: ' + groupKey);
            return;
        }
        const groupDef = this.findSurveyDefItem(groupKey);
        if (!groupDef || !isSurveyGroupItem(groupDef)) {
            console.warn('reRenderGroup: groupDef not found or not a group: ' + groupKey);
            return;
        }

        // Add items to the front
        let currentIndex = 0;
        let nextItem = this.getNextItem(groupDef, renderedGroup, renderedGroup.key, true);
        while (nextItem !== null) {
            if (!nextItem) {
                break;
            }
            this.addRenderedItem(nextItem, renderedGroup, currentIndex);
            if (isSurveyGroupItem(nextItem)) {
                this.initRenderedGroup(nextItem, nextItem.key);
            }
            currentIndex += 1;
            nextItem = this.getNextItem(groupDef, renderedGroup, nextItem.key, true);
        }

        renderedGroup.items.forEach(
            item => {
                const itemDef = this.findSurveyDefItem(item.key);
                // Remove item if condition not true
                if (!itemDef || !this.evalConditions(itemDef.condition)) {
                    renderedGroup.items = removeItemByKey(renderedGroup.items, item.key);
                    console.log('removed item: ' + item.key);
                    return;
                }

                // Re-Render groups recursively
                if (isRenderedQuestionGroup(item)) {
                    this.reRenderGroup(item.key);
                }

                // Add direct follow ups
                currentIndex = renderedGroup.items.findIndex(ci => ci.key === item.key);
                if (currentIndex < 0) {
                    console.warn('reRenderGroup: index to insert items not found');
                    return;
                }
                let nextItem = this.getNextItem(groupDef, renderedGroup, item.key, true);
                while (nextItem !== null) {
                    if (!nextItem) {
                        break;
                    }
                    currentIndex += 1;
                    this.addRenderedItem(nextItem, renderedGroup, currentIndex);
                    if (isSurveyGroupItem(nextItem)) {
                        this.initRenderedGroup(nextItem, nextItem.key);
                    }
                    nextItem = this.getNextItem(groupDef, renderedGroup, nextItem.key, true);
                }
            });

        // Add items at the end if any
        const lastItem = renderedGroup.items[renderedGroup.items.length - 1];
        nextItem = this.getNextItem(groupDef, renderedGroup, lastItem.key, false);
        while (nextItem !== null) {
            if (!nextItem) {
                break;
            }
            this.addRenderedItem(nextItem, renderedGroup);
            if (isSurveyGroupItem(nextItem)) {
                this.initRenderedGroup(nextItem, nextItem.key);
            }
            nextItem = this.getNextItem(groupDef, renderedGroup, nextItem.key, true);
        }
    }

    private getNextItem(groupDef: SurveyGroupItem, parent: RenderedQuestionGroup, lastKey: string, onlyDirectFollower: boolean): SurveyItem | undefined {
        // get unrendered question groups only
        const availableItems = groupDef.items.filter(ai => {
            return !parent.items.some(item => item.key === ai.key) && this.evalConditions(ai.condition);
        });

        if ((!lastKey || lastKey.length <= 0) && onlyDirectFollower) {
            console.warn('getNextItem: missing input argument for lastKey');
            return;
        }
        const followUpItems = availableItems.filter(item => item.follows && item.follows.includes(lastKey));


        if (followUpItems.length > 0) {
            return SelectionMethod.pickAnItem(followUpItems, groupDef.selectionMethod);
        } else if (onlyDirectFollower) {
            return;
        }

        const groupPool = availableItems.filter(item => !item.follows || item.follows.length < 1);
        if (groupPool.length < 1) {
            return;
        }
        return SelectionMethod.pickAnItem(groupPool, groupDef.selectionMethod);
    }

    private addRenderedItem(item: SurveyItem, parent: RenderedQuestionGroup, atPosition?: number): number {
        const renderedItem: RenderedQuestionGroup | RenderedQuestion = {
            ...item
        };
        // TODO: item to rendered question
        console.warn('addRenderedItem: convert to rendered item (e.g. select localisation');
        if (isSurveyGroupItem(item)) {
            (renderedItem as RenderedQuestionGroup).items = [];
        }

        if (!atPosition) {
            parent.items.push(renderedItem);
            this.setTimestampFor('rendered', renderedItem.key);
            return parent.items.length - 1;
        }
        parent.items.splice(atPosition, 0, renderedItem);
        this.setTimestampFor('rendered', renderedItem.key);
        return atPosition;
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

    findSurveyDefItem(itemID: string): SurveyItem | undefined {
        const ids = itemID.split('.');
        let obj: SurveyItem | undefined;
        let compID = '';
        ids.forEach(id => {
            if (compID === '') {
                compID = id;
            } else {
                compID += '.' + id;
            }
            if (!obj) {
                if (compID === this.surveyDef.key) {
                    obj = this.surveyDef;
                }
                return;
            }
            if (!isSurveyGroupItem(obj)) {
                return;
            }
            const ind = obj.items.findIndex(item => item.key === compID);
            if (ind < 0) {
                console.warn('findSurveyDefItem: cannot find object for : ' + compID);
                obj = undefined;
                return;
            }
            obj = obj.items[ind];

        });
        return obj;
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

    findResponseItem(itemID: string): SurveyItemResponse | undefined {
        const ids = itemID.split('.');
        let obj: SurveyItemResponse | undefined;
        let compID = '';
        ids.forEach(id => {
            if (compID === '') {
                compID = id;
            } else {
                compID += '.' + id;
            }
            if (!obj) {
                if (compID === this.responses.key) {
                    obj = this.responses;
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

    evalConditions(condition?: Expression): boolean {
        return this.evalEngine.eval(
            condition,
            this.renderedSurvey,
            this.context,
            this.responses
        );
    }

}