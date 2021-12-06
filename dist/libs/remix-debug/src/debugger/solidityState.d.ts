export declare class DebuggerSolidityState {
    event: any;
    storageResolver: any;
    stepManager: any;
    traceManager: any;
    codeManager: any;
    solidityProxy: any;
    stateVariablesByAddresses: any;
    tx: any;
    constructor(tx: any, _stepManager: any, _traceManager: any, _codeManager: any, _solidityProxy: any);
    init(index: any): any;
    reset(): void;
    decode(index: any): any;
    extractStateVariables(stateVars: any, address: any): void;
}
