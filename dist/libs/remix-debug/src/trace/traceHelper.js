'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.isContractCreation = exports.contractCreationToken = exports.isCallToPrecompiledContract = exports.newContextStorage = exports.isSHA3Instruction = exports.isSSTOREInstruction = exports.isRevertInstruction = exports.isStopInstruction = exports.isJumpDestInstruction = exports.isReturnInstruction = exports.isCreateInstruction = exports.isCallInstruction = exports.resolveCalledAddress = void 0;
const remix_lib_1 = require("@remix-project/remix-lib");
const { ui } = remix_lib_1.helpers;
// vmTraceIndex has to point to a CALL, CODECALL, ...
function resolveCalledAddress(vmTraceIndex, trace) {
    const step = trace[vmTraceIndex];
    if (isCreateInstruction(step)) {
        return contractCreationToken(vmTraceIndex);
    }
    else if (isCallInstruction(step)) {
        const stack = step.stack; // callcode, delegatecall, ...
        return ui.normalizeHexAddress(stack[stack.length - 2]);
    }
    return undefined;
}
exports.resolveCalledAddress = resolveCalledAddress;
function isCallInstruction(step) {
    return ['CALL', 'STATICCALL', 'CALLCODE', 'CREATE', 'DELEGATECALL', 'CREATE2'].includes(step.op);
}
exports.isCallInstruction = isCallInstruction;
function isCreateInstruction(step) {
    return step.op === 'CREATE' || step.op === 'CREATE2';
}
exports.isCreateInstruction = isCreateInstruction;
function isReturnInstruction(step) {
    return step.op === 'RETURN';
}
exports.isReturnInstruction = isReturnInstruction;
function isJumpDestInstruction(step) {
    return step.op === 'JUMPDEST';
}
exports.isJumpDestInstruction = isJumpDestInstruction;
function isStopInstruction(step) {
    return step.op === 'STOP';
}
exports.isStopInstruction = isStopInstruction;
function isRevertInstruction(step) {
    return step.op === 'REVERT';
}
exports.isRevertInstruction = isRevertInstruction;
function isSSTOREInstruction(step) {
    return step.op === 'SSTORE';
}
exports.isSSTOREInstruction = isSSTOREInstruction;
function isSHA3Instruction(step) {
    return step.op === 'SHA3';
}
exports.isSHA3Instruction = isSHA3Instruction;
function newContextStorage(step) {
    return step.op === 'CREATE' || step.op === 'CALL' || step.op === 'CREATE2';
}
exports.newContextStorage = newContextStorage;
function isCallToPrecompiledContract(index, trace) {
    // if stack empty => this is not a precompiled contract
    const step = trace[index];
    if (isCallInstruction(step)) {
        return index + 1 < trace.length && trace[index + 1].stack.length !== 0;
    }
    return false;
}
exports.isCallToPrecompiledContract = isCallToPrecompiledContract;
function contractCreationToken(index) {
    return '(Contract Creation - Step ' + index + ')';
}
exports.contractCreationToken = contractCreationToken;
function isContractCreation(address) {
    return address.indexOf('(Contract Creation - Step') !== -1;
}
exports.isContractCreation = isContractCreation;
//# sourceMappingURL=traceHelper.js.map