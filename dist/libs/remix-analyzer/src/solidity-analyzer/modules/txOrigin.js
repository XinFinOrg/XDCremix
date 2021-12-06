"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const categories_1 = (0, tslib_1.__importDefault)(require("./categories"));
const algorithmCategories_1 = (0, tslib_1.__importDefault)(require("./algorithmCategories"));
const staticAnalysisCommon_1 = require("./staticAnalysisCommon");
class txOrigin {
    constructor() {
        this.txOriginNodes = [];
        this.name = 'Transaction origin: ';
        this.description = '\'tx.origin\' used';
        this.category = categories_1.default.SECURITY;
        this.algorithm = algorithmCategories_1.default.EXACT;
        this.version = {
            start: '0.4.12'
        };
    }
    visit(node) {
        if ((0, staticAnalysisCommon_1.isTxOriginAccess)(node))
            this.txOriginNodes.push(node);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    report(compilationResults) {
        const version = (0, staticAnalysisCommon_1.getCompilerVersion)(compilationResults.contracts);
        return this.txOriginNodes.map((item, i) => {
            return {
                warning: `Use of tx.origin: "tx.origin" is useful only in very exceptional cases. 
                  If you use it for authentication, you usually want to replace it by "msg.sender", because otherwise any contract you call can act on your behalf.`,
                location: item.src,
                more: `https://solidity.readthedocs.io/en/${version}/security-considerations.html#tx-origin`
            };
        });
    }
}
exports.default = txOrigin;
//# sourceMappingURL=txOrigin.js.map