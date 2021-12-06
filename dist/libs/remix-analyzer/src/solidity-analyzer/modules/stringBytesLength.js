"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const categories_1 = (0, tslib_1.__importDefault)(require("./categories"));
const algorithmCategories_1 = (0, tslib_1.__importDefault)(require("./algorithmCategories"));
const staticAnalysisCommon_1 = require("./staticAnalysisCommon");
class stringBytesLength {
    constructor() {
        this.name = 'String length: ';
        this.description = 'Bytes length != String length';
        this.category = categories_1.default.MISC;
        this.algorithm = algorithmCategories_1.default.EXACT;
        this.version = {
            start: '0.4.12'
        };
        this.stringToBytesConversions = [];
        this.bytesLengthChecks = [];
    }
    visit(node) {
        if (node.nodeType === 'FunctionCall' && (0, staticAnalysisCommon_1.isStringToBytesConversion)(node))
            this.stringToBytesConversions.push(node);
        else if (node.nodeType === 'MemberAccess' && (0, staticAnalysisCommon_1.isBytesLengthCheck)(node))
            this.bytesLengthChecks.push(node);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    report(compilationResults) {
        const version = (0, staticAnalysisCommon_1.getCompilerVersion)(compilationResults.contracts);
        if (this.stringToBytesConversions.length > 0 && this.bytesLengthChecks.length > 0) {
            return [{
                    warning: '"bytes" and "string" lengths are not the same since strings are assumed to be UTF-8 encoded (according to the ABI defintion) therefore one character is not nessesarily encoded in one byte of data.',
                    location: this.bytesLengthChecks[0].src,
                    more: `https://solidity.readthedocs.io/en/${version}/abi-spec.html#argument-encoding`
                }];
        }
        else {
            return [];
        }
    }
}
exports.default = stringBytesLength;
//# sourceMappingURL=stringBytesLength.js.map