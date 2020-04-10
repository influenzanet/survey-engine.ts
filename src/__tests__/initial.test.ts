import { SurveyEngineCore } from '../engine';
import { SurveyContext, SurveyGroupItem, ResponseItem, Survey } from '../data_types';

import simpleSurvey1 from './test-surveys/simple-survey-1.json'
import qg4 from './test-surveys/qg4.json'
import { printSurveyItem, printResponses } from '../utils';

test('Op Test', () => {
    // console.log(simpleSurvey1);
    // const surveyDef: SurveyGroupItem = simpleSurvey1 as SurveyGroupItem;
    const surveyDef: SurveyGroupItem = qg4 as SurveyGroupItem;
    const testSurvey: Survey = {
        current: {
            surveyDefinition: surveyDef
        }

    }
    const context: SurveyContext = {
        mode: 'test'
    };
    const surveyE = new SurveyEngineCore(
        testSurvey,
        context
    );

    printSurveyItem(surveyE.getRenderedSurvey(), '');
    surveyE.questionDisplayed('QG0.QG4.Q4');
    surveyE.questionDisplayed('QG0.QG4.Q4');

    //console.log(JSON.stringify(surveyE.getRenderedSurvey(), null, 2));
    const resp: ResponseItem = {
        key: 'RG1',
        items: [
            { key: 'RG1.R1' }
        ]
        // value: "14",
        // dtype: 'number',
    }
    surveyE.setResponse('QG0.QG4.Q4', resp);
    printResponses(surveyE.getResponses(), '');
    printSurveyItem(surveyE.getRenderedSurvey(), '');

    //console.log(JSON.stringify(surveyE.getRenderedSurvey(), null, 2));
    //console.log(JSON.stringify(surveyE.getResponses(), null, 2));
});