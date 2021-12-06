"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const categories_1 = (0, tslib_1.__importDefault)(require("./categories"));
const algorithmCategories_1 = (0, tslib_1.__importDefault)(require("./algorithmCategories"));
const staticAnalysisCommon_1 = require("./staticAnalysisCommon");
class deleteFromDynamicArray {
    constructor() {
        this.relevantNodes = [];
        this.name = 'Delete from dynamic array: ';
        this.description = '\'delete\' leaves a gap in array';
        this.category = categories_1.default.MISC;
        this.algorithm = algorithmCategories_1.default.EXACT;
        this.version = {
            start: '0.4.12'
        };
    }
    visit(node) {
        if ((0, staticAnalysisCommon_1.isDeleteFromDynamicArray)(node) && !(0, staticAnalysisCommon_1.isMappingIndexAccess)(node.subExpression))
            this.relevantNodes.push(node);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    report(compilationResults) {
        return this.relevantNodes.map((node) => {
            return {
                warning: 'Using "delete" on an array leaves a gap. The length of the array remains the same. If you want to remove the empty position you need to shift items manually and update the "length" property.',
                location: node.src,
                more: 'https://github.com/miguelmota/solidity-idiosyncrasies#examples'
            };
        });
    }
}
exports.default = deleteFromDynamicArray;
//# sourceMappingURL=deleteFromDynamicArray.js.map