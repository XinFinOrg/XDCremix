export declare class SolidityProxy {
    cache: any;
    getCurrentCalledAddressAt: any;
    getCode: any;
    sources: any;
    contracts: any;
    constructor({ getCurrentCalledAddressAt, getCode }: {
        getCurrentCalledAddressAt: any;
        getCode: any;
    });
    /**
      * reset the cache and apply a new @arg compilationResult
      *
      * @param {Object} compilationResult  - result os a compilatiion (diectly returned by the compiler)
      */
    reset(compilationResult: any): void;
    /**
      * check if the object has been properly loaded
      *
      * @return {Bool} - returns true if a compilation result has been applied
      */
    loaded(): boolean;
    /**
      * retrieve the compiled contract name at the @arg vmTraceIndex (cached)
      *
      * @param {Int} vmTraceIndex  - index in the vm trave where to resolve the executed contract name
      * @param {Function} cb  - callback returns (error, contractName)
      */
    contractObjectAt(vmTraceIndex: any): Promise<any>;
    /**
      * extract the state variables of the given compiled @arg contractName (cached)
      *
      * @param {String} contractName  - name of the contract to retrieve state variables from
      * @return {Object} - returns state variables of @args contractName
      */
    extractStatesDefinitions(): any;
    /**
      * extract the state variables of the given compiled @arg contractName (cached)
      *
      * @param {String} contractName  - name of the contract to retrieve state variables from
      * @return {Object} - returns state variables of @args contractName
      */
    extractStateVariables(contractName: any): any;
    /**
      * extract the state variables of the given compiled @arg vmtraceIndex (cached)
      *
      * @param {Int} vmTraceIndex  - index in the vm trave where to resolve the state variables
      * @return {Object} - returns state variables of @args vmTraceIndex
      */
    extractStateVariablesAt(vmtraceIndex: any): Promise<any>;
    /**
      * get the AST of the file declare in the @arg sourceLocation
      *
      * @param {Object} sourceLocation  - source location containing the 'file' to retrieve the AST from
      * @return {Object} - AST of the current file
      */
    ast(sourceLocation: any, generatedSources: any): any;
    /**
     * get the filename refering to the index from the compilation result
     *
     * @param {Int} index  - index of the filename
     * @return {String} - filename
     */
    fileNameFromIndex(index: any): string;
}
