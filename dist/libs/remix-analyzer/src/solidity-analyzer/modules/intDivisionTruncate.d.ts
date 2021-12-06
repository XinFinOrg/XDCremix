import { AnalyzerModule, ModuleAlgorithm, ModuleCategory, ReportObj, CompilationResult, BinaryOperationAstNode, SupportedVersion } from './../../types';
export default class intDivisionTruncate implements AnalyzerModule {
    warningNodes: BinaryOperationAstNode[];
    name: string;
    description: string;
    category: ModuleCategory;
    algorithm: ModuleAlgorithm;
    version: SupportedVersion;
    visit(node: BinaryOperationAstNode): void;
    report(compilationResults: CompilationResult): ReportObj[];
}
