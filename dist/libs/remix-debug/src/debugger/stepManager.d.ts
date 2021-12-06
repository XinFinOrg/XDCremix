export declare class DebuggerStepManager {
    event: any;
    debugger: any;
    traceManager: any;
    currentStepIndex: number;
    traceLength: number;
    codeTraceLength: number;
    revertionPoint: any;
    currentCall: any;
    constructor(_debugger: any, traceManager: any);
    listenToEvents(): void;
    triggerStepChanged(step: any): void;
    stepIntoBack(solidityMode: any): void;
    stepIntoForward(solidityMode: any): void;
    stepOverBack(solidityMode: any): void;
    stepOverForward(solidityMode: any): void;
    jumpOut(solidityMode: any): void;
    jumpTo(step: any): void;
    jumpToException(): void;
    jumpNextBreakpoint(): void;
    jumpPreviousBreakpoint(): void;
    calculateFirstStep(): any;
    calculateCodeStepList(): any[];
    calculateCodeLength(): any;
    nextStep(): any;
    previousStep(): any;
    resolveToReducedTrace(value: any, incr: any): any;
}
