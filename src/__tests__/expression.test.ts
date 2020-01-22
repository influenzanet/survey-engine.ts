import { Expression } from '../data_types';
import { ExpressionEval } from '../expression-eval';


test('testing simple logic expressions', () => {

    const expEval = new ExpressionEval();



    expect(expEval.eval({ name: 'or', data: [{ num: 1 }, { num: 0 }] })).toBeTruthy();

});