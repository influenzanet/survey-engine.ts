import { Expression, expressionArgParser, isExpression, ResponseItem, SurveyContext, SurveyGroupItem, SurveyGroupItemResponse, SurveyItem, SurveyItemResponse, SurveySingleItem, SurveyResponse, SurveySingleItemResponse } from "./data_types";
import moment from 'moment';

export class ExpressionEval {
  renderedSurvey?: SurveyGroupItem;
  context?: SurveyContext;
  responses?: SurveyGroupItemResponse;
  temporaryItem?: SurveySingleItem; // for items not in the rendered tree yet
  showDebugMsg?: boolean;

  public eval(
    expression?: Expression,
    renderedSurvey?: SurveyGroupItem,
    context?: SurveyContext,
    responses?: SurveyGroupItemResponse,
    temporaryItem?: SurveySingleItem,
    showDebugMsg?: boolean,
  ): any {
    // Default if no conditions found:
    if (!expression) {
      return true;
    }

    this.renderedSurvey = renderedSurvey;
    this.context = context;
    this.responses = responses;
    this.temporaryItem = temporaryItem;
    this.showDebugMsg = showDebugMsg;

    return this.evalExpression(expression);
  }

  private logEvent(event: string) {
    if (this.showDebugMsg) {
      console.log(event);
    }
  }

  private evalExpression(expression: Expression): any {
    switch (expression.name) {
      // logical operators -->
      case 'or':
        return this.or(expression);
      case 'and':
        return this.and(expression);
      case 'not':
        return this.not(expression);
      // comparision methods -->
      case 'eq':
        return this.eq(expression);
      case 'lt':
        return this.lt(expression);
      case 'lte':
        return this.lte(expression);
      case 'gt':
        return this.gt(expression);
      case 'gte':
        return this.gte(expression);
      case 'isDefined':
        return this.isDefined(expression);
      // reference methods to access variables and their items/attributes -->
      case 'getContext':
        return this.getContext();
      case 'getResponses':
        return this.getResponses();
      case 'getRenderedItems':
        return this.getRenderedItems();
      case 'getAttribute':
        return this.getAttribute(expression);
      case 'getArrayItemAtIndex':
        return this.getArrayItem(expression);
      case 'getArrayItemByKey':
        return this.getArrayItemByKey(expression);
      case 'getObjByHierarchicalKey':
        return this.getObjByHierarchicalKey(expression);
      case 'getNestedObjectByKey':
        return this.getNestedObjectByKey(expression);
      // query methods:
      case 'findPreviousSurveyResponsesByKey':
        return this.findPreviousSurveyResponsesByKey(expression);
      case 'getLastFromSurveyResponses':
        return this.getLastFromSurveyResponses(expression);
      case 'getPreviousResponses':
        return this.getPreviousResponses(expression);
      case 'filterResponsesByIncludesKeys':
        return this.filterResponsesByIncludesKeys(expression);
      case 'filterResponsesByValue':
        return this.filterResponsesByValue(expression);
      case 'getLastFromSurveyItemResponses':
        return this.getLastFromSurveyItemResponses(expression);
      case 'getSecondsSince':
        return this.getSecondsSince(expression);

      // shortcut methods:
      case 'hasResponse':
        return this.hasResponse(expression);
      case 'getResponseItem':
        return this.getResponseItem(expression);
      case 'parseValueAsNum':
        return this.parseValueAsNum(expression);
      case 'getResponseValueAsNum':
        return this.getResponseValueAsNum(expression);
      case 'getResponseValueAsStr':
        return this.getResponseValueAsStr(expression);
      case 'checkResponseValueWithRegex':
        return this.checkResponseValueWithRegex(expression);
      case 'responseHasKeysAny':
        return this.responseHasKeysAny(expression);
      case 'responseHasKeysAll':
        return this.responseHasKeysAll(expression);
      case 'responseHasOnlyKeysOtherThan':
        return this.responseHasOnlyKeysOtherThan(expression);
      case 'countResponseItems':
        return this.countResponseItems(expression);
      case 'getSurveyItemValidation':
        return this.getSurveyItemValidation(expression);

      case 'timestampWithOffset':
        return this.timestampWithOffset(expression);
      case 'dateResponseDiffFromNow':
        return this.dateResponseDiffFromNow(expression);
      default:
        this.logEvent('expression name unknown for the current engine: ' + expression.name + '. Default return value is false.');
        break;
    }
    return false;
  }

