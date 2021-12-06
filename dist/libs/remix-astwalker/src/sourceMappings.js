"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceMappings = exports.sourceLocationFromSrc = exports.sourceLocationFromAstNode = exports.lineColPositionFromOffset = void 0;
const astWalker_1 = require("./astWalker");
const remix_lib_1 = require("@remix-project/remix-lib");
/**
 * Turn an character offset into a "LineColPosition".
 *
 * @param offset  The character offset to convert.
 */
function lineColPositionFromOffset(offset, lineBreaks) {
    let line = remix_lib_1.util.findLowerBound(offset, lineBreaks);
    if (lineBreaks[line] !== offset) {
        line += 1;
    }
    const beginColumn = line === 0 ? 0 : (lineBreaks[line - 1] + 1);
    return {
        line: line + 1,
        character: (offset - beginColumn) + 1
    };
}
exports.lineColPositionFromOffset = lineColPositionFromOffset;
/**
 * Turn a solc AST's "src" attribute string (s:l:f)
 * into a Location
 *
 * @param astNode  The object to convert.
 */
function sourceLocationFromAstNode(astNode) {
    if ((0, astWalker_1.isAstNode)(astNode) && (0, astWalker_1.isYulAstNode)(astNode) && astNode.src) {
        return sourceLocationFromSrc(astNode.src);
    }
    return null;
}
exports.sourceLocationFromAstNode = sourceLocationFromAstNode;
/**
 * Break out fields of solc AST's "src" attribute string (s:l:f)
 * into its "start", "length", and "file index" components
 * and return that as a Location
 *
 * @param src  A solc "src" field.
 * @returns {Location}
 */
function sourceLocationFromSrc(src) {
    const split = src.split(':');
    return {
        start: parseInt(split[0], 10),
        length: parseInt(split[1], 10),
        file: parseInt(split[2], 10)
    };
}
exports.sourceLocationFromSrc = sourceLocationFromSrc;
/**
 * Routines for retrieving solc AST object(s) using some criteria, usually
 * includng "src' information.
 */
// eslint-disable-next-line no-redeclare
class SourceMappings {
    constructor(source) {
        this.source = source;
        // Create a list of line offsets which will be used to map between
        // character offset and line/column positions.
        const lineBreaks = [];
        for (let pos = source.indexOf('\n'); pos >= 0; pos = source.indexOf('\n', pos + 1)) {
            lineBreaks.push(pos);
        }
        this.lineBreaks = lineBreaks;
    }
    ;
    /**
     * Get a list of nodes that are at the given "position".
     *
     * @param astNodeType  Type of node to return or null.
     * @param position     Character offset where AST node should be located.
     */
    nodesAtPosition(astNodeType, position, ast) {
        const astWalker = new astWalker_1.AstWalker();
        const found = [];
        const callback = function (node) {
            const nodeLocation = sourceLocationFromAstNode(node);
            if (nodeLocation &&
                nodeLocation.start === position.start &&
                nodeLocation.length === position.length) {
                if (!astNodeType || astNodeType === node.nodeType) {
                    found.push(node);
                }
            }
            return true;
        };
        astWalker.walkFull(ast, callback);
        return found;
    }
    /**
     * Retrieve the first "astNodeType" that includes the source map at arg instIndex, or "null" if none found.
     *
     * @param astNodeType   nodeType that a found ASTNode must be. Use "null" if any ASTNode can match.
     * @param sourceLocation "src" location that the AST node must match.
     */
    findNodeAtSourceLocation(astNodeType, sourceLocation, ast) {
        const astWalker = new astWalker_1.AstWalker();
        let found = null;
        /* FIXME: Looking at AST walker code,
           I don't understand a need to return a boolean. */
        const callback = function (node) {
            const nodeLocation = sourceLocationFromAstNode(node);
            if (nodeLocation &&
                nodeLocation.start === sourceLocation.start &&
                nodeLocation.length === sourceLocation.length) {
                if (astNodeType === undefined || astNodeType === node.nodeType) {
                    found = node;
                }
            }
            return true;
        };
        astWalker.walkFull(ast, callback);
        return found;
    }
    /**
     * Retrieve the line/column range position for the given source-mapping string.
     *
     * @param src  Solc "src" object containing attributes {source} and {length}.
     */
    srcToLineColumnRange(src) {
        const sourceLocation = sourceLocationFromSrc(src);
        if (sourceLocation.start >= 0 && sourceLocation.length >= 0) {
            return {
                start: lineColPositionFromOffset(sourceLocation.start, this.lineBreaks),
                end: lineColPositionFromOffset(sourceLocation.start + sourceLocation.length, this.lineBreaks)
            };
        }
        else {
            return {
                start: null,
                end: null
            };
        }
    }
}
exports.SourceMappings = SourceMappings;
//# sourceMappingURL=sourceMappings.js.map