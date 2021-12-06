export declare class TraceAnalyser {
    traceCache: any;
    trace: any;
    constructor(_cache: any);
    analyse(trace: any, tx: any): boolean;
    buildReturnValues(index: any, step: any): void;
    buildCalldata(index: any, step: any, tx: any, newContext: any): void;
    buildMemory(index: any, step: any): void;
    buildStorage(index: any, step: any, context: any): any;
    buildDepth(index: any, step: any, tx: any, callStack: any, context: any): any;
}
