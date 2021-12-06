export declare class ValueType {
    storageSlots: any;
    storageBytes: any;
    typeName: any;
    basicType: any;
    constructor(storageSlots: any, storageBytes: any, typeName: any);
    decodeValue(input?: any): void;
    /**
      * decode the type with the @arg location from the storage
      *
      * @param {Object} location - containing offset and slot
      * @param {Object} storageResolver  - resolve storage queries
      * @return {Object} - decoded value
      */
    decodeFromStorage(location: any, storageResolver: any): Promise<{
        value: void;
        type: any;
        error?: undefined;
    } | {
        error: string;
        type: any;
        value?: undefined;
    }>;
    /**
      * decode the type from the stack
      *
      * @param {Int} stackDepth - position of the type in the stack
      * @param {Array} stack - stack
      * @param {String} - memory
      * @return {Object} - decoded value
      */
    decodeFromStack(stackDepth: any, stack: any, memory: any, storageResolver: any, calldata: any, cursor: any, variableDetails?: any): Promise<{
        value: any;
        type: any;
    }>;
    /**
      * decode the type with the @arg offset location from the memory
      *
      * @param {Int} stackDepth - position of the type in the stack
      * @return {String} - memory
      * @return {Object} - decoded value
      */
    decodeFromMemory(offset: any, memory: any): {
        value: void;
        type: any;
    };
}
