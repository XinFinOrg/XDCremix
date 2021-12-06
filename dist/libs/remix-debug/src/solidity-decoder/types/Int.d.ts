import { ValueType } from './ValueType';
export declare class Int extends ValueType {
    constructor(storageBytes: any);
    decodeValue(value: any): string;
}
