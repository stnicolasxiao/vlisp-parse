
import Lexer, { TokenType } from './lexer'
import AstNode, { NodeType } from './ast'
import Diagnosis, { ErrorReport } from './diagnosis'

interface Token {
  token: string
  tokenType: TokenType
}
export default class Parser {
  lexer: Lexer
  diagnosis: Diagnosis
  constructor(source: string) {
    this.diagnosis = new Diagnosis()
    this.lexer = new Lexer(source, this.diagnosis)
    this.lexer.nextToken()
  }


  Parse(): AstNode {
    console.log('parse:' + this.lexer.token)
    return this.ParseForm()
  }

  emitDiagnosis() {
    this.diagnosis.report()
  }

  ParseForm(): AstNode {
    console.log('parse form:' + this.lexer.token)
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
            this.diagnosis.addError(new ErrorReport('interal error not a number', this.lexer.pos))
            num = 0 // put a default number
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
        this.diagnosis.addError(new ErrorReport("unknown token:" + this.lexer.token, this.lexer.pos))
        this.lexer.nextToken() //ignore this token
    }
  }
  ParseSExpr(): AstNode {
    console.log('parse sexpr:' + this.lexer.token)
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
        this.diagnosis.addError(new ErrorReport("require )", this.lexer.pos))
        //ignore it
        return cdrNode
      }

    } else {
      // error
      this.diagnosis.addError(new ErrorReport("require (", this.lexer.pos))
      // step forward
      this.lexer.nextToken()
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
    let cdrNode2: AstNode = new AstNode()
    cdrNode2.nodeType = NodeType.NTSEXPR
    cdrNode2.car = nodes[x]
    cdrNode2.cdr = cdrNode
    cdrNode = cdrNode2
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
    let cdrNode2: AstNode = new AstNode()
    cdrNode2.nodeType = NodeType.NTSEXPR
    cdrNode2.car = nodes[x]
    cdrNode2.cdr = cdrNode
    cdrNode = cdrNode2
  }
  return cdrNode
}
