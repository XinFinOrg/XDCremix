import { AnalyzerModule, ModuleAlgorithm, ModuleCategory, ReportObj, CompilationResult, ForStatementAstNode, SupportedVersion } from './../../types';
export default class forLoopIteratesOverDynamicArray implements AnalyzerModule {
    relevantNodes: ForStatementAstNode[];
    name: string;
    description: string;
    category: ModuleCategory;
    algorithm: ModuleAlgorithm;
    version: SupportedVersion;
    visit(node: ForStatementAstNode): void;
    report(compilationResults: CompilationResult): ReportObj[];
}
