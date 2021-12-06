export declare class DebuggerSolidityLocals {
    event: any;
    stepManager: any;
    internalTreeCall: any;
    storageResolver: any;
    traceManager: any;
    tx: any;
    _sourceLocation: any;
    constructor(tx: any, _stepManager: any, _traceManager: any, _internalTreeCall: any);
    init(sourceLocation: any): any;
    decode(sourceLocation: any, cursor?: any): void;
    decodeMore(cursor: any): any;
}
