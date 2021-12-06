'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageResolver = void 0;
const tslib_1 = require("tslib");
const traceHelper_1 = require("../trace/traceHelper");
const mappingPreimages_1 = require("./mappingPreimages");
/**
  * Basically one instance is created for one debugging session.
  * (TODO: one instance need to be shared over all the components)
  */
class StorageResolver {
    constructor(options) {
        this.storageByAddress = {};
        this.preimagesMappingByAddress = {};
        this.maxSize = 100;
        this.web3 = options.web3;
        this.zeroSlot = '0x0000000000000000000000000000000000000000000000000000000000000000';
    }
    /**
     * returns the storage for the given context (address and vm trace index)
     * returns the range 0x0 => this.maxSize
     *
     * @param {Object} - tx - transaction
     * @param {Int} - stepIndex - Index of the stop in the vm trace
     * @param {String} - address - lookup address
     * @param {Function} - callback - contains a map: [hashedKey] = {key, hashedKey, value}
     */
    storageRange(tx, stepIndex, address) {
        return this.storageRangeInternal(this, this.zeroSlot, tx, stepIndex, address);
    }
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
    initialPreimagesMappings(tx, stepIndex, address, corrections) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (this.preimagesMappingByAddress[address]) {
                return this.preimagesMappingByAddress[address];
            }
            const storage = yield this.storageRange(tx, stepIndex, address);
            const mappings = (0, mappingPreimages_1.decodeMappingsKeys)(this.web3, storage, corrections);
            this.preimagesMappingByAddress[address] = mappings;
            return mappings;
        });
    }
    /**
     * return a slot value for the given context (address and vm trace index)
     *
     * @param {String} - slot - slot key
     * @param {Object} - tx - transaction
     * @param {Int} - stepIndex - Index of the stop in the vm trace
     * @param {String} - address - lookup address
     * @param {Function} - callback - {key, hashedKey, value} -
     */
    storageSlot(slot, tx, stepIndex, address) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const storage = yield this.storageRangeInternal(this, slot, tx, stepIndex, address);
            return (storage[slot] !== undefined ? storage[slot] : null);
        });
    }
    /**
     * return True if the storage at @arg address is complete
     *
     * @param {String} address  - contract address
     * @return {Bool} - return True if the storage at @arg address is complete
     */
    isComplete(address) {
        return this.storageByAddress[address] && this.storageByAddress[address].complete;
    }
    /**
     * retrieve the storage and ensure at least @arg slot is cached.
     * - If @arg slot is already cached, the storage will be returned from the cache
     *   even if the next 1000 items are not in the cache.
     * - If @arg slot is not cached, the corresponding value will be resolved and the next 1000 slots.
     */
    storageRangeInternal(self, slotKey, tx, stepIndex, address) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            var cached = this.fromCache(self, address);
            if (cached && cached.storage[slotKey]) { // we have the current slot in the cache and maybe the next 1000...
                return cached.storage;
            }
            const result = yield this.storageRangeWeb3Call(tx, address, slotKey, self.maxSize);
            const [storage, nextKey] = result;
            if (!storage[slotKey] && slotKey !== self.zeroSlot) { // we don't cache the zero slot (could lead to inconsistency)
                storage[slotKey] = { key: slotKey, value: self.zeroSlot };
            }
            self.toCache(self, address, storage);
            if (slotKey === self.zeroSlot && !nextKey) { // only working if keys are sorted !!
                self.storageByAddress[address].complete = true;
            }
            return storage;
        });
    }
    /**
     * retrieve the storage from the cache. if @arg slot is defined, return only the desired slot, if not return the entire known storage
     *
     * @param {String} address  - contract address
     * @return {String} - either the entire known storage or a single value
     */
    fromCache(self, address) {
        if (!self.storageByAddress[address]) {
            return null;
        }
        return self.storageByAddress[address];
    }
    /**
     * store the result of `storageRangeAtInternal`
     *
     * @param {String} address  - contract address
     * @param {Object} storage  - result of `storageRangeAtInternal`, contains {key, hashedKey, value}
     */
    toCache(self, address, storage) {
        if (!self.storageByAddress[address]) {
            self.storageByAddress[address] = {};
        }
        self.storageByAddress[address].storage = Object.assign(self.storageByAddress[address].storage || {}, storage);
    }
    storageRangeWeb3Call(tx, address, start, maxSize) {
        return new Promise((resolve, reject) => {
            if ((0, traceHelper_1.isContractCreation)(address)) {
                resolve([{}, null]);
            }
            else {
                this.web3.debug.storageRangeAt(tx.blockHash, tx.hash, address, start, maxSize, (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    else if (result.storage) {
                        resolve([result.storage, result.nextKey]);
                    }
                    else {
                        reject(new Error('the storage has not been provided'));
                    }
                });
            }
        });
    }
}
exports.StorageResolver = StorageResolver;
//# sourceMappingURL=storageResolver.js.map