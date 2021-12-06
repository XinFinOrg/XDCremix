import { RefType } from './RefType';
export declare class Mapping extends RefType {
    keyType: any;
    valueType: any;
    initialDecodedState: any;
    constructor(underlyingTypes: any, location: any, fullType: any);
    decodeFromStorage(location: any, storageResolver: any): Promise<{
        value: any;
        type: any;
    }>;
    decodeFromMemoryInternal(offset: any, memory: any): {
        value: string;
        length: string;
        type: any;
    };
    decodeMappingsLocation(preimages: any, location: any, storageResolver: any): Promise<{}>;
}
