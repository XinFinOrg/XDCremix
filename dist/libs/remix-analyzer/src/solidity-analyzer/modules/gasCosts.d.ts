import { ModuleAlgorithm, ModuleCategory, ReportObj, CompilationResult, AnalyzerModule, FunctionDefinitionAstNode, VariableDeclarationAstNode, SupportedVersion } from './../../types';
export default class gasCosts implements AnalyzerModule {
    name: string;
    description: string;
    category: ModuleCategory;
    algorithm: ModuleAlgorithm;
    version: SupportedVersion;
    warningNodes: any[];
    visit(node: FunctionDefinitionAstNode | VariableDeclarationAstNode): void;
    report(compilationResults: CompilationResult): ReportObj[];
    private checkMethodGas;
}
