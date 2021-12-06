"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const categories_1 = (0, tslib_1.__importDefault)(require("./categories"));
const staticAnalysisCommon_1 = require("./staticAnalysisCommon");
const algorithmCategories_1 = (0, tslib_1.__importDefault)(require("./algorithmCategories"));
const functionCallGraph_1 = require("./functionCallGraph");
const abstractAstView_1 = (0, tslib_1.__importDefault)(require("./abstractAstView"));
class checksEffectsInteraction {
    constructor() {
        this.name = 'Check-effects-interaction: ';
        this.description = 'Potential reentrancy bugs';
        this.category = categories_1.default.SECURITY;
        this.algorithm = algorithmCategories_1.default.HEURISTIC;
        this.version = {
            start: '0.4.12'
        };
        this.abstractAst = new abstractAstView_1.default();
        this.visit = this.abstractAst.build_visit((node) => (node.nodeType === 'FunctionCall' && ((0, staticAnalysisCommon_1.isInteraction)(node) || (0, staticAnalysisCommon_1.isLocalCallGraphRelevantNode)(node))) ||
            ((node.nodeType === 'Assignment' || node.nodeType === 'UnaryOperation' || node.nodeType === 'InlineAssembly') && (0, staticAnalysisCommon_1.isEffect)(node)));
        this.report = this.abstractAst.build_report(this._report.bind(this));
    }
    _report(contracts, multipleContractsWithSameName, version) {
        const warnings = [];
        const hasModifiers = contracts.some((item) => item.modifiers.length > 0);
        const callGraph = (0, functionCallGraph_1.buildGlobalFuncCallGraph)(contracts);
        contracts.forEach((contract) => {
            contract.functions.forEach((func) => {
                func['changesState'] = this.checkIfChangesState((0, staticAnalysisCommon_1.getFullQuallyfiedFuncDefinitionIdent)(contract.node, func.node, func.parameters), this.getContext(callGraph, contract, func));
            });
            contract.functions.forEach((func) => {
                if (this.isPotentialVulnerableFunction(func, this.getContext(callGraph, contract, func))) {
                    const funcName = (0, staticAnalysisCommon_1.getFullQuallyfiedFuncDefinitionIdent)(contract.node, func.node, func.parameters);
                    let comments = (hasModifiers) ? 'Note: Modifiers are currently not considered by this static analysis.' : '';
                    comments += (multipleContractsWithSameName) ? 'Note: Import aliases are currently not supported by this static analysis.' : '';
                    warnings.push({
                        warning: `Potential violation of Checks-Effects-Interaction pattern in ${funcName}: Could potentially lead to re-entrancy vulnerability. ${comments}`,
                        location: func.node.src,
                        more: `https://solidity.readthedocs.io/en/${version}/security-considerations.html#re-entrancy`
                    });
                }
            });
        });
        return warnings;
    }
    getContext(callGraph, currentContract, func) {
        return { callGraph: callGraph, currentContract: currentContract, stateVariables: this.getStateVariables(currentContract, func) };
    }
    getStateVariables(contract, func) {
        return contract.stateVariables.concat(func.localVariables.filter(staticAnalysisCommon_1.isStorageVariableDeclaration));
    }
    isPotentialVulnerableFunction(func, context) {
        let isPotentialVulnerable = false;
        let interaction = false;
        func.relevantNodes.forEach((node) => {
            if ((0, staticAnalysisCommon_1.isInteraction)(node)) {
                interaction = true;
            }
            else if (interaction && ((0, staticAnalysisCommon_1.isWriteOnStateVariable)(node, context.stateVariables) || this.isLocalCallWithStateChange(node, context))) {
                isPotentialVulnerable = true;
            }
        });
        return isPotentialVulnerable;
    }
    isLocalCallWithStateChange(node, context) {
        if ((0, staticAnalysisCommon_1.isLocalCallGraphRelevantNode)(node)) {
            const func = (0, functionCallGraph_1.resolveCallGraphSymbol)(context.callGraph, (0, staticAnalysisCommon_1.getFullQualifiedFunctionCallIdent)(context.currentContract.node, node));
            return !func || (func && func.node['changesState']);
        }
        return false;
    }
    checkIfChangesState(startFuncName, context) {
        return (0, functionCallGraph_1.analyseCallGraph)(context.callGraph, startFuncName, context, (node, context) => (0, staticAnalysisCommon_1.isWriteOnStateVariable)(node, context.stateVariables));
    }
}
exports.default = checksEffectsInteraction;
//# sourceMappingURL=checksEffectsInteraction.js.map