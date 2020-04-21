import { SurveyEngineCore } from "../engine";
import { Survey } from "../data_types";
import { flattenSurveyItemTree } from "../utils";
import { checkSurveyItemValidity, checkSurveyItemsValidity } from "../validation-checkers";


test('testing validations', () => {
    const testSurvey: Survey = {
        current: {
            surveyDefinition: {
                key: "root",
                version: 0,
                items: [
                    {
                        key: 'root.G1', version: 1, selectionMethod: { name: 'sequential' }, items: [
                            {
                                key: 'root.G1.1', version: 1, validations: [
                                    {
                                        key: 'v1', type: 'soft', rule: {
                                            name: 'responseHasKeysAny',
                                            data: [
                                                { str: 'root.G1.1' },
                                                { str: '1.1' },
                                                { str: '1' },
                                            ]
                                        }
                                    },
                                    {
                                        key: 'v2', type: 'hard', rule: {
                                            name: 'responseHasKeysAny',
                                            data: [
                                                { str: 'root.G1.1' },
                                                { str: '1.1' },
                                                { str: '2' },
                                            ]
                                        }
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        key: 'root.G2', version: 1, items: [
                            {
                                key: 'root.G2.1', version: 1,
                                validations: [
                                    {
                                        key: 'v1', type: 'hard', rule: {
                                            name: 'responseHasKeysAny',
                                            data: [
                                                { str: 'root.G2.1' },
                                                { str: '1.1' },
                                                { str: '1' },
                                            ]
                                        }
                                    },
                                    {
                                        key: 'v2', type: 'hard', rule: {
                                            name: 'responseHasKeysAny',
                                            data: [
                                                { str: 'root.G2.1' },
                                                { str: '1.1' },
                                                { str: '2' },
                                            ]
                                        }
                                    }
                                ]
                            },
                        ]
                    },
                ],
            }
        },
    };


    const surveyE = new SurveyEngineCore(
        testSurvey,
    );

    let items = flattenSurveyItemTree(surveyE.getRenderedSurvey());
    let i1 = items.find(it => it.key === 'root.G1.1');
    let i2 = items.find(it => it.key === 'root.G2.1');
    if (!i1 || !i2) {
        throw Error('should not be undefined');
    }

    let vRes = checkSurveyItemValidity(i1);
    expect(vRes.hard).toBeFalsy();
    expect(vRes.soft).toBeFalsy();
    vRes = checkSurveyItemValidity(i2);
    expect(vRes.hard).toBeFalsy();
    expect(vRes.soft).toBeTruthy();

    surveyE.setResponse('root.G1.1', {
        key: '1', items: [{ key: '1', items: [{ key: '1' }, { key: '2' }] }]
    });
    surveyE.setResponse('root.G2.1', {
        key: '1', items: [{ key: '1', items: [{ key: '1' }, { key: '2' }] }]
    });

    items = flattenSurveyItemTree(surveyE.getRenderedSurvey());
    i1 = items.find(it => it.key === 'root.G1.1');
    i2 = items.find(it => it.key === 'root.G2.1');
    if (!i1 || !i2) {
        throw Error('should not be undefined');
    }

    vRes = checkSurveyItemValidity(i1);
    expect(vRes.hard).toBeTruthy();
    expect(vRes.soft).toBeTruthy();
    vRes = checkSurveyItemValidity(i2);
    expect(vRes.hard).toBeTruthy();
    expect(vRes.soft).toBeTruthy();
});


test('testing multiple survey items validation', () => {
    const testSurvey: Survey = {
        current: {
            surveyDefinition: {
                key: "root",
                version: 0,
                items: [
                    {
                        key: 'root.G1', version: 1, selectionMethod: { name: 'sequential' }, items: [
                            {
                                key: 'root.G1.1', version: 1, validations: [
                                    {
                                        key: 'v1', type: 'soft', rule: {
                                            name: 'responseHasKeysAny',
                                            data: [
                                                { str: 'root.G1.1' },
                                                { str: '1.1' },
                                                { str: '1' },
                                            ]
                                        }
                                    },
                                    {
                                        key: 'v2', type: 'hard', rule: {
                                            name: 'responseHasKeysAny',
                                            data: [
                                                { str: 'root.G1.1' },
                                                { str: '1.1' },
                                                { str: '2' },
                                            ]
                                        }
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        key: 'root.G2', version: 1, items: [
                            {
                                key: 'root.G2.1', version: 1,
                                validations: [
                                    {
                                        key: 'v1', type: 'hard', rule: {
                                            name: 'responseHasKeysAny',
                                            data: [
                                                { str: 'root.G2.1' },
                                                { str: '1.1' },
                                                { str: '1' },
                                            ]
                                        }
                                    },
                                    {
                                        key: 'v2', type: 'hard', rule: {
                                            name: 'responseHasKeysAny',
                                            data: [
                                                { str: 'root.G2.1' },
                                                { str: '1.1' },
                                                { str: '2' },
                                            ]
                                        }
                                    }
                                ]
                            },
                        ]
                    },
                ],
            }
        },
    };


    const surveyE = new SurveyEngineCore(
        testSurvey,
    );

    let items = flattenSurveyItemTree(surveyE.getRenderedSurvey());
    let vRes = checkSurveyItemsValidity(items);
    expect(vRes.hard).toBeFalsy();
    expect(vRes.soft).toBeFalsy();

    surveyE.setResponse('root.G1.1', {
        key: '1', items: [{ key: '1', items: [{ key: '1' }, { key: '2' }] }]
    });

    items = flattenSurveyItemTree(surveyE.getRenderedSurvey());
    vRes = checkSurveyItemsValidity(items);
    expect(vRes.hard).toBeFalsy();
    expect(vRes.soft).toBeTruthy();

    surveyE.setResponse('root.G1.1', {
        key: '1', items: [{ key: '1', items: [{ key: '1' }, { key: '2' }] }]
    });

    items = flattenSurveyItemTree(surveyE.getRenderedSurvey());
    vRes = checkSurveyItemsValidity(items);
    expect(vRes.hard).toBeFalsy();
    expect(vRes.soft).toBeTruthy();

    surveyE.setResponse('root.G2.1', {
        key: '1', items: [{ key: '1', items: [{ key: '1' }, { key: '2' }] }]
    });

    items = flattenSurveyItemTree(surveyE.getRenderedSurvey());
    vRes = checkSurveyItemsValidity(items);
    expect(vRes.hard).toBeTruthy();
    expect(vRes.soft).toBeTruthy();
});

