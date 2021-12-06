"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const categories_1 = (0, tslib_1.__importDefault)(require("./categories"));
const staticAnalysisCommon_1 = require("./staticAnalysisCommon");
const algorithmCategories_1 = (0, tslib_1.__importDefault)(require("./algorithmCategories"));
const abstractAstView_1 = (0, tslib_1.__importDefault)(require("./abstractAstView"));
class erc20Decimals {
    constructor() {
        this.name = 'ERC20: ';
        this.description = '\'decimals\' should be \'uint8\'';
        this.category = categories_1.default.ERC;
        this.algorithm = algorithmCategories_1.default.EXACT;
        this.version = {
            start: '0.4.12'
        };
        this.abstractAst = new abstractAstView_1.default();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.visit = this.abstractAst.build_visit((node) => false);
        this.report = this.abstractAst.build_report(this._report.bind(this));
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _report(contracts, multipleContractsWithSameName) {
        const warnings = [];
        contracts.forEach((contract) => {
            const contractAbiSignatures = contract.functions.map((f) => staticAnalysisCommon_1.helpers.buildAbiSignature((0, staticAnalysisCommon_1.getFunctionDefinitionName)(f.node), f.parameters));
            if (this.isERC20(contractAbiSignatures)) {
                const decimalsVar = contract.stateVariables.filter((stateVar) => (0, staticAnalysisCommon_1.getDeclaredVariableName)(stateVar) === 'decimals' && ((0, staticAnalysisCommon_1.getDeclaredVariableType)(stateVar) !== 'uint8' || stateVar.visibility !== 'public'));
                const decimalsFun = contract.functions.filter((f) => (0, staticAnalysisCommon_1.getFunctionDefinitionName)(f.node) === 'decimals' &&
                    ((f.returns.length === 0 || f.returns.length > 1) ||
                        (f.returns.length === 1 && (f.returns[0].type !== 'uint8' || f.node.visibility !== 'public'))));
                if (decimalsVar.length > 0) {
                    for (const node of decimalsVar) {
                        warnings.push({
                            warning: 'ERC20 contract\'s "decimals" variable should be "uint8" type',
                            location: node.src,
                            more: 'https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md#decimals'
                        });
                    }
                }
                else if (decimalsFun.length > 0) {
                    for (const fn of decimalsFun) {
                        warnings.push({
                            warning: 'ERC20 contract\'s "decimals" function should have "uint8" as return type',
                            location: fn.node.src,
                            more: 'https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md#decimals'
                        });
                    }
                }
            }
        });
        return warnings;
    }
    isERC20(funSignatures) {
        return funSignatures.includes('totalSupply()') &&
            funSignatures.includes('balanceOf(address)') &&
            funSignatures.includes('transfer(address,uint256)') &&
            funSignatures.includes('transferFrom(address,address,uint256)') &&
            funSignatures.includes('approve(address,uint256)') &&
            funSignatures.includes('allowance(address,address)');
    }
}
exports.default = erc20Decimals;
//# sourceMappingURL=erc20Decimals.js.map