import { Expression, ExpressionArg } from "./expression";

// ----------------------------------------------------------------------
export type ItemComponent = ItemComponentBase | ResponseGroupComponent | ResponseComponent;

interface ItemComponentBase {
    role: string; // purpose of the component
    key?: string; // unique identifier
    content?: Array<LocalizedObject>; // array with item that are a sub-type of LocalizedObject
    displayCondition?: Expression | boolean;
    disabled?: Expression | boolean;
}

export interface ResponseComponent extends ItemComponentBase {
    dtype: string;
}

export interface ResponseGroupComponent extends ItemComponentBase {
    items: Array<ItemComponent>;
    order: Expression;
}

export const isResponseOptionGroup = (item: ItemComponent): item is ResponseGroupComponent => {
    const items = (item as ResponseGroupComponent).items;
    return items !== undefined && items.length > 0;
}


// ----------------------------------------------------------------------
export type LocalizedObject = LocalizedString | LocalizedMedia;

export interface LocalizedObjectBase {
    code: string;
}

export interface LocalizedString extends LocalizedObjectBase {
    parts: Array<ExpressionArg>; // in case of an expression it should return a string
}

export interface LocalizedMedia extends LocalizedObjectBase {
    // TODO: define common properties
    // TODO: define image object
    // TODO: define video object
    // TODO: define audio object
}
