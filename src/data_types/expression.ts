export interface Expression {
    name: string;
    returnType?: string;
    data?: ExpressionArg[];
}

export const isExpression = (value: Expression | any): value is Expression => {
    return typeof (value) === 'object' && (value as Expression).name !== undefined && (value as Expression).name.length > 0;
}

export type ExpressionArgDType = 'exp' | 'num' | 'str';

export interface ExpressionArg {
    dtype?: ExpressionArgDType; // should default to str;
    exp?: Expression;
    str?: string;
    num?: number;
}