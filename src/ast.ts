
export enum NodeType {
  NTSEXPR,
  NTNUM,
  NTLITERAL,
  NTSYM
}

export default class AstNode {
  nodeType: NodeType
  sval: string
  nval: number
  car: AstNode
  cdr: AstNode
}



