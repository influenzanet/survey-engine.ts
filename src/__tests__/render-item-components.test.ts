import { SurveySingleItem, SurveyGroupItem, SurveyContext, ItemComponent, LocalizedString, Survey } from '../data_types';
import { SurveyEngineCore } from '../engine';

// ---------- Create a test survey definition ----------------
const testItem: SurveySingleItem = {
    key: '0.1',
    version: 0,
    validations: [],
    components: {
        role: 'root',
        items: [
            {
                key: '1',
                role: 'text',
                content: [
                    {
                        code: 'en',
                        parts: [
                            {
                                str: 'test'
                            },
                            {
                                dtype: 'exp',
                                exp: {
                                    name: 'getAttribute',
                                    data: [
                                        { dtype: 'exp', exp: { name: 'getContext' } },
                                        { str: 'mode' }
                                    ]
                                }
                            },
                        ]
                    },
                ],
                description: [
                    {
                        code: 'en',
                        parts: [
                            {
                                str: 'test2'
                            },
                            {
                                dtype: 'exp',
                                exp: {
                                    name: 'getAttribute',
                                    data: [
                                        { dtype: 'exp', exp: { name: 'getContext' } },
                                        { str: 'mode' }
                                    ]
                                }
                            },
                        ]
                    }
                ],
            },
            {
                key: '2',
                role: 'text',
                disabled: {
                    name: 'eq',
                    data: [
                        { str: 'test' },
                        {
                            dtype: 'exp', exp: {
                                name: 'getAttribute',
                                data: [
                                    { dtype: 'exp', exp: { name: 'getContext' } },
                                    { str: 'mode' }
                                ]
                            }
                        }
                    ]
                },
                displayCondition: {
                    name: 'eq',
                    data: [
                        { str: 'test' },
                        {
                            dtype: 'exp', exp: {
                                name: 'getAttribute',
                                data: [
                                    { dtype: 'exp', exp: { name: 'getContext' } },
                                    { str: 'mode' }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                key: '3',
                role: 'text',
                disabled: {
                    name: 'eq',
                    data: [
                        { str: 'test2' },
                        {
                            dtype: 'exp', exp: {
                                name: 'getAttribute',
                                data: [
                                    { dtype: 'exp', exp: { name: 'getContext' } },
                                    { str: 'mode' }
                                ]
                            }
                        }
                    ]
                },
                displayCondition: {
                    name: 'eq',
                    data: [
                        { str: 'test2' },
                        {
                            dtype: 'exp', exp: {
                                name: 'getAttribute',
                                data: [
                                    { dtype: 'exp', exp: { name: 'getContext' } },
                                    { str: 'mode' }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                key: '4',
                role: 'numberInput',
                properties: {
                    min: {
                        dtype: 'num',
                        num: -5,
                    },
                    max: {
                        dtype: 'exp', exp: {
                            name: 'getAttribute',
                            returnType: 'float',
                            data: [
                                { dtype: 'exp', exp: { name: 'getContext' } },
                                { str: 'mode' }
                            ]
                        }
                    }

                }
            }
        ]
    }
}

const testSurvey: Survey = {
    current: {
        versionId: 'wfdojsdfpo',
        surveyDefinition: {
            key: '0',
            version: 0,
            items: [
                testItem
            ]
        }
    }
}

test('testing item component disabled', () => {
    const context: SurveyContext = {
        mode: 'test'
    };
    const surveyE = new SurveyEngineCore(
        testSurvey,
        context
    );

    const renderedSurvey = surveyE.getRenderedSurvey();
    const testComponent = (renderedSurvey.items[0] as SurveySingleItem).components?.items.find(comp => comp.key === '2');
    if (!testComponent) {
        throw Error('object is undefined')
    }
    const testComponent2 = (renderedSurvey.items[0] as SurveySingleItem).components?.items.find(comp => comp.key === '3');
    if (!testComponent2) {
        throw Error('object is undefined')
    }

    expect(testComponent.disabled).toBeTruthy();
    expect(testComponent2.disabled).toBeFalsy();
});

test('testing item component displayCondition', () => {
    const context: SurveyContext = {
        mode: 'test'
    };
    const surveyE = new SurveyEngineCore(
        testSurvey,
        context
    );

    const renderedSurvey = surveyE.getRenderedSurvey();
    const testComponent = (renderedSurvey.items[0] as SurveySingleItem).components?.items.find(comp => comp.key === '2');
    if (!testComponent) {
        throw Error('object is undefined')
    }
    const testComponent2 = (renderedSurvey.items[0] as SurveySingleItem).components?.items.find(comp => comp.key === '3');
    if (!testComponent2) {
        throw Error('object is undefined')
    }

    expect(testComponent.displayCondition).toBeTruthy();
    expect(testComponent2.displayCondition).toBeFalsy();
});

test('testing item component properties', () => {
    const context: SurveyContext = {
        mode: '4.5'
    };
    const surveyE = new SurveyEngineCore(
        testSurvey,
        context
    );

    const renderedSurvey = surveyE.getRenderedSurvey();
    const testComponent = (renderedSurvey.items[0] as SurveySingleItem).components?.items.find(comp => comp.key === '4');
    if (!testComponent || !testComponent.properties) {
        throw Error('object is undefined')
    }


    expect(testComponent.properties.min).toEqual(-5);
    expect(testComponent.properties.max).toEqual(4.5);
});

test('testing item component content', () => {
    const context: SurveyContext = {
        mode: 'test'
    };
    const surveyE = new SurveyEngineCore(
        testSurvey,
        context
    );

    const renderedSurvey = surveyE.getRenderedSurvey();
    const testComponent = (renderedSurvey.items[0] as SurveySingleItem).components?.items.find(comp => comp.key === '1');
    if (!testComponent || !testComponent.content || !testComponent.content[0]) {
        throw Error('object is undefined')
    }
    const content = (testComponent.content[0] as LocalizedString).parts.join('');
    expect(content).toEqual('testtest');
});

test('testing item component description', () => {
    const context: SurveyContext = {
        mode: 'test'
    };
    const surveyE = new SurveyEngineCore(
        testSurvey,
        context
    );

    const renderedSurvey = surveyE.getRenderedSurvey();
    const testComponent = (renderedSurvey.items[0] as SurveySingleItem).components?.items.find(comp => comp.key === '1');
    if (!testComponent || !testComponent.description || !testComponent.description[0]) {
        throw Error('object is undefined')
    }
    const content = (testComponent.description[0] as LocalizedString).parts.join('');
    expect(content).toEqual('test2test');
});
