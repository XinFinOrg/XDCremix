import { RefType } from './RefType';
export declare class DynamicByteArray extends RefType {
    constructor(location: any);
    decodeFromStorage(location: any, storageResolver: any): Promise<{
        error: string;
        type: any;
        value?: undefined;
        length?: undefined;
    } | {
        value: string;
        length: string;
        type: any;
        error?: undefined;
    }>;
    decodeFromMemoryInternal(offset: any, memory: any): {
        length: string;
        value: string;
        type: any;
    };
}
