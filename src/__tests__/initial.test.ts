import { SurveyEngineCore } from '../engine';
import { SurveyContext, SurveyGroupItem, ResponseItem } from '../data_types';

import simpleSurvey1 from './test-surveys/simple-survey-1.json'
import { printSurveyItem } from '../utils';

test('Op Test', () => {
    // console.log(simpleSurvey1);
    const surveyDef: SurveyGroupItem = simpleSurvey1 as SurveyGroupItem;

    const context: SurveyContext = {
        mode: 'test'
    };
    const surveyE = new SurveyEngineCore(
        surveyDef,
        context
    );

    printSurveyItem(surveyE.getRenderedSurvey(), '');

    //console.log(JSON.stringify(surveyE.getRenderedSurvey(), null, 2));
    const resp: ResponseItem = {
        key: 'r1',
        value: "14",
        dtype: 'number',
    }
    surveyE.setResponse('s1.q1', resp);

    printSurveyItem(surveyE.getRenderedSurvey(), '');

    //console.log(JSON.stringify(surveyE.getRenderedSurvey(), null, 2));
    //console.log(JSON.stringify(surveyE.getResponses(), null, 2));
});