/**
 * Tree representing internal jump into function.
 * Triggers `callTreeReady` event when tree is ready
 * Triggers `callTreeBuildFailed` event when tree fails to build
 */
export declare class InternalCallTree {
    includeLocalVariables: any;
    debugWithGeneratedSources: any;
    event: any;
    solidityProxy: any;
    traceManager: any;
    sourceLocationTracker: any;
    scopes: any;
    scopeStarts: any;
    functionCallStack: any;
    functionDefinitionsByScope: any;
    variableDeclarationByFile: any;
    functionDefinitionByFile: any;
    astWalker: any;
    reducedTrace: any;
    /**
      * constructor
      *
      * @param {Object} debuggerEvent  - event declared by the debugger (EthDebugger)
      * @param {Object} traceManager  - trace manager
      * @param {Object} solidityProxy  - solidity proxy
      * @param {Object} codeManager  - code manager
      * @param {Object} opts  - { includeLocalVariables, debugWithGeneratedSources }
      */
    constructor(debuggerEvent: any, traceManager: any, solidityProxy: any, codeManager: any, opts: any);
    /**
      * reset tree
      *
      */
    reset(): void;
    /**
      * find the scope given @arg vmTraceIndex
      *
      * @param {Int} vmtraceIndex  - index on the vm trace
      */
    findScope(vmtraceIndex: any): any;
    parentScope(scopeId: any): any;
    findScopeId(vmtraceIndex: any): any;
    retrieveFunctionsStack(vmtraceIndex: any): any[];
    extractSourceLocation(step: any): Promise<any>;
    extractValidSourceLocation(step: any): Promise<any>;
}
