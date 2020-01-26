import { SurveyItemResponse, isSurveyGroupItemResponse, SurveyItem, isSurveyGroupItem, LocalizedString } from "./data_types";

export const pickRandomListItem = (items: Array<any>): any => {
    return items[Math.floor(Math.random() * items.length)];
}

export const removeItemByKey = (items: Array<any>, key: string): Array<any> => {
    return items.filter(item => item.key !== key);
}


export const printResponses = (responses: SurveyItemResponse, prefix: string) => {
    console.log(prefix + responses.key);
    // console.log(prefix + responses.meta);
    if (isSurveyGroupItemResponse(responses)) {
        responses.items.forEach(i => {
            printResponses(i, prefix + '\t');
        })
    } else {
        console.log(prefix + responses.response?.key);
        console.log(prefix + responses.response?.items?.length);
    }
}

export const printSurveyItem = (surveyItem: SurveyItem, prefix: string) => {
    console.log(prefix + surveyItem.key);
    if (isSurveyGroupItem(surveyItem)) {
        surveyItem.items.forEach(i => {
            printSurveyItem(i, prefix + '\t');
        })
    } else {
        console.log(surveyItem.components.map(c => {
            const content = c.content ? c.content[0] : { parts: [] };
            return prefix + (content as LocalizedString).parts.join('');

        }).join('\n'));
    }
}