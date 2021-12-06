'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefType = void 0;
const tslib_1 = require("tslib");
const ethers_1 = require("ethers");
const util_1 = require("./util");
class RefType {
    constructor(storageSlots, storageBytes, typeName, location) {
        this.location = location;
        this.storageSlots = storageSlots;
        this.storageBytes = storageBytes;
        this.typeName = typeName;
        this.basicType = 'RefType';
    }
    decodeFromStorage(input1, input2) {
        throw new Error('This method is abstract');
    }
    decodeFromMemoryInternal(input1, input2, input3) {
        throw new Error('This method is abstract');
    }
    /**
      * decode the type from the stack
      *
      * @param {Int} stackDepth - position of the type in the stack
      * @param {Array} stack - stack
      * @param {String} - memory
      * @param {Object} - storageResolver
      * @return {Object} decoded value
      */
    decodeFromStack(stackDepth, stack, memory, storageResolver, calldata, cursor, variableDetails) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (stack.length - 1 < stackDepth) {
                return { error: '<decoding failed - stack underflow ' + stackDepth + '>', type: this.typeName };
            }
            let offset = stack[stack.length - 1 - stackDepth];
            if (this.isInStorage()) {
                offset = (0, util_1.toBN)(offset);
                try {
                    return yield this.decodeFromStorage({ offset: 0, slot: offset }, storageResolver);
                }
                catch (e) {
                    console.log(e);
                    return { error: '<decoding failed - ' + e.message + '>', type: this.typeName };
                }
            }
            else if (this.isInMemory()) {
                offset = parseInt(offset, 16);
                return this.decodeFromMemoryInternal(offset, memory, cursor);
            }
            else if (this.isInCallData()) {
                return this._decodeFromCallData(variableDetails, calldata);
            }
            else {
                return { error: '<decoding failed - no decoder for ' + this.location + '>', type: this.typeName };
            }
        });
    }
    _decodeFromCallData(variableDetails, calldata) {
        calldata = calldata.length > 0 ? calldata[0] : '0x';
        const ethersAbi = new ethers_1.ethers.utils.Interface(variableDetails.abi);
        const fnSign = calldata.substr(0, 10);
        const decodedData = ethersAbi.decodeFunctionData(ethersAbi.getFunction(fnSign), calldata);
        const decodedValue = decodedData[variableDetails.name];
        const isArray = Array.isArray(decodedValue);
        if (isArray) {
            return this._decodeCallDataArray(decodedValue, this);
        }
        return {
            length: isArray ? '0x' + decodedValue.length.toString(16) : undefined,
            value: decodedValue,
            type: this.typeName
        };
    }
    _decodeCallDataArray(value, type) {
        const isArray = Array.isArray(value);
        if (isArray) {
            value = value.map((el) => {
                return this._decodeCallDataArray(el, this.underlyingType);
            });
            return {
                length: value.length.toString(16),
                value: value,
                type: type.typeName
            };
        }
        else {
            return {
                value: value.toString(),
                type: (type.underlyingType && type.underlyingType.typeName) || type.typeName
            };
        }
    }
    /**
      * decode the type from the memory
      *
      * @param {Int} offset - position of the ref of the type in memory
      * @param {String} memory - memory
      * @return {Object} decoded value
      */
    decodeFromMemory(offset, memory) {
        offset = memory.substr(2 * offset, 64);
        offset = parseInt(offset, 16);
        return this.decodeFromMemoryInternal(offset, memory);
    }
    /**
      * current type defined in storage
      *
      * @return {Bool} - return true if the type is defined in the storage
      */
    isInStorage() {
        return this.location.indexOf('storage') === 0;
    }
    /**
      * current type defined in memory
      *
      * @return {Bool} - return true if the type is defined in the memory
      */
    isInMemory() {
        return this.location.indexOf('memory') === 0;
    }
    /**
      * current type defined in storage
      *
      * @return {Bool} - return true if the type is defined in the storage
      */
    isInCallData() {
        return this.location.indexOf('calldata') === 0;
    }
}
exports.RefType = RefType;
//# sourceMappingURL=RefType.js.map