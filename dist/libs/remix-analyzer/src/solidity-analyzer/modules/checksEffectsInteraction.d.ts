import AbstractAst from './abstractAstView';
import { AnalyzerModule, ModuleAlgorithm, ModuleCategory, ReportFunction, VisitFunction, SupportedVersion } from './../../types';
export default class checksEffectsInteraction implements AnalyzerModule {
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
    private isPotentialVulnerableFunction;
    private isLocalCallWithStateChange;
    private checkIfChangesState;
}
