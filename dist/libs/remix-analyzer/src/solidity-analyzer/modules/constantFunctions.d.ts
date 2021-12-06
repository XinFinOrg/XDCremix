import AbstractAst from './abstractAstView';
import { AnalyzerModule, ModuleAlgorithm, ModuleCategory, VisitFunction, ReportFunction, SupportedVersion } from './../../types';
export default class constantFunctions implements AnalyzerModule {
    name: string;
    description: string;
    category: ModuleCategory;
    algorithm: ModuleAlgorithm;
    version: SupportedVersion;
    abstractAst: AbstractAst;
    visit: VisitFunction;
    report: ReportFunction;
    private _report;
    private getContext;
    private getStateVariables;
    private checkIfShouldBeConstant;
    private isConstBreaker;
    private isCallOnNonConstExternalInterfaceFunction;
}
