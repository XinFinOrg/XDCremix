export interface Location {
    start: number;
    length: number;
    file: number;
}
export interface LineColPosition {
    readonly line: number;
    readonly character: number;
}
export interface LineColRange {
    readonly start: LineColPosition;
    readonly end: LineColPosition;
}
export interface Node {
    ast?: AstNode;
    source?: string;
    id?: number;
}
export interface AstNode {
    id: number;
    nodeType: string;
    src: string;
    absolutePath?: string;
    exportedSymbols?: Record<string, unknown>;
    nodes?: Array<AstNode>;
    literals?: Array<string>;
    file?: string;
    scope?: number;
    sourceUnit?: number;
    symbolAliases?: Array<string>;
    [x: string]: any;
}
export interface AstNodeAtt {
    operator?: string;
    string?: null;
    type?: string;
    value?: string;
    constant?: boolean;
    name?: string;
    public?: boolean;
    exportedSymbols?: Record<string, unknown>;
    argumentTypes?: null;
    absolutePath?: string;
    [x: string]: any;
}
