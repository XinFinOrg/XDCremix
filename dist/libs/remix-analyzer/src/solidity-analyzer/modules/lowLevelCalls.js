"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const categories_1 = (0, tslib_1.__importDefault)(require("./categories"));
const staticAnalysisCommon_1 = require("./staticAnalysisCommon");
const algorithmCategories_1 = (0, tslib_1.__importDefault)(require("./algorithmCategories"));
class lowLevelCalls {
    constructor() {
        this.llcNodes = [];
        this.name = 'Low level calls: ';
        this.description = 'Should only be used by experienced devs';
        this.category = categories_1.default.SECURITY;
        this.algorithm = algorithmCategories_1.default.EXACT;
        this.version = {
            start: '0.4.12'
        };
    }
    visit(node) {
        if ((0, staticAnalysisCommon_1.isLLCall)(node)) {
            this.llcNodes.push({ node: node, type: staticAnalysisCommon_1.lowLevelCallTypes.CALL });
        }
        else if ((0, staticAnalysisCommon_1.isLLDelegatecall)(node)) {
            this.llcNodes.push({ node: node, type: staticAnalysisCommon_1.lowLevelCallTypes.DELEGATECALL });
        }
        else if ((0, staticAnalysisCommon_1.isLLSend)(node)) {
            this.llcNodes.push({ node: node, type: staticAnalysisCommon_1.lowLevelCallTypes.SEND });
        }
        else if ((0, staticAnalysisCommon_1.isLLDelegatecall04)(node)) {
            this.llcNodes.push({ node: node, type: staticAnalysisCommon_1.lowLevelCallTypes.DELEGATECALL });
        }
        else if ((0, staticAnalysisCommon_1.isLLSend04)(node)) {
            this.llcNodes.push({ node: node, type: staticAnalysisCommon_1.lowLevelCallTypes.SEND });
        }
        else if ((0, staticAnalysisCommon_1.isLLCall04)(node)) {
            this.llcNodes.push({ node: node, type: staticAnalysisCommon_1.lowLevelCallTypes.CALL });
        }
        else if ((0, staticAnalysisCommon_1.isLLCallcode)(node)) {
            this.llcNodes.push({ node: node, type: staticAnalysisCommon_1.lowLevelCallTypes.CALLCODE });
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    report(compilationResults) {
        const version = (0, staticAnalysisCommon_1.getCompilerVersion)(compilationResults.contracts);
        return this.llcNodes.map((item, i) => {
            let text = '';
            let morehref = '';
            switch (item.type) {
                case staticAnalysisCommon_1.lowLevelCallTypes.CALL:
                    text = `Use of "call": should be avoided whenever possible. 
                  It can lead to unexpected behavior if return value is not handled properly. 
                  Please use Direct Calls via specifying the called contract's interface.`;
                    morehref = `https://solidity.readthedocs.io/en/${version}/control-structures.html?#external-function-calls`;
                    break;
                case staticAnalysisCommon_1.lowLevelCallTypes.CALLCODE:
                    text = `Use of "callcode": should be avoided whenever possible. 
                  External code, that is called can change the state of the calling contract and send ether from the caller's balance. 
                  If this is wanted behaviour, use the Solidity library feature if possible.`;
                    morehref = `https://solidity.readthedocs.io/en/${version}/contracts.html#libraries`;
                    break;
                case staticAnalysisCommon_1.lowLevelCallTypes.DELEGATECALL:
                    text = `Use of "delegatecall": should be avoided whenever possible. 
                  External code, that is called can change the state of the calling contract and send ether from the caller's balance. 
                  If this is wanted behaviour, use the Solidity library feature if possible.`;
                    morehref = `https://solidity.readthedocs.io/en/${version}/contracts.html#libraries`;
                    break;
                case staticAnalysisCommon_1.lowLevelCallTypes.SEND:
                    text = `Use of "send": "send" does not throw an exception when not successful, make sure you deal with the failure case accordingly. 
                  Use "transfer" whenever failure of the ether transfer should rollback the whole transaction. 
                  Note: if you "send/transfer" ether to a contract the fallback function is called, the callees fallback function is very limited due to the limited amount of gas provided by "send/transfer". 
                  No state changes are possible but the callee can log the event or revert the transfer. "send/transfer" is syntactic sugar for a "call" to the fallback function with 2300 gas and a specified ether value.`;
                    morehref = `https://solidity.readthedocs.io/en/${version}/security-considerations.html#sending-and-receiving-ether`;
                    break;
            }
            return { warning: text, more: morehref, location: item.node.src };
        });
    }
}
exports.default = lowLevelCalls;
//# sourceMappingURL=lowLevelCalls.js.map