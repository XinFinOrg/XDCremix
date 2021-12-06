/**
  * allow to manage breakpoint
  *
  * Trigger events: breakpointHit, breakpointAdded, breakpointRemoved
  */
export declare class BreakpointManager {
    event: any;
    traceManager: any;
    callTree: any;
    solidityProxy: any;
    breakpoints: any;
    locationToRowConverter: any;
    /**
      * constructor
      *
      * @param {Object} _debugger - type of EthDebugger
      * @return {Function} _locationToRowConverter - function implemented by editor which return a column/line position for a char source location
      */
    constructor({ traceManager, callTree, solidityProxy, locationToRowConverter }: {
        traceManager: any;
        callTree: any;
        solidityProxy: any;
        locationToRowConverter: any;
    });
    setManagers({ traceManager, callTree, solidityProxy }: {
        traceManager: any;
        callTree: any;
        solidityProxy: any;
    }): void;
    /**
      * start looking for the next breakpoint
      * @param {Bool} defaultToLimit - if true jump to the end of the trace if no more breakpoint found
      *
      */
    jumpNextBreakpoint(fromStep: any, defaultToLimit: any): Promise<void>;
    /**
      * start looking for the previous breakpoint
      * @param {Bool} defaultToLimit - if true jump to the start of the trace if no more breakpoint found
      *
      */
    jumpPreviousBreakpoint(fromStep: any, defaultToLimit: any): Promise<void>;
    depthChange(step: any, trace: any): boolean;
    hitLine(currentStep: any, sourceLocation: any, previousSourceLocation: any, trace: any): boolean;
    /**
      * start looking for the previous or next breakpoint
      * @param {Int} direction - 1 or -1 direction of the search
      * @param {Bool} defaultToLimit - if true jump to the limit (end if direction is 1, beginning if direction is -1) of the trace if no more breakpoint found
      *
      */
    jump(fromStep: any, direction: any, defaultToLimit: any, trace: any): Promise<void>;
    /**
      * check the given pair fileIndex/line against registered breakpoints
      *
      * @param {Int} fileIndex - index of the file content (from the compilation result)
      * @param {Int} line - line number where looking for breakpoint
      * @return {Bool} return true if the given @arg fileIndex @arg line refers to a breakpoint
      */
    hasBreakpointAtLine(fileIndex: any, line: any): boolean;
    /**
      * return true if current manager has breakpoint
      *
      * @return {Bool} true if breapoint registered
      */
    hasBreakpoint(): boolean;
    /**
      * add a new breakpoint to the manager
      *
      * @param {Object} sourceLocation - position of the breakpoint { file: '<file index>', row: '<line number' }
      */
    add(sourceLocation: any): void;
    /**
      * remove a breakpoint from the manager
      *
      * @param {Object} sourceLocation - position of the breakpoint { file: '<file index>', row: '<line number' }
      */
    remove(sourceLocation: any): void;
}
