export type TimestampType = 'rendered' | 'displayed' | 'responded';

export interface ResponseMeta {
    position: number; // position in the list
    // timestamps:
    rendered: Array<number>;
    displayed: Array<number>;
    responded: Array<number>;
}

export interface SurveyResponse {
    reporter: string; // this survey is reported by this user
    for: string; // profile id - this survey is reported for the given profile
    responses: ResponseGroup;
}

interface SurveyResponseItem {
    key: string;
    meta: ResponseMeta;
}

export interface ResponseGroup extends SurveyResponseItem {
    items: Array<ResponseGroup | QResponse>
}

export const isResponseGroup = (item: ResponseGroup | QResponse): item is ResponseGroup => {
    return (item as ResponseGroup).items !== undefined;
}

export interface QResponse extends SurveyResponseItem {
    variant?: string;
    localisation?: string;
    response?: any;
}
