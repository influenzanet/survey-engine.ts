export interface Expression {
    name: string;
    dtype?: string;
    data?: ExpressionArg[];
}

export const isExpression = (value: Expression | any): value is Expression => {
    return typeof (value) === 'object' && (value as Expression).name !== undefined && (value as Expression).name.length > 0;
}

export interface ExpressionArg {
    exp?: Expression;
    str?: string;
    num?: number;
}