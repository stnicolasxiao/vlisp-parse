
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

  toString(): string {
    switch (this.nodeType) {
      case NodeType.NTSEXPR:
        {
          if (isEmpty(this)) {
            return "nil"
          } else {
            let carNode : AstNode= car(this)
            let cdrNode :AstNode= cdr(this)
            let strs :string[]= []
            strs.push(carNode.toString())
            while (!isEmpty(cdrNode)) {
              carNode = car(cdrNode)
              cdrNode = cdr(cdrNode)
              strs.push(carNode.toString())
            }
            return "<form:" + strs.join(" ")  + ">"
          }
        }
      case NodeType.NTNUM:
        return ""+this.nval
      case NodeType.NTLITERAL:
        return `"${this.sval}"`
      case NodeType.NTSYM:
        return `<sym:${this.sval}>`
      default:
        throw new Error('unknown node')
    }
  }
}
function car(node :AstNode) :AstNode {
	if (node.car)  {
		return node.car
	}
	throw new Error("cannot car on empty node")
}

function cdr(node :AstNode) :AstNode {
	if (node.cdr)  {
		return node.cdr
	}
	throw new Error("cannot cdr on empty node")
}
function isEmpty(node :AstNode): boolean {
	return !node.car && !node.cdr
}