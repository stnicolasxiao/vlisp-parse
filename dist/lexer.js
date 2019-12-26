"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const diagnosis_1 = require("./diagnosis");
var TokenType;
(function (TokenType) {
    TokenType[TokenType["TTIDEN"] = 0] = "TTIDEN";
    TokenType[TokenType["TTLITERAL"] = 1] = "TTLITERAL";
    TokenType[TokenType["TTNUM"] = 2] = "TTNUM";
    TokenType[TokenType["TTLBRK"] = 3] = "TTLBRK";
    TokenType[TokenType["TTRBRK"] = 4] = "TTRBRK";
    TokenType[TokenType["TTQUOTE"] = 5] = "TTQUOTE";
    TokenType[TokenType["TTDOT"] = 6] = "TTDOT";
    TokenType[TokenType["TTEOF"] = 7] = "TTEOF";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
function isAlpha(c) {
    if (c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z') {
        return true;
    }
    switch (c) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '>':
        case '<':
        case '!':
        case '?':
        case '=':
            return true;
    }
    return false;
}
function isNum(c) {
    return c >= '0' && c <= '9';
}
function isAlphanum(c) {
    return isAlpha(c) || isNum(c);
}
function isSpace(c) {
    return c == ' ' || c == '\r' || c == '\n' || c == '\t';
}
class Lexer {
    constructor(source, diagnosis) {
        this.source = source;
        this.sourceLen = this.source.length;
        this.cc = '';
        this.pc = 0;
        this.diagnosis = diagnosis;
        this.pos = new diagnosis_1.Position(0, 0);
        this.nextChar();
    }
    getPos() {
        return this.pos;
    }
    nextChar() {
        if (this.pc < this.sourceLen) {
            this.cc = this.source[this.pc];
            this.pc++;
        }
        else {
            this.cc = '';
        }
    }
    isType(tokenType) {
        return this.tokenType == tokenType;
    }
    nextToken() {
        while (isSpace(this.cc)) {
            this.nextChar();
        }
        if (isAlpha(this.cc)) {
            let token;
            token = this.cc;
            this.nextChar();
            while (isAlphanum(this.cc)) {
                token += this.cc;
                this.nextChar();
            }
            this.token = token;
            this.tokenType = TokenType.TTIDEN;
        }
        else if (isNum(this.cc)) {
            let token;
            token = this.cc;
            this.nextChar();
            while (isNum(this.cc)) {
                token += this.cc;
                this.nextChar();
            }
            this.token = token;
            this.tokenType = TokenType.TTNUM;
        }
        else if (this.cc == '') {
            // eof
            this.token = "";
            this.tokenType = TokenType.TTEOF;
        }
        else if (this.cc == '"') {
            let token = "";
            this.nextChar();
            //todo add escape char support
            while (this.cc != '"' && this.cc != '' && this.cc != '\r' && this.cc != '\n') {
                token += this.cc;
                this.nextChar();
            }
            if (this.cc == '"') {
                this.nextChar();
            }
            else {
                this.diagnosis.addError(new diagnosis_1.ErrorReport("string literal require right quote", this.pos));
            }
            this.token = token;
            this.tokenType = TokenType.TTLITERAL;
        }
        else if (this.cc == '\'') {
            // syntax sugar for quote
            this.nextChar();
            this.token = "'";
            this.tokenType = TokenType.TTQUOTE;
        }
        else {
            switch (this.cc) {
                case '(':
                    this.token = "(";
                    this.tokenType = TokenType.TTLBRK;
                    this.nextChar();
                    break;
                case ')':
                    this.token = ")";
                    this.tokenType = TokenType.TTRBRK;
                    this.nextChar();
                    break;
                case '.':
                    this.token = ".";
                    this.tokenType = TokenType.TTDOT;
                    this.nextChar();
                    break;
                default:
                    this.diagnosis.addError(new diagnosis_1.ErrorReport("unknown char: " + this.cc, this.pos));
                    this.nextChar(); //ignore the error char
            }
        }
    }
}
exports.default = Lexer;
//# sourceMappingURL=lexer.js.map