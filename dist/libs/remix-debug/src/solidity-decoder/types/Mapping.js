'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mapping = void 0;
const tslib_1 = require("tslib");
const RefType_1 = require("./RefType");
const util_1 = require("./util");
const ethereumjs_util_1 = require("ethereumjs-util");
class Mapping extends RefType_1.RefType {
    constructor(underlyingTypes, location, fullType) {
        super(1, 32, fullType, 'storage');
        this.keyType = underlyingTypes.keyType;
        this.valueType = underlyingTypes.valueType;
        this.initialDecodedState = null;
    }
    decodeFromStorage(location, storageResolver) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const corrections = this.valueType.members ? this.valueType.members.map((value) => { return value.storagelocation; }) : [];
            if (!this.initialDecodedState) { // cache the decoded initial storage
                let mappingsInitialPreimages;
                try {
                    mappingsInitialPreimages = yield storageResolver.initialMappingsLocation(corrections);
                    this.initialDecodedState = yield this.decodeMappingsLocation(mappingsInitialPreimages, location, storageResolver);
                }
                catch (e) {
                    return {
                        value: e.message,
                        type: this.typeName
                    };
                }
            }
            const mappingPreimages = yield storageResolver.mappingsLocation(corrections);
            let ret = yield this.decodeMappingsLocation(mappingPreimages, location, storageResolver); // fetch mapping storage changes
            ret = Object.assign({}, this.initialDecodedState, ret); // merge changes
            return { value: ret, type: this.typeName };
        });
    }
    decodeFromMemoryInternal(offset, memory) {
        // mappings can only exist in storage and not in memory
        // so this should never be called
        return { value: '', length: '0x0', type: this.typeName };
    }
    decodeMappingsLocation(preimages, location, storageResolver) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const mapSlot = (0, util_1.normalizeHex)((0, ethereumjs_util_1.bufferToHex)(location.slot));
            if (!preimages[mapSlot]) {
                return {};
            }
            const ret = {};
            for (const i in preimages[mapSlot]) {
                const mapLocation = getMappingLocation(i, location.slot);
                const globalLocation = {
                    offset: location.offset,
                    slot: mapLocation
                };
                ret[i] = yield this.valueType.decodeFromStorage(globalLocation, storageResolver);
            }
            return ret;
        });
    }
}
exports.Mapping = Mapping;
function getMappingLocation(key, position) {
    // mapping storage location decribed at http://solidity.readthedocs.io/en/develop/miscellaneous.html#layout-of-state-variables-in-storage
    // > the value corresponding to a mapping key k is located at keccak256(k . p) where . is concatenation.
    // key should be a hex string, and position an int
    const mappingK = (0, ethereumjs_util_1.toBuffer)((0, ethereumjs_util_1.addHexPrefix)(key));
    let mappingP = (0, ethereumjs_util_1.toBuffer)((0, ethereumjs_util_1.addHexPrefix)(position));
    mappingP = (0, ethereumjs_util_1.setLengthLeft)(mappingP, 32);
    const mappingKeyBuf = concatTypedArrays(mappingK, mappingP);
    const mappingStorageLocation = (0, ethereumjs_util_1.keccak)(mappingKeyBuf);
    const mappingStorageLocationinBn = new ethereumjs_util_1.BN(mappingStorageLocation, 16);
    return mappingStorageLocationinBn;
}
function concatTypedArrays(a, b) {
    const c = new (a.constructor)(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
}
//# sourceMappingURL=Mapping.js.map