export type TimestampType = 'rendered' | 'displayed' | 'responded';

export type SurveyItemResponse = SingleSurveyItemResponse | SurveyItemGroupResponse;

interface SurveyItemResponseBase {
    key: string;
    meta: ResponseMeta;
}

export interface SingleSurveyItemResponse extends SurveyItemResponseBase {
    response?: ResponseValue;
}

export interface SurveyItemGroupResponse extends SurveyItemResponseBase {
    items: Array<SurveyItemResponse | SurveyItemResponse>
}

export const isSurveyItemGroupResponse = (item: SurveyItemGroupResponse | SurveyItemResponse): item is SurveyItemGroupResponse => {
    const items = (item as SurveyItemGroupResponse).items;
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
