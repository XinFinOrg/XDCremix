'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayType = void 0;
const tslib_1 = require("tslib");
const util_1 = require("./util");
const remix_lib_1 = require("@remix-project/remix-lib");
const ethereumjs_util_1 = require("ethereumjs-util");
const RefType_1 = require("./RefType");
const sha3256 = remix_lib_1.util.sha3_256;
class ArrayType extends RefType_1.RefType {
    constructor(underlyingType, arraySize, location) {
        let storageSlots = null;
        if (arraySize === 'dynamic') {
            storageSlots = 1;
        }
        else {
            if (underlyingType.storageBytes < 32) {
                const itemPerSlot = Math.floor(32 / underlyingType.storageBytes);
                storageSlots = Math.ceil(arraySize / itemPerSlot);
            }
            else {
                storageSlots = arraySize * underlyingType.storageSlots;
            }
        }
        const size = arraySize !== 'dynamic' ? arraySize : '';
        super(storageSlots, 32, underlyingType.typeName + '[' + size + ']', location);
        this.underlyingType = underlyingType;
        this.arraySize = arraySize;
    }
    decodeFromStorage(location, storageResolver) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const ret = [];
            let size = null;
            let slotValue;
            try {
                slotValue = yield (0, util_1.extractHexValue)(location, storageResolver, this.storageBytes);
            }
            catch (e) {
                console.log(e);
                return {
                    error: '<decoding failed - ' + e.message + '>',
                    type: this.typeName
                };
            }
            const currentLocation = {
                offset: 0,
                slot: location.slot
            };
            if (this.arraySize === 'dynamic') {
                size = (0, util_1.toBN)('0x' + slotValue);
                currentLocation.slot = sha3256(location.slot);
            }
            else {
                size = new ethereumjs_util_1.BN(this.arraySize);
            }
            var k = (0, util_1.toBN)(0);
            for (; k.lt(size) && k.ltn(300); k.iaddn(1)) {
                try {
                    ret.push(yield this.underlyingType.decodeFromStorage(currentLocation, storageResolver));
                }
                catch (e) {
                    return {
                        error: '<decoding failed - ' + e.message + '>',
                        type: this.typeName
                    };
                }
                if (this.underlyingType.storageSlots === 1 && location.offset + this.underlyingType.storageBytes <= 32) {
                    currentLocation.offset += this.underlyingType.storageBytes;
                    if (currentLocation.offset + this.underlyingType.storageBytes > 32) {
                        currentLocation.offset = 0;
                        currentLocation.slot = '0x' + (0, util_1.add)(currentLocation.slot, 1).toString(16);
                    }
                }
                else {
                    currentLocation.slot = '0x' + (0, util_1.add)(currentLocation.slot, this.underlyingType.storageSlots).toString(16);
                    currentLocation.offset = 0;
                }
            }
            return { value: ret, length: '0x' + size.toString(16), type: this.typeName };
        });
    }
    decodeFromMemoryInternal(offset, memory, skip) {
        const ret = [];
        let length = this.arraySize;
        if (this.arraySize === 'dynamic') {
            length = memory.substr(2 * offset, 64);
            length = parseInt(length, 16);
            offset = offset + 32;
        }
        if (isNaN(length)) {
            return {
                error: '<decoding failed - length is NaN>',
                type: 'Error'
            };
        }
        if (!skip)
            skip = 0;
        if (skip)
            offset = offset + (32 * skip);
        let limit = length - skip;
        if (limit > 10)
            limit = 10;
        for (var k = 0; k < limit; k++) {
            var contentOffset = offset;
            ret.push(this.underlyingType.decodeFromMemory(contentOffset, memory));
            offset += 32;
        }
        return {
            value: ret,
            length: '0x' + length.toString(16),
            type: this.typeName,
            cursor: skip + limit,
            hasNext: length > (skip + limit)
        };
    }
}
exports.ArrayType = ArrayType;
//# sourceMappingURL=ArrayType.js.map