import { AnalyzerModule, ModuleAlgorithm, ModuleCategory, ReportObj, CompilationResult, InlineAssemblyAstNode, SupportedVersion } from './../../types';
export default class inlineAssembly implements AnalyzerModule {
    inlineAssNodes: InlineAssemblyAstNode[];
    name: string;
    description: string;
    category: ModuleCategory;
    algorithm: ModuleAlgorithm;
    version: SupportedVersion;
    visit(node: InlineAssemblyAstNode): void;
    report(compilationResults: CompilationResult): ReportObj[];
}
