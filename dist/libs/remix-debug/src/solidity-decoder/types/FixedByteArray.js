'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedByteArray = void 0;
const ValueType_1 = require("./ValueType");
class FixedByteArray extends ValueType_1.ValueType {
    constructor(storageBytes) {
        super(1, storageBytes, 'bytes' + storageBytes);
    }
    decodeValue(value) {
        return '0x' + value.substr(0, 2 * this.storageBytes).toUpperCase();
    }
}
exports.FixedByteArray = FixedByteArray;
//# sourceMappingURL=FixedByteArray.js.map