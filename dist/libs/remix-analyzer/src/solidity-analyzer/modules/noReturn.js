"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const categories_1 = (0, tslib_1.__importDefault)(require("./categories"));
const staticAnalysisCommon_1 = require("./staticAnalysisCommon");
const algorithmCategories_1 = (0, tslib_1.__importDefault)(require("./algorithmCategories"));
const abstractAstView_1 = (0, tslib_1.__importDefault)(require("./abstractAstView"));
class noReturn {
    constructor() {
        this.name = 'No return: ';
        this.description = 'Function with \'returns\' not returning';
        this.category = categories_1.default.MISC;
        this.algorithm = algorithmCategories_1.default.EXACT;
        this.version = {
            start: '0.4.12'
        };
        this.abstractAst = new abstractAstView_1.default();
        this.visit = this.abstractAst.build_visit((node) => node.nodeType === 'Return' || node.nodeType === 'Assignment');
        this.report = this.abstractAst.build_report(this._report.bind(this));
    }
    _report(contracts, multipleContractsWithSameName, version) {
        const warnings = [];
        contracts.forEach((contract) => {
            contract.functions.filter((func) => (0, staticAnalysisCommon_1.hasFunctionBody)(func.node)).forEach((func) => {
                const funcName = (0, staticAnalysisCommon_1.getFullQuallyfiedFuncDefinitionIdent)(contract.node, func.node, func.parameters);
                if (this.hasNamedAndUnnamedReturns(func)) {
                    warnings.push({
                        warning: `${funcName}: Mixing of named and unnamed return parameters is not advised.`,
                        location: func.node.src
                    });
                }
                else if (this.shouldReturn(func) && !(this.hasReturnStatement(func) || (this.hasNamedReturns(func) && this.hasAssignToAllNamedReturns(func)))) {
                    warnings.push({
                        warning: `${funcName}: Defines a return type but never explicitly returns a value.`,
                        location: func.node.src
                    });
                }
            });
        });
        return warnings;
    }
    shouldReturn(func) {
        return func.returns.length > 0;
    }
    hasReturnStatement(func) {
        return func.relevantNodes.filter(n => n.nodeType === 'Return').length > 0;
    }
    hasAssignToAllNamedReturns(func) {
        const namedReturns = func.returns.filter(n => n.name.length > 0).map((n) => n.name);
        const assignedVars = func.relevantNodes.filter(n => n.nodeType === 'Assignment').map(staticAnalysisCommon_1.getEffectedVariableName);
        const diff = namedReturns.filter(e => !assignedVars.includes(e));
        return diff.length === 0;
    }
    hasNamedReturns(func) {
        return func.returns.filter((n) => n.name.length > 0).length > 0;
    }
    hasNamedAndUnnamedReturns(func) {
        return func.returns.filter((n) => n.name.length === 0).length > 0 && this.hasNamedReturns(func);
    }
}
exports.default = noReturn;
//# sourceMappingURL=noReturn.js.map