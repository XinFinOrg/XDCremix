/**
 * Process the source code location for the current executing bytecode
 */
export declare class SourceLocationTracker {
    opts: any;
    codeManager: any;
    event: any;
    sourceMapByAddress: any;
    constructor(_codeManager: any, { debugWithGeneratedSources }: {
        debugWithGeneratedSources: any;
    });
    /**
     * Return the source location associated with the given @arg index (instruction index)
     *
     * @param {String} address - contract address from which the source location is retrieved
     * @param {Int} index - index in the instruction list from where the source location is retrieved
     * @param {Object} contractDetails - AST of compiled contracts
     */
    getSourceLocationFromInstructionIndex(address: any, index: any, contracts: any): Promise<{}>;
    /**
     * Return the source location associated with the given @arg vmTraceIndex
     *
     * @param {String} address - contract address from which the source location is retrieved
     * @param {Int} vmtraceStepIndex - index of the current code in the vmtrace
     * @param {Object} contractDetails - AST of compiled contracts
     */
    getSourceLocationFromVMTraceIndex(address: any, vmtraceStepIndex: any, contracts: any): Promise<{}>;
    /**
     * Returns the generated sources from a specific @arg address
     *
     * @param {String} address - contract address from which has generated sources
     * @param {Object} generatedSources - Object containing the sourceid, ast and the source code.
     */
    getGeneratedSourcesFromAddress(address: any): any;
    /**
     * Returns the total amount of sources from a specific @arg address and @arg contracts
     *
     * @param {String} address - contract address from which has generated sources
     * @param {Object} contracts - AST of compiled contracts
     */
    getTotalAmountOfSources(address: any, contracts: any): number;
    /**
     * Return a valid source location associated with the given @arg vmTraceIndex
     *
     * @param {String} address - contract address from which the source location is retrieved
     * @param {Int} vmtraceStepIndex - index of the current code in the vmtrace
     * @param {Object} contractDetails - AST of compiled contracts
     */
    getValidSourceLocationFromVMTraceIndex(address: any, vmtraceStepIndex: any, contracts: any): Promise<Record<string, number>>;
    clearCache(): void;
    private getSourceMap;
    private extractSourceMap;
}
