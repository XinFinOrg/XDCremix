"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const categories_1 = (0, tslib_1.__importDefault)(require("./categories"));
const algorithmCategories_1 = (0, tslib_1.__importDefault)(require("./algorithmCategories"));
const staticAnalysisCommon_1 = require("./staticAnalysisCommon");
class forLoopIteratesOverDynamicArray {
    constructor() {
        this.relevantNodes = [];
        this.name = 'For loop over dynamic array: ';
        this.description = 'Iterations depend on dynamic array\'s size';
        this.category = categories_1.default.GAS;
        this.algorithm = algorithmCategories_1.default.EXACT;
        this.version = {
            start: '0.4.12'
        };
    }
    visit(node) {
        const { condition } = node;
        // Check if condition is `i < array.length - 1`
        if ((condition && condition.nodeType === 'BinaryOperation' && condition.rightExpression.nodeType === 'BinaryOperation' && (0, staticAnalysisCommon_1.isDynamicArrayLengthAccess)(condition.rightExpression.leftExpression)) ||
            // or condition is `i < array.length`
            (condition && condition.nodeType === 'BinaryOperation' && (0, staticAnalysisCommon_1.isDynamicArrayLengthAccess)(condition.rightExpression))) {
            this.relevantNodes.push(node);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    report(compilationResults) {
        const version = (0, staticAnalysisCommon_1.getCompilerVersion)(compilationResults.contracts);
        return this.relevantNodes.map((node) => {
            return {
                warning: 'Loops that do not have a fixed number of iterations, for example, loops that depend on storage values, have to be used carefully. Due to the block gas limit, transactions can only consume a certain amount of gas. The number of iterations in a loop can grow beyond the block gas limit which can cause the complete contract to be stalled at a certain point. \n Additionally, using unbounded loops incurs in a lot of avoidable gas costs. Carefully test how many items at maximum you can pass to such functions to make it successful.',
                location: node.src,
                more: `https://solidity.readthedocs.io/en/${version}/security-considerations.html#gas-limit-and-loops`
            };
        });
    }
}
exports.default = forLoopIteratesOverDynamicArray;
//# sourceMappingURL=forLoopIteratesOverDynamicArray.js.map