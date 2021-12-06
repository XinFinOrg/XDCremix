import { SrcIfc, Options, CompilerConfiguration } from './types';
export declare class UnitTestRunner {
    event: any;
    accountsLibCode: any;
    testsAccounts: string[] | null;
    web3: any;
    constructor();
    init(web3?: any, accounts?: any): Promise<void>;
    createWeb3Provider(optWeb3: any): Promise<any>;
    /**
     * @dev Run tests from source of a test contract file (used for IDE)
     * @param contractSources Sources of contract
     * @param compilerConfig current compiler configuration
     * @param testCallback Test callback
     * @param resultCallback Result Callback
     * @param finalCallback Final Callback
     * @param importFileCb Import file callback
     * @param opts Options
     */
    runTestSources(contractSources: SrcIfc, compilerConfig: CompilerConfiguration, testCallback: any, resultCallback: any, deployCb: any, finalCallback: any, importFileCb: any, opts: Options): Promise<void>;
}
