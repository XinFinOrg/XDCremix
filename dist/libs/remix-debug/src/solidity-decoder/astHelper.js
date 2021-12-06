'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractStatesDefinitions = exports.extractStateDefinitions = exports.getLinearizedBaseContracts = exports.extractOrphanDefinitions = exports.extractContractDefinitions = void 0;
const remix_astwalker_1 = require("@remix-project/remix-astwalker");
/**
  * return all contract definitions of the given @astList
  *
  * @param {Object} sourcesList - sources list (containing root AST node)
  * @return {Object} - returns a mapping from AST node ids to AST nodes for the contracts
  */
function extractContractDefinitions(sourcesList) {
    const ret = {
        contractsById: {},
        contractsByName: {},
        sourcesByContract: {}
    };
    const walker = new remix_astwalker_1.AstWalker();
    for (const k in sourcesList) {
        walker.walkFull(sourcesList[k].ast, (node) => {
            if (node.nodeType === 'ContractDefinition') {
                ret.contractsById[node.id] = node;
                ret.sourcesByContract[node.id] = k;
                ret.contractsByName[k + ':' + node.name] = node;
            }
        });
    }
    return ret;
}
exports.extractContractDefinitions = extractContractDefinitions;
/**
  * return nodes from an ast @arg sourcesList that are declared outside of a ContractDefinition @astList
  *
  * @param {Object} sourcesList - sources list (containing root AST node)
  * @return {Object} - returns a list of node
  */
function extractOrphanDefinitions(sourcesList) {
    const ret = [];
    for (const k in sourcesList) {
        const ast = sourcesList[k].ast;
        if (ast.nodes && ast.nodes.length) {
            for (const node of ast.nodes) {
                if (node.nodeType !== 'ContractDefinition') {
                    ret.push(node);
                }
            }
        }
    }
    return ret;
}
exports.extractOrphanDefinitions = extractOrphanDefinitions;
/**
  * returns the linearized base contracts of the contract @arg id
  *
  * @param {Int} id - contract id to resolve
  * @param {Map} contracts  - all contracts defined in the current context
  * @return {Array} - array of base contracts in derived to base order as AST nodes.
  */
function getLinearizedBaseContracts(id, contractsById) {
    return contractsById[id].linearizedBaseContracts.map(function (id) { return contractsById[id]; });
}
exports.getLinearizedBaseContracts = getLinearizedBaseContracts;
/**
  * return state var and type definition of the given contract
  *
  * @param {String} contractName - contract for which state var should be resolved
  * @param {Object} sourcesList - sources list (containing root AST node)
  * @param {Object} [contracts] - map of contract definitions (contains contractsById, contractsByName)
  * @return {Object} - return an object containing: stateItems - list of all the children node of the @arg contractName
  *                                                 stateVariables - list of all the variable declaration of the @arg contractName
  */
function extractStateDefinitions(contractName, sourcesList, contracts) {
    if (!contracts) {
        contracts = extractContractDefinitions(sourcesList);
    }
    const node = contracts.contractsByName[contractName];
    if (!node) {
        return null;
    }
    const stateItems = extractOrphanDefinitions(sourcesList);
    const stateVar = [];
    const baseContracts = getLinearizedBaseContracts(node.id, contracts.contractsById);
    baseContracts.reverse();
    for (const k in baseContracts) {
        const ctr = baseContracts[k];
        for (const i in ctr.nodes) {
            const item = ctr.nodes[i];
            stateItems.push(item);
            if (item.nodeType === 'VariableDeclaration') {
                stateVar.push(item);
            }
        }
    }
    return { stateDefinitions: stateItems, stateVariables: stateVar };
}
exports.extractStateDefinitions = extractStateDefinitions;
/**
  * return state var and type definition of all the contracts from the given @args sourcesList
  *
  * @param {Object} sourcesList - sources list (containing root AST node)
  * @param {Object} [contracts] - map of contract definitions (contains contractsById, contractsByName)
  * @return {Object} - returns a mapping between contract name and contract state
  */
function extractStatesDefinitions(sourcesList, contracts) {
    if (!contracts) {
        contracts = extractContractDefinitions(sourcesList);
    }
    const ret = {};
    for (const contract in contracts.contractsById) {
        const name = contracts.contractsById[contract].name;
        const source = contracts.sourcesByContract[contract];
        const fullName = source + ':' + name;
        const state = extractStateDefinitions(fullName, sourcesList, contracts);
        ret[fullName] = state;
        ret[name] = state; // solc < 0.4.9
    }
    return ret;
}
exports.extractStatesDefinitions = extractStatesDefinitions;
//# sourceMappingURL=astHelper.js.map