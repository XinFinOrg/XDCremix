"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const categories_1 = (0, tslib_1.__importDefault)(require("./categories"));
const algorithmCategories_1 = (0, tslib_1.__importDefault)(require("./algorithmCategories"));
const staticAnalysisCommon_1 = require("./staticAnalysisCommon");
class gasCosts {
    constructor() {
        this.name = 'Gas costs: ';
        this.description = 'Too high gas requirement of functions';
        this.category = categories_1.default.GAS;
        this.algorithm = algorithmCategories_1.default.EXACT;
        this.version = {
            start: '0.4.12'
        };
        this.warningNodes = [];
    }
    visit(node) {
        if ((node.nodeType === 'FunctionDefinition' && node.kind !== 'constructor' && node.implemented) ||
            (node.nodeType === 'VariableDeclaration' && (0, staticAnalysisCommon_1.isVariableTurnedIntoGetter)(node))) {
            this.warningNodes.push(node);
        }
    }
    report(compilationResults) {
        const report = [];
        const methodsWithSignature = this.warningNodes.map(node => {
            let signature;
            if (node.nodeType === 'FunctionDefinition') {
                const functionName = (0, staticAnalysisCommon_1.getFunctionDefinitionName)(node);
                signature = staticAnalysisCommon_1.helpers.buildAbiSignature(functionName, (0, staticAnalysisCommon_1.getMethodParamsSplittedTypeDesc)(node, compilationResults.contracts));
            }
            else {
                signature = node.name + '()';
            }
            return {
                name: node.name,
                src: node.src,
                signature: signature
            };
        });
        for (const method of methodsWithSignature) {
            for (const filename in compilationResults.contracts) {
                for (const contractName in compilationResults.contracts[filename]) {
                    const contract = compilationResults.contracts[filename][contractName];
                    const methodGas = this.checkMethodGas(contract, method.signature);
                    if (methodGas && methodGas.isInfinite) {
                        if (methodGas.isFallback) {
                            report.push({
                                warning: `Fallback function of contract ${contractName} requires too much gas (${methodGas.msg}). 
                If the fallback function requires more than 2300 gas, the contract cannot receive Ether.`,
                                location: method.src
                            });
                        }
                        else {
                            report.push({
                                warning: `Gas requirement of function ${contractName}.${method.name} ${methodGas.msg}: 
                If the gas requirement of a function is higher than the block gas limit, it cannot be executed.
                Please avoid loops in your functions or actions that modify large areas of storage
                (this includes clearing or copying arrays in storage)`,
                                location: method.src
                            });
                        }
                    }
                    else
                        continue;
                }
            }
        }
        return report;
    }
    checkMethodGas(contract, methodSignature) {
        if (contract.evm && contract.evm.gasEstimates && contract.evm.gasEstimates.external) {
            if (methodSignature === '()') {
                const fallback = contract.evm.gasEstimates.external[''];
                if (fallback !== undefined && (fallback === null || parseInt(fallback) >= 2100 || fallback === 'infinite')) {
                    return {
                        isInfinite: true,
                        isFallback: true,
                        msg: fallback
                    };
                }
            }
            else {
                const gas = contract.evm.gasEstimates.external[methodSignature];
                const gasString = gas === null ? 'unknown or not constant' : 'is ' + gas;
                if (gas === null || parseInt(gas) >= 3000000 || gas === 'infinite') {
                    return {
                        isInfinite: true,
                        isFallback: false,
                        msg: gasString
                    };
                }
            }
        }
    }
}
exports.default = gasCosts;
//# sourceMappingURL=gasCosts.js.map