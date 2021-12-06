'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Int = void 0;
const util_1 = require("./util");
const ValueType_1 = require("./ValueType");
class Int extends ValueType_1.ValueType {
    constructor(storageBytes) {
        super(1, storageBytes, 'int' + storageBytes * 8);
    }
    decodeValue(value) {
        value = (0, util_1.extractHexByteSlice)(value, this.storageBytes, 0);
        return (0, util_1.decodeIntFromHex)(value, this.storageBytes, true);
    }
}
exports.Int = Int;
//# sourceMappingURL=Int.js.map