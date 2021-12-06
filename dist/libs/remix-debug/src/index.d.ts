import * as init from './init';
import { Ethdebugger as EthDebugger } from './Ethdebugger';
import { Debugger as TransactionDebugger } from './debugger/debugger';
import { CmdLine } from './cmdline';
import { StorageViewer } from './storage/storageViewer';
import { StorageResolver } from './storage/storageResolver';
import * as SolidityDecoder from './solidity-decoder';
import { BreakpointManager } from './code/breakpointManager';
import * as sourceMappingDecoder from './source/sourceMappingDecoder';
import * as traceHelper from './trace/traceHelper';
declare const _default: {
    init: typeof init;
    traceHelper: typeof traceHelper;
    sourceMappingDecoder: typeof sourceMappingDecoder;
    EthDebugger: typeof EthDebugger;
    TransactionDebugger: typeof TransactionDebugger;
    /**
     * constructor
     *
     * @param {Object} _debugger - type of EthDebugger
     * @return {Function} _locationToRowConverter - function implemented by editor which return a column/line position for a char source location
     */
    BreakpointManager: typeof BreakpointManager;
    SolidityDecoder: typeof SolidityDecoder;
    storage: {
        StorageViewer: typeof StorageViewer;
        StorageResolver: typeof StorageResolver;
    };
    CmdLine: typeof CmdLine;
};
export = _default;
