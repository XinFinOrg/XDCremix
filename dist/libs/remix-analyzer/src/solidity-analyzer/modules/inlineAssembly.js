"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const categories_1 = (0, tslib_1.__importDefault)(require("./categories"));
const algorithmCategories_1 = (0, tslib_1.__importDefault)(require("./algorithmCategories"));
const staticAnalysisCommon_1 = require("./staticAnalysisCommon");
class inlineAssembly {
    constructor() {
        this.inlineAssNodes = [];
        this.name = 'Inline assembly: ';
        this.description = 'Inline assembly used';
        this.category = categories_1.default.SECURITY;
        this.algorithm = algorithmCategories_1.default.EXACT;
        this.version = {
            start: '0.4.12'
        };
    }
    visit(node) {
        if (node.nodeType === 'InlineAssembly')
            this.inlineAssNodes.push(node);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    report(compilationResults) {
        const version = (0, staticAnalysisCommon_1.getCompilerVersion)(compilationResults.contracts);
        return this.inlineAssNodes.map((node) => {
            return {
                warning: `The Contract uses inline assembly, this is only advised in rare cases. 
                  Additionally static analysis modules do not parse inline Assembly, this can lead to wrong analysis results.`,
                location: node.src,
                more: `https://solidity.readthedocs.io/en/${version}/assembly.html`
            };
        });
    }
}
exports.default = inlineAssembly;
//# sourceMappingURL=inlineAssembly.js.map