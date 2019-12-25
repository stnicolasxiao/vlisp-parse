"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = __importStar(require("./lexer"));
const ast_1 = __importStar(require("./ast"));
class Parser {
    constructor(source) {
        this.lexer = new lexer_1.default(source);
        this.lexer.nextToken();
    }
    Parse() {
        return this.ParseForm();
    }
    ParseForm() {
        switch (this.lexer.tokenType) {
            case lexer_1.TokenType.TTIDEN:
                {
                    let node = new ast_1.default();
                    node.nodeType = ast_1.NodeType.NTSYM;
                    node.sval = this.lexer.token;
                    this.lexer.nextToken();
                    return node;
                }
            case lexer_1.TokenType.TTNUM:
                {
                    let num = parseFloat(this.lexer.token);
                    if (isNaN(num)) {
                        throw new Error('not a number');
                    }
                    let node = new ast_1.default();
                    node.nodeType = ast_1.NodeType.NTNUM;
                    node.nval = num;
                    this.lexer.nextToken();
                    return node;
                }
            case lexer_1.TokenType.TTLITERAL:
                {
                    let node = new ast_1.default();
                    node.nodeType = ast_1.NodeType.NTLITERAL;
                    node.sval = this.lexer.token;
                    this.lexer.nextToken();
                    return node;
                }
            case lexer_1.TokenType.TTLBRK:
                {
                    return this.ParseSExpr();
                }
            case lexer_1.TokenType.TTQUOTE:
                {
                    this.lexer.nextToken();
                    let quoteNode = this.ParseForm();
                    let nodes = [];
                    let node = new ast_1.default();
                    node.nodeType = ast_1.NodeType.NTSYM;
                    node.sval = "quote";
                    nodes.push(node);
                    nodes.push(quoteNode);
                    return makeList(nodes, false);
                }
            default:
                throw new Error("unknown token:" + this.lexer.token);
        }
    }
    ParseSExpr() {
        if (this.lexer.isType(lexer_1.TokenType.TTLBRK)) {
            this.lexer.nextToken();
            let nodes = [];
            let isDotList = false;
            while (!this.lexer.isType(lexer_1.TokenType.TTEOF) && !this.lexer.isType(lexer_1.TokenType.TTRBRK)) {
                if (this.lexer.token == ".") {
                    this.lexer.nextToken();
                    isDotList = true;
                }
                else {
                    // todo if isdotlist is true, only one can follow it
                    let node = this.ParseForm();
                    nodes.push(node);
                }
            }
            let cdrNode = makeList(nodes, isDotList);
            if (this.lexer.isType(lexer_1.TokenType.TTRBRK)) {
                this.lexer.nextToken();
                return cdrNode;
            }
            else {
                throw new Error("require )");
            }
        }
        else {
            // error
            throw new Error("require (");
        }
    }
}
exports.default = Parser;
function makeList(nodes, isDotList) {
    if (isDotList) {
        return makeCons(nodes);
    }
    let cdrNode = new ast_1.default();
    cdrNode.nodeType = ast_1.NodeType.NTSEXPR;
    for (let x = nodes.length - 1; x >= 0; x--) {
        cdrNode = new ast_1.default();
        cdrNode.nodeType = ast_1.NodeType.NTSEXPR;
        cdrNode.car = nodes[x];
        cdrNode.cdr = cdrNode;
    }
    return cdrNode;
}
function makeCons(nodes) {
    let cdrNode = new ast_1.default();
    cdrNode.nodeType = ast_1.NodeType.NTSEXPR;
    if (nodes.length == 0) {
        return cdrNode;
    }
    cdrNode = nodes[nodes.length - 1];
    for (let x = nodes.length - 2; x >= 0; x--) {
        cdrNode = new ast_1.default();
        cdrNode.nodeType = ast_1.NodeType.NTSEXPR;
        cdrNode.car = nodes[x];
        cdrNode.cdr = cdrNode;
    }
    return cdrNode;
}
//# sourceMappingURL=parser.js.map