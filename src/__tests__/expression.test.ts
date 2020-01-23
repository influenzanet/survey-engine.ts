import { Expression, SurveyGroupItem, SurveyItemResponse } from '../data_types';
import { ExpressionEval } from '../expression-eval';


// ---------- LOGIC OPERATORS ----------------
test('testing OR expression', () => {
    const expEval = new ExpressionEval();
    expect(expEval.eval({ name: 'or', data: [{ dtype: 'num', num: 1 }, { dtype: 'num', num: 0 }] })).toBeTruthy();
    expect(expEval.eval({ name: 'or', data: [{ dtype: 'num', num: 0 }, { dtype: 'num', num: 1 }] })).toBeTruthy();
    expect(expEval.eval({ name: 'or', data: [{ dtype: 'num', num: 1 }, { dtype: 'num', num: 1 }] })).toBeTruthy();
    expect(expEval.eval({ name: 'or', data: [{ dtype: 'num', num: 0 }, { dtype: 'num', num: 0 }] })).toBeFalsy();
});

test('testing AND expression', () => {
    const expEval = new ExpressionEval();
    expect(expEval.eval({ name: 'and', data: [{ dtype: 'num', num: 1 }, { dtype: 'num', num: 0 }] })).toBeFalsy();
    expect(expEval.eval({ name: 'and', data: [{ dtype: 'num', num: 0 }, { dtype: 'num', num: 1 }] })).toBeFalsy();
    expect(expEval.eval({ name: 'and', data: [{ dtype: 'num', num: 1 }, { dtype: 'num', num: 1 }] })).toBeTruthy();
    expect(expEval.eval({ name: 'and', data: [{ dtype: 'num', num: 0 }, { dtype: 'num', num: 0 }] })).toBeFalsy();
});

test('testing NOT expression', () => {
    const trueExp: Expression = { name: 'and', data: [{ dtype: 'num', num: 1 }, { dtype: 'num', num: 1 }] }
    const falseExp: Expression = { name: 'and', data: [{ dtype: 'num', num: 0 }, { dtype: 'num', num: 1 }] }

    const expEval = new ExpressionEval();
    expect(expEval.eval({ name: 'not', data: [{ dtype: 'exp', exp: trueExp }] })).toBeFalsy();
    expect(expEval.eval({ name: 'not', data: [{ dtype: 'exp', exp: falseExp }] })).toBeTruthy();
});


// ---------- COMPARISONS ----------------
test('testing EQ expression', () => {
    const expEval = new ExpressionEval();
    // numbers
    expect(expEval.eval({ name: 'eq', data: [{ dtype: 'num', num: 1 }, { dtype: 'num', num: 0 }] })).toBeFalsy();
    expect(expEval.eval({ name: 'eq', data: [{ dtype: 'num', num: 1 }, { dtype: 'num', num: 1 }] })).toBeTruthy();

    // strings
    expect(expEval.eval({ name: 'eq', data: [{ dtype: 'str', str: "test1" }, { dtype: 'str', str: "test2" }] })).toBeFalsy();
    expect(expEval.eval({ name: 'eq', data: [{ dtype: 'str', str: "test1" }, { dtype: 'str', str: "test1" }] })).toBeTruthy();
})

test('testing LT expression', () => {
    const expEval = new ExpressionEval();
    // numbers
    expect(expEval.eval({ name: 'lt', data: [{ dtype: 'num', num: 3 }, { dtype: 'num', num: 2 }] })).toBeFalsy();
    expect(expEval.eval({ name: 'lt', data: [{ dtype: 'num', num: 2 }, { dtype: 'num', num: 2 }] })).toBeFalsy();
    expect(expEval.eval({ name: 'lt', data: [{ dtype: 'num', num: 1 }, { dtype: 'num', num: 2 }] })).toBeTruthy();

    // strings
    expect(expEval.eval({ name: 'lt', data: [{ dtype: 'str', str: "test3" }, { dtype: 'str', str: "test2" }] })).toBeFalsy();
    expect(expEval.eval({ name: 'lt', data: [{ dtype: 'str', str: "test2" }, { dtype: 'str', str: "test2" }] })).toBeFalsy();
    expect(expEval.eval({ name: 'lt', data: [{ dtype: 'str', str: "test1" }, { dtype: 'str', str: "test2" }] })).toBeTruthy();
})

