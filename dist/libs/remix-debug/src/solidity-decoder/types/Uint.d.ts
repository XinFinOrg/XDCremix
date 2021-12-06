import { ValueType } from './ValueType';
export declare class Uint extends ValueType {
    constructor(storageBytes: any);
    decodeValue(value: any): string;
}
