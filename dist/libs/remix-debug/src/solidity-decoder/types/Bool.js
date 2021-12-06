'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bool = void 0;
const ValueType_1 = require("./ValueType");
const util_1 = require("./util");
class Bool extends ValueType_1.ValueType {
    constructor() {
        super(1, 1, 'bool');
    }
    decodeValue(value) {
        if (!value) {
            return false;
        }
        value = (0, util_1.extractHexByteSlice)(value, this.storageBytes, 0);
        return value !== '00';
    }
}
exports.Bool = Bool;
//# sourceMappingURL=Bool.js.map