"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const categories_1 = (0, tslib_1.__importDefault)(require("./categories"));
const staticAnalysisCommon_1 = require("./staticAnalysisCommon");
const algorithmCategories_1 = (0, tslib_1.__importDefault)(require("./algorithmCategories"));
const abstractAstView_1 = (0, tslib_1.__importDefault)(require("./abstractAstView"));
class selfdestruct {
    constructor() {
        this.name = 'Selfdestruct: ';
        this.description = 'Contracts using destructed contract can be broken';
        this.category = categories_1.default.SECURITY;
        this.algorithm = algorithmCategories_1.default.HEURISTIC;
        this.version = {
            start: '0.4.12'
        };
        this.abstractAst = new abstractAstView_1.default();
        this.visit = this.abstractAst.build_visit((node) => (0, staticAnalysisCommon_1.isStatement)(node) || (node.nodeType === 'FunctionCall' && (0, staticAnalysisCommon_1.isSelfdestructCall)(node)));
        this.report = this.abstractAst.build_report(this._report.bind(this));
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _report(contracts, multipleContractsWithSameName, version) {
        const warnings = [];
        contracts.forEach((contract) => {
            contract.functions.forEach((func) => {
                let hasSelf = false;
                func.relevantNodes.forEach((node) => {
                    if ((0, staticAnalysisCommon_1.isSelfdestructCall)(node)) {
                        warnings.push({
                            warning: 'Use of selfdestruct: Can block calling contracts unexpectedly. Be especially careful if this contract is planned to be used by other contracts (i.e. library contracts, interactions). Selfdestruction of the callee contract can leave callers in an inoperable state.',
                            location: node.src,
                            more: 'https://paritytech.io/blog/security-alert.html'
                        });
                        hasSelf = true;
                    }
                    if ((0, staticAnalysisCommon_1.isStatement)(node) && hasSelf) {
                        warnings.push({
                            warning: 'Use of selfdestruct: No code after selfdestruct is executed. Selfdestruct is a terminal.',
                            location: node.src,
                            more: `https://solidity.readthedocs.io/en/${version}/introduction-to-smart-contracts.html#deactivate-and-self-destruct`
                        });
                        hasSelf = false;
                    }
                });
            });
        });
        return warnings;
    }
}
exports.default = selfdestruct;
//# sourceMappingURL=selfdestruct.js.map