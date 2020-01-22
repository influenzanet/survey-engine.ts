import { OpTest } from '../index';
import { SurveyEngineCore, printResponses } from '../engine';
import { SurveyContext, SurveyItemGroup } from '../data_types';

import simpleSurvey1 from './test-surveys/simple-survey-1.json'

test('Op Test', () => {
    console.log(simpleSurvey1);
    const surveyDef: SurveyItemGroup = simpleSurvey1 as SurveyItemGroup;

    const context: SurveyContext = {
        mode: 'test'
    };
    const surveyE = new SurveyEngineCore(
        surveyDef,
        'test-reporter',
        'test-reportee',
        context
    );

    //console.log(JSON.stringify(surveyE.getRenderedSurvey(), null, 2));
    surveyE.setResponse('s1.q2.2.1', 14);

    //console.log(JSON.stringify(surveyE.getRenderedSurvey(), null, 2));
    //console.log(JSON.stringify(surveyE.getResponses(), null, 2));
    expect(OpTest(3, 2)).toBe(5);
});