import {
  SurveyEngineCoreInterface,
  SurveyContext,
  TimestampType,
  Expression,
  SurveyItemResponse,
  isSurveyGroupItemResponse,
  SurveyGroupItem,
  SurveyGroupItemResponse,
  SurveyItem,
  isSurveyGroupItem,
  SurveySingleItemResponse,
  ResponseItem,
  SurveySingleItem,
  ItemGroupComponent,
  isItemGroupComponent,
  LocalizedString,
  LocalizedObject,
  ComponentProperties,
  ExpressionArg,
  isExpression,
  expressionArgParser,
  Survey,
  ScreenSize,
} from "./data_types";
import {
  removeItemByKey, flattenSurveyItemTree
} from './utils';
import { ExpressionEval } from "./expression-eval";
import { SelectionMethod } from "./selection-method";

const initMeta = {
  rendered: [],
  displayed: [],
  responded: [],
  position: -1,
  localeCode: '',
  version: -1,
}

export class SurveyEngineCore implements SurveyEngineCoreInterface {
  private surveyDef: Survey;
  private renderedSurvey: SurveyGroupItem;
  private responses: SurveyGroupItemResponse;
  private context: SurveyContext;
  private prefills: SurveySingleItemResponse[];
  private openedAt: number;

  private evalEngine: ExpressionEval;
  private showDebugMsg: boolean;

  constructor(
    survey: Survey,
    context?: SurveyContext,
    prefills?: SurveySingleItemResponse[],
    showDebugMsg?: boolean,
  ) {
    // console.log('core engine')
    this.evalEngine = new ExpressionEval();

    this.surveyDef = survey;
    this.context = context ? context : {};
    this.prefills = prefills ? prefills : [];
    this.showDebugMsg = showDebugMsg !== undefined ? showDebugMsg : false;
    this.responses = this.initResponseObject(this.surveyDef.current.surveyDefinition);
    this.renderedSurvey = {
      key: survey.current.surveyDefinition.key,
      version: survey.current.surveyDefinition.version,
      items: []
    };
    this.openedAt = Date.now();
    this.setTimestampFor('rendered', survey.current.surveyDefinition.key);
    this.initRenderedGroup(survey.current.surveyDefinition, survey.current.surveyDefinition.key);
  }

  // PUBLIC METHODS
  setContext(context: SurveyContext) {
    this.context = context;
  }

