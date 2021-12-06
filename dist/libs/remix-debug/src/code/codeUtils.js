'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundLog = exports.log = exports.pad = exports.parseCode = exports.nameOpCodes = void 0;
const tslib_1 = require("tslib");
const common_1 = (0, tslib_1.__importDefault)(require("@ethereumjs/common"));
const opcodes_1 = require("@ethereumjs/vm/dist/evm/opcodes");
const opcodes_2 = (0, tslib_1.__importDefault)(require("./opcodes"));
function nameOpCodes(raw, hardfork) {
    const common = new common_1.default({ chain: 'mainnet', hardfork });
    const opcodes = (0, opcodes_1.getOpcodesForHF)(common);
    let pushData = '';
    const codeMap = {};
    const code = [];
    for (let i = 0; i < raw.length; i++) {
        const pc = i;
        let curOpCode;
        try {
            curOpCode = opcodes.get(raw[pc]).fullName;
        }
        catch (e) {
            curOpCode = 'INVALID';
        }
        codeMap[i] = code.length;
        // no destinations into the middle of PUSH
        if (curOpCode.slice(0, 4) === 'PUSH') {
            const jumpNum = raw[pc] - 0x5f;
            pushData = raw.slice(pc + 1, pc + jumpNum + 1);
            i += jumpNum;
        }
        const data = pushData.toString('hex') !== '' ? ' ' + pushData.toString('hex') : '';
        code.push(pad(pc, roundLog(raw.length, 10)) + ' ' + curOpCode + data);
        pushData = '';
    }
    return [code, codeMap];
}
exports.nameOpCodes = nameOpCodes;
/**
 * Parses code as a list of integers into a list of objects containing
 * information about the opcode.
 */
function parseCode(raw) {
    const common = new common_1.default({ chain: 'mainnet', hardfork: 'london' });
    const opcodes = (0, opcodes_1.getOpcodesForHF)(common);
    const code = [];
    for (let i = 0; i < raw.length; i++) {
        const opcode = { name: 'INVALID' };
        try {
            const code = opcodes.get(raw[i]);
            const opcodeDetails = (0, opcodes_2.default)(raw[i], false);
            opcode.in = opcodeDetails.in;
            opcode.out = opcodeDetails.out;
            opcode.name = code.fullName;
        }
        catch (e) {
            opcode.name = 'INVALID';
        }
        if (opcode.name.slice(0, 4) === 'PUSH') {
            const length = raw[i] - 0x5f;
            opcode.pushData = raw.slice(i + 1, i + length + 1);
            // in case pushdata extends beyond code
            if (i + 1 + length > raw.length) {
                for (let j = opcode['pushData'].length; j < length; j++) {
                    opcode['pushData'].push(0);
                }
            }
            i += length;
        }
        code.push(opcode);
    }
    return code;
}
exports.parseCode = parseCode;
function pad(num, size) {
    let s = num + '';
    while (s.length < size)
        s = '0' + s;
    return s;
}
exports.pad = pad;
function log(num, base) {
    return Math.log(num) / Math.log(base);
}
exports.log = log;
function roundLog(num, base) {
    return Math.ceil(log(num, base));
}
exports.roundLog = roundLog;
//# sourceMappingURL=codeUtils.js.map