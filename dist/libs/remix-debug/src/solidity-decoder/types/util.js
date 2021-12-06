'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeHex = exports.extractLocationFromAstVariable = exports.extractLocation = exports.removeLocation = exports.sub = exports.add = exports.toBN = exports.extractHexValue = exports.extractHexByteSlice = exports.readFromStorage = exports.decodeIntFromHex = void 0;
const tslib_1 = require("tslib");
const ethereumjs_util_1 = require("ethereumjs-util");
function decodeIntFromHex(value, byteLength, signed) {
    let bigNumber = new ethereumjs_util_1.BN(value, 16);
    if (signed) {
        bigNumber = bigNumber.fromTwos(8 * byteLength);
    }
    return bigNumber.toString(10);
}
exports.decodeIntFromHex = decodeIntFromHex;
function readFromStorage(slot, storageResolver) {
    const hexSlot = '0x' + normalizeHex((0, ethereumjs_util_1.bufferToHex)(slot));
    return new Promise((resolve, reject) => {
        storageResolver.storageSlot(hexSlot, (error, slot) => {
            if (error) {
                return reject(error);
            }
            if (!slot) {
                slot = { key: slot, value: '' };
            }
            return resolve(normalizeHex(slot.value));
        });
    });
}
exports.readFromStorage = readFromStorage;
/**
 * @returns a hex encoded byte slice of length @arg byteLength from inside @arg slotValue.
 *
 * @param {String} slotValue  - hex encoded value to extract the byte slice from
 * @param {Int} byteLength  - Length of the byte slice to extract
 * @param {Int} offsetFromLSB  - byte distance from the right end slot value to the right end of the byte slice
 */
function extractHexByteSlice(slotValue, byteLength, offsetFromLSB) {
    const offset = slotValue.length - 2 * offsetFromLSB - 2 * byteLength;
    return slotValue.substr(offset, 2 * byteLength);
}
exports.extractHexByteSlice = extractHexByteSlice;
/**
 * @returns a hex encoded storage content at the given @arg location. it does not have Ox prefix but always has the full length.
 *
 * @param {Object} location  - object containing the slot and offset of the data to extract.
 * @param {Object} storageResolver  - storage resolver
 * @param {Int} byteLength  - Length of the byte slice to extract
 */
function extractHexValue(location, storageResolver, byteLength) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        let slotvalue;
        try {
            slotvalue = yield readFromStorage(location.slot, storageResolver);
        }
        catch (e) {
            return '';
        }
        return extractHexByteSlice(slotvalue, byteLength, location.offset);
    });
}
exports.extractHexValue = extractHexValue;
function toBN(value) {
    if (value instanceof ethereumjs_util_1.BN) {
        return value;
    }
    else if (value.match && value.match(/^(0x)?([a-f0-9]*)$/)) {
        value = (0, ethereumjs_util_1.unpadHexString)(value);
        value = new ethereumjs_util_1.BN(value === '' ? '0' : value, 16);
    }
    else if (!isNaN(value)) {
        value = new ethereumjs_util_1.BN(value);
    }
    return value;
}
exports.toBN = toBN;
function add(value1, value2) {
    return toBN(value1).add(toBN(value2));
}
exports.add = add;
function sub(value1, value2) {
    return toBN(value1).sub(toBN(value2));
}
exports.sub = sub;
function removeLocation(type) {
    return type.replace(/( storage ref| storage pointer| memory| calldata)/g, '');
}
exports.removeLocation = removeLocation;
function extractLocation(type) {
    const match = type.match(/( storage ref| storage pointer| memory| calldata)?$/);
    if (match[1] !== '') {
        return match[1].trim();
    }
    return null;
}
exports.extractLocation = extractLocation;
function extractLocationFromAstVariable(node) {
    if (node.storageLocation !== 'default') {
        return node.storageLocation;
    }
    else if (node.stateVariable) {
        return 'storage';
    }
    return 'default'; // local variables => storage, function parameters & return values => memory, state => storage
}
exports.extractLocationFromAstVariable = extractLocationFromAstVariable;
function normalizeHex(hex) {
    hex = hex.replace('0x', '');
    if (hex.length < 64) {
        return (new Array(64 - hex.length + 1).join('0')) + hex;
    }
    return hex;
}
exports.normalizeHex = normalizeHex;
//# sourceMappingURL=util.js.map