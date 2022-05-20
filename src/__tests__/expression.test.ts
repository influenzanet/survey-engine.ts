import { Expression, SurveyItemResponse, SurveySingleItem, SurveyContext, ExpressionArg, ExpressionArgDType, SurveyGroupItemResponse } from '../data_types';
import { ExpressionEval } from '../expression-eval';
import moment from 'moment';


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


test('testing expression: parseValueAsNum', () => {
  const expEval = new ExpressionEval();

  expect(expEval.eval({
    name: 'parseValueAsNum', data: [
      {
        dtype: 'exp', exp: {
          name: "getAttribute",
          data: [
            {
              dtype: 'exp', exp: {
                name: "getAttribute",
                data: [
                  { dtype: 'exp', exp: { name: 'getContext' } },
                  { dtype: 'str', str: 'participantFlags' }
                ],
              }
            },
            { dtype: 'str', str: 'test' }
          ]
        }
      },
    ]
  }, undefined, {
    participantFlags: {
      test: '2'
    }
  }, undefined)).toEqual(2);

  expect(expEval.eval({
    name: 'parseValueAsNum', data: [
      {
        dtype: 'exp', exp: {
          name: "getAttribute",
          data: [
            {
              dtype: 'exp', exp: {
                name: "getAttribute",
                data: [
                  { dtype: 'exp', exp: { name: 'getContext' } },
                  { dtype: 'str', str: 'participantFlags' }
                ],
              }
            },
            { dtype: 'str', str: 'wrong' }
          ]
        }
      },
    ]
  }, undefined, {
    participantFlags: {
      test: '2'
    }
  }, undefined)).toBeUndefined();

});

test('testing expression: getResponseValueAsNum', () => {
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
          items: [
            { key: 'V1', value: 'not a number' },
            { key: 'V2', value: '123.23' },
            { key: 'V3' }
          ]
        }
      }
    ]
  }



  expect(expEval.eval({
    name: 'getResponseValueAsNum', data: [
      { dtype: 'str', str: 'TS.wrong' },
      { dtype: 'str', str: 'R1.V2' },
    ]
  }, undefined, undefined, testSurveyResponses)).toBeUndefined();

  expect(expEval.eval({
    name: 'getResponseValueAsNum', data: [
      { dtype: 'str', str: 'TS.I1' },
      { dtype: 'str', str: 'R1.Vwrong' },
    ]
  }, undefined, undefined, testSurveyResponses)).toBeUndefined();


  expect(expEval.eval({
    name: 'getResponseValueAsNum', data: [
      { dtype: 'str', str: 'TS.I1' },
      { dtype: 'str', str: 'R1.V3' },
    ]
  }, undefined, undefined, testSurveyResponses)).toBeUndefined();

  expect(expEval.eval({
    name: 'getResponseValueAsNum', data: [
      { dtype: 'str', str: 'TS.I1' },
      { dtype: 'str', str: 'R1.V1' },
    ]
  }, undefined, undefined, testSurveyResponses)).toBeNaN();

  expect(expEval.eval({
    name: 'getResponseValueAsNum', data: [
      { dtype: 'str', str: 'TS.I1' },
      { dtype: 'str', str: 'R1.V2' },
    ]
  }, undefined, undefined, testSurveyResponses)).toEqual(123.23);
});

test('testing expression: getResponseValueAsStr', () => {
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
          items: [
            { key: 'V1' },
            { key: 'V2', value: 'something' }
          ]
        }
      }
    ]
  }

  expect(expEval.eval({
    name: 'getResponseValueAsStr', data: [
      { dtype: 'str', str: 'TS.wrong' },
      { dtype: 'str', str: 'R1.V2' },
    ]
  }, undefined, undefined, testSurveyResponses)).toBeUndefined();

  expect(expEval.eval({
    name: 'getResponseValueAsStr', data: [
      { dtype: 'str', str: 'TS.I1' },
      { dtype: 'str', str: 'R1.Vwrong' },
    ]
  }, undefined, undefined, testSurveyResponses)).toBeUndefined();

  expect(expEval.eval({
    name: 'getResponseValueAsStr', data: [
      { dtype: 'str', str: 'TS.I1' },
      { dtype: 'str', str: 'R1.V1' },
    ]
  }, undefined, undefined, testSurveyResponses)).toBeUndefined();

  expect(expEval.eval({
    name: 'getResponseValueAsStr', data: [
      { dtype: 'str', str: 'TS.I1' },
      { dtype: 'str', str: 'R1.V2' },
    ]
  }, undefined, undefined, testSurveyResponses)).toEqual("something");
});


