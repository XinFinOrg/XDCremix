"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const categories_1 = (0, tslib_1.__importDefault)(require("./categories"));
const staticAnalysisCommon_1 = require("./staticAnalysisCommon");
const algorithmCategories_1 = (0, tslib_1.__importDefault)(require("./algorithmCategories"));
class intDivisionTruncate {
    constructor() {
        this.warningNodes = [];
        this.name = 'Data truncated: ';
        this.description = 'Division on int/uint values truncates the result';
        this.category = categories_1.default.MISC;
        this.algorithm = algorithmCategories_1.default.EXACT;
        this.version = {
            start: '0.4.12'
        };
    }
    visit(node) {
        if ((0, staticAnalysisCommon_1.isIntDivision)(node))
            this.warningNodes.push(node);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    report(compilationResults) {
        return this.warningNodes.map((item) => {
            return {
                warning: 'Division of integer values yields an integer value again. That means e.g. 10 / 100 = 0 instead of 0.1 since the result is an integer again. This does not hold for division of (only) literal values since those yield rational constants.',
                location: item.src
            };
        });
    }
}
exports.default = intDivisionTruncate;
//# sourceMappingURL=intDivisionTruncate.js.map