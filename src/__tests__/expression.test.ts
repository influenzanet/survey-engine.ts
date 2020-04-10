import { Expression, SurveyItemResponse, SurveySingleItem, SurveyContext, ExpressionArg, ExpressionArgDType } from '../data_types';
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
    expect(expEval.eval({ name: 'eq', data: [{ str: "test1" }, { str: "test1" }] })).toBeTruthy();
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
        version: 1,
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

test('testing expression: getResponseItem', () => {
    const expEval = new ExpressionEval();
    const testSurveyResponses: SurveyItemResponse = {
        key: 'TS',
        meta: { position: 0, localeCode: 'de', version: 1, rendered: [], displayed: [], responded: [] },
        items: [
            {
                key: 'TS.I1',
                meta: { position: 0, localeCode: 'de', version: 1, rendered: [], displayed: [], responded: [] },
                response: {
                    key: 'RG1',
                    items: [
                        { key: 'R1', value: 'testvalue' }
                    ]
                }
            }
        ]
    }

    expect(expEval.eval({
        name: 'getResponseItem',
        data: [
            { str: 'TS.I1' },
            { str: 'RG1.R1' }
        ]
    }, undefined, undefined, testSurveyResponses).value).toEqual('testvalue');

    expect(expEval.eval({
        name: 'getResponseItem',
        data: [
            { str: 'TS.I1' },
            { str: 'RG1' }
        ]
    }, undefined, undefined, testSurveyResponses).items).toHaveLength(1);

    expect(expEval.eval({
        name: 'getResponseItem',
        data: [
            { str: 'TS.I1' },
            { str: 'SOMETHING' }
        ]
    }, undefined, undefined, testSurveyResponses)).toBeUndefined();
})

test('testing expression: getSurveyItemValidation', () => {
    const expEval = new ExpressionEval();
    const testRenderedSurveyItem: SurveySingleItem = {
        key: 'TS',
        version: 1,
        type: 'test',
        components: {
            role: 'root',
            items: []
        },
        validations: [
            {
                key: 'v1',
                type: 'hard',
                rule: true
            },
            {
                key: 'v2',
                type: 'hard',
                rule: false
            }
        ]
    }

    expect(expEval.eval({
        name: 'getSurveyItemValidation',
        data: [
            { str: 'this' },
            { str: 'v1' }
        ]
    }, undefined, undefined, undefined, testRenderedSurveyItem)).toBeTruthy();

    expect(expEval.eval({
        name: 'getSurveyItemValidation',
        data: [
            { str: 'this' },
            { str: 'v2' }
        ]
    }, undefined, undefined, undefined, testRenderedSurveyItem)).toBeFalsy();

    expect(expEval.eval({
        name: 'getSurveyItemValidation',
        data: [
            { str: 'this' },
            { str: 'v3' }
        ]
    }, undefined, undefined, undefined, testRenderedSurveyItem)).toBeTruthy();
})

// ---------- QUERY METHODS ----------------
test('testing expression: findPreviousSurveyResponsesByKey', () => {
    const context: SurveyContext = {
        previousResponses: [
            { key: 'intake', submittedAt: 1000000, submittedBy: 'test', submittedFor: 'test', responses: [] },
            { key: 'weekly', submittedAt: 1200000, submittedBy: 'test', submittedFor: 'test', responses: [] },
            { key: 'weekly', submittedAt: 1300000, submittedBy: 'test', submittedFor: 'test', responses: [] }
        ]
    }
    const expEval = new ExpressionEval();
    expect(expEval.eval({ name: 'findPreviousSurveyResponsesByKey', data: [{ str: 'weekly' }] })).toHaveLength(0);
    expect(expEval.eval({ name: 'findPreviousSurveyResponsesByKey', data: [{ str: 'weekly' }] }, undefined, context)).toHaveLength(2);
})