test('testing expression: regexp', () => {
  const expEval = new ExpressionEval();
  const testSurveyResponses: SurveyItemResponse = {
    key: 'TS',
    items: [
      {
        key: 'TS.I1',
        response: {
          key: 'R1',
        }
      },
      {
        key: 'TS.I2',
        response: {
          key: 'R1',
          value: 'test'
        }
      }
    ]
  }

  const regex1Exp: Expression = {
    name: 'checkResponseValueWithRegex', data: [
      { dtype: 'str', str: 'TS.I1' },
      { dtype: 'str', str: 'R1' },
      { dtype: 'str', str: '.*\\S.*' },
    ]
  };

  const regex2Exp: Expression = {
    name: 'checkResponseValueWithRegex', data: [
      { dtype: 'str', str: 'TS.I2' },
      { dtype: 'str', str: 'R1' },
      { dtype: 'str', str: '.*\\S.*' },
    ]
  };

  const regex3Exp: Expression = {
    name: 'checkResponseValueWithRegex', data: [
      { dtype: 'str', str: 'TS.I2' },
      { dtype: 'str', str: 'R1' },
      { dtype: 'str', str: '\\d' },
    ]
  };


  expect(expEval.eval(regex1Exp, undefined, undefined, testSurveyResponses)).toBeFalsy();
  expect(expEval.eval(regex2Exp, undefined, undefined, testSurveyResponses)).toBeTruthy();
  expect(expEval.eval(regex3Exp, undefined, undefined, testSurveyResponses)).toBeFalsy();
})

test('testing expression: timestampWithOffset', () => {
  const expEval = new ExpressionEval();

  const withWrongType: Expression = {
    name: 'timestampWithOffset', data: [
      { dtype: 'str', str: 'TS.I2' },
      { dtype: 'str', str: 'R1' },
    ]
  };

  const withMissingArgs: Expression = {
    name: 'timestampWithOffset',
  };

  const withTooManyArgs: Expression = {
    name: 'timestampWithOffset',
    data: [
      { dtype: 'num', num: 22432 },
      { dtype: 'num', num: 342345342 },
      { dtype: 'num', num: 342345342 },
    ]
  };

  const withNowAsReference: Expression = {
    name: 'timestampWithOffset',
    data: [
      { dtype: 'num', num: -1000 },
    ]
  };

  const withAbsoluteReference: Expression = {
    name: 'timestampWithOffset',
    data: [
      { dtype: 'num', num: -1000 },
      { dtype: 'num', num: 2000 },
    ]
  };

  expect(expEval.eval(withWrongType, undefined, undefined, undefined)).toBeUndefined();
  expect(expEval.eval(withMissingArgs, undefined, undefined, undefined)).toBeUndefined();
  expect(expEval.eval(withTooManyArgs, undefined, undefined, undefined)).toBeUndefined();
  expect(expEval.eval(withNowAsReference, undefined, undefined, undefined)).toBeLessThan(Date.now() - 900);
  expect(expEval.eval(withAbsoluteReference, undefined, undefined, undefined)).toEqual(1000);

})

