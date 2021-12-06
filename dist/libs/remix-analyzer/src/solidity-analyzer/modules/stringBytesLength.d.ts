import { AnalyzerModule, ModuleAlgorithm, ModuleCategory, ReportObj, CompilationResult, MemberAccessAstNode, FunctionCallAstNode, SupportedVersion } from './../../types';
export default class stringBytesLength implements AnalyzerModule {
    name: string;
    description: string;
    category: ModuleCategory;
    algorithm: ModuleAlgorithm;
    version: SupportedVersion;
    stringToBytesConversions: FunctionCallAstNode[];
    bytesLengthChecks: MemberAccessAstNode[];
    visit(node: FunctionCallAstNode | MemberAccessAstNode): void;
    report(compilationResults: CompilationResult): ReportObj[];
}
