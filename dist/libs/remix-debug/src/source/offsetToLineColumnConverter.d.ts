export declare class OffsetToColumnConverter {
    lineBreakPositionsByContent: any;
    sourceMappingDecoder: any;
    constructor(compilerEvent: any);
    offsetToLineColumn(rawLocation: any, file: any, sources: any, asts: any): {
        start: {
            line: number;
            column: number;
        };
        end: {
            line: number;
            column: number;
        };
    };
    clear(): void;
}
