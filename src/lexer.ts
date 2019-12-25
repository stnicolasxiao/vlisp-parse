

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



  constructor(source: string) {

    this.source = source
    this.sourceLen = this.source.length
    this.cc = ''
    this.pc = 0
    this.nextChar()

  }

  nextChar() {
    if (this.pc < this.sourceLen) {
      this.cc = this.source[this.pc]
      this.pc++
    } else {
      this.cc = ''
    }
  }
  isType(tokenType:TokenType) :boolean {
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
        throw new Error("string literal require right quote")
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
          throw new Error("unknown char: " + this.cc)
      }
    }

    return {
      token: this.token,
      tokenType: this.tokenType
    }
  }

}
