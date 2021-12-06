import { RefType } from './RefType';
export declare class Struct extends RefType {
    members: any;
    constructor(memberDetails: any, location: any, fullType: any);
    decodeFromStorage(location: any, storageResolver: any): Promise<{
        value: {};
        type: any;
    }>;
    decodeFromMemoryInternal(offset: any, memory: any): {
        value: {};
        type: any;
    };
}
