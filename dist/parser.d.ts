import Lexer from './lexer';
import AstNode from './ast';
import Diagnosis from './diagnosis';
export default class Parser {
    lexer: Lexer;
    diagnosis: Diagnosis;
    constructor(source: string);
    Parse(): AstNode;
    emitDiagnosis(): void;
    ParseForm(): AstNode;
    ParseSExpr(): AstNode;
}
