export declare class Position {
    line: number;
    col: number;
    constructor(line: number, col: number);
}
export declare class ErrorReport {
    message: string;
    pos: Position;
    constructor(message: string, pos: Position);
    toString(): string;
}
export default class Diagnosis {
    errors: ErrorReport[];
    addError(error: ErrorReport): void;
    report(): void;
}
