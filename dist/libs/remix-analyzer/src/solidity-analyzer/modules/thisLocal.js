"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const categories_1 = (0, tslib_1.__importDefault)(require("./categories"));
const staticAnalysisCommon_1 = require("./staticAnalysisCommon");
const algorithmCategories_1 = (0, tslib_1.__importDefault)(require("./algorithmCategories"));
class thisLocal {
    constructor() {
        this.warningNodes = [];
        this.name = 'This on local calls: ';
        this.description = 'Invocation of local functions via \'this\'';
        this.category = categories_1.default.GAS;
        this.algorithm = algorithmCategories_1.default.EXACT;
        this.version = {
            start: '0.4.12'
        };
    }
    visit(node) {
        if (node.nodeType === 'MemberAccess' && (0, staticAnalysisCommon_1.isThisLocalCall)(node))
            this.warningNodes.push(node);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    report(compilationResults) {
        const version = (0, staticAnalysisCommon_1.getCompilerVersion)(compilationResults.contracts);
        return this.warningNodes.map(function (item, i) {
            return {
                warning: 'Use of "this" for local functions: Never use "this" to call functions in the same contract, it only consumes more gas than normal local calls.',
                location: item.src,
                more: `https://solidity.readthedocs.io/en/${version}/control-structures.html#external-function-calls`
            };
        });
    }
}
exports.default = thisLocal;
//# sourceMappingURL=thisLocal.js.map