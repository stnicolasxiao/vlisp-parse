"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NodeType;
(function (NodeType) {
    NodeType[NodeType["NTSEXPR"] = 0] = "NTSEXPR";
    NodeType[NodeType["NTNUM"] = 1] = "NTNUM";
    NodeType[NodeType["NTLITERAL"] = 2] = "NTLITERAL";
    NodeType[NodeType["NTSYM"] = 3] = "NTSYM";
})(NodeType = exports.NodeType || (exports.NodeType = {}));
class AstNode {
    toString() {
        switch (this.nodeType) {
            case NodeType.NTSEXPR:
                {
                    if (isEmpty(this)) {
                        return "nil";
                    }
                    else {
                        let carNode = car(this);
                        let cdrNode = cdr(this);
                        let strs = [];
                        strs.push(carNode.toString());
                        while (!isEmpty(cdrNode)) {
                            carNode = car(cdrNode);
                            cdrNode = cdr(cdrNode);
                            strs.push(carNode.toString());
                        }
                        return "<form:" + strs.join(" ") + ">";
                    }
                }
            case NodeType.NTNUM:
                return "" + this.nval;
            case NodeType.NTLITERAL:
                return `"${this.sval}"`;
            case NodeType.NTSYM:
                return `<sym:${this.sval}>`;
            default:
                throw new Error('unknown node');
        }
    }
}
exports.default = AstNode;
function car(node) {
    if (node.car) {
        return node.car;
    }
    throw new Error("cannot car on empty node");
}
function cdr(node) {
    if (node.cdr) {
        return node.cdr;
    }
    throw new Error("cannot cdr on empty node");
}
function isEmpty(node) {
    return !node.car && !node.cdr;
}
//# sourceMappingURL=ast.js.map