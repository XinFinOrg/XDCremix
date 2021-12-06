'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeResolver = void 0;
const tslib_1 = require("tslib");
const codeUtils_1 = require("./codeUtils");
class CodeResolver {
    constructor({ getCode, fork }) {
        this.getCode = getCode;
        this.bytecodeByAddress = {}; // bytes code by contract addesses
        this.instructionsByAddress = {}; // assembly items instructions list by contract addesses
        this.instructionsIndexByBytesOffset = {}; // mapping between bytes offset and instructions index.
        this.fork = fork;
    }
    clear() {
        this.bytecodeByAddress = {};
        this.instructionsByAddress = {};
        this.instructionsIndexByBytesOffset = {};
    }
    resolveCode(address) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const cache = this.getExecutingCodeFromCache(address);
            if (cache) {
                return cache;
            }
            const code = yield this.getCode(address);
            return this.cacheExecutingCode(address, code);
        });
    }
    cacheExecutingCode(address, hexCode) {
        const codes = this.formatCode(hexCode);
        this.bytecodeByAddress[address] = hexCode;
        this.instructionsByAddress[address] = codes.code;
        this.instructionsIndexByBytesOffset[address] = codes.instructionsIndexByBytesOffset;
        return this.getExecutingCodeFromCache(address);
    }
    formatCode(hexCode) {
        const [code, instructionsIndexByBytesOffset] = (0, codeUtils_1.nameOpCodes)(Buffer.from(hexCode.substring(2), 'hex'), this.fork);
        return { code, instructionsIndexByBytesOffset };
    }
    getExecutingCodeFromCache(address) {
        if (!this.instructionsByAddress[address]) {
            return null;
        }
        return {
            instructions: this.instructionsByAddress[address],
            instructionsIndexByBytesOffset: this.instructionsIndexByBytesOffset[address],
            bytecode: this.bytecodeByAddress[address]
        };
    }
    getInstructionIndex(address, pc) {
        return this.getExecutingCodeFromCache(address).instructionsIndexByBytesOffset[pc];
    }
}
exports.CodeResolver = CodeResolver;
//# sourceMappingURL=codeResolver.js.map