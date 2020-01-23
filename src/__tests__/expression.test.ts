import { Expression, ExpressionArg } from '../data_types';
import { ExpressionEval } from '../expression-eval';


test('testing OR expression', () => {
    const expEval = new ExpressionEval();
    expect(expEval.eval({ name: 'or', data: [{ dtype: 'number', num: 1 }, { dtype: 'number', num: 0 }] })).toBeTruthy();
    expect(expEval.eval({ name: 'or', data: [{ dtype: 'number', num: 0 }, { dtype: 'number', num: 1 }] })).toBeTruthy();
    expect(expEval.eval({ name: 'or', data: [{ dtype: 'number', num: 1 }, { dtype: 'number', num: 1 }] })).toBeTruthy();
    expect(expEval.eval({ name: 'or', data: [{ dtype: 'number', num: 0 }, { dtype: 'number', num: 0 }] })).toBeFalsy();
});

test('testing AND expression', () => {
    const expEval = new ExpressionEval();
    expect(expEval.eval({ name: 'and', data: [{ dtype: 'number', num: 1 }, { dtype: 'number', num: 0 }] })).toBeFalsy();
    expect(expEval.eval({ name: 'and', data: [{ dtype: 'number', num: 0 }, { dtype: 'number', num: 1 }] })).toBeFalsy();
    expect(expEval.eval({ name: 'and', data: [{ dtype: 'number', num: 1 }, { dtype: 'number', num: 1 }] })).toBeTruthy();
    expect(expEval.eval({ name: 'and', data: [{ dtype: 'number', num: 0 }, { dtype: 'number', num: 0 }] })).toBeFalsy();
});

test('testing NOT expression', () => {
    const trueExp: Expression = { name: 'and', data: [{ dtype: 'number', num: 1 }, { dtype: 'number', num: 1 }] }
    const falseExp: Expression = { name: 'and', data: [{ dtype: 'number', num: 0 }, { dtype: 'number', num: 1 }] }

    const expEval = new ExpressionEval();
    expect(expEval.eval({ name: 'not', data: [{ dtype: 'exp', exp: trueExp }] })).toBeFalsy();
    expect(expEval.eval({ name: 'not', data: [{ dtype: 'exp', exp: falseExp }] })).toBeTruthy();
});

test('testing EQ expression', () => {
    const expEval = new ExpressionEval();
    // numbers
    expect(expEval.eval({ name: 'eq', data: [{ dtype: 'number', num: 1 }, { dtype: 'number', num: 0 }] })).toBeFalsy();
    expect(expEval.eval({ name: 'eq', data: [{ dtype: 'number', num: 1 }, { dtype: 'number', num: 1 }] })).toBeTruthy();

    // strings
    expect(expEval.eval({ name: 'eq', data: [{ dtype: 'string', str: "test1" }, { dtype: 'string', str: "test2" }] })).toBeFalsy();
    expect(expEval.eval({ name: 'eq', data: [{ dtype: 'string', str: "test1" }, { dtype: 'string', str: "test1" }] })).toBeTruthy();
})

test('testing LT expression', () => {
    const expEval = new ExpressionEval();
    // numbers
    expect(expEval.eval({ name: 'lt', data: [{ dtype: 'number', num: 3 }, { dtype: 'number', num: 2 }] })).toBeFalsy();
    expect(expEval.eval({ name: 'lt', data: [{ dtype: 'number', num: 2 }, { dtype: 'number', num: 2 }] })).toBeFalsy();
    expect(expEval.eval({ name: 'lt', data: [{ dtype: 'number', num: 1 }, { dtype: 'number', num: 2 }] })).toBeTruthy();

    // strings
    expect(expEval.eval({ name: 'lt', data: [{ dtype: 'string', str: "test3" }, { dtype: 'string', str: "test2" }] })).toBeFalsy();
    expect(expEval.eval({ name: 'lt', data: [{ dtype: 'string', str: "test2" }, { dtype: 'string', str: "test2" }] })).toBeFalsy();
    expect(expEval.eval({ name: 'lt', data: [{ dtype: 'string', str: "test1" }, { dtype: 'string', str: "test2" }] })).toBeTruthy();
})

test('testing LTE expression', () => {
    const expEval = new ExpressionEval();
    // numbers
    expect(expEval.eval({ name: 'lte', data: [{ dtype: 'number', num: 3 }, { dtype: 'number', num: 2 }] })).toBeFalsy();
    expect(expEval.eval({ name: 'lte', data: [{ dtype: 'number', num: 2 }, { dtype: 'number', num: 2 }] })).toBeTruthy();
    expect(expEval.eval({ name: 'lte', data: [{ dtype: 'number', num: 1 }, { dtype: 'number', num: 2 }] })).toBeTruthy();

    // strings
    expect(expEval.eval({ name: 'lte', data: [{ dtype: 'string', str: "test3" }, { dtype: 'string', str: "test2" }] })).toBeFalsy();
    expect(expEval.eval({ name: 'lte', data: [{ dtype: 'string', str: "test2" }, { dtype: 'string', str: "test2" }] })).toBeTruthy();
    expect(expEval.eval({ name: 'lte', data: [{ dtype: 'string', str: "test1" }, { dtype: 'string', str: "test2" }] })).toBeTruthy();
})

test('testing GT expression', () => {
    const expEval = new ExpressionEval();
    // numbers
    expect(expEval.eval({ name: 'gt', data: [{ dtype: 'number', num: 3 }, { dtype: 'number', num: 2 }] })).toBeTruthy();
    expect(expEval.eval({ name: 'gt', data: [{ dtype: 'number', num: 2 }, { dtype: 'number', num: 2 }] })).toBeFalsy();
    expect(expEval.eval({ name: 'gt', data: [{ dtype: 'number', num: 1 }, { dtype: 'number', num: 2 }] })).toBeFalsy();

    // strings
    expect(expEval.eval({ name: 'gt', data: [{ dtype: 'string', str: "test3" }, { dtype: 'string', str: "test2" }] })).toBeTruthy();
    expect(expEval.eval({ name: 'gt', data: [{ dtype: 'string', str: "test2" }, { dtype: 'string', str: "test2" }] })).toBeFalsy();
    expect(expEval.eval({ name: 'gt', data: [{ dtype: 'string', str: "test1" }, { dtype: 'string', str: "test2" }] })).toBeFalsy();
})

test('testing GTE expression', () => {
    const expEval = new ExpressionEval();
    // numbers
    expect(expEval.eval({ name: 'gte', data: [{ dtype: 'number', num: 3 }, { dtype: 'number', num: 2 }] })).toBeTruthy();
    expect(expEval.eval({ name: 'gte', data: [{ dtype: 'number', num: 2 }, { dtype: 'number', num: 2 }] })).toBeTruthy();
    expect(expEval.eval({ name: 'gte', data: [{ dtype: 'number', num: 1 }, { dtype: 'number', num: 2 }] })).toBeFalsy();

    // strings
    expect(expEval.eval({ name: 'gte', data: [{ dtype: 'string', str: "test3" }, { dtype: 'string', str: "test2" }] })).toBeTruthy();
    expect(expEval.eval({ name: 'gte', data: [{ dtype: 'string', str: "test2" }, { dtype: 'string', str: "test2" }] })).toBeTruthy();
    expect(expEval.eval({ name: 'gte', data: [{ dtype: 'string', str: "test1" }, { dtype: 'string', str: "test2" }] })).toBeFalsy();
})
