'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeManager = void 0;
const tslib_1 = require("tslib");
const eventManager_1 = require("../eventManager");
const traceHelper_1 = require("../trace/traceHelper");
const sourceMappingDecoder_1 = require("../source/sourceMappingDecoder");
const codeResolver_1 = require("./codeResolver");
/*
  resolve contract code referenced by vmtrace in order to be used by asm listview.
  events:
   - changed: triggered when an item is selected
   - resolvingStep: when CodeManager resolves code/selected instruction of a new step
*/
class CodeManager {
    constructor(_traceManager) {
        this.event = new eventManager_1.EventManager();
        this.isLoading = false;
        this.traceManager = _traceManager;
        this.codeResolver = new codeResolver_1.CodeResolver({
            getCode: (address) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    this.traceManager.web3.eth.getCode(address, (error, code) => {
                        if (error) {
                            return reject(error);
                        }
                        return resolve(code);
                    });
                });
            }),
            fork: this.traceManager.getCurrentFork()
        });
    }
    /**
     * clear the cache
     *
     */
    clear() {
        this.codeResolver.clear();
    }
    /**
     * resolve the code of the given @arg stepIndex and trigger appropriate event
     *
     * @param {String} stepIndex - vm trace step
     * @param {Object} tx - transaction (given by web3)
     */
    resolveStep(stepIndex, tx) {
        if (stepIndex < 0)
            return;
        this.event.trigger('resolvingStep');
        if (stepIndex === 0) {
            return this.retrieveCodeAndTrigger(this, tx.to, stepIndex, tx);
        }
        try {
            const address = this.traceManager.getCurrentCalledAddressAt(stepIndex);
            this.retrieveCodeAndTrigger(this, address, stepIndex, tx);
        }
        catch (error) {
            return console.log(error);
        }
    }
    /**
     * Retrieve the code located at the given @arg address
     *
     * @param {String} address - address of the contract to get the code from
     * @param {Function} cb - callback function, return the bytecode
     */
    getCode(address) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (!(0, traceHelper_1.isContractCreation)(address)) {
                const code = yield this.codeResolver.resolveCode(address);
                return code;
            }
            var codes = this.codeResolver.getExecutingCodeFromCache(address);
            if (codes) {
                return codes;
            }
            const hexCode = this.traceManager.getContractCreationCode(address);
            codes = this.codeResolver.cacheExecutingCode(address, hexCode);
            return codes;
        });
    }
    /**
     * Retrieve the called function for the current vm step for the given @arg address
     *
     * @param {String} stepIndex - vm trace step
     * @param {String} sourceMap - source map given byt the compilation result
     * @param {Object} ast - ast given by the compilation result
     * @return {Object} return the ast node of the function
     */
    getFunctionFromStep(stepIndex, sourceMap, ast) {
        try {
            const address = this.traceManager.getCurrentCalledAddressAt(stepIndex);
            const pc = this.traceManager.getCurrentPC(stepIndex);
            return this.getFunctionFromPC(address, pc, sourceMap, ast);
        }
        catch (error) {
            console.log(error);
            return { error: 'Cannot retrieve current address or PC for ' + stepIndex };
        }
    }
    /**
     * Retrieve the instruction index of the given @arg step
     *
     * @param {String} address - address of the current context
     * @param {String} step - vm trace step
     * @param {Function} callback - instruction index
     */
    getInstructionIndex(address, step) {
        try {
            const pc = this.traceManager.getCurrentPC(step);
            const itemIndex = this.codeResolver.getInstructionIndex(address, pc);
            return itemIndex;
        }
        catch (error) {
            console.log(error);
            throw new Error('Cannot retrieve current PC for ' + step);
        }
    }
    /**
     * Retrieve the called function for the given @arg pc and @arg address
     *
     * @param {String} address - address of the current context (used to resolve instruction index)
     * @param {String} pc - pc that point to the instruction index
     * @param {String} sourceMap - source map given byt the compilation result
     * @param {Object} ast - ast given by the compilation result
     * @return {Object} return the ast node of the function
     */
    getFunctionFromPC(address, pc, sourceMap, ast) {
        const instIndex = this.codeResolver.getInstructionIndex(address, pc);
        return (0, sourceMappingDecoder_1.findNodeAtInstructionIndex)('FunctionDefinition', instIndex, sourceMap, ast);
    }
    retrieveCodeAndTrigger(codeMananger, address, stepIndex, tx) {
        codeMananger.getCode(address).then((result) => {
            this.retrieveIndexAndTrigger(codeMananger, address, stepIndex, result.instructions);
        }).catch((error) => {
            return console.log(error);
        });
    }
    retrieveIndexAndTrigger(codeMananger, address, step, code) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let result;
            const next = [];
            const returnInstructionIndexes = [];
            const outOfGasInstructionIndexes = [];
            try {
                result = codeMananger.getInstructionIndex(address, step);
                for (let i = 1; i < 6; i++) {
                    if (this.traceManager.inRange(step + i)) {
                        next.push(codeMananger.getInstructionIndex(address, step + i));
                    }
                }
                let values = this.traceManager.getAllStopIndexes();
                if (values) {
                    for (const value of values) {
                        if (value.address === address) {
                            returnInstructionIndexes.push({ instructionIndex: this.getInstructionIndex(address, value.index), address });
                        }
                    }
                }
                values = this.traceManager.getAllOutofGasIndexes();
                if (values) {
                    for (const value of values) {
                        if (value.address === address) {
                            outOfGasInstructionIndexes.push({ instructionIndex: this.getInstructionIndex(address, value.index), address });
                        }
                    }
                }
            }
            catch (error) {
                return console.log(error);
            }
            try {
                codeMananger.event.trigger('changed', [code, address, result, next, returnInstructionIndexes, outOfGasInstructionIndexes]);
            }
            catch (e) {
                console.log('dispatching event failed', e);
            }
        });
    }
}
exports.CodeManager = CodeManager;
//# sourceMappingURL=codeManager.js.map