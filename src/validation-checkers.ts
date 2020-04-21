import { SurveySingleItem } from "./data_types";

interface ValidityResults {
    soft: boolean;
    hard: boolean;
}

export const checkSurveyItemValidity = (item: SurveySingleItem): ValidityResults => {
    const results = {
        soft: true,
        hard: true
    }
    if (!item.validations) {
        return results;
    }
    item.validations.forEach(validation => {
        if (!validation.rule) {
            switch (validation.type) {
                case 'soft':
                    results.soft = false;
                    break;
                case 'hard':
                    results.hard = false;
                    break;
                default:
                    break;
            }
        }
    });
    return results;
}

export const checkSurveyItemsValidity = (items: SurveySingleItem[]): ValidityResults => {
    const results = {
        soft: true,
        hard: true
    };

    for (let item of items) {
        const itemValid = checkSurveyItemValidity(item);
        if (!itemValid.soft) {
            results.soft = false;
        }
        if (!itemValid.hard) {
            results.hard = false;
        }
        if (!results.soft && !results.hard) {
            break;
        }
    }
    return results;
}