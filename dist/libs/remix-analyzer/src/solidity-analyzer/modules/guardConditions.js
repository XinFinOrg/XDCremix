"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const categories_1 = (0, tslib_1.__importDefault)(require("./categories"));
const staticAnalysisCommon_1 = require("./staticAnalysisCommon");
const algorithmCategories_1 = (0, tslib_1.__importDefault)(require("./algorithmCategories"));
class guardConditions {
    constructor() {
        this.guards = [];
        this.name = 'Guard conditions: ';
        this.description = 'Ensure appropriate use of require/assert';
        this.category = categories_1.default.MISC;
        this.algorithm = algorithmCategories_1.default.EXACT;
        this.version = {
            start: '0.4.12'
        };
    }
    visit(node) {
        if ((0, staticAnalysisCommon_1.isRequireCall)(node) || (0, staticAnalysisCommon_1.isAssertCall)(node))
            this.guards.push(node);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    report(compilationResults) {
        const version = (0, staticAnalysisCommon_1.getCompilerVersion)(compilationResults.contracts);
        return this.guards.map((node) => {
            return {
                warning: 'Use "assert(x)" if you never ever want x to be false, not in any circumstance (apart from a bug in your code). Use "require(x)" if x can be false, due to e.g. invalid input or a failing external component.',
                location: node.src,
                more: `https://solidity.readthedocs.io/en/${version}/control-structures.html#error-handling-assert-require-revert-and-exceptions`
            };
        });
    }
}
exports.default = guardConditions;
//# sourceMappingURL=guardConditions.js.map