import { OpTest } from '../index';
import { SurveyEngineCore, printResponses } from '../engine';
import { SurveyContext, QuestionGroup } from '../data_types';

test('Op Test', () => {
    const surveyDef: QuestionGroup = {
        key: 'weekly',
        items: [
            { key: 'q1' },
            {
                key: 'q2',
                items: [
                    { key: 'q2.1' },
                    {
                        key: 'q2.2', items: [
                            { key: 'q2.2.1' },
                            { key: 'q2.2.2' }
                        ]
                    }
                ]
            },
        ]
    };

    const context: SurveyContext = {
        mode: 'test'
    };
    const surveyE = new SurveyEngineCore(
        surveyDef,
        'test-reporter',
        'test-reportee',
        context
    );

    surveyE.setResponse({
        key: 'q2.2.1',
        value: 1
    });

    console.log(JSON.stringify(surveyE.getResponses(), null, 2));
    expect(OpTest(3, 2)).toBe(5);
});