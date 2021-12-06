'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolidityProxy = void 0;
const tslib_1 = require("tslib");
const remix_lib_1 = require("@remix-project/remix-lib");
const traceHelper_1 = require("../trace/traceHelper");
const stateDecoder_1 = require("./stateDecoder");
const astHelper_1 = require("./astHelper");
class SolidityProxy {
    constructor({ getCurrentCalledAddressAt, getCode }) {
        this.cache = new Cache();
        this.reset({});
        this.getCurrentCalledAddressAt = getCurrentCalledAddressAt;
        this.getCode = getCode;
    }
    /**
      * reset the cache and apply a new @arg compilationResult
      *
      * @param {Object} compilationResult  - result os a compilatiion (diectly returned by the compiler)
      */
    reset(compilationResult) {
        this.sources = compilationResult.sources;
        this.contracts = compilationResult.contracts;
        this.cache.reset();
    }
    /**
      * check if the object has been properly loaded
      *
      * @return {Bool} - returns true if a compilation result has been applied
      */
    loaded() {
        return this.contracts !== undefined;
    }
    /**
      * retrieve the compiled contract name at the @arg vmTraceIndex (cached)
      *
      * @param {Int} vmTraceIndex  - index in the vm trave where to resolve the executed contract name
      * @param {Function} cb  - callback returns (error, contractName)
      */
    contractObjectAt(vmTraceIndex) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const address = this.getCurrentCalledAddressAt(vmTraceIndex);
            if (this.cache.contractObjectByAddress[address]) {
                return this.cache.contractObjectByAddress[address];
            }
            const code = yield this.getCode(address);
            const contract = contractObjectFromCode(this.contracts, code.bytecode, address);
            this.cache.contractObjectByAddress[address] = contract;
            return contract;
        });
    }
    /**
      * extract the state variables of the given compiled @arg contractName (cached)
      *
      * @param {String} contractName  - name of the contract to retrieve state variables from
      * @return {Object} - returns state variables of @args contractName
      */
    extractStatesDefinitions() {
        if (!this.cache.contractDeclarations) {
            this.cache.contractDeclarations = (0, astHelper_1.extractContractDefinitions)(this.sources);
        }
        if (!this.cache.statesDefinitions) {
            this.cache.statesDefinitions = (0, astHelper_1.extractStatesDefinitions)(this.sources, this.cache.contractDeclarations);
        }
        return this.cache.statesDefinitions;
    }
    /**
      * extract the state variables of the given compiled @arg contractName (cached)
      *
      * @param {String} contractName  - name of the contract to retrieve state variables from
      * @return {Object} - returns state variables of @args contractName
      */
    extractStateVariables(contractName) {
        if (!this.cache.stateVariablesByContractName[contractName]) {
            this.cache.stateVariablesByContractName[contractName] = (0, stateDecoder_1.extractStateVariables)(contractName, this.sources);
        }
        return this.cache.stateVariablesByContractName[contractName];
    }
    /**
      * extract the state variables of the given compiled @arg vmtraceIndex (cached)
      *
      * @param {Int} vmTraceIndex  - index in the vm trave where to resolve the state variables
      * @return {Object} - returns state variables of @args vmTraceIndex
      */
    extractStateVariablesAt(vmtraceIndex) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const contract = yield this.contractObjectAt(vmtraceIndex);
            return this.extractStateVariables(contract.name);
        });
    }
    /**
      * get the AST of the file declare in the @arg sourceLocation
      *
      * @param {Object} sourceLocation  - source location containing the 'file' to retrieve the AST from
      * @return {Object} - AST of the current file
      */
    ast(sourceLocation, generatedSources) {
        const file = this.fileNameFromIndex(sourceLocation.file);
        if (!file && generatedSources && generatedSources.length) {
            for (const source of generatedSources) {
                if (source.id === sourceLocation.file)
                    return source.ast;
            }
        }
        else if (this.sources[file]) {
            return this.sources[file].ast;
        }
        return null;
    }
    /**
     * get the filename refering to the index from the compilation result
     *
     * @param {Int} index  - index of the filename
     * @return {String} - filename
     */
    fileNameFromIndex(index) {
        return Object.keys(this.contracts)[index];
    }
}
exports.SolidityProxy = SolidityProxy;
function contractObjectFromCode(contracts, code, address) {
    const isCreation = (0, traceHelper_1.isContractCreation)(address);
    for (const file in contracts) {
        for (const contract in contracts[file]) {
            const bytecode = isCreation ? contracts[file][contract].evm.bytecode.object : contracts[file][contract].evm.deployedBytecode.object;
            if (remix_lib_1.util.compareByteCode(code, '0x' + bytecode)) {
                return { name: contract, contract: contracts[file][contract] };
            }
        }
    }
    return null;
}
class Cache {
    constructor() {
        this.reset();
    }
    reset() {
        this.contractObjectByAddress = {};
        this.stateVariablesByContractName = {};
        this.contractDeclarations = null;
        this.statesDefinitions = null;
    }
}
//# sourceMappingURL=solidityProxy.js.map