import { SelectionMethod } from "../selection-method";
import { Survey } from "../data_types";
import { SurveyEngineCore } from "../engine";
import { flattenSurveyItemTree } from "../utils";

describe('testing selection methods', () => {
    test('without method definition', () => {
        const items = [
            { key: 'q1' },
            { key: 'q2' },
            { key: 'q3' },
        ];

        const item = SelectionMethod.pickAnItem(items);
        expect(item).toBeDefined();
        console.log('selected item is: ' + item.key);
    });

    test('with uniform random selection', () => {
        const items = [
            { key: 'q1' },
            { key: 'q2' },
            { key: 'q3' },
        ];

        const item = SelectionMethod.pickAnItem(items, { name: 'uniform' });
        expect(item).toBeDefined();
        console.log('selected item is: ' + item.key);
    });

    test('with highestPriority selection - missing priorities', () => {
        const items = [
            { key: 'q1' },
            { key: 'q2' },
            { key: 'q3' },
        ];

        const item = SelectionMethod.pickAnItem(items, { name: 'highestPriority' });
        expect(item).toBeDefined();
        expect(item.key).toBe('q1');
        console.log('selected item is: ' + item.key);
    });

    test('with highestPriority selection', () => {
        const items = [
            { key: 'q1', priority: 2 },
            { key: 'q2', priority: 3 },
            { key: 'q3', priority: 1 },
            { key: 'q4' },
        ];

        const item = SelectionMethod.pickAnItem(items, { name: 'highestPriority' });
        expect(item).toBeDefined();
        expect(item.key).toBe('q2');
        console.log('selected item is: ' + item.key);
    });

    test('with exponential distribution selection missing data argument', () => {
        const items = [
            { key: 'q1', priority: 2 },
            { key: 'q2', priority: 3 },
            { key: 'q3', priority: 1 },
            { key: 'q4' },
        ];

        const item = SelectionMethod.pickAnItem(items, { name: 'exponential' });
        expect(item).toBeUndefined();
    });

    test('with exponential distribution selection with wrong data argmument type', () => {
        const items = [
            { key: 'q1', priority: 2 },
            { key: 'q2', priority: 3 },
            { key: 'q3', priority: 1 },
            { key: 'q4' },
        ];

        const item = SelectionMethod.pickAnItem(items, { name: 'exponential', data: [{ dtype: 'str', str: '2' }] });
        expect(item).toBeUndefined();
    });

    test('with exponential distribution selection', () => {
        const items = [
            { key: 'q1', priority: 2 },
            { key: 'q2', priority: 3 },
            { key: 'q3', priority: 1 },
            { key: 'q4' },
        ];

        const item = SelectionMethod.pickAnItem(items, { name: 'exponential', data: [{ dtype: 'num', num: 0.5 }] });
        expect(item).toBeDefined();
        console.log('selected item is: ' + item.key);
    });
});

test('without sequential selection (spec. use case)', () => {
    const testSurvey: Survey = {
        current: {
            surveyDefinition: {
                key: "root",
                version: 0,
                selectionMethod: { name: 'sequential' },
                items: [
                    { key: 'root.1', version: 1 },
                    {
                        key: 'root.2', version: 1, condition: {
                            name: 'isDefined',
                            data: [
                                {
                                    dtype: 'exp',
                                    exp: {
                                        name: 'getResponseItem',
                                        data: [
                                            {
                                                str: 'root.1'
                                            },
                                            {
                                                str: '1'
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                    },
                    {
                        key: 'root.G1', version: 1,
                        selectionMethod: { name: 'sequential' },
                        items: [
                            { key: 'root.G1.3', version: 1 },
                            {
                                key: 'root.G1.G2', version: 1,
                                condition: {
                                    name: 'isDefined',
                                    data: [
                                        {
                                            dtype: 'exp',
                                            exp: {
                                                name: 'getResponseItem',
                                                data: [
                                                    {
                                                        str: 'root.G1.3'
                                                    },
                                                    {
                                                        str: '1'
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                },
                                selectionMethod: { name: 'sequential' },
                                items: [
                                    { key: 'root.G1.G2.1', version: 1 },
                                    { key: 'root.G1.G2.2', version: 1 },
                                ]
                            },
                            { key: 'root.G1.5', version: 1 },
                        ]
                    },
                ],
            }
        },
    };

    const surveyE = new SurveyEngineCore(
        testSurvey,
    );

    const renderedItems = flattenSurveyItemTree(surveyE.getRenderedSurvey());

    surveyE.setResponse('root.1', { key: '1' });
    surveyE.setResponse('root.G1.3', { key: '1' });
    const renderedItems2 = flattenSurveyItemTree(surveyE.getRenderedSurvey());

    surveyE.setResponse('root.1', { key: '2' });
    surveyE.setResponse('root.G1.3', { key: '2' });
    const renderedItems3 = flattenSurveyItemTree(surveyE.getRenderedSurvey());

    console.log(renderedItems);
    console.log(renderedItems2);
    console.log(renderedItems3);

    expect(renderedItems).toHaveLength(3);
    expect(renderedItems2).toHaveLength(6);
    expect(renderedItems3).toHaveLength(3);

    expect(renderedItems[0].key).toEqual('root.1');
    expect(renderedItems[1].key).toEqual('root.G1.3');
    expect(renderedItems[2].key).toEqual('root.G1.5');

    expect(renderedItems2[0].key).toEqual('root.1');
    expect(renderedItems2[1].key).toEqual('root.2');
    expect(renderedItems2[2].key).toEqual('root.G1.3');
    expect(renderedItems2[3].key).toEqual('root.G1.G2.1');
    expect(renderedItems2[4].key).toEqual('root.G1.G2.2');
    expect(renderedItems2[5].key).toEqual('root.G1.5');

    expect(renderedItems3[0].key).toEqual('root.1');
    expect(renderedItems3[1].key).toEqual('root.G1.3');
    expect(renderedItems3[2].key).toEqual('root.G1.5');
})