'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringType = void 0;
const tslib_1 = require("tslib");
const DynamicByteArray_1 = require("./DynamicByteArray");
class StringType extends DynamicByteArray_1.DynamicByteArray {
    constructor(location) {
        super(location);
        this.typeName = 'string';
    }
    decodeFromStorage(location, storageResolver) {
        const _super = Object.create(null, {
            decodeFromStorage: { get: () => super.decodeFromStorage }
        });
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let decoded = '0x';
            try {
                decoded = yield _super.decodeFromStorage.call(this, location, storageResolver);
            }
            catch (e) {
                console.log(e);
                return { error: '<decoding failed - ' + e.message + '>' };
            }
            return format(decoded);
        });
    }
    decodeFromStack(stackDepth, stack, memory, storageResolver, calldata, cursor, variableDetails) {
        const _super = Object.create(null, {
            decodeFromStack: { get: () => super.decodeFromStack }
        });
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            try {
                return yield _super.decodeFromStack.call(this, stackDepth, stack, memory, storageResolver, calldata, cursor, variableDetails);
            }
            catch (e) {
                console.log(e);
                return { error: '<decoding failed - ' + e.message + '>' };
            }
        });
    }
    decodeFromMemoryInternal(offset, memory) {
        const decoded = super.decodeFromMemoryInternal(offset, memory);
        return format(decoded);
    }
}
exports.StringType = StringType;
function format(decoded) {
    if (decoded.error) {
        return decoded;
    }
    let value = decoded.value;
    value = value.replace('0x', '').replace(/(..)/g, '%$1');
    const ret = { length: decoded.length, raw: decoded.value, type: 'string' };
    try {
        ret['value'] = decodeURIComponent(value);
    }
    catch (e) {
        ret['error'] = 'Invalid UTF8 encoding';
        ret.raw = decoded.value;
    }
    return ret;
}
//# sourceMappingURL=StringType.js.map