export type TimestampType = 'rendered' | 'displayed' | 'responded';

export type SurveyItemResponse = SurveySingleItemResponse | SurveyGroupItemResponse;

interface SurveyItemResponseBase {
    key: string;
    meta: ResponseMeta;
}

export interface SurveySingleItemResponse extends SurveyItemResponseBase {
    response?: ResponseValue;
}

export interface SurveyGroupItemResponse extends SurveyItemResponseBase {
    items: Array<SurveyItemResponse | SurveyItemResponse>
}

export const isSurveyItemGroupResponse = (item: SurveyGroupItemResponse | SurveyItemResponse): item is SurveyGroupItemResponse => {
    const items = (item as SurveyGroupItemResponse).items;
    return items !== undefined && items.length > 0;
}

export interface ResponseValue {
    key: string;
    value?: string;
    dtype?: string;
    items?: ResponseValue[];
}

export interface ResponseMeta {
    position: number; // position in the list
    localeCode: string;
    version: number;
    // timestamps:
    rendered: Array<number>;
    displayed: Array<number>;
    responded: Array<number>;
}