  // ---------- LOGIC OPERATORS ----------------
  private or(exp: Expression): boolean {
    if (!Array.isArray(exp.data)) {
      this.logEvent('or: data attribute is missing or wrong: ' + exp.data);
      return false;
    }
    return exp.data.some((value) => {
      const arg = expressionArgParser(value);
      return isExpression(arg) ? this.evalExpression(arg) : arg
    });
  }

  private and(exp: Expression): boolean {
    if (!Array.isArray(exp.data)) {
      this.logEvent('and: data attribute is missing or wrong: ' + exp.data);
      return false;
    }
    return exp.data.every((value) => {
      const arg = expressionArgParser(value);
      return isExpression(arg) ? this.evalExpression(arg) : arg
    });
  }

  private not(exp: Expression): boolean {
    if (!Array.isArray(exp.data) || exp.data?.length !== 1) {
      this.logEvent('not: method expects a sinlge Expression as an argument ');
      return false;
    }

    return !this.evalExpression(expressionArgParser(exp.data[0]) as Expression);
  }

  // ---------- COMPARISONS ----------------
  private eq(exp: Expression): boolean {
    if (!Array.isArray(exp.data) || exp.data.length < 1) {
      this.logEvent('eq: data attribute is missing or wrong: ' + exp.data);
      return false;
    }

    let values = [];
    for (let ind = 0; ind < exp.data.length; ind++) {
      const val = expressionArgParser(exp.data[ind]);
      if (isExpression(val)) {
        values.push(this.evalExpression(val));
      } else {
        values.push(val);
      }

    }

    // check if all values are equal
    return values.every((val, i, arr) => typeof (val) === 'string' ? (val.localeCompare(arr[0]) === 0) : (arr[0] === val));
  }

  private gt(exp: Expression): boolean {
    if (!Array.isArray(exp.data) || exp.data.length !== 2) {
      this.logEvent('gt: data attribute is missing or wrong: ' + exp.data);
      return false;
    }

    const arg1 = expressionArgParser(exp.data[0]);
    const arg2 = expressionArgParser(exp.data[1]);

    const a = isExpression(arg1) ? this.evalExpression(arg1) : arg1;
    const b = isExpression(arg2) ? this.evalExpression(arg2) : arg2;
    return typeof (a) === "string" ? a.localeCompare(b) > 0 : a > b;
  }

  private gte(exp: Expression): boolean {
    if (!Array.isArray(exp.data) || exp.data.length !== 2) {
      this.logEvent('gte: data attribute is missing or wrong: ' + exp.data);
      return false;
    }

    const arg1 = expressionArgParser(exp.data[0]);
    const arg2 = expressionArgParser(exp.data[1]);

    const a = isExpression(arg1) ? this.evalExpression(arg1) : arg1;
    const b = isExpression(arg2) ? this.evalExpression(arg2) : arg2;
    return typeof (a) === "string" ? a.localeCompare(b) >= 0 : a >= b;
  }

  private lt(exp: Expression): boolean {
    if (!Array.isArray(exp.data) || exp.data.length !== 2) {
      this.logEvent('lt: data attribute is missing or wrong: ' + exp.data);
      return false;
    }

    const arg1 = expressionArgParser(exp.data[0]);
    const arg2 = expressionArgParser(exp.data[1]);

    const a = isExpression(arg1) ? this.evalExpression(arg1) : arg1;
    const b = isExpression(arg2) ? this.evalExpression(arg2) : arg2;
    return typeof (a) === "string" ? a.localeCompare(b) < 0 : a < b;
  }

  private lte(exp: Expression): boolean {
    if (!Array.isArray(exp.data) || exp.data.length !== 2) {
      this.logEvent('lte: data attribute is missing or wrong: ' + exp.data);
      return false;
    }

    const arg1 = expressionArgParser(exp.data[0]);
    const arg2 = expressionArgParser(exp.data[1]);

    const a = isExpression(arg1) ? this.evalExpression(arg1) : arg1;
    const b = isExpression(arg2) ? this.evalExpression(arg2) : arg2;
    return typeof (a) === "string" ? a.localeCompare(b) <= 0 : a <= b;
  }

  private isDefined(exp: Expression): boolean {
    if (!Array.isArray(exp.data) || exp.data.length !== 1) {
      this.logEvent('isDefined: data attribute is missing or wrong: ' + exp.data);
      return false;
    }
    const arg1 = expressionArgParser(exp.data[0]);
    if (!isExpression(arg1)) {
      return arg1;
    }

    const value = this.evalExpression(arg1);
    return value !== null && value !== undefined;
  }