test('testing expression: getLastFromSurveyResponses', () => {
    const context: SurveyContext = {
        previousResponses: [
            { key: 'intake', submittedAt: 1000000, submittedBy: 'test', submittedFor: 'test', responses: [] },
            { key: 'weekly', submittedAt: 1200000, submittedBy: 'first', submittedFor: 'test', responses: [] },
            { key: 'weekly', submittedAt: 1300000, submittedBy: 'last', submittedFor: 'test', responses: [] }
        ]
    }

    const expEval = new ExpressionEval();
    expect(expEval.eval({ name: 'getLastFromSurveyResponses', data: [{ str: 'weekly' }] })).toBeUndefined();
    expect(expEval.eval({ name: 'getLastFromSurveyResponses', data: [{ str: 'weekly' }] }, undefined, context).submittedBy).toEqual('last');
})

test('testing expression: getPreviousResponses', () => {
    const context: SurveyContext = {
        previousResponses: [
            { key: 'intake', submittedAt: 1000000, submittedBy: 'test', submittedFor: 'test', responses: [] },
            {
                key: 'weekly', submittedAt: 1200000, submittedBy: 'first', submittedFor: 'test', responses: [
                    { key: 'weekly.q1', meta: { position: 0, rendered: [10], responded: [10], displayed: [10] }, response: { key: '1', value: 'test1' } },
                    { key: 'weekly.q2', meta: { position: 0, rendered: [10], responded: [10], displayed: [10] }, response: { key: '1', value: 'test2' } }
                ]
            },
            {
                key: 'weekly', submittedAt: 1300000, submittedBy: 'last', submittedFor: 'test', responses: [
                    { key: 'weekly.q1', meta: { position: 0, rendered: [10], responded: [10], displayed: [10] }, response: { key: '1', value: 'test3' } },
                    { key: 'weekly.q2', meta: { position: 0, rendered: [10], responded: [10], displayed: [10] }, response: { key: '1', value: 'test4' } }
                ]
            }
        ]
    }

    const expEval = new ExpressionEval();
    expect(expEval.eval({ name: 'getPreviousResponses', data: [{ str: 'weekly.q1' }] })).toHaveLength(0);
    expect(expEval.eval({ name: 'getPreviousResponses', data: [{ str: 'weekly.q1' }] }, undefined, context)).toHaveLength(2);
})

test('testing expression: filterResponsesByIncludesKeys', () => {
    const context: SurveyContext = {
        previousResponses: [
            { key: 'intake', submittedAt: 1000000, submittedBy: 'test', submittedFor: 'test', responses: [] },
            {
                key: 'weekly', submittedAt: 1200000, submittedBy: 'first', submittedFor: 'test', responses: [
                    { key: 'weekly.q1', meta: { position: 0, rendered: [10], responded: [10], displayed: [10] }, response: { key: '1', value: 'test1' } },
                    {
                        key: 'weekly.q2', meta: { position: 0, rendered: [10], responded: [10], displayed: [10] }, response: {
                            key: '1', items: [
                                { key: '1', items: [{ key: '1' }] }
                            ]
                        }
                    }
                ]
            },
            {
                key: 'weekly', submittedAt: 1300000, submittedBy: 'last', submittedFor: 'test', responses: [
                    { key: 'weekly.q1', meta: { position: 0, rendered: [10], responded: [10], displayed: [10] }, response: { key: '1', value: 'test3' } },
                    {
                        key: 'weekly.q2', meta: { position: 0, rendered: [10], responded: [10], displayed: [10] }, response: {
                            key: '1', items: [
                                { key: '1', items: [{ key: '1' }, { key: '2' }] }
                            ]
                        }
                    }
                ]
            }
        ]
    }

    const expEval = new ExpressionEval();
    expect(expEval.eval({
        name: 'filterResponsesByIncludesKeys', data: [
            { dtype: 'exp', exp: { name: 'getPreviousResponses', data: [{ str: 'weekly.q2' }] } },
            { str: '1.1' },
            { str: '2' },
        ]
    })).toHaveLength(0);

    expect(expEval.eval({
        name: 'filterResponsesByIncludesKeys', data: [
            { dtype: 'exp', exp: { name: 'getPreviousResponses', data: [{ str: 'weekly.q2' }] } },
            { str: '1.1' },
            { str: '2' },
        ]
    }, undefined, context)).toHaveLength(1);

    expect(expEval.eval({
        name: 'filterResponsesByIncludesKeys', data: [
            { dtype: 'exp', exp: { name: 'getPreviousResponses', data: [{ str: 'weekly.q2' }] } },
            { str: '1.1' },
            { str: '1' },
            { str: '2' },
        ]
    }, undefined, context)).toHaveLength(1);

    expect(expEval.eval({
        name: 'filterResponsesByIncludesKeys', data: [
            { exp: { name: 'getPreviousResponses', data: [{ str: 'weekly.q2' }] } },
            { str: '1.1' },
            { str: '3' },
        ]
    }, undefined, context)).toHaveLength(0);
})

