export declare class TraceCache {
    returnValues: any;
    stopIndexes: any;
    outofgasIndexes: any;
    currentCall: any;
    callsTree: any;
    callsData: any;
    contractCreation: any;
    steps: any;
    addresses: any;
    callDataChanges: any;
    memoryChanges: any;
    storageChanges: any;
    sstore: any;
    constructor();
    init(): void;
    pushSteps(index: any, currentCallIndex: any): void;
    pushCallDataChanges(value: any, calldata: any): void;
    pushMemoryChanges(value: any): void;
    pushCall(step: any, index: any, address: any, callStack: any, reverted: any): void;
    pushOutOfGasIndex(index: any, address: any): void;
    pushStopIndex(index: any, address: any): void;
    pushReturnValue(step: any, value: any): void;
    pushContractCreationFromMemory(index: any, token: any, trace: any, lastMemoryChange: any): void;
    pushContractCreation(token: any, code: any): void;
    resetStoreChanges(index: any, address: any, key: any, value: any): void;
    pushStoreChanges(index: any, address: any, key: any, value: any): void;
    accumulateStorageChanges(index: any, address: any, storage: any): any;
}