  // ---------- ROOT REFERENCES ----------------
  private getContext(): any {
    return this.context;
  }

  private getResponses(): SurveyGroupItemResponse | undefined {
    return this.responses;
  }

  private getRenderedItems(): SurveyGroupItem | undefined {
    return this.renderedSurvey;
  }

  // ---------- WORKING WITH OBJECT/ARRAYS ----------------
  private getAttribute(attributeRef: Expression): any {
    if (!Array.isArray(attributeRef.data) || attributeRef.data.length !== 2) {
      this.logEvent('getAttribute: data attribute is missing or wrong: ' + attributeRef.data);
      return null;
    }

    if (!attributeRef.data[1].str) {
      this.logEvent(`getAttribute: second argument is not a valid string - ${JSON.stringify(attributeRef.data[1])}`);
      return null;
    }

    const itemRef = expressionArgParser(attributeRef.data[0]);
    let root: any;
    if (!isExpression(itemRef)) {
      if (!this.temporaryItem) {
        this.logEvent(`getAttribute: first argument is not a valid expression or temporary object not set - ${JSON.stringify(attributeRef.data[0])}`);
        return null;
      }
      if (itemRef === 'this') {
        root = this.temporaryItem;
      }
    } else {
      root = this.evalExpression(itemRef);
    }

    if (!root || typeof (root) !== 'object') {
      this.logEvent('getAttribute: received wrong type for referenced object: ' + JSON.stringify(itemRef));
      return null;
    }
    const attr = root[attributeRef.data[1].str];
    if (attributeRef.returnType) {
      return this.typeConvert(attr, attributeRef.returnType);
    }
    return attr;
  }

  private getArrayItem(itemRef: Expression): any {
    if (!Array.isArray(itemRef.data) || itemRef.data.length !== 2) {
      this.logEvent('getArrayItem: data attribute is missing or wrong: ' + itemRef.data);
      return null;
    }
    const arg1 = expressionArgParser(itemRef.data[0]);
    const arg2 = expressionArgParser(itemRef.data[1]);
    if (!isExpression(arg1)) {
      this.logEvent(`getArrayItem: first argument is not a valid expression - ${JSON.stringify(itemRef.data[0])}`);
      return null;
    }
    if (typeof (arg2) !== 'number') {
      this.logEvent(`getArrayItem: first argument is not a valid number - ${JSON.stringify(itemRef.data[0])}`);
      return null;
    }

    const arr = this.evalExpression(arg1);
    if (!arr || !Array.isArray(arr)) {
      this.logEvent('getArrayItem: received wrong type for referenced array: ' + arr);
      return null;
    }
    const item = arr[arg2];
    if (itemRef.returnType) {
      return this.typeConvert(item, itemRef.returnType);
    }
    return item;
  }

  private getArrayItemByKey(exp: Expression): any {
    if (!exp.data || !Array.isArray(exp.data) || exp.data.length !== 2) {
      this.logEvent('getArrayItemByKey: data attribute is missing or wrong: ' + exp.data);
      return null;
    }

    if (!isExpression(exp.data[0].exp)) {
      this.logEvent(`getArrayItemByKey: first argument is not a valid expression - ${JSON.stringify(exp.data[0])}`);
      return null;
    }
    if (!exp.data[1].str) {
      this.logEvent(`getArrayItemByKey: second argument is not a valid string - ${JSON.stringify(exp.data[1])}`);
      return null;
    }
    const key = exp.data[1].str;

    const arr = this.evalExpression(exp.data[0].exp);
    if (!arr || !Array.isArray(arr)) {
      this.logEvent('getArrayItemByKey: received wrong type for referenced array: ' + arr);
      return null;
    }
    const item = arr.find(a => a.key === key);
    if (!item) {
      return null;
    }
    if (exp.returnType) {
      return this.typeConvert(item, exp.returnType);
    }
    return item;
  }

