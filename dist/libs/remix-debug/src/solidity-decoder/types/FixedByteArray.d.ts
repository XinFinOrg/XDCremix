import { ValueType } from './ValueType';
export declare class FixedByteArray extends ValueType {
    constructor(storageBytes: any);
    decodeValue(value: any): string;
}
