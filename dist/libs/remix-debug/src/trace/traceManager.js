'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraceManager = void 0;
const tslib_1 = require("tslib");
const remix_lib_1 = require("@remix-project/remix-lib");
const traceAnalyser_1 = require("./traceAnalyser");
const traceCache_1 = require("./traceCache");
const traceStepManager_1 = require("./traceStepManager");
const traceHelper_1 = require("./traceHelper");
class TraceManager {
    constructor(options) {
        this.web3 = options.web3;
        this.isLoading = false;
        this.trace = null;
        this.traceCache = new traceCache_1.TraceCache();
        this.traceAnalyser = new traceAnalyser_1.TraceAnalyser(this.traceCache);
        this.traceStepManager = new traceStepManager_1.TraceStepManager(this.traceAnalyser);
    }
    // init section
    resolveTrace(tx) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            this.tx = tx;
            this.init();
            if (!this.web3)
                throw new Error('web3 not loaded');
            this.isLoading = true;
            const result = yield this.getTrace(tx.hash);
            try {
                if (result['structLogs'].length > 0) {
                    this.trace = result['structLogs'];
                    try {
                        const networkId = yield this.web3.eth.net.getId();
                        this.fork = remix_lib_1.execution.forkAt(networkId, tx.blockNumber);
                    }
                    catch (e) {
                        this.fork = 'london';
                        console.log(`unable to detect fork, defaulting to ${this.fork}..`);
                        console.error(e);
                    }
                    this.traceAnalyser.analyse(result['structLogs'], tx);
                    this.isLoading = false;
                    return true;
                }
                var mes = tx.hash + ' is not a contract invocation or contract creation.';
                console.log(mes);
                this.isLoading = false;
                throw new Error(mes);
            }
            catch (error) {
                console.log(error);
                this.isLoading = false;
                throw new Error(error);
            }
        });
    }
    getTrace(txHash) {
        return new Promise((resolve, reject) => {
            const options = {
                disableStorage: true,
                disableMemory: false,
                disableStack: false,
                fullStorage: false
            };
            this.web3.debug.traceTransaction(txHash, options, function (error, result) {
                if (error)
                    return reject(error);
                resolve(result);
            });
        });
    }
    init() {
        this.trace = null;
        this.traceCache.init();
    }
    getCurrentFork() {
        return this.fork;
    }
    // API section
    inRange(step) {
        return this.isLoaded() && step >= 0 && step < this.trace.length;
    }
    isLoaded() {
        return !this.isLoading && this.trace !== null;
    }
    getLength(callback) {
        if (!this.trace) {
            callback(new Error('no trace available'), null);
        }
        else {
            callback(null, this.trace.length);
        }
    }
    accumulateStorageChanges(index, address, storageOrigin) {
        return this.traceCache.accumulateStorageChanges(index, address, storageOrigin);
    }
    getAddresses() {
        return this.traceCache.addresses;
    }
    getCallDataAt(stepIndex) {
        try {
            this.checkRequestedStep(stepIndex);
        }
        catch (check) {
            throw new Error(check);
        }
        const callDataChange = remix_lib_1.util.findLowerBoundValue(stepIndex, this.traceCache.callDataChanges);
        if (callDataChange === null) {
            throw new Error('no calldata found');
        }
        return [this.traceCache.callsData[callDataChange]];
    }
    buildCallPath(stepIndex) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            try {
                this.checkRequestedStep(stepIndex);
            }
            catch (check) {
                throw new Error(check);
            }
            const callsPath = remix_lib_1.util.buildCallPath(stepIndex, this.traceCache.callsTree.call);
            if (callsPath === null)
                throw new Error('no call path built');
            return callsPath;
        });
    }
    getCallStackAt(stepIndex) {
        try {
            this.checkRequestedStep(stepIndex);
        }
        catch (check) {
            throw new Error(check);
        }
        const call = remix_lib_1.util.findCall(stepIndex, this.traceCache.callsTree.call);
        if (call === null) {
            throw new Error('no callstack found');
        }
        return call.callStack;
    }
    getStackAt(stepIndex) {
        this.checkRequestedStep(stepIndex);
        if (this.trace[stepIndex] && this.trace[stepIndex].stack) { // there's always a stack
            const stack = this.trace[stepIndex].stack.slice(0);
            stack.reverse();
            return stack.map(el => el.startsWith('0x') ? el : '0x' + el);
        }
        else {
            throw new Error('no stack found');
        }
    }
    getLastCallChangeSince(stepIndex) {
        try {
            this.checkRequestedStep(stepIndex);
        }
        catch (check) {
            throw new Error(check);
        }
        const callChange = remix_lib_1.util.findCall(stepIndex, this.traceCache.callsTree.call);
        if (callChange === null) {
            return 0;
        }
        return callChange;
    }
    getCurrentCalledAddressAt(stepIndex) {
        try {
            this.checkRequestedStep(stepIndex);
            const resp = this.getLastCallChangeSince(stepIndex);
            if (!resp) {
                throw new Error('unable to get current called address. ' + stepIndex + ' does not match with a CALL');
            }
            return resp.address;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    getContractCreationCode(token) {
        if (!this.traceCache.contractCreation[token]) {
            throw new Error('no contract creation named ' + token);
        }
        return this.traceCache.contractCreation[token];
    }
    getMemoryAt(stepIndex) {
        this.checkRequestedStep(stepIndex);
        const lastChanges = remix_lib_1.util.findLowerBoundValue(stepIndex, this.traceCache.memoryChanges);
        if (lastChanges === null) {
            throw new Error('no memory found');
        }
        return this.trace[lastChanges].memory;
    }
    getCurrentPC(stepIndex) {
        try {
            this.checkRequestedStep(stepIndex);
        }
        catch (check) {
            throw new Error(check);
        }
        return this.trace[stepIndex].pc;
    }
    getAllStopIndexes() {
        return this.traceCache.stopIndexes;
    }
    getAllOutofGasIndexes() {
        return this.traceCache.outofgasIndexes;
    }
    getReturnValue(stepIndex) {
        try {
            this.checkRequestedStep(stepIndex);
        }
        catch (check) {
            throw new Error(check);
        }
        if (!this.traceCache.returnValues[stepIndex]) {
            throw new Error('current step is not a return step');
        }
        return this.traceCache.returnValues[stepIndex];
    }
    getCurrentStep(stepIndex) {
        try {
            this.checkRequestedStep(stepIndex);
        }
        catch (check) {
            throw new Error(check);
        }
        return this.traceCache.steps[stepIndex];
    }
    getMemExpand(stepIndex) {
        return (this.getStepProperty(stepIndex, 'memexpand') || '');
    }
    getStepCost(stepIndex) {
        return this.getStepProperty(stepIndex, 'gasCost');
    }
    getRemainingGas(stepIndex) {
        return this.getStepProperty(stepIndex, 'gas');
    }
    getStepProperty(stepIndex, property) {
        try {
            this.checkRequestedStep(stepIndex);
        }
        catch (check) {
            throw new Error(check);
        }
        return this.trace[stepIndex][property];
    }
    isCreationStep(stepIndex) {
        return (0, traceHelper_1.isCreateInstruction)(this.trace[stepIndex]);
    }
    // step section
    findStepOverBack(currentStep) {
        return this.traceStepManager.findStepOverBack(currentStep);
    }
    findStepOverForward(currentStep) {
        return this.traceStepManager.findStepOverForward(currentStep);
    }
    findNextCall(currentStep) {
        return this.traceStepManager.findNextCall(currentStep);
    }
    findStepOut(currentStep) {
        return this.traceStepManager.findStepOut(currentStep);
    }
    checkRequestedStep(stepIndex) {
        if (!this.trace) {
            throw new Error('trace not loaded');
        }
        else if (stepIndex >= this.trace.length) {
            throw new Error('trace smaller than requested');
        }
    }
    waterfall(calls, stepindex, cb) {
        const ret = [];
        let retError = null;
        for (var call in calls) {
            calls[call].apply(this, [stepindex, function (error, result) {
                    retError = error;
                    ret.push({ error: error, value: result });
                }]);
        }
        cb(retError, ret);
    }
}
exports.TraceManager = TraceManager;
//# sourceMappingURL=traceManager.js.map