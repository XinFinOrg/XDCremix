"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.solidityState = exports.extractStateVariables = exports.decodeState = void 0;
const tslib_1 = require("tslib");
const astHelper_1 = require("./astHelper");
const decodeInfo_1 = require("./decodeInfo");
/**
  * decode the contract state storage
  *
  * @param {Array} storage location  - location of all state variables
  * @param {Object} storageResolver  - resolve storage queries
  * @return {Map} - decoded state variable
  */
function decodeState(stateVars, storageResolver) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const ret = {};
        for (var k in stateVars) {
            var stateVar = stateVars[k];
            try {
                const decoded = yield stateVar.type.decodeFromStorage(stateVar.storagelocation, storageResolver);
                decoded.constant = stateVar.constant;
                decoded.immutable = stateVar.immutable;
                if (decoded.constant) {
                    decoded.value = '<constant>';
                }
                if (decoded.immutable) {
                    decoded.value = '<immutable>';
                }
                ret[stateVar.name] = decoded;
            }
            catch (e) {
                console.log(e);
                ret[stateVar.name] = { error: '<decoding failed - ' + e.message + '>' };
            }
        }
        return ret;
    });
}
exports.decodeState = decodeState;
/**
  * return all storage location variables of the given @arg contractName
  *
  * @param {String} contractName  - name of the contract
  * @param {Object} sourcesList  - sources list
  * @return {Object} - return the location of all contract variables in the storage
  */
function extractStateVariables(contractName, sourcesList) {
    const states = (0, astHelper_1.extractStatesDefinitions)(sourcesList, null);
    if (!states[contractName]) {
        return [];
    }
    const types = states[contractName].stateVariables;
    const offsets = (0, decodeInfo_1.computeOffsets)(types, states, contractName, 'storage');
    if (!offsets) {
        return []; // TODO should maybe return an error
    }
    return offsets.typesOffsets;
}
exports.extractStateVariables = extractStateVariables;
/**
  * return the state of the given @a contractName as a json object
  *
  * @param {Object} storageResolver  - resolve storage queries
  * @param {astList} astList  - AST nodes of all the sources
  * @param {String} contractName  - contract for which state var should be resolved
  * @return {Map} - return the state of the contract
  */
function solidityState(storageResolver, astList, contractName) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const stateVars = extractStateVariables(contractName, astList);
        try {
            return yield decodeState(stateVars, storageResolver);
        }
        catch (e) {
            return { error: '<decoding failed - ' + e.message + '>' };
        }
    });
}
exports.solidityState = solidityState;
//# sourceMappingURL=stateDecoder.js.map