"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const categories_1 = (0, tslib_1.__importDefault)(require("./categories"));
const staticAnalysisCommon_1 = require("./staticAnalysisCommon");
const algorithmCategories_1 = (0, tslib_1.__importDefault)(require("./algorithmCategories"));
class deleteDynamicArrays {
    constructor() {
        this.rel = [];
        this.name = 'Delete dynamic array: ';
        this.description = 'Use require/assert to ensure complete deletion';
        this.category = categories_1.default.GAS;
        this.algorithm = algorithmCategories_1.default.EXACT;
        this.version = {
            start: '0.4.12'
        };
    }
    visit(node) {
        if ((0, staticAnalysisCommon_1.isDeleteOfDynamicArray)(node))
            this.rel.push(node);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    report(compilationResults) {
        const version = (0, staticAnalysisCommon_1.getCompilerVersion)(compilationResults.contracts);
        return this.rel.map((node) => {
            return {
                warning: 'The "delete" operation when applied to a dynamically sized array in Solidity generates code to delete each of the elements contained. If the array is large, this operation can surpass the block gas limit and raise an OOG exception. Also nested dynamically sized objects can produce the same results.',
                location: node.src,
                more: `https://solidity.readthedocs.io/en/${version}/types.html#delete`
            };
        });
    }
}
exports.default = deleteDynamicArrays;
//# sourceMappingURL=deleteDynamicArrays.js.map