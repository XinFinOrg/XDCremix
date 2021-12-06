import { ValueType } from './ValueType';
export declare class Enum extends ValueType {
    enumDef: any;
    constructor(enumDef: any);
    decodeValue(value: any): any;
}
