import Parser from './parser'
import AstNode from './ast'

export function parse(source: string): AstNode {
  console.log("mofalisp v0.0.1 by nicolassiu")

  let parser: Parser = new Parser(source)

  let node: AstNode = parser.Parse()

  parser.emitDiagnosis()

  return node
}
