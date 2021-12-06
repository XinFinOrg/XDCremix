import { AnalyzerModule, ModuleAlgorithm, ModuleCategory, ReportObj, CompilationResult, IdentifierAstNode, MemberAccessAstNode, SupportedVersion } from './../../types';
export default class blockTimestamp implements AnalyzerModule {
    warningNowNodes: IdentifierAstNode[];
    warningblockTimestampNodes: MemberAccessAstNode[];
    name: string;
    description: string;
    category: ModuleCategory;
    algorithm: ModuleAlgorithm;
    version: SupportedVersion;
    visit(node: IdentifierAstNode | MemberAccessAstNode): void;
    report(compilationResults: CompilationResult): ReportObj[];
}
