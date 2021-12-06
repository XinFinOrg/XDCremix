'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueType = void 0;
const tslib_1 = require("tslib");
const util_1 = require("./util");
class ValueType {
    constructor(storageSlots, storageBytes, typeName) {
        this.storageSlots = storageSlots;
        this.storageBytes = storageBytes;
        this.typeName = typeName;
        this.basicType = 'ValueType';
    }
    decodeValue(input) {
        throw new Error('This method is abstract');
    }
    /**
      * decode the type with the @arg location from the storage
      *
      * @param {Object} location - containing offset and slot
      * @param {Object} storageResolver  - resolve storage queries
      * @return {Object} - decoded value
      */
    decodeFromStorage(location, storageResolver) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            try {
                var value = yield (0, util_1.extractHexValue)(location, storageResolver, this.storageBytes);
                return { value: this.decodeValue(value), type: this.typeName };
            }
            catch (e) {
                console.log(e);
                return { error: '<decoding failed - ' + e.message + '>', type: this.typeName };
            }
        });
    }
    /**
      * decode the type from the stack
      *
      * @param {Int} stackDepth - position of the type in the stack
      * @param {Array} stack - stack
      * @param {String} - memory
      * @return {Object} - decoded value
      */
    decodeFromStack(stackDepth, stack, memory, storageResolver, calldata, cursor, variableDetails) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let value;
            if (stackDepth >= stack.length) {
                value = this.decodeValue('');
            }
            else {
                value = this.decodeValue(stack[stack.length - 1 - stackDepth].replace('0x', ''));
            }
            return { value, type: this.typeName };
        });
    }
    /**
      * decode the type with the @arg offset location from the memory
      *
      * @param {Int} stackDepth - position of the type in the stack
      * @return {String} - memory
      * @return {Object} - decoded value
      */
    decodeFromMemory(offset, memory) {
        const value = memory.substr(2 * offset, 64);
        return { value: this.decodeValue(value), type: this.typeName };
    }
}
exports.ValueType = ValueType;
//# sourceMappingURL=ValueType.js.map