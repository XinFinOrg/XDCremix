import { TraceManager } from '../trace/traceManager';
export declare class CodeManager {
    event: any;
    isLoading: boolean;
    traceManager: TraceManager;
    codeResolver: any;
    constructor(_traceManager: any);
    /**
     * clear the cache
     *
     */
    clear(): void;
    /**
     * resolve the code of the given @arg stepIndex and trigger appropriate event
     *
     * @param {String} stepIndex - vm trace step
     * @param {Object} tx - transaction (given by web3)
     */
    resolveStep(stepIndex: any, tx: any): void;
    /**
     * Retrieve the code located at the given @arg address
     *
     * @param {String} address - address of the contract to get the code from
     * @param {Function} cb - callback function, return the bytecode
     */
    getCode(address: any): Promise<any>;
    /**
     * Retrieve the called function for the current vm step for the given @arg address
     *
     * @param {String} stepIndex - vm trace step
     * @param {String} sourceMap - source map given byt the compilation result
     * @param {Object} ast - ast given by the compilation result
     * @return {Object} return the ast node of the function
     */
    getFunctionFromStep(stepIndex: any, sourceMap: any, ast: any): any;
    /**
     * Retrieve the instruction index of the given @arg step
     *
     * @param {String} address - address of the current context
     * @param {String} step - vm trace step
     * @param {Function} callback - instruction index
     */
    getInstructionIndex(address: any, step: any): any;
    /**
     * Retrieve the called function for the given @arg pc and @arg address
     *
     * @param {String} address - address of the current context (used to resolve instruction index)
     * @param {String} pc - pc that point to the instruction index
     * @param {String} sourceMap - source map given byt the compilation result
     * @param {Object} ast - ast given by the compilation result
     * @return {Object} return the ast node of the function
     */
    getFunctionFromPC(address: any, pc: any, sourceMap: any, ast: any): any;
    private retrieveCodeAndTrigger;
    private retrieveIndexAndTrigger;
}