test('testing expression: countResponseItems', () => {
  const expEval = new ExpressionEval();

  const withWrongType: Expression = {
    name: 'countResponseItems', data: [
      { dtype: 'str', str: 'TS.I2' },
      { dtype: 'num', num: 2 },
    ]
  };

  const withMissingArgs: Expression = {
    name: 'countResponseItems',
  };

  const withTooManyArgs: Expression = {
    name: 'countResponseItems',
    data: [
      { dtype: 'str', str: 'TS.I2' },
      { dtype: 'str', str: 'rg.mcg' },
      { dtype: 'str', str: 'rg.mcg' },
    ]
  };

  const withCorrectExp: Expression = {
    name: 'countResponseItems',
    data: [
      { dtype: 'str', str: 'TS.I2' },
      { dtype: 'str', str: 'rg.mcg' },
    ]
  };

  expect(expEval.eval(withWrongType, undefined, undefined, undefined)).toEqual(-1);
  expect(expEval.eval(withMissingArgs, undefined, undefined, undefined)).toEqual(-1);
  expect(expEval.eval(withTooManyArgs, undefined, undefined, undefined)).toEqual(-1);

  // missing info
  expect(expEval.eval(withCorrectExp, undefined, undefined, undefined)).toEqual(-1);


  // missing question
  expect(expEval.eval(withCorrectExp, undefined, undefined, {
    key: 'TS',
    items: [
      {
        key: 'TS.other',
        response: {
          key: 'rg',
          items: [{ key: 'mcg', items: [] }]
        }
      }
    ]
  })).toEqual(-1);

  // missing response group
  expect(expEval.eval(withCorrectExp, undefined, undefined, {
    key: 'TS',
    items: [
      {
        key: 'TS.I2',
        response: {
          key: 'rg',
          items: [{ key: 'scg', items: [] }]
        }
      }
    ]
  })).toEqual(-1);

  // zero item
  expect(expEval.eval(withCorrectExp, undefined, undefined, {
    key: 'TS',
    items: [
      {
        key: 'TS.I2',
        response: {
          key: 'rg',
          items: [{ key: 'mcg', items: [] }]
        }
      }
    ]
  })).toEqual(0);

  // with items
  expect(expEval.eval(withCorrectExp, undefined, undefined, {
    key: 'TS',
    items: [
      {
        key: 'TS.I2',
        response: {
          key: 'rg',
          items: [{ key: 'mcg', items: [{ key: '1' }] }]
        }
      }
    ]
  })).toEqual(1);
  expect(expEval.eval(withCorrectExp, undefined, undefined, {
    key: 'TS',
    items: [
      {
        key: 'TS.I2',
        response: {
          key: 'rg',
          items: [{ key: 'mcg', items: [{ key: '1' }, { key: '2' }, { key: '3' }] }]
        }
      }
    ]
  })).toEqual(3);

  // combined exp:
  const combExp: Expression = {
    name: 'gt',
    data: [
      { dtype: 'exp', exp: withCorrectExp },
      { dtype: 'num', num: 2 },
    ]
  }
  expect(expEval.eval(combExp, undefined, undefined, {
    key: 'TS',
    items: [
      {
        key: 'TS.I2',
        response: {
          key: 'rg',
          items: [{ key: 'mcg', items: [{ key: '1' }, { key: '2' }, { key: '3' }] }]
        }
      }
    ]
  })).toBeTruthy();
})

// ---------- ROOT REFERENCES ----------------
test('testing expression: getContext', () => {
  const expEval = new ExpressionEval();
  expect(expEval.eval({ name: 'getContext' })).toBeUndefined();

  const testContext = {
    mode: 'test',
    participantFlags: {
      prev: "1",
    }
  };
  expect(expEval.eval({ name: 'getContext' }, undefined, testContext)).toBeDefined();

  expect(expEval.eval(
    {
      name: 'eq', data: [
        {
          dtype: 'exp', exp: {
            name: "getAttribute",
            data: [
              {
                dtype: 'exp', exp: {
                  name: "getAttribute",
                  data: [
                    { dtype: 'exp', exp: { name: 'getContext' } },
                    { dtype: 'str', str: 'participantFlags' }
                  ],
                }
              },
              { dtype: 'str', str: 'prev' }
            ]
          }
        },
        { dtype: 'str', str: '1' }
      ]
    }
    , undefined, testContext
  )).toBeTruthy();
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
      { key: 'intake', versionId: 'wfdojsdfpo', submittedAt: 1000000, participantId: 'test', responses: [] },
      { key: 'weekly', versionId: 'wfdojsdfpo', submittedAt: 1200000, participantId: 'test', responses: [] },
      { key: 'weekly', versionId: 'wfdojsdfpo', submittedAt: 1300000, participantId: 'test', responses: [] }
    ]
  }
  const expEval = new ExpressionEval();
  expect(expEval.eval({ name: 'findPreviousSurveyResponsesByKey', data: [{ str: 'weekly' }] })).toHaveLength(0);
  expect(expEval.eval({ name: 'findPreviousSurveyResponsesByKey', data: [{ str: 'weekly' }] }, undefined, context)).toHaveLength(2);
})

