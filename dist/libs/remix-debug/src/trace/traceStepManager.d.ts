export declare class TraceStepManager {
    traceAnalyser: any;
    constructor(_traceAnalyser: any);
    isCallInstruction(index: any): boolean;
    isReturnInstruction(index: any): boolean;
    findStepOverBack(currentStep: any): number;
    findStepOverForward(currentStep: any): any;
    findNextCall(currentStep: any): any;
    findStepOut(currentStep: any): any;
}
