import { AstNode, LineColPosition, LineColRange, Location } from './types';
export declare interface SourceMappings {
    new (): SourceMappings;
}
/**
 * Turn an character offset into a "LineColPosition".
 *
 * @param offset  The character offset to convert.
 */
export declare function lineColPositionFromOffset(offset: number, lineBreaks: Array<number>): LineColPosition;
/**
 * Turn a solc AST's "src" attribute string (s:l:f)
 * into a Location
 *
 * @param astNode  The object to convert.
 */
export declare function sourceLocationFromAstNode(astNode: AstNode): Location | null;
/**
 * Break out fields of solc AST's "src" attribute string (s:l:f)
 * into its "start", "length", and "file index" components
 * and return that as a Location
 *
 * @param src  A solc "src" field.
 * @returns {Location}
 */
export declare function sourceLocationFromSrc(src: string): Location;
/**
 * Routines for retrieving solc AST object(s) using some criteria, usually
 * includng "src' information.
 */
export declare class SourceMappings {
    readonly source: string;
    readonly lineBreaks: Array<number>;
    constructor(source: string);
    /**
     * Get a list of nodes that are at the given "position".
     *
     * @param astNodeType  Type of node to return or null.
     * @param position     Character offset where AST node should be located.
     */
    nodesAtPosition(astNodeType: string | null, position: Location, ast: AstNode): Array<AstNode>;
    /**
     * Retrieve the first "astNodeType" that includes the source map at arg instIndex, or "null" if none found.
     *
     * @param astNodeType   nodeType that a found ASTNode must be. Use "null" if any ASTNode can match.
     * @param sourceLocation "src" location that the AST node must match.
     */
    findNodeAtSourceLocation(astNodeType: string | undefined, sourceLocation: Location, ast: AstNode | null): AstNode | null;
    /**
     * Retrieve the line/column range position for the given source-mapping string.
     *
     * @param src  Solc "src" object containing attributes {source} and {length}.
     */
    srcToLineColumnRange(src: string): LineColRange;
}
