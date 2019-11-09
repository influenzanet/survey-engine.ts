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
                            {
                                key: 'q2.2.2', condition: {
                                    name: 'eq',
                                    data: [
                                        {
                                            name: 'getAttribute',
                                            data: [
                                                {
                                                    name: 'getObjByHierarchicalKey',
                                                    data: [
                                                        {
                                                            name: 'getAttribute', data: [
                                                                { name: 'getResponses' },
                                                                'responses'
                                                            ]
                                                        },
                                                        'q2.2.1'
                                                    ]
                                                },
                                                'response'
                                            ]
                                        },
                                        14
                                    ]
                                }
                            },
                            { key: 'q2.2.3' },
                            { key: 'q2.2.4' }
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
        value: 14
    });

    console.log(JSON.stringify(surveyE.getRenderedSurvey(), null, 2));
    expect(OpTest(3, 2)).toBe(5);
});