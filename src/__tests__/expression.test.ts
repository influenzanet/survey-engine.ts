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