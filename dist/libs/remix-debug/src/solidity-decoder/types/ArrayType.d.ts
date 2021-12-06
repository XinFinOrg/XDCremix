import { RefType } from './RefType';
export declare class ArrayType extends RefType {
    underlyingType: any;
    arraySize: any;
    constructor(underlyingType: any, arraySize: any, location: any);
    decodeFromStorage(location: any, storageResolver: any): Promise<{
        error: string;
        type: any;
        value?: undefined;
        length?: undefined;
    } | {
        value: any[];
        length: string;
        type: any;
        error?: undefined;
    }>;
    decodeFromMemoryInternal(offset: any, memory: any, skip: any): {
        error: string;
        type: string;
        value?: undefined;
        length?: undefined;
        cursor?: undefined;
        hasNext?: undefined;
    } | {
        value: any[];
        length: string;
        type: any;
        cursor: any;
        hasNext: boolean;
        error?: undefined;
    };
}
