'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceLocationTracker = void 0;
const tslib_1 = require("tslib");
const eventManager_1 = require("../eventManager");
const traceHelper_1 = require("../trace/traceHelper");
const sourceMappingDecoder_1 = require("./sourceMappingDecoder");
const remix_lib_1 = require("@remix-project/remix-lib");
/**
 * Process the source code location for the current executing bytecode
 */
class SourceLocationTracker {
    constructor(_codeManager, { debugWithGeneratedSources }) {
        this.opts = {
            debugWithGeneratedSources: debugWithGeneratedSources || false
        };
        this.codeManager = _codeManager;
        this.event = new eventManager_1.EventManager();
        this.sourceMapByAddress = {};
    }
    /**
     * Return the source location associated with the given @arg index (instruction index)
     *
     * @param {String} address - contract address from which the source location is retrieved
     * @param {Int} index - index in the instruction list from where the source location is retrieved
     * @param {Object} contractDetails - AST of compiled contracts
     */
    getSourceLocationFromInstructionIndex(address, index, contracts) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const sourceMap = yield this.extractSourceMap(this, this.codeManager, address, contracts);
            return (0, sourceMappingDecoder_1.atIndex)(index, sourceMap['map']);
        });
    }
    /**
     * Return the source location associated with the given @arg vmTraceIndex
     *
     * @param {String} address - contract address from which the source location is retrieved
     * @param {Int} vmtraceStepIndex - index of the current code in the vmtrace
     * @param {Object} contractDetails - AST of compiled contracts
     */
    getSourceLocationFromVMTraceIndex(address, vmtraceStepIndex, contracts) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const sourceMap = yield this.extractSourceMap(this, this.codeManager, address, contracts);
            const index = this.codeManager.getInstructionIndex(address, vmtraceStepIndex);
            return (0, sourceMappingDecoder_1.atIndex)(index, sourceMap['map']);
        });
    }
    /**
     * Returns the generated sources from a specific @arg address
     *
     * @param {String} address - contract address from which has generated sources
     * @param {Object} generatedSources - Object containing the sourceid, ast and the source code.
     */
    getGeneratedSourcesFromAddress(address) {
        if (!this.opts.debugWithGeneratedSources)
            return null;
        if (this.sourceMapByAddress[address])
            return this.sourceMapByAddress[address].generatedSources;
        return null;
    }
    /**
     * Returns the total amount of sources from a specific @arg address and @arg contracts
     *
     * @param {String} address - contract address from which has generated sources
     * @param {Object} contracts - AST of compiled contracts
     */
    getTotalAmountOfSources(address, contracts) {
        let sourcesLength = Object.keys(contracts).length;
        const generatedSources = this.getGeneratedSourcesFromAddress(address);
        if (generatedSources)
            sourcesLength = sourcesLength + Object.keys(generatedSources).length;
        return sourcesLength;
    }
    /**
     * Return a valid source location associated with the given @arg vmTraceIndex
     *
     * @param {String} address - contract address from which the source location is retrieved
     * @param {Int} vmtraceStepIndex - index of the current code in the vmtrace
     * @param {Object} contractDetails - AST of compiled contracts
     */
    getValidSourceLocationFromVMTraceIndex(address, vmtraceStepIndex, contracts) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const amountOfSources = this.getTotalAmountOfSources(address, contracts);
            let map = { file: -1 };
            /*
              (map.file === -1) this indicates that it isn't associated with a known source code
              (map.file > amountOfSources - 1) this indicates the current file index exceed the total number of files.
                                                      this happens when generated sources should not be considered.
            */
            while (vmtraceStepIndex >= 0 && (map.file === -1 || map.file > amountOfSources - 1)) {
                map = yield this.getSourceLocationFromVMTraceIndex(address, vmtraceStepIndex, contracts);
                vmtraceStepIndex = vmtraceStepIndex - 1;
            }
            return map;
        });
    }
    clearCache() {
        this.sourceMapByAddress = {};
    }
    getSourceMap(address, code, contracts) {
        const isCreation = (0, traceHelper_1.isContractCreation)(address);
        let bytes;
        for (const file in contracts) {
            for (const contract in contracts[file]) {
                const bytecode = contracts[file][contract].evm.bytecode;
                const deployedBytecode = contracts[file][contract].evm.deployedBytecode;
                if (!deployedBytecode)
                    continue;
                bytes = isCreation ? bytecode.object : deployedBytecode.object;
                if (remix_lib_1.util.compareByteCode(code, '0x' + bytes)) {
                    const generatedSources = isCreation ? bytecode.generatedSources : deployedBytecode.generatedSources;
                    const map = isCreation ? bytecode.sourceMap : deployedBytecode.sourceMap;
                    return { generatedSources, map };
                }
            }
        }
        return null;
    }
    extractSourceMap(self, codeManager, address, contracts) {
        return new Promise((resolve, reject) => {
            if (self.sourceMapByAddress[address])
                return resolve(self.sourceMapByAddress[address]);
            codeManager.getCode(address).then((result) => {
                const sourceMap = this.getSourceMap(address, result.bytecode, contracts);
                if (sourceMap) {
                    if (!(0, traceHelper_1.isContractCreation)(address))
                        self.sourceMapByAddress[address] = sourceMap;
                    return resolve(sourceMap);
                }
                reject(new Error('no sourcemap associated with the code ' + address));
            }).catch(reject);
        });
    }
}
exports.SourceLocationTracker = SourceLocationTracker;
//# sourceMappingURL=sourceLocationTracker.js.map