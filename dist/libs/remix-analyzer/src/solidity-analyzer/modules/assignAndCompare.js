"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const categories_1 = (0, tslib_1.__importDefault)(require("./categories"));
const staticAnalysisCommon_1 = require("./staticAnalysisCommon");
const algorithmCategories_1 = (0, tslib_1.__importDefault)(require("./algorithmCategories"));
class assignAndCompare {
    constructor() {
        this.warningNodes = [];
        this.name = 'Result not used: ';
        this.description = 'The result of an operation not used';
        this.category = categories_1.default.MISC;
        this.algorithm = algorithmCategories_1.default.EXACT;
        this.version = {
            start: '0.4.12'
        };
    }
    visit(node) {
        if ((node === null || node === void 0 ? void 0 : node.nodeType) && (0, staticAnalysisCommon_1.isSubScopeWithTopLevelUnAssignedBinOp)(node))
            (0, staticAnalysisCommon_1.getUnAssignedTopLevelBinOps)(node).forEach((n) => this.warningNodes.push(n));
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    report(compilationResults) {
        return this.warningNodes.map((item) => {
            return {
                warning: 'A binary operation yields a value that is not used further. This is often caused by confusing assignment (=) and comparison (==).',
                location: item.src
            };
        });
    }
}
exports.default = assignAndCompare;
//# sourceMappingURL=assignAndCompare.js.map