

interface RenderedSurveyItem {
    key: string;
}

export interface RenderedQuestion extends RenderedSurveyItem {
    // TODO: define question related properties
}

export interface RenderedQuestionGroup extends RenderedSurveyItem {
    // TODO: define group related properties
    items: Array<RenderedSurveyItem | RenderedQuestion>;
}

export const isRenderedQuestionGroup = (item: RenderedQuestionGroup | RenderedQuestion): item is RenderedQuestionGroup => {
    return (item as RenderedQuestionGroup).items !== undefined;
}
