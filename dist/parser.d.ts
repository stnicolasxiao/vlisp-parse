import Lexer from './lexer';
import AstNode from './ast';
export default class Parser {
    lexer: Lexer;
    constructor(source: string);
    Parse(): AstNode;
    ParseForm(): AstNode;
    ParseSExpr(): AstNode;
}
