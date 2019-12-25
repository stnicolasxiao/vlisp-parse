export declare enum NodeType {
    NTSEXPR = 0,
    NTNUM = 1,
    NTLITERAL = 2,
    NTSYM = 3
}
export default class AstNode {
    nodeType: NodeType;
    sval: string;
    nval: number;
    car: AstNode;
    cdr: AstNode;
    toString(): string;
}
