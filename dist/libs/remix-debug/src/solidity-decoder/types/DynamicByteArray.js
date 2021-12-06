'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicByteArray = void 0;
const tslib_1 = require("tslib");
const util_1 = require("./util");
const remix_lib_1 = require("@remix-project/remix-lib");
const ethereumjs_util_1 = require("ethereumjs-util");
const RefType_1 = require("./RefType");
const sha3256 = remix_lib_1.util.sha3_256;
class DynamicByteArray extends RefType_1.RefType {
    constructor(location) {
        super(1, 32, 'bytes', location);
    }
    decodeFromStorage(location, storageResolver) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let value = '0x0';
            try {
                value = yield (0, util_1.extractHexValue)(location, storageResolver, this.storageBytes);
            }
            catch (e) {
                console.log(e);
                return { error: '<decoding failed - ' + e.message + '>', type: this.typeName };
            }
            const length = new ethereumjs_util_1.BN(value, 16);
            if (length.testn(0)) {
                let dataPos = new ethereumjs_util_1.BN(sha3256(location.slot).replace('0x', ''), 16);
                let ret = '';
                let currentSlot = '0x';
                try {
                    currentSlot = yield (0, util_1.readFromStorage)(dataPos, storageResolver);
                }
                catch (e) {
                    console.log(e);
                    return { error: '<decoding failed - ' + e.message + '>', type: this.typeName };
                }
                while (length.gt(new ethereumjs_util_1.BN(ret.length)) && ret.length < 32000) {
                    currentSlot = currentSlot.replace('0x', '');
                    ret += currentSlot;
                    dataPos = dataPos.add(new ethereumjs_util_1.BN(1));
                    try {
                        currentSlot = yield (0, util_1.readFromStorage)(dataPos, storageResolver);
                    }
                    catch (e) {
                        console.log(e);
                        return { error: '<decoding failed - ' + e.message + '>', type: this.typeName };
                    }
                }
                return { value: '0x' + ret.replace(/(00)+$/, ''), length: '0x' + length.toString(16), type: this.typeName };
            }
            else {
                var size = parseInt(value.substr(value.length - 2, 2), 16) / 2;
                return { value: '0x' + value.substr(0, size * 2), length: '0x' + size.toString(16), type: this.typeName };
            }
        });
    }
    decodeFromMemoryInternal(offset, memory) {
        offset = 2 * offset;
        let length = memory.substr(offset, 64);
        length = 2 * parseInt(length, 16);
        return { length: '0x' + length.toString(16), value: '0x' + memory.substr(offset + 64, length), type: this.typeName };
    }
}
exports.DynamicByteArray = DynamicByteArray;
//# sourceMappingURL=DynamicByteArray.js.map