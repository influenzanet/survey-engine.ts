import { SurveyItem, isSurveyGroupItem, LocalizedString, SurveyGroupItem, SurveySingleItem, SurveySingleItemResponse } from "./data_types";

export const pickRandomListItem = (items: Array<any>): any => {
    return items[Math.floor(Math.random() * items.length)];
}

export const removeItemByKey = (items: Array<any>, key: string): Array<any> => {
    return items.filter(item => item.key !== key);
}


export const printResponses = (responses: SurveySingleItemResponse[], prefix: string) => {
    responses.forEach((item => {
        console.log(prefix, item);
    }));
}

export const printSurveyItem = (surveyItem: SurveyItem, prefix: string) => {
    console.log(prefix + surveyItem.key);
    if (isSurveyGroupItem(surveyItem)) {
        surveyItem.items.forEach(i => {
            printSurveyItem(i, prefix + '\t');
        })
    } else {
        if (!surveyItem.components) { return; }
        console.log(surveyItem.components.items.map(c => {
            const content = c.content ? c.content[0] : { parts: [] };
            return prefix + (content as LocalizedString).parts.join('');

        }).join('\n'));
    }
}

export const flattenSurveyItemTree = (itemTree: SurveyGroupItem): SurveySingleItem[] => {
    const flatTree = new Array<SurveySingleItem>();

    itemTree.items.forEach(item => {
        if (isSurveyGroupItem(item)) {
            flatTree.push(...flattenSurveyItemTree(item));
        } else {
            flatTree.push({ ...item });
        }
    });
    return flatTree;
}
