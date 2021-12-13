'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debugger = void 0;
const tslib_1 = require("tslib");
const Ethdebugger_1 = require("../Ethdebugger");
const eventManager_1 = require("../eventManager");
const traceHelper_1 = require("../trace/traceHelper");
const breakpointManager_1 = require("../code/breakpointManager");
const stepManager_1 = require("./stepManager");
const VmDebugger_1 = require("./VmDebugger");
class Debugger {
    constructor(options) {
        this.event = new eventManager_1.EventManager();
        this.offsetToLineColumnConverter = options.offsetToLineColumnConverter;
        /*
          Returns a compilation result for a given address or the last one available if none are found
        */
        this.compilationResult = options.compilationResult || function (contractAddress) { return null; };
        this.debugger = new Ethdebugger_1.Ethdebugger({
            web3: options.web3,
            debugWithGeneratedSources: options.debugWithGeneratedSources,
            compilationResult: this.compilationResult
        });
        const { traceManager, callTree, solidityProxy } = this.debugger;
        this.breakPointManager = new breakpointManager_1.BreakpointManager({
            traceManager,
            callTree,
            solidityProxy,
            locationToRowConverter: (sourceLocation) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                const compilationResult = yield this.compilationResult();
                if (!compilationResult)
                    return { start: null, end: null };
                return yield this.offsetToLineColumnConverter.offsetToLineColumn(sourceLocation, sourceLocation.file, compilationResult.source.sources, compilationResult.data.sources);
            })
        });
        this.breakPointManager.event.register('managersChanged', () => {
            const { traceManager, callTree, solidityProxy } = this.debugger;
            this.breakPointManager.setManagers({ traceManager, callTree, solidityProxy });
        });
        this.breakPointManager.event.register('breakpointStep', (step) => {
            this.step_manager.jumpTo(step);
        });
        this.debugger.setBreakpointManager(this.breakPointManager);
        this.debugger.event.register('newTraceLoaded', this, () => {
            this.event.trigger('debuggerStatus', [true]);
        });
        this.debugger.event.register('traceUnloaded', this, () => {
            this.event.trigger('debuggerStatus', [false]);
        });
    }
    registerAndHighlightCodeItem(index) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // register selected code item, highlight the corresponding source location
            // this.debugger.traceManager.getCurrentCalledAddressAt(index, async (error, address) => {
            try {
                let address = this.debugger.traceManager.getCurrentCalledAddressAt(index);
                address = 'xdc' + address.substring(2);
                const compilationResultForAddress = yield this.compilationResult(address);
                if (!compilationResultForAddress)
                    return;
                this.debugger.callTree.sourceLocationTracker.getValidSourceLocationFromVMTraceIndex(address, index, compilationResultForAddress.data.contracts).then((rawLocation) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                    if (compilationResultForAddress && compilationResultForAddress.data) {
                        const generatedSources = this.debugger.callTree.sourceLocationTracker.getGeneratedSourcesFromAddress(address);
                        const astSources = Object.assign({}, compilationResultForAddress.data.sources);
                        const sources = Object.assign({}, compilationResultForAddress.source.sources);
                        if (generatedSources) {
                            for (const genSource of generatedSources) {
                                astSources[genSource.name] = { id: genSource.id, ast: genSource.ast };
                                sources[genSource.name] = { content: genSource.contents };
                            }
                        }
                        var lineColumnPos = yield this.offsetToLineColumnConverter.offsetToLineColumn(rawLocation, rawLocation.file, sources, astSources);
                        this.event.trigger('newSourceLocation', [lineColumnPos, rawLocation, generatedSources, address]);
                    }
                    else {
                        this.event.trigger('newSourceLocation', [null]);
                    }
                })).catch((_error) => {
                    this.event.trigger('newSourceLocation', [null]);
                });
                // })
            }
            catch (error) {
                return console.log(error);
            }
        });
    }
    updateWeb3(web3) {
        this.debugger.web3 = web3;
    }
    debug(blockNumber, txNumber, tx, loadingCb) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const web3 = this.debugger.web3;
            if (this.debugger.traceManager.isLoading) {
                return;
            }
            if (tx) {
                if (!tx.to) {
                    tx.to = (0, traceHelper_1.contractCreationToken)('0');
                }
                return yield this.debugTx(tx, loadingCb);
            }
            if (txNumber.indexOf('0x') !== -1) {
                tx = yield web3.eth.getTransaction(txNumber);
                if (!tx)
                    throw new Error('cannot find transaction ' + txNumber);
            }
            else {
                tx = yield web3.eth.getTransactionFromBlock(blockNumber, txNumber);
                if (!tx)
                    throw new Error('cannot find transaction ' + blockNumber + ' ' + txNumber);
            }
            return yield this.debugTx(tx, loadingCb);
        });
    }
    debugTx(tx, loadingCb) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            this.step_manager = new stepManager_1.DebuggerStepManager(this.debugger, this.debugger.traceManager);
            this.debugger.codeManager.event.register('changed', this, (code, address, instIndex) => {
                if (!this.debugger.solidityProxy.contracts)
                    return;
                this.debugger.callTree.sourceLocationTracker.getValidSourceLocationFromVMTraceIndex(address, this.step_manager.currentStepIndex, this.debugger.solidityProxy.contracts).then((sourceLocation) => {
                    this.vmDebuggerLogic.event.trigger('sourceLocationChanged', [sourceLocation]);
                });
            });
            this.vmDebuggerLogic = new VmDebugger_1.VmDebuggerLogic(this.debugger, tx, this.step_manager, this.debugger.traceManager, this.debugger.codeManager, this.debugger.solidityProxy, this.debugger.callTree);
            this.vmDebuggerLogic.start();
            this.step_manager.event.register('stepChanged', this, (stepIndex) => {
                if (typeof stepIndex !== 'number' || stepIndex >= this.step_manager.traceLength) {
                    return this.event.trigger('endDebug');
                }
                this.debugger.codeManager.resolveStep(stepIndex, tx);
                this.step_manager.event.trigger('indexChanged', [stepIndex]);
                this.vmDebuggerLogic.event.trigger('indexChanged', [stepIndex]);
                this.vmDebuggerLogic.debugger.event.trigger('indexChanged', [stepIndex]);
                this.registerAndHighlightCodeItem(stepIndex);
            });
            loadingCb();
            yield this.debugger.debug(tx);
        });
    }
    unload() {
        this.debugger.unLoad();
        this.event.trigger('debuggerUnloaded');
    }
}
exports.Debugger = Debugger;
//# sourceMappingURL=debugger.js.map