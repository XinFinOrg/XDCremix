import { ContractHLAst, ReportObj, ReportFunction, VisitFunction } from '../../types';
declare type WrapFunction = ((contracts: ContractHLAst[], isSameName: boolean, version: string) => ReportObj[]);
export default class abstractAstView {
    contracts: ContractHLAst[];
    currentContractIndex: number;
    currentFunctionIndex: number;
    currentModifierIndex: number;
    isFunctionNotModifier: boolean;
    multipleContractsWithSameName: boolean;
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
    build_visit(relevantNodeFilter: ((node: any) => boolean)): VisitFunction;
    build_report(wrap: WrapFunction): ReportFunction;
    private resolveStateVariablesInHierarchy;
    private resolveStateVariablesInHierarchyForContract;
    private setCurrentContract;
    private setCurrentFunction;
    private setCurrentModifier;
    private getCurrentContract;
    private getCurrentFunction;
    private getCurrentModifier;
    private getLocalParameters;
    private getReturnParameters;
    private getLocalVariables;
}
export {};
