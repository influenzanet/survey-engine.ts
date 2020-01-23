import { OpTest } from '../index';
import { SurveyEngineCore, printResponses } from '../engine';
import { SurveyContext, SurveyGroupItem, ResponseItem } from '../data_types';

import simpleSurvey1 from './test-surveys/simple-survey-1.json'

test('Op Test', () => {
    console.log(simpleSurvey1);
    const surveyDef: SurveyGroupItem = simpleSurvey1 as SurveyGroupItem;

    const context: SurveyContext = {
        mode: 'test'
    };
    const surveyE = new SurveyEngineCore(
        surveyDef,
        context
    );

    //console.log(JSON.stringify(surveyE.getRenderedSurvey(), null, 2));
    const resp: ResponseItem = {
        key: 'r1',
        value: "14",
        dtype: 'number',
    }
    surveyE.setResponse('s1.q2.2.1', resp);

    //console.log(JSON.stringify(surveyE.getRenderedSurvey(), null, 2));
    //console.log(JSON.stringify(surveyE.getResponses(), null, 2));
});