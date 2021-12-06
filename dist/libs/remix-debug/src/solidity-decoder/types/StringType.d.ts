import { DynamicByteArray } from './DynamicByteArray';
export declare class StringType extends DynamicByteArray {
    typeName: any;
    constructor(location: any);
    decodeFromStorage(location: any, storageResolver: any): Promise<any>;
    decodeFromStack(stackDepth: any, stack: any, memory: any, storageResolver: any, calldata: any, cursor: any, variableDetails?: any): Promise<any>;
    decodeFromMemoryInternal(offset: any, memory: any): any;
}
