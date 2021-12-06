/**
  * return all contract definitions of the given @astList
  *
  * @param {Object} sourcesList - sources list (containing root AST node)
  * @return {Object} - returns a mapping from AST node ids to AST nodes for the contracts
  */
export declare function extractContractDefinitions(sourcesList: any): {
    contractsById: {};
    contractsByName: {};
    sourcesByContract: {};
};
/**
  * return nodes from an ast @arg sourcesList that are declared outside of a ContractDefinition @astList
  *
  * @param {Object} sourcesList - sources list (containing root AST node)
  * @return {Object} - returns a list of node
  */
export declare function extractOrphanDefinitions(sourcesList: any): any[];
/**
  * returns the linearized base contracts of the contract @arg id
  *
  * @param {Int} id - contract id to resolve
  * @param {Map} contracts  - all contracts defined in the current context
  * @return {Array} - array of base contracts in derived to base order as AST nodes.
  */
export declare function getLinearizedBaseContracts(id: any, contractsById: any): any;
/**
  * return state var and type definition of the given contract
  *
  * @param {String} contractName - contract for which state var should be resolved
  * @param {Object} sourcesList - sources list (containing root AST node)
  * @param {Object} [contracts] - map of contract definitions (contains contractsById, contractsByName)
  * @return {Object} - return an object containing: stateItems - list of all the children node of the @arg contractName
  *                                                 stateVariables - list of all the variable declaration of the @arg contractName
  */
export declare function extractStateDefinitions(contractName: any, sourcesList: any, contracts: any): {
    stateDefinitions: any[];
    stateVariables: any[];
};
/**
  * return state var and type definition of all the contracts from the given @args sourcesList
  *
  * @param {Object} sourcesList - sources list (containing root AST node)
  * @param {Object} [contracts] - map of contract definitions (contains contractsById, contractsByName)
  * @return {Object} - returns a mapping between contract name and contract state
  */
export declare function extractStatesDefinitions(sourcesList: any, contracts: any): {};