test('testing LTE expression', () => {
    const expEval = new ExpressionEval();
    // numbers
    expect(expEval.eval({ name: 'lte', data: [{ dtype: 'num', num: 3 }, { dtype: 'num', num: 2 }] })).toBeFalsy();
    expect(expEval.eval({ name: 'lte', data: [{ dtype: 'num', num: 2 }, { dtype: 'num', num: 2 }] })).toBeTruthy();
    expect(expEval.eval({ name: 'lte', data: [{ dtype: 'num', num: 1 }, { dtype: 'num', num: 2 }] })).toBeTruthy();

    // strings
    expect(expEval.eval({ name: 'lte', data: [{ dtype: 'str', str: "test3" }, { dtype: 'str', str: "test2" }] })).toBeFalsy();
    expect(expEval.eval({ name: 'lte', data: [{ dtype: 'str', str: "test2" }, { dtype: 'str', str: "test2" }] })).toBeTruthy();
    expect(expEval.eval({ name: 'lte', data: [{ dtype: 'str', str: "test1" }, { dtype: 'str', str: "test2" }] })).toBeTruthy();
})

test('testing GT expression', () => {
    const expEval = new ExpressionEval();
    // numbers
    expect(expEval.eval({ name: 'gt', data: [{ dtype: 'num', num: 3 }, { dtype: 'num', num: 2 }] })).toBeTruthy();
    expect(expEval.eval({ name: 'gt', data: [{ dtype: 'num', num: 2 }, { dtype: 'num', num: 2 }] })).toBeFalsy();
    expect(expEval.eval({ name: 'gt', data: [{ dtype: 'num', num: 1 }, { dtype: 'num', num: 2 }] })).toBeFalsy();

    // strings
    expect(expEval.eval({ name: 'gt', data: [{ dtype: 'str', str: "test3" }, { dtype: 'str', str: "test2" }] })).toBeTruthy();
    expect(expEval.eval({ name: 'gt', data: [{ dtype: 'str', str: "test2" }, { dtype: 'str', str: "test2" }] })).toBeFalsy();
    expect(expEval.eval({ name: 'gt', data: [{ dtype: 'str', str: "test1" }, { dtype: 'str', str: "test2" }] })).toBeFalsy();
})

test('testing GTE expression', () => {
    const expEval = new ExpressionEval();
    // numbers
    expect(expEval.eval({ name: 'gte', data: [{ dtype: 'num', num: 3 }, { dtype: 'num', num: 2 }] })).toBeTruthy();
    expect(expEval.eval({ name: 'gte', data: [{ dtype: 'num', num: 2 }, { dtype: 'num', num: 2 }] })).toBeTruthy();
    expect(expEval.eval({ name: 'gte', data: [{ dtype: 'num', num: 1 }, { dtype: 'num', num: 2 }] })).toBeFalsy();

    // strings
    expect(expEval.eval({ name: 'gte', data: [{ dtype: 'str', str: "test3" }, { dtype: 'str', str: "test2" }] })).toBeTruthy();
    expect(expEval.eval({ name: 'gte', data: [{ dtype: 'str', str: "test2" }, { dtype: 'str', str: "test2" }] })).toBeTruthy();
    expect(expEval.eval({ name: 'gte', data: [{ dtype: 'str', str: "test1" }, { dtype: 'str', str: "test2" }] })).toBeFalsy();
})

