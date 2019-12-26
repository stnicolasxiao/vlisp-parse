"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Position {
    constructor(line, col) {
        this.line = line;
        this.col = col;
    }
    clone() {
        return new Position(this.line, this.col);
    }
}
exports.Position = Position;
class ErrorReport {
    constructor(message, pos) {
        this.message = message;
        this.pos = pos.clone();
    }
    toString() {
        return `At line ${this.pos.line} col ${this.pos.col}: ${this.message}`;
    }
}
exports.ErrorReport = ErrorReport;
class Diagnosis {
    constructor() {
        this.errors = [];
    }
    addError(error) {
        this.errors.push(error);
    }
    report() {
        this.errors.forEach(error => {
            console.log(error.toString());
        });
    }
}
exports.default = Diagnosis;
//# sourceMappingURL=diagnosis.js.map