test('testing expression: filterResponsesByValue', () => {
    const context: SurveyContext = {
        previousResponses: [
            { key: 'intake', submittedAt: 1000000, submittedBy: 'test', submittedFor: 'test', responses: [] },
            {
                key: 'weekly', submittedAt: 1200000, submittedBy: 'first', submittedFor: 'test', responses: [
                    { key: 'weekly.q1', meta: { position: 0, rendered: [10], responded: [10], displayed: [10] }, response: { key: '1', value: 'test1' } },
                    {
                        key: 'weekly.q2', meta: { position: 0, rendered: [10], responded: [10], displayed: [10] }, response: {
                            key: '1', items: [
                                { key: '1', value: 'test1' }
                            ]
                        }
                    }
                ]
            },
            {
                key: 'weekly', submittedAt: 1300000, submittedBy: 'last', submittedFor: 'test', responses: [
                    { key: 'weekly.q1', meta: { position: 0, rendered: [10], responded: [10], displayed: [10] }, response: { key: '1', value: 'test3' } },
                    {
                        key: 'weekly.q2', meta: { position: 0, rendered: [10], responded: [10], displayed: [10] }, response: {
                            key: '1', items: [
                                { key: '1', value: 'test2' }
                            ]
                        }
                    }
                ]
            }
        ]
    }

    const expEval = new ExpressionEval();
    expect(expEval.eval({
        name: 'filterResponsesByValue', data: [
            { dtype: 'exp', exp: { name: 'getPreviousResponses', data: [{ str: 'weekly.q2' }] } },
            { str: '1.1' },
            { str: 'test1' },
        ]
    })).toHaveLength(0);

    expect(expEval.eval({
        name: 'filterResponsesByValue', data: [
            { dtype: 'exp', exp: { name: 'getPreviousResponses', data: [{ str: 'weekly.q2' }] } },
            { str: '1.1' },
            { str: 'test1' },
        ]
    }, undefined, context)).toHaveLength(1);

    expect(expEval.eval({
        name: 'filterResponsesByValue', data: [
            { dtype: 'exp', exp: { name: 'getPreviousResponses', data: [{ str: 'weekly.q2' }] } },
            { str: '1.1' },
            { str: 'test2' },
        ]
    }, undefined, context)).toHaveLength(1);

    expect(expEval.eval({
        name: 'filterResponsesByValue', data: [
            { exp: { name: 'getPreviousResponses', data: [{ str: 'weekly.q2' }] } },
            { str: '1.1' },
            { str: 'test3' },
        ]
    }, undefined, context)).toHaveLength(0);
})


