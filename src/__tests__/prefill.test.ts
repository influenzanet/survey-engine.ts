import { Survey, SurveyItemResponse, SurveySingleItemResponse } from "../data_types";
import { SurveyEngineCore } from "../engine";

test('testing survey initialized with prefills', () => {
    const testSurvey: Survey = {
        current: {
            surveyDefinition: {
                key: "root",
                version: 0,
                items: [
                    { key: 'root.1', version: 1, follows: ['root'] },
                    { key: 'root.2', version: 1, follows: ['root.1'] },
                    {
                        key: 'root.G1', version: 1, items: [
                            { key: 'root.G1.3', version: 1, follows: ['root.G1'] },
                            { key: 'root.G1.4', version: 1, follows: ['root.G1.3'] },
                            { key: 'root.G1.5', version: 1 },
                        ]
                    },
                ],
            }
        },
    };

    const prefills: SurveySingleItemResponse[] = [
        { key: 'root.1', response: { key: '1' } },
        { key: 'root.G1.4', response: { key: '2' } },
        { key: 'root.G1.5', response: { key: '3' } },
    ]

    const surveyE = new SurveyEngineCore(
        testSurvey,
        undefined,
        prefills
    );

    const responses = surveyE.getResponses();

    expect(responses).toHaveLength(5);
    expect(responses[0].response?.key).toEqual('1');
    expect(responses[3].response?.key).toEqual('2');
    expect(responses[4].response?.key).toEqual('3');

})