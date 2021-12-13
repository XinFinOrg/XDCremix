"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VmDebuggerLogic = void 0;
const tslib_1 = require("tslib");
const eventManager_1 = require("../eventManager");
const storageResolver_1 = require("../storage/storageResolver");
const storageViewer_1 = require("../storage/storageViewer");
const remix_lib_1 = require("@remix-project/remix-lib");
const solidityState_1 = require("./solidityState");
const solidityLocals_1 = require("./solidityLocals");
const { ui } = remix_lib_1.helpers;
class VmDebuggerLogic {
    constructor(_debugger, tx, _stepManager, _traceManager, _codeManager, _solidityProxy, _callTree) {
        this.event = new eventManager_1.EventManager();
        this.debugger = _debugger;
        this.stepManager = _stepManager;
        this._traceManager = _traceManager;
        this._codeManager = _codeManager;
        this._solidityProxy = _solidityProxy;
        this._callTree = _callTree;
        this.storageResolver = null;
        this.tx = tx;
        this.debuggerSolidityState = new solidityState_1.DebuggerSolidityState(tx, _stepManager, _traceManager, _codeManager, _solidityProxy);
        this.debuggerSolidityLocals = new solidityLocals_1.DebuggerSolidityLocals(tx, _stepManager, _traceManager, _callTree);
    }
    start() {
        this.listenToEvents();
        this.listenToCodeManagerEvents();
        this.listenToTraceManagerEvents();
        this.listenToFullStorageChanges();
        this.listenToNewChanges();
        this.listenToSolidityStateEvents();
        this.listenToSolidityLocalsEvents();
    }
    listenToEvents() {
        this.debugger.event.register('traceUnloaded', () => {
            this.event.trigger('traceUnloaded');
        });
        this.debugger.event.register('newTraceLoaded', () => {
            this.event.trigger('newTraceLoaded');
        });
    }
    listenToCodeManagerEvents() {
        this._codeManager.event.register('changed', (code, address, index, nextIndexes, returnInstructionIndexes, outOfGasInstructionIndexes) => {
            this.event.trigger('codeManagerChanged', [code, address, index, nextIndexes, returnInstructionIndexes, outOfGasInstructionIndexes]);
        });
    }
    listenToTraceManagerEvents() {
        this.event.register('indexChanged', this, (index) => {
            if (index < 0)
                return;
            if (this.stepManager.currentStepIndex !== index)
                return;
            this.event.trigger('indexUpdate', [index]);
            this.event.trigger('functionsStackUpdate', [this._callTree.retrieveFunctionsStack(index)]);
            try {
                const calldata = this._traceManager.getCallDataAt(index);
                if (this.stepManager.currentStepIndex === index) {
                    this.event.trigger('traceManagerCallDataUpdate', [calldata]);
                }
            }
            catch (error) {
                this.event.trigger('traceManagerCallDataUpdate', [{}]);
            }
            try {
                const memory = this._traceManager.getMemoryAt(index);
                if (this.stepManager.currentStepIndex === index) {
                    this.event.trigger('traceManagerMemoryUpdate', [ui.formatMemory(memory, 16)]);
                }
            }
            catch (error) {
                this.event.trigger('traceManagerMemoryUpdate', [{}]);
            }
            try {
                const callstack = this._traceManager.getCallStackAt(index);
                if (this.stepManager.currentStepIndex === index) {
                    this.event.trigger('traceManagerCallStackUpdate', [callstack]);
                }
            }
            catch (error) {
                this.event.trigger('traceManagerCallStackUpdate', [{}]);
            }
            try {
                const callstack = this._traceManager.getStackAt(index);
                if (this.stepManager.currentStepIndex === index) {
                    this.event.trigger('traceManagerStackUpdate', [callstack]);
                }
            }
            catch (error) {
                this.event.trigger('traceManagerStackUpdate', [{}]);
            }
            try {
                let address = this._traceManager.getCurrentCalledAddressAt(index);
                address = 'xdc' + address.substring(2);
                if (!this.storageResolver)
                    return;
                var storageViewer = new storageViewer_1.StorageViewer({ stepIndex: this.stepManager.currentStepIndex, tx: this.tx, address: address }, this.storageResolver, this._traceManager);
                storageViewer.storageRange().then((storage) => {
                    if (this.stepManager.currentStepIndex === index) {
                        var header = storageViewer.isComplete(address) ? '[Completely Loaded]' : '[Partially Loaded]';
                        this.event.trigger('traceManagerStorageUpdate', [storage, header]);
                    }
                }).catch((_error) => {
                    this.event.trigger('traceManagerStorageUpdate', [{}]);
                });
            }
            catch (error) {
                this.event.trigger('traceManagerStorageUpdate', [{}]);
            }
            try {
                const step = this._traceManager.getCurrentStep(index);
                this.event.trigger('traceCurrentStepUpdate', [null, step]);
            }
            catch (error) {
                this.event.trigger('traceCurrentStepUpdate', [error]);
            }
            try {
                const addmem = this._traceManager.getMemExpand(index);
                this.event.trigger('traceMemExpandUpdate', [null, addmem]);
            }
            catch (error) {
                this.event.trigger('traceMemExpandUpdate', [error]);
            }
            try {
                const gas = this._traceManager.getStepCost(index);
                this.event.trigger('traceStepCostUpdate', [null, gas]);
            }
            catch (error) {
                this.event.trigger('traceStepCostUpdate', [error]);
            }
            try {
                let address = this._traceManager.getCurrentCalledAddressAt(index);
                address = 'xdc' + address.substring(2);
                this.event.trigger('traceCurrentCalledAddressAtUpdate', [null, address]);
            }
            catch (error) {
                this.event.trigger('traceCurrentCalledAddressAtUpdate', [error]);
            }
            try {
                const remaining = this._traceManager.getRemainingGas(index);
                this.event.trigger('traceRemainingGasUpdate', [null, remaining]);
            }
            catch (error) {
                this.event.trigger('traceRemainingGasUpdate', [error]);
            }
            try {
                const returnValue = this._traceManager.getReturnValue(index);
                if (this.stepManager.currentStepIndex === index) {
                    this.event.trigger('traceReturnValueUpdate', [[returnValue]]);
                }
            }
            catch (error) {
                this.event.trigger('traceReturnValueUpdate', [[error]]);
            }
        });
    }
    listenToFullStorageChanges() {
        this.address = [];
        this.traceLength = 0;
        this.debugger.event.register('newTraceLoaded', (length) => {
            let addresses = this._traceManager.getAddresses();
            // address = 'xdc'+address.substring(2)
            this.event.trigger('traceAddressesUpdate', [addresses]);
            this.addresses = addresses;
            this._traceManager.getLength((error, length) => {
                if (error)
                    return;
                this.event.trigger('traceLengthUpdate', [length]);
                this.traceLength = length;
            });
        });
        this.debugger.event.register('indexChanged', this, (index) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (index < 0)
                return;
            if (this.stepManager.currentStepIndex !== index)
                return;
            if (!this.storageResolver)
                return;
            // Clean up storage update
            if (index === this.traceLength - 1) {
                return this.event.trigger('traceStorageUpdate', [{}]);
            }
            var storageJSON = {};
            for (var k in this.addresses) {
                var address = this.addresses[k];
                var storageViewer = new storageViewer_1.StorageViewer({ stepIndex: this.stepManager.currentStepIndex, tx: this.tx, address: address }, this.storageResolver, this._traceManager);
                try {
                    storageJSON[address] = yield storageViewer.storageRange();
                }
                catch (e) {
                    console.error(e);
                }
            }
            this.event.trigger('traceStorageUpdate', [storageJSON]);
        }));
    }
    listenToNewChanges() {
        this.debugger.event.register('newTraceLoaded', this, () => {
            this.storageResolver = new storageResolver_1.StorageResolver({ web3: this.debugger.web3 });
            this.debuggerSolidityState.storageResolver = this.storageResolver;
            this.debuggerSolidityLocals.storageResolver = this.storageResolver;
            this.event.trigger('newTrace', []);
        });
        this.debugger.callTree.event.register('callTreeReady', () => {
            if (this.debugger.callTree.reducedTrace.length) {
                return this.event.trigger('newCallTree', []);
            }
        });
    }
    listenToSolidityStateEvents() {
        this.event.register('indexChanged', this.debuggerSolidityState.init.bind(this.debuggerSolidityState));
        this.debuggerSolidityState.event.register('solidityState', (state) => {
            this.event.trigger('solidityState', [state]);
        });
        this.debuggerSolidityState.event.register('solidityStateMessage', (message) => {
            this.event.trigger('solidityStateMessage', [message]);
        });
        this.debuggerSolidityState.event.register('solidityStateUpdating', () => {
            this.event.trigger('solidityStateUpdating', []);
        });
        this.event.register('traceUnloaded', this.debuggerSolidityState.reset.bind(this.debuggerSolidityState));
        this.event.register('newTraceLoaded', this.debuggerSolidityState.reset.bind(this.debuggerSolidityState));
    }
    listenToSolidityLocalsEvents() {
        this.event.register('sourceLocationChanged', this.debuggerSolidityLocals.init.bind(this.debuggerSolidityLocals));
        this.event.register('solidityLocalsLoadMore', this.debuggerSolidityLocals.decodeMore.bind(this.debuggerSolidityLocals));
        this.debuggerSolidityLocals.event.register('solidityLocalsLoadMoreCompleted', (locals) => {
            this.event.trigger('solidityLocalsLoadMoreCompleted', [locals]);
        });
        this.debuggerSolidityLocals.event.register('solidityLocals', (state) => {
            this.event.trigger('solidityLocals', [state]);
        });
        this.debuggerSolidityLocals.event.register('solidityLocalsMessage', (message) => {
            this.event.trigger('solidityLocalsMessage', [message]);
        });
        this.debuggerSolidityLocals.event.register('solidityLocalsUpdating', () => {
            this.event.trigger('solidityLocalsUpdating', []);
        });
        this.debuggerSolidityLocals.event.register('traceReturnValueUpdate', (data, header) => {
            this.event.trigger('traceReturnValueUpdate', [data, header]);
        });
    }
}
exports.VmDebuggerLogic = VmDebuggerLogic;
//# sourceMappingURL=VmDebugger.js.map