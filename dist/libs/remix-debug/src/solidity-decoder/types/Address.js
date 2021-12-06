'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const util_1 = require("./util");
const ValueType_1 = require("./ValueType");
class Address extends ValueType_1.ValueType {
    constructor() {
        super(1, 20, 'address');
    }
    decodeValue(value) {
        if (!value) {
            return '0x0000000000000000000000000000000000000000';
        }
        return '0x' + (0, util_1.extractHexByteSlice)(value, this.storageBytes, 0).toUpperCase();
    }
}
exports.Address = Address;
//# sourceMappingURL=Address.js.map