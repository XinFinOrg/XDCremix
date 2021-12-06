import { AnalyzerModule, ModuleAlgorithm, ModuleCategory, ReportObj, CompilationResult, MemberAccessAstNode, SupportedVersion } from './../../types';
export default class thisLocal implements AnalyzerModule {
    warningNodes: MemberAccessAstNode[];
    name: string;
    description: string;
    category: ModuleCategory;
    algorithm: ModuleAlgorithm;
    version: SupportedVersion;
    visit(node: MemberAccessAstNode): void;
    report(compilationResults: CompilationResult): ReportObj[];
}
