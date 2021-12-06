/**
  * Basically one instance is created for one debugging session.
  * (TODO: one instance need to be shared over all the components)
  */
export declare class StorageResolver {
    storageByAddress: any;
    preimagesMappingByAddress: any;
    maxSize: any;
    web3: any;
    zeroSlot: any;
    constructor(options: any);
    /**
     * returns the storage for the given context (address and vm trace index)
     * returns the range 0x0 => this.maxSize
     *
     * @param {Object} - tx - transaction
     * @param {Int} - stepIndex - Index of the stop in the vm trace
     * @param {String} - address - lookup address
     * @param {Function} - callback - contains a map: [hashedKey] = {key, hashedKey, value}
     */
    storageRange(tx: any, stepIndex: any, address: any): Promise<any>;
    /**
     * compute the mappgings type locations for the current address (cached for a debugging session)
     * note: that only retrieve the first 100 items.
     *
     * @param {Object} tx
     * @param {Int} stepIndex
     * @param {Object} address  - storage
     * @param {Array} corrections - used in case the calculated sha3 has been modifyed before SSTORE (notably used for struct in mapping).
     * @return {Function} - callback
     */
    initialPreimagesMappings(tx: any, stepIndex: any, address: any, corrections: any): Promise<any>;
    /**
     * return a slot value for the given context (address and vm trace index)
     *
     * @param {String} - slot - slot key
     * @param {Object} - tx - transaction
     * @param {Int} - stepIndex - Index of the stop in the vm trace
     * @param {String} - address - lookup address
     * @param {Function} - callback - {key, hashedKey, value} -
     */
    storageSlot(slot: any, tx: any, stepIndex: any, address: any): Promise<any>;
    /**
     * return True if the storage at @arg address is complete
     *
     * @param {String} address  - contract address
     * @return {Bool} - return True if the storage at @arg address is complete
     */
    isComplete(address: any): any;
    /**
     * retrieve the storage and ensure at least @arg slot is cached.
     * - If @arg slot is already cached, the storage will be returned from the cache
     *   even if the next 1000 items are not in the cache.
     * - If @arg slot is not cached, the corresponding value will be resolved and the next 1000 slots.
     */
    storageRangeInternal(self: any, slotKey: any, tx: any, stepIndex: any, address: any): Promise<any>;
    /**
     * retrieve the storage from the cache. if @arg slot is defined, return only the desired slot, if not return the entire known storage
     *
     * @param {String} address  - contract address
     * @return {String} - either the entire known storage or a single value
     */
    fromCache(self: any, address: any): any;
    /**
     * store the result of `storageRangeAtInternal`
     *
     * @param {String} address  - contract address
     * @param {Object} storage  - result of `storageRangeAtInternal`, contains {key, hashedKey, value}
     */
    toCache(self: any, address: any, storage: any): void;
    storageRangeWeb3Call(tx: any, address: any, start: any, maxSize: any): Promise<Array<unknown>>;
}
