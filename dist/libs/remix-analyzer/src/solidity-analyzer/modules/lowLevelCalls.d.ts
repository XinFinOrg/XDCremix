import { AnalyzerModule, ModuleAlgorithm, ModuleCategory, ReportObj, CompilationResult, MemberAccessAstNode, SupportedVersion } from './../../types';
interface llcNode {
    node: MemberAccessAstNode;
    type: Record<string, string>;
}
export default class lowLevelCalls implements AnalyzerModule {
    llcNodes: llcNode[];
    name: string;
    description: string;
    category: ModuleCategory;
    algorithm: ModuleAlgorithm;
    version: SupportedVersion;
    visit(node: MemberAccessAstNode): void;
    report(compilationResults: CompilationResult): ReportObj[];
}
export {};
