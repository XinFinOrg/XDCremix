"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const categories_1 = (0, tslib_1.__importDefault)(require("./categories"));
const staticAnalysisCommon_1 = require("./staticAnalysisCommon");
const algorithmCategories_1 = (0, tslib_1.__importDefault)(require("./algorithmCategories"));
class blockBlockhash {
    constructor() {
        this.warningNodes = [];
        this.name = 'Block hash: ';
        this.description = 'Can be influenced by miners';
        this.category = categories_1.default.SECURITY;
        this.algorithm = algorithmCategories_1.default.EXACT;
        this.version = {
            start: '0.4.12'
        };
    }
    visit(node) {
        if (node.nodeType === 'FunctionCall' && (0, staticAnalysisCommon_1.isBlockBlockHashAccess)(node))
            this.warningNodes.push(node);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    report(compilationResults) {
        return this.warningNodes.map((item) => {
            return {
                warning: `Use of "blockhash": "blockhash(uint blockNumber)" is used to access the last 256 block hashes. 
                  A miner computes the block hash by "summing up" the information in the current block mined. 
                  By "summing up" the information cleverly, a miner can try to influence the outcome of a transaction in the current block. 
                  This is especially easy if there are only a small number of equally likely outcomes.`,
                location: item.src
            };
        });
    }
}
exports.default = blockBlockhash;
//# sourceMappingURL=blockBlockhash.js.map