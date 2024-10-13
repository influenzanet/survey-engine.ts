import { ConfidentialMode } from "./survey-item";

export type TimestampType = 'rendered' | 'displayed' | 'responded';

export interface SurveyResponse {
  key: string;
  participantId?: string;
  submittedAt: number;
  openedAt?: number;
  versionId: string;
  responses: SurveySingleItemResponse[];
  context?: any; // key value pairs of data
}

export type SurveyItemResponse = SurveySingleItemResponse | SurveyGroupItemResponse;

interface SurveyItemResponseBase {
  key: string;
  meta?: ResponseMeta;
}

export interface SurveySingleItemResponse extends SurveyItemResponseBase {
  response?: ResponseItem;
  confidentialMode?: ConfidentialMode;
  mapToKey?: string; // if the response should be mapped to another key in confidential mode
}

export interface SurveyGroupItemResponse extends SurveyItemResponseBase {
  items: Array<SurveyItemResponse | SurveyItemResponse>
}

export const isSurveyGroupItemResponse = (item: SurveyGroupItemResponse | SurveyItemResponse): item is SurveyGroupItemResponse => {
  const items = (item as SurveyGroupItemResponse).items;
  return items !== undefined && items.length > 0;
}

export interface ResponseItem {
  key: string;
  value?: string;
  dtype?: string;
  items?: ResponseItem[];
}

export interface ResponseMeta {
  position: number; // position in the list
  localeCode?: string;
  // timestamps:
  rendered: Array<number>;
  displayed: Array<number>;
  responded: Array<number>;
}