test('testing expression: isDefined', () => {
    const expEval = new ExpressionEval();
    const testSurveyResponses: SurveyItemResponse = {
        key: 'TS',
        meta: { position: 0, localeCode: 'de', version: 1, rendered: [], displayed: [], responded: [] },
        items: [
            {
                key: 'TS.I1',
                meta: { position: 0, localeCode: 'de', version: 1, rendered: [], displayed: [], responded: [] },
                response: {
                    key: 'R1',
                }
            }
        ]
    }


    expect(expEval.eval({
        name: 'isDefined', data: [
            {
                dtype: 'exp', exp: {
                    name: 'getObjByHierarchicalKey',
                    data: [
                        { dtype: 'exp', exp: { name: 'getResponses' } },
                        { dtype: 'str', str: 'TS.I1' }
                    ]
                }
            }
        ]
    }, undefined, undefined, testSurveyResponses)).toBeTruthy();

    expect(expEval.eval({
        name: 'isDefined', data: [
            {
                dtype: 'exp', exp: {
                    name: 'getObjByHierarchicalKey',
                    data: [
                        { dtype: 'exp', exp: { name: 'getResponses' } },
                        { dtype: 'str', str: 'TS.IWRONG' }
                    ]
                }
            }
        ]
    }, undefined, undefined, testSurveyResponses)).toBeFalsy();
})

// ---------- ROOT REFERENCES ----------------
test('testing expression: getContext', () => {
    const expEval = new ExpressionEval();
    expect(expEval.eval({ name: 'getContext' })).toBeUndefined();
    expect(expEval.eval({ name: 'getContext' }, undefined, {
        mode: 'test',
    })).toBeDefined();
})

test('testing expression: getResponses', () => {
    const expEval = new ExpressionEval();
    expect(expEval.eval({ name: 'getResponses' })).toBeUndefined();
    expect(expEval.eval({ name: 'getResponses' }, undefined, undefined, {
        key: 'test',
        meta: { position: 0, localeCode: 'de', version: 1, rendered: [], displayed: [], responded: [] },
        items: []
    })).toBeDefined();
})

test('testing expression: getRenderedItems', () => {
    const expEval = new ExpressionEval();
    expect(expEval.eval({ name: 'getRenderedItems' })).toBeUndefined();
    expect(expEval.eval({ name: 'getRenderedItems' }, {
        key: 'test',
        items: []
    })).toBeDefined();
})

// ---------- WORKING WITH OBJECT/ARRAYS ----------------
test('testing expression: getAttribute', () => {
    const expEval = new ExpressionEval();

    expect(expEval.eval(
        {
            name: 'getAttribute',
            returnType: 'float',
            data: [
                { dtype: 'exp', exp: { name: 'getContext' } },
                { dtype: 'str', str: 'profile' }
            ]
        }
        , undefined, {
        mode: 'test',
        profile: 1.453,
    })).toEqual(1.453);

    expect(expEval.eval(
        {
            name: 'getAttribute',
            returnType: 'float',
            data: [
                { dtype: 'exp', exp: { name: 'getContext' } },
                { dtype: 'str', str: 'notexisting' }
            ]
        }
        , undefined, {
        mode: 'test',
        profile: 1,
    })).toBeUndefined();
})

test('testing expression: getArrayItemAtIndex', () => {
    const expEval = new ExpressionEval();
    const testSurveyResponses: SurveyItemResponse = {
        key: 'TS',
        meta: { position: 0, localeCode: 'de', version: 1, rendered: [], displayed: [], responded: [] },
        items: [
            {
                key: 'TS.I1',
                meta: { position: 0, localeCode: 'de', version: 1, rendered: [], displayed: [], responded: [] },
                response: {
                    key: 'R1',
                    value: 'testvalue'
                }
            },
            {
                key: 'TS.I2',
                meta: { position: 0, localeCode: 'de', version: 1, rendered: [], displayed: [], responded: [] },
                response: {
                    key: 'R1',
                    value: 'testvalue2'
                }
            }
        ]
    }

    expect(expEval.eval(
        {
            name: 'getArrayItemAtIndex',
            data: [
                {
                    dtype: 'exp', exp: {
                        name: 'getAttribute', data: [
                            { dtype: 'exp', exp: { name: 'getResponses' } },
                            { dtype: 'str', str: 'items' }
                        ]
                    }
                },
                { dtype: 'num', num: 0 }
            ]
        }, undefined, undefined, testSurveyResponses).response.value).toEqual('testvalue');

    expect(expEval.eval(
        {
            name: 'getArrayItemAtIndex',
            data: [
                {
                    dtype: 'exp', exp: {
                        name: 'getAttribute', data: [
                            { dtype: 'exp', exp: { name: 'getResponses' } },
                            { dtype: 'str', str: 'items' }
                        ]
                    }
                },
                { dtype: 'num', num: 1 }
            ]
        }, undefined, undefined, testSurveyResponses).response.value).toEqual('testvalue2');

    expect(expEval.eval(
        {
            name: 'getArrayItemAtIndex',
            data: [
                {
                    dtype: 'exp', exp: {
                        name: 'getAttribute', data: [
                            { dtype: 'exp', exp: { name: 'getResponses' } },
                            { dtype: 'str', str: 'items' }
                        ]
                    }
                },
                { dtype: 'num', num: 2 }
            ]
        }, undefined, undefined, testSurveyResponses)).toBeUndefined();
})