  private getObjByHierarchicalKey(exp: Expression): any {
    if (!Array.isArray(exp.data) || exp.data.length !== 2) {
      this.logEvent('getObjByHierarchicalKey: data attribute is missing or wrong: ' + exp.data);
      return null;
    }

    const arg1 = expressionArgParser(exp.data[0]);
    const key = expressionArgParser(exp.data[1]);
    if (!isExpression(arg1)) {
      this.logEvent('getObjByHierarchicalKey: first argument is not a valid expression');
      return null;
    }
    if (!key || typeof (key) !== 'string') {
      this.logEvent('getObjByHierarchicalKey: second argument is not a valid string');
      return null;
    }

    // find root:
    let root = this.evalExpression(arg1);
    if (!root) {
      // this.logEvent('getObjByHierarchicalKey: root is not found for: ');
      // this.logEvent(arg1);
      return null;
    }
    if ((!root.items || root.items.length < 1) && root.key !== key) {
      this.logEvent('getObjByHierarchicalKey: root is not a group: ' + JSON.stringify(root));
      return null;
    }

    const obj = this.retreiveObjectFromTreeHierarchicalKey(root, key);
    if (exp.returnType) {
      return this.typeConvert(obj, exp.returnType);
    }
    return obj;
  }

  private retreiveObjectFromTreeHierarchicalKey(root: any, key: string): any {
    const ids = key.split('.');
    let obj: SurveyItem | SurveyItemResponse | ResponseItem | undefined;
    let compID = '';


    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];

      if (!obj) {
        if (root.key !== id) {
          // this.logEvent('getObjByHierarchicalKey: cannot find root object for: ' + id);
          return;
        }
        obj = root;
        compID += id;
        continue;
      }

      compID += '.' + id;
      if (!(obj as { items: any[] }).items) { return undefined };