test('testing expression: getLastFromSurveyResponses', () => {
  const context: SurveyContext = {
    previousResponses: [
      { key: 'intake', versionId: 'wfdojsdfpo', submittedAt: 1000000, participantId: 'test', responses: [] },
      { key: 'weekly', versionId: 'wfdojsdfpo', submittedAt: 1200000, participantId: 'test', responses: [] },
      { key: 'weekly', versionId: 'wfdojsdfpo', submittedAt: 1300000, participantId: 'test', responses: [] }
    ]
  }

  const expEval = new ExpressionEval();
  expect(expEval.eval({ name: 'getLastFromSurveyResponses', data: [{ str: 'weekly' }] })).toBeUndefined();
  expect(expEval.eval({ name: 'getLastFromSurveyResponses', data: [{ str: 'weekly' }] }, undefined, context).participantId).toEqual('test');
})

test('testing expression: getPreviousResponses', () => {
  const context: SurveyContext = {
    previousResponses: [
      { key: 'intake', versionId: 'wfdojsdfpo', submittedAt: 1000000, participantId: 'test', responses: [] },
      {
        key: 'weekly', versionId: 'wfdojsdfpo', submittedAt: 1200000, participantId: 'test', responses: [
          { key: 'weekly.q1', meta: { position: 0, rendered: [10], responded: [10], displayed: [10] }, response: { key: '1', value: 'test1' } },
          { key: 'weekly.q2', meta: { position: 0, rendered: [10], responded: [10], displayed: [10] }, response: { key: '1', value: 'test2' } }
        ]
      },
      {
        key: 'weekly', versionId: 'wfdojsdfpo', submittedAt: 1300000, participantId: 'test', responses: [
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
      { key: 'intake', versionId: 'wfdojsdfpo', submittedAt: 1000000, participantId: 'test', responses: [] },
      {
        key: 'weekly', versionId: 'wfdojsdfpo', submittedAt: 1200000, participantId: 'test', responses: [
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
        key: 'weekly', versionId: 'wfdojsdfpo', submittedAt: 1300000, participantId: 'test', responses: [
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
      { key: 'intake', versionId: 'wfdojsdfpo', submittedAt: 1000000, participantId: 'test', responses: [] },
      {
        key: 'weekly', versionId: 'wfdojsdfpo', submittedAt: 1200000, participantId: 'test', responses: [
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
        key: 'weekly', versionId: 'wfdojsdfpo', submittedAt: 1300000, participantId: 'test', responses: [
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
      { key: 'intake', versionId: 'wfdojsdfpo', submittedAt: 1000000, participantId: 'test', responses: [] },
      {
        key: 'weekly', versionId: 'wfdojsdfpo', submittedAt: 1200000, participantId: 'test', responses: [
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
        key: 'weekly', versionId: 'wfdojsdfpo', submittedAt: 1300000, participantId: 'test', responses: [
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
      { key: 'intake', versionId: 'wfdojsdfpo', submittedAt: 1000000, participantId: 'test', responses: [] },
      {
        key: 'weekly', versionId: 'wfdojsdfpo', submittedAt: 1200000, participantId: 'test', responses: [
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
        key: 'weekly', versionId: 'wfdojsdfpo', submittedAt: 1300000, participantId: 'test', responses: [
          { key: 'weekly.q1', meta: { position: 0, rendered: [10], responded: [20], displayed: [10] }, response: { key: '1', value: 'test3' } },
          {
            key: 'weekly.q2', meta: { position: 0, rendered: [10], responded: [Date.now() / 1000 - 100], displayed: [10] }, response: {
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
      { dtype: 'num', num: Date.now() / 1000 - 10 }
    ]
  })).toBeGreaterThanOrEqual(10);
  expect(expEval.eval({
    name: 'getSecondsSince', data: [
      { dtype: 'num', num: Date.now() / 1000 - 10 }
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

test('testing expression: responseHasKeysAny', () => {
  const expEval = new ExpressionEval();
  const testResp: SurveyGroupItemResponse = {
    key: '1',
    items: [
      {
        key: '1.1', response: {
          key: '1',
          items: [{
            key: '1',
            items: [{
              key: '1',
              items: [
                { key: '1' },
                { key: '2' },
                { key: '3' },
              ]
            }]
          }]
        }
      }
    ]
  }

  expect(expEval.eval(
    {
      name: 'responseHasKeysAny', data: [
        { str: '1.1' }, { str: '1.1.1' }, { str: '4' }, { str: '3' },
      ]
    }, undefined, undefined, testResp
  )).toBeTruthy();
  expect(expEval.eval(
    {
      name: 'responseHasKeysAny', data: [
        { str: '1.1' }, { str: '1.1.1' }, { str: '2' }, { str: '3' }, { str: '1' }
      ]
    }, undefined, undefined, testResp
  )).toBeTruthy();
  expect(expEval.eval(
    {
      name: 'responseHasKeysAny', data: [
        { str: '1.1' }, { str: '1.1.1' }, { str: '4' }, { str: '5' },
      ]
    }, undefined, undefined, testResp
  )).toBeFalsy();
  expect(expEval.eval(
    {
      name: 'responseHasKeysAny', data: [
        { str: '1.1' }, { str: '1.1' }, { str: '4' }, { str: '5' },
      ]
    }, undefined, undefined, testResp
  )).toBeFalsy();
  expect(expEval.eval(
    {
      name: 'responseHasKeysAny', data: [
        { str: '1' }, { str: '1.1' }, { str: '4' }, { str: '5' },
      ]
    }, undefined, undefined, testResp
  )).toBeFalsy();


});

test('testing expression: responseHasKeysAll', () => {
  const expEval = new ExpressionEval();
  const testResp: SurveyGroupItemResponse = {
    key: '1',
    items: [
      {
        key: '1.1', response: {
          key: '1',
          items: [{
            key: '1',
            items: [{
              key: '1',
              items: [
                { key: '1' },
                { key: '2' },
                { key: '3' },
              ]
            }]
          }]
        }
      }
    ]
  }

  expect(expEval.eval(
    {
      name: 'responseHasKeysAll', data: [
        { str: '1.1' }, { str: '1.1.1' }, { str: '4' }, { str: '3' },
      ]
    }, undefined, undefined, testResp
  )).toBeFalsy();
  expect(expEval.eval(
    {
      name: 'responseHasKeysAll', data: [
        { str: '1.1' }, { str: '1.1.1' }, { str: '2' }, { str: '3' }, { str: '1' }
      ]
    }, undefined, undefined, testResp
  )).toBeTruthy();
  expect(expEval.eval(
    {
      name: 'responseHasKeysAll', data: [
        { str: '1.1' }, { str: '1.1.1' }, { str: '1' }, { str: '2' },
      ]
    }, undefined, undefined, testResp
  )).toBeFalsy();
  expect(expEval.eval(
    {
      name: 'responseHasKeysAll', data: [
        { str: '1.1' }, { str: '1.1' }, { str: '4' }, { str: '5' },
      ]
    }, undefined, undefined, testResp
  )).toBeFalsy();
  expect(expEval.eval(
    {
      name: 'responseHasKeysAll', data: [
        { str: '1' }, { str: '1.1' }, { str: '4' }, { str: '5' },
      ]
    }, undefined, undefined, testResp
  )).toBeFalsy();

});

test('testing expression: hasResponse', () => {
  const expEval = new ExpressionEval();
  const testResp: SurveyGroupItemResponse = {
    key: '1',
    items: [
      {
        key: '1.1', response: {
          key: '1',
          items: [{
            key: '1',
            items: [{
              key: '1',
              items: [
                { key: '1' },
                { key: '2' },
                { key: '3' },
              ]
            }]
          }]
        }
      }
    ]
  }

  expect(expEval.eval(
    {
      name: 'hasResponse', data: [
        { str: '1.1' }, { str: '1.2' }
      ]
    }, undefined, undefined, testResp
  )).toBeFalsy();
  expect(expEval.eval(
    {
      name: 'hasResponse', data: [
        { str: '1.2' }, { str: '1.1' }
      ]
    }, undefined, undefined, testResp
  )).toBeFalsy();
  expect(expEval.eval(
    {
      name: 'hasResponse', data: [
        { str: '1.1' }, { str: '1.1' },
      ]
    }, undefined, undefined, testResp
  )).toBeTruthy();
});

test('testing expression: responseHasOnlyKeysOtherThan', () => {
  const expEval = new ExpressionEval();
  const testResp: SurveyGroupItemResponse = {
    key: '1',
    items: [
      {
        key: '1.1', response: {
          key: '1',
          items: [{
            key: '1',
            items: [{
              key: '1',
              items: [
                { key: '1' },
                { key: '2' },
                { key: '3' },
              ]
            }]
          }]
        }
      }
    ]
  }

  expect(expEval.eval(
    {
      name: 'responseHasOnlyKeysOtherThan', data: [
        { str: '1.1' }, { str: '1.1.1' }, { str: '4' }, { str: '3' },
      ]
    }, undefined, undefined, testResp
  )).toBeFalsy();
  expect(expEval.eval(
    {
      name: 'responseHasOnlyKeysOtherThan', data: [
        { str: '1.1' }, { str: '1.1.1' }, { str: '2' }, { str: '3' }, { str: '1' }
      ]
    }, undefined, undefined, testResp
  )).toBeFalsy();
  expect(expEval.eval(
    {
      name: 'responseHasOnlyKeysOtherThan', data: [
        { str: '1.1' }, { str: '1.1.1' }, { str: '4' }, { str: '5' },
      ]
    }, undefined, undefined, testResp
  )).toBeTruthy();
  expect(expEval.eval(
    {
      name: 'responseHasOnlyKeysOtherThan', data: [
        { str: '1.1' }, { str: '1.1' }, { str: '4' }, { str: '5' },
      ]
    }, undefined, undefined, testResp
  )).toBeTruthy();
  expect(expEval.eval(
    {
      name: 'responseHasOnlyKeysOtherThan', data: [
        { str: '1' }, { str: '1.1' }, { str: '4' }, { str: '5' },
      ]
    }, undefined, undefined, testResp
  )).toBeFalsy();
});

test('testing expression: dateResponseDiffFromNow', () => {
  const expEval = new ExpressionEval();
  const testResp: SurveyGroupItemResponse = {
    key: '1',
    items: [
      {
        key: '1.1', response: {
          key: '1',
          items: [{
            key: '1',
            items: [{
              key: '1',
              items: [
                { key: '1', dtype: 'date', value: (moment().subtract(2, 'years').unix()).toString() },
                { key: '2', dtype: 'date', value: (moment().add(18, 'months').unix()).toString() },
                { key: '3', value: '15323422332' },
              ]
            }]
          }]
        }
      }
    ]
  }

  expect(expEval.eval(
    {
      name: 'dateResponseDiffFromNow', data: [
        { str: '1.2' }, { str: '1.1.1.1' }, { str: 'years' }, { num: 1 },
      ]
    }, undefined, undefined, testResp
  )).toBeUndefined();

  expect(expEval.eval(
    {
      name: 'dateResponseDiffFromNow', data: [
        { str: '1.1' }, { str: '1.1.1.no' }, { str: 'years' }, { num: 1 },
      ]
    }, undefined, undefined, testResp
  )).toBeUndefined();

  expect(expEval.eval(
    {
      name: 'dateResponseDiffFromNow', data: [
        { str: '1.1' }, { str: '1.1.1.3' }, { str: 'years' }, { num: 1 },
      ]
    }, undefined, undefined, testResp
  )).toBeUndefined();

  expect(expEval.eval(
    {
      name: 'dateResponseDiffFromNow', data: [
        { str: '1.1' }, { str: '1.1.1.1' }, { str: 'years' }, { num: 1 },
      ]
    }, undefined, undefined, testResp
  )).toEqual(2);

  expect(expEval.eval(
    {
      name: 'dateResponseDiffFromNow', data: [
        { str: '1.1' }, { str: '1.1.1.1' }, { str: 'months' },
      ]
    }, undefined, undefined, testResp
  )).toEqual(-24);

  expect(expEval.eval(
    {
      name: 'dateResponseDiffFromNow', data: [
        { str: '1.1' }, { str: '1.1.1.2' }, { str: 'months' },
      ]
    }, undefined, undefined, testResp
  )).toEqual(17);

  expect(expEval.eval(
    {
      name: 'dateResponseDiffFromNow', data: [
        { str: '1.1' }, { str: '1.1.1.2' }, { str: 'years' },
      ]
    }, undefined, undefined, testResp
  )).toEqual(1);
});
