"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const txOrigin_1 = (0, tslib_1.__importDefault)(require("./txOrigin"));
const gasCosts_1 = (0, tslib_1.__importDefault)(require("./gasCosts"));
const thisLocal_1 = (0, tslib_1.__importDefault)(require("./thisLocal"));
const checksEffectsInteraction_1 = (0, tslib_1.__importDefault)(require("./checksEffectsInteraction"));
const constantFunctions_1 = (0, tslib_1.__importDefault)(require("./constantFunctions"));
const similarVariableNames_1 = (0, tslib_1.__importDefault)(require("./similarVariableNames"));
const inlineAssembly_1 = (0, tslib_1.__importDefault)(require("./inlineAssembly"));
const blockTimestamp_1 = (0, tslib_1.__importDefault)(require("./blockTimestamp"));
const lowLevelCalls_1 = (0, tslib_1.__importDefault)(require("./lowLevelCalls"));
const blockBlockhash_1 = (0, tslib_1.__importDefault)(require("./blockBlockhash"));
const noReturn_1 = (0, tslib_1.__importDefault)(require("./noReturn"));
const selfdestruct_1 = (0, tslib_1.__importDefault)(require("./selfdestruct"));
const guardConditions_1 = (0, tslib_1.__importDefault)(require("./guardConditions"));
const deleteDynamicArrays_1 = (0, tslib_1.__importDefault)(require("./deleteDynamicArrays"));
const assignAndCompare_1 = (0, tslib_1.__importDefault)(require("./assignAndCompare"));
const erc20Decimals_1 = (0, tslib_1.__importDefault)(require("./erc20Decimals"));
const stringBytesLength_1 = (0, tslib_1.__importDefault)(require("./stringBytesLength"));
const deleteFromDynamicArray_1 = (0, tslib_1.__importDefault)(require("./deleteFromDynamicArray"));
const forLoopIteratesOverDynamicArray_1 = (0, tslib_1.__importDefault)(require("./forLoopIteratesOverDynamicArray"));
const etherTransferInLoop_1 = (0, tslib_1.__importDefault)(require("./etherTransferInLoop"));
const intDivisionTruncate_1 = (0, tslib_1.__importDefault)(require("./intDivisionTruncate"));
exports.default = [
    txOrigin_1.default,
    gasCosts_1.default,
    thisLocal_1.default,
    checksEffectsInteraction_1.default,
    erc20Decimals_1.default,
    constantFunctions_1.default,
    similarVariableNames_1.default,
    inlineAssembly_1.default,
    blockTimestamp_1.default,
    lowLevelCalls_1.default,
    blockBlockhash_1.default,
    noReturn_1.default,
    selfdestruct_1.default,
    guardConditions_1.default,
    deleteDynamicArrays_1.default,
    assignAndCompare_1.default,
    stringBytesLength_1.default,
    deleteFromDynamicArray_1.default,
    forLoopIteratesOverDynamicArray_1.default,
    etherTransferInLoop_1.default,
    intDivisionTruncate_1.default
];
//# sourceMappingURL=list.js.map