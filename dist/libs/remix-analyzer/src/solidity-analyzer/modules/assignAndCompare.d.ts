import { AnalyzerModule, ModuleAlgorithm, ModuleCategory, ReportObj, BlockAstNode, IfStatementAstNode, WhileStatementAstNode, ForStatementAstNode, CompilationResult, ExpressionStatementAstNode, SupportedVersion } from './../../types';
export default class assignAndCompare implements AnalyzerModule {
    warningNodes: ExpressionStatementAstNode[];
    name: string;
    description: string;
    category: ModuleCategory;
    algorithm: ModuleAlgorithm;
    version: SupportedVersion;
    visit(node: BlockAstNode | IfStatementAstNode | WhileStatementAstNode | ForStatementAstNode): void;
    report(compilationResults: CompilationResult): ReportObj[];
}
