"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const categories_1 = (0, tslib_1.__importDefault)(require("./categories"));
const staticAnalysisCommon_1 = require("./staticAnalysisCommon");
const algorithmCategories_1 = (0, tslib_1.__importDefault)(require("./algorithmCategories"));
class blockTimestamp {
    constructor() {
        this.warningNowNodes = [];
        this.warningblockTimestampNodes = [];
        this.name = 'Block timestamp: ';
        this.description = 'Can be influenced by miners';
        this.category = categories_1.default.SECURITY;
        this.algorithm = algorithmCategories_1.default.EXACT;
        this.version = {
            start: '0.4.12'
        };
    }
    visit(node) {
        if (node.nodeType === 'Identifier' && (0, staticAnalysisCommon_1.isNowAccess)(node))
            this.warningNowNodes.push(node);
        else if (node.nodeType === 'MemberAccess' && (0, staticAnalysisCommon_1.isBlockTimestampAccess)(node))
            this.warningblockTimestampNodes.push(node);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    report(compilationResults) {
        const version = (0, staticAnalysisCommon_1.getCompilerVersion)(compilationResults.contracts);
        return this.warningNowNodes.map((item, i) => {
            return {
                warning: `Use of "now": "now" does not mean current time. "now" is an alias for "block.timestamp". 
                  "block.timestamp" can be influenced by miners to a certain degree, be careful.`,
                location: item.src,
                more: `https://solidity.readthedocs.io/en/${version}/units-and-global-variables.html?highlight=block.timestamp#block-and-transaction-properties`
            };
        }).concat(this.warningblockTimestampNodes.map((item) => {
            return {
                warning: `Use of "block.timestamp": "block.timestamp" can be influenced by miners to a certain degree. 
                  That means that a miner can "choose" the block.timestamp, to a certain degree, to change the outcome of a transaction in the mined block.`,
                location: item.src,
                more: `https://solidity.readthedocs.io/en/${version}/units-and-global-variables.html?highlight=block.timestamp#block-and-transaction-properties`
            };
        }));
    }
}
exports.default = blockTimestamp;
//# sourceMappingURL=blockTimestamp.js.map