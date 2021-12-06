export declare class Debugger {
    event: any;
    offsetToLineColumnConverter: any;
    compilationResult: any;
    debugger: any;
    breakPointManager: any;
    step_manager: any;
    vmDebuggerLogic: any;
    constructor(options: any);
    registerAndHighlightCodeItem(index: any): Promise<void>;
    updateWeb3(web3: any): void;
    debug(blockNumber: any, txNumber: any, tx: any, loadingCb: any): Promise<void>;
    debugTx(tx: any, loadingCb: any): Promise<void>;
    unload(): void;
}
