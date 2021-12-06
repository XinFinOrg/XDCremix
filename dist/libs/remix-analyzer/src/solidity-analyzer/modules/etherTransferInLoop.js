"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const categories_1 = (0, tslib_1.__importDefault)(require("./categories"));
const algorithmCategories_1 = (0, tslib_1.__importDefault)(require("./algorithmCategories"));
const staticAnalysisCommon_1 = require("./staticAnalysisCommon");
class etherTransferInLoop {
    constructor() {
        this.relevantNodes = [];
        this.name = 'Ether transfer in loop: ';
        this.description = 'Transferring Ether in a for/while/do-while loop';
        this.category = categories_1.default.GAS;
        this.algorithm = algorithmCategories_1.default.EXACT;
        this.version = {
            start: '0.4.12'
        };
    }
    visit(node) {
        let transferNodes = [];
        if ((0, staticAnalysisCommon_1.isLoop)(node)) {
            if (node.body && node.body.nodeType === 'Block') {
                transferNodes = node.body.statements.filter(child => (child.nodeType === 'ExpressionStatement' &&
                    child.expression.nodeType === 'FunctionCall' &&
                    (0, staticAnalysisCommon_1.isTransfer)(child.expression.expression)));
            }
            else if (node.body && node.body.nodeType === 'ExpressionStatement' && node.body.expression.nodeType === 'FunctionCall' && (0, staticAnalysisCommon_1.isTransfer)(node.body.expression.expression)) {
                transferNodes.push(node.body);
            }
            // When loop body is described without braces
            if (transferNodes.length > 0) {
                this.relevantNodes.push(...transferNodes);
            }
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    report(compilationResults) {
        const version = (0, staticAnalysisCommon_1.getCompilerVersion)(compilationResults.contracts);
        return this.relevantNodes.map((node) => {
            return {
                warning: 'Ether payout should not be done in a loop: Due to the block gas limit, transactions can only consume a certain amount of gas. The number of iterations in a loop can grow beyond the block gas limit which can cause the complete contract to be stalled at a certain point. If required then make sure that number of iterations are low and you trust each address involved.',
                location: node.src,
                more: `https://solidity.readthedocs.io/en/${version}/security-considerations.html#gas-limit-and-loops`
            };
        });
    }
}
exports.default = etherTransferInLoop;
//# sourceMappingURL=etherTransferInLoop.js.map