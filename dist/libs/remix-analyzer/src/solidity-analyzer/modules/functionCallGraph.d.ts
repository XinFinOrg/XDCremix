import { ContractHLAst, FunctionCallGraph, ContractCallGraph, Context } from '../../types';
/**
 * Builds a function call graph for the current contracts.
 * Example Contract call graph:
 *
 * {
 *  "KingOfTheEtherThrone": {
 *    "contracts": {...},                                        // Contract node as defined in abstractAstView.js
 *    "functions": {
 *      "KingOfTheEtherThrone.claimThrone(string memory)": {    // function in KingOfEtherThrone
 *        "node": {...},                                        // function node as defined in abstractAstView.js
 *        "calls": {                                            // list of full qualified function names which are called form this function
 *        }
 *      }
 *    }
 *  },
 *  "foo": {
 *    "contract": {...},           // Contract node as definded in abstractAstView.js
 *    "functions": {}             // map from full qualified function name to func node
 *  }
 * }
 *
 * @contracts {list contracts} Expects as input the contract structure defined in abstractAstView.js
 * @return {map (string -> Contract Call Graph)} returns map from contract name to contract call graph
 */
export declare function buildGlobalFuncCallGraph(contracts: ContractHLAst[]): Record<string, ContractCallGraph>;
/**
 * Walks through the call graph from a defined starting function, true if nodeCheck holds for every relevant node in the callgraph
 * @callGraph {callGraph} As returned by buildGlobalFuncCallGraph
 * @funcName {string} full qualified name of the starting function
 * @context {Object} provides additional context information that can be used by the nodeCheck function
 * @nodeCheck {(ASTNode, context) -> bool} applied on every relevant node in the call graph
 * @return {bool} returns map from contract name to contract call graph
 */
export declare function analyseCallGraph(callGraph: Record<string, ContractCallGraph>, funcName: string, context: Context, nodeCheck: ((node: any, context: Context) => boolean)): boolean;
export declare function resolveCallGraphSymbol(callGraph: Record<string, ContractCallGraph>, funcName: string): FunctionCallGraph | undefined;
