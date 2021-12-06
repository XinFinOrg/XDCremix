import { AnalyzerModule, ModuleAlgorithm, ModuleCategory, ReportObj, CompilationResult, ForStatementAstNode, WhileStatementAstNode, ExpressionStatementAstNode, SupportedVersion } from './../../types';
export default class etherTransferInLoop implements AnalyzerModule {
    relevantNodes: ExpressionStatementAstNode[];
    name: string;
    description: string;
    category: ModuleCategory;
    algorithm: ModuleAlgorithm;
    version: SupportedVersion;
    visit(node: ForStatementAstNode | WhileStatementAstNode): void;
    report(compilationResults: CompilationResult): ReportObj[];
}
