'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ethdebugger = void 0;
const tslib_1 = require("tslib");
const storageViewer_1 = require("./storage/storageViewer");
const storageResolver_1 = require("./storage/storageResolver");
const traceManager_1 = require("./trace/traceManager");
const codeManager_1 = require("./code/codeManager");
const traceHelper_1 = require("./trace/traceHelper");
const eventManager_1 = require("./eventManager");
const solidity_decoder_1 = require("./solidity-decoder");
/**
  * Ethdebugger is a wrapper around a few classes that helps debugging a transaction
  *
  * - Web3Providers - define which environment (web3) the transaction will be retrieved from
  * - TraceManager - Load / Analyze the trace and retrieve details of specific test
  * - CodeManager - Retrieve loaded byte code and help to resolve AST item from vmtrace index
  * - SolidityProxy - Basically used to extract state variable from AST
  * - Breakpoint Manager - Used to add / remove / jumpto breakpoint
  * - InternalCallTree - Used to retrieved local variables
  * - StorageResolver - Help resolving the storage accross different steps
  *
  * @param {Map} opts  -  { function compilationResult } //
  */
class Ethdebugger {
    constructor(opts) {
        this.compilationResult = opts.compilationResult || function (contractAddress) { return null; };
        this.web3 = opts.web3;
        this.opts = opts;
        this.event = new eventManager_1.EventManager();
        this.traceManager = new traceManager_1.TraceManager({ web3: this.web3 });
        this.codeManager = new codeManager_1.CodeManager(this.traceManager);
        this.solidityProxy = new solidity_decoder_1.SolidityProxy({ getCurrentCalledAddressAt: this.traceManager.getCurrentCalledAddressAt.bind(this.traceManager), getCode: this.codeManager.getCode.bind(this.codeManager) });
        this.storageResolver = null;
        const includeLocalVariables = true;
        this.callTree = new solidity_decoder_1.InternalCallTree(this.event, this.traceManager, this.solidityProxy, this.codeManager, Object.assign(Object.assign({}, opts), { includeLocalVariables }));
    }
    setManagers() {
        this.traceManager = new traceManager_1.TraceManager({ web3: this.web3 });
        this.codeManager = new codeManager_1.CodeManager(this.traceManager);
        this.solidityProxy = new solidity_decoder_1.SolidityProxy({ getCurrentCalledAddressAt: this.traceManager.getCurrentCalledAddressAt.bind(this.traceManager), getCode: this.codeManager.getCode.bind(this.codeManager) });
        this.storageResolver = null;
        const includeLocalVariables = true;
        this.callTree = new solidity_decoder_1.InternalCallTree(this.event, this.traceManager, this.solidityProxy, this.codeManager, Object.assign(Object.assign({}, this.opts), { includeLocalVariables }));
        this.event.trigger('managersChanged');
    }
    resolveStep(index) {
        this.codeManager.resolveStep(index, this.tx);
    }
    setCompilationResult(compilationResult) {
        this.solidityProxy.reset((compilationResult && compilationResult.data) || {});
    }
    sourceLocationFromVMTraceIndex(address, stepIndex) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return this.callTree.sourceLocationTracker.getSourceLocationFromVMTraceIndex(address, stepIndex, this.solidityProxy.contracts);
        });
    }
    getValidSourceLocationFromVMTraceIndex(address, stepIndex) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return this.callTree.sourceLocationTracker.getValidSourceLocationFromVMTraceIndex(address, stepIndex, this.solidityProxy.contracts);
        });
    }
    sourceLocationFromInstructionIndex(address, instIndex, callback) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return this.callTree.sourceLocationTracker.getSourceLocationFromInstructionIndex(address, instIndex, this.solidityProxy.contracts);
        });
    }
    /* breakpoint */
    setBreakpointManager(breakpointManager) {
        this.breakpointManager = breakpointManager;
    }
    /* decode locals */
    extractLocalsAt(step) {
        return this.callTree.findScope(step);
    }
    decodeLocalsAt(step, sourceLocation, callback) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            try {
                const stack = this.traceManager.getStackAt(step);
                const memory = this.traceManager.getMemoryAt(step);
                const address = this.traceManager.getCurrentCalledAddressAt(step);
                const calldata = this.traceManager.getCallDataAt(step);
                try {
                    const storageViewer = new storageViewer_1.StorageViewer({ stepIndex: step, tx: this.tx, address: address }, this.storageResolver, this.traceManager);
                    const locals = yield solidity_decoder_1.localDecoder.solidityLocals(step, this.callTree, stack, memory, storageViewer, calldata, sourceLocation, null);
                    if (locals['error']) {
                        return callback(locals['error']);
                    }
                    return callback(null, locals);
                }
                catch (e) {
                    callback(e.message);
                }
            }
            catch (error) {
                callback(error);
            }
        });
    }
    /* decode state */
    extractStateAt(step) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return this.solidityProxy.extractStateVariablesAt(step);
        });
    }
    decodeStateAt(step, stateVars, callback) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            try {
                const address = this.traceManager.getCurrentCalledAddressAt(step);
                const storageViewer = new storageViewer_1.StorageViewer({ stepIndex: step, tx: this.tx, address: address }, this.storageResolver, this.traceManager);
                const result = yield solidity_decoder_1.stateDecoder.decodeState(stateVars, storageViewer);
                return result;
            }
            catch (error) {
                callback(error);
            }
        });
    }
    storageViewAt(step, address) {
        return new storageViewer_1.StorageViewer({ stepIndex: step, tx: this.tx, address: address }, this.storageResolver, this.traceManager);
    }
    updateWeb3(web3) {
        this.web3 = web3;
        this.setManagers();
    }
    unLoad() {
        this.traceManager.init();
        this.codeManager.clear();
        this.event.trigger('traceUnloaded');
    }
    debug(tx) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (this.traceManager.isLoading) {
                return;
            }
            tx.to = tx.to || (0, traceHelper_1.contractCreationToken)('0');
            this.tx = tx;
            yield this.traceManager.resolveTrace(tx);
            this.setCompilationResult(yield this.compilationResult(tx.to));
            this.event.trigger('newTraceLoaded', [this.traceManager.trace]);
            if (this.breakpointManager && this.breakpointManager.hasBreakpoint()) {
                this.breakpointManager.jumpNextBreakpoint(false);
            }
            this.storageResolver = new storageResolver_1.StorageResolver({ web3: this.traceManager.web3 });
        });
    }
}
exports.Ethdebugger = Ethdebugger;
//# sourceMappingURL=Ethdebugger.js.map