      const ind = (obj as { items: any[] }).items.findIndex(item => item.key === compID);
      if (ind < 0) {
        // this.logEvent('getObjByHierarchicalKey: cannot find object for : ' + compID);
        return null;
      }
      obj = (obj as { items: any[] }).items[ind];
    }
    return obj;
  }

  private getNestedObjectByKey(exp: Expression): any {
    if (!Array.isArray(exp.data) || exp.data.length !== 2) {
      this.logEvent('getNestedObjectByKey: data attribute is missing or wrong: ' + exp.data);
      return null;
    }

    const arg1 = expressionArgParser(exp.data[0]);
    const key = expressionArgParser(exp.data[1]);
    if (!isExpression(arg1)) {
      this.logEvent(`getNestedObjectByKey: first argument is not a valid expression - ${JSON.stringify(exp.data[0])}`);
      return null;
    }
    if (!key || typeof (key) !== 'string') {
      this.logEvent(`getNestedObjectByKey: first argument is not a valid string - ${JSON.stringify(exp.data[1])}`);
      return null;
    }

    // find root:
    let root = this.evalExpression(arg1);
    if (!root) {
      return null;
    }
    if ((!root.items || root.items.length < 1) && root.key !== key) {
      this.logEvent('getNestedObjectByKey: root is not a group: ' + JSON.stringify(root));
      return null;
    }

    const obj = this.retreiveObjectFromTreeBySimpleKey(root, key);
    if (exp.returnType) {
      return this.typeConvert(obj, exp.returnType);
    }
    return obj;
  }

  private retreiveObjectFromTreeBySimpleKey(root: any, key: string): any {
    const ids = key.split('.');
    let obj: SurveyItem | SurveyItemResponse | ResponseItem | undefined;
    let compID = '';


    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];

      if (!obj) {
        if (root.key !== id) {
          return;
        }
        obj = root;
        compID = id;
        continue;
      }

      compID = id;
      if (!(obj as { items: any[] }).items) { return undefined };

      const ind = (obj as { items: any[] }).items.findIndex(item => item.key === compID);
      if (ind < 0) {
        // this.logEvent('getObjByHierarchicalKey: cannot find object for : ' + compID);
        return null;
      }
      obj = (obj as { items: any[] }).items[ind];
    }
    return obj;
  }

  private getResponseItem(exp: Expression): ResponseItem | undefined {
    if (!Array.isArray(exp.data) || exp.data.length !== 2) {
      this.logEvent('getResponseItem: data attribute is missing or wrong: ' + exp.data);
      return;
    }
    const itemRef = expressionArgParser(exp.data[0]);
    const respItemRef = expressionArgParser(exp.data[1]);

    const getSurveyItemExp: Expression = {
      name: 'getObjByHierarchicalKey', data: [
        { dtype: 'exp', exp: { name: 'getResponses' } },
        { str: itemRef }
      ]
    }

    const getResponseRootExp: Expression = {
      name: 'getAttribute', data: [
        { dtype: 'exp', exp: getSurveyItemExp },
        { str: 'response' }
      ]
    }

    const getResponseItemExp: Expression = {
      name: 'getNestedObjectByKey', data: [
        { dtype: 'exp', exp: getResponseRootExp },
        { str: respItemRef }
      ]
    }

    return this.evalExpression(getResponseItemExp);
  }

  private hasResponse(exp: Expression): boolean {
    if (!Array.isArray(exp.data) || exp.data.length !== 2) {
      this.logEvent('hasResponse: data attribute is missing or wrong: ' + exp.data);
      return false;
    }
    const getResponseItemExp: Expression = {
      name: 'getResponseItem', data: [
        exp.data[0],
        exp.data[1],
      ]
    }
    const respItem = this.evalExpression(getResponseItemExp) as ResponseItem;

    if (!respItem) {
      return false;
    }
    return true;
  }

  private checkResponseValueWithRegex(exp: Expression): boolean {
    if (!Array.isArray(exp.data) || exp.data.length !== 3) {
      this.logEvent('checkResponseValueWithRegex: data attribute is missing or wrong: ' + exp.data);
      return false;
    }
    const pattern = expressionArgParser(exp.data[2]);
    if (typeof (pattern) !== 'string') {
      this.logEvent('regexp wrong data type in the argument');
      return false;
    }

    const getResponseItemExp: Expression = {
      name: 'getResponseItem', data: [
        exp.data[0],
        exp.data[1],
      ]
    }
    const respItem = this.evalExpression(getResponseItemExp) as ResponseItem;

    if (!respItem || !respItem.value) {
      return false;
    }
    return new RegExp(pattern).test(respItem.value);
  }

  private getSurveyItemValidation(exp: Expression): boolean {
    if (!Array.isArray(exp.data) || exp.data.length !== 2) {
      this.logEvent('getSurveyItemValidation: data attribute is missing or wrong: ' + exp.data);
      return true;
    }
    const itemRef = expressionArgParser(exp.data[0]);
    const valRef = expressionArgParser(exp.data[1]);

    let root: SurveySingleItem | undefined;
    if (itemRef === 'this') {
      root = this.temporaryItem;
    } else {
      const getSurveyItemExp: Expression = {
        name: 'getObjByHierarchicalKey', data: [
          { dtype: 'exp', exp: { name: 'getRenderedItems' } },
          { str: itemRef }
        ]
      }
      root = this.getObjByHierarchicalKey(getSurveyItemExp);
    }

    if (!root?.validations) {
      return true;
    }

    const currentVal = root?.validations.find(v => v.key === valRef);
    if (!currentVal) {
      return true;
    }
    return currentVal.rule as boolean;
  }

  private parseValueAsNum(exp: Expression): number | undefined {
    if (!Array.isArray(exp.data) || exp.data.length !== 1) {
      this.logEvent('parseValueAsNum: data attribute is missing or wrong: ' + exp.data);
      return;
    }

    const valueRef = expressionArgParser(exp.data[0]);

    const value = this.evalExpression(valueRef) as string;
    if (!value) { return; }
    return parseFloat(value);
  }

  private getResponseValueAsNum(exp: Expression): number | undefined {
    if (!Array.isArray(exp.data) || exp.data.length !== 2) {
      this.logEvent('getResponseValueAsNum: data attribute is missing or wrong: ' + exp.data);
      return;
    }

    const itemRef = expressionArgParser(exp.data[0]);
    const respItemRef = expressionArgParser(exp.data[1]);

    const getSurveyItemExp: Expression = {
      name: 'getObjByHierarchicalKey', data: [
        { dtype: 'exp', exp: { name: 'getResponses' } },
        { str: itemRef }
      ]
    }

    const getResponseRootExp: Expression = {
      name: 'getAttribute', data: [
        { dtype: 'exp', exp: getSurveyItemExp },
        { str: 'response' }
      ]
    }

    const getResponseItemExp: Expression = {
      name: 'getNestedObjectByKey', data: [
        { dtype: 'exp', exp: getResponseRootExp },
        { str: respItemRef }
      ]
    }

    const responseItem = this.evalExpression(getResponseItemExp) as ResponseItem | undefined;
    if (!responseItem || !responseItem.value) { return; }
    return parseFloat(responseItem.value);
  }

  private getResponseValueAsStr(exp: Expression): string | undefined {
    if (!Array.isArray(exp.data) || exp.data.length !== 2) {
      this.logEvent('getResponseValueAsStr: data attribute is missing or wrong: ' + exp.data);
      return;
    }
    const itemRef = expressionArgParser(exp.data[0]);
    const respItemRef = expressionArgParser(exp.data[1]);

    const getSurveyItemExp: Expression = {
      name: 'getObjByHierarchicalKey', data: [
        { dtype: 'exp', exp: { name: 'getResponses' } },
        { str: itemRef }
      ]
    }

    const getResponseRootExp: Expression = {
      name: 'getAttribute', data: [
        { dtype: 'exp', exp: getSurveyItemExp },
        { str: 'response' }
      ]
    }

    const getResponseItemExp: Expression = {
      name: 'getNestedObjectByKey', data: [
        { dtype: 'exp', exp: getResponseRootExp },
        { str: respItemRef }
      ]
    }

    const responseItem = this.evalExpression(getResponseItemExp) as ResponseItem | undefined;
    if (!responseItem || !responseItem.value) { return; }
    return responseItem.value;
  }

  private responseHasKeysAny(exp: Expression): boolean {
    if (!Array.isArray(exp.data) || exp.data.length < 3) {
      this.logEvent('responseHasKeysAny: data attribute is missing or wrong: ' + exp.data);
      return false;
    }
    const itemRef = expressionArgParser(exp.data[0]);
    const respItemRef = expressionArgParser(exp.data[1]);

    const getSurveyItemExp: Expression = {
      name: 'getObjByHierarchicalKey', data: [
        { dtype: 'exp', exp: { name: 'getResponses' } },
        { str: itemRef }
      ]
    }

    const getResponseRootExp: Expression = {
      name: 'getAttribute', data: [
        { dtype: 'exp', exp: getSurveyItemExp },
        { str: 'response' }
      ]
    }

    const getResponseItemExp: Expression = {
      name: 'getNestedObjectByKey', data: [
        { dtype: 'exp', exp: getResponseRootExp },
        { str: respItemRef }
      ]
    }

    const keys = exp.data.slice(2, exp.data.length).map(arg => expressionArgParser(arg));
    const responseItem = this.evalExpression(getResponseItemExp) as ResponseItem | undefined;
    if (!responseItem || !responseItem.items) { return false; }
    return responseItem.items.some(it => keys.includes(it.key));
  }

  private responseHasKeysAll(exp: Expression): boolean {
    if (!Array.isArray(exp.data) || exp.data.length < 3) {
      this.logEvent('responseHasKeysAll: data attribute is missing or wrong: ' + exp.data);
      return false;
    }
    const itemRef = expressionArgParser(exp.data[0]);
    const respItemRef = expressionArgParser(exp.data[1]);

    const getSurveyItemExp: Expression = {
      name: 'getObjByHierarchicalKey', data: [
        { dtype: 'exp', exp: { name: 'getResponses' } },
        { str: itemRef }
      ]
    }

    const getResponseRootExp: Expression = {
      name: 'getAttribute', data: [
        { dtype: 'exp', exp: getSurveyItemExp },
        { str: 'response' }
      ]
    }

    const getResponseItemExp: Expression = {
      name: 'getNestedObjectByKey', data: [
        { dtype: 'exp', exp: getResponseRootExp },
        { str: respItemRef }
      ]
    }

    const keys = exp.data.slice(2, exp.data.length).map(arg => expressionArgParser(arg));
    const responseItem = this.evalExpression(getResponseItemExp) as ResponseItem | undefined;
    if (!responseItem || !responseItem.items) { return false; }

    return responseItem.items.every(it => keys.includes(it.key));
  }

  private responseHasOnlyKeysOtherThan(exp: Expression): boolean {
    if (!Array.isArray(exp.data) || exp.data.length < 3) {
      this.logEvent('responseHasOnlyKeysOtherThan: data attribute is missing or wrong: ' + exp.data);
      return false;
    }
    const itemRef = expressionArgParser(exp.data[0]);
    const respItemRef = expressionArgParser(exp.data[1]);

    const getSurveyItemExp: Expression = {
      name: 'getObjByHierarchicalKey', data: [
        { dtype: 'exp', exp: { name: 'getResponses' } },
        { str: itemRef }
      ]
    }

    const getResponseRootExp: Expression = {
      name: 'getAttribute', data: [
        { dtype: 'exp', exp: getSurveyItemExp },
        { str: 'response' }
      ]
    }

    const getResponseItemExp: Expression = {
      name: 'getNestedObjectByKey', data: [
        { dtype: 'exp', exp: getResponseRootExp },
        { str: respItemRef }
      ]
    }

    const keys = exp.data.slice(2, exp.data.length).map(arg => expressionArgParser(arg));
    const responseItem = this.evalExpression(getResponseItemExp) as ResponseItem | undefined;
    if (!responseItem || !responseItem.items) { return false; }

    let hasOtherKeys = false;
    let foundBlacklistKey = false;
    responseItem.items.forEach(it => {
      if (keys.includes(it.key)) {
        foundBlacklistKey = true;
      } else {
        hasOtherKeys = true;
      }
    });

    return hasOtherKeys && !foundBlacklistKey;
  }

  private countResponseItems(exp: Expression): number {
    if (!Array.isArray(exp.data) || exp.data.length != 2) {
      this.logEvent('responseHasOnlyKeysOtherThan: data attribute is missing or wrong: ' + exp.data);
      return -1;
    }
    const itemRef = expressionArgParser(exp.data[0]);
    const respItemRef = expressionArgParser(exp.data[1]);

    const getSurveyItemExp: Expression = {
      name: 'getObjByHierarchicalKey', data: [
        { dtype: 'exp', exp: { name: 'getResponses' } },
        { str: itemRef }
      ]
    }

    const getResponseRootExp: Expression = {
      name: 'getAttribute', data: [
        { dtype: 'exp', exp: getSurveyItemExp },
        { str: 'response' }
      ]
    }

    const getResponseItemExp: Expression = {
      name: 'getNestedObjectByKey', data: [
        { dtype: 'exp', exp: getResponseRootExp },
        { str: respItemRef }
      ]
    }

    const responseItem = this.evalExpression(getResponseItemExp) as ResponseItem | undefined;
    if (!responseItem || responseItem.items === undefined) { return -1; }

    return responseItem.items.length;
  }

  // ---------- QUERY METHODS ----------------
  private findPreviousSurveyResponsesByKey(exp: Expression): SurveyResponse[] {
    if (!exp.data || exp.data.length !== 1 || !exp.data[0].str) {
      this.logEvent('findPreviousSurveyResponsesByKey: key argument is missing');
      return [];
    }
    const key = exp.data[0].str;
    if (!this.context || !this.context.previousResponses) {
      return [];
    }
    return this.context.previousResponses.filter(resp => resp.key === key);
  }

  private getLastFromSurveyResponses(exp: Expression): SurveyResponse | undefined {
    if (!exp.data || exp.data.length !== 1 || !exp.data[0].str) {
      this.logEvent('getLastFromSurveyResponses: missing argument');
      return undefined;
    }
    const previousResponses = this.findPreviousSurveyResponsesByKey(exp);
    if (previousResponses.length < 1) {
      return undefined;
    }
    const sorted = previousResponses.sort((a, b) => b.submittedAt - a.submittedAt);
    return sorted[0];
  }

  private getPreviousResponses(exp: Expression): SurveySingleItemResponse[] {
    if (!exp.data || exp.data.length !== 1 || !exp.data[0].str) {
      this.logEvent('getPreviousResponses: missing argument');
      return [];
    }

    const key = exp.data[0].str;
    const surveyKey = key.split('.')[0];
    if (!this.context || !this.context.previousResponses) {
      return [];
    }
    const previousSurveys = this.context.previousResponses.filter(resp => resp.key === surveyKey);

    const resps: SurveySingleItemResponse[] = [];
    previousSurveys.forEach(survey => {
      const iR = survey.responses.find(item => item.key === key);
      if (iR) {
        resps.push(iR);
      }
    });
    return resps;
  }

  private filterResponsesByIncludesKeys(exp: Expression): SurveySingleItemResponse[] {
    if (!exp.data || exp.data.length < 3 || !exp.data[1].str || !exp.data[2].str) {
      this.logEvent('filterResponsesByIncludesKeys: missing arguments');
      return [];
    }

    const arg1 = expressionArgParser(exp.data[0]);
    if (!isExpression(arg1)) {
      return [];
    }
    const itemKey = expressionArgParser(exp.data[1]);
    const searchKeys = exp.data.slice(2, exp.data.length).map(expArg => expressionArgParser(expArg));

    const previousResponses = this.evalExpression(arg1);
    if (previousResponses.length < 1) {
      return [];
    }

    return previousResponses.filter((response: SurveySingleItemResponse) => {
      const rItem = this.retreiveObjectFromTreeBySimpleKey(response.response, itemKey) as ResponseItem;
      return searchKeys.every(sK => {
        if (!rItem || !rItem.items) { return false; }
        if (!rItem.items.find(i => i.key === sK)) {
          return false;
        }
        return true;
      });
    });
  }

  private filterResponsesByValue(exp: Expression): SurveySingleItemResponse[] {
    if (!exp.data || exp.data.length !== 3 || !exp.data[1].str || !exp.data[2].str) {
      this.logEvent('filterResponsesByValue: missing arguments');
      return [];
    }

    const arg1 = expressionArgParser(exp.data[0]);
    if (!isExpression(arg1)) {
      return [];
    }
    const itemKey = expressionArgParser(exp.data[1]);
    const expectedValue = expressionArgParser(exp.data[2]);

    const previousResponses = this.evalExpression(arg1);
    if (previousResponses.length < 1) {
      return [];
    }

    return previousResponses.filter((response: SurveySingleItemResponse) => {
      const rItem = this.retreiveObjectFromTreeBySimpleKey(response.response, itemKey) as ResponseItem;
      if (!rItem || !rItem.value) { return false; }
      return rItem.value === expectedValue;
    });
  }

  private getLastFromSurveyItemResponses(exp: Expression): SurveySingleItemResponse | undefined {
    if (!exp.data || exp.data.length !== 1) {
      this.logEvent('getLastFromSurveyItemResponses: missing arguments');
      return undefined;
    }

    const arg1 = expressionArgParser(exp.data[0]);
    if (!isExpression(arg1)) {
      return undefined;
    }

    const previousResponses = this.evalExpression(arg1);
    if (previousResponses.length < 1) {
      return undefined;
    }
    const sorted = previousResponses.sort((a: SurveySingleItemResponse, b: SurveySingleItemResponse) => {
      if (!a.meta || !b.meta) {
        return 0;
      }
      const aTs = Math.max(...a.meta.responded);
      const bTs = Math.max(...b.meta.responded);
      return bTs - aTs;
    });
    return sorted[0];
  }

  private getSecondsSince(exp: Expression): number | undefined {
    if (!exp.data || exp.data.length !== 1) {
      this.logEvent('getSecondsSince: missing argument');
      return undefined;
    }
    const arg1 = expressionArgParser(exp.data[0]);
    const a = isExpression(arg1) ? this.evalExpression(arg1) : arg1;
    if (!a || typeof (a) !== 'number') { return undefined; }
    const now = Date.now() / 1000.0;
    return now - a;
  }

  private timestampWithOffset(exp: Expression): number | undefined {
    if (!exp.data || (exp.data.length !== 1 && exp.data.length !== 2)) {
      this.logEvent('timestampWithOffset: unexpected arguments');
      return undefined;
    }
    const arg1 = expressionArgParser(exp.data[0]);
    const a = isExpression(arg1) ? this.evalExpression(arg1) : arg1;
    if (a === undefined || typeof (a) !== 'number') { return undefined; }

    let referenceTime = Date.now() / 1000.0;
    if (exp.data.length === 2) {
      const arg2 = expressionArgParser(exp.data[1]);
      const b = isExpression(arg2) ? this.evalExpression(arg2) : arg2;
      if (b === undefined || typeof (b) !== 'number') { return undefined; }
      referenceTime = b;
    }
    return referenceTime + a;
  }

  private dateResponseDiffFromNow(exp: Expression): number | undefined {
    if (!exp.data || exp.data.length < 3) {
      this.logEvent('dateResponseDiffFromNow: missing arguments');
      return undefined;
    }
    const unit = expressionArgParser(exp.data[2]);
    const ignoreSign = (exp.data.length === 4 && exp.data[3].num === 1) ? true : false;

    const responseItem = this.getResponseItem({
      name: 'getResponseItem',
      data: [
        exp.data[0],
        exp.data[1],
      ]
    });

    if (!responseItem || !responseItem.value) {
      return;
    }
    if (responseItem.dtype !== 'date') {
      this.logEvent(`dateResponseDiffFromNow should receive response type 'date', but got ${responseItem.dtype}`);
      return;
    }
    const ts = moment.unix(parseFloat(responseItem.value));
    const now = moment();
    const diff = ts.diff(now, unit);
    if (ignoreSign) {
      return Math.abs(diff);
    }
    return diff;
  }

  private typeConvert(value: any, dtype: string): any {
    switch (dtype) {
      case 'int':
        return typeof (value) === 'string' ? parseInt(value) : Math.floor(value);
      case 'float':
        return typeof (value) === 'string' ? parseFloat(value) : value;
      default:
        this.logEvent('typeConvert: dtype is not known: ' + dtype);
        return value;
    }
  }
}

