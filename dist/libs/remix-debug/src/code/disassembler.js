'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.disassemble = void 0;
const codeUtils_1 = require("./codeUtils");
const remix_lib_1 = require("@remix-project/remix-lib");
const ethereumjs_util_1 = require("ethereumjs-util");
function createExpressions(instructions) {
    const expressions = [];
    let labels = 0;
    for (let i = 0; i < instructions.length; i++) {
        const expr = instructions[i];
        expr.functional = false;
        if (expr.name === 'JUMPDEST') {
            expr.label = 'label' + (++labels);
            // eslint-disable-next-line no-empty
        }
        else if (expr.name.slice(0, 3) === 'DUP') {
            // eslint-disable-next-line no-empty
        }
        else if (expr.name.slice(0, 4) === 'SWAP') {
        }
        else if (expr.out <= 1 && expr.in <= expressions.length) {
            let error = false;
            for (let j = 0; j < expr.in && !error; j++) {
                const arg = expressions[expressions.length - j - 1];
                if (!arg.functional || arg.out !== 1) {
                    error = true;
                    break;
                }
            }
            if (!error) {
                expr.args = expressions.splice(expressions.length - expr.in);
                expr.functional = true;
            }
        }
        expressions.push(expr);
    }
    return expressions;
}
function toString(expr) {
    if (expr.name.slice(0, 4) === 'PUSH') {
        return (0, ethereumjs_util_1.bufferToHex)(expr.pushData);
    }
    else if (expr.name === 'JUMPDEST') {
        return expr.label + ':';
    }
    else if (expr.args) {
        return expr.name.toLowerCase() + '(' + expr.args.reverse().map(toString).join(', ') + ')';
    }
    return expr.name.toLowerCase();
}
/**
  * Disassembler that turns bytecode (as a hex string) into Solidity inline assembly.
  */
function disassemble(input) {
    const code = (0, codeUtils_1.parseCode)(remix_lib_1.util.hexToIntArray(input));
    return createExpressions(code).map(toString).join('\n');
}
exports.disassemble = disassemble;
//# sourceMappingURL=disassembler.js.map