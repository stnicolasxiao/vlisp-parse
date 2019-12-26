import Diagnosis, { Position, ErrorReport } from './diagnosis'

export enum TokenType {
  TTIDEN,
  TTLITERAL,
  TTNUM,
  TTLBRK,
  TTRBRK,
  TTQUOTE,
  TTDOT,
  TTEOF
}

function isAlpha(c: string): boolean {
  if (c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z') {
    return true
  }
  switch (c) {
    case '+':
    case '-':
    case '*': case '/': case '>': case '<': case '!': case '?': case '=':
      return true
  }
  return false
}

function isNum(c: string): boolean {
  return c >= '0' && c <= '9'
}

function isAlphanum(c: string): boolean {
  return isAlpha(c) || isNum(c)
}

function isSpace(c: string): boolean {
  return c == ' ' || c == '\r' || c == '\n' || c == '\t'
}

export default class Lexer {
  token: string
  tokenType: TokenType
  cc: string
  pc: number
  source: string
  sourceLen: number
  diagnosis: Diagnosis
  pos: Position

  constructor(source: string, diagnosis: Diagnosis) {
    this.source = source
    this.sourceLen = this.source.length
    this.cc = ''
    this.pc = 0
    this.diagnosis = diagnosis
    this.pos = new Position(0, 0)
    this.nextChar()
  }
  getPos(): Position {
    return this.pos
  }

  nextChar() {
    if (this.pc < this.sourceLen) {
      this.cc = this.source[this.pc]
      this.pc++
    } else {
      this.cc = ''
    }
  }
  isType(tokenType: TokenType): boolean {
    return this.tokenType == tokenType
  }
  nextToken() {
    while (isSpace(this.cc)) {
      this.nextChar()
    }

    if (isAlpha(this.cc)) {
      let token: string
      token = this.cc
      this.nextChar()
      while (isAlphanum(this.cc)) {
        token += this.cc
        this.nextChar()
      }
      this.token = token
      this.tokenType = TokenType.TTIDEN
    } else if (isNum(this.cc)) {
      let token: string
      token = this.cc
      this.nextChar()

      while (isNum(this.cc)) {
        token += this.cc
        this.nextChar()
      }
      this.token = token
      this.tokenType = TokenType.TTNUM
    } else if (this.cc == '') {
      // eof
      this.token = ""
      this.tokenType = TokenType.TTEOF

    } else if (this.cc == '"') {
      let token: string = ""
      this.nextChar()

      //todo add escape char support
      while (this.cc != '"' && this.cc != '' && this.cc != '\r' && this.cc != '\n') {
        token += this.cc
        this.nextChar()
      }
      if (this.cc == '"') {
        this.nextChar()
      } else {
        this.diagnosis.addError(new ErrorReport("string literal require right quote", this.pos))
      }
      this.token = token
      this.tokenType = TokenType.TTLITERAL
    } else if (this.cc == '\'') {
      // syntax sugar for quote
      this.nextChar()
      this.token = "'"
      this.tokenType = TokenType.TTQUOTE
    } else {
      switch (this.cc) {
        case '(':
          this.token = "("
          this.tokenType = TokenType.TTLBRK
          this.nextChar()
          break;
        case ')':
          this.token = ")"
          this.tokenType = TokenType.TTRBRK
          this.nextChar()
          break;
        case '.':
          this.token = "."
          this.tokenType = TokenType.TTDOT
          this.nextChar()
          break;
        default:
          this.diagnosis.addError(new ErrorReport("unknown char: " + this.cc, this.pos))
          this.nextChar() //ignore the error char
      }
    }
  }
}