  setResponse(targetKey: string, response?: ResponseItem) {
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

  getSurveyOpenedAt(): number {
    return this.openedAt;
  }

  getRenderedSurvey(): SurveyGroupItem {
    return {
      ...this.renderedSurvey,
      items: this.renderedSurvey.items.slice()
    };
  };

  getSurveyPages(size?: ScreenSize): SurveySingleItem[][] {
    const renderedSurvey = flattenSurveyItemTree(this.getRenderedSurvey());
    const pages = new Array<SurveySingleItem[]>();

    if (!size) {
      size = 'large';
    }

    let currentPage: SurveySingleItem[] = [];

    renderedSurvey.forEach(item => {
      if (item.type === 'pageBreak') {
        if (currentPage.length > 0) {
          pages.push([...currentPage]);
          currentPage = [];
        }
        return;
      }
      currentPage.push(item);

      if (!this.surveyDef.maxItemsPerPage) {
        return;
      }
      let max = 0;
      switch (size) {
        case 'large':
          max = this.surveyDef.maxItemsPerPage.large;
          break;
        case 'small':
          max = this.surveyDef.maxItemsPerPage.small;
          break
      }

      if (currentPage.length >= max) {
        pages.push([...currentPage]);
        currentPage = [];
      }
    });
    if (currentPage.length > 0) {
      pages.push([...currentPage]);
    }
    return pages;
  }

  questionDisplayed(itemKey: string, localeCode?: string) {
    this.setTimestampFor('displayed', itemKey, localeCode);
  }

  getSurveyEndItem(): SurveySingleItem | undefined {
    const renderedSurvey = flattenSurveyItemTree(this.getRenderedSurvey());
    return renderedSurvey.find(item => item.type === 'surveyEnd');
  }

  getResponses(): SurveySingleItemResponse[] {
    const itemsInOrder = flattenSurveyItemTree(this.renderedSurvey);
    const responses: SurveySingleItemResponse[] = [];
    itemsInOrder.forEach((item, index) => {
      if (item.type === 'pageBreak' || item.type === 'surveyEnd') {
        return;
      }
      const obj = this.findResponseItem(item.key);
      if (!obj) {
        return;
      }
      if (!obj.meta) {
        obj.meta = { ...initMeta };
      }
      if (item.confidentialMode) {
        obj.meta = { ...initMeta }; // reset meta
        (obj as SurveySingleItemResponse).confidentialMode = item.confidentialMode
      }
      obj.meta.position = index;
      responses.push({ ...obj });
    })
    return responses;
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
        if (item.type === 'pageBreak' || item.type === 'surveyEnd') {
          return;
        }
        const prefill = this.prefills.find(ri => ri.key === item.key);

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
          response: prefill ? prefill.response : undefined,
        };
        respGroup.items.push(itemResp);
      }
    });

    return respGroup;
  }

  private sequentialRender(groupDef: SurveyGroupItem, parent: SurveyGroupItem, rerender?: boolean) {
    let currentIndex = 0;
    groupDef.items.forEach(itemDef => {
      const itemCond = this.evalConditions(itemDef.condition);
      const ind = parent.items.findIndex(rItem => rItem.key === itemDef.key);
      if (ind < 0) {
        if (itemCond) {
          if (isSurveyGroupItem(itemDef)) {
            this.addRenderedItem(itemDef, parent, currentIndex);
            this.initRenderedGroup(itemDef, itemDef.key);
          } else {
            this.addRenderedItem(itemDef, parent, currentIndex);
          }
        } else {
          return;
        }
      } else {
        if (!itemCond) {
          parent.items = removeItemByKey(parent.items, itemDef.key);
          return
        }
        if (rerender) {
          if (isSurveyGroupItem(itemDef)) {
            this.reRenderGroup(itemDef.key);
          } else {
            parent.items[ind] = this.renderSingleSurveyItem(itemDef as SurveySingleItem, true);
          }
        }
      }
      currentIndex += 1;
    })
  }

  private initRenderedGroup(groupDef: SurveyGroupItem, parentKey: string) {
    const parent = this.findRenderedItem(parentKey) as SurveyGroupItem;
    if (!parent) {
      console.warn('initRenderedGroup: parent not found: ' + parentKey);
      return;
    }

    if (groupDef.selectionMethod && groupDef.selectionMethod.name === 'sequential') {
      // simplified workflow:
      this.sequentialRender(groupDef, parent);
      return
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
    if (!renderedGroup || !isSurveyGroupItem(renderedGroup)) {
      console.warn('reRenderGroup: renderedGroup not found or not a group: ' + groupKey);
      return;
    }
    const groupDef = this.findSurveyDefItem(groupKey);
    if (!groupDef || !isSurveyGroupItem(groupDef)) {
      console.warn('reRenderGroup: groupDef not found or not a group: ' + groupKey);
      return;
    }

    if (groupDef.selectionMethod && groupDef.selectionMethod.name === 'sequential') {
      // simplified workflow:
      this.sequentialRender(groupDef, renderedGroup, true);
      return
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
          // console.log('removed item: ' + item.key);
          return;
        }

        // Add direct follow ups
        currentIndex = renderedGroup.items.findIndex(ci => ci.key === item.key);
        if (currentIndex < 0) {
          // console.warn('reRenderGroup: index to insert items not found');
          return;
        }


        if (isSurveyGroupItem(item)) {
          // Re-Render groups recursively
          this.reRenderGroup(item.key);
        } else {
          renderedGroup.items[currentIndex] = this.renderSingleSurveyItem(itemDef as SurveySingleItem, true);
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
      nextItem = this.getNextItem(groupDef, renderedGroup, nextItem.key, false);
    }
  }

  private getNextItem(groupDef: SurveyGroupItem, parent: SurveyGroupItem, lastKey: string, onlyDirectFollower: boolean): SurveyItem | undefined {
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

  private addRenderedItem(item: SurveyItem, parent: SurveyGroupItem, atPosition?: number): number {
    let renderedItem: SurveyItem = {
      ...item
    };

    if (isSurveyGroupItem(item)) {
      (renderedItem as SurveyGroupItem).items = [];
    } else {
      renderedItem = this.renderSingleSurveyItem(item);
    }

    if (atPosition === undefined || atPosition < 0) {
      parent.items.push(renderedItem);
      this.setTimestampFor('rendered', renderedItem.key);
      return parent.items.length - 1;
    }
    parent.items.splice(atPosition, 0, renderedItem);
    this.setTimestampFor('rendered', renderedItem.key);
    return atPosition;
  }

  private renderSingleSurveyItem(item: SurveySingleItem, rerender?: boolean): SurveySingleItem {
    const renderedItem = {
      ...item,
    }

    if (item.validations) {
      // question is not rendered yet, so to be able to handle validation using prefills, we need to add response extra:
      const extraResponses: SurveyItemResponse[] = [];
      const currentResponse = this.getResponses().find(r => r.key === item.key)
      if (currentResponse) {
        extraResponses.push(currentResponse);
      }

      renderedItem.validations = item.validations.map(validation => {
        return {
          ...validation,
          rule: this.evalConditions(validation.rule as Expression, undefined, extraResponses)
        }
      });
    }

    renderedItem.components = this.resolveComponentGroup(renderedItem, item.components, rerender);

    return renderedItem;
  }

  private resolveComponentGroup(parentItem: SurveySingleItem, group?: ItemGroupComponent, rerender?: boolean): ItemGroupComponent {
    if (!group) {
      return { role: '', items: [] }
    }

    if (!group.order || group.order.name === 'sequential') {
      if (!group.items) {
        console.warn(`this should not be a component group, items is missing or empty: ${parentItem.key} -> ${group.key}/${group.role} `);
        return {
          ...group,
          content: this.resolveContent(group.content),
          description: this.resolveContent(group.description),
          displayCondition: group.displayCondition ? this.evalConditions(group.displayCondition as Expression, parentItem) : undefined,
        }
      }
      return {
        ...group,
        content: this.resolveContent(group.content),
        description: this.resolveContent(group.description),
        displayCondition: group.displayCondition ? this.evalConditions(group.displayCondition as Expression, parentItem) : undefined,
        items: group.items.map(comp => {
          if (isItemGroupComponent(comp)) {
            return this.resolveComponentGroup(parentItem, comp);
          }
          return {
            ...comp,
            disabled: comp.disabled ? this.evalConditions(comp.disabled as Expression, parentItem) : undefined,
            displayCondition: comp.displayCondition ? this.evalConditions(comp.displayCondition as Expression, parentItem) : undefined,
            content: this.resolveContent(comp.content),
            description: this.resolveContent(comp.description),
            properties: this.resolveComponentProperties(comp.properties),
          }
        }),
      }
    }
    if (rerender) {
      console.error('define how to deal with rerendering - order should not change');
    }
    console.error('order type not implemented: ', group.order.name);
    return {
      ...group
    }
  }

  private resolveContent(contents: LocalizedObject[] | undefined): LocalizedObject[] | undefined {
    if (!contents) { return; }

    return contents.map(cont => {
      if ((cont as LocalizedString).parts && (cont as LocalizedString).parts.length > 0) {
        const resolvedContents = (cont as LocalizedString).parts.map(
          p => {
            if (typeof (p) === 'string' || typeof (p) === "number") {
              // should not happen - only after resolved content is generated
              return p
            }
            return p.dtype === 'exp' ? this.resolveExpression(p.exp) : p.str
          }
        );
        return {
          code: cont.code,
          parts: resolvedContents,
          resolvedText: resolvedContents.join(''),
        }
      }
      return {
        ...cont
      }
    })
  }

  private resolveComponentProperties(props: ComponentProperties | undefined): ComponentProperties | undefined {
    if (!props) { return; }

    const resolvedProps = { ...props };
    if (resolvedProps.min) {
      const arg = expressionArgParser(resolvedProps.min as ExpressionArg);
      resolvedProps.min = isExpression(arg) ? this.resolveExpression(arg) : arg;
    } if (resolvedProps.max) {
      const arg = expressionArgParser(resolvedProps.max as ExpressionArg);
      resolvedProps.max = isExpression(arg) ? this.resolveExpression(arg) : arg;
    }
    if (resolvedProps.stepSize) {
      const arg = expressionArgParser(resolvedProps.stepSize as ExpressionArg);
      resolvedProps.stepSize = isExpression(arg) ? this.resolveExpression(arg) : arg;
    }
    if (resolvedProps.dateInputMode) {
      const arg = expressionArgParser(resolvedProps.dateInputMode as ExpressionArg);
      resolvedProps.dateInputMode = isExpression(arg) ? this.resolveExpression(arg) : arg;
    }
    return resolvedProps;
  }

  private setTimestampFor(type: TimestampType, itemID: string, localeCode?: string) {
    const obj = this.findResponseItem(itemID);
    if (!obj) {
      return;
    }
    if (!obj.meta) {
      obj.meta = { ...initMeta };
    }
    if (localeCode) {
      obj.meta.localeCode = localeCode;
    }

    const timestampLimit = 100;

    switch (type) {
      case 'rendered':
        obj.meta.rendered.push(Date.now());
        if (obj.meta.rendered.length > timestampLimit) {
          obj.meta.rendered.splice(0, 1);
        }
        break;
      case 'displayed':
        obj.meta.displayed.push(Date.now());
        if (obj.meta.displayed.length > timestampLimit) {
          obj.meta.displayed.splice(0, 1);
        }
        break;
      case 'responded':
        obj.meta.responded.push(Date.now());
        if (obj.meta.responded.length > timestampLimit) {
          obj.meta.responded.splice(0, 1);
        }
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
        if (compID === this.surveyDef.current.surveyDefinition.key) {
          obj = this.surveyDef.current.surveyDefinition;
        }
        return;
      }
      if (!isSurveyGroupItem(obj)) {
        return;
      }
      const ind = obj.items.findIndex(item => item.key === compID);
      if (ind < 0) {
        if (this.showDebugMsg) {
          console.warn('findSurveyDefItem: cannot find object for : ' + compID);
        }
        obj = undefined;
        return;
      }
      obj = obj.items[ind];

    });
    return obj;
  }

  findRenderedItem(itemID: string): SurveyItem | undefined {
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
        if (compID === this.renderedSurvey.key) {
          obj = this.renderedSurvey;
        }
        return;
      }
      if (!isSurveyGroupItem(obj)) {
        return;
      }
      const ind = obj.items.findIndex(item => item.key === compID);
      if (ind < 0) {
        if (this.showDebugMsg) {
          console.warn('findRenderedItem: cannot find object for : ' + compID);
        }
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
      if (!isSurveyGroupItemResponse(obj)) {
        return;
      }
      const ind = obj.items.findIndex(item => item.key === compID);
      if (ind < 0) {
        // console.warn('findResponseItem: cannot find object for : ' + compID);
        obj = undefined;
        return;
      }
      obj = obj.items[ind];
    });
    return obj;
  }

  resolveExpression(exp?: Expression, temporaryItem?: SurveySingleItem): any {
    return this.evalEngine.eval(
      exp,
      this.renderedSurvey,
      this.context,
      this.responses,
      temporaryItem,
      this.showDebugMsg,
    );
  }

  private getOnlyRenderedResponses(items: SurveyItemResponse[]): SurveyItemResponse[] {
    const responses: SurveyItemResponse[] = [];
    items.forEach(item => {
      let currentItem: SurveyItemResponse = {
        key: item.key,
        meta: item.meta,
      }
      if (isSurveyGroupItemResponse(item)) {
        (currentItem as SurveyGroupItemResponse).items = this.getOnlyRenderedResponses(item.items);
      } else {
        currentItem.response = item.response;
        if (!this.findRenderedItem(item.key)) {
          return;
        }
      }
      responses.push(currentItem)
    })
    return responses;
  }

  evalConditions(condition?: Expression, temporaryItem?: SurveySingleItem, extraResponses?: SurveyItemResponse[]): boolean {
    const extra = (extraResponses !== undefined) ? [...extraResponses] : [];
    const responsesForRenderedItems: SurveyGroupItemResponse = {
      ...this.responses,
      items: [...this.getOnlyRenderedResponses(this.responses.items), ...extra]
    }

    return this.evalEngine.eval(
      condition,
      this.renderedSurvey,
      this.context,
      responsesForRenderedItems,
      temporaryItem,
      this.showDebugMsg,
    );
  }

}
