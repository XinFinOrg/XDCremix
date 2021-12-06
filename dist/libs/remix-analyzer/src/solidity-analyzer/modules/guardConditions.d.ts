import { AnalyzerModule, ModuleAlgorithm, ModuleCategory, ReportObj, CompilationResult, FunctionCallAstNode, SupportedVersion } from './../../types';
export default class guardConditions implements AnalyzerModule {
    guards: FunctionCallAstNode[];
    name: string;
    description: string;
    category: ModuleCategory;
    algorithm: ModuleAlgorithm;
    version: SupportedVersion;
    visit(node: FunctionCallAstNode): void;
    report(compilationResults: CompilationResult): ReportObj[];
}
