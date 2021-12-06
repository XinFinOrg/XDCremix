import { AnalyzerModule, ModuleAlgorithm, ModuleCategory, ReportObj, CompilationResult, UnaryOperationAstNode, SupportedVersion } from './../../types';
export default class deleteDynamicArrays implements AnalyzerModule {
    rel: UnaryOperationAstNode[];
    name: string;
    description: string;
    category: ModuleCategory;
    algorithm: ModuleAlgorithm;
    version: SupportedVersion;
    visit(node: UnaryOperationAstNode): void;
    report(compilationResults: CompilationResult): ReportObj[];
}
