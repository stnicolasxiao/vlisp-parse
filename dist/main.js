"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = __importDefault(require("./parser"));
function parse(source) {
    console.log("mofalisp v0.0.1 by nicolassiu");
    let parser = new parser_1.default(source);
    let node = parser.Parse();
    parser.emitDiagnosis();
    return node;
}
exports.parse = parse;
//# sourceMappingURL=main.js.map