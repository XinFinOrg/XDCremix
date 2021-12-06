"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const categories_1 = (0, tslib_1.__importDefault)(require("./categories"));
const staticAnalysisCommon_1 = require("./staticAnalysisCommon");
const algorithmCategories_1 = (0, tslib_1.__importDefault)(require("./algorithmCategories"));
const abstractAstView_1 = (0, tslib_1.__importDefault)(require("./abstractAstView"));
const fast_levenshtein_1 = require("fast-levenshtein");
const remix_lib_1 = require("@remix-project/remix-lib");
const remix_astwalker_1 = require("@remix-project/remix-astwalker");
class similarVariableNames {
    constructor() {
        this.name = 'Similar variable names: ';
        this.description = 'Variable names are too similar';
        this.category = categories_1.default.MISC;
        this.algorithm = algorithmCategories_1.default.EXACT;
        this.version = {
            start: '0.4.12'
        };
        this.abstractAst = new abstractAstView_1.default();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.visit = this.abstractAst.build_visit((node) => false);
        this.report = this.abstractAst.build_report(this._report.bind(this));
    }
    _report(contracts, multipleContractsWithSameName, version) {
        const warnings = [];
        const hasModifiers = contracts.some((item) => item.modifiers.length > 0);
        contracts.forEach((contract) => {
            contract.functions.forEach((func) => {
                const funcName = (0, staticAnalysisCommon_1.getFullQuallyfiedFuncDefinitionIdent)(contract.node, func.node, func.parameters);
                let hasModifiersComments = '';
                if (hasModifiers) {
                    hasModifiersComments = 'Note: Modifiers are currently not considered by this static analysis.';
                }
                let multipleContractsWithSameNameComments = '';
                if (multipleContractsWithSameName) {
                    multipleContractsWithSameNameComments = 'Note: Import aliases are currently not supported by this static analysis.';
                }
                const vars = this.getFunctionVariables(contract, func).map(staticAnalysisCommon_1.getDeclaredVariableName);
                this.findSimilarVarNames(vars).map((sim) => {
                    // check if function is implemented
                    if (func.node.implemented) {
                        const astWalker = new remix_astwalker_1.AstWalker();
                        const functionBody = func.node.body;
                        // Walk through all statements of function
                        astWalker.walk(functionBody, (node) => {
                            // check if these is an identifier node which is one of the tracked similar variables
                            if ((node.nodeType === 'Identifier' || node.nodeType === 'VariableDeclaration') &&
                                (node.name === sim.var1 || node.name === sim.var2)) {
                                warnings.push({
                                    warning: `${funcName} : Variables have very similar names "${sim.var1}" and "${sim.var2}". ${hasModifiersComments} ${multipleContractsWithSameNameComments}`,
                                    location: node.src
                                });
                            }
                            return true;
                        });
                    }
                });
            });
        });
        return warnings;
    }
    findSimilarVarNames(vars) {
        const similar = [];
        const comb = {};
        vars.map((varName1) => vars.map((varName2) => {
            if (varName1.length > 1 && varName2.length > 1 &&
                varName2 !== varName1 && !this.isCommonPrefixedVersion(varName1, varName2) &&
                !this.isCommonNrSuffixVersion(varName1, varName2) &&
                !(comb[varName1 + ';' + varName2] || comb[varName2 + ';' + varName1])) {
                comb[varName1 + ';' + varName2] = true;
                const distance = (0, fast_levenshtein_1.get)(varName1, varName2);
                if (distance <= 2)
                    similar.push({ var1: varName1, var2: varName2, distance: distance });
            }
        }));
        return similar;
    }
    isCommonPrefixedVersion(varName1, varName2) {
        return (varName1.startsWith('_') && varName1.slice(1) === varName2) || (varName2.startsWith('_') && varName2.slice(1) === varName1);
    }
    isCommonNrSuffixVersion(varName1, varName2) {
        const ref = '^' + remix_lib_1.util.escapeRegExp(varName1.slice(0, -1)) + '[0-9]*$';
        return varName2.match(ref) != null;
    }
    getFunctionVariables(contract, func) {
        return contract.stateVariables.concat(func.localVariables);
    }
}
exports.default = similarVariableNames;
//# sourceMappingURL=similarVariableNames.js.map