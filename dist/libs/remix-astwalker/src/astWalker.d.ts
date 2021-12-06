/// <reference types="node" />
import { EventEmitter } from 'events';
import { Node, AstNode } from './index';
export declare interface AstWalker {
    new (): EventEmitter;
}
export declare function isAstNode(node: Record<string, unknown>): boolean;
export declare function isYulAstNode(node: Record<string, unknown>): boolean;
/**
 * Crawl the given AST through the function walk(ast, callback)
 */
/**
 * visit all the AST nodes
 *
 * @param {Object} ast  - AST node
 * @return EventEmitter
 * event('node', <Node Type | false>) will be fired for every node of type <Node Type>.
 * event('node', "*") will be fired for all other nodes.
 * in each case, if the event emits false it does not descend into children.
 * If no event for the current type, children are visited.
 */
export declare class AstWalker extends EventEmitter {
    manageCallback(node: AstNode, callback: Record<string, unknown> | Function): any;
    normalizeNodes(nodes: AstNode[]): AstNode[];
    getASTNodeChildren(ast: AstNode): AstNode[];
    walk(ast: AstNode, callback?: Function | Record<string, unknown>): void;
    walkFullInternal(ast: AstNode, callback: Function): void;
    walkFull(ast: AstNode, callback: any): void;
    walkAstList(sourcesList: Node, cb?: Function): void;
}
