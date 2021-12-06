export declare class VmDebuggerLogic {
    event: any;
    debugger: any;
    stepManager: any;
    _traceManager: any;
    _codeManager: any;
    _solidityProxy: any;
    _callTree: any;
    storageResolver: any;
    tx: any;
    debuggerSolidityState: any;
    debuggerSolidityLocals: any;
    address: any;
    traceLength: any;
    addresses: any;
    constructor(_debugger: any, tx: any, _stepManager: any, _traceManager: any, _codeManager: any, _solidityProxy: any, _callTree: any);
    start(): void;
    listenToEvents(): void;
    listenToCodeManagerEvents(): void;
    listenToTraceManagerEvents(): void;
    listenToFullStorageChanges(): void;
    listenToNewChanges(): void;
    listenToSolidityStateEvents(): void;
    listenToSolidityLocalsEvents(): void;
}
