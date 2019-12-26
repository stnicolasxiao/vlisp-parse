import Diagnosis, { Position } from './diagnosis';
export declare enum TokenType {
    TTIDEN = 0,
    TTLITERAL = 1,
    TTNUM = 2,
    TTLBRK = 3,
    TTRBRK = 4,
    TTQUOTE = 5,
    TTDOT = 6,
    TTEOF = 7
}
export default class Lexer {
    token: string;
    tokenType: TokenType;
    cc: string;
    pc: number;
    source: string;
    sourceLen: number;
    diagnosis: Diagnosis;
    pos: Position;
    lineStart: number;
    constructor(source: string, diagnosis: Diagnosis);
    getPos(): Position;
    updatePos(nextline: boolean): void;
    nextChar(): void;
    isType(tokenType: TokenType): boolean;
    nextToken(): void;
}
