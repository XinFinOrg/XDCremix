"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const staticAnalysisCommon_1 = require("./staticAnalysisCommon");
const remix_astwalker_1 = require("@remix-project/remix-astwalker");
class abstractAstView {
    constructor() {
        this.contracts = [];
        this.currentContractIndex = -1;
        this.currentFunctionIndex = -1;
        this.currentModifierIndex = -1;
        this.isFunctionNotModifier = false;
        /*
          file1: contract c{}
          file2: import "file1" as x; contract c{}
          therefore we have two contracts with the same name c. At the moment this is not handled because alias name "x" is not
          available in the current AST implementation thus can not be resolved.
          Additionally the fullQuallified function names e.g. [contractName].[functionName](param1Type, param2Type, ... ) must be prefixed to
          fully support this and when inheritance is resolved it must include alias resolving e.g x.c = file1.c
        */
        this.multipleContractsWithSameName = false;
    }
    /**
   * Builds a higher level AST view. I creates a list with each contract as an object in it.
   * Example contractsOut:
   *
   * {
   *  "node": {},                     // actual AST Node of the contract
   *  "functions": [
   *    {
   *      "node": {},                // actual AST Node of the function
   *      "relevantNodes": [],       // AST nodes in the function that are relevant for the anlysis of this function
   *      "modifierInvocations": [], // Modifier invocation AST nodes that are applied on this function
   *      "localVariables": [],      // Local variable declaration nodes
   *      "parameters": []           // Parameter types of the function in order of definition
   *      "returns": []              // list of return vars as { type: ... , name: ... }
   *    }
   *  ],
   *  "modifiers": [],              // Modifiers definded by the contract, format similar to functions
   *  "inheritsFrom": [],           // Names of contract this one inherits from in order of definition
   *  "stateVariables": []          // AST nodes of all State variables
   * }
   *
   * @relevantNodeFilter {ASTNode -> bool} function that selects relevant ast nodes for analysis on function level.
   * @contractsOut {list} return list for high level AST view
   * @return {ASTNode -> void} returns a function that can be used as visit function for static analysis modules, to build up a higher level AST view for further analysis.
   */
    // eslint-disable-next-line camelcase
    build_visit(relevantNodeFilter) {
        return (node) => {
            if (node.nodeType === 'ContractDefinition') {
                this.setCurrentContract({
                    node: node,
                    functions: [],
                    relevantNodes: [],
                    modifiers: [],
                    inheritsFrom: [],
                    stateVariables: (0, staticAnalysisCommon_1.getStateVariableDeclarationsFromContractNode)(node)
                });
            }
            else if (node.nodeType === 'InheritanceSpecifier') {
                const currentContract = this.getCurrentContract();
                const inheritsFromName = (0, staticAnalysisCommon_1.getInheritsFromName)(node);
                currentContract.inheritsFrom.push(inheritsFromName);
            }
            else if (node.nodeType === 'FunctionDefinition') {
                this.setCurrentFunction({
                    node: node,
                    relevantNodes: [],
                    modifierInvocations: [],
                    localVariables: this.getLocalVariables(node),
                    parameters: this.getLocalParameters(node),
                    returns: this.getReturnParameters(node)
                });
                // push back relevant nodes to their the current fn if any
                this.getCurrentContract().relevantNodes.map((item) => {
                    if (item.referencedDeclaration === node.id) {
                        this.getCurrentFunction().relevantNodes.push(item.node);
                    }
                });
            }
            else if (node.nodeType === 'ModifierDefinition') {
                this.setCurrentModifier({
                    node: node,
                    relevantNodes: [],
                    localVariables: this.getLocalVariables(node),
                    parameters: this.getLocalParameters(node)
                });
            }
            else if (node.nodeType === 'ModifierInvocation') {
                if (!this.isFunctionNotModifier)
                    throw new Error('abstractAstView.js: Found modifier invocation outside of function scope.');
                this.getCurrentFunction().modifierInvocations.push(node);
            }
            else if (relevantNodeFilter(node)) {
                let scope = (this.isFunctionNotModifier) ? this.getCurrentFunction() : this.getCurrentModifier();
                if (scope) {
                    scope.relevantNodes.push(node);
                }
                else {
                    scope = this.getCurrentContract(); // if we are not in a function scope, add the node to the contract scope
                    if (scope && node.referencedDeclaration) {
                        scope.relevantNodes.push({ referencedDeclaration: node.referencedDeclaration, node: node });
                    }
                }
            }
        };
    }
    // eslint-disable-next-line camelcase
    build_report(wrap) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return (compilationResult) => {
            const solVersion = (0, staticAnalysisCommon_1.getCompilerVersion)(compilationResult.contracts);
            this.resolveStateVariablesInHierarchy(this.contracts);
            return wrap(this.contracts, this.multipleContractsWithSameName, solVersion);
        };
    }
    resolveStateVariablesInHierarchy(contracts) {
        contracts.map((c) => {
            this.resolveStateVariablesInHierarchyForContract(c, contracts);
        });
    }
    resolveStateVariablesInHierarchyForContract(currentContract, contracts) {
        currentContract.inheritsFrom.map((inheritsFromName) => {
            // add variables from inherited contracts
            const inheritsFrom = contracts.find((contract) => (0, staticAnalysisCommon_1.getContractName)(contract.node) === inheritsFromName);
            if (inheritsFrom) {
                currentContract.stateVariables = currentContract.stateVariables.concat(inheritsFrom.stateVariables);
            }
            else {
                console.log('abstractAstView.js: could not find contract defintion inherited from ' + inheritsFromName);
            }
        });
    }
    setCurrentContract(contract) {
        const name = (0, staticAnalysisCommon_1.getContractName)(contract.node);
        if (this.contracts.map((c) => (0, staticAnalysisCommon_1.getContractName)(c.node)).filter((n) => n === name).length > 0) {
            console.log('abstractAstView.js: two or more contracts with the same name dectected, import aliases not supported at the moment');
            this.multipleContractsWithSameName = true;
        }
        this.currentContractIndex = (this.contracts.push(contract) - 1);
    }
    setCurrentFunction(func) {
        this.isFunctionNotModifier = true;
        this.currentFunctionIndex = (this.getCurrentContract().functions.push(func) - 1);
    }
    setCurrentModifier(modi) {
        this.isFunctionNotModifier = false;
        this.currentModifierIndex = (this.getCurrentContract().modifiers.push(modi) - 1);
    }
    getCurrentContract() {
        return this.contracts[this.currentContractIndex];
    }
    getCurrentFunction() {
        return this.getCurrentContract().functions[this.currentFunctionIndex];
    }
    getCurrentModifier() {
        return this.getCurrentContract().modifiers[this.currentModifierIndex];
    }
    getLocalParameters(funcNode) {
        return (0, staticAnalysisCommon_1.getFunctionOrModifierDefinitionParameterPart)(funcNode).parameters.map(staticAnalysisCommon_1.getType);
    }
    getReturnParameters(funcNode) {
        return this.getLocalVariables((0, staticAnalysisCommon_1.getFunctionDefinitionReturnParameterPart)(funcNode)).map((n) => {
            return {
                type: (0, staticAnalysisCommon_1.getType)(n),
                name: (0, staticAnalysisCommon_1.getDeclaredVariableName)(n)
            };
        });
    }
    getLocalVariables(funcNode) {
        const locals = [];
        new remix_astwalker_1.AstWalker().walkFull(funcNode, (node) => {
            if (node.nodeType === 'VariableDeclaration')
                locals.push(node);
            return true;
        });
        return locals;
    }
}
exports.default = abstractAstView;
//# sourceMappingURL=abstractAstView.js.map