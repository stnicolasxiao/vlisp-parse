
import Lexer, { TokenType } from './lexer'
import AstNode, { NodeType } from './ast'

interface Token {
  token: string
  tokenType: TokenType
}
export default class Parser {
  lexer: Lexer

  constructor(source: string) {
    this.lexer = new Lexer(source)
    this.lexer.nextToken()
  }


  Parse(): AstNode {
    return this.ParseForm()
  }

  ParseForm(): AstNode {
    switch (this.lexer.tokenType) {
      case TokenType.TTIDEN:
        {
          let node: AstNode = new AstNode()
          node.nodeType = NodeType.NTSYM
          node.sval = this.lexer.token
          this.lexer.nextToken()
          return node
        }
      case TokenType.TTNUM:
        {
          let num: number = parseFloat(this.lexer.token)

          if (isNaN(num)) {
            throw new Error('not a number')
          }
          let node: AstNode = new AstNode()
          node.nodeType = NodeType.NTNUM
          node.nval = num
          this.lexer.nextToken()
          return node
        }
      case TokenType.TTLITERAL:
        {
          let node: AstNode = new AstNode()
          node.nodeType = NodeType.NTLITERAL
          node.sval = this.lexer.token
          this.lexer.nextToken()
          return node
        }
      case TokenType.TTLBRK:
        {
          return this.ParseSExpr()
        }
      case TokenType.TTQUOTE:
        {
          this.lexer.nextToken()
          let quoteNode: AstNode = this.ParseForm()
          let nodes: AstNode[] = []
          let node: AstNode = new AstNode()
          node.nodeType = NodeType.NTSYM
          node.sval = "quote"
          nodes.push(node)
          nodes.push(quoteNode)
          return makeList(nodes, false)
        }
      default:
        throw new Error("unknown token:" + this.lexer.token)
    }
  }
  ParseSExpr(): AstNode {
    if (this.lexer.isType(TokenType.TTLBRK)) {
       this.lexer.nextToken() 

      let nodes: AstNode[] = []

      let isDotList: boolean = false
      while (!this.lexer.isType(TokenType.TTEOF) && !this.lexer.isType(TokenType.TTRBRK)) {
        if (this.lexer.token == ".") {
           this.lexer.nextToken()
          isDotList = true
        } else {
          // todo if isdotlist is true, only one can follow it
          let node: AstNode = this.ParseForm()
          nodes.push(node)
        }
      }

      let cdrNode: AstNode = makeList(nodes, isDotList)

      if (this.lexer.isType(TokenType.TTRBRK)) {
        this.lexer.nextToken()
        return cdrNode
      } else {
        throw new Error("require )")
      }

    } else {
      // error
      throw new Error("require (")
    }
  }
}

function makeList(nodes: AstNode[], isDotList: boolean): AstNode {
  if (isDotList) {
    return makeCons(nodes)
  }
  let cdrNode: AstNode = new AstNode()
  cdrNode.nodeType = NodeType.NTSEXPR

  for (let x: number = nodes.length - 1; x >= 0; x--) {
    cdrNode = new AstNode()
    cdrNode.nodeType = NodeType.NTSEXPR
    cdrNode.car = nodes[x]
    cdrNode.cdr = cdrNode
  }
  return cdrNode
}

function makeCons(nodes: AstNode[]): AstNode {
  let cdrNode: AstNode = new AstNode()
  cdrNode.nodeType = NodeType.NTSEXPR

  if (nodes.length == 0) {
    return cdrNode
  }
  cdrNode = nodes[nodes.length - 1]

  for (let x: number = nodes.length - 2; x >= 0; x--) {
    cdrNode = new AstNode()
    cdrNode.nodeType = NodeType.NTSEXPR
    cdrNode.car = nodes[x]
    cdrNode.cdr = cdrNode
  }
  return cdrNode
}