test('testing expression: getArrayItemByKey', () => {
    const expEval = new ExpressionEval();
    const testSurveyResponses: SurveyItemResponse = {
        key: 'TS',
        meta: { position: 0, localeCode: 'de', version: 1, rendered: [], displayed: [], responded: [] },
        items: [
            {
                key: 'TS.I1',
                meta: { position: 0, localeCode: 'de', version: 1, rendered: [], displayed: [], responded: [] },
                response: {
                    key: 'R1',
                    value: 'testvalue'
                }
            },
            {
                key: 'TS.I2',
                meta: { position: 0, localeCode: 'de', version: 1, rendered: [], displayed: [], responded: [] },
                response: {
                    key: 'R1',
                    value: 'testvalue2'
                }
            }
        ]
    }

    expect(expEval.eval(
        {
            name: 'getArrayItemByKey',
            data: [
                {
                    dtype: 'exp', exp: {
                        name: 'getAttribute', data: [
                            { dtype: 'exp', exp: { name: 'getResponses' } },
                            { dtype: 'str', str: 'items' }
                        ]
                    }
                },
                { dtype: 'str', str: 'TS.I1' }]
        }, undefined, undefined, testSurveyResponses).response.value).toEqual('testvalue');

    expect(expEval.eval(
        {
            name: 'getArrayItemByKey',
            data: [
                {
                    dtype: 'exp', exp: {
                        name: 'getAttribute', data: [
                            { dtype: 'exp', exp: { name: 'getResponses' } },
                            { dtype: 'str', str: 'items' }
                        ]
                    }
                },
                { dtype: 'str', str: 'TS.I2' }]
        }, undefined, undefined, testSurveyResponses).response.value).toEqual('testvalue2');

    expect(expEval.eval(
        {
            name: 'getArrayItemByKey',
            data: [
                {
                    dtype: 'exp', exp: {
                        name: 'getAttribute', data: [
                            { dtype: 'exp', exp: { name: 'getResponses' } },
                            { dtype: 'str', str: 'items' }
                        ]
                    }
                },
                { dtype: 'str', str: 'TS.IWRONG' }]
        }, undefined, undefined, testSurveyResponses)).toBeNull();
})

test('testing expression: getObjByHierarchicalKey', () => {
    const expEval = new ExpressionEval();
    const testSurveyResponses: SurveyItemResponse = {
        key: 'TS',
        meta: { position: 0, localeCode: 'de', version: 1, rendered: [], displayed: [], responded: [] },
        items: [
            {
                key: 'TS.I1',
                meta: { position: 0, localeCode: 'de', version: 1, rendered: [], displayed: [], responded: [] },
                response: {
                    key: 'R1',
                    value: 'testvalue'
                }
            }
        ]
    }

    // Using survey item responses
    expect(expEval.eval(
        {
            name: 'getObjByHierarchicalKey',
            data: [
                { dtype: 'exp', exp: { name: 'getResponses' } },
                { dtype: 'str', str: 'TS.I1' }]
        }, undefined, undefined, testSurveyResponses).response.value).toEqual('testvalue');

    expect(expEval.eval({
        name: 'getObjByHierarchicalKey',
        data: [
            { dtype: 'exp', exp: { name: 'getResponses' } },
            { dtype: 'str', str: 'TS.IWRONG' }
        ]
    }, undefined, undefined, testSurveyResponses)).toBeNull();
})