test('testing expression: getLastFromSurveyItemResponses', () => {
    const context: SurveyContext = {
        previousResponses: [
            { key: 'intake', submittedAt: 1000000, submittedBy: 'test', submittedFor: 'test', responses: [] },
            {
                key: 'weekly', submittedAt: 1200000, submittedBy: 'first', submittedFor: 'test', responses: [
                    { key: 'weekly.q1', meta: { position: 0, rendered: [10], responded: [10], displayed: [10] }, response: { key: '1', value: 'test1' } },
                    {
                        key: 'weekly.q2', meta: { position: 0, rendered: [10], responded: [10], displayed: [10] }, response: {
                            key: '1', items: [
                                { key: '1', value: 'test1' }
                            ]
                        }
                    }
                ]
            },
            {
                key: 'weekly', submittedAt: 1300000, submittedBy: 'last', submittedFor: 'test', responses: [
                    { key: 'weekly.q1', meta: { position: 0, rendered: [10], responded: [20], displayed: [10] }, response: { key: '1', value: 'test3' } },
                    {
                        key: 'weekly.q2', meta: { position: 0, rendered: [10], responded: [20], displayed: [10] }, response: {
                            key: '1', items: [
                                { key: '1', value: 'test2' }
                            ]
                        }
                    }
                ]
            }
        ]
    }

    const expEval = new ExpressionEval();
    expect(expEval.eval({
        name: 'getLastFromSurveyItemResponses', data: [
            { dtype: 'exp', exp: { name: 'getPreviousResponses', data: [{ str: 'weekly.q2' }] } }
        ]
    })).toBeUndefined();

    expect(expEval.eval({
        name: 'getLastFromSurveyItemResponses', data: [
            { dtype: 'exp', exp: { name: 'getPreviousResponses', data: [{ str: 'weekly.q2' }] } },
        ]
    }, undefined, context).response.items[0].value).toEqual('test2');
})

test('testing expression: getSecondsSince', () => {
    const context: SurveyContext = {
        previousResponses: [
            { key: 'intake', submittedAt: 1000000, submittedBy: 'test', submittedFor: 'test', responses: [] },
            {
                key: 'weekly', submittedAt: 1200000, submittedBy: 'first', submittedFor: 'test', responses: [
                    { key: 'weekly.q1', meta: { position: 0, rendered: [10], responded: [10], displayed: [10] }, response: { key: '1', value: 'test1' } },
                    {
                        key: 'weekly.q2', meta: { position: 0, rendered: [10], responded: [10], displayed: [10] }, response: {
                            key: '1', items: [
                                { key: '1.1', value: 'test1' }
                            ]
                        }
                    }
                ]
            },
            {
                key: 'weekly', submittedAt: 1300000, submittedBy: 'last', submittedFor: 'test', responses: [
                    { key: 'weekly.q1', meta: { position: 0, rendered: [10], responded: [20], displayed: [10] }, response: { key: '1', value: 'test3' } },
                    {
                        key: 'weekly.q2', meta: { position: 0, rendered: [10], responded: [Date.now() - 100], displayed: [10] }, response: {
                            key: '1', items: [
                                { key: '1.1', value: 'test2' }
                            ]
                        }
                    }
                ]
            }
        ]
    }

    const expEval = new ExpressionEval();
    expect(expEval.eval({
        name: 'getSecondsSince', data: [
            { dtype: 'num', num: Date.now() - 10 }
        ]
    })).toBeGreaterThanOrEqual(10);
    expect(expEval.eval({
        name: 'getSecondsSince', data: [
            { dtype: 'num', num: Date.now() - 10 }
        ]
    })).toBeLessThan(30);


    // result is not a number
    expect(expEval.eval({
        name: 'getSecondsSince', data: [
            { dtype: 'exp', exp: { name: 'getPreviousResponses', data: [{ str: 'weekly.q2' }] } }
        ]
    })).toBeUndefined();

    const getLastResp: ExpressionArg = {
        dtype: 'exp', exp: {
            name: 'getLastFromSurveyItemResponses', data: [
                { dtype: 'exp', exp: { name: 'getPreviousResponses', data: [{ str: 'weekly.q2' }] } }
            ]
        }
    };

    const getMeta: ExpressionArg = {
        dtype: 'exp', exp: {
            name: 'getAttribute', data: [
                getLastResp,
                { str: 'meta' }
            ]
        }
    };

    const getResponded: ExpressionArg = {
        dtype: 'exp', exp: {
            name: 'getAttribute', data: [
                getMeta,
                { str: 'responded' }
            ]
        }
    };

    const expRes = expEval.eval({
        name: 'getSecondsSince', data: [
            {
                dtype: 'exp', exp: {
                    name: 'getArrayItemAtIndex', data: [
                        getResponded,
                        { dtype: 'num', num: 0 }
                    ]
                }
            },
        ]
    }, undefined, context);
    expect(expRes).toBeGreaterThan(90);
    expect(expRes).toBeLessThan(190);
})