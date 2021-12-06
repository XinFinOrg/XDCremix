/**
 * Decompress the source mapping given by solc-bin.js
 * s:l:f:j
 */
/**
 * Decode the given @arg value
 *
 * @param {string} value      - source location to decode ( should be start:length:file )
 * @return {Object} returns the decompressed source mapping {start, length, file}
 */
export declare function decode(value: any): {
    start: number;
    length: number;
    file: number;
};
/**
 * Decode the source mapping for the given compressed mapping
 *
 * @param {String} mapping     - compressed source mapping given by solc-bin
 * @return {Array} returns the decompressed source mapping. Array of {start, length, file, jump}
 */
export declare function decompressAll(mapping: any): any[];
/**
  * Retrieve line/column position of each source char
  *
  * @param {String} source - contract source code
  * @return {Array} returns an array containing offset of line breaks
  */
export declare function getLinebreakPositions(source: any): any[];
/**
 * Retrieve the line/column position for the given source mapping
 *
 * @param {Object} sourceLocation - object containing attributes {source} and {length}
 * @param {Array} lineBreakPositions - array returned by the function 'getLinebreakPositions'
 * @return {Object} returns an object {start: {line, column}, end: {line, column}} (line/column count start at 0)
 */
export declare function convertOffsetToLineColumn(sourceLocation: any, lineBreakPositions: any): {
    start: {
        line: number;
        column: number;
    };
    end: {
        line: number;
        column: number;
    };
};
/**
 * Retrieve the first @arg astNodeType that include the source map at arg instIndex
 *
 * @param {String} astNodeType - node type that include the source map instIndex
 * @param {String} instIndex - instruction index used to retrieve the source map
 * @param {String} sourceMap - source map given by the compilation result
 * @param {Object} ast - ast given by the compilation result
 */
export declare function findNodeAtInstructionIndex(astNodeType: any, instIndex: any, sourceMap: any, ast: any): any;
/**
 * get a list of nodes that are at the given @arg position
 *
 * @param {String} astNodeType      - type of node to return
 * @param {Int} position     - cursor position
 * @return {Object} ast object given by the compiler
 */
export declare function nodesAtPosition(astNodeType: any, position: any, ast: any): any[];
/**
 * starts with the given @arg index and move backward until it can find all the values for start, length, file, jump
 * if `file === -1` then the value of the sourcemap should be taken from the previous step,
 * because some steps are internal subroutine for the compiler and doesn't link to any high level code.
 *
 * Solidity source maps format is
 *  - start:length:file:jump
 *  - jump can be 'i', 'o' or '-' (jump 'in' or 'out' of a function)
 *  - if no value is specified ( e.g "5:2" - no mention of 'file' and 'jump' ), actual values are the one of the step before
 *  - if the file (3rd value) has -1, the source maps should be discarded
 *
 *  @param Int index - index in the bytecode to decode source mapping from
 *  @param Array mapping - source maps returned by the compiler. e.g 121:3741:0:-:0;;;;8:9:-1;5:2;;;30:1;27;20:12;5:2;121:3741:0;;;;;;;
 *  @return Object { start, length, file, jump }
 */
export declare function atIndex(index: any, mapping: any): {};
