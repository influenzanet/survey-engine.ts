import { OpTest } from '../index';
import { SurveyEngineCore, printResponses } from '../engine';
import { SurveyContext, QuestionGroup } from '../data_types';

test('Op Test', () => {
    const surveyDef: QuestionGroup = {
        key: 's1',
        items: [
            { key: 's1.q1' },
            {
                key: 's1.q2',
                items: [
                    { key: 's1.q2.1' },
                    {
                        key: 's1.q2.2', items: [
                            { key: 's1.q2.2.1' },
                            {
                                key: 's1.q2.2.2', condition: {
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
                                                        's1.q2.2.1'
                                                    ]
                                                },
                                                'response'
                                            ]
                                        },
                                        14
                                    ]
                                }
                            },
                            { key: 's1.q2.2.3', follows: ['s1.q2.2'] },
                            { key: 's1.q2.2.4', follows: ['s1.q2.2.1'] }
                        ]
                    }
                ]
            },
            {
                key: 's1.q3',
                selectionMethod: {
                    name: 'highestPriority',
                },
                items: [
                    { key: 's1.q3.1', priority: 3 },
                    { key: 's1.q3.2', priority: 5 },
                    { key: 's1.q3.3', priority: 1 },
                ],
            }
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

    console.log(JSON.stringify(surveyE.getRenderedSurvey(), null, 2));
    surveyE.setResponse('s1.q2.2.1', 14);

    console.log(JSON.stringify(surveyE.getRenderedSurvey(), null, 2));
    console.log(JSON.stringify(surveyE.getResponses(), null, 2));
    expect(OpTest(3, 2)).toBe(5);
});