(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "../../../dist/libs/remix-astwalker/src/astWalker.js":
/*!***************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-astwalker/src/astWalker.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AstWalker = exports.isYulAstNode = exports.isAstNode = void 0;

const events_1 = __webpack_require__(/*! events */ "../../../node_modules/events/events.js");

const isObject = function (obj) {
  return obj != null && obj.constructor.name === 'Object';
};

function isAstNode(node) {
  return isObject(node) && 'id' in node && 'nodeType' in node && 'src' in node;
}

exports.isAstNode = isAstNode;

function isYulAstNode(node) {
  return isObject(node) && 'nodeType' in node && 'src' in node;
}

exports.isYulAstNode = isYulAstNode;
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
// eslint-disable-next-line no-redeclare

class AstWalker extends events_1.EventEmitter {
  manageCallback(node, callback // eslint-disable-line @typescript-eslint/ban-types
  ) {
    // FIXME: we shouldn't be doing this callback determination type on each AST node,
    // since the callback function is set once per walk.
    // Better would be to store the right one as a variable and
    // return that.
    if (node) {
      if (node.name in callback) {
        return callback[node.name](node);
      } else {
        return callback['*'](node);
      }
    }

    if (node) {
      if (node.nodeType in callback) {
        /* istanbul ignore next */
        return callback[node.nodeType](node);
      } else {
        /* istanbul ignore next */
        return callback['*'](node);
      }
    }
  }

  normalizeNodes(nodes) {
    // Remove null, undefined and empty elements if any
    nodes = nodes.filter(e => e); // If any element in nodes is array, extract its members

    const objNodes = [];
    nodes.forEach(x => {
      if (Array.isArray(x)) objNodes.push(...x);else objNodes.push(x);
    }); // Filter duplicate nodes using id field

    const normalizedNodes = [];
    objNodes.forEach(element => {
      const firstIndex = normalizedNodes.findIndex(e => e.id === element.id);
      if (firstIndex === -1) normalizedNodes.push(element);
    });
    return normalizedNodes;
  }

  getASTNodeChildren(ast) {
    var _a;

    let nodes = ast.nodes || // for ContractDefinition
    ast.body || // for FunctionDefinition, ModifierDefinition, WhileStatement, DoWhileStatement, ForStatement
    ast.statements || // for Block, YulBlock
    ast.members || // for StructDefinition, EnumDefinition
    ast.overrides || // for OverrideSpecifier
    ast.parameters || // for ParameterList, EventDefinition
    ast.declarations || // for VariableDeclarationStatement
    ast.expression || // for Return, ExpressionStatement, FunctionCall, FunctionCallOptions, MemberAccess
    ast.components || // for TupleExpression
    ast.subExpression || // for UnaryOperation
    ast.eventCall || // for EmitStatement
    []; // If 'nodes' is not an array, convert it into one, for example: ast.body

    if (nodes && !Array.isArray(nodes)) {
      const tempArr = [];
      tempArr.push(nodes);
      nodes = tempArr;
    } // To break object referencing


    nodes = [...nodes];

    if (ast.nodes && ((_a = ast.baseContracts) === null || _a === void 0 ? void 0 : _a.length)) {
      // for ContractDefinition
      nodes.push(...ast.baseContracts);
    } else if (ast.body && ast.overrides && ast.parameters && ast.returnParameters && ast.modifiers) {
      // for FunctionDefinition
      nodes.push(ast.overrides);
      nodes.push(ast.parameters);
      nodes.push(ast.returnParameters);
      nodes.push(ast.modifiers);
    } else if (ast.typeName) {
      // for VariableDeclaration, NewExpression, ElementaryTypeNameExpression
      nodes.push(ast.typeName);
    } else if (ast.body && ast.overrides && ast.parameters) {
      // for ModifierDefinition
      nodes.push(ast.overrides);
      nodes.push(ast.parameters);
    } else if (ast.modifierName && ast.arguments) {
      // for ModifierInvocation
      nodes.push(ast.modifierName);
      nodes.push(ast.arguments);
    } else if (ast.parameterTypes && ast.returnParameterTypes) {
      // for ModifierInvocation
      nodes.push(ast.parameterTypes);
      nodes.push(ast.returnParameterTypes);
    } else if (ast.keyType && ast.valueType) {
      // for Mapping
      nodes.push(ast.keyType);
      nodes.push(ast.valueType);
    } else if (ast.baseType && ast.length) {
      // for ArrayTypeName
      nodes.push(ast.baseType);
      nodes.push(ast.length);
    } else if (ast.AST) {
      // for InlineAssembly
      nodes.push(ast.AST);
    } else if (ast.condition && (ast.trueBody || ast.falseBody || ast.body)) {
      // for IfStatement, WhileStatement, DoWhileStatement
      nodes.push(ast.condition);
      nodes.push(ast.trueBody);
      nodes.push(ast.falseBody);
    } else if (ast.parameters && ast.block) {
      // for TryCatchClause
      nodes.push(ast.block);
    } else if (ast.externalCall && ast.clauses) {
      // for TryStatement
      nodes.push(ast.externalCall);
      nodes.push(ast.clauses);
    } else if (ast.body && ast.condition && ast.initializationExpression && ast.loopExpression) {
      // for ForStatement
      nodes.push(ast.condition);
      nodes.push(ast.initializationExpression);
      nodes.push(ast.loopExpression);
    } else if (ast.declarations && ast.initialValue) {
      // for VariableDeclarationStatement
      nodes.push(ast.initialValue);
    } else if (ast.condition && (ast.trueExpression || ast.falseExpression)) {
      // for Conditional
      nodes.push(ast.condition);
      nodes.push(ast.trueExpression);
      nodes.push(ast.falseExpression);
    } else if (ast.leftHandSide && ast.rightHandSide) {
      // for Assignment
      nodes.push(ast.leftHandSide);
      nodes.push(ast.rightHandSide);
    } else if (ast.leftExpression && ast.rightExpression) {
      // for BinaryOperation
      nodes.push(ast.leftExpression);
      nodes.push(ast.rightExpression);
    } else if (ast.expression && (ast.arguments || ast.options)) {
      // for FunctionCall, FunctionCallOptions
      nodes.push(ast.arguments ? ast.arguments : ast.options);
    } else if (ast.baseExpression && (ast.indexExpression || ast.startExpression && ast.endExpression)) {
      // for IndexAccess, IndexRangeAccess
      nodes.push(ast.baseExpression);
      if (ast.indexExpression) nodes.push(ast.indexExpression);else {
        nodes.push(ast.startExpression);
        nodes.push(ast.endExpression);
      }
    }

    return this.normalizeNodes(nodes);
  } // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/explicit-module-boundary-types


  walk(ast, callback) {
    if (ast) {
      const children = this.getASTNodeChildren(ast);

      if (callback) {
        if (callback instanceof Function) {
          callback = Object({
            '*': callback
          });
        }

        if (!('*' in callback)) {
          callback['*'] = function () {
            return true;
          };
        }

        if (this.manageCallback(ast, callback) && (children === null || children === void 0 ? void 0 : children.length)) {
          for (const k in children) {
            const child = children[k];
            this.walk(child, callback);
          }
        }
      } else {
        if (children === null || children === void 0 ? void 0 : children.length) {
          for (const k in children) {
            const child = children[k];
            this.emit('node', child);
            this.walk(child);
          }
        }
      }
    }
  } // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/explicit-module-boundary-types


  walkFullInternal(ast, callback) {
    if (isAstNode(ast) || isYulAstNode(ast)) {
      // console.log(`XXX id ${ast.id}, nodeType: ${ast.nodeType}, src: ${ast.src}`);
      callback(ast);

      for (const k of Object.keys(ast)) {
        // Possible optimization:
        // if (k in ['id', 'src', 'nodeType']) continue;
        const astItem = ast[k];

        if (Array.isArray(astItem)) {
          for (const child of astItem) {
            if (child) {
              this.walkFullInternal(child, callback);
            }
          }
        } else {
          this.walkFullInternal(astItem, callback);
        }
      }
    }
  } // Normalizes parameter callback and calls walkFullInternal
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types


  walkFull(ast, callback) {
    if (isAstNode(ast) || isYulAstNode(ast)) return this.walkFullInternal(ast, callback);
  } // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/explicit-module-boundary-types


  walkAstList(sourcesList, cb) {
    if (cb) {
      if (sourcesList.ast) {
        this.walk(sourcesList.ast, cb);
      }
    } else {
      if (sourcesList.ast) {
        this.walk(sourcesList.ast);
      }
    }
  }

}

exports.AstWalker = AstWalker;

/***/ }),

/***/ "../../../dist/libs/remix-astwalker/src/index.js":
/*!***********************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-astwalker/src/index.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

(0, tslib_1.__exportStar)(__webpack_require__(/*! ./types */ "../../../dist/libs/remix-astwalker/src/types.js"), exports);
(0, tslib_1.__exportStar)(__webpack_require__(/*! ./astWalker */ "../../../dist/libs/remix-astwalker/src/astWalker.js"), exports);
(0, tslib_1.__exportStar)(__webpack_require__(/*! ./sourceMappings */ "../../../dist/libs/remix-astwalker/src/sourceMappings.js"), exports);

/***/ }),

/***/ "../../../dist/libs/remix-astwalker/src/sourceMappings.js":
/*!********************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-astwalker/src/sourceMappings.js ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SourceMappings = exports.sourceLocationFromSrc = exports.sourceLocationFromAstNode = exports.lineColPositionFromOffset = void 0;

const astWalker_1 = __webpack_require__(/*! ./astWalker */ "../../../dist/libs/remix-astwalker/src/astWalker.js");

const remix_lib_1 = __webpack_require__(/*! @remix-project/remix-lib */ "../../../dist/libs/remix-lib/src/index.js");
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

  const beginColumn = line === 0 ? 0 : lineBreaks[line - 1] + 1;
  return {
    line: line + 1,
    character: offset - beginColumn + 1
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
    this.source = source; // Create a list of line offsets which will be used to map between
    // character offset and line/column positions.

    const lineBreaks = [];

    for (let pos = source.indexOf('\n'); pos >= 0; pos = source.indexOf('\n', pos + 1)) {
      lineBreaks.push(pos);
    }

    this.lineBreaks = lineBreaks;
  }

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

      if (nodeLocation && nodeLocation.start === position.start && nodeLocation.length === position.length) {
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

      if (nodeLocation && nodeLocation.start === sourceLocation.start && nodeLocation.length === sourceLocation.length) {
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
    } else {
      return {
        start: null,
        end: null
      };
    }
  }

}

exports.SourceMappings = SourceMappings;

/***/ }),

/***/ "../../../dist/libs/remix-astwalker/src/types.js":
/*!***********************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-astwalker/src/types.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/Ethdebugger.js":
/*!*************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/Ethdebugger.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ethdebugger = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const storageViewer_1 = __webpack_require__(/*! ./storage/storageViewer */ "../../../dist/libs/remix-debug/src/storage/storageViewer.js");

const storageResolver_1 = __webpack_require__(/*! ./storage/storageResolver */ "../../../dist/libs/remix-debug/src/storage/storageResolver.js");

const traceManager_1 = __webpack_require__(/*! ./trace/traceManager */ "../../../dist/libs/remix-debug/src/trace/traceManager.js");

const codeManager_1 = __webpack_require__(/*! ./code/codeManager */ "../../../dist/libs/remix-debug/src/code/codeManager.js");

const traceHelper_1 = __webpack_require__(/*! ./trace/traceHelper */ "../../../dist/libs/remix-debug/src/trace/traceHelper.js");

const eventManager_1 = __webpack_require__(/*! ./eventManager */ "../../../dist/libs/remix-debug/src/eventManager.js");

const solidity_decoder_1 = __webpack_require__(/*! ./solidity-decoder */ "../../../dist/libs/remix-debug/src/solidity-decoder/index.js");
/**
  * Ethdebugger is a wrapper around a few classes that helps debugging a transaction
  *
  * - Web3Providers - define which environment (web3) the transaction will be retrieved from
  * - TraceManager - Load / Analyze the trace and retrieve details of specific test
  * - CodeManager - Retrieve loaded byte code and help to resolve AST item from vmtrace index
  * - SolidityProxy - Basically used to extract state variable from AST
  * - Breakpoint Manager - Used to add / remove / jumpto breakpoint
  * - InternalCallTree - Used to retrieved local variables
  * - StorageResolver - Help resolving the storage accross different steps
  *
  * @param {Map} opts  -  { function compilationResult } //
  */


class Ethdebugger {
  constructor(opts) {
    this.compilationResult = opts.compilationResult || function (contractAddress) {
      return null;
    };

    this.web3 = opts.web3;
    this.opts = opts;
    this.event = new eventManager_1.EventManager();
    this.traceManager = new traceManager_1.TraceManager({
      web3: this.web3
    });
    this.codeManager = new codeManager_1.CodeManager(this.traceManager);
    this.solidityProxy = new solidity_decoder_1.SolidityProxy({
      getCurrentCalledAddressAt: this.traceManager.getCurrentCalledAddressAt.bind(this.traceManager),
      getCode: this.codeManager.getCode.bind(this.codeManager)
    });
    this.storageResolver = null;
    const includeLocalVariables = true;
    this.callTree = new solidity_decoder_1.InternalCallTree(this.event, this.traceManager, this.solidityProxy, this.codeManager, Object.assign(Object.assign({}, opts), {
      includeLocalVariables
    }));
  }

  setManagers() {
    this.traceManager = new traceManager_1.TraceManager({
      web3: this.web3
    });
    this.codeManager = new codeManager_1.CodeManager(this.traceManager);
    this.solidityProxy = new solidity_decoder_1.SolidityProxy({
      getCurrentCalledAddressAt: this.traceManager.getCurrentCalledAddressAt.bind(this.traceManager),
      getCode: this.codeManager.getCode.bind(this.codeManager)
    });
    this.storageResolver = null;
    const includeLocalVariables = true;
    this.callTree = new solidity_decoder_1.InternalCallTree(this.event, this.traceManager, this.solidityProxy, this.codeManager, Object.assign(Object.assign({}, this.opts), {
      includeLocalVariables
    }));
    this.event.trigger('managersChanged');
  }

  resolveStep(index) {
    this.codeManager.resolveStep(index, this.tx);
  }

  setCompilationResult(compilationResult) {
    this.solidityProxy.reset(compilationResult && compilationResult.data || {});
  }

  sourceLocationFromVMTraceIndex(address, stepIndex) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      return this.callTree.sourceLocationTracker.getSourceLocationFromVMTraceIndex(address, stepIndex, this.solidityProxy.contracts);
    });
  }

  getValidSourceLocationFromVMTraceIndex(address, stepIndex) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      return this.callTree.sourceLocationTracker.getValidSourceLocationFromVMTraceIndex(address, stepIndex, this.solidityProxy.contracts);
    });
  }

  sourceLocationFromInstructionIndex(address, instIndex, callback) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      return this.callTree.sourceLocationTracker.getSourceLocationFromInstructionIndex(address, instIndex, this.solidityProxy.contracts);
    });
  }
  /* breakpoint */


  setBreakpointManager(breakpointManager) {
    this.breakpointManager = breakpointManager;
  }
  /* decode locals */


  extractLocalsAt(step) {
    return this.callTree.findScope(step);
  }

  decodeLocalsAt(step, sourceLocation, callback) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      try {
        const stack = this.traceManager.getStackAt(step);
        const memory = this.traceManager.getMemoryAt(step);
        const address = this.traceManager.getCurrentCalledAddressAt(step);
        const calldata = this.traceManager.getCallDataAt(step);

        try {
          const storageViewer = new storageViewer_1.StorageViewer({
            stepIndex: step,
            tx: this.tx,
            address: address
          }, this.storageResolver, this.traceManager);
          const locals = yield solidity_decoder_1.localDecoder.solidityLocals(step, this.callTree, stack, memory, storageViewer, calldata, sourceLocation, null);

          if (locals['error']) {
            return callback(locals['error']);
          }

          return callback(null, locals);
        } catch (e) {
          callback(e.message);
        }
      } catch (error) {
        callback(error);
      }
    });
  }
  /* decode state */


  extractStateAt(step) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      return this.solidityProxy.extractStateVariablesAt(step);
    });
  }

  decodeStateAt(step, stateVars, callback) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      try {
        const address = this.traceManager.getCurrentCalledAddressAt(step);
        const storageViewer = new storageViewer_1.StorageViewer({
          stepIndex: step,
          tx: this.tx,
          address: address
        }, this.storageResolver, this.traceManager);
        const result = yield solidity_decoder_1.stateDecoder.decodeState(stateVars, storageViewer);
        return result;
      } catch (error) {
        callback(error);
      }
    });
  }

  storageViewAt(step, address) {
    return new storageViewer_1.StorageViewer({
      stepIndex: step,
      tx: this.tx,
      address: address
    }, this.storageResolver, this.traceManager);
  }

  updateWeb3(web3) {
    this.web3 = web3;
    this.setManagers();
  }

  unLoad() {
    this.traceManager.init();
    this.codeManager.clear();
    this.event.trigger('traceUnloaded');
  }

  debug(tx) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      if (this.traceManager.isLoading) {
        return;
      }

      tx.to = tx.to || (0, traceHelper_1.contractCreationToken)('0');
      this.tx = tx;
      yield this.traceManager.resolveTrace(tx);
      this.setCompilationResult(yield this.compilationResult(tx.to));
      this.event.trigger('newTraceLoaded', [this.traceManager.trace]);

      if (this.breakpointManager && this.breakpointManager.hasBreakpoint()) {
        this.breakpointManager.jumpNextBreakpoint(false);
      }

      this.storageResolver = new storageResolver_1.StorageResolver({
        web3: this.traceManager.web3
      });
    });
  }

}

exports.Ethdebugger = Ethdebugger;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/cmdline/index.js":
/*!***************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/cmdline/index.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CmdLine = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const web3_1 = (0, tslib_1.__importDefault)(__webpack_require__(/*! web3 */ "../../../node_modules/web3/lib/index.js"));

const debugger_js_1 = __webpack_require__(/*! ../debugger/debugger.js */ "../../../dist/libs/remix-debug/src/debugger/debugger.js");

const events_1 = __webpack_require__(/*! events */ "../../../node_modules/events/events.js");

class CmdLine {
  constructor() {
    this.events = new events_1.EventEmitter();
    this.lineColumnPos = null;
    this.rawLocation = null;
  }

  connect(providerType, url) {
    if (providerType !== 'http') throw new Error('unsupported provider type');
    this.web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(url));
  }

  loadCompilationData(inputJson, outputJson) {
    const data = {};
    data['data'] = outputJson;
    data['source'] = {
      sources: inputJson.sources
    };
    this.loadCompilationResult(data);
  }

  loadCompilationResult(compilationResult) {
    this.compilation = {};
    this.compilation.compilationResult = compilationResult;
  }

  initDebugger(cb) {
    this.debugger = new debugger_js_1.Debugger({
      web3: this.web3,
      compilationResult: () => {
        return this.compilation.compilationResult;
      }
    });
  }

  getSource() {
    const lineColumnPos = this.lineColumnPos;
    if (!lineColumnPos || !lineColumnPos.start) return [];
    const content = this.compilation.compilationResult.source.sources[this.filename].content.split('\n');
    const source = [];
    let line;
    line = content[lineColumnPos.start.line - 2];

    if (line !== undefined) {
      source.push('    ' + (lineColumnPos.start.line - 1) + ':  ' + line);
    }

    line = content[lineColumnPos.start.line - 1];

    if (line !== undefined) {
      source.push('    ' + lineColumnPos.start.line + ':  ' + line);
    }

    const currentLineNumber = lineColumnPos.start.line;
    const currentLine = content[currentLineNumber];
    source.push('=>  ' + (currentLineNumber + 1) + ':  ' + currentLine);
    const startLine = lineColumnPos.start.line;

    for (var i = 1; i < 4; i++) {
      const line = content[startLine + i];
      source.push('    ' + (startLine + i + 1) + ':  ' + line);
    }

    return source;
  }

  getCurrentLine() {
    const lineColumnPos = this.lineColumnPos;
    if (!lineColumnPos) return '';
    const currentLineNumber = lineColumnPos.start.line;
    const content = this.compilation.compilationResult.source.sources[this.filename].content.split('\n');
    return content[currentLineNumber];
  }

  startDebug(txNumber, filename, cb) {
    this.filename = filename;
    this.txHash = txNumber;
    this.debugger.debug(null, txNumber, null, () => {
      this.debugger.event.register('newSourceLocation', (lineColumnPos, rawLocation) => {
        if (!lineColumnPos) return;
        this.lineColumnPos = lineColumnPos;
        this.rawLocation = rawLocation;
        this.events.emit('source', [lineColumnPos, rawLocation]);
      });
      this.debugger.vmDebuggerLogic.event.register('solidityState', data => {
        this.solidityState = data;
        this.events.emit('globals', data);
      }); // TODO: this doesnt work too well, it should request the data instead...

      this.debugger.vmDebuggerLogic.event.register('solidityLocals', data => {
        if (JSON.stringify(data) === '{}') return;
        this.solidityLocals = data;
        this.events.emit('locals', data);
      });

      if (cb) {
        // TODO: this should be an onReady event
        setTimeout(cb, 1000);
      }
    });
  }

  getVars() {
    return {
      locals: this.solidityLocals,
      contract: this.solidityState
    };
  }

  triggerSourceUpdate() {
    this.events.emit('source', [this.lineColumnPos, this.rawLocation]);
  }

  stepJumpNextBreakpoint() {
    this.debugger.step_manager.jumpNextBreakpoint();
  }

  stepJumpPreviousBreakpoint() {
    this.debugger.step_manager.jumpPreviousBreakpoint();
  }

  stepOverForward(solidityMode) {
    this.debugger.step_manager.stepOverForward(solidityMode);
  }

  stepOverBack(solidityMode) {
    this.debugger.step_manager.stepOverBack(solidityMode);
  }

  stepIntoForward(solidityMode) {
    this.debugger.step_manager.stepIntoForward(solidityMode);
  }

  stepIntoBack(solidityMode) {
    this.debugger.step_manager.stepIntoBack(solidityMode);
  }

  jumpTo(step) {
    this.debugger.step_manager.jumpTo(step);
  }

  getTraceLength() {
    if (!this.debugger.step_manager) return 0;
    return this.debugger.step_manager.traceLength;
  }

  getCodeFirstStep() {
    if (!this.debugger.step_manager) return 0;
    return this.debugger.step_manager.calculateFirstStep();
  }

  getCodeTraceLength() {
    if (!this.debugger.step_manager) return 0;
    return this.debugger.step_manager.calculateCodeLength();
  }

  nextStep() {
    if (!this.debugger.step_manager) return 0;
    return this.debugger.step_manager.nextStep();
  }

  previousStep() {
    if (!this.debugger.step_manager) return 0;
    return this.debugger.step_manager.previousStep();
  }

  currentStep() {
    if (!this.debugger.step_manager) return 0;
    return this.debugger.step_manager.currentStepIndex;
  }

  canGoNext() {
    return this.currentStep() < this.getCodeTraceLength();
  }

  canGoPrevious() {
    return this.currentStep() > this.getCodeFirstStep();
  }

  unload() {
    return this.debugger.unload();
  }

  displayLocals() {
    console.dir('= displayLocals');
    console.dir(this.solidityLocals);
  }

  displayGlobals() {
    console.dir('= displayGlobals');
    console.dir(this.solidityState);
  }

}

exports.CmdLine = CmdLine;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/code/breakpointManager.js":
/*!************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/code/breakpointManager.js ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BreakpointManager = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const eventManager_1 = __webpack_require__(/*! ../eventManager */ "../../../dist/libs/remix-debug/src/eventManager.js");

const traceHelper_1 = __webpack_require__(/*! ../trace/traceHelper */ "../../../dist/libs/remix-debug/src/trace/traceHelper.js");
/**
  * allow to manage breakpoint
  *
  * Trigger events: breakpointHit, breakpointAdded, breakpointRemoved
  */


class BreakpointManager {
  /**
    * constructor
    *
    * @param {Object} _debugger - type of EthDebugger
    * @return {Function} _locationToRowConverter - function implemented by editor which return a column/line position for a char source location
    */
  constructor({
    traceManager,
    callTree,
    solidityProxy,
    locationToRowConverter
  }) {
    this.event = new eventManager_1.EventManager();
    this.traceManager = traceManager;
    this.callTree = callTree;
    this.solidityProxy = solidityProxy;
    this.breakpoints = {};
    this.locationToRowConverter = locationToRowConverter;
  }

  setManagers({
    traceManager,
    callTree,
    solidityProxy
  }) {
    this.traceManager = traceManager;
    this.callTree = callTree;
    this.solidityProxy = solidityProxy;
  }
  /**
    * start looking for the next breakpoint
    * @param {Bool} defaultToLimit - if true jump to the end of the trace if no more breakpoint found
    *
    */


  jumpNextBreakpoint(fromStep, defaultToLimit) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      if (!this.locationToRowConverter) {
        return console.log('row converter not provided');
      }

      this.jump(fromStep || 0, 1, defaultToLimit, this.traceManager.trace);
    });
  }
  /**
    * start looking for the previous breakpoint
    * @param {Bool} defaultToLimit - if true jump to the start of the trace if no more breakpoint found
    *
    */


  jumpPreviousBreakpoint(fromStep, defaultToLimit) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      if (!this.locationToRowConverter) {
        return console.log('row converter not provided');
      }

      this.jump(fromStep || 0, -1, defaultToLimit, this.traceManager.trace);
    });
  }

  depthChange(step, trace) {
    return trace[step].depth !== trace[step - 1].depth;
  }

  hitLine(currentStep, sourceLocation, previousSourceLocation, trace) {
    // isJumpDestInstruction -> returning from a internal function call
    // depthChange -> returning from an external call
    // sourceLocation.start <= previousSourceLocation.start && ... -> previous src is contained in the current one
    if ((0, traceHelper_1.isJumpDestInstruction)(trace[currentStep]) && previousSourceLocation.jump === 'o' || this.depthChange(currentStep, trace) || sourceLocation.start <= previousSourceLocation.start && sourceLocation.start + sourceLocation.length >= previousSourceLocation.start + previousSourceLocation.length) {
      return false;
    }

    this.event.trigger('breakpointStep', [currentStep]);
    this.event.trigger('breakpointHit', [sourceLocation, currentStep]);
    return true;
  }
  /**
    * start looking for the previous or next breakpoint
    * @param {Int} direction - 1 or -1 direction of the search
    * @param {Bool} defaultToLimit - if true jump to the limit (end if direction is 1, beginning if direction is -1) of the trace if no more breakpoint found
    *
    */


  jump(fromStep, direction, defaultToLimit, trace) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      let sourceLocation;
      let previousSourceLocation;
      let currentStep = fromStep + direction;
      let lineHadBreakpoint = false;
      let initialLine;

      while (currentStep > 0 && currentStep < trace.length) {
        try {
          previousSourceLocation = sourceLocation;
          sourceLocation = yield this.callTree.extractValidSourceLocation(currentStep);
        } catch (e) {
          console.log('cannot jump to breakpoint ' + e);
          currentStep += direction;
          continue;
        }

        const lineColumn = yield this.locationToRowConverter(sourceLocation);
        if (!initialLine) initialLine = lineColumn;

        if (initialLine.start.line !== lineColumn.start.line) {
          if (direction === -1 && lineHadBreakpoint) {
            // TODO : improve this when we will build the correct structure before hand
            lineHadBreakpoint = false;

            if (this.hitLine(currentStep + 1, previousSourceLocation, sourceLocation, trace)) {
              return;
            }
          }

          if (this.hasBreakpointAtLine(sourceLocation.file, lineColumn.start.line)) {
            lineHadBreakpoint = true;

            if (direction === 1 && this.hitLine(currentStep, sourceLocation, previousSourceLocation, trace)) {
              return;
            }
          }
        }

        currentStep += direction;
      }

      this.event.trigger('NoBreakpointHit', []);

      if (!defaultToLimit) {
        return;
      }

      if (direction === -1) {
        this.event.trigger('breakpointStep', [0]);
      } else if (direction === 1) {
        this.event.trigger('breakpointStep', [trace.length - 1]);
      }
    });
  }
  /**
    * check the given pair fileIndex/line against registered breakpoints
    *
    * @param {Int} fileIndex - index of the file content (from the compilation result)
    * @param {Int} line - line number where looking for breakpoint
    * @return {Bool} return true if the given @arg fileIndex @arg line refers to a breakpoint
    */


  hasBreakpointAtLine(fileIndex, line) {
    const filename = this.solidityProxy.fileNameFromIndex(fileIndex);

    if (!(filename && this.breakpoints[filename])) {
      return false;
    }

    const sources = this.breakpoints[filename];

    for (const k in sources) {
      const source = sources[k];

      if (line === source.row) {
        return true;
      }
    }
  }
  /**
    * return true if current manager has breakpoint
    *
    * @return {Bool} true if breapoint registered
    */


  hasBreakpoint() {
    for (const k in this.breakpoints) {
      if (this.breakpoints[k].length) {
        return true;
      }
    }

    return false;
  }
  /**
    * add a new breakpoint to the manager
    *
    * @param {Object} sourceLocation - position of the breakpoint { file: '<file index>', row: '<line number' }
    */


  add(sourceLocation) {
    if (!this.breakpoints[sourceLocation.fileName]) {
      this.breakpoints[sourceLocation.fileName] = [];
    }

    this.breakpoints[sourceLocation.fileName].push(sourceLocation);
    this.event.trigger('breakpointAdded', [sourceLocation]);
  }
  /**
    * remove a breakpoint from the manager
    *
    * @param {Object} sourceLocation - position of the breakpoint { file: '<file index>', row: '<line number' }
    */


  remove(sourceLocation) {
    var sources = this.breakpoints[sourceLocation.fileName];

    if (!sources) {
      return;
    }

    for (const k in sources) {
      const source = sources[k];

      if (sourceLocation.row === source.row) {
        sources.splice(k, 1);
        this.event.trigger('breakpointRemoved', [sourceLocation]);
        break;
      }
    }
  }

}

exports.BreakpointManager = BreakpointManager;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/code/codeManager.js":
/*!******************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/code/codeManager.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CodeManager = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const eventManager_1 = __webpack_require__(/*! ../eventManager */ "../../../dist/libs/remix-debug/src/eventManager.js");

const traceHelper_1 = __webpack_require__(/*! ../trace/traceHelper */ "../../../dist/libs/remix-debug/src/trace/traceHelper.js");

const sourceMappingDecoder_1 = __webpack_require__(/*! ../source/sourceMappingDecoder */ "../../../dist/libs/remix-debug/src/source/sourceMappingDecoder.js");

const codeResolver_1 = __webpack_require__(/*! ./codeResolver */ "../../../dist/libs/remix-debug/src/code/codeResolver.js");
/*
  resolve contract code referenced by vmtrace in order to be used by asm listview.
  events:
   - changed: triggered when an item is selected
   - resolvingStep: when CodeManager resolves code/selected instruction of a new step
*/


class CodeManager {
  constructor(_traceManager) {
    this.event = new eventManager_1.EventManager();
    this.isLoading = false;
    this.traceManager = _traceManager;
    this.codeResolver = new codeResolver_1.CodeResolver({
      getCode: address => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
          this.traceManager.web3.eth.getCode(address, (error, code) => {
            if (error) {
              return reject(error);
            }

            return resolve(code);
          });
        });
      }),
      fork: this.traceManager.getCurrentFork()
    });
  }
  /**
   * clear the cache
   *
   */


  clear() {
    this.codeResolver.clear();
  }
  /**
   * resolve the code of the given @arg stepIndex and trigger appropriate event
   *
   * @param {String} stepIndex - vm trace step
   * @param {Object} tx - transaction (given by web3)
   */


  resolveStep(stepIndex, tx) {
    if (stepIndex < 0) return;
    this.event.trigger('resolvingStep');

    if (stepIndex === 0) {
      return this.retrieveCodeAndTrigger(this, tx.to, stepIndex, tx);
    }

    try {
      const address = this.traceManager.getCurrentCalledAddressAt(stepIndex);
      this.retrieveCodeAndTrigger(this, address, stepIndex, tx);
    } catch (error) {
      return console.log(error);
    }
  }
  /**
   * Retrieve the code located at the given @arg address
   *
   * @param {String} address - address of the contract to get the code from
   * @param {Function} cb - callback function, return the bytecode
   */


  getCode(address) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      if (!(0, traceHelper_1.isContractCreation)(address)) {
        const code = yield this.codeResolver.resolveCode(address);
        return code;
      }

      var codes = this.codeResolver.getExecutingCodeFromCache(address);

      if (codes) {
        return codes;
      }

      const hexCode = this.traceManager.getContractCreationCode(address);
      codes = this.codeResolver.cacheExecutingCode(address, hexCode);
      return codes;
    });
  }
  /**
   * Retrieve the called function for the current vm step for the given @arg address
   *
   * @param {String} stepIndex - vm trace step
   * @param {String} sourceMap - source map given byt the compilation result
   * @param {Object} ast - ast given by the compilation result
   * @return {Object} return the ast node of the function
   */


  getFunctionFromStep(stepIndex, sourceMap, ast) {
    try {
      const address = this.traceManager.getCurrentCalledAddressAt(stepIndex);
      const pc = this.traceManager.getCurrentPC(stepIndex);
      return this.getFunctionFromPC(address, pc, sourceMap, ast);
    } catch (error) {
      console.log(error);
      return {
        error: 'Cannot retrieve current address or PC for ' + stepIndex
      };
    }
  }
  /**
   * Retrieve the instruction index of the given @arg step
   *
   * @param {String} address - address of the current context
   * @param {String} step - vm trace step
   * @param {Function} callback - instruction index
   */


  getInstructionIndex(address, step) {
    try {
      const pc = this.traceManager.getCurrentPC(step);
      const itemIndex = this.codeResolver.getInstructionIndex(address, pc);
      return itemIndex;
    } catch (error) {
      console.log(error);
      throw new Error('Cannot retrieve current PC for ' + step);
    }
  }
  /**
   * Retrieve the called function for the given @arg pc and @arg address
   *
   * @param {String} address - address of the current context (used to resolve instruction index)
   * @param {String} pc - pc that point to the instruction index
   * @param {String} sourceMap - source map given byt the compilation result
   * @param {Object} ast - ast given by the compilation result
   * @return {Object} return the ast node of the function
   */


  getFunctionFromPC(address, pc, sourceMap, ast) {
    const instIndex = this.codeResolver.getInstructionIndex(address, pc);
    return (0, sourceMappingDecoder_1.findNodeAtInstructionIndex)('FunctionDefinition', instIndex, sourceMap, ast);
  }

  retrieveCodeAndTrigger(codeMananger, address, stepIndex, tx) {
    codeMananger.getCode(address).then(result => {
      this.retrieveIndexAndTrigger(codeMananger, address, stepIndex, result.instructions);
    }).catch(error => {
      return console.log(error);
    });
  }

  retrieveIndexAndTrigger(codeMananger, address, step, code) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      let result;
      const next = [];
      const returnInstructionIndexes = [];
      const outOfGasInstructionIndexes = [];

      try {
        result = codeMananger.getInstructionIndex(address, step);

        for (let i = 1; i < 6; i++) {
          if (this.traceManager.inRange(step + i)) {
            next.push(codeMananger.getInstructionIndex(address, step + i));
          }
        }

        let values = this.traceManager.getAllStopIndexes();

        if (values) {
          for (const value of values) {
            if (value.address === address) {
              returnInstructionIndexes.push({
                instructionIndex: this.getInstructionIndex(address, value.index),
                address
              });
            }
          }
        }

        values = this.traceManager.getAllOutofGasIndexes();

        if (values) {
          for (const value of values) {
            if (value.address === address) {
              outOfGasInstructionIndexes.push({
                instructionIndex: this.getInstructionIndex(address, value.index),
                address
              });
            }
          }
        }
      } catch (error) {
        return console.log(error);
      }

      try {
        codeMananger.event.trigger('changed', [code, address, result, next, returnInstructionIndexes, outOfGasInstructionIndexes]);
      } catch (e) {
        console.log('dispatching event failed', e);
      }
    });
  }

}

exports.CodeManager = CodeManager;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/code/codeResolver.js":
/*!*******************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/code/codeResolver.js ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CodeResolver = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const codeUtils_1 = __webpack_require__(/*! ./codeUtils */ "../../../dist/libs/remix-debug/src/code/codeUtils.js");

class CodeResolver {
  constructor({
    getCode,
    fork
  }) {
    this.getCode = getCode;
    this.bytecodeByAddress = {}; // bytes code by contract addesses

    this.instructionsByAddress = {}; // assembly items instructions list by contract addesses

    this.instructionsIndexByBytesOffset = {}; // mapping between bytes offset and instructions index.

    this.fork = fork;
  }

  clear() {
    this.bytecodeByAddress = {};
    this.instructionsByAddress = {};
    this.instructionsIndexByBytesOffset = {};
  }

  resolveCode(address) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      const cache = this.getExecutingCodeFromCache(address);

      if (cache) {
        return cache;
      }

      const code = yield this.getCode(address);
      return this.cacheExecutingCode(address, code);
    });
  }

  cacheExecutingCode(address, hexCode) {
    const codes = this.formatCode(hexCode);
    this.bytecodeByAddress[address] = hexCode;
    this.instructionsByAddress[address] = codes.code;
    this.instructionsIndexByBytesOffset[address] = codes.instructionsIndexByBytesOffset;
    return this.getExecutingCodeFromCache(address);
  }

  formatCode(hexCode) {
    const [code, instructionsIndexByBytesOffset] = (0, codeUtils_1.nameOpCodes)(Buffer.from(hexCode.substring(2), 'hex'), this.fork);
    return {
      code,
      instructionsIndexByBytesOffset
    };
  }

  getExecutingCodeFromCache(address) {
    if (!this.instructionsByAddress[address]) {
      return null;
    }

    return {
      instructions: this.instructionsByAddress[address],
      instructionsIndexByBytesOffset: this.instructionsIndexByBytesOffset[address],
      bytecode: this.bytecodeByAddress[address]
    };
  }

  getInstructionIndex(address, pc) {
    return this.getExecutingCodeFromCache(address).instructionsIndexByBytesOffset[pc];
  }

}

exports.CodeResolver = CodeResolver;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../node_modules/node-libs-browser/node_modules/buffer/index.js */ "../../../node_modules/node-libs-browser/node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/code/codeUtils.js":
/*!****************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/code/codeUtils.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.roundLog = exports.log = exports.pad = exports.parseCode = exports.nameOpCodes = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const common_1 = (0, tslib_1.__importDefault)(__webpack_require__(/*! @ethereumjs/common */ "../../../node_modules/@ethereumjs/common/dist.browser/index.js"));

const opcodes_1 = __webpack_require__(/*! @ethereumjs/vm/dist/evm/opcodes */ "../../../node_modules/@ethereumjs/vm/dist/evm/opcodes/index.js");

const opcodes_2 = (0, tslib_1.__importDefault)(__webpack_require__(/*! ./opcodes */ "../../../dist/libs/remix-debug/src/code/opcodes.js"));

function nameOpCodes(raw, hardfork) {
  const common = new common_1.default({
    chain: 'mainnet',
    hardfork
  });
  const opcodes = (0, opcodes_1.getOpcodesForHF)(common);
  let pushData = '';
  const codeMap = {};
  const code = [];

  for (let i = 0; i < raw.length; i++) {
    const pc = i;
    let curOpCode;

    try {
      curOpCode = opcodes.get(raw[pc]).fullName;
    } catch (e) {
      curOpCode = 'INVALID';
    }

    codeMap[i] = code.length; // no destinations into the middle of PUSH

    if (curOpCode.slice(0, 4) === 'PUSH') {
      const jumpNum = raw[pc] - 0x5f;
      pushData = raw.slice(pc + 1, pc + jumpNum + 1);
      i += jumpNum;
    }

    const data = pushData.toString('hex') !== '' ? ' ' + pushData.toString('hex') : '';
    code.push(pad(pc, roundLog(raw.length, 10)) + ' ' + curOpCode + data);
    pushData = '';
  }

  return [code, codeMap];
}

exports.nameOpCodes = nameOpCodes;
/**
 * Parses code as a list of integers into a list of objects containing
 * information about the opcode.
 */

function parseCode(raw) {
  const common = new common_1.default({
    chain: 'mainnet',
    hardfork: 'london'
  });
  const opcodes = (0, opcodes_1.getOpcodesForHF)(common);
  const code = [];

  for (let i = 0; i < raw.length; i++) {
    const opcode = {
      name: 'INVALID'
    };

    try {
      const code = opcodes.get(raw[i]);
      const opcodeDetails = (0, opcodes_2.default)(raw[i], false);
      opcode.in = opcodeDetails.in;
      opcode.out = opcodeDetails.out;
      opcode.name = code.fullName;
    } catch (e) {
      opcode.name = 'INVALID';
    }

    if (opcode.name.slice(0, 4) === 'PUSH') {
      const length = raw[i] - 0x5f;
      opcode.pushData = raw.slice(i + 1, i + length + 1); // in case pushdata extends beyond code

      if (i + 1 + length > raw.length) {
        for (let j = opcode['pushData'].length; j < length; j++) {
          opcode['pushData'].push(0);
        }
      }

      i += length;
    }

    code.push(opcode);
  }

  return code;
}

exports.parseCode = parseCode;

function pad(num, size) {
  let s = num + '';

  while (s.length < size) s = '0' + s;

  return s;
}

exports.pad = pad;

function log(num, base) {
  return Math.log(num) / Math.log(base);
}

exports.log = log;

function roundLog(num, base) {
  return Math.ceil(log(num, base));
}

exports.roundLog = roundLog;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/code/opcodes.js":
/*!**************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/code/opcodes.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function default_1(op, full) {
  const codes = {
    // 0x0 range - arithmetic ops
    // name, baseCost, off stack, on stack, dynamic, async
    // @todo can be improved on basis of this: https://github.com/ethereumjs/ethereumjs-vm/blob/master/lib/evm/opcodes.ts
    0x00: ['STOP', 0, 0, 0, false],
    0x01: ['ADD', 3, 2, 1, false],
    0x02: ['MUL', 5, 2, 1, false],
    0x03: ['SUB', 3, 2, 1, false],
    0x04: ['DIV', 5, 2, 1, false],
    0x05: ['SDIV', 5, 2, 1, false],
    0x06: ['MOD', 5, 2, 1, false],
    0x07: ['SMOD', 5, 2, 1, false],
    0x08: ['ADDMOD', 8, 3, 1, false],
    0x09: ['MULMOD', 8, 3, 1, false],
    0x0a: ['EXP', 10, 2, 1, false],
    0x0b: ['SIGNEXTEND', 5, 2, 1, false],
    // 0x10 range - bit ops
    0x10: ['LT', 3, 2, 1, false],
    0x11: ['GT', 3, 2, 1, false],
    0x12: ['SLT', 3, 2, 1, false],
    0x13: ['SGT', 3, 2, 1, false],
    0x14: ['EQ', 3, 2, 1, false],
    0x15: ['ISZERO', 3, 1, 1, false],
    0x16: ['AND', 3, 2, 1, false],
    0x17: ['OR', 3, 2, 1, false],
    0x18: ['XOR', 3, 2, 1, false],
    0x19: ['NOT', 3, 1, 1, false],
    0x1a: ['BYTE', 3, 2, 1, false],
    0x1b: ['SHL', 3, 2, 1, false],
    0x1c: ['SHR', 3, 2, 1, false],
    0x1d: ['SAR', 3, 2, 1, false],
    // 0x20 range - crypto
    0x20: ['SHA3', 30, 2, 1, false],
    // 0x30 range - closure state
    0x30: ['ADDRESS', 2, 0, 1, true],
    0x31: ['BALANCE', 700, 1, 1, true, true],
    0x32: ['ORIGIN', 2, 0, 1, true],
    0x33: ['CALLER', 2, 0, 1, true],
    0x34: ['CALLVALUE', 2, 0, 1, true],
    0x35: ['CALLDATALOAD', 3, 1, 1, true],
    0x36: ['CALLDATASIZE', 2, 0, 1, true],
    0x37: ['CALLDATACOPY', 3, 3, 0, true],
    0x38: ['CODESIZE', 2, 0, 1, false],
    0x39: ['CODECOPY', 3, 3, 0, false],
    0x3a: ['GASPRICE', 2, 0, 1, false],
    0x3b: ['EXTCODESIZE', 700, 1, 1, true, true],
    0x3c: ['EXTCODECOPY', 700, 4, 0, true, true],
    0x3d: ['RETURNDATASIZE', 2, 0, 1, true],
    0x3e: ['RETURNDATACOPY', 3, 3, 0, true],
    0x3f: ['EXTCODEHASH', 400, 3, 0, true],
    // '0x40' range - block operations
    0x40: ['BLOCKHASH', 20, 1, 1, true, true],
    0x41: ['COINBASE', 2, 0, 1, true],
    0x42: ['TIMESTAMP', 2, 0, 1, true],
    0x43: ['NUMBER', 2, 0, 1, true],
    0x44: ['DIFFICULTY', 2, 0, 1, true],
    0x45: ['GASLIMIT', 2, 0, 1, true],
    0x46: ['CHAINID', 2, 0, 1, false],
    0x47: ['SELFBALANCE', 5, 0, 1, false],
    // 0x50 range - 'storage' and execution
    0x50: ['POP', 2, 1, 0, false],
    0x51: ['MLOAD', 3, 1, 1, false],
    0x52: ['MSTORE', 3, 2, 0, false],
    0x53: ['MSTORE8', 3, 2, 0, false],
    0x54: ['SLOAD', 800, 1, 1, true, true],
    0x55: ['SSTORE', 0, 2, 0, true, true],
    0x56: ['JUMP', 8, 1, 0, false],
    0x57: ['JUMPI', 10, 2, 0, false],
    0x58: ['PC', 2, 0, 1, false],
    0x59: ['MSIZE', 2, 0, 1, false],
    0x5a: ['GAS', 2, 0, 1, false],
    0x5b: ['JUMPDEST', 1, 0, 0, false],
    // 0x60, range
    0x60: ['PUSH1', 3, 0, 1, false],
    0x61: ['PUSH2', 3, 0, 1, false],
    0x62: ['PUSH3', 3, 0, 1, false],
    0x63: ['PUSH4', 3, 0, 1, false],
    0x64: ['PUSH5', 3, 0, 1, false],
    0x65: ['PUSH6', 3, 0, 1, false],
    0x66: ['PUSH7', 3, 0, 1, false],
    0x67: ['PUSH8', 3, 0, 1, false],
    0x68: ['PUSH9', 3, 0, 1, false],
    0x69: ['PUSH10', 3, 0, 1, false],
    0x6a: ['PUSH11', 3, 0, 1, false],
    0x6b: ['PUSH12', 3, 0, 1, false],
    0x6c: ['PUSH13', 3, 0, 1, false],
    0x6d: ['PUSH14', 3, 0, 1, false],
    0x6e: ['PUSH15', 3, 0, 1, false],
    0x6f: ['PUSH16', 3, 0, 1, false],
    0x70: ['PUSH17', 3, 0, 1, false],
    0x71: ['PUSH18', 3, 0, 1, false],
    0x72: ['PUSH19', 3, 0, 1, false],
    0x73: ['PUSH20', 3, 0, 1, false],
    0x74: ['PUSH21', 3, 0, 1, false],
    0x75: ['PUSH22', 3, 0, 1, false],
    0x76: ['PUSH23', 3, 0, 1, false],
    0x77: ['PUSH24', 3, 0, 1, false],
    0x78: ['PUSH25', 3, 0, 1, false],
    0x79: ['PUSH26', 3, 0, 1, false],
    0x7a: ['PUSH27', 3, 0, 1, false],
    0x7b: ['PUSH28', 3, 0, 1, false],
    0x7c: ['PUSH29', 3, 0, 1, false],
    0x7d: ['PUSH30', 3, 0, 1, false],
    0x7e: ['PUSH31', 3, 0, 1, false],
    0x7f: ['PUSH32', 3, 0, 1, false],
    0x80: ['DUP1', 3, 0, 1, false],
    0x81: ['DUP2', 3, 0, 1, false],
    0x82: ['DUP3', 3, 0, 1, false],
    0x83: ['DUP4', 3, 0, 1, false],
    0x84: ['DUP5', 3, 0, 1, false],
    0x85: ['DUP6', 3, 0, 1, false],
    0x86: ['DUP7', 3, 0, 1, false],
    0x87: ['DUP8', 3, 0, 1, false],
    0x88: ['DUP9', 3, 0, 1, false],
    0x89: ['DUP10', 3, 0, 1, false],
    0x8a: ['DUP11', 3, 0, 1, false],
    0x8b: ['DUP12', 3, 0, 1, false],
    0x8c: ['DUP13', 3, 0, 1, false],
    0x8d: ['DUP14', 3, 0, 1, false],
    0x8e: ['DUP15', 3, 0, 1, false],
    0x8f: ['DUP16', 3, 0, 1, false],
    0x90: ['SWAP1', 3, 0, 0, false],
    0x91: ['SWAP2', 3, 0, 0, false],
    0x92: ['SWAP3', 3, 0, 0, false],
    0x93: ['SWAP4', 3, 0, 0, false],
    0x94: ['SWAP5', 3, 0, 0, false],
    0x95: ['SWAP6', 3, 0, 0, false],
    0x96: ['SWAP7', 3, 0, 0, false],
    0x97: ['SWAP8', 3, 0, 0, false],
    0x98: ['SWAP9', 3, 0, 0, false],
    0x99: ['SWAP10', 3, 0, 0, false],
    0x9a: ['SWAP11', 3, 0, 0, false],
    0x9b: ['SWAP12', 3, 0, 0, false],
    0x9c: ['SWAP13', 3, 0, 0, false],
    0x9d: ['SWAP14', 3, 0, 0, false],
    0x9e: ['SWAP15', 3, 0, 0, false],
    0x9f: ['SWAP16', 3, 0, 0, false],
    0xa0: ['LOG0', 375, 2, 0, false],
    0xa1: ['LOG1', 375, 3, 0, false],
    0xa2: ['LOG2', 375, 4, 0, false],
    0xa3: ['LOG3', 375, 5, 0, false],
    0xa4: ['LOG4', 375, 6, 0, false],
    // '0xf0' range - closures
    0xf0: ['CREATE', 32000, 3, 1, true, true],
    0xf1: ['CALL', 700, 7, 1, true, true],
    0xf2: ['CALLCODE', 700, 7, 1, true, true],
    0xf3: ['RETURN', 0, 2, 0, false],
    0xf4: ['DELEGATECALL', 700, 6, 1, true, true],
    0xf5: ['CREATE2', 32000, 4, 1, true, true],
    0xfa: ['STATICCALL', 700, 6, 1, true, true],
    0xfd: ['REVERT', 0, 2, 0, false],
    // '0x70', range - other
    0xfe: ['INVALID', 0, 0, 0, false],
    0xff: ['SELFDESTRUCT', 5000, 1, 0, false, true]
  };
  const code = codes[op] ? codes[op] : ['INVALID', 0, 0, 0, false, false];
  let opcode = code[0];

  if (full) {
    if (opcode === 'LOG') {
      opcode += op - 0xa0;
    }

    if (opcode === 'PUSH') {
      opcode += op - 0x5f;
    }

    if (opcode === 'DUP') {
      opcode += op - 0x7f;
    }

    if (opcode === 'SWAP') {
      opcode += op - 0x8f;
    }
  }

  return {
    name: opcode,
    fee: code[1],
    in: code[2],
    out: code[3],
    dynamic: code[4],
    async: code[5]
  };
}

exports.default = default_1;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/debugger/VmDebugger.js":
/*!*********************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/debugger/VmDebugger.js ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VmDebuggerLogic = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const eventManager_1 = __webpack_require__(/*! ../eventManager */ "../../../dist/libs/remix-debug/src/eventManager.js");

const storageResolver_1 = __webpack_require__(/*! ../storage/storageResolver */ "../../../dist/libs/remix-debug/src/storage/storageResolver.js");

const storageViewer_1 = __webpack_require__(/*! ../storage/storageViewer */ "../../../dist/libs/remix-debug/src/storage/storageViewer.js");

const remix_lib_1 = __webpack_require__(/*! @remix-project/remix-lib */ "../../../dist/libs/remix-lib/src/index.js");

const solidityState_1 = __webpack_require__(/*! ./solidityState */ "../../../dist/libs/remix-debug/src/debugger/solidityState.js");

const solidityLocals_1 = __webpack_require__(/*! ./solidityLocals */ "../../../dist/libs/remix-debug/src/debugger/solidityLocals.js");

const {
  ui
} = remix_lib_1.helpers;

class VmDebuggerLogic {
  constructor(_debugger, tx, _stepManager, _traceManager, _codeManager, _solidityProxy, _callTree) {
    this.event = new eventManager_1.EventManager();
    this.debugger = _debugger;
    this.stepManager = _stepManager;
    this._traceManager = _traceManager;
    this._codeManager = _codeManager;
    this._solidityProxy = _solidityProxy;
    this._callTree = _callTree;
    this.storageResolver = null;
    this.tx = tx;
    this.debuggerSolidityState = new solidityState_1.DebuggerSolidityState(tx, _stepManager, _traceManager, _codeManager, _solidityProxy);
    this.debuggerSolidityLocals = new solidityLocals_1.DebuggerSolidityLocals(tx, _stepManager, _traceManager, _callTree);
  }

  start() {
    this.listenToEvents();
    this.listenToCodeManagerEvents();
    this.listenToTraceManagerEvents();
    this.listenToFullStorageChanges();
    this.listenToNewChanges();
    this.listenToSolidityStateEvents();
    this.listenToSolidityLocalsEvents();
  }

  listenToEvents() {
    this.debugger.event.register('traceUnloaded', () => {
      this.event.trigger('traceUnloaded');
    });
    this.debugger.event.register('newTraceLoaded', () => {
      this.event.trigger('newTraceLoaded');
    });
  }

  listenToCodeManagerEvents() {
    this._codeManager.event.register('changed', (code, address, index, nextIndexes, returnInstructionIndexes, outOfGasInstructionIndexes) => {
      this.event.trigger('codeManagerChanged', [code, address, index, nextIndexes, returnInstructionIndexes, outOfGasInstructionIndexes]);
    });
  }

  listenToTraceManagerEvents() {
    this.event.register('indexChanged', this, index => {
      if (index < 0) return;
      if (this.stepManager.currentStepIndex !== index) return;
      this.event.trigger('indexUpdate', [index]);
      this.event.trigger('functionsStackUpdate', [this._callTree.retrieveFunctionsStack(index)]);

      try {
        const calldata = this._traceManager.getCallDataAt(index);

        if (this.stepManager.currentStepIndex === index) {
          this.event.trigger('traceManagerCallDataUpdate', [calldata]);
        }
      } catch (error) {
        this.event.trigger('traceManagerCallDataUpdate', [{}]);
      }

      try {
        const memory = this._traceManager.getMemoryAt(index);

        if (this.stepManager.currentStepIndex === index) {
          this.event.trigger('traceManagerMemoryUpdate', [ui.formatMemory(memory, 16)]);
        }
      } catch (error) {
        this.event.trigger('traceManagerMemoryUpdate', [{}]);
      }

      try {
        const callstack = this._traceManager.getCallStackAt(index);

        if (this.stepManager.currentStepIndex === index) {
          this.event.trigger('traceManagerCallStackUpdate', [callstack]);
        }
      } catch (error) {
        this.event.trigger('traceManagerCallStackUpdate', [{}]);
      }

      try {
        const callstack = this._traceManager.getStackAt(index);

        if (this.stepManager.currentStepIndex === index) {
          this.event.trigger('traceManagerStackUpdate', [callstack]);
        }
      } catch (error) {
        this.event.trigger('traceManagerStackUpdate', [{}]);
      }

      try {
        const address = this._traceManager.getCurrentCalledAddressAt(index);

        if (!this.storageResolver) return;
        var storageViewer = new storageViewer_1.StorageViewer({
          stepIndex: this.stepManager.currentStepIndex,
          tx: this.tx,
          address: address
        }, this.storageResolver, this._traceManager);
        storageViewer.storageRange().then(storage => {
          if (this.stepManager.currentStepIndex === index) {
            var header = storageViewer.isComplete(address) ? '[Completely Loaded]' : '[Partially Loaded]';
            this.event.trigger('traceManagerStorageUpdate', [storage, header]);
          }
        }).catch(_error => {
          this.event.trigger('traceManagerStorageUpdate', [{}]);
        });
      } catch (error) {
        this.event.trigger('traceManagerStorageUpdate', [{}]);
      }

      try {
        const step = this._traceManager.getCurrentStep(index);

        this.event.trigger('traceCurrentStepUpdate', [null, step]);
      } catch (error) {
        this.event.trigger('traceCurrentStepUpdate', [error]);
      }

      try {
        const addmem = this._traceManager.getMemExpand(index);

        this.event.trigger('traceMemExpandUpdate', [null, addmem]);
      } catch (error) {
        this.event.trigger('traceMemExpandUpdate', [error]);
      }

      try {
        const gas = this._traceManager.getStepCost(index);

        this.event.trigger('traceStepCostUpdate', [null, gas]);
      } catch (error) {
        this.event.trigger('traceStepCostUpdate', [error]);
      }

      try {
        const address = this._traceManager.getCurrentCalledAddressAt(index);

        this.event.trigger('traceCurrentCalledAddressAtUpdate', [null, address]);
      } catch (error) {
        this.event.trigger('traceCurrentCalledAddressAtUpdate', [error]);
      }

      try {
        const remaining = this._traceManager.getRemainingGas(index);

        this.event.trigger('traceRemainingGasUpdate', [null, remaining]);
      } catch (error) {
        this.event.trigger('traceRemainingGasUpdate', [error]);
      }

      try {
        const returnValue = this._traceManager.getReturnValue(index);

        if (this.stepManager.currentStepIndex === index) {
          this.event.trigger('traceReturnValueUpdate', [[returnValue]]);
        }
      } catch (error) {
        this.event.trigger('traceReturnValueUpdate', [[error]]);
      }
    });
  }

  listenToFullStorageChanges() {
    this.address = [];
    this.traceLength = 0;
    this.debugger.event.register('newTraceLoaded', length => {
      const addresses = this._traceManager.getAddresses();

      this.event.trigger('traceAddressesUpdate', [addresses]);
      this.addresses = addresses;

      this._traceManager.getLength((error, length) => {
        if (error) return;
        this.event.trigger('traceLengthUpdate', [length]);
        this.traceLength = length;
      });
    });
    this.debugger.event.register('indexChanged', this, index => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      if (index < 0) return;
      if (this.stepManager.currentStepIndex !== index) return;
      if (!this.storageResolver) return; // Clean up storage update

      if (index === this.traceLength - 1) {
        return this.event.trigger('traceStorageUpdate', [{}]);
      }

      var storageJSON = {};

      for (var k in this.addresses) {
        var address = this.addresses[k];
        var storageViewer = new storageViewer_1.StorageViewer({
          stepIndex: this.stepManager.currentStepIndex,
          tx: this.tx,
          address: address
        }, this.storageResolver, this._traceManager);

        try {
          storageJSON[address] = yield storageViewer.storageRange();
        } catch (e) {
          console.error(e);
        }
      }

      this.event.trigger('traceStorageUpdate', [storageJSON]);
    }));
  }

  listenToNewChanges() {
    this.debugger.event.register('newTraceLoaded', this, () => {
      this.storageResolver = new storageResolver_1.StorageResolver({
        web3: this.debugger.web3
      });
      this.debuggerSolidityState.storageResolver = this.storageResolver;
      this.debuggerSolidityLocals.storageResolver = this.storageResolver;
      this.event.trigger('newTrace', []);
    });
    this.debugger.callTree.event.register('callTreeReady', () => {
      if (this.debugger.callTree.reducedTrace.length) {
        return this.event.trigger('newCallTree', []);
      }
    });
  }

  listenToSolidityStateEvents() {
    this.event.register('indexChanged', this.debuggerSolidityState.init.bind(this.debuggerSolidityState));
    this.debuggerSolidityState.event.register('solidityState', state => {
      this.event.trigger('solidityState', [state]);
    });
    this.debuggerSolidityState.event.register('solidityStateMessage', message => {
      this.event.trigger('solidityStateMessage', [message]);
    });
    this.debuggerSolidityState.event.register('solidityStateUpdating', () => {
      this.event.trigger('solidityStateUpdating', []);
    });
    this.event.register('traceUnloaded', this.debuggerSolidityState.reset.bind(this.debuggerSolidityState));
    this.event.register('newTraceLoaded', this.debuggerSolidityState.reset.bind(this.debuggerSolidityState));
  }

  listenToSolidityLocalsEvents() {
    this.event.register('sourceLocationChanged', this.debuggerSolidityLocals.init.bind(this.debuggerSolidityLocals));
    this.event.register('solidityLocalsLoadMore', this.debuggerSolidityLocals.decodeMore.bind(this.debuggerSolidityLocals));
    this.debuggerSolidityLocals.event.register('solidityLocalsLoadMoreCompleted', locals => {
      this.event.trigger('solidityLocalsLoadMoreCompleted', [locals]);
    });
    this.debuggerSolidityLocals.event.register('solidityLocals', state => {
      this.event.trigger('solidityLocals', [state]);
    });
    this.debuggerSolidityLocals.event.register('solidityLocalsMessage', message => {
      this.event.trigger('solidityLocalsMessage', [message]);
    });
    this.debuggerSolidityLocals.event.register('solidityLocalsUpdating', () => {
      this.event.trigger('solidityLocalsUpdating', []);
    });
    this.debuggerSolidityLocals.event.register('traceReturnValueUpdate', (data, header) => {
      this.event.trigger('traceReturnValueUpdate', [data, header]);
    });
  }

}

exports.VmDebuggerLogic = VmDebuggerLogic;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/debugger/debugger.js":
/*!*******************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/debugger/debugger.js ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Debugger = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const Ethdebugger_1 = __webpack_require__(/*! ../Ethdebugger */ "../../../dist/libs/remix-debug/src/Ethdebugger.js");

const eventManager_1 = __webpack_require__(/*! ../eventManager */ "../../../dist/libs/remix-debug/src/eventManager.js");

const traceHelper_1 = __webpack_require__(/*! ../trace/traceHelper */ "../../../dist/libs/remix-debug/src/trace/traceHelper.js");

const breakpointManager_1 = __webpack_require__(/*! ../code/breakpointManager */ "../../../dist/libs/remix-debug/src/code/breakpointManager.js");

const stepManager_1 = __webpack_require__(/*! ./stepManager */ "../../../dist/libs/remix-debug/src/debugger/stepManager.js");

const VmDebugger_1 = __webpack_require__(/*! ./VmDebugger */ "../../../dist/libs/remix-debug/src/debugger/VmDebugger.js");

class Debugger {
  constructor(options) {
    this.event = new eventManager_1.EventManager();
    this.offsetToLineColumnConverter = options.offsetToLineColumnConverter;
    /*
      Returns a compilation result for a given address or the last one available if none are found
    */

    this.compilationResult = options.compilationResult || function (contractAddress) {
      return null;
    };

    this.debugger = new Ethdebugger_1.Ethdebugger({
      web3: options.web3,
      debugWithGeneratedSources: options.debugWithGeneratedSources,
      compilationResult: this.compilationResult
    });
    const {
      traceManager,
      callTree,
      solidityProxy
    } = this.debugger;
    this.breakPointManager = new breakpointManager_1.BreakpointManager({
      traceManager,
      callTree,
      solidityProxy,
      locationToRowConverter: sourceLocation => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const compilationResult = yield this.compilationResult();
        if (!compilationResult) return {
          start: null,
          end: null
        };
        return yield this.offsetToLineColumnConverter.offsetToLineColumn(sourceLocation, sourceLocation.file, compilationResult.source.sources, compilationResult.data.sources);
      })
    });
    this.breakPointManager.event.register('managersChanged', () => {
      const {
        traceManager,
        callTree,
        solidityProxy
      } = this.debugger;
      this.breakPointManager.setManagers({
        traceManager,
        callTree,
        solidityProxy
      });
    });
    this.breakPointManager.event.register('breakpointStep', step => {
      this.step_manager.jumpTo(step);
    });
    this.debugger.setBreakpointManager(this.breakPointManager);
    this.debugger.event.register('newTraceLoaded', this, () => {
      this.event.trigger('debuggerStatus', [true]);
    });
    this.debugger.event.register('traceUnloaded', this, () => {
      this.event.trigger('debuggerStatus', [false]);
    });
  }

  registerAndHighlightCodeItem(index) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      // register selected code item, highlight the corresponding source location
      // this.debugger.traceManager.getCurrentCalledAddressAt(index, async (error, address) => {
      try {
        const address = this.debugger.traceManager.getCurrentCalledAddressAt(index);
        const compilationResultForAddress = yield this.compilationResult(address);
        if (!compilationResultForAddress) return;
        this.debugger.callTree.sourceLocationTracker.getValidSourceLocationFromVMTraceIndex(address, index, compilationResultForAddress.data.contracts).then(rawLocation => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
          if (compilationResultForAddress && compilationResultForAddress.data) {
            const generatedSources = this.debugger.callTree.sourceLocationTracker.getGeneratedSourcesFromAddress(address);
            const astSources = Object.assign({}, compilationResultForAddress.data.sources);
            const sources = Object.assign({}, compilationResultForAddress.source.sources);

            if (generatedSources) {
              for (const genSource of generatedSources) {
                astSources[genSource.name] = {
                  id: genSource.id,
                  ast: genSource.ast
                };
                sources[genSource.name] = {
                  content: genSource.contents
                };
              }
            }

            var lineColumnPos = yield this.offsetToLineColumnConverter.offsetToLineColumn(rawLocation, rawLocation.file, sources, astSources);
            this.event.trigger('newSourceLocation', [lineColumnPos, rawLocation, generatedSources, address]);
          } else {
            this.event.trigger('newSourceLocation', [null]);
          }
        })).catch(_error => {
          this.event.trigger('newSourceLocation', [null]);
        }); // })
      } catch (error) {
        return console.log(error);
      }
    });
  }

  updateWeb3(web3) {
    this.debugger.web3 = web3;
  }

  debug(blockNumber, txNumber, tx, loadingCb) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      const web3 = this.debugger.web3;

      if (this.debugger.traceManager.isLoading) {
        return;
      }

      if (tx) {
        if (!tx.to) {
          tx.to = (0, traceHelper_1.contractCreationToken)('0');
        }

        return yield this.debugTx(tx, loadingCb);
      }

      if (txNumber.indexOf('0x') !== -1) {
        tx = yield web3.eth.getTransaction(txNumber);
        if (!tx) throw new Error('cannot find transaction ' + txNumber);
      } else {
        tx = yield web3.eth.getTransactionFromBlock(blockNumber, txNumber);
        if (!tx) throw new Error('cannot find transaction ' + blockNumber + ' ' + txNumber);
      }

      return yield this.debugTx(tx, loadingCb);
    });
  }

  debugTx(tx, loadingCb) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      this.step_manager = new stepManager_1.DebuggerStepManager(this.debugger, this.debugger.traceManager);
      this.debugger.codeManager.event.register('changed', this, (code, address, instIndex) => {
        if (!this.debugger.solidityProxy.contracts) return;
        this.debugger.callTree.sourceLocationTracker.getValidSourceLocationFromVMTraceIndex(address, this.step_manager.currentStepIndex, this.debugger.solidityProxy.contracts).then(sourceLocation => {
          this.vmDebuggerLogic.event.trigger('sourceLocationChanged', [sourceLocation]);
        });
      });
      this.vmDebuggerLogic = new VmDebugger_1.VmDebuggerLogic(this.debugger, tx, this.step_manager, this.debugger.traceManager, this.debugger.codeManager, this.debugger.solidityProxy, this.debugger.callTree);
      this.vmDebuggerLogic.start();
      this.step_manager.event.register('stepChanged', this, stepIndex => {
        if (typeof stepIndex !== 'number' || stepIndex >= this.step_manager.traceLength) {
          return this.event.trigger('endDebug');
        }

        this.debugger.codeManager.resolveStep(stepIndex, tx);
        this.step_manager.event.trigger('indexChanged', [stepIndex]);
        this.vmDebuggerLogic.event.trigger('indexChanged', [stepIndex]);
        this.vmDebuggerLogic.debugger.event.trigger('indexChanged', [stepIndex]);
        this.registerAndHighlightCodeItem(stepIndex);
      });
      loadingCb();
      yield this.debugger.debug(tx);
    });
  }

  unload() {
    this.debugger.unLoad();
    this.event.trigger('debuggerUnloaded');
  }

}

exports.Debugger = Debugger;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/debugger/solidityLocals.js":
/*!*************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/debugger/solidityLocals.js ***!
  \*************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DebuggerSolidityLocals = void 0;

const eventManager_1 = __webpack_require__(/*! ../eventManager */ "../../../dist/libs/remix-debug/src/eventManager.js");

const localDecoder_1 = __webpack_require__(/*! ../solidity-decoder/localDecoder */ "../../../dist/libs/remix-debug/src/solidity-decoder/localDecoder.js");

const storageViewer_1 = __webpack_require__(/*! ../storage/storageViewer */ "../../../dist/libs/remix-debug/src/storage/storageViewer.js");

class DebuggerSolidityLocals {
  constructor(tx, _stepManager, _traceManager, _internalTreeCall) {
    this.event = new eventManager_1.EventManager();
    this.stepManager = _stepManager;
    this.internalTreeCall = _internalTreeCall;
    this.storageResolver = null;
    this.traceManager = _traceManager;
    this.tx = tx;
  }

  init(sourceLocation) {
    this._sourceLocation = sourceLocation;
    var decodeTimeout = null;

    if (!this.storageResolver) {
      return this.event.trigger('solidityLocalsMessage', ['storage not ready']);
    }

    if (decodeTimeout) {
      window.clearTimeout(decodeTimeout);
    }

    this.event.trigger('solidityLocalsUpdating');
    decodeTimeout = setTimeout(() => {
      this.decode(sourceLocation);
    }, 500);
  }

  decode(sourceLocation, cursor) {
    const self = this;
    this.event.trigger('solidityLocalsMessage', ['']);
    this.traceManager.waterfall([function getStackAt(stepIndex, callback) {
      try {
        const result = self.traceManager.getStackAt(stepIndex);
        callback(null, result);
      } catch (error) {
        callback(error);
      }
    }, function getMemoryAt(stepIndex, callback) {
      try {
        const result = self.traceManager.getMemoryAt(stepIndex);
        callback(null, result);
      } catch (error) {
        callback(error);
      }
    }, function getCurrentCalledAddressAt(stepIndex, next) {
      try {
        const address = self.traceManager.getCurrentCalledAddressAt(stepIndex);
        next(null, address);
      } catch (error) {
        next(error);
      }
    }, function getCallDataAt(stepIndex, next) {
      try {
        const calldata = self.traceManager.getCallDataAt(stepIndex);
        next(null, calldata);
      } catch (error) {
        next(error);
      }
    }], this.stepManager.currentStepIndex, (error, result) => {
      if (error) {
        return error;
      }

      var stack = result[0].value;
      var memory = result[1].value;
      var calldata = result[3].value;

      try {
        var storageViewer = new storageViewer_1.StorageViewer({
          stepIndex: this.stepManager.currentStepIndex,
          tx: this.tx,
          address: result[2].value
        }, this.storageResolver, this.traceManager);
        (0, localDecoder_1.solidityLocals)(this.stepManager.currentStepIndex, this.internalTreeCall, stack, memory, storageViewer, calldata, sourceLocation, cursor).then(locals => {
          if (!cursor) {
            if (!locals['error']) {
              this.event.trigger('solidityLocals', [locals]);
            }

            if (!Object.keys(locals).length) {
              this.event.trigger('solidityLocalsMessage', ['no locals']);
            }
          } else {
            if (!locals['error']) {
              this.event.trigger('solidityLocalsLoadMoreCompleted', [locals]);
            }
          }
        });
      } catch (e) {
        this.event.trigger('solidityLocalsMessage', [e.message]);
      }
    });
  }

  decodeMore(cursor) {
    let decodeTimeout = null;
    if (!this.storageResolver) return this.event.trigger('solidityLocalsMessage', ['storage not ready']);
    if (decodeTimeout) window.clearTimeout(decodeTimeout);
    decodeTimeout = setTimeout(() => {
      this.decode(this._sourceLocation, cursor);
    }, 500);
  }

}

exports.DebuggerSolidityLocals = DebuggerSolidityLocals;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/debugger/solidityState.js":
/*!************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/debugger/solidityState.js ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DebuggerSolidityState = void 0;

const eventManager_1 = __webpack_require__(/*! ../eventManager */ "../../../dist/libs/remix-debug/src/eventManager.js");

const stateDecoder_1 = __webpack_require__(/*! ../solidity-decoder/stateDecoder */ "../../../dist/libs/remix-debug/src/solidity-decoder/stateDecoder.js");

const storageViewer_1 = __webpack_require__(/*! ../storage/storageViewer */ "../../../dist/libs/remix-debug/src/storage/storageViewer.js");

class DebuggerSolidityState {
  constructor(tx, _stepManager, _traceManager, _codeManager, _solidityProxy) {
    this.event = new eventManager_1.EventManager();
    this.storageResolver = null;
    this.stepManager = _stepManager;
    this.traceManager = _traceManager;
    this.codeManager = _codeManager;
    this.solidityProxy = _solidityProxy;
    this.stateVariablesByAddresses = {};
    this.tx = tx;
  }

  init(index) {
    let decodeTimeout = null;

    if (index < 0) {
      return this.event.trigger('solidityStateMessage', ['invalid step index']);
    }

    if (this.stepManager.currentStepIndex !== index) return;

    if (!this.solidityProxy.loaded()) {
      return this.event.trigger('solidityStateMessage', ['invalid step index']);
    }

    if (!this.storageResolver) {
      return;
    }

    if (decodeTimeout) {
      window.clearTimeout(decodeTimeout);
    }

    this.event.trigger('solidityStateUpdating');
    decodeTimeout = setTimeout(() => {
      // necessary due to some states that can crash the debugger
      try {
        this.decode(index);
      } catch (err) {
        console.dir('====> error');
        console.dir(err);
      }
    }, 500);
  }

  reset() {
    this.stateVariablesByAddresses = {};
  }

  decode(index) {
    try {
      const address = this.traceManager.getCurrentCalledAddressAt(this.stepManager.currentStepIndex);

      if (this.stateVariablesByAddresses[address]) {
        return this.extractStateVariables(this.stateVariablesByAddresses[address], address);
      }

      this.solidityProxy.extractStateVariablesAt(index).then(stateVars => {
        this.stateVariablesByAddresses[address] = stateVars;
        this.extractStateVariables(stateVars, address);
      }).catch(_error => {
        this.event.trigger('solidityState', [{}]);
      });
    } catch (error) {
      return this.event.trigger('solidityState', [{}]);
    }
  }

  extractStateVariables(stateVars, address) {
    const storageViewer = new storageViewer_1.StorageViewer({
      stepIndex: this.stepManager.currentStepIndex,
      tx: this.tx,
      address: address
    }, this.storageResolver, this.traceManager);
    (0, stateDecoder_1.decodeState)(stateVars, storageViewer).then(result => {
      this.event.trigger('solidityStateMessage', ['']);

      if (result['error']) {
        return this.event.trigger('solidityStateMessage', [result['error']]);
      }

      this.event.trigger('solidityState', [result]);
    });
  }

}

exports.DebuggerSolidityState = DebuggerSolidityState;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/debugger/stepManager.js":
/*!**********************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/debugger/stepManager.js ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DebuggerStepManager = void 0;

const remix_lib_1 = __webpack_require__(/*! @remix-project/remix-lib */ "../../../dist/libs/remix-lib/src/index.js");

const eventManager_1 = __webpack_require__(/*! ../eventManager */ "../../../dist/libs/remix-debug/src/eventManager.js");

class DebuggerStepManager {
  constructor(_debugger, traceManager) {
    this.event = new eventManager_1.EventManager();
    this.debugger = _debugger;
    this.traceManager = traceManager;
    this.currentStepIndex = 0;
    this.traceLength = 0;
    this.codeTraceLength = 0;
    this.revertionPoint = null;
    this.listenToEvents();
  }

  listenToEvents() {
    this.debugger.event.register('newTraceLoaded', this, () => {
      this.traceManager.getLength((error, newLength) => {
        if (error) {
          return console.log(error);
        }

        if (this.traceLength !== newLength) {
          this.event.trigger('traceLengthChanged', [newLength]);
          this.traceLength = newLength;
          this.codeTraceLength = this.calculateCodeLength();
        }

        this.jumpTo(0);
      });
    });
    this.debugger.callTree.event.register('callTreeReady', () => {
      if (this.debugger.callTree.functionCallStack.length) {
        this.jumpTo(this.debugger.callTree.functionCallStack[0]);
      }
    });
    this.event.register('indexChanged', this, index => {
      if (index < 0) return;
      if (this.currentStepIndex !== index) return;
      this.traceManager.buildCallPath(index).then(callsPath => {
        this.currentCall = callsPath[callsPath.length - 1];

        if (this.currentCall.reverted) {
          const revertedReason = this.currentCall.outofgas ? 'outofgas' : '';
          this.revertionPoint = this.currentCall.return;
          return this.event.trigger('revertWarning', [revertedReason]);
        }

        for (var k = callsPath.length - 2; k >= 0; k--) {
          var parent = callsPath[k];
          if (!parent.reverted) continue;
          this.revertionPoint = parent.return;
          this.event.trigger('revertWarning', ['parenthasthrown']);
        }

        this.event.trigger('revertWarning', ['']);
      }).catch(error => {
        console.log(error);
        this.event.trigger('revertWarning', ['']);
      });
    });
  }

  triggerStepChanged(step) {
    this.traceManager.getLength((error, length) => {
      let stepState = 'valid';

      if (error) {
        stepState = 'invalid';
      } else if (step <= 0) {
        stepState = 'initial';
      } else if (step >= length - 1) {
        stepState = 'end';
      }

      const jumpOutDisabled = step === this.traceManager.findStepOut(step);
      this.event.trigger('stepChanged', [step, stepState, jumpOutDisabled]);
    });
  }

  stepIntoBack(solidityMode) {
    if (!this.traceManager.isLoaded()) return;
    let step = this.currentStepIndex - 1;
    this.currentStepIndex = step;

    if (solidityMode) {
      step = this.resolveToReducedTrace(step, -1);
    }

    if (!this.traceManager.inRange(step)) {
      return;
    }

    this.triggerStepChanged(step);
  }

  stepIntoForward(solidityMode) {
    if (!this.traceManager.isLoaded()) return;
    let step = this.currentStepIndex + 1;
    this.currentStepIndex = step;

    if (solidityMode) {
      step = this.resolveToReducedTrace(step, 1);
    }

    if (!this.traceManager.inRange(step)) {
      return;
    }

    this.triggerStepChanged(step);
  }

  stepOverBack(solidityMode) {
    if (!this.traceManager.isLoaded()) return;
    let step = this.traceManager.findStepOverBack(this.currentStepIndex);

    if (solidityMode) {
      step = this.resolveToReducedTrace(step, -1);
    }

    this.currentStepIndex = step;
    this.triggerStepChanged(step);
  }

  stepOverForward(solidityMode) {
    if (!this.traceManager.isLoaded()) return;
    if (this.currentStepIndex >= this.traceLength - 1) return;
    let step = this.currentStepIndex + 1;
    const scope = this.debugger.callTree.findScope(step);

    if (scope && scope.firstStep === step) {
      step = scope.lastStep + 1;
    }

    if (solidityMode) {
      step = this.resolveToReducedTrace(step, 1);
    }

    this.currentStepIndex = step;
    this.triggerStepChanged(step);
  }

  jumpOut(solidityMode) {
    if (!this.traceManager.isLoaded()) return;
    var step = this.traceManager.findStepOut(this.currentStepIndex);

    if (solidityMode) {
      step = this.resolveToReducedTrace(step, 0);
    }

    this.currentStepIndex = step;
    this.triggerStepChanged(step);
  }

  jumpTo(step) {
    if (!this.traceManager.inRange(step)) return;
    this.currentStepIndex = step;
    this.triggerStepChanged(step);
  }

  jumpToException() {
    this.jumpTo(this.revertionPoint);
  }

  jumpNextBreakpoint() {
    this.debugger.breakpointManager.jumpNextBreakpoint(this.currentStepIndex, true);
  }

  jumpPreviousBreakpoint() {
    this.debugger.breakpointManager.jumpPreviousBreakpoint(this.currentStepIndex, true);
  }

  calculateFirstStep() {
    const step = this.resolveToReducedTrace(0, 1);
    return this.resolveToReducedTrace(step, 1);
  }

  calculateCodeStepList() {
    let step = 0;
    let steps = [];

    while (step < this.traceLength) {
      const _step = this.resolveToReducedTrace(step, 1);

      if (!_step) break;
      steps.push(_step);
      step += 1;
    }

    steps = steps.filter((item, pos, self) => {
      return steps.indexOf(item) === pos;
    });
    return steps;
  }

  calculateCodeLength() {
    this.calculateCodeStepList().reverse();
    return this.calculateCodeStepList().reverse()[1] || this.traceLength;
  }

  nextStep() {
    return this.resolveToReducedTrace(this.currentStepIndex, 1);
  }

  previousStep() {
    return this.resolveToReducedTrace(this.currentStepIndex, -1);
  }

  resolveToReducedTrace(value, incr) {
    if (!this.debugger.callTree.reducedTrace.length) {
      return value;
    }

    var nextSource = remix_lib_1.util.findClosestIndex(value, this.debugger.callTree.reducedTrace);
    nextSource = nextSource + incr;

    if (nextSource <= 0) {
      nextSource = 0;
    } else if (nextSource > this.debugger.callTree.reducedTrace.length) {
      nextSource = this.debugger.callTree.reducedTrace.length - 1;
    }

    return this.debugger.callTree.reducedTrace[nextSource];
  }

}

exports.DebuggerStepManager = DebuggerStepManager;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/eventManager.js":
/*!**************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/eventManager.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventManager = void 0;

class EventManager {
  constructor() {
    this.registered = {};
    this.anonymous = {};
  }
  /*
    * Unregister a listener.
    * Note that if obj is a function. the unregistration will be applied to the dummy obj {}.
    *
    * @param {String} eventName  - the event name
    * @param {Object or Func} obj - object that will listen on this event
    * @param {Func} func         - function of the listeners that will be executed
  */


  unregister(eventName, obj, func) {
    if (!this.registered[eventName]) {
      return;
    }

    if (obj instanceof Function) {
      func = obj;
      obj = this.anonymous;
    }

    for (const reg in this.registered[eventName]) {
      if (this.registered[eventName][reg].obj === obj && this.registered[eventName][reg].func === func) {
        this.registered[eventName].splice(reg, 1);
      }
    }
  }
  /*
    * Register a new listener.
    * Note that if obj is a function, the function registration will be associated with the dummy object {}
    *
    * @param {String} eventName  - the event name
    * @param {Object or Func} obj - object that will listen on this event
    * @param {Func} func         - function of the listeners that will be executed
  */


  register(eventName, obj, func) {
    if (!this.registered[eventName]) {
      this.registered[eventName] = [];
    }

    if (obj instanceof Function) {
      func = obj;
      obj = this.anonymous;
    }

    this.registered[eventName].push({
      obj: obj,
      func: func
    });
  }
  /*
    * trigger event.
    * Every listener have their associated function executed
    *
    * @param {String} eventName  - the event name
    * @param {Array}j - argument that will be passed to the executed function.
  */


  trigger(eventName, args) {
    if (!this.registered[eventName]) {
      return;
    }

    for (const listener in this.registered[eventName]) {
      const l = this.registered[eventName][listener];
      if (l.func) l.func.apply(l.obj === this.anonymous ? {} : l.obj, args);
    }
  }

}

exports.EventManager = EventManager;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/index.js":
/*!*******************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/index.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const init = (0, tslib_1.__importStar)(__webpack_require__(/*! ./init */ "../../../dist/libs/remix-debug/src/init.js"));

const Ethdebugger_1 = __webpack_require__(/*! ./Ethdebugger */ "../../../dist/libs/remix-debug/src/Ethdebugger.js");

const debugger_1 = __webpack_require__(/*! ./debugger/debugger */ "../../../dist/libs/remix-debug/src/debugger/debugger.js");

const cmdline_1 = __webpack_require__(/*! ./cmdline */ "../../../dist/libs/remix-debug/src/cmdline/index.js");

const storageViewer_1 = __webpack_require__(/*! ./storage/storageViewer */ "../../../dist/libs/remix-debug/src/storage/storageViewer.js");

const storageResolver_1 = __webpack_require__(/*! ./storage/storageResolver */ "../../../dist/libs/remix-debug/src/storage/storageResolver.js");

const SolidityDecoder = (0, tslib_1.__importStar)(__webpack_require__(/*! ./solidity-decoder */ "../../../dist/libs/remix-debug/src/solidity-decoder/index.js"));

const breakpointManager_1 = __webpack_require__(/*! ./code/breakpointManager */ "../../../dist/libs/remix-debug/src/code/breakpointManager.js");

const sourceMappingDecoder = (0, tslib_1.__importStar)(__webpack_require__(/*! ./source/sourceMappingDecoder */ "../../../dist/libs/remix-debug/src/source/sourceMappingDecoder.js"));
const traceHelper = (0, tslib_1.__importStar)(__webpack_require__(/*! ./trace/traceHelper */ "../../../dist/libs/remix-debug/src/trace/traceHelper.js"));
module.exports = {
  init,
  traceHelper,
  sourceMappingDecoder,
  EthDebugger: Ethdebugger_1.Ethdebugger,
  TransactionDebugger: debugger_1.Debugger,

  /**
   * constructor
   *
   * @param {Object} _debugger - type of EthDebugger
   * @return {Function} _locationToRowConverter - function implemented by editor which return a column/line position for a char source location
   */
  BreakpointManager: breakpointManager_1.BreakpointManager,
  SolidityDecoder,
  storage: {
    StorageViewer: storageViewer_1.StorageViewer,
    StorageResolver: storageResolver_1.StorageResolver
  },
  CmdLine: cmdline_1.CmdLine
};

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/init.js":
/*!******************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/init.js ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extend = exports.web3DebugNode = exports.setProvider = exports.extendWeb3 = exports.loadWeb3 = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const web3_1 = (0, tslib_1.__importDefault)(__webpack_require__(/*! web3 */ "../../../node_modules/web3/lib/index.js"));

function loadWeb3(url) {
  if (!url) url = 'http://localhost:8545';
  const web3 = new web3_1.default();
  web3.setProvider(new web3_1.default.providers.HttpProvider(url));
  extend(web3);
  return web3;
}

exports.loadWeb3 = loadWeb3;

function extendWeb3(web3) {
  extend(web3);
}

exports.extendWeb3 = extendWeb3;

function setProvider(web3, url) {
  web3.setProvider(new web3.providers.HttpProvider(url));
}

exports.setProvider = setProvider;

function web3DebugNode(network) {
  const web3DebugNodes = {
    Main: 'https://rpc.archivenode.io/e50zmkroshle2e2e50zm0044i7ao04ym',
    Rinkeby: 'https://remix-rinkeby.ethdevops.io',
    Ropsten: 'https://remix-ropsten.ethdevops.io',
    Goerli: 'https://remix-goerli.ethdevops.io'
  };

  if (web3DebugNodes[network]) {
    return loadWeb3(web3DebugNodes[network]);
  }

  return null;
}

exports.web3DebugNode = web3DebugNode;

function extend(web3) {
  if (!web3.extend) {
    return;
  } // DEBUG


  const methods = [];

  if (!(web3.debug && web3.debug.preimage)) {
    methods.push(new web3.extend.Method({
      name: 'preimage',
      call: 'debug_preimage',
      inputFormatter: [null],
      params: 1
    }));
  }

  if (!(web3.debug && web3.debug.traceTransaction)) {
    methods.push(new web3.extend.Method({
      name: 'traceTransaction',
      call: 'debug_traceTransaction',
      inputFormatter: [null, null],
      params: 2
    }));
  }

  if (!(web3.debug && web3.debug.storageRangeAt)) {
    methods.push(new web3.extend.Method({
      name: 'storageRangeAt',
      call: 'debug_storageRangeAt',
      inputFormatter: [null, null, null, null, null],
      params: 5
    }));
  }

  if (methods.length > 0) {
    web3.extend({
      property: 'debug',
      methods: methods,
      properties: []
    });
  }
}

exports.extend = extend;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/solidity-decoder/astHelper.js":
/*!****************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/solidity-decoder/astHelper.js ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractStatesDefinitions = exports.extractStateDefinitions = exports.getLinearizedBaseContracts = exports.extractOrphanDefinitions = exports.extractContractDefinitions = void 0;

const remix_astwalker_1 = __webpack_require__(/*! @remix-project/remix-astwalker */ "../../../dist/libs/remix-astwalker/src/index.js");
/**
  * return all contract definitions of the given @astList
  *
  * @param {Object} sourcesList - sources list (containing root AST node)
  * @return {Object} - returns a mapping from AST node ids to AST nodes for the contracts
  */


function extractContractDefinitions(sourcesList) {
  const ret = {
    contractsById: {},
    contractsByName: {},
    sourcesByContract: {}
  };
  const walker = new remix_astwalker_1.AstWalker();

  for (const k in sourcesList) {
    walker.walkFull(sourcesList[k].ast, node => {
      if (node.nodeType === 'ContractDefinition') {
        ret.contractsById[node.id] = node;
        ret.sourcesByContract[node.id] = k;
        ret.contractsByName[k + ':' + node.name] = node;
      }
    });
  }

  return ret;
}

exports.extractContractDefinitions = extractContractDefinitions;
/**
  * return nodes from an ast @arg sourcesList that are declared outside of a ContractDefinition @astList
  *
  * @param {Object} sourcesList - sources list (containing root AST node)
  * @return {Object} - returns a list of node
  */

function extractOrphanDefinitions(sourcesList) {
  const ret = [];

  for (const k in sourcesList) {
    const ast = sourcesList[k].ast;

    if (ast.nodes && ast.nodes.length) {
      for (const node of ast.nodes) {
        if (node.nodeType !== 'ContractDefinition') {
          ret.push(node);
        }
      }
    }
  }

  return ret;
}

exports.extractOrphanDefinitions = extractOrphanDefinitions;
/**
  * returns the linearized base contracts of the contract @arg id
  *
  * @param {Int} id - contract id to resolve
  * @param {Map} contracts  - all contracts defined in the current context
  * @return {Array} - array of base contracts in derived to base order as AST nodes.
  */

function getLinearizedBaseContracts(id, contractsById) {
  return contractsById[id].linearizedBaseContracts.map(function (id) {
    return contractsById[id];
  });
}

exports.getLinearizedBaseContracts = getLinearizedBaseContracts;
/**
  * return state var and type definition of the given contract
  *
  * @param {String} contractName - contract for which state var should be resolved
  * @param {Object} sourcesList - sources list (containing root AST node)
  * @param {Object} [contracts] - map of contract definitions (contains contractsById, contractsByName)
  * @return {Object} - return an object containing: stateItems - list of all the children node of the @arg contractName
  *                                                 stateVariables - list of all the variable declaration of the @arg contractName
  */

function extractStateDefinitions(contractName, sourcesList, contracts) {
  if (!contracts) {
    contracts = extractContractDefinitions(sourcesList);
  }

  const node = contracts.contractsByName[contractName];

  if (!node) {
    return null;
  }

  const stateItems = extractOrphanDefinitions(sourcesList);
  const stateVar = [];
  const baseContracts = getLinearizedBaseContracts(node.id, contracts.contractsById);
  baseContracts.reverse();

  for (const k in baseContracts) {
    const ctr = baseContracts[k];

    for (const i in ctr.nodes) {
      const item = ctr.nodes[i];
      stateItems.push(item);

      if (item.nodeType === 'VariableDeclaration') {
        stateVar.push(item);
      }
    }
  }

  return {
    stateDefinitions: stateItems,
    stateVariables: stateVar
  };
}

exports.extractStateDefinitions = extractStateDefinitions;
/**
  * return state var and type definition of all the contracts from the given @args sourcesList
  *
  * @param {Object} sourcesList - sources list (containing root AST node)
  * @param {Object} [contracts] - map of contract definitions (contains contractsById, contractsByName)
  * @return {Object} - returns a mapping between contract name and contract state
  */

function extractStatesDefinitions(sourcesList, contracts) {
  if (!contracts) {
    contracts = extractContractDefinitions(sourcesList);
  }

  const ret = {};

  for (const contract in contracts.contractsById) {
    const name = contracts.contractsById[contract].name;
    const source = contracts.sourcesByContract[contract];
    const fullName = source + ':' + name;
    const state = extractStateDefinitions(fullName, sourcesList, contracts);
    ret[fullName] = state;
    ret[name] = state; // solc < 0.4.9
  }

  return ret;
}

exports.extractStatesDefinitions = extractStatesDefinitions;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/solidity-decoder/decodeInfo.js":
/*!*****************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/solidity-decoder/decodeInfo.js ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Struct = exports.Enum = exports.Array = exports.String = exports.Int = exports.FixedByteArray = exports.DynamicByteArray = exports.Bool = exports.Address = exports.Uint = exports.computeOffsets = exports.parseType = void 0;

const Address_1 = __webpack_require__(/*! ./types/Address */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/Address.js");

const ArrayType_1 = __webpack_require__(/*! ./types/ArrayType */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/ArrayType.js");

const Bool_1 = __webpack_require__(/*! ./types/Bool */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/Bool.js");

const DynamicByteArray_1 = __webpack_require__(/*! ./types/DynamicByteArray */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/DynamicByteArray.js");

const FixedByteArray_1 = __webpack_require__(/*! ./types/FixedByteArray */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/FixedByteArray.js");

const Enum_1 = __webpack_require__(/*! ./types/Enum */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/Enum.js");

const StringType_1 = __webpack_require__(/*! ./types/StringType */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/StringType.js");

const Struct_1 = __webpack_require__(/*! ./types/Struct */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/Struct.js");

const Int_1 = __webpack_require__(/*! ./types/Int */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/Int.js");

const Uint_1 = __webpack_require__(/*! ./types/Uint */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/Uint.js");

const Mapping_1 = __webpack_require__(/*! ./types/Mapping */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/Mapping.js");

const util_1 = __webpack_require__(/*! ./types/util */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/util.js");
/**
  * mapping decode the given @arg type
  *
  * @param {String} type - type given by the AST
  * @return {Object} returns decoded info about the current type: { storageBytes, typeName}
  */


function mapping(type, stateDefinitions, contractName) {
  const match = type.match(/mapping\((.*?)=>(.*)\)$/);
  const keyTypeName = match[1].trim();
  const valueTypeName = match[2].trim();
  const keyType = parseType(keyTypeName, stateDefinitions, contractName, 'storage');
  const valueType = parseType(valueTypeName, stateDefinitions, contractName, 'storage');
  var underlyingTypes = {
    keyType: keyType,
    valueType: valueType
  };
  return new Mapping_1.Mapping(underlyingTypes, 'location', (0, util_1.removeLocation)(type));
}
/**
  * Uint decode the given @arg type
  *
  * @param {String} type - type given by the AST (e.g uint256, uint32)
  * @return {Object} returns decoded info about the current type: { storageBytes, typeName}
  */


function uint(type) {
  type = type === 'uint' ? 'uint256' : type;
  const storageBytes = parseInt(type.replace('uint', '')) / 8;
  return new Uint_1.Uint(storageBytes);
}

exports.Uint = uint;
/**
  * Int decode the given @arg type
  *
  * @param {String} type - type given by the AST (e.g int256, int32)
  * @return {Object} returns decoded info about the current type: { storageBytes, typeName}
  */

function int(type) {
  type = type === 'int' ? 'int256' : type;
  const storageBytes = parseInt(type.replace('int', '')) / 8;
  return new Int_1.Int(storageBytes);
}

exports.Int = int;
/**
  * Address decode the given @arg type
  *
  * @param {String} type - type given by the AST (e.g address)
  * @return {Object} returns decoded info about the current type: { storageBytes, typeName}
  */

function address(type) {
  return new Address_1.Address();
}

exports.Address = address;
/**
  * Bool decode the given @arg type
  *
  * @param {String} type - type given by the AST (e.g bool)
  * @return {Object} returns decoded info about the current type: { storageBytes, typeName}
  */

function bool(type) {
  return new Bool_1.Bool();
}

exports.Bool = bool;
/**
  * DynamicByteArray decode the given @arg type
  *
  * @param {String} type - type given by the AST (e.g bytes storage ref)
  * @param {null} stateDefinitions - all state definitions given by the AST (including struct and enum type declaration) for all contracts
  * @param {null} contractName - contract the @args typeName belongs to
  * @param {String} location - location of the data (storage ref| storage pointer| memory| calldata)
  * @return {Object} returns decoded info about the current type: { storageBytes, typeName}
  */

function dynamicByteArray(type, stateDefinitions, contractName, location) {
  if (!location) {
    location = (0, util_1.extractLocation)(type);
  }

  if (location) {
    return new DynamicByteArray_1.DynamicByteArray(location);
  } else {
    return null;
  }
}

exports.DynamicByteArray = dynamicByteArray;
/**
  * FixedByteArray decode the given @arg type
  *
  * @param {String} type - type given by the AST (e.g bytes16)
  * @return {Object} returns decoded info about the current type: { storageBytes, typeName}
  */

function fixedByteArray(type) {
  const storageBytes = parseInt(type.replace('bytes', ''));
  return new FixedByteArray_1.FixedByteArray(storageBytes);
}

exports.FixedByteArray = fixedByteArray;
/**
  * StringType decode the given @arg type
  *
  * @param {String} type - type given by the AST (e.g string storage ref)
  * @param {null} stateDefinitions - all state definitions given by the AST (including struct and enum type declaration) for all contracts
  * @param {null} contractName - contract the @args typeName belongs to
  * @param {String} location - location of the data (storage ref| storage pointer| memory| calldata)
  * @return {Object} returns decoded info about the current type: { storageBytes, typeName}
  */

function stringType(type, stateDefinitions, contractName, location) {
  if (!location) {
    location = (0, util_1.extractLocation)(type);
  }

  if (location) {
    return new StringType_1.StringType(location);
  } else {
    return null;
  }
}

exports.String = stringType;
/**
  * ArrayType decode the given @arg type
  *
  * @param {String} type - type given by the AST (e.g int256[] storage ref, int256[] storage ref[] storage ref)
  * @param {Object} stateDefinitions - all state definitions given by the AST (including struct and enum type declaration) for all contracts
  * @param {String} contractName - contract the @args typeName belongs to
  * @param {String} location - location of the data (storage ref| storage pointer| memory| calldata)
  * @return {Object} returns decoded info about the current type: { storageBytes, typeName, arraySize, subArray}
  */

function array(type, stateDefinitions, contractName, location) {
  const match = type.match(/(.*)\[(.*?)\]( storage ref| storage pointer| memory| calldata)?$/);

  if (!match) {
    console.log('unable to parse type ' + type);
    return null;
  }

  if (!location) {
    location = match[3].trim();
  }

  const arraySize = match[2] === '' ? 'dynamic' : parseInt(match[2]);
  const underlyingType = parseType(match[1], stateDefinitions, contractName, location);

  if (underlyingType === null) {
    console.log('unable to parse type ' + type);
    return null;
  }

  return new ArrayType_1.ArrayType(underlyingType, arraySize, location);
}

exports.Array = array;
/**
  * Enum decode the given @arg type
  *
  * @param {String} type - type given by the AST (e.g enum enumDef)
  * @param {Object} stateDefinitions - all state definitions given by the AST (including struct and enum type declaration) for all contracts
  * @param {String} contractName - contract the @args typeName belongs to
  * @return {Object} returns decoded info about the current type: { storageBytes, typeName, enum}
  */

function enumType(type, stateDefinitions, contractName) {
  const match = type.match(/enum (.*)/);
  const enumDef = getEnum(match[1], stateDefinitions, contractName);

  if (enumDef === null) {
    console.log('unable to retrieve decode info of ' + type);
    return null;
  }

  return new Enum_1.Enum(enumDef);
}

exports.Enum = enumType;
/**
  * Struct decode the given @arg type
  *
  * @param {String} type - type given by the AST (e.g struct structDef storage ref)
  * @param {Object} stateDefinitions - all state definitions given by the AST (including struct and enum type declaration) for all contracts
  * @param {String} contractName - contract the @args typeName belongs to
  * @param {String} location - location of the data (storage ref| storage pointer| memory| calldata)
  * @return {Object} returns decoded info about the current type: { storageBytes, typeName, members}
  */

function struct(type, stateDefinitions, contractName, location) {
  const match = type.match(/struct (\S*?)( storage ref| storage pointer| memory| calldata)?$/);

  if (match) {
    if (!location) {
      location = match[2].trim();
    }

    const memberDetails = getStructMembers(match[1], stateDefinitions, contractName, location); // type is used to extract the ast struct definition

    if (!memberDetails) return null;
    return new Struct_1.Struct(memberDetails, location, match[1]);
  } else {
    return null;
  }
}

exports.Struct = struct;
/**
  * retrieve enum declaration of the given @arg type
  *
  * @param {String} type - type given by the AST (e.g enum enumDef)
  * @param {Object} stateDefinitions  - all state declarations given by the AST (including struct and enum type declaration) for all contracts
  * @param {String} contractName - contract the @args typeName belongs to
  * @return {Array} - containing all value declaration of the current enum type
  */

function getEnum(type, stateDefinitions, contractName) {
  const split = type.split('.');

  if (!split.length) {
    type = contractName + '.' + type;
  } else {
    contractName = split[0];
  }

  const state = stateDefinitions[contractName];

  if (state) {
    for (const dec of state.stateDefinitions) {
      if (dec && dec.name && type === contractName + '.' + dec.name) {
        return dec;
      }
    }
  }

  return null;
}
/**
  * retrieve memebers declared in the given @arg tye
  *
  * @param {String} typeName - name of the struct type (e.g struct <name>)
  * @param {Object} stateDefinitions  - all state definition given by the AST (including struct and enum type declaration) for all contracts
  * @param {String} contractName - contract the @args typeName belongs to
  * @param {String} location - location of the data (storage ref| storage pointer| memory| calldata)
  * @return {Array} containing all members of the current struct type
  */


function getStructMembers(type, stateDefinitions, contractName, location) {
  if (type.indexOf('.') === -1) {
    type = contractName + '.' + type;
  }

  if (!contractName) {
    contractName = type.split('.')[0];
  }

  const state = stateDefinitions[contractName];

  if (state) {
    for (const dec of state.stateDefinitions) {
      if (dec.nodeType === 'StructDefinition' && type === contractName + '.' + dec.name) {
        const offsets = computeOffsets(dec.members, stateDefinitions, contractName, location);

        if (!offsets) {
          return null;
        }

        return {
          members: offsets.typesOffsets,
          storageSlots: offsets.endLocation.slot
        };
      }
    }
  }

  return null;
}
/**
  * parse the full type
  *
  * @param {String} fullType - type given by the AST (ex: uint[2] storage ref[2])
  * @return {String} returns the token type (used to instanciate the right decoder) (uint[2] storage ref[2] will return 'array', uint256 will return uintX)
  */


function typeClass(fullType) {
  fullType = (0, util_1.removeLocation)(fullType);

  if (fullType.lastIndexOf(']') === fullType.length - 1) {
    return 'array';
  }

  if (fullType.indexOf('mapping') === 0) {
    return 'mapping';
  }

  if (fullType.indexOf(' ') !== -1) {
    fullType = fullType.split(' ')[0];
  }

  const char = fullType.indexOf('bytes') === 0 ? 'X' : '';
  return fullType.replace(/[0-9]+/g, char);
}
/**
  * parse the type and return an object representing the type
  *
  * @param {Object} type - type name given by the ast node
  * @param {Object} stateDefinitions - all state stateDefinitions given by the AST (including struct and enum type declaration) for all contracts
  * @param {String} contractName - contract the @args typeName belongs to
  * @param {String} location - location of the data (storage ref| storage pointer| memory| calldata)
  * @return {Object} - return the corresponding decoder or null on error
  */


function parseType(type, stateDefinitions, contractName, location) {
  const decodeInfos = {
    contract: address,
    address: address,
    array: array,
    bool: bool,
    bytes: dynamicByteArray,
    bytesX: fixedByteArray,
    enum: enumType,
    string: stringType,
    struct: struct,
    int: int,
    uint: uint,
    mapping: mapping
  };
  const currentType = typeClass(type);

  if (currentType === null) {
    console.log('unable to retrieve decode info of ' + type);
    return null;
  }

  if (decodeInfos[currentType]) {
    return decodeInfos[currentType](type, stateDefinitions, contractName, location);
  } else {
    return null;
  }
}

exports.parseType = parseType;
/**
  * compute offset (slot offset and byte offset of the @arg list of types)
  *
  * @param {Array} types - list of types
  * @param {Object} stateDefinitions - all state definitions given by the AST (including struct and enum type declaration) for all contracts
  * @param {String} contractName - contract the @args typeName belongs to
  * @param {String} location - location of the data (storage ref| storage pointer| memory| calldata)
  * @return {Array} - return an array of types item: {name, type, location}. location defines the byte offset and slot offset
  */

function computeOffsets(types, stateDefinitions, contractName, location) {
  const ret = [];
  const storagelocation = {
    offset: 0,
    slot: 0
  };

  for (var i in types) {
    var variable = types[i];
    var type = parseType(variable.typeDescriptions.typeString, stateDefinitions, contractName, location);

    if (!type) {
      console.log('unable to retrieve decode info of ' + variable.typeDescriptions.typeString);
      return null;
    }

    const immutable = variable.mutability === 'immutable';
    const hasStorageSlots = !immutable && !variable.constant;

    if (hasStorageSlots && storagelocation.offset + type.storageBytes > 32) {
      storagelocation.slot++;
      storagelocation.offset = 0;
    }

    ret.push({
      name: variable.name,
      type: type,
      constant: variable.constant,
      immutable,
      storagelocation: {
        offset: !hasStorageSlots ? 0 : storagelocation.offset,
        slot: !hasStorageSlots ? 0 : storagelocation.slot
      }
    });

    if (hasStorageSlots) {
      if (type.storageSlots === 1 && storagelocation.offset + type.storageBytes <= 32) {
        storagelocation.offset += type.storageBytes;
      } else {
        storagelocation.slot += type.storageSlots;
        storagelocation.offset = 0;
      }
    }
  }

  if (storagelocation.offset > 0) {
    storagelocation.slot++;
  }

  return {
    typesOffsets: ret,
    endLocation: storagelocation
  };
}

exports.computeOffsets = computeOffsets;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/solidity-decoder/index.js":
/*!************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/solidity-decoder/index.js ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InternalCallTree = exports.localDecoder = exports.stateDecoder = exports.SolidityProxy = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const solidityProxy_1 = __webpack_require__(/*! ./solidityProxy */ "../../../dist/libs/remix-debug/src/solidity-decoder/solidityProxy.js");

Object.defineProperty(exports, "SolidityProxy", {
  enumerable: true,
  get: function () {
    return solidityProxy_1.SolidityProxy;
  }
});
const stateDecoder = (0, tslib_1.__importStar)(__webpack_require__(/*! ./stateDecoder */ "../../../dist/libs/remix-debug/src/solidity-decoder/stateDecoder.js"));
exports.stateDecoder = stateDecoder;
const localDecoder = (0, tslib_1.__importStar)(__webpack_require__(/*! ./localDecoder */ "../../../dist/libs/remix-debug/src/solidity-decoder/localDecoder.js"));
exports.localDecoder = localDecoder;

const internalCallTree_1 = __webpack_require__(/*! ./internalCallTree */ "../../../dist/libs/remix-debug/src/solidity-decoder/internalCallTree.js");

Object.defineProperty(exports, "InternalCallTree", {
  enumerable: true,
  get: function () {
    return internalCallTree_1.InternalCallTree;
  }
});

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/solidity-decoder/internalCallTree.js":
/*!***********************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/solidity-decoder/internalCallTree.js ***!
  \***********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InternalCallTree = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const remix_astwalker_1 = __webpack_require__(/*! @remix-project/remix-astwalker */ "../../../dist/libs/remix-astwalker/src/index.js");

const remix_lib_1 = __webpack_require__(/*! @remix-project/remix-lib */ "../../../dist/libs/remix-lib/src/index.js");

const sourceLocationTracker_1 = __webpack_require__(/*! ../source/sourceLocationTracker */ "../../../dist/libs/remix-debug/src/source/sourceLocationTracker.js");

const eventManager_1 = __webpack_require__(/*! ../eventManager */ "../../../dist/libs/remix-debug/src/eventManager.js");

const decodeInfo_1 = __webpack_require__(/*! ./decodeInfo */ "../../../dist/libs/remix-debug/src/solidity-decoder/decodeInfo.js");

const traceHelper_1 = __webpack_require__(/*! ../trace/traceHelper */ "../../../dist/libs/remix-debug/src/trace/traceHelper.js");

const util_1 = __webpack_require__(/*! ./types/util */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/util.js");
/**
 * Tree representing internal jump into function.
 * Triggers `callTreeReady` event when tree is ready
 * Triggers `callTreeBuildFailed` event when tree fails to build
 */


class InternalCallTree {
  /**
    * constructor
    *
    * @param {Object} debuggerEvent  - event declared by the debugger (EthDebugger)
    * @param {Object} traceManager  - trace manager
    * @param {Object} solidityProxy  - solidity proxy
    * @param {Object} codeManager  - code manager
    * @param {Object} opts  - { includeLocalVariables, debugWithGeneratedSources }
    */
  constructor(debuggerEvent, traceManager, solidityProxy, codeManager, opts) {
    this.includeLocalVariables = opts.includeLocalVariables;
    this.debugWithGeneratedSources = opts.debugWithGeneratedSources;
    this.event = new eventManager_1.EventManager();
    this.solidityProxy = solidityProxy;
    this.traceManager = traceManager;
    this.sourceLocationTracker = new sourceLocationTracker_1.SourceLocationTracker(codeManager, {
      debugWithGeneratedSources: opts.debugWithGeneratedSources
    });
    debuggerEvent.register('newTraceLoaded', trace => {
      this.reset();

      if (!this.solidityProxy.loaded()) {
        this.event.trigger('callTreeBuildFailed', ['compilation result not loaded. Cannot build internal call tree']);
      } else {
        // each recursive call to buildTree represent a new context (either call, delegatecall, internal function)
        const calledAddress = traceManager.getCurrentCalledAddressAt(0);
        const isCreation = (0, traceHelper_1.isContractCreation)(calledAddress);
        buildTree(this, 0, '', true, isCreation).then(result => {
          if (result.error) {
            this.event.trigger('callTreeBuildFailed', [result.error]);
          } else {
            createReducedTrace(this, traceManager.trace.length - 1);
            this.event.trigger('callTreeReady', [this.scopes, this.scopeStarts]);
          }
        }, reason => {
          console.log('analyzing trace falls ' + reason);
          this.event.trigger('callTreeNotReady', [reason]);
        });
      }
    });
  }
  /**
    * reset tree
    *
    */


  reset() {
    /*
      scopes: map of scopes defined by range in the vmtrace {firstStep, lastStep, locals}.
      Keys represent the level of deepness (scopeId)
      scopeId : <currentscope_id>.<sub_scope_id>.<sub_sub_scope_id>
    */
    this.scopes = {};
    /*
      scopeStart: represent start of a new scope. Keys are index in the vmtrace, values are scopeId
    */

    this.sourceLocationTracker.clearCache();
    this.functionCallStack = [];
    this.functionDefinitionsByScope = {};
    this.scopeStarts = {};
    this.variableDeclarationByFile = {};
    this.functionDefinitionByFile = {};
    this.astWalker = new remix_astwalker_1.AstWalker();
    this.reducedTrace = [];
  }
  /**
    * find the scope given @arg vmTraceIndex
    *
    * @param {Int} vmtraceIndex  - index on the vm trace
    */


  findScope(vmtraceIndex) {
    let scopeId = this.findScopeId(vmtraceIndex);
    if (scopeId !== '' && !scopeId) return null;
    let scope = this.scopes[scopeId];

    while (scope.lastStep && scope.lastStep < vmtraceIndex && scope.firstStep > 0) {
      scopeId = this.parentScope(scopeId);
      scope = this.scopes[scopeId];
    }

    return scope;
  }

  parentScope(scopeId) {
    if (scopeId.indexOf('.') === -1) return '';
    return scopeId.replace(/(\.\d+)$/, '');
  }

  findScopeId(vmtraceIndex) {
    const scopes = Object.keys(this.scopeStarts);
    if (!scopes.length) return null;
    const scopeStart = remix_lib_1.util.findLowerBoundValue(vmtraceIndex, scopes);
    return this.scopeStarts[scopeStart];
  }

  retrieveFunctionsStack(vmtraceIndex) {
    const scope = this.findScope(vmtraceIndex);
    if (!scope) return [];
    let scopeId = this.scopeStarts[scope.firstStep];
    const functions = [];
    if (!scopeId) return functions;
    let i = 0; // eslint-disable-next-line no-constant-condition

    while (true) {
      i += 1;
      if (i > 1000) throw new Error('retrieFunctionStack: recursion too deep');
      const functionDefinition = this.functionDefinitionsByScope[scopeId];

      if (functionDefinition !== undefined) {
        functions.push(functionDefinition);
      }

      const parent = this.parentScope(scopeId);
      if (!parent) break;else scopeId = parent;
    }

    return functions;
  }

  extractSourceLocation(step) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      try {
        const address = this.traceManager.getCurrentCalledAddressAt(step);
        const location = yield this.sourceLocationTracker.getSourceLocationFromVMTraceIndex(address, step, this.solidityProxy.contracts);
        return location;
      } catch (error) {
        throw new Error('InternalCallTree - Cannot retrieve sourcelocation for step ' + step + ' ' + error);
      }
    });
  }

  extractValidSourceLocation(step) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      try {
        const address = this.traceManager.getCurrentCalledAddressAt(step);
        const location = yield this.sourceLocationTracker.getValidSourceLocationFromVMTraceIndex(address, step, this.solidityProxy.contracts);
        return location;
      } catch (error) {
        throw new Error('InternalCallTree - Cannot retrieve valid sourcelocation for step ' + step + ' ' + error);
      }
    });
  }

}

exports.InternalCallTree = InternalCallTree;

function buildTree(tree, step, scopeId, isExternalCall, isCreation) {
  return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
    let subScope = 1;
    tree.scopeStarts[step] = scopeId;
    tree.scopes[scopeId] = {
      firstStep: step,
      locals: {},
      isCreation
    };

    function callDepthChange(step, trace) {
      if (step + 1 < trace.length) {
        return trace[step].depth !== trace[step + 1].depth;
      }

      return false;
    }

    function includedSource(source, included) {
      return included.start !== -1 && included.length !== -1 && included.file !== -1 && included.start >= source.start && included.start + included.length <= source.start + source.length && included.file === source.file;
    }

    let currentSourceLocation = {
      start: -1,
      length: -1,
      file: -1
    };
    let previousSourceLocation = currentSourceLocation;

    while (step < tree.traceManager.trace.length) {
      let sourceLocation;
      let newLocation = false;

      try {
        sourceLocation = yield tree.extractSourceLocation(step);

        if (!includedSource(sourceLocation, currentSourceLocation)) {
          tree.reducedTrace.push(step);
          currentSourceLocation = sourceLocation;
          newLocation = true;
        }
      } catch (e) {
        return {
          outStep: step,
          error: 'InternalCallTree - Error resolving source location. ' + step + ' ' + e
        };
      }

      if (!sourceLocation) {
        return {
          outStep: step,
          error: 'InternalCallTree - No source Location. ' + step
        };
      }

      const isCallInstrn = (0, traceHelper_1.isCallInstruction)(tree.traceManager.trace[step]);
      const isCreateInstrn = (0, traceHelper_1.isCreateInstruction)(tree.traceManager.trace[step]); // we are checking if we are jumping in a new CALL or in an internal function

      if (isCallInstrn || sourceLocation.jump === 'i') {
        try {
          const externalCallResult = yield buildTree(tree, step + 1, scopeId === '' ? subScope.toString() : scopeId + '.' + subScope, isCallInstrn, isCreateInstrn);

          if (externalCallResult.error) {
            return {
              outStep: step,
              error: 'InternalCallTree - ' + externalCallResult.error
            };
          } else {
            step = externalCallResult.outStep;
            subScope++;
          }
        } catch (e) {
          return {
            outStep: step,
            error: 'InternalCallTree - ' + e.message
          };
        }
      } else if (isExternalCall && callDepthChange(step, tree.traceManager.trace) || !isExternalCall && sourceLocation.jump === 'o') {
        // if not, we might be returning from a CALL or internal function. This is what is checked here.
        tree.scopes[scopeId].lastStep = step;
        return {
          outStep: step + 1
        };
      } else {
        // if not, we are in the current scope.
        // We check in `includeVariableDeclaration` if there is a new local variable in scope for this specific `step`
        if (tree.includeLocalVariables) {
          yield includeVariableDeclaration(tree, step, sourceLocation, scopeId, newLocation, previousSourceLocation);
        }

        previousSourceLocation = sourceLocation;
        step++;
      }
    }

    return {
      outStep: step
    };
  });
} // the reduced trace contain an entry only if that correspond to a new source location


function createReducedTrace(tree, index) {
  tree.reducedTrace.push(index);
}

function getGeneratedSources(tree, scopeId, contractObj) {
  if (tree.debugWithGeneratedSources && contractObj && tree.scopes[scopeId]) {
    return tree.scopes[scopeId].isCreation ? contractObj.contract.evm.bytecode.generatedSources : contractObj.contract.evm.deployedBytecode.generatedSources;
  }

  return null;
}

function includeVariableDeclaration(tree, step, sourceLocation, scopeId, newLocation, previousSourceLocation) {
  return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
    const contractObj = yield tree.solidityProxy.contractObjectAt(step);
    let states = null;
    const generatedSources = getGeneratedSources(tree, scopeId, contractObj);
    const variableDeclarations = resolveVariableDeclaration(tree, sourceLocation, generatedSources); // using the vm trace step, the current source location and the ast,
    // we check if the current vm trace step target a new ast node of type VariableDeclaration
    // that way we know that there is a new local variable from here.

    if (variableDeclarations && variableDeclarations.length) {
      for (const variableDeclaration of variableDeclarations) {
        if (variableDeclaration && !tree.scopes[scopeId].locals[variableDeclaration.name]) {
          try {
            const stack = tree.traceManager.getStackAt(step); // the stack length at this point is where the value of the new local variable will be stored.
            // so, either this is the direct value, or the offset in memory. That depends on the type.

            if (variableDeclaration.name !== '') {
              states = tree.solidityProxy.extractStatesDefinitions();
              var location = (0, util_1.extractLocationFromAstVariable)(variableDeclaration);
              location = location === 'default' ? 'storage' : location; // we push the new local variable in our tree

              tree.scopes[scopeId].locals[variableDeclaration.name] = {
                name: variableDeclaration.name,
                type: (0, decodeInfo_1.parseType)(variableDeclaration.typeDescriptions.typeString, states, contractObj.name, location),
                stackDepth: stack.length,
                sourceLocation: sourceLocation
              };
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    } // we check here if we are at the beginning inside a new function.
    // if that is the case, we have to add to locals tree the inputs and output params


    const functionDefinition = resolveFunctionDefinition(tree, previousSourceLocation, generatedSources);
    if (!functionDefinition) return;
    const previousIsJumpDest2 = (0, traceHelper_1.isJumpDestInstruction)(tree.traceManager.trace[step - 2]);
    const previousIsJumpDest1 = (0, traceHelper_1.isJumpDestInstruction)(tree.traceManager.trace[step - 1]);
    const isConstructor = functionDefinition.kind === 'constructor';

    if (newLocation && (previousIsJumpDest1 || previousIsJumpDest2 || isConstructor)) {
      tree.functionCallStack.push(step);
      const functionDefinitionAndInputs = {
        functionDefinition,
        inputs: []
      }; // means: the previous location was a function definition && JUMPDEST
      // => we are at the beginning of the function and input/output are setup

      try {
        const stack = tree.traceManager.getStackAt(step);
        states = tree.solidityProxy.extractStatesDefinitions();

        if (functionDefinition.parameters) {
          const inputs = functionDefinition.parameters;
          const outputs = functionDefinition.returnParameters; // for (const element of functionDefinition.parameters) {
          //   if (element.nodeType === 'ParameterList') {
          //     if (!inputs) inputs = element
          //     else {
          //       outputs = element
          //       break
          //     }
          //   }
          // }
          // input params

          if (inputs && inputs.parameters) {
            functionDefinitionAndInputs.inputs = addParams(inputs, tree, scopeId, states, contractObj, previousSourceLocation, stack.length, inputs.parameters.length, -1);
          } // output params


          if (outputs) addParams(outputs, tree, scopeId, states, contractObj, previousSourceLocation, stack.length, 0, 1);
        }
      } catch (error) {
        console.log(error);
      }

      tree.functionDefinitionsByScope[scopeId] = functionDefinitionAndInputs;
    }
  });
} // this extract all the variable declaration for a given ast and file
// and keep this in a cache


function resolveVariableDeclaration(tree, sourceLocation, generatedSources) {
  if (!tree.variableDeclarationByFile[sourceLocation.file]) {
    const ast = tree.solidityProxy.ast(sourceLocation, generatedSources);

    if (ast) {
      tree.variableDeclarationByFile[sourceLocation.file] = extractVariableDeclarations(ast, tree.astWalker);
    } else {
      return null;
    }
  }

  return tree.variableDeclarationByFile[sourceLocation.file][sourceLocation.start + ':' + sourceLocation.length + ':' + sourceLocation.file];
} // this extract all the function definition for a given ast and file
// and keep this in a cache


function resolveFunctionDefinition(tree, sourceLocation, generatedSources) {
  if (!tree.functionDefinitionByFile[sourceLocation.file]) {
    const ast = tree.solidityProxy.ast(sourceLocation, generatedSources);

    if (ast) {
      tree.functionDefinitionByFile[sourceLocation.file] = extractFunctionDefinitions(ast, tree.astWalker);
    } else {
      return null;
    }
  }

  return tree.functionDefinitionByFile[sourceLocation.file][sourceLocation.start + ':' + sourceLocation.length + ':' + sourceLocation.file];
}

function extractVariableDeclarations(ast, astWalker) {
  const ret = {};
  astWalker.walkFull(ast, node => {
    if (node.nodeType === 'VariableDeclaration' || node.nodeType === 'YulVariableDeclaration') {
      ret[node.src] = [node];
    }

    const hasChild = node.initialValue && (node.nodeType === 'VariableDeclarationStatement' || node.nodeType === 'YulVariableDeclarationStatement');
    if (hasChild) ret[node.initialValue.src] = node.declarations;
  });
  return ret;
}

function extractFunctionDefinitions(ast, astWalker) {
  const ret = {};
  astWalker.walkFull(ast, node => {
    if (node.nodeType === 'FunctionDefinition' || node.nodeType === 'YulFunctionDefinition') {
      ret[node.src] = node;
    }
  });
  return ret;
}

function addParams(parameterList, tree, scopeId, states, contractObj, sourceLocation, stackLength, stackPosition, dir) {
  const contractName = contractObj.name;
  const params = [];

  for (const inputParam in parameterList.parameters) {
    const param = parameterList.parameters[inputParam];
    const stackDepth = stackLength + dir * stackPosition;

    if (stackDepth >= 0) {
      let location = (0, util_1.extractLocationFromAstVariable)(param);
      location = location === 'default' ? 'memory' : location;
      const attributesName = param.name === '' ? `$${inputParam}` : param.name;
      tree.scopes[scopeId].locals[attributesName] = {
        name: attributesName,
        type: (0, decodeInfo_1.parseType)(param.typeDescriptions.typeString, states, contractName, location),
        stackDepth: stackDepth,
        sourceLocation: sourceLocation,
        abi: contractObj.contract.abi
      };
      params.push(attributesName);
    }

    stackPosition += dir;
  }

  return params;
}

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/solidity-decoder/localDecoder.js":
/*!*******************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/solidity-decoder/localDecoder.js ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.solidityLocals = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

function solidityLocals(vmtraceIndex, internalTreeCall, stack, memory, storageResolver, calldata, currentSourceLocation, cursor) {
  return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
    const scope = internalTreeCall.findScope(vmtraceIndex);

    if (!scope) {
      const error = {
        message: 'Can\'t display locals. reason: compilation result might not have been provided'
      };
      throw error;
    }

    const locals = {};
    memory = formatMemory(memory);
    let anonymousIncr = 1;

    for (const local in scope.locals) {
      var variable = scope.locals[local];

      if (variable.stackDepth < stack.length && variable.sourceLocation.start <= currentSourceLocation.start) {
        let name = variable.name;

        if (name.indexOf('$') !== -1) {
          name = '<' + anonymousIncr + '>';
          anonymousIncr++;
        }

        try {
          locals[name] = yield variable.type.decodeFromStack(variable.stackDepth, stack, memory, storageResolver, calldata, cursor, variable);
        } catch (e) {
          console.log(e);
          locals[name] = {
            error: '<decoding failed - ' + e.message + '>'
          };
        }
      }
    }

    return locals;
  });
}

exports.solidityLocals = solidityLocals;

function formatMemory(memory) {
  if (memory instanceof Array) {
    memory = memory.join('').replace(/0x/g, '');
  }

  return memory;
}

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/solidity-decoder/solidityProxy.js":
/*!********************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/solidity-decoder/solidityProxy.js ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SolidityProxy = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const remix_lib_1 = __webpack_require__(/*! @remix-project/remix-lib */ "../../../dist/libs/remix-lib/src/index.js");

const traceHelper_1 = __webpack_require__(/*! ../trace/traceHelper */ "../../../dist/libs/remix-debug/src/trace/traceHelper.js");

const stateDecoder_1 = __webpack_require__(/*! ./stateDecoder */ "../../../dist/libs/remix-debug/src/solidity-decoder/stateDecoder.js");

const astHelper_1 = __webpack_require__(/*! ./astHelper */ "../../../dist/libs/remix-debug/src/solidity-decoder/astHelper.js");

class SolidityProxy {
  constructor({
    getCurrentCalledAddressAt,
    getCode
  }) {
    this.cache = new Cache();
    this.reset({});
    this.getCurrentCalledAddressAt = getCurrentCalledAddressAt;
    this.getCode = getCode;
  }
  /**
    * reset the cache and apply a new @arg compilationResult
    *
    * @param {Object} compilationResult  - result os a compilatiion (diectly returned by the compiler)
    */


  reset(compilationResult) {
    this.sources = compilationResult.sources;
    this.contracts = compilationResult.contracts;
    this.cache.reset();
  }
  /**
    * check if the object has been properly loaded
    *
    * @return {Bool} - returns true if a compilation result has been applied
    */


  loaded() {
    return this.contracts !== undefined;
  }
  /**
    * retrieve the compiled contract name at the @arg vmTraceIndex (cached)
    *
    * @param {Int} vmTraceIndex  - index in the vm trave where to resolve the executed contract name
    * @param {Function} cb  - callback returns (error, contractName)
    */


  contractObjectAt(vmTraceIndex) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      const address = this.getCurrentCalledAddressAt(vmTraceIndex);

      if (this.cache.contractObjectByAddress[address]) {
        return this.cache.contractObjectByAddress[address];
      }

      const code = yield this.getCode(address);
      const contract = contractObjectFromCode(this.contracts, code.bytecode, address);
      this.cache.contractObjectByAddress[address] = contract;
      return contract;
    });
  }
  /**
    * extract the state variables of the given compiled @arg contractName (cached)
    *
    * @param {String} contractName  - name of the contract to retrieve state variables from
    * @return {Object} - returns state variables of @args contractName
    */


  extractStatesDefinitions() {
    if (!this.cache.contractDeclarations) {
      this.cache.contractDeclarations = (0, astHelper_1.extractContractDefinitions)(this.sources);
    }

    if (!this.cache.statesDefinitions) {
      this.cache.statesDefinitions = (0, astHelper_1.extractStatesDefinitions)(this.sources, this.cache.contractDeclarations);
    }

    return this.cache.statesDefinitions;
  }
  /**
    * extract the state variables of the given compiled @arg contractName (cached)
    *
    * @param {String} contractName  - name of the contract to retrieve state variables from
    * @return {Object} - returns state variables of @args contractName
    */


  extractStateVariables(contractName) {
    if (!this.cache.stateVariablesByContractName[contractName]) {
      this.cache.stateVariablesByContractName[contractName] = (0, stateDecoder_1.extractStateVariables)(contractName, this.sources);
    }

    return this.cache.stateVariablesByContractName[contractName];
  }
  /**
    * extract the state variables of the given compiled @arg vmtraceIndex (cached)
    *
    * @param {Int} vmTraceIndex  - index in the vm trave where to resolve the state variables
    * @return {Object} - returns state variables of @args vmTraceIndex
    */


  extractStateVariablesAt(vmtraceIndex) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      const contract = yield this.contractObjectAt(vmtraceIndex);
      return this.extractStateVariables(contract.name);
    });
  }
  /**
    * get the AST of the file declare in the @arg sourceLocation
    *
    * @param {Object} sourceLocation  - source location containing the 'file' to retrieve the AST from
    * @return {Object} - AST of the current file
    */


  ast(sourceLocation, generatedSources) {
    const file = this.fileNameFromIndex(sourceLocation.file);

    if (!file && generatedSources && generatedSources.length) {
      for (const source of generatedSources) {
        if (source.id === sourceLocation.file) return source.ast;
      }
    } else if (this.sources[file]) {
      return this.sources[file].ast;
    }

    return null;
  }
  /**
   * get the filename refering to the index from the compilation result
   *
   * @param {Int} index  - index of the filename
   * @return {String} - filename
   */


  fileNameFromIndex(index) {
    return Object.keys(this.contracts)[index];
  }

}

exports.SolidityProxy = SolidityProxy;

function contractObjectFromCode(contracts, code, address) {
  const isCreation = (0, traceHelper_1.isContractCreation)(address);

  for (const file in contracts) {
    for (const contract in contracts[file]) {
      const bytecode = isCreation ? contracts[file][contract].evm.bytecode.object : contracts[file][contract].evm.deployedBytecode.object;

      if (remix_lib_1.util.compareByteCode(code, '0x' + bytecode)) {
        return {
          name: contract,
          contract: contracts[file][contract]
        };
      }
    }
  }

  return null;
}

class Cache {
  constructor() {
    this.reset();
  }

  reset() {
    this.contractObjectByAddress = {};
    this.stateVariablesByContractName = {};
    this.contractDeclarations = null;
    this.statesDefinitions = null;
  }

}

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/solidity-decoder/stateDecoder.js":
/*!*******************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/solidity-decoder/stateDecoder.js ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.solidityState = exports.extractStateVariables = exports.decodeState = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const astHelper_1 = __webpack_require__(/*! ./astHelper */ "../../../dist/libs/remix-debug/src/solidity-decoder/astHelper.js");

const decodeInfo_1 = __webpack_require__(/*! ./decodeInfo */ "../../../dist/libs/remix-debug/src/solidity-decoder/decodeInfo.js");
/**
  * decode the contract state storage
  *
  * @param {Array} storage location  - location of all state variables
  * @param {Object} storageResolver  - resolve storage queries
  * @return {Map} - decoded state variable
  */


function decodeState(stateVars, storageResolver) {
  return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
    const ret = {};

    for (var k in stateVars) {
      var stateVar = stateVars[k];

      try {
        const decoded = yield stateVar.type.decodeFromStorage(stateVar.storagelocation, storageResolver);
        decoded.constant = stateVar.constant;
        decoded.immutable = stateVar.immutable;

        if (decoded.constant) {
          decoded.value = '<constant>';
        }

        if (decoded.immutable) {
          decoded.value = '<immutable>';
        }

        ret[stateVar.name] = decoded;
      } catch (e) {
        console.log(e);
        ret[stateVar.name] = {
          error: '<decoding failed - ' + e.message + '>'
        };
      }
    }

    return ret;
  });
}

exports.decodeState = decodeState;
/**
  * return all storage location variables of the given @arg contractName
  *
  * @param {String} contractName  - name of the contract
  * @param {Object} sourcesList  - sources list
  * @return {Object} - return the location of all contract variables in the storage
  */

function extractStateVariables(contractName, sourcesList) {
  const states = (0, astHelper_1.extractStatesDefinitions)(sourcesList, null);

  if (!states[contractName]) {
    return [];
  }

  const types = states[contractName].stateVariables;
  const offsets = (0, decodeInfo_1.computeOffsets)(types, states, contractName, 'storage');

  if (!offsets) {
    return []; // TODO should maybe return an error
  }

  return offsets.typesOffsets;
}

exports.extractStateVariables = extractStateVariables;
/**
  * return the state of the given @a contractName as a json object
  *
  * @param {Object} storageResolver  - resolve storage queries
  * @param {astList} astList  - AST nodes of all the sources
  * @param {String} contractName  - contract for which state var should be resolved
  * @return {Map} - return the state of the contract
  */

function solidityState(storageResolver, astList, contractName) {
  return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
    const stateVars = extractStateVariables(contractName, astList);

    try {
      return yield decodeState(stateVars, storageResolver);
    } catch (e) {
      return {
        error: '<decoding failed - ' + e.message + '>'
      };
    }
  });
}

exports.solidityState = solidityState;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/solidity-decoder/types/Address.js":
/*!********************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/solidity-decoder/types/Address.js ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Address = void 0;

const util_1 = __webpack_require__(/*! ./util */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/util.js");

const ValueType_1 = __webpack_require__(/*! ./ValueType */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/ValueType.js");

class Address extends ValueType_1.ValueType {
  constructor() {
    super(1, 20, 'address');
  }

  decodeValue(value) {
    if (!value) {
      return '0x0000000000000000000000000000000000000000';
    }

    return '0x' + (0, util_1.extractHexByteSlice)(value, this.storageBytes, 0).toUpperCase();
  }

}

exports.Address = Address;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/solidity-decoder/types/ArrayType.js":
/*!**********************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/solidity-decoder/types/ArrayType.js ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArrayType = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const util_1 = __webpack_require__(/*! ./util */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/util.js");

const remix_lib_1 = __webpack_require__(/*! @remix-project/remix-lib */ "../../../dist/libs/remix-lib/src/index.js");

const ethereumjs_util_1 = __webpack_require__(/*! ethereumjs-util */ "../../../node_modules/ethereumjs-util/dist.browser/index.js");

const RefType_1 = __webpack_require__(/*! ./RefType */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/RefType.js");

const sha3256 = remix_lib_1.util.sha3_256;

class ArrayType extends RefType_1.RefType {
  constructor(underlyingType, arraySize, location) {
    let storageSlots = null;

    if (arraySize === 'dynamic') {
      storageSlots = 1;
    } else {
      if (underlyingType.storageBytes < 32) {
        const itemPerSlot = Math.floor(32 / underlyingType.storageBytes);
        storageSlots = Math.ceil(arraySize / itemPerSlot);
      } else {
        storageSlots = arraySize * underlyingType.storageSlots;
      }
    }

    const size = arraySize !== 'dynamic' ? arraySize : '';
    super(storageSlots, 32, underlyingType.typeName + '[' + size + ']', location);
    this.underlyingType = underlyingType;
    this.arraySize = arraySize;
  }

  decodeFromStorage(location, storageResolver) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      const ret = [];
      let size = null;
      let slotValue;

      try {
        slotValue = yield (0, util_1.extractHexValue)(location, storageResolver, this.storageBytes);
      } catch (e) {
        console.log(e);
        return {
          error: '<decoding failed - ' + e.message + '>',
          type: this.typeName
        };
      }

      const currentLocation = {
        offset: 0,
        slot: location.slot
      };

      if (this.arraySize === 'dynamic') {
        size = (0, util_1.toBN)('0x' + slotValue);
        currentLocation.slot = sha3256(location.slot);
      } else {
        size = new ethereumjs_util_1.BN(this.arraySize);
      }

      var k = (0, util_1.toBN)(0);

      for (; k.lt(size) && k.ltn(300); k.iaddn(1)) {
        try {
          ret.push(yield this.underlyingType.decodeFromStorage(currentLocation, storageResolver));
        } catch (e) {
          return {
            error: '<decoding failed - ' + e.message + '>',
            type: this.typeName
          };
        }

        if (this.underlyingType.storageSlots === 1 && location.offset + this.underlyingType.storageBytes <= 32) {
          currentLocation.offset += this.underlyingType.storageBytes;

          if (currentLocation.offset + this.underlyingType.storageBytes > 32) {
            currentLocation.offset = 0;
            currentLocation.slot = '0x' + (0, util_1.add)(currentLocation.slot, 1).toString(16);
          }
        } else {
          currentLocation.slot = '0x' + (0, util_1.add)(currentLocation.slot, this.underlyingType.storageSlots).toString(16);
          currentLocation.offset = 0;
        }
      }

      return {
        value: ret,
        length: '0x' + size.toString(16),
        type: this.typeName
      };
    });
  }

  decodeFromMemoryInternal(offset, memory, skip) {
    const ret = [];
    let length = this.arraySize;

    if (this.arraySize === 'dynamic') {
      length = memory.substr(2 * offset, 64);
      length = parseInt(length, 16);
      offset = offset + 32;
    }

    if (isNaN(length)) {
      return {
        error: '<decoding failed - length is NaN>',
        type: 'Error'
      };
    }

    if (!skip) skip = 0;
    if (skip) offset = offset + 32 * skip;
    let limit = length - skip;
    if (limit > 10) limit = 10;

    for (var k = 0; k < limit; k++) {
      var contentOffset = offset;
      ret.push(this.underlyingType.decodeFromMemory(contentOffset, memory));
      offset += 32;
    }

    return {
      value: ret,
      length: '0x' + length.toString(16),
      type: this.typeName,
      cursor: skip + limit,
      hasNext: length > skip + limit
    };
  }

}

exports.ArrayType = ArrayType;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/solidity-decoder/types/Bool.js":
/*!*****************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/solidity-decoder/types/Bool.js ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bool = void 0;

const ValueType_1 = __webpack_require__(/*! ./ValueType */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/ValueType.js");

const util_1 = __webpack_require__(/*! ./util */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/util.js");

class Bool extends ValueType_1.ValueType {
  constructor() {
    super(1, 1, 'bool');
  }

  decodeValue(value) {
    if (!value) {
      return false;
    }

    value = (0, util_1.extractHexByteSlice)(value, this.storageBytes, 0);
    return value !== '00';
  }

}

exports.Bool = Bool;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/solidity-decoder/types/DynamicByteArray.js":
/*!*****************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/solidity-decoder/types/DynamicByteArray.js ***!
  \*****************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DynamicByteArray = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const util_1 = __webpack_require__(/*! ./util */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/util.js");

const remix_lib_1 = __webpack_require__(/*! @remix-project/remix-lib */ "../../../dist/libs/remix-lib/src/index.js");

const ethereumjs_util_1 = __webpack_require__(/*! ethereumjs-util */ "../../../node_modules/ethereumjs-util/dist.browser/index.js");

const RefType_1 = __webpack_require__(/*! ./RefType */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/RefType.js");

const sha3256 = remix_lib_1.util.sha3_256;

class DynamicByteArray extends RefType_1.RefType {
  constructor(location) {
    super(1, 32, 'bytes', location);
  }

  decodeFromStorage(location, storageResolver) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      let value = '0x0';

      try {
        value = yield (0, util_1.extractHexValue)(location, storageResolver, this.storageBytes);
      } catch (e) {
        console.log(e);
        return {
          error: '<decoding failed - ' + e.message + '>',
          type: this.typeName
        };
      }

      const length = new ethereumjs_util_1.BN(value, 16);

      if (length.testn(0)) {
        let dataPos = new ethereumjs_util_1.BN(sha3256(location.slot).replace('0x', ''), 16);
        let ret = '';
        let currentSlot = '0x';

        try {
          currentSlot = yield (0, util_1.readFromStorage)(dataPos, storageResolver);
        } catch (e) {
          console.log(e);
          return {
            error: '<decoding failed - ' + e.message + '>',
            type: this.typeName
          };
        }

        while (length.gt(new ethereumjs_util_1.BN(ret.length)) && ret.length < 32000) {
          currentSlot = currentSlot.replace('0x', '');
          ret += currentSlot;
          dataPos = dataPos.add(new ethereumjs_util_1.BN(1));

          try {
            currentSlot = yield (0, util_1.readFromStorage)(dataPos, storageResolver);
          } catch (e) {
            console.log(e);
            return {
              error: '<decoding failed - ' + e.message + '>',
              type: this.typeName
            };
          }
        }

        return {
          value: '0x' + ret.replace(/(00)+$/, ''),
          length: '0x' + length.toString(16),
          type: this.typeName
        };
      } else {
        var size = parseInt(value.substr(value.length - 2, 2), 16) / 2;
        return {
          value: '0x' + value.substr(0, size * 2),
          length: '0x' + size.toString(16),
          type: this.typeName
        };
      }
    });
  }

  decodeFromMemoryInternal(offset, memory) {
    offset = 2 * offset;
    let length = memory.substr(offset, 64);
    length = 2 * parseInt(length, 16);
    return {
      length: '0x' + length.toString(16),
      value: '0x' + memory.substr(offset + 64, length),
      type: this.typeName
    };
  }

}

exports.DynamicByteArray = DynamicByteArray;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/solidity-decoder/types/Enum.js":
/*!*****************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/solidity-decoder/types/Enum.js ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Enum = void 0;

const ValueType_1 = __webpack_require__(/*! ./ValueType */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/ValueType.js");

class Enum extends ValueType_1.ValueType {
  constructor(enumDef) {
    let storageBytes = 0;
    let length = enumDef.members.length;

    while (length > 1) {
      length = length / 256;
      storageBytes++;
    }

    super(1, storageBytes, 'enum');
    this.enumDef = enumDef;
  }

  decodeValue(value) {
    if (!value) {
      return this.enumDef.members[0].name;
    }

    value = parseInt(value, 16);

    if (this.enumDef.members.length > value) {
      return this.enumDef.members[value].name;
    }

    return 'INVALID_ENUM<' + value + '>';
  }

}

exports.Enum = Enum;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/solidity-decoder/types/FixedByteArray.js":
/*!***************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/solidity-decoder/types/FixedByteArray.js ***!
  \***************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FixedByteArray = void 0;

const ValueType_1 = __webpack_require__(/*! ./ValueType */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/ValueType.js");

class FixedByteArray extends ValueType_1.ValueType {
  constructor(storageBytes) {
    super(1, storageBytes, 'bytes' + storageBytes);
  }

  decodeValue(value) {
    return '0x' + value.substr(0, 2 * this.storageBytes).toUpperCase();
  }

}

exports.FixedByteArray = FixedByteArray;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/solidity-decoder/types/Int.js":
/*!****************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/solidity-decoder/types/Int.js ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Int = void 0;

const util_1 = __webpack_require__(/*! ./util */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/util.js");

const ValueType_1 = __webpack_require__(/*! ./ValueType */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/ValueType.js");

class Int extends ValueType_1.ValueType {
  constructor(storageBytes) {
    super(1, storageBytes, 'int' + storageBytes * 8);
  }

  decodeValue(value) {
    value = (0, util_1.extractHexByteSlice)(value, this.storageBytes, 0);
    return (0, util_1.decodeIntFromHex)(value, this.storageBytes, true);
  }

}

exports.Int = Int;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/solidity-decoder/types/Mapping.js":
/*!********************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/solidity-decoder/types/Mapping.js ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mapping = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const RefType_1 = __webpack_require__(/*! ./RefType */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/RefType.js");

const util_1 = __webpack_require__(/*! ./util */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/util.js");

const ethereumjs_util_1 = __webpack_require__(/*! ethereumjs-util */ "../../../node_modules/ethereumjs-util/dist.browser/index.js");

class Mapping extends RefType_1.RefType {
  constructor(underlyingTypes, location, fullType) {
    super(1, 32, fullType, 'storage');
    this.keyType = underlyingTypes.keyType;
    this.valueType = underlyingTypes.valueType;
    this.initialDecodedState = null;
  }

  decodeFromStorage(location, storageResolver) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      const corrections = this.valueType.members ? this.valueType.members.map(value => {
        return value.storagelocation;
      }) : [];

      if (!this.initialDecodedState) {
        // cache the decoded initial storage
        let mappingsInitialPreimages;

        try {
          mappingsInitialPreimages = yield storageResolver.initialMappingsLocation(corrections);
          this.initialDecodedState = yield this.decodeMappingsLocation(mappingsInitialPreimages, location, storageResolver);
        } catch (e) {
          return {
            value: e.message,
            type: this.typeName
          };
        }
      }

      const mappingPreimages = yield storageResolver.mappingsLocation(corrections);
      let ret = yield this.decodeMappingsLocation(mappingPreimages, location, storageResolver); // fetch mapping storage changes

      ret = Object.assign({}, this.initialDecodedState, ret); // merge changes

      return {
        value: ret,
        type: this.typeName
      };
    });
  }

  decodeFromMemoryInternal(offset, memory) {
    // mappings can only exist in storage and not in memory
    // so this should never be called
    return {
      value: '',
      length: '0x0',
      type: this.typeName
    };
  }

  decodeMappingsLocation(preimages, location, storageResolver) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      const mapSlot = (0, util_1.normalizeHex)((0, ethereumjs_util_1.bufferToHex)(location.slot));

      if (!preimages[mapSlot]) {
        return {};
      }

      const ret = {};

      for (const i in preimages[mapSlot]) {
        const mapLocation = getMappingLocation(i, location.slot);
        const globalLocation = {
          offset: location.offset,
          slot: mapLocation
        };
        ret[i] = yield this.valueType.decodeFromStorage(globalLocation, storageResolver);
      }

      return ret;
    });
  }

}

exports.Mapping = Mapping;

function getMappingLocation(key, position) {
  // mapping storage location decribed at http://solidity.readthedocs.io/en/develop/miscellaneous.html#layout-of-state-variables-in-storage
  // > the value corresponding to a mapping key k is located at keccak256(k . p) where . is concatenation.
  // key should be a hex string, and position an int
  const mappingK = (0, ethereumjs_util_1.toBuffer)((0, ethereumjs_util_1.addHexPrefix)(key));
  let mappingP = (0, ethereumjs_util_1.toBuffer)((0, ethereumjs_util_1.addHexPrefix)(position));
  mappingP = (0, ethereumjs_util_1.setLengthLeft)(mappingP, 32);
  const mappingKeyBuf = concatTypedArrays(mappingK, mappingP);
  const mappingStorageLocation = (0, ethereumjs_util_1.keccak)(mappingKeyBuf);
  const mappingStorageLocationinBn = new ethereumjs_util_1.BN(mappingStorageLocation, 16);
  return mappingStorageLocationinBn;
}

function concatTypedArrays(a, b) {
  const c = new a.constructor(a.length + b.length);
  c.set(a, 0);
  c.set(b, a.length);
  return c;
}

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/solidity-decoder/types/RefType.js":
/*!********************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/solidity-decoder/types/RefType.js ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RefType = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const ethers_1 = __webpack_require__(/*! ethers */ "../../../node_modules/ethers/lib.esm/index.js");

const util_1 = __webpack_require__(/*! ./util */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/util.js");

class RefType {
  constructor(storageSlots, storageBytes, typeName, location) {
    this.location = location;
    this.storageSlots = storageSlots;
    this.storageBytes = storageBytes;
    this.typeName = typeName;
    this.basicType = 'RefType';
  }

  decodeFromStorage(input1, input2) {
    throw new Error('This method is abstract');
  }

  decodeFromMemoryInternal(input1, input2, input3) {
    throw new Error('This method is abstract');
  }
  /**
    * decode the type from the stack
    *
    * @param {Int} stackDepth - position of the type in the stack
    * @param {Array} stack - stack
    * @param {String} - memory
    * @param {Object} - storageResolver
    * @return {Object} decoded value
    */


  decodeFromStack(stackDepth, stack, memory, storageResolver, calldata, cursor, variableDetails) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      if (stack.length - 1 < stackDepth) {
        return {
          error: '<decoding failed - stack underflow ' + stackDepth + '>',
          type: this.typeName
        };
      }

      let offset = stack[stack.length - 1 - stackDepth];

      if (this.isInStorage()) {
        offset = (0, util_1.toBN)(offset);

        try {
          return yield this.decodeFromStorage({
            offset: 0,
            slot: offset
          }, storageResolver);
        } catch (e) {
          console.log(e);
          return {
            error: '<decoding failed - ' + e.message + '>',
            type: this.typeName
          };
        }
      } else if (this.isInMemory()) {
        offset = parseInt(offset, 16);
        return this.decodeFromMemoryInternal(offset, memory, cursor);
      } else if (this.isInCallData()) {
        return this._decodeFromCallData(variableDetails, calldata);
      } else {
        return {
          error: '<decoding failed - no decoder for ' + this.location + '>',
          type: this.typeName
        };
      }
    });
  }

  _decodeFromCallData(variableDetails, calldata) {
    calldata = calldata.length > 0 ? calldata[0] : '0x';
    const ethersAbi = new ethers_1.ethers.utils.Interface(variableDetails.abi);
    const fnSign = calldata.substr(0, 10);
    const decodedData = ethersAbi.decodeFunctionData(ethersAbi.getFunction(fnSign), calldata);
    const decodedValue = decodedData[variableDetails.name];
    const isArray = Array.isArray(decodedValue);

    if (isArray) {
      return this._decodeCallDataArray(decodedValue, this);
    }

    return {
      length: isArray ? '0x' + decodedValue.length.toString(16) : undefined,
      value: decodedValue,
      type: this.typeName
    };
  }

  _decodeCallDataArray(value, type) {
    const isArray = Array.isArray(value);

    if (isArray) {
      value = value.map(el => {
        return this._decodeCallDataArray(el, this.underlyingType);
      });
      return {
        length: value.length.toString(16),
        value: value,
        type: type.typeName
      };
    } else {
      return {
        value: value.toString(),
        type: type.underlyingType && type.underlyingType.typeName || type.typeName
      };
    }
  }
  /**
    * decode the type from the memory
    *
    * @param {Int} offset - position of the ref of the type in memory
    * @param {String} memory - memory
    * @return {Object} decoded value
    */


  decodeFromMemory(offset, memory) {
    offset = memory.substr(2 * offset, 64);
    offset = parseInt(offset, 16);
    return this.decodeFromMemoryInternal(offset, memory);
  }
  /**
    * current type defined in storage
    *
    * @return {Bool} - return true if the type is defined in the storage
    */


  isInStorage() {
    return this.location.indexOf('storage') === 0;
  }
  /**
    * current type defined in memory
    *
    * @return {Bool} - return true if the type is defined in the memory
    */


  isInMemory() {
    return this.location.indexOf('memory') === 0;
  }
  /**
    * current type defined in storage
    *
    * @return {Bool} - return true if the type is defined in the storage
    */


  isInCallData() {
    return this.location.indexOf('calldata') === 0;
  }

}

exports.RefType = RefType;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/solidity-decoder/types/StringType.js":
/*!***********************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/solidity-decoder/types/StringType.js ***!
  \***********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StringType = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const DynamicByteArray_1 = __webpack_require__(/*! ./DynamicByteArray */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/DynamicByteArray.js");

class StringType extends DynamicByteArray_1.DynamicByteArray {
  constructor(location) {
    super(location);
    this.typeName = 'string';
  }

  decodeFromStorage(location, storageResolver) {
    const _super = Object.create(null, {
      decodeFromStorage: {
        get: () => super.decodeFromStorage
      }
    });

    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      let decoded = '0x';

      try {
        decoded = yield _super.decodeFromStorage.call(this, location, storageResolver);
      } catch (e) {
        console.log(e);
        return {
          error: '<decoding failed - ' + e.message + '>'
        };
      }

      return format(decoded);
    });
  }

  decodeFromStack(stackDepth, stack, memory, storageResolver, calldata, cursor, variableDetails) {
    const _super = Object.create(null, {
      decodeFromStack: {
        get: () => super.decodeFromStack
      }
    });

    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      try {
        return yield _super.decodeFromStack.call(this, stackDepth, stack, memory, storageResolver, calldata, cursor, variableDetails);
      } catch (e) {
        console.log(e);
        return {
          error: '<decoding failed - ' + e.message + '>'
        };
      }
    });
  }

  decodeFromMemoryInternal(offset, memory) {
    const decoded = super.decodeFromMemoryInternal(offset, memory);
    return format(decoded);
  }

}

exports.StringType = StringType;

function format(decoded) {
  if (decoded.error) {
    return decoded;
  }

  let value = decoded.value;
  value = value.replace('0x', '').replace(/(..)/g, '%$1');
  const ret = {
    length: decoded.length,
    raw: decoded.value,
    type: 'string'
  };

  try {
    ret['value'] = decodeURIComponent(value);
  } catch (e) {
    ret['error'] = 'Invalid UTF8 encoding';
    ret.raw = decoded.value;
  }

  return ret;
}

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/solidity-decoder/types/Struct.js":
/*!*******************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/solidity-decoder/types/Struct.js ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Struct = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const util_1 = __webpack_require__(/*! ./util */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/util.js");

const RefType_1 = __webpack_require__(/*! ./RefType */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/RefType.js");

const Mapping_1 = __webpack_require__(/*! ./Mapping */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/Mapping.js");

class Struct extends RefType_1.RefType {
  constructor(memberDetails, location, fullType) {
    super(memberDetails.storageSlots, 32, 'struct ' + fullType, location);
    this.members = memberDetails.members;
  }

  decodeFromStorage(location, storageResolver) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      const ret = {};

      for (var item of this.members) {
        const globalLocation = {
          offset: location.offset + item.storagelocation.offset,
          slot: (0, util_1.add)(location.slot, item.storagelocation.slot)
        };

        try {
          ret[item.name] = yield item.type.decodeFromStorage(globalLocation, storageResolver);
        } catch (e) {
          console.log(e);
          ret[item.name] = {
            error: '<decoding failed - ' + e.message + '>'
          };
        }
      }

      return {
        value: ret,
        type: this.typeName
      };
    });
  }

  decodeFromMemoryInternal(offset, memory) {
    const ret = {};
    this.members.map((item, i) => {
      var contentOffset = offset;
      var member = item.type.decodeFromMemory(contentOffset, memory);
      ret[item.name] = member;
      if (!(item.type instanceof Mapping_1.Mapping)) offset += 32;
    });
    return {
      value: ret,
      type: this.typeName
    };
  }

}

exports.Struct = Struct;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/solidity-decoder/types/Uint.js":
/*!*****************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/solidity-decoder/types/Uint.js ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Uint = void 0;

const util_1 = __webpack_require__(/*! ./util */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/util.js");

const ValueType_1 = __webpack_require__(/*! ./ValueType */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/ValueType.js");

class Uint extends ValueType_1.ValueType {
  constructor(storageBytes) {
    super(1, storageBytes, 'uint' + storageBytes * 8);
  }

  decodeValue(value) {
    value = (0, util_1.extractHexByteSlice)(value, this.storageBytes, 0);
    return (0, util_1.decodeIntFromHex)(value, this.storageBytes, false);
  }

}

exports.Uint = Uint;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/solidity-decoder/types/ValueType.js":
/*!**********************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/solidity-decoder/types/ValueType.js ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValueType = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const util_1 = __webpack_require__(/*! ./util */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/util.js");

class ValueType {
  constructor(storageSlots, storageBytes, typeName) {
    this.storageSlots = storageSlots;
    this.storageBytes = storageBytes;
    this.typeName = typeName;
    this.basicType = 'ValueType';
  }

  decodeValue(input) {
    throw new Error('This method is abstract');
  }
  /**
    * decode the type with the @arg location from the storage
    *
    * @param {Object} location - containing offset and slot
    * @param {Object} storageResolver  - resolve storage queries
    * @return {Object} - decoded value
    */


  decodeFromStorage(location, storageResolver) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      try {
        var value = yield (0, util_1.extractHexValue)(location, storageResolver, this.storageBytes);
        return {
          value: this.decodeValue(value),
          type: this.typeName
        };
      } catch (e) {
        console.log(e);
        return {
          error: '<decoding failed - ' + e.message + '>',
          type: this.typeName
        };
      }
    });
  }
  /**
    * decode the type from the stack
    *
    * @param {Int} stackDepth - position of the type in the stack
    * @param {Array} stack - stack
    * @param {String} - memory
    * @return {Object} - decoded value
    */


  decodeFromStack(stackDepth, stack, memory, storageResolver, calldata, cursor, variableDetails) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      let value;

      if (stackDepth >= stack.length) {
        value = this.decodeValue('');
      } else {
        value = this.decodeValue(stack[stack.length - 1 - stackDepth].replace('0x', ''));
      }

      return {
        value,
        type: this.typeName
      };
    });
  }
  /**
    * decode the type with the @arg offset location from the memory
    *
    * @param {Int} stackDepth - position of the type in the stack
    * @return {String} - memory
    * @return {Object} - decoded value
    */


  decodeFromMemory(offset, memory) {
    const value = memory.substr(2 * offset, 64);
    return {
      value: this.decodeValue(value),
      type: this.typeName
    };
  }

}

exports.ValueType = ValueType;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/solidity-decoder/types/util.js":
/*!*****************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/solidity-decoder/types/util.js ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeHex = exports.extractLocationFromAstVariable = exports.extractLocation = exports.removeLocation = exports.sub = exports.add = exports.toBN = exports.extractHexValue = exports.extractHexByteSlice = exports.readFromStorage = exports.decodeIntFromHex = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const ethereumjs_util_1 = __webpack_require__(/*! ethereumjs-util */ "../../../node_modules/ethereumjs-util/dist.browser/index.js");

function decodeIntFromHex(value, byteLength, signed) {
  let bigNumber = new ethereumjs_util_1.BN(value, 16);

  if (signed) {
    bigNumber = bigNumber.fromTwos(8 * byteLength);
  }

  return bigNumber.toString(10);
}

exports.decodeIntFromHex = decodeIntFromHex;

function readFromStorage(slot, storageResolver) {
  const hexSlot = '0x' + normalizeHex((0, ethereumjs_util_1.bufferToHex)(slot));
  return new Promise((resolve, reject) => {
    storageResolver.storageSlot(hexSlot, (error, slot) => {
      if (error) {
        return reject(error);
      }

      if (!slot) {
        slot = {
          key: slot,
          value: ''
        };
      }

      return resolve(normalizeHex(slot.value));
    });
  });
}

exports.readFromStorage = readFromStorage;
/**
 * @returns a hex encoded byte slice of length @arg byteLength from inside @arg slotValue.
 *
 * @param {String} slotValue  - hex encoded value to extract the byte slice from
 * @param {Int} byteLength  - Length of the byte slice to extract
 * @param {Int} offsetFromLSB  - byte distance from the right end slot value to the right end of the byte slice
 */

function extractHexByteSlice(slotValue, byteLength, offsetFromLSB) {
  const offset = slotValue.length - 2 * offsetFromLSB - 2 * byteLength;
  return slotValue.substr(offset, 2 * byteLength);
}

exports.extractHexByteSlice = extractHexByteSlice;
/**
 * @returns a hex encoded storage content at the given @arg location. it does not have Ox prefix but always has the full length.
 *
 * @param {Object} location  - object containing the slot and offset of the data to extract.
 * @param {Object} storageResolver  - storage resolver
 * @param {Int} byteLength  - Length of the byte slice to extract
 */

function extractHexValue(location, storageResolver, byteLength) {
  return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
    let slotvalue;

    try {
      slotvalue = yield readFromStorage(location.slot, storageResolver);
    } catch (e) {
      return '';
    }

    return extractHexByteSlice(slotvalue, byteLength, location.offset);
  });
}

exports.extractHexValue = extractHexValue;

function toBN(value) {
  if (value instanceof ethereumjs_util_1.BN) {
    return value;
  } else if (value.match && value.match(/^(0x)?([a-f0-9]*)$/)) {
    value = (0, ethereumjs_util_1.unpadHexString)(value);
    value = new ethereumjs_util_1.BN(value === '' ? '0' : value, 16);
  } else if (!isNaN(value)) {
    value = new ethereumjs_util_1.BN(value);
  }

  return value;
}

exports.toBN = toBN;

function add(value1, value2) {
  return toBN(value1).add(toBN(value2));
}

exports.add = add;

function sub(value1, value2) {
  return toBN(value1).sub(toBN(value2));
}

exports.sub = sub;

function removeLocation(type) {
  return type.replace(/( storage ref| storage pointer| memory| calldata)/g, '');
}

exports.removeLocation = removeLocation;

function extractLocation(type) {
  const match = type.match(/( storage ref| storage pointer| memory| calldata)?$/);

  if (match[1] !== '') {
    return match[1].trim();
  }

  return null;
}

exports.extractLocation = extractLocation;

function extractLocationFromAstVariable(node) {
  if (node.storageLocation !== 'default') {
    return node.storageLocation;
  } else if (node.stateVariable) {
    return 'storage';
  }

  return 'default'; // local variables => storage, function parameters & return values => memory, state => storage
}

exports.extractLocationFromAstVariable = extractLocationFromAstVariable;

function normalizeHex(hex) {
  hex = hex.replace('0x', '');

  if (hex.length < 64) {
    return new Array(64 - hex.length + 1).join('0') + hex;
  }

  return hex;
}

exports.normalizeHex = normalizeHex;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/source/sourceLocationTracker.js":
/*!******************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/source/sourceLocationTracker.js ***!
  \******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SourceLocationTracker = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const eventManager_1 = __webpack_require__(/*! ../eventManager */ "../../../dist/libs/remix-debug/src/eventManager.js");

const traceHelper_1 = __webpack_require__(/*! ../trace/traceHelper */ "../../../dist/libs/remix-debug/src/trace/traceHelper.js");

const sourceMappingDecoder_1 = __webpack_require__(/*! ./sourceMappingDecoder */ "../../../dist/libs/remix-debug/src/source/sourceMappingDecoder.js");

const remix_lib_1 = __webpack_require__(/*! @remix-project/remix-lib */ "../../../dist/libs/remix-lib/src/index.js");
/**
 * Process the source code location for the current executing bytecode
 */


class SourceLocationTracker {
  constructor(_codeManager, {
    debugWithGeneratedSources
  }) {
    this.opts = {
      debugWithGeneratedSources: debugWithGeneratedSources || false
    };
    this.codeManager = _codeManager;
    this.event = new eventManager_1.EventManager();
    this.sourceMapByAddress = {};
  }
  /**
   * Return the source location associated with the given @arg index (instruction index)
   *
   * @param {String} address - contract address from which the source location is retrieved
   * @param {Int} index - index in the instruction list from where the source location is retrieved
   * @param {Object} contractDetails - AST of compiled contracts
   */


  getSourceLocationFromInstructionIndex(address, index, contracts) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      const sourceMap = yield this.extractSourceMap(this, this.codeManager, address, contracts);
      return (0, sourceMappingDecoder_1.atIndex)(index, sourceMap['map']);
    });
  }
  /**
   * Return the source location associated with the given @arg vmTraceIndex
   *
   * @param {String} address - contract address from which the source location is retrieved
   * @param {Int} vmtraceStepIndex - index of the current code in the vmtrace
   * @param {Object} contractDetails - AST of compiled contracts
   */


  getSourceLocationFromVMTraceIndex(address, vmtraceStepIndex, contracts) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      const sourceMap = yield this.extractSourceMap(this, this.codeManager, address, contracts);
      const index = this.codeManager.getInstructionIndex(address, vmtraceStepIndex);
      return (0, sourceMappingDecoder_1.atIndex)(index, sourceMap['map']);
    });
  }
  /**
   * Returns the generated sources from a specific @arg address
   *
   * @param {String} address - contract address from which has generated sources
   * @param {Object} generatedSources - Object containing the sourceid, ast and the source code.
   */


  getGeneratedSourcesFromAddress(address) {
    if (!this.opts.debugWithGeneratedSources) return null;
    if (this.sourceMapByAddress[address]) return this.sourceMapByAddress[address].generatedSources;
    return null;
  }
  /**
   * Returns the total amount of sources from a specific @arg address and @arg contracts
   *
   * @param {String} address - contract address from which has generated sources
   * @param {Object} contracts - AST of compiled contracts
   */


  getTotalAmountOfSources(address, contracts) {
    let sourcesLength = Object.keys(contracts).length;
    const generatedSources = this.getGeneratedSourcesFromAddress(address);
    if (generatedSources) sourcesLength = sourcesLength + Object.keys(generatedSources).length;
    return sourcesLength;
  }
  /**
   * Return a valid source location associated with the given @arg vmTraceIndex
   *
   * @param {String} address - contract address from which the source location is retrieved
   * @param {Int} vmtraceStepIndex - index of the current code in the vmtrace
   * @param {Object} contractDetails - AST of compiled contracts
   */


  getValidSourceLocationFromVMTraceIndex(address, vmtraceStepIndex, contracts) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      const amountOfSources = this.getTotalAmountOfSources(address, contracts);
      let map = {
        file: -1
      };
      /*
        (map.file === -1) this indicates that it isn't associated with a known source code
        (map.file > amountOfSources - 1) this indicates the current file index exceed the total number of files.
                                                this happens when generated sources should not be considered.
      */

      while (vmtraceStepIndex >= 0 && (map.file === -1 || map.file > amountOfSources - 1)) {
        map = yield this.getSourceLocationFromVMTraceIndex(address, vmtraceStepIndex, contracts);
        vmtraceStepIndex = vmtraceStepIndex - 1;
      }

      return map;
    });
  }

  clearCache() {
    this.sourceMapByAddress = {};
  }

  getSourceMap(address, code, contracts) {
    const isCreation = (0, traceHelper_1.isContractCreation)(address);
    let bytes;

    for (const file in contracts) {
      for (const contract in contracts[file]) {
        const bytecode = contracts[file][contract].evm.bytecode;
        const deployedBytecode = contracts[file][contract].evm.deployedBytecode;
        if (!deployedBytecode) continue;
        bytes = isCreation ? bytecode.object : deployedBytecode.object;

        if (remix_lib_1.util.compareByteCode(code, '0x' + bytes)) {
          const generatedSources = isCreation ? bytecode.generatedSources : deployedBytecode.generatedSources;
          const map = isCreation ? bytecode.sourceMap : deployedBytecode.sourceMap;
          return {
            generatedSources,
            map
          };
        }
      }
    }

    return null;
  }

  extractSourceMap(self, codeManager, address, contracts) {
    return new Promise((resolve, reject) => {
      if (self.sourceMapByAddress[address]) return resolve(self.sourceMapByAddress[address]);
      codeManager.getCode(address).then(result => {
        const sourceMap = this.getSourceMap(address, result.bytecode, contracts);

        if (sourceMap) {
          if (!(0, traceHelper_1.isContractCreation)(address)) self.sourceMapByAddress[address] = sourceMap;
          return resolve(sourceMap);
        }

        reject(new Error('no sourcemap associated with the code ' + address));
      }).catch(reject);
    });
  }

}

exports.SourceLocationTracker = SourceLocationTracker;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/source/sourceMappingDecoder.js":
/*!*****************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/source/sourceMappingDecoder.js ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.atIndex = exports.nodesAtPosition = exports.findNodeAtInstructionIndex = exports.convertOffsetToLineColumn = exports.getLinebreakPositions = exports.decompressAll = exports.decode = void 0;

const remix_astwalker_1 = __webpack_require__(/*! @remix-project/remix-astwalker */ "../../../dist/libs/remix-astwalker/src/index.js");

const remix_lib_1 = __webpack_require__(/*! @remix-project/remix-lib */ "../../../dist/libs/remix-lib/src/index.js");
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


function decode(value) {
  if (value) {
    value = value.split(':');
    return {
      start: parseInt(value[0]),
      length: parseInt(value[1]),
      file: parseInt(value[2])
    };
  }
}

exports.decode = decode;
/**
 * Decode the source mapping for the given compressed mapping
 *
 * @param {String} mapping     - compressed source mapping given by solc-bin
 * @return {Array} returns the decompressed source mapping. Array of {start, length, file, jump}
 */

function decompressAll(mapping) {
  const map = mapping.split(';');
  const ret = [];

  for (const k in map) {
    const compressed = map[k].split(':');
    const sourceMap = {
      start: compressed[0] ? parseInt(compressed[0]) : ret[ret.length - 1].start,
      length: compressed[1] ? parseInt(compressed[1]) : ret[ret.length - 1].length,
      file: compressed[2] ? parseInt(compressed[2]) : ret[ret.length - 1].file,
      jump: compressed[3] ? compressed[3] : ret[ret.length - 1].jump
    };
    ret.push(sourceMap);
  }

  return ret;
}

exports.decompressAll = decompressAll;
/**
  * Retrieve line/column position of each source char
  *
  * @param {String} source - contract source code
  * @return {Array} returns an array containing offset of line breaks
  */

function getLinebreakPositions(source) {
  const ret = [];

  for (let pos = source.indexOf('\n'); pos >= 0; pos = source.indexOf('\n', pos + 1)) {
    ret.push(pos);
  }

  return ret;
}

exports.getLinebreakPositions = getLinebreakPositions;
/**
 * Retrieve the line/column position for the given source mapping
 *
 * @param {Object} sourceLocation - object containing attributes {source} and {length}
 * @param {Array} lineBreakPositions - array returned by the function 'getLinebreakPositions'
 * @return {Object} returns an object {start: {line, column}, end: {line, column}} (line/column count start at 0)
 */

function convertOffsetToLineColumn(sourceLocation, lineBreakPositions) {
  if (sourceLocation.start >= 0 && sourceLocation.length >= 0) {
    return {
      start: convertFromCharPosition(sourceLocation.start, lineBreakPositions),
      end: convertFromCharPosition(sourceLocation.start + sourceLocation.length, lineBreakPositions)
    };
  }

  return {
    start: null,
    end: null
  };
}

exports.convertOffsetToLineColumn = convertOffsetToLineColumn;

function convertFromCharPosition(pos, lineBreakPositions) {
  let line = remix_lib_1.util.findLowerBound(pos, lineBreakPositions);

  if (lineBreakPositions[line] !== pos) {
    line = line + 1;
  }

  const beginColumn = line === 0 ? 0 : lineBreakPositions[line - 1] + 1;
  const column = pos - beginColumn;
  return {
    line,
    column
  };
}

function sourceLocationFromAstNode(astNode) {
  if (astNode.src) {
    const split = astNode.src.split(':');
    return {
      start: parseInt(split[0]),
      length: parseInt(split[1]),
      file: parseInt(split[2])
    };
  }

  return null;
}
/**
 * Retrieve the first @arg astNodeType that include the source map at arg instIndex
 *
 * @param {String} astNodeType - node type that include the source map instIndex
 * @param {String} instIndex - instruction index used to retrieve the source map
 * @param {String} sourceMap - source map given by the compilation result
 * @param {Object} ast - ast given by the compilation result
 */


function findNodeAtInstructionIndex(astNodeType, instIndex, sourceMap, ast) {
  const sourceLocation = atIndex(instIndex, sourceMap);
  return findNodeAtSourceLocation(astNodeType, sourceLocation, ast);
}

exports.findNodeAtInstructionIndex = findNodeAtInstructionIndex;

function findNodeAtSourceLocation(astNodeType, sourceLocation, ast) {
  const astWalker = new remix_astwalker_1.AstWalker();
  let found = null;

  const callback = function (node) {
    const nodeLocation = sourceLocationFromAstNode(node);

    if (!nodeLocation) {
      return;
    }

    if (nodeLocation.start <= sourceLocation.start && nodeLocation.start + nodeLocation.length >= sourceLocation.start + sourceLocation.length) {
      if (astNodeType === node.nodeType) {
        found = node;
      }
    }
  };

  astWalker.walkFull(ast.ast, callback);
  return found;
}
/**
 * get a list of nodes that are at the given @arg position
 *
 * @param {String} astNodeType      - type of node to return
 * @param {Int} position     - cursor position
 * @return {Object} ast object given by the compiler
 */


function nodesAtPosition(astNodeType, position, ast) {
  const astWalker = new remix_astwalker_1.AstWalker();
  const found = [];

  const callback = function (node) {
    var nodeLocation = sourceLocationFromAstNode(node);

    if (!nodeLocation) {
      return;
    }

    if (nodeLocation.start <= position && nodeLocation.start + nodeLocation.length >= position) {
      if (!astNodeType || astNodeType === node.nodeType) {
        found.push(node);
      }
    }
  };

  astWalker.walkFull(ast.ast, callback);
  return found;
}

exports.nodesAtPosition = nodesAtPosition;
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

function atIndex(index, mapping) {
  const ret = {};
  const map = mapping.split(';');

  if (index >= map.length) {
    index = map.length - 1;
  }

  for (let k = index; k >= 0; k--) {
    let current = map[k];

    if (!current.length) {
      continue;
    }

    current = current.split(':');

    if (ret['start'] === undefined && current[0] && current[0] !== '-1' && current[0].length) {
      ret['start'] = parseInt(current[0]);
    }

    if (ret['length'] === undefined && current[1] && current[1] !== '-1' && current[1].length) {
      ret['length'] = parseInt(current[1]);
    }

    if (ret['file'] === undefined && current[2] && current[2].length) {
      ret['file'] = parseInt(current[2]);
    }

    if (ret['jump'] === undefined && current[3] && current[3].length) {
      ret['jump'] = current[3];
    }

    if (ret['start'] !== undefined && ret['length'] !== undefined && ret['file'] !== undefined && ret['jump'] !== undefined) {
      break;
    }
  }

  return ret;
}

exports.atIndex = atIndex;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/storage/mappingPreimages.js":
/*!**************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/storage/mappingPreimages.js ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeMappingsKeys = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const util_1 = __webpack_require__(/*! ../solidity-decoder/types/util */ "../../../dist/libs/remix-debug/src/solidity-decoder/types/util.js");
/**
  * extract the mappings location from the storage
  * like { "<mapping_slot>" : { "<mapping-key1>": preimageOf1 }, { "<mapping-key2>": preimageOf2 }, ... }
  *
  * @param {Object} storage  - storage given by storage Viewer (basically a mapping hashedkey : {key, value})
  * @param {Array} corrections - used in case the calculated sha3 has been modifyed before SSTORE (notably used for struct in mapping).
  * @param {Function} callback  - calback
  * @return {Map} - solidity mapping location (e.g { "<mapping_slot>" : { "<mapping-key1>": preimageOf1 }, { "<mapping-key2>": preimageOf2 }, ... })
  */


function decodeMappingsKeys(web3, storage, corrections) {
  return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
    const ret = {};
    if (!corrections.length) corrections.push({
      offset: 0,
      slot: 0
    });

    for (const hashedLoc in storage) {
      var preimage;

      try {
        const key = storage[hashedLoc].key;

        for (const k in corrections) {
          const corrected = (0, util_1.sub)(key, corrections[k].slot).toString(16);
          preimage = yield getPreimage(web3, '0x' + corrected);
          if (preimage) break;
        }
      } catch (e) {} // eslint-disable-line no-empty


      if (preimage) {
        // got preimage!
        // get mapping position (i.e. storage slot), its the last 32 bytes
        const slotByteOffset = preimage.length - 64;
        const mappingSlot = preimage.substr(slotByteOffset);
        const mappingKey = preimage.substr(0, slotByteOffset);

        if (!ret[mappingSlot]) {
          ret[mappingSlot] = {};
        }

        ret[mappingSlot][mappingKey] = preimage;
      }
    }

    return ret;
  });
}

exports.decodeMappingsKeys = decodeMappingsKeys;
/**
  * Uses web3 to return preimage of a key
  *
  * @param {String} key  - key to retrieve the preimage of
  * @return {String} - preimage of the given key
  */

function getPreimage(web3, key) {
  return new Promise((resolve, reject) => {
    web3.debug.preimage(key.indexOf('0x') === 0 ? key : '0x' + key, (error, preimage) => {
      if (error) {
        return resolve(null);
      }

      resolve(preimage);
    });
  });
}

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/storage/storageResolver.js":
/*!*************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/storage/storageResolver.js ***!
  \*************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StorageResolver = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const traceHelper_1 = __webpack_require__(/*! ../trace/traceHelper */ "../../../dist/libs/remix-debug/src/trace/traceHelper.js");

const mappingPreimages_1 = __webpack_require__(/*! ./mappingPreimages */ "../../../dist/libs/remix-debug/src/storage/mappingPreimages.js");
/**
  * Basically one instance is created for one debugging session.
  * (TODO: one instance need to be shared over all the components)
  */


class StorageResolver {
  constructor(options) {
    this.storageByAddress = {};
    this.preimagesMappingByAddress = {};
    this.maxSize = 100;
    this.web3 = options.web3;
    this.zeroSlot = '0x0000000000000000000000000000000000000000000000000000000000000000';
  }
  /**
   * returns the storage for the given context (address and vm trace index)
   * returns the range 0x0 => this.maxSize
   *
   * @param {Object} - tx - transaction
   * @param {Int} - stepIndex - Index of the stop in the vm trace
   * @param {String} - address - lookup address
   * @param {Function} - callback - contains a map: [hashedKey] = {key, hashedKey, value}
   */


  storageRange(tx, stepIndex, address) {
    return this.storageRangeInternal(this, this.zeroSlot, tx, stepIndex, address);
  }
  /**
   * compute the mappgings type locations for the current address (cached for a debugging session)
   * note: that only retrieve the first 100 items.
   *
   * @param {Object} tx
   * @param {Int} stepIndex
   * @param {Object} address  - storage
   * @param {Array} corrections - used in case the calculated sha3 has been modifyed before SSTORE (notably used for struct in mapping).
   * @return {Function} - callback
   */


  initialPreimagesMappings(tx, stepIndex, address, corrections) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      if (this.preimagesMappingByAddress[address]) {
        return this.preimagesMappingByAddress[address];
      }

      const storage = yield this.storageRange(tx, stepIndex, address);
      const mappings = (0, mappingPreimages_1.decodeMappingsKeys)(this.web3, storage, corrections);
      this.preimagesMappingByAddress[address] = mappings;
      return mappings;
    });
  }
  /**
   * return a slot value for the given context (address and vm trace index)
   *
   * @param {String} - slot - slot key
   * @param {Object} - tx - transaction
   * @param {Int} - stepIndex - Index of the stop in the vm trace
   * @param {String} - address - lookup address
   * @param {Function} - callback - {key, hashedKey, value} -
   */


  storageSlot(slot, tx, stepIndex, address) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      const storage = yield this.storageRangeInternal(this, slot, tx, stepIndex, address);
      return storage[slot] !== undefined ? storage[slot] : null;
    });
  }
  /**
   * return True if the storage at @arg address is complete
   *
   * @param {String} address  - contract address
   * @return {Bool} - return True if the storage at @arg address is complete
   */


  isComplete(address) {
    return this.storageByAddress[address] && this.storageByAddress[address].complete;
  }
  /**
   * retrieve the storage and ensure at least @arg slot is cached.
   * - If @arg slot is already cached, the storage will be returned from the cache
   *   even if the next 1000 items are not in the cache.
   * - If @arg slot is not cached, the corresponding value will be resolved and the next 1000 slots.
   */


  storageRangeInternal(self, slotKey, tx, stepIndex, address) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      var cached = this.fromCache(self, address);

      if (cached && cached.storage[slotKey]) {
        // we have the current slot in the cache and maybe the next 1000...
        return cached.storage;
      }

      const result = yield this.storageRangeWeb3Call(tx, address, slotKey, self.maxSize);
      const [storage, nextKey] = result;

      if (!storage[slotKey] && slotKey !== self.zeroSlot) {
        // we don't cache the zero slot (could lead to inconsistency)
        storage[slotKey] = {
          key: slotKey,
          value: self.zeroSlot
        };
      }

      self.toCache(self, address, storage);

      if (slotKey === self.zeroSlot && !nextKey) {
        // only working if keys are sorted !!
        self.storageByAddress[address].complete = true;
      }

      return storage;
    });
  }
  /**
   * retrieve the storage from the cache. if @arg slot is defined, return only the desired slot, if not return the entire known storage
   *
   * @param {String} address  - contract address
   * @return {String} - either the entire known storage or a single value
   */


  fromCache(self, address) {
    if (!self.storageByAddress[address]) {
      return null;
    }

    return self.storageByAddress[address];
  }
  /**
   * store the result of `storageRangeAtInternal`
   *
   * @param {String} address  - contract address
   * @param {Object} storage  - result of `storageRangeAtInternal`, contains {key, hashedKey, value}
   */


  toCache(self, address, storage) {
    if (!self.storageByAddress[address]) {
      self.storageByAddress[address] = {};
    }

    self.storageByAddress[address].storage = Object.assign(self.storageByAddress[address].storage || {}, storage);
  }

  storageRangeWeb3Call(tx, address, start, maxSize) {
    return new Promise((resolve, reject) => {
      if ((0, traceHelper_1.isContractCreation)(address)) {
        resolve([{}, null]);
      } else {
        this.web3.debug.storageRangeAt(tx.blockHash, tx.hash, address, start, maxSize, (error, result) => {
          if (error) {
            reject(error);
          } else if (result.storage) {
            resolve([result.storage, result.nextKey]);
          } else {
            reject(new Error('the storage has not been provided'));
          }
        });
      }
    });
  }

}

exports.StorageResolver = StorageResolver;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/storage/storageViewer.js":
/*!***********************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/storage/storageViewer.js ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StorageViewer = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const remix_lib_1 = __webpack_require__(/*! @remix-project/remix-lib */ "../../../dist/libs/remix-lib/src/index.js");

const mappingPreimages_1 = __webpack_require__(/*! ./mappingPreimages */ "../../../dist/libs/remix-debug/src/storage/mappingPreimages.js");
/**
   * easier access to the storage resolver
   * Basically one instance is created foreach execution step and foreach component that need it.
   * (TODO: one instance need to be shared over all the components)
   */


class StorageViewer {
  constructor(_context, _storageResolver, _traceManager) {
    this.context = _context;
    this.storageResolver = _storageResolver;
    this.web3 = this.storageResolver.web3;
    this.initialMappingsLocationPromise = null;
    this.currentMappingsLocationPromise = null;
    this.storageChanges = _traceManager.accumulateStorageChanges(this.context.stepIndex, this.context.address, {});
  }
  /**
    * return the storage for the current context (address and vm trace index)
    * by default now returns the range 0 => 1000
    *
    * @param {Function} - callback - contains a map: [hashedKey] = {key, hashedKey, value}
    */


  storageRange() {
    return new Promise((resolve, reject) => {
      this.storageResolver.storageRange(this.context.tx, this.context.stepIndex, this.context.address).then(storage => {
        resolve(Object.assign({}, storage, this.storageChanges));
      }).catch(reject);
    });
  }
  /**
    * return a slot value for the current context (address and vm trace index)
    * @param {String} - slot - slot key (not hashed key!)
    * @param {Function} - callback - {key, hashedKey, value} -
    */


  storageSlot(slot, callback) {
    const hashed = remix_lib_1.util.sha3_256(slot);

    if (this.storageChanges[hashed]) {
      return callback(null, this.storageChanges[hashed]);
    }

    this.storageResolver.storageSlot(hashed, this.context.tx, this.context.stepIndex, this.context.address).then(storage => {
      callback(null, storage);
    }).catch(callback);
  }
  /**
    * return True if the storage at @arg address is complete
    *
    * @param {String} address  - contract address
    * @return {Bool} - return True if the storage at @arg address is complete
    */


  isComplete(address) {
    return this.storageResolver.isComplete(address);
  }
  /**
    * return all the possible mappings locations for the current context (cached) do not return state changes during the current transaction
    *
    * @param {Array} corrections - used in case the calculated sha3 has been modifyed before SSTORE (notably used for struct in mapping).
    */


  initialMappingsLocation(corrections) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      if (!this.initialMappingsLocationPromise) {
        this.initialMappingsLocationPromise = this.storageResolver.initialPreimagesMappings(this.context.tx, this.context.stepIndex, this.context.address, corrections);
      }

      return this.initialMappingsLocationPromise;
    });
  }
  /**
    * return all the possible mappings locations for the current context (cached) and current mapping slot. returns state changes during the current transaction
    *
    * @param {Array} corrections - used in case the calculated sha3 has been modifyed before SSTORE (notably used for struct in mapping).
    */


  mappingsLocation(corrections) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      if (!this.currentMappingsLocationPromise) {
        this.currentMappingsLocationPromise = new Promise((resolve, reject) => {
          const mappingsLocationChanges = this.extractMappingsLocationChanges(this.storageChanges, corrections);
          return resolve(mappingsLocationChanges);
        });
      }

      return this.currentMappingsLocationPromise;
    });
  }
  /**
    * retrieve mapping location changes from the storage changes.
    * @param {Map} storageChanges
    * @param {Array} corrections - used in case the calculated sha3 has been modifyed before SSTORE (notably used for struct in mapping).
    */


  extractMappingsLocationChanges(storageChanges, corrections) {
    if (this.mappingsLocationChanges) {
      return this.mappingsLocationChanges;
    }

    const mappings = (0, mappingPreimages_1.decodeMappingsKeys)(this.web3, storageChanges, corrections);
    this.mappingsLocationChanges = mappings;
    return this.mappingsLocationChanges;
  }

}

exports.StorageViewer = StorageViewer;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/trace/traceAnalyser.js":
/*!*********************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/trace/traceAnalyser.js ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TraceAnalyser = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const traceHelper = (0, tslib_1.__importStar)(__webpack_require__(/*! ./traceHelper */ "../../../dist/libs/remix-debug/src/trace/traceHelper.js"));

class TraceAnalyser {
  constructor(_cache) {
    this.traceCache = _cache;
    this.trace = null;
  }

  analyse(trace, tx) {
    this.trace = trace;
    this.traceCache.pushStoreChanges(0, tx.to);
    let context = {
      storageContext: [tx.to],
      currentCallIndex: 0,
      lastCallIndex: 0
    };
    const callStack = [tx.to];
    this.traceCache.pushCall(trace[0], 0, callStack[0], callStack.slice(0));

    if (traceHelper.isContractCreation(tx.to)) {
      this.traceCache.pushContractCreation(tx.to, tx.input);
    }

    this.buildCalldata(0, this.trace[0], tx, true);

    for (let k = 0; k < this.trace.length; k++) {
      const step = this.trace[k];
      this.buildMemory(k, step);
      context = this.buildDepth(k, step, tx, callStack, context);
      context = this.buildStorage(k, step, context);
      this.buildReturnValues(k, step);
    }

    return true;
  }

  buildReturnValues(index, step) {
    if (traceHelper.isReturnInstruction(step)) {
      let offset = 2 * parseInt(step.stack[step.stack.length - 1], 16);
      const size = 2 * parseInt(step.stack[step.stack.length - 2], 16);
      const memory = this.trace[this.traceCache.memoryChanges[this.traceCache.memoryChanges.length - 1]].memory;
      const noOfReturnParams = size / 64;
      const memoryInString = memory.join('');
      const returnParamsObj = [];

      for (let i = 0; i < noOfReturnParams; i++) {
        returnParamsObj.push('0x' + memoryInString.substring(offset, offset + 64));
        offset += 64;
      }

      this.traceCache.pushReturnValue(index, returnParamsObj);
    }

    if (traceHelper.isReturnInstruction(step) || traceHelper.isStopInstruction(step) || traceHelper.isRevertInstruction(step)) {
      this.traceCache.pushStopIndex(index, this.traceCache.currentCall.call.address);
    }

    try {
      if (parseInt(step.gas) - parseInt(step.gasCost) <= 0 || step.error === 'OutOfGas') {
        this.traceCache.pushOutOfGasIndex(index, this.traceCache.currentCall.call.address);
      }
    } catch (e) {
      console.error(e);
    }
  }

  buildCalldata(index, step, tx, newContext) {
    let calldata = '';

    if (index === 0) {
      calldata = tx.input;
      this.traceCache.pushCallDataChanges(index, calldata);
    } else if (!newContext) {
      const lastCall = this.traceCache.callsData[this.traceCache.callDataChanges[this.traceCache.callDataChanges.length - 2]];
      this.traceCache.pushCallDataChanges(index + 1, lastCall);
    } else {
      const memory = this.trace[this.traceCache.memoryChanges[this.traceCache.memoryChanges.length - 1]].memory;
      const callStep = this.trace[index];
      const stack = callStep.stack;
      let offset = 0;
      let size = 0;

      if (callStep.op === 'DELEGATECALL') {
        offset = 2 * parseInt(stack[stack.length - 3], 16);
        size = 2 * parseInt(stack[stack.length - 4], 16);
      } else {
        offset = 2 * parseInt(stack[stack.length - 4], 16);
        size = 2 * parseInt(stack[stack.length - 5], 16);
      }

      calldata = '0x' + memory.join('').substr(offset, size);
      this.traceCache.pushCallDataChanges(index + 1, calldata);
    }
  }

  buildMemory(index, step) {
    if (step.memory) {
      this.traceCache.pushMemoryChanges(index);
    }
  }

  buildStorage(index, step, context) {
    if (traceHelper.newContextStorage(step) && !traceHelper.isCallToPrecompiledContract(index, this.trace)) {
      const calledAddress = traceHelper.resolveCalledAddress(index, this.trace);

      if (calledAddress) {
        context.storageContext.push(calledAddress);
      } else {
        console.log('unable to build storage changes. ' + index + ' does not match with a CALL. storage changes will be corrupted');
      }

      this.traceCache.pushStoreChanges(index + 1, context.storageContext[context.storageContext.length - 1]);
    } else if (traceHelper.isSSTOREInstruction(step)) {
      this.traceCache.pushStoreChanges(index + 1, context.storageContext[context.storageContext.length - 1], step.stack[step.stack.length - 1], step.stack[step.stack.length - 2]);
    } else if (traceHelper.isReturnInstruction(step) || traceHelper.isStopInstruction(step)) {
      context.storageContext.pop();
      this.traceCache.pushStoreChanges(index + 1, context.storageContext[context.storageContext.length - 1]);
    } else if (traceHelper.isRevertInstruction(step)) {
      context.storageContext.pop();
      this.traceCache.resetStoreChanges();
    }

    return context;
  }

  buildDepth(index, step, tx, callStack, context) {
    if (traceHelper.isCallInstruction(step) && !traceHelper.isCallToPrecompiledContract(index, this.trace)) {
      let newAddress;

      if (traceHelper.isCreateInstruction(step)) {
        newAddress = traceHelper.contractCreationToken(index);
        callStack.push(newAddress);
        const lastMemoryChange = this.traceCache.memoryChanges[this.traceCache.memoryChanges.length - 1];
        this.traceCache.pushContractCreationFromMemory(index, newAddress, this.trace, lastMemoryChange);
      } else {
        newAddress = traceHelper.resolveCalledAddress(index, this.trace);

        if (newAddress) {
          callStack.push(newAddress);
        } else {
          console.log('unable to build depth changes. ' + index + ' does not match with a CALL. depth changes will be corrupted');
        }
      }

      this.traceCache.pushCall(step, index + 1, newAddress, callStack.slice(0));
      this.buildCalldata(index, step, tx, true);
      this.traceCache.pushSteps(index, context.currentCallIndex);
      context.lastCallIndex = context.currentCallIndex;
      context.currentCallIndex = 0;
    } else if (traceHelper.isReturnInstruction(step) || traceHelper.isStopInstruction(step) || step.error || step.invalidDepthChange) {
      if (index < this.trace.length) {
        callStack.pop();
        this.traceCache.pushCall(step, index + 1, null, callStack.slice(0), step.error || step.invalidDepthChange);
        this.buildCalldata(index, step, tx, false);
        this.traceCache.pushSteps(index, context.currentCallIndex);
        context.currentCallIndex = context.lastCallIndex + 1;
      }
    } else {
      this.traceCache.pushSteps(index, context.currentCallIndex);
      context.currentCallIndex++;
    }

    return context;
  }

}

exports.TraceAnalyser = TraceAnalyser;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/trace/traceCache.js":
/*!******************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/trace/traceCache.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TraceCache = void 0;

const remix_lib_1 = __webpack_require__(/*! @remix-project/remix-lib */ "../../../dist/libs/remix-lib/src/index.js"); // eslint-disable-next-line camelcase


const {
  sha3_256
} = remix_lib_1.util;

class TraceCache {
  constructor() {
    this.init();
  }

  init() {
    // ...Changes contains index in the vmtrace of the corresponding changes
    this.returnValues = {};
    this.stopIndexes = [];
    this.outofgasIndexes = [];
    this.currentCall = null;
    this.callsTree = null;
    this.callsData = {};
    this.contractCreation = {};
    this.steps = {};
    this.addresses = [];
    this.callDataChanges = [];
    this.memoryChanges = [];
    this.storageChanges = [];
    this.sstore = {}; // all sstore occurence in the trace
  }

  pushSteps(index, currentCallIndex) {
    this.steps[index] = currentCallIndex;
  }

  pushCallDataChanges(value, calldata) {
    this.callDataChanges.push(value);
    this.callsData[value] = calldata;
  }

  pushMemoryChanges(value) {
    this.memoryChanges.push(value);
  } // outOfGas has been removed because gas left logging is apparently made differently
  // in the vm/geth/eth. TODO add the error property (with about the error in all clients)


  pushCall(step, index, address, callStack, reverted) {
    const validReturnStep = step.op === 'RETURN' || step.op === 'STOP';

    if ((validReturnStep || reverted) && this.currentCall) {
      this.currentCall.call.return = index - 1;

      if (!validReturnStep) {
        this.currentCall.call.reverted = reverted;
      }

      var parent = this.currentCall.parent;
      if (parent) this.currentCall = {
        call: parent.call,
        parent: parent.parent
      };
      return;
    }

    const call = {
      op: step.op,
      address: address,
      callStack: callStack,
      calls: {},
      start: index
    };
    this.addresses.push(address);

    if (this.currentCall) {
      this.currentCall.call.calls[index] = call;
    } else {
      this.callsTree = {
        call: call
      };
    }

    this.currentCall = {
      call: call,
      parent: this.currentCall
    };
  }

  pushOutOfGasIndex(index, address) {
    this.outofgasIndexes.push({
      index,
      address
    });
  }

  pushStopIndex(index, address) {
    this.stopIndexes.push({
      index,
      address
    });
  }

  pushReturnValue(step, value) {
    this.returnValues[step] = value;
  }

  pushContractCreationFromMemory(index, token, trace, lastMemoryChange) {
    const memory = trace[lastMemoryChange].memory;
    const stack = trace[index].stack;
    const offset = 2 * parseInt(stack[stack.length - 2], 16);
    const size = 2 * parseInt(stack[stack.length - 3], 16);
    this.contractCreation[token] = '0x' + memory.join('').substr(offset, size);
  }

  pushContractCreation(token, code) {
    this.contractCreation[token] = code;
  }

  resetStoreChanges(index, address, key, value) {
    this.sstore = {};
    this.storageChanges = [];
  }

  pushStoreChanges(index, address, key, value) {
    this.sstore[index] = {
      address: address,
      key: key,
      value: value,
      hashedKey: key && sha3_256(key)
    };
    this.storageChanges.push(index);
  }

  accumulateStorageChanges(index, address, storage) {
    const ret = Object.assign({}, storage);

    for (var k in this.storageChanges) {
      const changesIndex = this.storageChanges[k];

      if (changesIndex > index) {
        return ret;
      }

      var sstore = this.sstore[changesIndex];

      if (sstore.address === address && sstore.key) {
        ret[sstore.hashedKey] = {
          key: sstore.key,
          value: sstore.value
        };
      }
    }

    return ret;
  }

}

exports.TraceCache = TraceCache;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/trace/traceHelper.js":
/*!*******************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/trace/traceHelper.js ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isContractCreation = exports.contractCreationToken = exports.isCallToPrecompiledContract = exports.newContextStorage = exports.isSHA3Instruction = exports.isSSTOREInstruction = exports.isRevertInstruction = exports.isStopInstruction = exports.isJumpDestInstruction = exports.isReturnInstruction = exports.isCreateInstruction = exports.isCallInstruction = exports.resolveCalledAddress = void 0;

const remix_lib_1 = __webpack_require__(/*! @remix-project/remix-lib */ "../../../dist/libs/remix-lib/src/index.js");

const {
  ui
} = remix_lib_1.helpers; // vmTraceIndex has to point to a CALL, CODECALL, ...

function resolveCalledAddress(vmTraceIndex, trace) {
  const step = trace[vmTraceIndex];

  if (isCreateInstruction(step)) {
    return contractCreationToken(vmTraceIndex);
  } else if (isCallInstruction(step)) {
    const stack = step.stack; // callcode, delegatecall, ...

    return ui.normalizeHexAddress(stack[stack.length - 2]);
  }

  return undefined;
}

exports.resolveCalledAddress = resolveCalledAddress;

function isCallInstruction(step) {
  return ['CALL', 'STATICCALL', 'CALLCODE', 'CREATE', 'DELEGATECALL', 'CREATE2'].includes(step.op);
}

exports.isCallInstruction = isCallInstruction;

function isCreateInstruction(step) {
  return step.op === 'CREATE' || step.op === 'CREATE2';
}

exports.isCreateInstruction = isCreateInstruction;

function isReturnInstruction(step) {
  return step.op === 'RETURN';
}

exports.isReturnInstruction = isReturnInstruction;

function isJumpDestInstruction(step) {
  return step.op === 'JUMPDEST';
}

exports.isJumpDestInstruction = isJumpDestInstruction;

function isStopInstruction(step) {
  return step.op === 'STOP';
}

exports.isStopInstruction = isStopInstruction;

function isRevertInstruction(step) {
  return step.op === 'REVERT';
}

exports.isRevertInstruction = isRevertInstruction;

function isSSTOREInstruction(step) {
  return step.op === 'SSTORE';
}

exports.isSSTOREInstruction = isSSTOREInstruction;

function isSHA3Instruction(step) {
  return step.op === 'SHA3';
}

exports.isSHA3Instruction = isSHA3Instruction;

function newContextStorage(step) {
  return step.op === 'CREATE' || step.op === 'CALL' || step.op === 'CREATE2';
}

exports.newContextStorage = newContextStorage;

function isCallToPrecompiledContract(index, trace) {
  // if stack empty => this is not a precompiled contract
  const step = trace[index];

  if (isCallInstruction(step)) {
    return index + 1 < trace.length && trace[index + 1].stack.length !== 0;
  }

  return false;
}

exports.isCallToPrecompiledContract = isCallToPrecompiledContract;

function contractCreationToken(index) {
  return '(Contract Creation - Step ' + index + ')';
}

exports.contractCreationToken = contractCreationToken;

function isContractCreation(address) {
  return address.indexOf('(Contract Creation - Step') !== -1;
}

exports.isContractCreation = isContractCreation;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/trace/traceManager.js":
/*!********************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/trace/traceManager.js ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TraceManager = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const remix_lib_1 = __webpack_require__(/*! @remix-project/remix-lib */ "../../../dist/libs/remix-lib/src/index.js");

const traceAnalyser_1 = __webpack_require__(/*! ./traceAnalyser */ "../../../dist/libs/remix-debug/src/trace/traceAnalyser.js");

const traceCache_1 = __webpack_require__(/*! ./traceCache */ "../../../dist/libs/remix-debug/src/trace/traceCache.js");

const traceStepManager_1 = __webpack_require__(/*! ./traceStepManager */ "../../../dist/libs/remix-debug/src/trace/traceStepManager.js");

const traceHelper_1 = __webpack_require__(/*! ./traceHelper */ "../../../dist/libs/remix-debug/src/trace/traceHelper.js");

class TraceManager {
  constructor(options) {
    this.web3 = options.web3;
    this.isLoading = false;
    this.trace = null;
    this.traceCache = new traceCache_1.TraceCache();
    this.traceAnalyser = new traceAnalyser_1.TraceAnalyser(this.traceCache);
    this.traceStepManager = new traceStepManager_1.TraceStepManager(this.traceAnalyser);
  } // init section


  resolveTrace(tx) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      this.tx = tx;
      this.init();
      if (!this.web3) throw new Error('web3 not loaded');
      this.isLoading = true;
      const result = yield this.getTrace(tx.hash);

      try {
        if (result['structLogs'].length > 0) {
          this.trace = result['structLogs'];

          try {
            const networkId = yield this.web3.eth.net.getId();
            this.fork = remix_lib_1.execution.forkAt(networkId, tx.blockNumber);
          } catch (e) {
            this.fork = 'london';
            console.log(`unable to detect fork, defaulting to ${this.fork}..`);
            console.error(e);
          }

          this.traceAnalyser.analyse(result['structLogs'], tx);
          this.isLoading = false;
          return true;
        }

        var mes = tx.hash + ' is not a contract invocation or contract creation.';
        console.log(mes);
        this.isLoading = false;
        throw new Error(mes);
      } catch (error) {
        console.log(error);
        this.isLoading = false;
        throw new Error(error);
      }
    });
  }

  getTrace(txHash) {
    return new Promise((resolve, reject) => {
      const options = {
        disableStorage: true,
        disableMemory: false,
        disableStack: false,
        fullStorage: false
      };
      this.web3.debug.traceTransaction(txHash, options, function (error, result) {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  init() {
    this.trace = null;
    this.traceCache.init();
  }

  getCurrentFork() {
    return this.fork;
  } // API section


  inRange(step) {
    return this.isLoaded() && step >= 0 && step < this.trace.length;
  }

  isLoaded() {
    return !this.isLoading && this.trace !== null;
  }

  getLength(callback) {
    if (!this.trace) {
      callback(new Error('no trace available'), null);
    } else {
      callback(null, this.trace.length);
    }
  }

  accumulateStorageChanges(index, address, storageOrigin) {
    return this.traceCache.accumulateStorageChanges(index, address, storageOrigin);
  }

  getAddresses() {
    return this.traceCache.addresses;
  }

  getCallDataAt(stepIndex) {
    try {
      this.checkRequestedStep(stepIndex);
    } catch (check) {
      throw new Error(check);
    }

    const callDataChange = remix_lib_1.util.findLowerBoundValue(stepIndex, this.traceCache.callDataChanges);

    if (callDataChange === null) {
      throw new Error('no calldata found');
    }

    return [this.traceCache.callsData[callDataChange]];
  }

  buildCallPath(stepIndex) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      try {
        this.checkRequestedStep(stepIndex);
      } catch (check) {
        throw new Error(check);
      }

      const callsPath = remix_lib_1.util.buildCallPath(stepIndex, this.traceCache.callsTree.call);
      if (callsPath === null) throw new Error('no call path built');
      return callsPath;
    });
  }

  getCallStackAt(stepIndex) {
    try {
      this.checkRequestedStep(stepIndex);
    } catch (check) {
      throw new Error(check);
    }

    const call = remix_lib_1.util.findCall(stepIndex, this.traceCache.callsTree.call);

    if (call === null) {
      throw new Error('no callstack found');
    }

    return call.callStack;
  }

  getStackAt(stepIndex) {
    this.checkRequestedStep(stepIndex);

    if (this.trace[stepIndex] && this.trace[stepIndex].stack) {
      // there's always a stack
      const stack = this.trace[stepIndex].stack.slice(0);
      stack.reverse();
      return stack.map(el => el.startsWith('0x') ? el : '0x' + el);
    } else {
      throw new Error('no stack found');
    }
  }

  getLastCallChangeSince(stepIndex) {
    try {
      this.checkRequestedStep(stepIndex);
    } catch (check) {
      throw new Error(check);
    }

    const callChange = remix_lib_1.util.findCall(stepIndex, this.traceCache.callsTree.call);

    if (callChange === null) {
      return 0;
    }

    return callChange;
  }

  getCurrentCalledAddressAt(stepIndex) {
    try {
      this.checkRequestedStep(stepIndex);
      const resp = this.getLastCallChangeSince(stepIndex);

      if (!resp) {
        throw new Error('unable to get current called address. ' + stepIndex + ' does not match with a CALL');
      }

      return resp.address;
    } catch (error) {
      throw new Error(error);
    }
  }

  getContractCreationCode(token) {
    if (!this.traceCache.contractCreation[token]) {
      throw new Error('no contract creation named ' + token);
    }

    return this.traceCache.contractCreation[token];
  }

  getMemoryAt(stepIndex) {
    this.checkRequestedStep(stepIndex);
    const lastChanges = remix_lib_1.util.findLowerBoundValue(stepIndex, this.traceCache.memoryChanges);

    if (lastChanges === null) {
      throw new Error('no memory found');
    }

    return this.trace[lastChanges].memory;
  }

  getCurrentPC(stepIndex) {
    try {
      this.checkRequestedStep(stepIndex);
    } catch (check) {
      throw new Error(check);
    }

    return this.trace[stepIndex].pc;
  }

  getAllStopIndexes() {
    return this.traceCache.stopIndexes;
  }

  getAllOutofGasIndexes() {
    return this.traceCache.outofgasIndexes;
  }

  getReturnValue(stepIndex) {
    try {
      this.checkRequestedStep(stepIndex);
    } catch (check) {
      throw new Error(check);
    }

    if (!this.traceCache.returnValues[stepIndex]) {
      throw new Error('current step is not a return step');
    }

    return this.traceCache.returnValues[stepIndex];
  }

  getCurrentStep(stepIndex) {
    try {
      this.checkRequestedStep(stepIndex);
    } catch (check) {
      throw new Error(check);
    }

    return this.traceCache.steps[stepIndex];
  }

  getMemExpand(stepIndex) {
    return this.getStepProperty(stepIndex, 'memexpand') || '';
  }

  getStepCost(stepIndex) {
    return this.getStepProperty(stepIndex, 'gasCost');
  }

  getRemainingGas(stepIndex) {
    return this.getStepProperty(stepIndex, 'gas');
  }

  getStepProperty(stepIndex, property) {
    try {
      this.checkRequestedStep(stepIndex);
    } catch (check) {
      throw new Error(check);
    }

    return this.trace[stepIndex][property];
  }

  isCreationStep(stepIndex) {
    return (0, traceHelper_1.isCreateInstruction)(this.trace[stepIndex]);
  } // step section


  findStepOverBack(currentStep) {
    return this.traceStepManager.findStepOverBack(currentStep);
  }

  findStepOverForward(currentStep) {
    return this.traceStepManager.findStepOverForward(currentStep);
  }

  findNextCall(currentStep) {
    return this.traceStepManager.findNextCall(currentStep);
  }

  findStepOut(currentStep) {
    return this.traceStepManager.findStepOut(currentStep);
  }

  checkRequestedStep(stepIndex) {
    if (!this.trace) {
      throw new Error('trace not loaded');
    } else if (stepIndex >= this.trace.length) {
      throw new Error('trace smaller than requested');
    }
  }

  waterfall(calls, stepindex, cb) {
    const ret = [];
    let retError = null;

    for (var call in calls) {
      calls[call].apply(this, [stepindex, function (error, result) {
        retError = error;
        ret.push({
          error: error,
          value: result
        });
      }]);
    }

    cb(retError, ret);
  }

}

exports.TraceManager = TraceManager;

/***/ }),

/***/ "../../../dist/libs/remix-debug/src/trace/traceStepManager.js":
/*!************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-debug/src/trace/traceStepManager.js ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TraceStepManager = void 0;

const traceHelper_1 = __webpack_require__(/*! ./traceHelper */ "../../../dist/libs/remix-debug/src/trace/traceHelper.js");

const remix_lib_1 = __webpack_require__(/*! @remix-project/remix-lib */ "../../../dist/libs/remix-lib/src/index.js");

class TraceStepManager {
  constructor(_traceAnalyser) {
    this.traceAnalyser = _traceAnalyser;
  }

  isCallInstruction(index) {
    const state = this.traceAnalyser.trace[index];
    return (0, traceHelper_1.isCallInstruction)(state) && !(0, traceHelper_1.isCallToPrecompiledContract)(index, this.traceAnalyser.trace);
  }

  isReturnInstruction(index) {
    const state = this.traceAnalyser.trace[index];
    return (0, traceHelper_1.isReturnInstruction)(state);
  }

  findStepOverBack(currentStep) {
    if (this.isReturnInstruction(currentStep)) {
      const call = remix_lib_1.util.findCall(currentStep, this.traceAnalyser.traceCache.callsTree.call);
      return call.start > 0 ? call.start - 1 : 0;
    }

    return currentStep > 0 ? currentStep - 1 : 0;
  }

  findStepOverForward(currentStep) {
    if (this.isCallInstruction(currentStep)) {
      const call = remix_lib_1.util.findCall(currentStep + 1, this.traceAnalyser.traceCache.callsTree.call);
      return call.return + 1 < this.traceAnalyser.trace.length ? call.return + 1 : this.traceAnalyser.trace.length - 1;
    }

    return this.traceAnalyser.trace.length >= currentStep + 1 ? currentStep + 1 : currentStep;
  }

  findNextCall(currentStep) {
    const call = remix_lib_1.util.findCall(currentStep, this.traceAnalyser.traceCache.callsTree.call);
    const subCalls = Object.keys(call.calls);

    if (subCalls.length) {
      var callStart = remix_lib_1.util.findLowerBound(currentStep, subCalls) + 1;

      if (subCalls.length > callStart) {
        return parseInt(subCalls[callStart]) - 1;
      }

      return currentStep;
    }

    return currentStep;
  }

  findStepOut(currentStep) {
    const call = remix_lib_1.util.findCall(currentStep, this.traceAnalyser.traceCache.callsTree.call);
    return call.return;
  }

}

exports.TraceStepManager = TraceStepManager;

/***/ }),

/***/ "../../../dist/libs/remix-lib/src/eventManager.js":
/*!************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-lib/src/eventManager.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventManager = void 0;

class EventManager {
  constructor() {
    this.registered = {};
    this.anonymous = {};
  }
  /*
    * Unregister a listener.
    * Note that if obj is a function. the unregistration will be applied to the dummy obj {}.
    *
    * @param {String} eventName  - the event name
    * @param {Object or Func} obj - object that will listen on this event
    * @param {Func} func         - function of the listeners that will be executed
  */


  unregister(eventName, obj, func) {
    if (!this.registered[eventName]) {
      return;
    }

    if (obj instanceof Function) {
      func = obj;
      obj = this.anonymous;
    }

    for (const reg in this.registered[eventName]) {
      if (this.registered[eventName][reg].obj === obj && this.registered[eventName][reg].func.toString() === func.toString()) {
        this.registered[eventName].splice(reg, 1);
      }
    }
  }
  /*
    * Register a new listener.
    * Note that if obj is a function, the function registration will be associated with the dummy object {}
    *
    * @param {String} eventName  - the event name
    * @param {Object or Func} obj - object that will listen on this event
    * @param {Func} func         - function of the listeners that will be executed
  */


  register(eventName, obj, func) {
    if (!this.registered[eventName]) {
      this.registered[eventName] = [];
    }

    if (obj instanceof Function) {
      func = obj;
      obj = this.anonymous;
    }

    this.registered[eventName].push({
      obj,
      func
    });
  }
  /*
    * trigger event.
    * Every listener have their associated function executed
    *
    * @param {String} eventName  - the event name
    * @param {Array}j - argument that will be passed to the executed function.
  */


  trigger(eventName, args) {
    if (!this.registered[eventName]) {
      return;
    }

    for (const listener in this.registered[eventName]) {
      const l = this.registered[eventName][listener];
      if (l.func) l.func.apply(l.obj === this.anonymous ? {} : l.obj, args);
    }
  }

}

exports.EventManager = EventManager;

/***/ }),

/***/ "../../../dist/libs/remix-lib/src/execution/eventsDecoder.js":
/*!***********************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-lib/src/execution/eventsDecoder.js ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventsDecoder = void 0;

const ethers_1 = __webpack_require__(/*! ethers */ "../../../node_modules/ethers/lib.esm/index.js");

const txHelper_1 = __webpack_require__(/*! ./txHelper */ "../../../dist/libs/remix-lib/src/execution/txHelper.js");
/**
  * Register to txListener and extract events
  *
  */


class EventsDecoder {
  constructor({
    resolveReceipt
  }) {
    this.resolveReceipt = resolveReceipt;
  }
  /**
  * use Transaction Receipt to decode logs. assume that the transaction as already been resolved by txListener.
  * logs are decoded only if the contract if known by remix.
  *
  * @param {Object} tx - transaction object
  * @param {Function} cb - callback
  */


  parseLogs(tx, contractName, compiledContracts, cb) {
    if (tx.isCall) return cb(null, {
      decoded: [],
      raw: []
    });
    this.resolveReceipt(tx, (error, receipt) => {
      if (error) return cb(error);

      this._decodeLogs(tx, receipt, contractName, compiledContracts, cb);
    });
  }

  _decodeLogs(tx, receipt, contract, contracts, cb) {
    if (!contract || !receipt) {
      return cb('cannot decode logs - contract or receipt not resolved ');
    }

    if (!receipt.logs) {
      return cb(null, {
        decoded: [],
        raw: []
      });
    }

    this._decodeEvents(tx, receipt.logs, contract, contracts, cb);
  }

  _eventABI(contract) {
    const eventABI = {};
    const abi = new ethers_1.ethers.utils.Interface(contract.abi);

    for (const e in abi.events) {
      const event = abi.getEvent(e);
      eventABI[abi.getEventTopic(e).replace('0x', '')] = {
        event: event.name,
        inputs: event.inputs,
        object: event,
        abi: abi
      };
    }

    return eventABI;
  }

  _eventsABI(compiledContracts) {
    const eventsABI = {};
    (0, txHelper_1.visitContracts)(compiledContracts, contract => {
      eventsABI[contract.name] = this._eventABI(contract.object);
    });
    return eventsABI;
  }

  _event(hash, eventsABI) {
    for (const k in eventsABI) {
      if (eventsABI[k][hash]) {
        const event = eventsABI[k][hash];

        for (const input of event.inputs) {
          if (input.type === 'function') {
            input.type = 'bytes24';
            input.baseType = 'bytes24';
          }
        }

        return event;
      }
    }

    return null;
  }

  _stringifyBigNumber(value) {
    return value._isBigNumber ? value.toString() : value;
  }

  _stringifyEvent(value) {
    if (value === null || value === undefined) return ' - ';
    if (value._ethersType) value.type = value._ethersType;

    if (Array.isArray(value)) {
      // for struct && array
      return value.map(item => {
        return this._stringifyEvent(item);
      });
    } else {
      return this._stringifyBigNumber(value);
    }
  }

  _decodeEvents(tx, logs, contractName, compiledContracts, cb) {
    const eventsABI = this._eventsABI(compiledContracts);

    const events = [];

    for (const i in logs) {
      // [address, topics, mem]
      const log = logs[i];
      const topicId = log.topics[0];

      const eventAbi = this._event(topicId.replace('0x', ''), eventsABI);

      if (eventAbi) {
        const decodedlog = eventAbi.abi.parseLog(log);
        const decoded = {};

        for (const v in decodedlog.args) {
          decoded[v] = this._stringifyEvent(decodedlog.args[v]);
        }

        events.push({
          from: log.address,
          topic: topicId,
          event: eventAbi.event,
          args: decoded
        });
      } else {
        events.push({
          from: log.address,
          data: log.data,
          topics: log.topics
        });
      }
    }

    cb(null, {
      decoded: events,
      raw: logs
    });
  }

}

exports.EventsDecoder = EventsDecoder;

/***/ }),

/***/ "../../../dist/libs/remix-lib/src/execution/forkAt.js":
/*!****************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-lib/src/execution/forkAt.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forkAt = void 0;
/**
  * returns the fork name for the @argument networkId and @argument blockNumber
  *
  * @param {Object} networkId - network Id (1 for VM, 3 for Ropsten, 4 for Rinkeby, 5 for Goerli)
  * @param {Object} blockNumber - block number
  * @return {String} - fork name (Berlin, Istanbul, ...)
  */

function forkAt(networkId, blockNumber) {
  if (forks[networkId]) {
    let currentForkName = forks[networkId][0].name;

    for (const fork of forks[networkId]) {
      if (blockNumber >= fork.number) {
        currentForkName = fork.name;
      }
    }

    return currentForkName;
  }

  return 'london';
}

exports.forkAt = forkAt; // see https://github.com/ethereum/go-ethereum/blob/master/params/config.go

const forks = {
  1: [{
    number: 4370000,
    name: 'byzantium'
  }, {
    number: 7280000,
    name: 'constantinople'
  }, {
    number: 7280000,
    name: 'petersburg'
  }, {
    number: 9069000,
    name: 'istanbul'
  }, {
    number: 9200000,
    name: 'muirglacier'
  }, {
    number: 12244000,
    name: 'berlin'
  }, {
    number: 12965000,
    name: 'london'
  }],
  3: [{
    number: 1700000,
    name: 'byzantium'
  }, {
    number: 4230000,
    name: 'constantinople'
  }, {
    number: 4939394,
    name: 'petersburg'
  }, {
    number: 6485846,
    name: 'istanbul'
  }, {
    number: 7117117,
    name: 'muirglacier'
  }, {
    number: 9812189,
    name: 'berlin'
  }, {
    number: 10499401,
    name: 'london'
  }],
  4: [{
    number: 1035301,
    name: 'byzantium'
  }, {
    number: 3660663,
    name: 'constantinople'
  }, {
    number: 4321234,
    name: 'petersburg'
  }, {
    number: 5435345,
    name: 'istanbul'
  }, {
    number: 8290928,
    name: 'berlin'
  }, {
    number: 8897988,
    name: 'london'
  }],
  5: [{
    number: 1561651,
    name: 'istanbul'
  }, {
    number: 4460644,
    name: 'berlin'
  }, {
    number: 5062605,
    name: 'london'
  }]
};

/***/ }),

/***/ "../../../dist/libs/remix-lib/src/execution/logsManager.js":
/*!*********************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-lib/src/execution/logsManager.js ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogsManager = void 0;

const async_1 = __webpack_require__(/*! async */ "../../../node_modules/async/dist/async.js");

const crypto_1 = __webpack_require__(/*! crypto */ "../../../node_modules/crypto-browserify/index.js");

class LogsManager {
  constructor() {
    this.notificationCallbacks = [];
    this.subscriptions = {};
    this.filters = {};
    this.filterTracking = {};
    this.oldLogs = [];
  }

  checkBlock(blockNumber, block, web3) {
    (0, async_1.eachOf)(block.transactions, (tx, i, next) => {
      const txHash = '0x' + tx.hash().toString('hex');
      web3.eth.getTransactionReceipt(txHash, (_error, receipt) => {
        for (const log of receipt.logs) {
          this.oldLogs.push({
            type: 'block',
            blockNumber,
            block,
            tx,
            log,
            txNumber: i
          });
          const subscriptions = this.getSubscriptionsFor({
            type: 'block',
            blockNumber,
            block,
            tx,
            log
          });

          for (const subscriptionId of subscriptions) {
            const result = {
              logIndex: '0x1',
              blockNumber: blockNumber,
              blockHash: '0x' + block.hash().toString('hex'),
              transactionHash: '0x' + tx.hash().toString('hex'),
              transactionIndex: '0x' + i.toString(16),
              // TODO: if it's a contract deploy, it should be that address instead
              address: log.address,
              data: log.data,
              topics: log.topics
            };

            if (result.address === '0x') {
              delete result.address;
            }

            const response = {
              jsonrpc: '2.0',
              method: 'eth_subscription',
              params: {
                result: result,
                subscription: subscriptionId
              }
            };
            this.transmit(response);
          }
        }
      });
    }, _err => {});
  }

  eventMatchesFilter(changeEvent, queryType, queryFilter) {
    if (queryFilter.topics.filter(logTopic => changeEvent.log.topics.indexOf(logTopic) >= 0).length === 0) return false;

    if (queryType === 'logs') {
      const fromBlock = queryFilter.fromBlock || '0x0';
      const toBlock = queryFilter.toBlock || this.oldLogs.length ? this.oldLogs[this.oldLogs.length - 1].blockNumber : '0x0';

      if (queryFilter.address === (changeEvent.tx.to || '').toString() || queryFilter.address === changeEvent.tx.getSenderAddress().toString()) {
        if (parseInt(toBlock) >= parseInt(changeEvent.blockNumber) && parseInt(fromBlock) <= parseInt(changeEvent.blockNumber)) {
          return true;
        }
      }
    }

    return false;
  }

  getSubscriptionsFor(changeEvent) {
    const matchedSubscriptions = [];

    for (const subscriptionId of Object.keys(this.subscriptions)) {
      const subscriptionParams = this.subscriptions[subscriptionId];
      const [queryType, queryFilter] = subscriptionParams;

      if (this.eventMatchesFilter(changeEvent, queryType, queryFilter || {
        topics: []
      })) {
        matchedSubscriptions.push(subscriptionId);
      }
    }

    return matchedSubscriptions;
  }

  getLogsForSubscription(subscriptionId) {
    const subscriptionParams = this.subscriptions[subscriptionId];
    const [_queryType, queryFilter] = subscriptionParams; // eslint-disable-line

    return this.getLogsFor(queryFilter);
  }

  transmit(result) {
    this.notificationCallbacks.forEach(callback => {
      if (result.params.result.raw) {
        result.params.result.data = result.params.result.raw.data;
        result.params.result.topics = result.params.result.raw.topics;
      }

      callback(result);
    });
  }

  addListener(_type, cb) {
    this.notificationCallbacks.push(cb);
  }

  subscribe(params) {
    const subscriptionId = '0x' + (0, crypto_1.randomBytes)(16).toString('hex');
    this.subscriptions[subscriptionId] = params;
    return subscriptionId;
  }

  unsubscribe(subscriptionId) {
    delete this.subscriptions[subscriptionId];
  }

  newFilter(filterType, params) {
    const filterId = '0x' + (0, crypto_1.randomBytes)(16).toString('hex');

    if (filterType === 'block' || filterType === 'pendingTransactions') {
      this.filters[filterId] = {
        filterType
      };
    }

    if (filterType === 'filter') {
      this.filters[filterId] = {
        filterType,
        params
      };
    }

    this.filterTracking[filterId] = {};
    return filterId;
  }

  uninstallFilter(filterId) {
    delete this.filters[filterId];
  }

  getLogsForFilter(filterId, logsOnly) {
    const {
      filterType,
      params
    } = this.filters[filterId];
    const tracking = this.filterTracking[filterId];

    if (logsOnly || filterType === 'filter') {
      return this.getLogsFor(params || {
        topics: []
      });
    }

    if (filterType === 'block') {
      const blocks = this.oldLogs.filter(x => x.type === 'block').filter(x => tracking.block === undefined || x.blockNumber >= tracking.block);
      tracking.block = blocks[blocks.length - 1];
      return blocks.map(block => '0x' + block.hash().toString('hex'));
    }

    if (filterType === 'pendingTransactions') {
      return [];
    }
  }

  getLogsByTxHash(hash) {
    return this.oldLogs.filter(log => '0x' + log.tx.hash().toString('hex') === hash).map(log => {
      return {
        logIndex: '0x1',
        blockNumber: log.blockNumber,
        blockHash: '0x' + log.block.hash().toString('hex'),
        transactionHash: '0x' + log.tx.hash().toString('hex'),
        transactionIndex: '0x' + log.txNumber.toString(16),
        // TODO: if it's a contract deploy, it should be that address instead
        address: log.log.address,
        data: log.log.data,
        topics: log.log.topics
      };
    });
  }

  getLogsFor(params) {
    const results = [];

    for (const log of this.oldLogs) {
      if (this.eventMatchesFilter(log, 'logs', params)) {
        results.push({
          logIndex: '0x1',
          blockNumber: log.blockNumber,
          blockHash: '0x' + log.block.hash().toString('hex'),
          transactionHash: '0x' + log.tx.hash().toString('hex'),
          transactionIndex: '0x' + log.txNumber.toString(16),
          // TODO: if it's a contract deploy, it should be that address instead
          address: log.log.address,
          data: log.log.data,
          topics: log.log.topics
        });
      }
    }

    return results;
  }

}

exports.LogsManager = LogsManager;

/***/ }),

/***/ "../../../dist/libs/remix-lib/src/execution/txExecution.js":
/*!*********************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-lib/src/execution/txExecution.js ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkVMError = exports.callFunction = exports.createContract = void 0;

const ethers_1 = __webpack_require__(/*! ethers */ "../../../node_modules/ethers/lib.esm/index.js");

const txHelper_1 = __webpack_require__(/*! ./txHelper */ "../../../dist/libs/remix-lib/src/execution/txHelper.js");
/**
  * deploy the given contract
  *
  * @param {String} from    - sender address
  * @param {String} data    - data to send with the transaction ( return of txFormat.buildData(...) ).
  * @param {String} value    - decimal representation of value.
  * @param {String} gasLimit    - decimal representation of gas limit.
  * @param {Object} txRunner    - TxRunner.js instance
  * @param {Object} callbacks    - { confirmationCb, gasEstimationForceSend, promptCb }
  *     [validate transaction] confirmationCb (network, tx, gasEstimation, continueTxExecution, cancelCb)
  *     [transaction failed, force send] gasEstimationForceSend (error, continueTxExecution, cancelCb)
  *     [personal mode enabled, need password to continue] promptCb (okCb, cancelCb)
  * @param {Function} finalCallback    - last callback.
  */


function createContract(from, data, value, gasLimit, txRunner, callbacks, finalCallback) {
  if (!callbacks.confirmationCb || !callbacks.gasEstimationForceSend || !callbacks.promptCb) {
    return finalCallback('all the callbacks must have been defined');
  }

  const tx = {
    from: from,
    to: null,
    data: data,
    useCall: false,
    value: value,
    gasLimit: gasLimit
  };
  txRunner.rawRun(tx, callbacks.confirmationCb, callbacks.gasEstimationForceSend, callbacks.promptCb, (error, txResult) => {
    // see universaldapp.js line 660 => 700 to check possible values of txResult (error case)
    finalCallback(error, txResult);
  });
}

exports.createContract = createContract;
/**
  * call the current given contract ! that will create a transaction !
  *
  * @param {String} from    - sender address
  * @param {String} to    - recipient address
  * @param {String} data    - data to send with the transaction ( return of txFormat.buildData(...) ).
  * @param {String} value    - decimal representation of value.
  * @param {String} gasLimit    - decimal representation of gas limit.
  * @param {Object} txRunner    - TxRunner.js instance
  * @param {Object} callbacks    - { confirmationCb, gasEstimationForceSend, promptCb }
  *     [validate transaction] confirmationCb (network, tx, gasEstimation, continueTxExecution, cancelCb)
  *     [transaction failed, force send] gasEstimationForceSend (error, continueTxExecution, cancelCb)
  *     [personal mode enabled, need password to continue] promptCb (okCb, cancelCb)
  * @param {Function} finalCallback    - last callback.
  */

function callFunction(from, to, data, value, gasLimit, funAbi, txRunner, callbacks, finalCallback) {
  const useCall = funAbi.stateMutability === 'view' || funAbi.stateMutability === 'pure' || funAbi.constant;
  const tx = {
    from,
    to,
    data,
    useCall,
    value,
    gasLimit
  };
  txRunner.rawRun(tx, callbacks.confirmationCb, callbacks.gasEstimationForceSend, callbacks.promptCb, (error, txResult) => {
    // see universaldapp.js line 660 => 700 to check possible values of txResult (error case)
    finalCallback(error, txResult);
  });
}

exports.callFunction = callFunction;
/**
  * check if the vm has errored
  *
  * @param {Object} execResult    - execution result given by the VM
  * @return {Object} -  { error: true/false, message: DOMNode }
  */

function checkVMError(execResult, compiledContracts) {
  const errorCode = {
    OUT_OF_GAS: 'out of gas',
    STACK_UNDERFLOW: 'stack underflow',
    STACK_OVERFLOW: 'stack overflow',
    INVALID_JUMP: 'invalid JUMP',
    INVALID_OPCODE: 'invalid opcode',
    REVERT: 'revert',
    STATIC_STATE_CHANGE: 'static state change',
    INTERNAL_ERROR: 'internal error',
    CREATE_COLLISION: 'create collision',
    STOP: 'stop',
    REFUND_EXHAUSTED: 'refund exhausted'
  };
  const ret = {
    error: false,
    message: ''
  };

  if (!execResult.exceptionError) {
    return ret;
  }

  const exceptionError = execResult.exceptionError.error || '';
  const error = `VM error: ${exceptionError}.\n`;
  let msg;

  if (exceptionError === errorCode.INVALID_OPCODE) {
    msg = '\t\n\tThe execution might have thrown.\n';
    ret.error = true;
  } else if (exceptionError === errorCode.OUT_OF_GAS) {
    msg = '\tThe transaction ran out of gas. Please increase the Gas Limit.\n';
    ret.error = true;
  } else if (exceptionError === errorCode.REVERT) {
    const returnData = execResult.returnValue;
    const returnDataHex = returnData.slice(0, 4).toString('hex');
    let customError;

    if (compiledContracts) {
      let decodedCustomErrorInputsClean;

      for (const file of Object.keys(compiledContracts)) {
        for (const contractName of Object.keys(compiledContracts[file])) {
          const contract = compiledContracts[file][contractName];

          for (const item of contract.abi) {
            if (item.type === 'error') {
              // ethers doesn't crash anymore if "error" type is specified, but it doesn't extract the errors. see:
              // https://github.com/ethers-io/ethers.js/commit/bd05aed070ac9e1421a3e2bff2ceea150bedf9b7
              // we need here to fake the type, so the "getSighash" function works properly
              const fn = (0, txHelper_1.getFunctionFragment)(Object.assign(Object.assign({}, item), {
                type: 'function',
                stateMutability: 'nonpayable'
              }));
              if (!fn) continue;
              const sign = fn.getSighash(item.name);
              if (!sign) continue;

              if (returnDataHex === sign.replace('0x', '')) {
                customError = item.name;
                const functionDesc = fn.getFunction(item.name); // decoding error parameters

                const decodedCustomErrorInputs = fn.decodeFunctionData(functionDesc, returnData);
                decodedCustomErrorInputsClean = {};
                let devdoc = {}; // "contract" reprensents the compilation result containing the NATSPEC documentation

                if (contract && fn.functions && Object.keys(fn.functions).length) {
                  const functionSignature = Object.keys(fn.functions)[0]; // we check in the 'devdoc' if there's a developer documentation for this error

                  try {
                    devdoc = contract.devdoc.errors && contract.devdoc.errors[functionSignature][0] || {};
                  } catch (e) {
                    console.error(e.message);
                  } // we check in the 'userdoc' if there's an user documentation for this error


                  try {
                    const userdoc = contract.userdoc.errors && contract.userdoc.errors[functionSignature][0] || {};
                    if (userdoc && userdoc.notice) customError += ' : ' + userdoc.notice; // we append the user doc if any
                  } catch (e) {
                    console.error(e.message);
                  }
                }

                let inputIndex = 0;

                for (const input of functionDesc.inputs) {
                  const inputKey = input.name || inputIndex;
                  const v = decodedCustomErrorInputs[inputKey];
                  decodedCustomErrorInputsClean[inputKey] = {
                    value: v.toString ? v.toString() : v
                  };

                  if (devdoc && devdoc.params) {
                    decodedCustomErrorInputsClean[input.name].documentation = devdoc.params[inputKey]; // we add the developer documentation for this input parameter if any
                  }

                  inputIndex++;
                }

                break;
              }
            }
          }
        }
      }

      if (decodedCustomErrorInputsClean) {
        msg = '\tThe transaction has been reverted to the initial state.\nError provided by the contract:';
        msg += `\n${customError}`;
        msg += '\nParameters:';
        msg += `\n${JSON.stringify(decodedCustomErrorInputsClean, null, ' ')}`;
      }
    }

    if (!customError) {
      // It is the hash of Error(string)
      if (returnData && returnDataHex === '08c379a0') {
        const abiCoder = new ethers_1.ethers.utils.AbiCoder();
        const reason = abiCoder.decode(['string'], returnData.slice(4))[0];
        msg = `\tThe transaction has been reverted to the initial state.\nReason provided by the contract: "${reason}".`;
      } else {
        msg = '\tThe transaction has been reverted to the initial state.\nNote: The called function should be payable if you send value and the value you send should be less than your current balance.';
      }
    }

    ret.error = true;
  } else if (exceptionError === errorCode.STATIC_STATE_CHANGE) {
    msg = '\tState changes is not allowed in Static Call context\n';
    ret.error = true;
  }

  ret.message = `${error}\n${exceptionError}\n${msg}\nDebug the transaction to get more information.`;
  return ret;
}

exports.checkVMError = checkVMError;

/***/ }),

/***/ "../../../dist/libs/remix-lib/src/execution/txFormat.js":
/*!******************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-lib/src/execution/txFormat.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isArrayOrStringStart = exports.parseFunctionParams = exports.decodeResponse = exports.linkLibrary = exports.setLibraryAddress = exports.linkLibraryStandard = exports.linkLibraryStandardFromlinkReferences = exports.deployLibrary = exports.linkBytecode = exports.linkBytecodeLegacy = exports.linkBytecodeStandard = exports.atAddress = exports.buildData = exports.encodeConstructorCallAndDeployLibraries = exports.encodeConstructorCallAndLinkLibraries = exports.encodeFunctionCall = exports.encodeParams = exports.encodeData = void 0;

const ethers_1 = __webpack_require__(/*! ethers */ "../../../node_modules/ethers/lib.esm/index.js");

const txHelper_1 = __webpack_require__(/*! ./txHelper */ "../../../dist/libs/remix-lib/src/execution/txHelper.js");

const async_1 = __webpack_require__(/*! async */ "../../../node_modules/async/dist/async.js");

const linker_1 = __webpack_require__(/*! solc/linker */ "../../../node_modules/solc/linker.js");

const ethereumjs_util_1 = __webpack_require__(/*! ethereumjs-util */ "../../../node_modules/ethereumjs-util/dist.browser/index.js");
/**
  * build the transaction data
  *
  * @param {Object} function abi
  * @param {Object} values to encode
  * @param {String} contractbyteCode
  */


function encodeData(funABI, values, contractbyteCode) {
  let encoded;
  let encodedHex;

  try {
    encoded = (0, txHelper_1.encodeParams)(funABI, values);
    encodedHex = encoded.toString('hex');
  } catch (e) {
    return {
      error: 'cannot encode arguments'
    };
  }

  if (contractbyteCode) {
    return {
      data: '0x' + contractbyteCode + encodedHex.replace('0x', '')
    };
  } else {
    return {
      data: (0, txHelper_1.encodeFunctionId)(funABI) + encodedHex.replace('0x', '')
    };
  }
}

exports.encodeData = encodeData;
/**
* encode function / constructor parameters
*
* @param {Object} params    - input paramater of the function to call
* @param {Object} funAbi    - abi definition of the function to call. null if building data for the ctor.
* @param {Function} callback    - callback
*/

function encodeParams(params, funAbi, callback) {
  let data = '';
  let dataHex = '';
  let funArgs;

  if (params.indexOf('raw:0x') === 0) {
    // in that case we consider that the input is already encoded and *does not* contain the method signature
    dataHex = params.replace('raw:0x', '');
    data = Buffer.from(dataHex, 'hex');
  } else {
    try {
      params = params.replace(/(^|,\s+|,)(\d+)(\s+,|,|$)/g, '$1"$2"$3'); // replace non quoted number by quoted number

      params = params.replace(/(^|,\s+|,)(0[xX][0-9a-fA-F]+)(\s+,|,|$)/g, '$1"$2"$3'); // replace non quoted hex string by quoted hex string

      funArgs = JSON.parse('[' + params + ']');
    } catch (e) {
      return callback('Error encoding arguments: ' + e);
    }

    if (funArgs.length > 0) {
      try {
        data = (0, txHelper_1.encodeParams)(funAbi, funArgs);
        dataHex = data.toString();
      } catch (e) {
        return callback('Error encoding arguments: ' + e);
      }
    }

    if (data.slice(0, 9) === 'undefined') {
      dataHex = data.slice(9);
    }

    if (data.slice(0, 2) === '0x') {
      dataHex = data.slice(2);
    }
  }

  callback(null, {
    data: data,
    dataHex: dataHex,
    funArgs: funArgs
  });
}

exports.encodeParams = encodeParams;
/**
* encode function call (function id + encoded parameters)
*
* @param {Object} params    - input paramater of the function to call
* @param {Object} funAbi    - abi definition of the function to call. null if building data for the ctor.
* @param {Function} callback    - callback
*/

function encodeFunctionCall(params, funAbi, callback) {
  encodeParams(params, funAbi, (error, encodedParam) => {
    if (error) return callback(error);
    callback(null, {
      dataHex: (0, txHelper_1.encodeFunctionId)(funAbi) + encodedParam.dataHex,
      funAbi,
      funArgs: encodedParam.funArgs
    });
  });
}

exports.encodeFunctionCall = encodeFunctionCall;
/**
* encode constructor creation and link with provided libraries if needed
*
* @param {Object} contract    - input paramater of the function to call
* @param {Object} params    - input paramater of the function to call
* @param {Object} funAbi    - abi definition of the function to call. null if building data for the ctor.
* @param {Object} linkLibraries    - contains {linkReferences} object which list all the addresses to be linked
* @param {Object} linkReferences    - given by the compiler, contains the proper linkReferences
* @param {Function} callback    - callback
*/

function encodeConstructorCallAndLinkLibraries(contract, params, funAbi, linkLibraries, linkReferences, callback) {
  encodeParams(params, funAbi, (error, encodedParam) => {
    if (error) return callback(error);
    let bytecodeToDeploy = contract.evm.bytecode.object;

    if (bytecodeToDeploy.indexOf('_') >= 0) {
      if (linkLibraries && linkReferences) {
        for (const libFile in linkLibraries) {
          for (const lib in linkLibraries[libFile]) {
            const address = linkLibraries[libFile][lib];
            if (!(0, ethereumjs_util_1.isValidAddress)(address)) return callback(address + ' is not a valid address. Please check the provided address is valid.');
            bytecodeToDeploy = linkLibraryStandardFromlinkReferences(lib, address.replace('0x', ''), bytecodeToDeploy, linkReferences);
          }
        }
      }
    }

    if (bytecodeToDeploy.indexOf('_') >= 0) {
      return callback('Failed to link some libraries');
    }

    return callback(null, {
      dataHex: bytecodeToDeploy + encodedParam.dataHex,
      funAbi,
      funArgs: encodedParam.funArgs,
      contractBytecode: contract.evm.bytecode.object
    });
  });
}

exports.encodeConstructorCallAndLinkLibraries = encodeConstructorCallAndLinkLibraries;
/**
* encode constructor creation and deploy librairies if needed
*
* @param {String} contractName    - current contract name
* @param {Object} contract    - input paramater of the function to call
* @param {Object} contracts    - map of all compiled contracts.
* @param {Object} params    - input paramater of the function to call
* @param {Object} funAbi    - abi definition of the function to call. null if building data for the ctor.
* @param {Function} callback    - callback
* @param {Function} callbackStep  - callbackStep
* @param {Function} callbackDeployLibrary  - callbackDeployLibrary
* @param {Function} callback    - callback
*/

function encodeConstructorCallAndDeployLibraries(contractName, contract, contracts, params, funAbi, callback, callbackStep, callbackDeployLibrary) {
  encodeParams(params, funAbi, (error, encodedParam) => {
    if (error) return callback(error);
    let dataHex = '';
    const contractBytecode = contract.evm.bytecode.object;
    let bytecodeToDeploy = contract.evm.bytecode.object;

    if (bytecodeToDeploy.indexOf('_') >= 0) {
      linkBytecode(contract, contracts, (err, bytecode) => {
        if (err) {
          callback('Error deploying required libraries: ' + err);
        } else {
          bytecodeToDeploy = bytecode + dataHex;
          return callback(null, {
            dataHex: bytecodeToDeploy,
            funAbi,
            funArgs: encodedParam.funArgs,
            contractBytecode,
            contractName: contractName
          });
        }
      }, callbackStep, callbackDeployLibrary);
      return;
    } else {
      dataHex = bytecodeToDeploy + encodedParam.dataHex;
    }

    callback(null, {
      dataHex: bytecodeToDeploy,
      funAbi,
      funArgs: encodedParam.funArgs,
      contractBytecode,
      contractName: contractName
    });
  });
}

exports.encodeConstructorCallAndDeployLibraries = encodeConstructorCallAndDeployLibraries;
/**
* (DEPRECATED) build the transaction data
*
* @param {String} contractName
* @param {Object} contract    - abi definition of the current contract.
* @param {Object} contracts    - map of all compiled contracts.
* @param {Bool} isConstructor    - isConstructor.
* @param {Object} funAbi    - abi definition of the function to call. null if building data for the ctor.
* @param {Object} params    - input paramater of the function to call
* @param {Function} callback    - callback
* @param {Function} callbackStep  - callbackStep
* @param {Function} callbackDeployLibrary  - callbackDeployLibrary
*/

function buildData(contractName, contract, contracts, isConstructor, funAbi, params, callback, callbackStep, callbackDeployLibrary) {
  let funArgs = [];
  let data = '';
  let dataHex = '';

  if (params.indexOf('raw:0x') === 0) {
    // in that case we consider that the input is already encoded and *does not* contain the method signature
    dataHex = params.replace('raw:0x', '');
    data = Buffer.from(dataHex, 'hex');
  } else {
    try {
      if (params.length > 0) {
        funArgs = parseFunctionParams(params);
      }
    } catch (e) {
      return callback('Error encoding arguments: ' + e);
    }

    try {
      data = (0, txHelper_1.encodeParams)(funAbi, funArgs);
      dataHex = data.toString();
    } catch (e) {
      return callback('Error encoding arguments: ' + e);
    }

    if (data.slice(0, 9) === 'undefined') {
      dataHex = data.slice(9);
    }

    if (data.slice(0, 2) === '0x') {
      dataHex = data.slice(2);
    }
  }

  let contractBytecode;

  if (isConstructor) {
    contractBytecode = contract.evm.bytecode.object;
    let bytecodeToDeploy = contract.evm.bytecode.object;

    if (bytecodeToDeploy.indexOf('_') >= 0) {
      linkBytecode(contract, contracts, (err, bytecode) => {
        if (err) {
          callback('Error deploying required libraries: ' + err);
        } else {
          bytecodeToDeploy = bytecode + dataHex;
          return callback(null, {
            dataHex: bytecodeToDeploy,
            funAbi,
            funArgs,
            contractBytecode,
            contractName: contractName
          });
        }
      }, callbackStep, callbackDeployLibrary);
      return;
    } else {
      dataHex = bytecodeToDeploy + dataHex;
    }
  } else {
    dataHex = (0, txHelper_1.encodeFunctionId)(funAbi) + dataHex;
  }

  callback(null, {
    dataHex,
    funAbi,
    funArgs,
    contractBytecode,
    contractName: contractName
  });
}

exports.buildData = buildData;

function atAddress() {}

exports.atAddress = atAddress;

function linkBytecodeStandard(contract, contracts, callback, callbackStep, callbackDeployLibrary) {
  let contractBytecode = contract.evm.bytecode.object;
  (0, async_1.eachOfSeries)(contract.evm.bytecode.linkReferences, (libs, file, cbFile) => {
    (0, async_1.eachOfSeries)(contract.evm.bytecode.linkReferences[file], (libRef, libName, cbLibDeployed) => {
      const library = contracts[file][libName];

      if (library) {
        deployLibrary(file + ':' + libName, libName, library, contracts, (error, address) => {
          if (error) {
            return cbLibDeployed(error);
          }

          let hexAddress = address.toString('hex');

          if (hexAddress.slice(0, 2) === '0x') {
            hexAddress = hexAddress.slice(2);
          }

          contractBytecode = linkLibraryStandard(libName, hexAddress, contractBytecode, contract);
          cbLibDeployed();
        }, callbackStep, callbackDeployLibrary);
      } else {
        cbLibDeployed('Cannot find compilation data of library ' + libName);
      }
    }, error => {
      cbFile(error);
    });
  }, error => {
    if (error) {
      callbackStep(error);
    }

    callback(error, contractBytecode);
  });
}

exports.linkBytecodeStandard = linkBytecodeStandard;

function linkBytecodeLegacy(contract, contracts, callback, callbackStep, callbackDeployLibrary) {
  const libraryRefMatch = contract.evm.bytecode.object.match(/__([^_]{1,36})__/);

  if (!libraryRefMatch) {
    return callback('Invalid bytecode format.');
  }

  const libraryName = libraryRefMatch[1]; // file_name:library_name

  const libRef = libraryName.match(/(.*):(.*)/);

  if (!libRef) {
    return callback('Cannot extract library reference ' + libraryName);
  }

  if (!contracts[libRef[1]] || !contracts[libRef[1]][libRef[2]]) {
    return callback('Cannot find library reference ' + libraryName);
  }

  const libraryShortName = libRef[2];
  const library = contracts[libRef[1]][libraryShortName];

  if (!library) {
    return callback('Library ' + libraryName + ' not found.');
  }

  deployLibrary(libraryName, libraryShortName, library, contracts, (err, address) => {
    if (err) {
      return callback(err);
    }

    let hexAddress = address.toString('hex');

    if (hexAddress.slice(0, 2) === '0x') {
      hexAddress = hexAddress.slice(2);
    }

    contract.evm.bytecode.object = linkLibrary(libraryName, hexAddress, contract.evm.bytecode.object);
    linkBytecode(contract, contracts, callback, callbackStep, callbackDeployLibrary);
  }, callbackStep, callbackDeployLibrary);
}

exports.linkBytecodeLegacy = linkBytecodeLegacy;

function linkBytecode(contract, contracts, callback, callbackStep, callbackDeployLibrary) {
  if (contract.evm.bytecode.object.indexOf('_') < 0) {
    return callback(null, contract.evm.bytecode.object);
  }

  if (contract.evm.bytecode.linkReferences && Object.keys(contract.evm.bytecode.linkReferences).length) {
    linkBytecodeStandard(contract, contracts, callback, callbackStep, callbackDeployLibrary);
  } else {
    linkBytecodeLegacy(contract, contracts, callback, callbackStep, callbackDeployLibrary);
  }
}

exports.linkBytecode = linkBytecode;

function deployLibrary(libraryName, libraryShortName, library, contracts, callback, callbackStep, callbackDeployLibrary) {
  const address = library.address;

  if (address) {
    return callback(null, address);
  }

  const bytecode = library.evm.bytecode.object;

  if (bytecode.indexOf('_') >= 0) {
    linkBytecode(library, contracts, (err, bytecode) => {
      if (err) callback(err);else {
        library.evm.bytecode.object = bytecode;
        deployLibrary(libraryName, libraryShortName, library, contracts, callback, callbackStep, callbackDeployLibrary);
      }
    }, callbackStep, callbackDeployLibrary);
  } else {
    callbackStep(`creation of library ${libraryName} pending...`);
    const data = {
      dataHex: bytecode,
      funAbi: {
        type: 'constructor'
      },
      funArgs: [],
      contractBytecode: bytecode,
      contractName: libraryShortName,
      contractABI: library.abi
    };
    callbackDeployLibrary({
      data: data,
      useCall: false
    }, (err, txResult) => {
      if (err) {
        return callback(err);
      }

      const address = txResult.receipt.contractAddress;
      library.address = address;
      callback(err, address);
    });
  }
}

exports.deployLibrary = deployLibrary;

function linkLibraryStandardFromlinkReferences(libraryName, address, bytecode, linkReferences) {
  for (const file in linkReferences) {
    for (const libName in linkReferences[file]) {
      if (libraryName === libName) {
        bytecode = setLibraryAddress(address, bytecode, linkReferences[file][libName]);
      }
    }
  }

  return bytecode;
}

exports.linkLibraryStandardFromlinkReferences = linkLibraryStandardFromlinkReferences;

function linkLibraryStandard(libraryName, address, bytecode, contract) {
  return linkLibraryStandardFromlinkReferences(libraryName, address, bytecode, contract.evm.bytecode.linkReferences);
}

exports.linkLibraryStandard = linkLibraryStandard;

function setLibraryAddress(address, bytecodeToLink, positions) {
  if (positions) {
    for (const pos of positions) {
      const regpos = bytecodeToLink.match(new RegExp(`(.{${2 * pos.start}})(.{${2 * pos.length}})(.*)`));

      if (regpos) {
        bytecodeToLink = regpos[1] + address + regpos[3];
      }
    }
  }

  return bytecodeToLink;
}

exports.setLibraryAddress = setLibraryAddress;

function linkLibrary(libraryName, address, bytecodeToLink) {
  return (0, linker_1.linkBytecode)(bytecodeToLink, {
    [libraryName]: (0, ethereumjs_util_1.addHexPrefix)(address)
  });
}

exports.linkLibrary = linkLibrary;

function decodeResponse(response, fnabi) {
  // Only decode if there supposed to be fields
  if (fnabi.outputs && fnabi.outputs.length > 0) {
    try {
      let i;
      const outputTypes = [];

      for (i = 0; i < fnabi.outputs.length; i++) {
        const type = fnabi.outputs[i].type;
        outputTypes.push(type.indexOf('tuple') === 0 ? (0, txHelper_1.makeFullTypeDefinition)(fnabi.outputs[i]) : type);
      }

      if (!response || !response.length) response = new Uint8Array(32 * fnabi.outputs.length); // ensuring the data is at least filled by 0 cause `AbiCoder` throws if there's not engouh data
      // decode data

      const abiCoder = new ethers_1.ethers.utils.AbiCoder();
      const decodedObj = abiCoder.decode(outputTypes, response);
      const json = {};

      for (i = 0; i < outputTypes.length; i++) {
        const name = fnabi.outputs[i].name;
        json[i] = outputTypes[i] + ': ' + (name ? name + ' ' + decodedObj[i] : decodedObj[i]);
      }

      return json;
    } catch (e) {
      return {
        error: 'Failed to decode output: ' + e
      };
    }
  }

  return {};
}

exports.decodeResponse = decodeResponse;

function parseFunctionParams(params) {
  let args = []; // Check if parameter string starts with array or string

  let startIndex = isArrayOrStringStart(params, 0) ? -1 : 0;

  for (let i = 0; i < params.length; i++) {
    // If a quote is received
    if (params.charAt(i) === '"') {
      startIndex = -1;
      let endQuoteIndex = false; // look for closing quote. On success, push the complete string in arguments list

      for (let j = i + 1; !endQuoteIndex; j++) {
        if (params.charAt(j) === '"') {
          args.push(params.substring(i + 1, j));
          endQuoteIndex = true;
          i = j;
        } // Throw error if end of params string is arrived but couldn't get end quote


        if (!endQuoteIndex && j === params.length - 1) {
          throw new Error('invalid params');
        }
      }
    } else if (params.charAt(i) === '[') {
      // If an array/struct opening bracket is received
      startIndex = -1;
      let bracketCount = 1;
      let j;

      for (j = i + 1; bracketCount !== 0; j++) {
        // Increase count if another array opening bracket is received (To handle nested array)
        if (params.charAt(j) === '[') {
          bracketCount++;
        } else if (params.charAt(j) === ']') {
          // // Decrease count if an array closing bracket is received (To handle nested array)
          bracketCount--;
        } // Throw error if end of params string is arrived but couldn't get end of tuple


        if (bracketCount !== 0 && j === params.length - 1) {
          throw new Error('invalid tuple params');
        }
      } // If bracketCount = 0, it means complete array/nested array parsed, push it to the arguments list


      args.push(JSON.parse(params.substring(i, j)));
      i = j - 1;
    } else if (params.charAt(i) === ',') {
      // if startIndex >= 0, it means a parameter was being parsed, it can be first or other parameter
      if (startIndex >= 0) {
        args.push(params.substring(startIndex, i));
      } // Register start index of a parameter to parse


      startIndex = isArrayOrStringStart(params, i + 1) ? -1 : i + 1;
    } else if (startIndex >= 0 && i === params.length - 1) {
      // If start index is registered and string is completed (To handle last parameter)
      args.push(params.substring(startIndex, params.length));
    }
  }

  args = args.map(e => {
    if (!Array.isArray(e)) {
      return e.trim();
    } else {
      return e;
    }
  });
  return args;
}

exports.parseFunctionParams = parseFunctionParams;

function isArrayOrStringStart(str, index) {
  return str.charAt(index) === '"' || str.charAt(index) === '[';
}

exports.isArrayOrStringStart = isArrayOrStringStart;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../node_modules/node-libs-browser/node_modules/buffer/index.js */ "../../../node_modules/node-libs-browser/node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "../../../dist/libs/remix-lib/src/execution/txHelper.js":
/*!******************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-lib/src/execution/txHelper.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inputParametersDeclarationToString = exports.visitContracts = exports.getContract = exports.getReceiveInterface = exports.getFallbackInterface = exports.getFunction = exports.extractSize = exports.serializeInputs = exports.getConstructorInterface = exports.sortAbiFunction = exports.getFunctionFragment = exports.encodeFunctionId = exports.encodeParams = exports.makeFullTypeDefinition = void 0;

const ethers_1 = __webpack_require__(/*! ethers */ "../../../node_modules/ethers/lib.esm/index.js");

function makeFullTypeDefinition(typeDef) {
  if (typeDef && typeDef.type.indexOf('tuple') === 0 && typeDef.components) {
    const innerTypes = typeDef.components.map(innerType => {
      return makeFullTypeDefinition(innerType);
    });
    return `tuple(${innerTypes.join(',')})${extractSize(typeDef.type)}`;
  }

  return typeDef.type;
}

exports.makeFullTypeDefinition = makeFullTypeDefinition;

function encodeParams(funABI, args) {
  const types = [];

  if (funABI.inputs && funABI.inputs.length) {
    for (let i = 0; i < funABI.inputs.length; i++) {
      const type = funABI.inputs[i].type; // "false" will be converting to `false` and "true" will be working
      // fine as abiCoder assume anything in quotes as `true`

      if (type === 'bool' && args[i] === 'false') {
        args[i] = false;
      }

      types.push(type.indexOf('tuple') === 0 ? makeFullTypeDefinition(funABI.inputs[i]) : type);

      if (args.length < types.length) {
        args.push('');
      }
    }
  } // NOTE: the caller will concatenate the bytecode and this
  //       it could be done here too for consistency


  const abiCoder = new ethers_1.ethers.utils.AbiCoder();
  return abiCoder.encode(types, args);
}

exports.encodeParams = encodeParams;

function encodeFunctionId(funABI) {
  if (funABI.type === 'fallback' || funABI.type === 'receive') return '0x';
  const abi = new ethers_1.ethers.utils.Interface([funABI]);
  return abi.getSighash(funABI.name);
}

exports.encodeFunctionId = encodeFunctionId;

function getFunctionFragment(funABI) {
  if (funABI.type === 'fallback' || funABI.type === 'receive') return null;
  return new ethers_1.ethers.utils.Interface([funABI]);
}

exports.getFunctionFragment = getFunctionFragment;

function sortAbiFunction(contractabi) {
  // Check if function is constant (introduced with Solidity 0.6.0)
  const isConstant = ({
    stateMutability
  }) => stateMutability === 'view' || stateMutability === 'pure'; // Sorts the list of ABI entries. Constant functions will appear first,
  // followed by non-constant functions. Within those t wo groupings, functions
  // will be sorted by their names.


  return contractabi.sort(function (a, b) {
    if (isConstant(a) && !isConstant(b)) {
      return 1;
    } else if (isConstant(b) && !isConstant(a)) {
      return -1;
    } // If we reach here, either a and b are both constant or both not; sort by name then
    // special case for fallback, receive and constructor function


    if (a.type === 'function' && typeof a.name !== 'undefined') {
      return a.name.localeCompare(b.name);
    } else if (a.type === 'constructor' || a.type === 'fallback' || a.type === 'receive') {
      return 1;
    }
  });
}

exports.sortAbiFunction = sortAbiFunction;

function getConstructorInterface(abi) {
  const funABI = {
    name: '',
    inputs: [],
    type: 'constructor',
    payable: false,
    outputs: []
  };

  if (typeof abi === 'string') {
    try {
      abi = JSON.parse(abi);
    } catch (e) {
      console.log('exception retrieving ctor abi ' + abi);
      return funABI;
    }
  }

  for (let i = 0; i < abi.length; i++) {
    if (abi[i].type === 'constructor') {
      funABI.inputs = abi[i].inputs || [];
      funABI.payable = abi[i].payable;
      funABI['stateMutability'] = abi[i].stateMutability;
      break;
    }
  }

  return funABI;
}

exports.getConstructorInterface = getConstructorInterface;

function serializeInputs(fnAbi) {
  let serialized = '(';

  if (fnAbi.inputs && fnAbi.inputs.length) {
    serialized += fnAbi.inputs.map(input => {
      return input.type;
    }).join(',');
  }

  serialized += ')';
  return serialized;
}

exports.serializeInputs = serializeInputs;

function extractSize(type) {
  const size = type.match(/([a-zA-Z0-9])(\[.*\])/);
  return size ? size[2] : '';
}

exports.extractSize = extractSize;

function getFunction(abi, fnName) {
  for (let i = 0; i < abi.length; i++) {
    const fn = abi[i];

    if (fn.type === 'function' && fnName === fn.name + '(' + fn.inputs.map(value => {
      if (value.components) {
        const fullType = makeFullTypeDefinition(value);
        return fullType.replace(/tuple/g, ''); // return of makeFullTypeDefinition might contain `tuple`, need to remove it cause `methodIdentifier` (fnName) does not include `tuple` keyword
      } else {
        return value.type;
      }
    }).join(',') + ')') {
      return fn;
    }
  }

  return null;
}

exports.getFunction = getFunction;

function getFallbackInterface(abi) {
  for (let i = 0; i < abi.length; i++) {
    if (abi[i].type === 'fallback') {
      return abi[i];
    }
  }
}

exports.getFallbackInterface = getFallbackInterface;

function getReceiveInterface(abi) {
  for (let i = 0; i < abi.length; i++) {
    if (abi[i].type === 'receive') {
      return abi[i];
    }
  }
}

exports.getReceiveInterface = getReceiveInterface;
/**
  * return the contract obj of the given @arg name. Uses last compilation result.
  * return null if not found
  * @param {String} name    - contract name
  * @returns contract obj and associated file: { contract, file } or null
  */

function getContract(contractName, contracts) {
  for (const file in contracts) {
    if (contracts[file][contractName]) {
      return {
        object: contracts[file][contractName],
        file: file
      };
    }
  }

  return null;
}

exports.getContract = getContract;
/**
  * call the given @arg cb (function) for all the contracts. Uses last compilation result
  * stop visiting when cb return true
  * @param {Function} cb    - callback
  */

function visitContracts(contracts, cb) {
  for (const file in contracts) {
    for (const name in contracts[file]) {
      if (cb({
        name: name,
        object: contracts[file][name],
        file: file
      })) return;
    }
  }
}

exports.visitContracts = visitContracts;

function inputParametersDeclarationToString(abiinputs) {
  const inputs = (abiinputs || []).map(inp => inp.type + ' ' + inp.name);
  return inputs.join(', ');
}

exports.inputParametersDeclarationToString = inputParametersDeclarationToString;

/***/ }),

/***/ "../../../dist/libs/remix-lib/src/execution/txListener.js":
/*!********************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-lib/src/execution/txListener.js ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TxListener = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const async_1 = __webpack_require__(/*! async */ "../../../node_modules/async/dist/async.js");

const ethers_1 = __webpack_require__(/*! ethers */ "../../../node_modules/ethers/lib.esm/index.js");

const ethereumjs_util_1 = __webpack_require__(/*! ethereumjs-util */ "../../../node_modules/ethereumjs-util/dist.browser/index.js");

const eventManager_1 = __webpack_require__(/*! ../eventManager */ "../../../dist/libs/remix-lib/src/eventManager.js");

const util_1 = __webpack_require__(/*! ../util */ "../../../dist/libs/remix-lib/src/util.js");

const txFormat_1 = __webpack_require__(/*! ./txFormat */ "../../../dist/libs/remix-lib/src/execution/txFormat.js");

const txHelper_1 = __webpack_require__(/*! ./txHelper */ "../../../dist/libs/remix-lib/src/execution/txHelper.js");

function addExecutionCosts(txResult, tx, execResult) {
  if (txResult) {
    if (execResult) {
      tx.returnValue = execResult.returnValue;
      if (execResult.gasUsed) tx.executionCost = execResult.gasUsed.toString(10);
    }

    if (txResult.receipt && txResult.receipt.gasUsed) tx.transactionCost = txResult.receipt.gasUsed.toString(10);
  }
}
/**
  * poll web3 each 2s if web3
  * listen on transaction executed event if VM
  * attention: blocks returned by the event `newBlock` have slightly different json properties whether web3 or the VM is used
  * trigger 'newBlock'
  *
  */


class TxListener {
  constructor(opt, executionContext) {
    this.event = new eventManager_1.EventManager(); // has a default for now for backwards compatability

    this.executionContext = executionContext;
    this._api = opt.api;
    this._resolvedTransactions = {};
    this._resolvedContracts = {};
    this._isListening = false;
    this._listenOnNetwork = false;
    this._loopId = null;
    this.init();
    this.executionContext.event.register('contextChanged', context => {
      if (this._isListening) {
        this.stopListening();
        this.startListening();
      }
    });
    opt.event.udapp.register('callExecuted', (error, from, to, data, lookupOnly, txResult) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      if (error) return; // we go for that case if
      // in VM mode
      // in web3 mode && listen remix txs only

      if (!this._isListening) return; // we don't listen

      if (this._loopId && this.executionContext.getProvider() !== 'vm') return; // we seems to already listen on a "web3" network

      let returnValue;
      let execResult;

      if (this.executionContext.isVM()) {
        execResult = yield this.executionContext.web3().eth.getExecutionResultFromSimulator(txResult.transactionHash);
        returnValue = execResult.returnValue;
      } else {
        returnValue = (0, ethereumjs_util_1.toBuffer)((0, ethereumjs_util_1.addHexPrefix)(txResult.result));
      }

      const call = {
        from: from,
        to: to,
        input: data,
        hash: txResult.transactionHash ? txResult.transactionHash : 'call' + (from || '') + to + data,
        isCall: true,
        returnValue,
        envMode: this.executionContext.getProvider()
      };
      addExecutionCosts(txResult, call, execResult);

      this._resolveTx(call, call, (error, resolvedData) => {
        if (!error) {
          this.event.trigger('newCall', [call]);
        }
      });
    }));
    opt.event.udapp.register('transactionExecuted', (error, from, to, data, lookupOnly, txResult) => {
      if (error) return;
      if (lookupOnly) return; // we go for that case if
      // in VM mode
      // in web3 mode && listen remix txs only

      if (!this._isListening) return; // we don't listen

      if (this._loopId && this.executionContext.getProvider() !== 'vm') return; // we seems to already listen on a "web3" network

      this.executionContext.web3().eth.getTransaction(txResult.transactionHash, (error, tx) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        if (error) return console.log(error);
        let execResult;

        if (this.executionContext.isVM()) {
          execResult = yield this.executionContext.web3().eth.getExecutionResultFromSimulator(txResult.transactionHash);
        }

        addExecutionCosts(txResult, tx, execResult);
        tx.envMode = this.executionContext.getProvider();
        tx.status = txResult.receipt.status; // 0x0 or 0x1

        this._resolve([tx], () => {});
      }));
    });
  }
  /**
    * define if txlistener should listen on the network or if only tx created from remix are managed
    *
    * @param {Bool} type - true if listen on the network
    */


  setListenOnNetwork(listenOnNetwork) {
    this._listenOnNetwork = listenOnNetwork;

    if (this._loopId) {
      clearInterval(this._loopId);
    }

    if (this._listenOnNetwork) {
      this._startListenOnNetwork();
    }
  }
  /**
    * reset recorded transactions
    */


  init() {
    this.blocks = [];
    this.lastBlock = null;
  }
  /**
    * start listening for incoming transactions
    *
    * @param {String} type - type/name of the provider to add
    * @param {Object} obj  - provider
    */


  startListening() {
    this.init();
    this._isListening = true;

    if (this._listenOnNetwork && this.executionContext.getProvider() !== 'vm') {
      this._startListenOnNetwork();
    }
  }
  /**
    * stop listening for incoming transactions. do not reset the recorded pool.
    *
    * @param {String} type - type/name of the provider to add
    * @param {Object} obj  - provider
    */


  stopListening() {
    if (this._loopId) {
      clearInterval(this._loopId);
    }

    this._loopId = null;
    this._isListening = false;
  }

  _startListenOnNetwork() {
    this._loopId = setInterval(() => {
      const currentLoopId = this._loopId;
      this.executionContext.web3().eth.getBlockNumber((error, blockNumber) => {
        if (this._loopId === null) return;
        if (error) return console.log(error);

        if (currentLoopId === this._loopId && (!this.lastBlock || blockNumber > this.lastBlock)) {
          if (!this.lastBlock) this.lastBlock = blockNumber - 1;
          let current = this.lastBlock + 1;
          this.lastBlock = blockNumber;

          while (blockNumber >= current) {
            try {
              this._manageBlock(current);
            } catch (e) {
              console.log(e);
            }

            current++;
          }
        }
      });
    }, 2000);
  }

  _manageBlock(blockNumber) {
    this.executionContext.web3().eth.getBlock(blockNumber, true, (error, result) => {
      if (!error) {
        this._newBlock(Object.assign({
          type: 'web3'
        }, result));
      }
    });
  }
  /**
    * try to resolve the contract name from the given @arg address
    *
    * @param {String} address - contract address to resolve
    * @return {String} - contract name
    */


  resolvedContract(address) {
    if (this._resolvedContracts[address]) return this._resolvedContracts[address].name;
    return null;
  }
  /**
    * try to resolve the transaction from the given @arg txHash
    *
    * @param {String} txHash - contract address to resolve
    * @return {String} - contract name
    */


  resolvedTransaction(txHash) {
    return this._resolvedTransactions[txHash];
  }

  _newBlock(block) {
    this.blocks.push(block);

    this._resolve(block.transactions, () => {
      this.event.trigger('newBlock', [block]);
    });
  }

  _resolve(transactions, callback) {
    (0, async_1.each)(transactions, (tx, cb) => {
      this._api.resolveReceipt(tx, (error, receipt) => {
        if (error) return cb(error);

        this._resolveTx(tx, receipt, (error, resolvedData) => {
          if (error) cb(error);

          if (resolvedData) {
            this.event.trigger('txResolved', [tx, receipt, resolvedData]);
          }

          this.event.trigger('newTransaction', [tx, receipt]);
          cb();
        });
      });
    }, () => {
      callback();
    });
  }

  _resolveTx(tx, receipt, cb) {
    const contracts = this._api.contracts();

    if (!contracts) return cb();
    let fun;
    let contract;

    if (!tx.to || tx.to === '0x0') {
      // testrpc returns 0x0 in that case
      // contract creation / resolve using the creation bytes code
      // if web3: we have to call getTransactionReceipt to get the created address
      // if VM: created address already included
      const code = tx.input;
      contract = this._tryResolveContract(code, contracts, true);

      if (contract) {
        const address = receipt.contractAddress;
        this._resolvedContracts[address] = contract;
        fun = this._resolveFunction(contract, tx, true);

        if (this._resolvedTransactions[tx.hash]) {
          this._resolvedTransactions[tx.hash].contractAddress = address;
        }

        return cb(null, {
          to: null,
          contractName: contract.name,
          function: fun,
          creationAddress: address
        });
      }

      return cb();
    } else {
      // first check known contract, resolve against the `runtimeBytecode` if not known
      contract = this._resolvedContracts[tx.to];

      if (!contract) {
        this.executionContext.web3().eth.getCode(tx.to, (error, code) => {
          if (error) return cb(error);

          if (code) {
            const contract = this._tryResolveContract(code, contracts, false);

            if (contract) {
              this._resolvedContracts[tx.to] = contract;

              const fun = this._resolveFunction(contract, tx, false);

              return cb(null, {
                to: tx.to,
                contractName: contract.name,
                function: fun
              });
            }
          }

          return cb();
        });
        return;
      }

      if (contract) {
        fun = this._resolveFunction(contract, tx, false);
        return cb(null, {
          to: tx.to,
          contractName: contract.name,
          function: fun
        });
      }

      return cb();
    }
  }

  _resolveFunction(contract, tx, isCtor) {
    if (!contract) {
      console.log('txListener: cannot resolve contract - contract is null');
      return;
    }

    const abi = contract.object.abi;
    const inputData = tx.input.replace('0x', '');

    if (!isCtor) {
      const methodIdentifiers = contract.object.evm.methodIdentifiers;

      for (const fn in methodIdentifiers) {
        if (methodIdentifiers[fn] === inputData.substring(0, 8)) {
          const fnabi = (0, txHelper_1.getFunction)(abi, fn);
          this._resolvedTransactions[tx.hash] = {
            contractName: contract.name,
            to: tx.to,
            fn: fn,
            params: this._decodeInputParams(inputData.substring(8), fnabi)
          };

          if (tx.returnValue) {
            this._resolvedTransactions[tx.hash].decodedReturnValue = (0, txFormat_1.decodeResponse)(tx.returnValue, fnabi);
          }

          return this._resolvedTransactions[tx.hash];
        }
      } // receive function


      if (!inputData && (0, txHelper_1.getReceiveInterface)(abi)) {
        this._resolvedTransactions[tx.hash] = {
          contractName: contract.name,
          to: tx.to,
          fn: '(receive)',
          params: null
        };
      } else {
        // fallback function
        this._resolvedTransactions[tx.hash] = {
          contractName: contract.name,
          to: tx.to,
          fn: '(fallback)',
          params: null
        };
      }
    } else {
      const bytecode = contract.object.evm.bytecode.object;
      let params = null;

      if (bytecode && bytecode.length) {
        params = this._decodeInputParams(inputData.substring(bytecode.length), (0, txHelper_1.getConstructorInterface)(abi));
      }

      this._resolvedTransactions[tx.hash] = {
        contractName: contract.name,
        to: null,
        fn: '(constructor)',
        params: params
      };
    }

    return this._resolvedTransactions[tx.hash];
  }

  _tryResolveContract(codeToResolve, compiledContracts, isCreation) {
    let found = null;
    (0, txHelper_1.visitContracts)(compiledContracts, contract => {
      const bytes = isCreation ? contract.object.evm.bytecode.object : contract.object.evm.deployedBytecode.object;

      if ((0, util_1.compareByteCode)(codeToResolve, '0x' + bytes)) {
        found = contract;
        return true;
      }
    });
    return found;
  }

  _decodeInputParams(data, abi) {
    data = (0, ethereumjs_util_1.toBuffer)((0, ethereumjs_util_1.addHexPrefix)(data));
    if (!data.length) data = new Uint8Array(32 * abi.inputs.length); // ensuring the data is at least filled by 0 cause `AbiCoder` throws if there's not engouh data

    const inputTypes = [];

    for (let i = 0; i < abi.inputs.length; i++) {
      const type = abi.inputs[i].type;
      inputTypes.push(type.indexOf('tuple') === 0 ? (0, txHelper_1.makeFullTypeDefinition)(abi.inputs[i]) : type);
    }

    const abiCoder = new ethers_1.ethers.utils.AbiCoder();
    const decoded = abiCoder.decode(inputTypes, data);
    const ret = {};

    for (var k in abi.inputs) {
      ret[abi.inputs[k].type + ' ' + abi.inputs[k].name] = decoded[k];
    }

    return ret;
  }

}

exports.TxListener = TxListener;

/***/ }),

/***/ "../../../dist/libs/remix-lib/src/execution/txRunner.js":
/*!******************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-lib/src/execution/txRunner.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TxRunner = void 0;

const eventManager_1 = __webpack_require__(/*! ../eventManager */ "../../../dist/libs/remix-lib/src/eventManager.js");

class TxRunner {
  constructor(internalRunner, opt) {
    this.opt = opt || {};
    this.internalRunner = internalRunner;
    this.event = new eventManager_1.EventManager();
    this.runAsync = this.opt.runAsync || true; // We have to run like this cause the VM Event Manager does not support running multiple txs at the same time.

    this.pendingTxs = {};
    this.queusTxs = [];
  }

  rawRun(args, confirmationCb, gasEstimationForceSend, promptCb, cb) {
    run(this, args, args.timestamp || Date.now(), confirmationCb, gasEstimationForceSend, promptCb, cb);
  }

  execute(args, confirmationCb, gasEstimationForceSend, promptCb, callback) {
    let data = args.data;

    if (data.slice(0, 2) !== '0x') {
      data = '0x' + data;
    }

    this.internalRunner.execute(args, confirmationCb, gasEstimationForceSend, promptCb, callback);
  }

}

exports.TxRunner = TxRunner;

function run(self, tx, stamp, confirmationCb, gasEstimationForceSend = null, promptCb = null, callback = null) {
  if (!self.runAsync && Object.keys(self.pendingTxs).length) {
    return self.queusTxs.push({
      tx,
      stamp,
      callback
    });
  }

  self.pendingTxs[stamp] = tx;
  self.execute(tx, confirmationCb, gasEstimationForceSend, promptCb, function (error, result) {
    delete self.pendingTxs[stamp];
    if (callback && typeof callback === 'function') callback(error, result);

    if (self.queusTxs.length) {
      const next = self.queusTxs.pop();
      run(self, next.tx, next.stamp, next.callback);
    }
  });
}

/***/ }),

/***/ "../../../dist/libs/remix-lib/src/execution/txRunnerVM.js":
/*!********************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-lib/src/execution/txRunnerVM.js ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TxRunnerVM = void 0;

const tx_1 = __webpack_require__(/*! @ethereumjs/tx */ "../../../node_modules/@ethereumjs/tx/dist.browser/index.js");

const block_1 = __webpack_require__(/*! @ethereumjs/block */ "../../../node_modules/@ethereumjs/block/dist.browser/index.js");

const ethereumjs_util_1 = __webpack_require__(/*! ethereumjs-util */ "../../../node_modules/ethereumjs-util/dist.browser/index.js");

const eventManager_1 = __webpack_require__(/*! ../eventManager */ "../../../dist/libs/remix-lib/src/eventManager.js");

const logsManager_1 = __webpack_require__(/*! ./logsManager */ "../../../dist/libs/remix-lib/src/execution/logsManager.js");

class TxRunnerVM {
  constructor(vmaccounts, api, getVMObject) {
    this.event = new eventManager_1.EventManager();
    this.logsManager = new logsManager_1.LogsManager(); // has a default for now for backwards compatability

    this.getVMObject = getVMObject;
    this.commonContext = this.getVMObject().common;
    this.blockNumber = 0;
    this.runAsync = true;
    this.blockNumber = 0; // The VM is running in Homestead mode, which started at this block.

    this.runAsync = false; // We have to run like this cause the VM Event Manager does not support running multiple txs at the same time.

    this.pendingTxs = {};
    this.vmaccounts = vmaccounts;
    this.queusTxs = [];
    this.blocks = [];
    /*
      txHash is generated using the nonce,
      in order to have unique transaction hash, we need to keep using different nonce (in case of a call)
      so we increment this value after each call.
      For this to function we also need to skip nonce validation, in the vm: `{ skipNonce: true }`
    */

    this.nextNonceForCall = 0;
  }

  execute(args, confirmationCb, gasEstimationForceSend, promptCb, callback) {
    let data = args.data;

    if (data.slice(0, 2) !== '0x') {
      data = '0x' + data;
    }

    try {
      this.runInVm(args.from, args.to, data, args.value, args.gasLimit, args.useCall, args.timestamp, callback);
    } catch (e) {
      callback(e, null);
    }
  }

  runInVm(from, to, data, value, gasLimit, useCall, timestamp, callback) {
    const self = this;
    const account = self.vmaccounts[from];

    if (!account) {
      return callback('Invalid account selected');
    }

    if (Number.isInteger(gasLimit)) {
      gasLimit = '0x' + gasLimit.toString(16);
    }

    this.getVMObject().stateManager.getAccount(ethereumjs_util_1.Address.fromString(from)).then(res => {
      // See https://github.com/ethereumjs/ethereumjs-tx/blob/master/docs/classes/transaction.md#constructor
      // for initialization fields and their types
      if (!value) value = 0;

      if (typeof value === 'string') {
        if (value.startsWith('0x')) value = new ethereumjs_util_1.BN(value.replace('0x', ''), 'hex');else {
          try {
            value = new ethereumjs_util_1.BN(value, 10);
          } catch (e) {
            return callback('Unable to parse the value ' + e.message);
          }
        }
      }

      const EIP1559 = this.commonContext.hardfork() !== 'berlin'; // berlin is the only pre eip1559 fork that we handle.

      let tx;

      if (!EIP1559) {
        tx = tx_1.Transaction.fromTxData({
          nonce: useCall ? this.nextNonceForCall : new ethereumjs_util_1.BN(res.nonce),
          gasPrice: '0x1',
          gasLimit: gasLimit,
          to: to,
          value: value,
          data: Buffer.from(data.slice(2), 'hex')
        }, {
          common: this.commonContext
        }).sign(account.privateKey);
      } else {
        tx = tx_1.FeeMarketEIP1559Transaction.fromTxData({
          nonce: useCall ? this.nextNonceForCall : new ethereumjs_util_1.BN(res.nonce),
          maxPriorityFeePerGas: '0x01',
          maxFeePerGas: '0x1',
          gasLimit: gasLimit,
          to: to,
          value: value,
          data: Buffer.from(data.slice(2), 'hex')
        }).sign(account.privateKey);
      }

      if (useCall) this.nextNonceForCall++;
      const coinbases = ['0x0e9281e9c6a0808672eaba6bd1220e144c9bb07a', '0x8945a1288dc78a6d8952a92c77aee6730b414778', '0x94d76e24f818426ae84aa404140e8d5f60e10e7e'];
      const difficulties = [new ethereumjs_util_1.BN('69762765929000', 10), new ethereumjs_util_1.BN('70762765929000', 10), new ethereumjs_util_1.BN('71762765929000', 10)];
      var block = block_1.Block.fromBlockData({
        header: {
          timestamp: timestamp || new Date().getTime() / 1000 | 0,
          number: self.blockNumber,
          coinbase: coinbases[self.blockNumber % coinbases.length],
          difficulty: difficulties[self.blockNumber % difficulties.length],
          gasLimit: new ethereumjs_util_1.BN(gasLimit.replace('0x', ''), 16).imuln(2),
          baseFeePerGas: EIP1559 ? '0x1' : undefined
        },
        transactions: [tx]
      }, {
        common: this.commonContext
      });

      if (!useCall) {
        ++self.blockNumber;
        this.runBlockInVm(tx, block, callback);
      } else {
        this.getVMObject().stateManager.checkpoint().then(() => {
          this.runBlockInVm(tx, block, (err, result) => {
            this.getVMObject().stateManager.revert().then(() => {
              callback(err, result);
            });
          });
        });
      }
    }).catch(e => {
      callback(e);
    });
  }

  runBlockInVm(tx, block, callback) {
    this.getVMObject().vm.runBlock({
      block: block,
      generate: true,
      skipBlockValidation: true,
      skipBalance: false,
      skipNonce: true
    }).then(results => {
      const result = results.results[0];

      if (result) {
        const status = result.execResult.exceptionError ? 0 : 1;
        result.status = `0x${status}`;
      }

      callback(null, {
        result: result,
        transactionHash: (0, ethereumjs_util_1.bufferToHex)(Buffer.from(tx.hash())),
        block,
        tx
      });
    }).catch(function (err) {
      callback(err);
    });
  }

}

exports.TxRunnerVM = TxRunnerVM;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../node_modules/node-libs-browser/node_modules/buffer/index.js */ "../../../node_modules/node-libs-browser/node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "../../../dist/libs/remix-lib/src/execution/txRunnerWeb3.js":
/*!**********************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-lib/src/execution/txRunnerWeb3.js ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TxRunnerWeb3 = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const eventManager_1 = __webpack_require__(/*! ../eventManager */ "../../../dist/libs/remix-lib/src/eventManager.js");

class TxRunnerWeb3 {
  constructor(api, getWeb3, currentblockGasLimit) {
    this.event = new eventManager_1.EventManager();
    this.getWeb3 = getWeb3;
    this.currentblockGasLimit = currentblockGasLimit;
    this._api = api;
  }

  _executeTx(tx, network, txFee, api, promptCb, callback) {
    if (network && network.lastBlock && network.lastBlock.baseFeePerGas) {
      // the sending stack (web3.js / metamask need to have the type defined)
      // this is to avoid the following issue: https://github.com/MetaMask/metamask-extension/issues/11824
      tx.type = '0x2';
    }

    if (txFee) {
      if (txFee.baseFeePerGas) {
        tx.maxPriorityFeePerGas = this.getWeb3().utils.toHex(this.getWeb3().utils.toWei(txFee.maxPriorityFee, 'gwei'));
        tx.maxFeePerGas = this.getWeb3().utils.toHex(this.getWeb3().utils.toWei(txFee.maxFee, 'gwei'));
        tx.type = '0x2';
      } else {
        tx.gasPrice = this.getWeb3().utils.toHex(this.getWeb3().utils.toWei(txFee.gasPrice, 'gwei'));
        tx.type = '0x1';
      }
    }

    if (api.personalMode()) {
      promptCb(value => {
        this._sendTransaction(this.getWeb3().personal.sendTransaction, tx, value, callback);
      }, () => {
        return callback('Canceled by user.');
      });
    } else {
      this._sendTransaction(this.getWeb3().eth.sendTransaction, tx, null, callback);
    }
  }

  _sendTransaction(sendTx, tx, pass, callback) {
    const cb = (err, resp) => {
      if (err) {
        return callback(err, resp);
      }

      this.event.trigger('transactionBroadcasted', [resp]);

      var listenOnResponse = () => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise((resolve, reject) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
          const receipt = yield tryTillReceiptAvailable(resp, this.getWeb3());
          tx = yield tryTillTxAvailable(resp, this.getWeb3());
          resolve({
            receipt,
            tx,
            transactionHash: receipt ? receipt['transactionHash'] : null
          });
        }));
      };

      listenOnResponse().then(txData => {
        callback(null, txData);
      }).catch(error => {
        callback(error);
      });
    };

    const args = pass !== null ? [tx, pass, cb] : [tx, cb];

    try {
      sendTx.apply({}, args);
    } catch (e) {
      return callback(`Send transaction failed: ${e.message} . if you use an injected provider, please check it is properly unlocked. `);
    }
  }

  execute(args, confirmationCb, gasEstimationForceSend, promptCb, callback) {
    let data = args.data;

    if (data.slice(0, 2) !== '0x') {
      data = '0x' + data;
    }

    return this.runInNode(args.from, args.to, data, args.value, args.gasLimit, args.useCall, args.timestamp, confirmationCb, gasEstimationForceSend, promptCb, callback);
  }

  runInNode(from, to, data, value, gasLimit, useCall, timestamp, confirmCb, gasEstimationForceSend, promptCb, callback) {
    const tx = {
      from: from,
      to: to,
      data: data,
      value: value
    };

    if (useCall) {
      tx['gas'] = gasLimit;
      if (this._api && this._api.isVM()) tx['timestamp'] = timestamp;
      return this.getWeb3().eth.call(tx, function (error, result) {
        if (error) return callback(error);
        callback(null, {
          result: result
        });
      });
    }

    this.getWeb3().eth.estimateGas(tx, (err, gasEstimation) => {
      if (err && err.message.indexOf('Invalid JSON RPC response') !== -1) {
        // // @todo(#378) this should be removed when https://github.com/WalletConnect/walletconnect-monorepo/issues/334 is fixed
        callback(new Error('Gas estimation failed because of an unknown internal error. This may indicated that the transaction will fail.'));
      }

      gasEstimationForceSend(err, () => {
        // callback is called whenever no error
        tx['gas'] = !gasEstimation ? gasLimit : gasEstimation;

        this._api.detectNetwork((err, network) => {
          if (err) {
            console.log(err);
            return;
          }

          if (this._api.config.getUnpersistedProperty('doNotShowTransactionConfirmationAgain')) {
            return this._executeTx(tx, network, null, this._api, promptCb, callback);
          }

          confirmCb(network, tx, tx['gas'], txFee => {
            return this._executeTx(tx, network, txFee, this._api, promptCb, callback);
          }, error => {
            callback(error);
          });
        });
      }, () => {
        const blockGasLimit = this.currentblockGasLimit(); // NOTE: estimateGas very likely will return a large limit if execution of the code failed
        //       we want to be able to run the code in order to debug and find the cause for the failure

        if (err) return callback(err);
        let warnEstimation = ' An important gas estimation might also be the sign of a problem in the contract code. Please check loops and be sure you did not sent value to a non payable function (that\'s also the reason of strong gas estimation). ';
        warnEstimation += ' ' + err;

        if (gasEstimation > gasLimit) {
          return callback('Gas required exceeds limit: ' + gasLimit + '. ' + warnEstimation);
        }

        if (gasEstimation > blockGasLimit) {
          return callback('Gas required exceeds block gas limit: ' + gasLimit + '. ' + warnEstimation);
        }
      });
    });
  }

}

exports.TxRunnerWeb3 = TxRunnerWeb3;

function tryTillReceiptAvailable(txhash, web3) {
  return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
    try {
      const receipt = yield web3.eth.getTransactionReceipt(txhash);
      if (receipt) return receipt;
    } catch (e) {}

    yield pause();
    return yield tryTillReceiptAvailable(txhash, web3);
  });
}

function tryTillTxAvailable(txhash, web3) {
  return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
    try {
      const tx = yield web3.eth.getTransaction(txhash);
      if (tx) return tx;
    } catch (e) {}

    return yield tryTillTxAvailable(txhash, web3);
  });
}

function pause() {
  return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 500);
    });
  });
}

/***/ }),

/***/ "../../../dist/libs/remix-lib/src/execution/typeConversion.js":
/*!************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-lib/src/execution/typeConversion.js ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringify = exports.toInt = void 0;

const ethereumjs_util_1 = __webpack_require__(/*! ethereumjs-util */ "../../../node_modules/ethereumjs-util/dist.browser/index.js");

function toInt(h) {
  if (h.indexOf && h.indexOf('0x') === 0) {
    return new ethereumjs_util_1.BN(h.replace('0x', ''), 16).toString(10);
  } else if (h.constructor && h.constructor.name === 'BigNumber' || ethereumjs_util_1.BN.isBN(h)) {
    return h.toString(10);
  }

  return h;
}

exports.toInt = toInt;
exports.stringify = convertToString;

function convertToString(v) {
  try {
    if (v instanceof Array) {
      const ret = [];

      for (var k in v) {
        ret.push(convertToString(v[k]));
      }

      return ret;
    } else if (ethereumjs_util_1.BN.isBN(v) || v.constructor && v.constructor.name === 'BigNumber') {
      return v.toString(10);
    } else if (v._isBuffer) {
      return (0, ethereumjs_util_1.bufferToHex)(v);
    } else if (typeof v === 'object') {
      const retObject = {};

      for (const i in v) {
        retObject[i] = convertToString(v[i]);
      }

      return retObject;
    } else {
      return v;
    }
  } catch (e) {
    console.log(e);
    return v;
  }
}

/***/ }),

/***/ "../../../dist/libs/remix-lib/src/helpers/compilerHelper.js":
/*!**********************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-lib/src/helpers/compilerHelper.js ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compilerInput = void 0;

function compilerInput(contracts) {
  return JSON.stringify({
    language: 'Solidity',
    sources: {
      'test.sol': {
        content: contracts
      }
    },
    settings: {
      optimizer: {
        enabled: false,
        runs: 200
      },
      outputSelection: {
        '*': {
          '': ['ast'],
          '*': ['abi', 'metadata', 'evm.legacyAssembly', 'evm.bytecode', 'evm.deployedBytecode', 'evm.methodIdentifiers', 'evm.gasEstimates']
        }
      }
    }
  });
}

exports.compilerInput = compilerInput;

/***/ }),

/***/ "../../../dist/libs/remix-lib/src/helpers/hhconsoleSigs.js":
/*!*********************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-lib/src/helpers/hhconsoleSigs.js ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // Fetched from https://github.com/nomiclabs/hardhat/blob/ee4969a0a8f746f4775d4018326056d161066869/packages/hardhat-core/src/internal/hardhat-network/stack-traces/logger.ts#L47

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConsoleLogs = void 0;
exports.ConsoleLogs = {
  1368866505: '()',
  1309416733: '(int)',
  4122065833: '(uint)',
  1093685164: '(string)',
  843419373: '(bool)',
  741264322: '(address)',
  199720790: '(bytes)',
  1847107880: '(bytes1)',
  3921027734: '(bytes2)',
  763578662: '(bytes3)',
  3764340945: '(bytes4)',
  2793701517: '(bytes5)',
  2927928721: '(bytes6)',
  1322614312: '(bytes7)',
  1334060334: '(bytes8)',
  2428341456: '(bytes9)',
  20780939: '(bytes10)',
  67127854: '(bytes11)',
  2258660029: '(bytes12)',
  2488442420: '(bytes13)',
  2456219775: '(bytes14)',
  3667227872: '(bytes15)',
  1717330180: '(bytes16)',
  866084666: '(bytes17)',
  3302112666: '(bytes18)',
  1584093747: '(bytes19)',
  1367925737: '(bytes20)',
  3923391840: '(bytes21)',
  3589990556: '(bytes22)',
  2879508237: '(bytes23)',
  4055063348: '(bytes24)',
  193248344: '(bytes25)',
  4172368369: '(bytes26)',
  976705501: '(bytes27)',
  3358255854: '(bytes28)',
  1265222613: '(bytes29)',
  3994207469: '(bytes30)',
  3263516050: '(bytes31)',
  666357637: '(bytes32)',
  1812949376: '(uint,uint)',
  262402885: '(uint,string)',
  510514412: '(uint,bool)',
  1491830284: '(uint,address)',
  2534451664: '(string,uint)',
  1264337527: '(string,string)',
  3283441205: '(string,bool)',
  832238387: '(string,address)',
  910912146: '(bool,uint)',
  2414527781: '(bool,string)',
  705760899: '(bool,bool)',
  2235320393: '(bool,address)',
  574869411: '(address,uint)',
  1973388987: '(address,string)',
  1974863315: '(address,bool)',
  3673216170: '(address,address)',
  3884059252: '(uint,uint,uint)',
  2104037094: '(uint,uint,string)',
  1733758967: '(uint,uint,bool)',
  3191032091: '(uint,uint,address)',
  1533929535: '(uint,string,uint)',
  1062716053: '(uint,string,string)',
  1185403086: '(uint,string,bool)',
  529592906: '(uint,string,address)',
  1515034914: '(uint,bool,uint)',
  2332955902: '(uint,bool,string)',
  3587091680: '(uint,bool,bool)',
  1112473535: '(uint,bool,address)',
  2286109610: '(uint,address,uint)',
  3464692859: '(uint,address,string)',
  2060456590: '(uint,address,bool)',
  2104993307: '(uint,address,address)',
  2526862595: '(string,uint,uint)',
  2750793529: '(string,uint,string)',
  4043501061: '(string,uint,bool)',
  3817119609: '(string,uint,address)',
  4083337817: '(string,string,uint)',
  753761519: '(string,string,string)',
  2967534005: '(string,string,bool)',
  2515337621: '(string,string,address)',
  689682896: '(string,bool,uint)',
  3801674877: '(string,bool,string)',
  2232122070: '(string,bool,bool)',
  2469116728: '(string,bool,address)',
  130552343: '(string,address,uint)',
  3773410639: '(string,address,string)',
  3374145236: '(string,address,bool)',
  4243355104: '(string,address,address)',
  995886048: '(bool,uint,uint)',
  3359211184: '(bool,uint,string)',
  464374251: '(bool,uint,bool)',
  3302110471: '(bool,uint,address)',
  3224906412: '(bool,string,uint)',
  2960557183: '(bool,string,string)',
  3686056519: '(bool,string,bool)',
  2509355347: '(bool,string,address)',
  2954061243: '(bool,bool,uint)',
  626391622: '(bool,bool,string)',
  1349555864: '(bool,bool,bool)',
  276362893: '(bool,bool,address)',
  3950005167: '(bool,address,uint)',
  3734671984: '(bool,address,string)',
  415876934: '(bool,address,bool)',
  3530962535: '(bool,address,address)',
  2273710942: '(address,uint,uint)',
  3136907337: '(address,uint,string)',
  3846889796: '(address,uint,bool)',
  2548867988: '(address,uint,address)',
  484110986: '(address,string,uint)',
  4218888805: '(address,string,string)',
  3473018801: '(address,string,bool)',
  4035396840: '(address,string,address)',
  742821141: '(address,bool,uint)',
  555898316: '(address,bool,string)',
  3951234194: '(address,bool,bool)',
  4044790253: '(address,bool,address)',
  1815506290: '(address,address,uint)',
  7426238: '(address,address,string)',
  4070990470: '(address,address,bool)',
  25986242: '(address,address,address)',
  1554033982: '(uint,uint,uint,uint)',
  2024634892: '(uint,uint,uint,string)',
  1683143115: '(uint,uint,uint,bool)',
  3766828905: '(uint,uint,uint,address)',
  949229117: '(uint,uint,string,uint)',
  2080582194: '(uint,uint,string,string)',
  2989403910: '(uint,uint,string,bool)',
  1127384482: '(uint,uint,string,address)',
  1818524812: '(uint,uint,bool,uint)',
  4024028142: '(uint,uint,bool,string)',
  2495495089: '(uint,uint,bool,bool)',
  3776410703: '(uint,uint,bool,address)',
  1628154048: '(uint,uint,address,uint)',
  3600994782: '(uint,uint,address,string)',
  2833785006: '(uint,uint,address,bool)',
  3398671136: '(uint,uint,address,address)',
  3221501959: '(uint,string,uint,uint)',
  2730232985: '(uint,string,uint,string)',
  2270850606: '(uint,string,uint,bool)',
  2877020669: '(uint,string,uint,address)',
  1995203422: '(uint,string,string,uint)',
  1474103825: '(uint,string,string,string)',
  310782872: '(uint,string,string,bool)',
  3432549024: '(uint,string,string,address)',
  2763295359: '(uint,string,bool,uint)',
  2370346144: '(uint,string,bool,string)',
  1371286465: '(uint,string,bool,bool)',
  2037328032: '(uint,string,bool,address)',
  2565338099: '(uint,string,address,uint)',
  4170733439: '(uint,string,address,string)',
  4181720887: '(uint,string,address,bool)',
  2141537675: '(uint,string,address,address)',
  1451396516: '(uint,bool,uint,uint)',
  3906845782: '(uint,bool,uint,string)',
  3534472445: '(uint,bool,uint,bool)',
  1329595790: '(uint,bool,uint,address)',
  2438978344: '(uint,bool,string,uint)',
  2754870525: '(uint,bool,string,string)',
  879671495: '(uint,bool,string,bool)',
  1231956916: '(uint,bool,string,address)',
  3173363033: '(uint,bool,bool,uint)',
  831186331: '(uint,bool,bool,string)',
  1315722005: '(uint,bool,bool,bool)',
  1392910941: '(uint,bool,bool,address)',
  1102442299: '(uint,bool,address,uint)',
  2721084958: '(uint,bool,address,string)',
  2449150530: '(uint,bool,address,bool)',
  2263728396: '(uint,bool,address,address)',
  3399106228: '(uint,address,uint,uint)',
  1054063912: '(uint,address,uint,string)',
  435581801: '(uint,address,uint,bool)',
  4256361684: '(uint,address,uint,address)',
  2697204968: '(uint,address,string,uint)',
  2373420580: '(uint,address,string,string)',
  581204390: '(uint,address,string,bool)',
  3420819197: '(uint,address,string,address)',
  2064181483: '(uint,address,bool,uint)',
  1676730946: '(uint,address,bool,string)',
  2116501773: '(uint,address,bool,bool)',
  3056677012: '(uint,address,bool,address)',
  2587672470: '(uint,address,address,uint)',
  2034490470: '(uint,address,address,string)',
  22350596: '(uint,address,address,bool)',
  1430734329: '(uint,address,address,address)',
  149837414: '(string,uint,uint,uint)',
  2773406909: '(string,uint,uint,string)',
  4147936829: '(string,uint,uint,bool)',
  3201771711: '(string,uint,uint,address)',
  2697245221: '(string,uint,string,uint)',
  1821956834: '(string,uint,string,string)',
  3919545039: '(string,uint,string,bool)',
  3144824297: '(string,uint,string,address)',
  1427009269: '(string,uint,bool,uint)',
  1993105508: '(string,uint,bool,string)',
  3816813520: '(string,uint,bool,bool)',
  3847527825: '(string,uint,bool,address)',
  1481210622: '(string,uint,address,uint)',
  844415720: '(string,uint,address,string)',
  285649143: '(string,uint,address,bool)',
  3939013249: '(string,uint,address,address)',
  3587119056: '(string,string,uint,uint)',
  2366909661: '(string,string,uint,string)',
  3864418506: '(string,string,uint,bool)',
  1565476480: '(string,string,uint,address)',
  2681211381: '(string,string,string,uint)',
  3731419658: '(string,string,string,string)',
  739726573: '(string,string,string,bool)',
  1834430276: '(string,string,string,address)',
  2256636538: '(string,string,bool,uint)',
  1585754346: '(string,string,bool,string)',
  1081628777: '(string,string,bool,bool)',
  3279013851: '(string,string,bool,address)',
  1250010474: '(string,string,address,uint)',
  3944480640: '(string,string,address,string)',
  1556958775: '(string,string,address,bool)',
  1134328815: '(string,string,address,address)',
  1572859960: '(string,bool,uint,uint)',
  1119461927: '(string,bool,uint,string)',
  1019590099: '(string,bool,uint,bool)',
  1909687565: '(string,bool,uint,address)',
  885731469: '(string,bool,string,uint)',
  2821114603: '(string,bool,string,string)',
  1066037277: '(string,bool,string,bool)',
  3764542249: '(string,bool,string,address)',
  2155164136: '(string,bool,bool,uint)',
  2636305885: '(string,bool,bool,string)',
  2304440517: '(string,bool,bool,bool)',
  1905304873: '(string,bool,bool,address)',
  685723286: '(string,bool,address,uint)',
  764294052: '(string,bool,address,string)',
  2508990662: '(string,bool,address,bool)',
  870964509: '(string,bool,address,address)',
  3668153533: '(string,address,uint,uint)',
  1280700980: '(string,address,uint,string)',
  1522647356: '(string,address,uint,bool)',
  2741431424: '(string,address,uint,address)',
  2405583849: '(string,address,string,uint)',
  609847026: '(string,address,string,string)',
  1595265676: '(string,address,string,bool)',
  2864486961: '(string,address,string,address)',
  3318856587: '(string,address,bool,uint)',
  72663161: '(string,address,bool,string)',
  2038975531: '(string,address,bool,bool)',
  573965245: '(string,address,bool,address)',
  1857524797: '(string,address,address,uint)',
  2148146279: '(string,address,address,string)',
  3047013728: '(string,address,address,bool)',
  3985582326: '(string,address,address,address)',
  853517604: '(bool,uint,uint,uint)',
  3657852616: '(bool,uint,uint,string)',
  2753397214: '(bool,uint,uint,bool)',
  4049711649: '(bool,uint,uint,address)',
  1098907931: '(bool,uint,string,uint)',
  3542771016: '(bool,uint,string,string)',
  2446522387: '(bool,uint,string,bool)',
  2781285673: '(bool,uint,string,address)',
  3554563475: '(bool,uint,bool,uint)',
  3067439572: '(bool,uint,bool,string)',
  2650928961: '(bool,uint,bool,bool)',
  1114097656: '(bool,uint,bool,address)',
  3399820138: '(bool,uint,address,uint)',
  403247937: '(bool,uint,address,string)',
  1705899016: '(bool,uint,address,bool)',
  2318373034: '(bool,uint,address,address)',
  2387273838: '(bool,string,uint,uint)',
  2007084013: '(bool,string,uint,string)',
  549177775: '(bool,string,uint,bool)',
  1529002296: '(bool,string,uint,address)',
  1574643090: '(bool,string,string,uint)',
  392356650: '(bool,string,string,string)',
  508266469: '(bool,string,string,bool)',
  2547225816: '(bool,string,string,address)',
  2372902053: '(bool,string,bool,uint)',
  1211958294: '(bool,string,bool,string)',
  3697185627: '(bool,string,bool,bool)',
  1401816747: '(bool,string,bool,address)',
  453743963: '(bool,string,address,uint)',
  316065672: '(bool,string,address,string)',
  1842623690: '(bool,string,address,bool)',
  724244700: '(bool,string,address,address)',
  1181212302: '(bool,bool,uint,uint)',
  1348569399: '(bool,bool,uint,string)',
  2874982852: '(bool,bool,uint,bool)',
  201299213: '(bool,bool,uint,address)',
  395003525: '(bool,bool,string,uint)',
  1830717265: '(bool,bool,string,string)',
  3092715066: '(bool,bool,string,bool)',
  4188875657: '(bool,bool,string,address)',
  3259532109: '(bool,bool,bool,uint)',
  719587540: '(bool,bool,bool,string)',
  992632032: '(bool,bool,bool,bool)',
  2352126746: '(bool,bool,bool,address)',
  1620281063: '(bool,bool,address,uint)',
  2695133539: '(bool,bool,address,string)',
  3231908568: '(bool,bool,address,bool)',
  4102557348: '(bool,bool,address,address)',
  2617143996: '(bool,address,uint,uint)',
  2691192883: '(bool,address,uint,string)',
  4002252402: '(bool,address,uint,bool)',
  1760647349: '(bool,address,uint,address)',
  194640930: '(bool,address,string,uint)',
  2805734838: '(bool,address,string,string)',
  3804222987: '(bool,address,string,bool)',
  1870422078: '(bool,address,string,address)',
  1287000017: '(bool,address,bool,uint)',
  1248250676: '(bool,address,bool,string)',
  1788626827: '(bool,address,bool,bool)',
  474063670: '(bool,address,bool,address)',
  1384430956: '(bool,address,address,uint)',
  3625099623: '(bool,address,address,string)',
  1180699616: '(bool,address,address,bool)',
  487903233: '(bool,address,address,address)',
  1024368100: '(address,uint,uint,uint)',
  2301889963: '(address,uint,uint,string)',
  3964381346: '(address,uint,uint,bool)',
  519451700: '(address,uint,uint,address)',
  4111650715: '(address,uint,string,uint)',
  2119616147: '(address,uint,string,string)',
  2751614737: '(address,uint,string,bool)',
  3698927108: '(address,uint,string,address)',
  1770996626: '(address,uint,bool,uint)',
  2391690869: '(address,uint,bool,string)',
  4272018778: '(address,uint,bool,bool)',
  602229106: '(address,uint,bool,address)',
  2782496616: '(address,uint,address,uint)',
  1567749022: '(address,uint,address,string)',
  4051804649: '(address,uint,address,bool)',
  3961816175: '(address,uint,address,address)',
  2764647008: '(address,string,uint,uint)',
  1561552329: '(address,string,uint,string)',
  2116357467: '(address,string,uint,bool)',
  3755464715: '(address,string,uint,address)',
  2706362425: '(address,string,string,uint)',
  1560462603: '(address,string,string,string)',
  900007711: '(address,string,string,bool)',
  2689478535: '(address,string,string,address)',
  3877655068: '(address,string,bool,uint)',
  3154862590: '(address,string,bool,string)',
  1595759775: '(address,string,bool,bool)',
  542667202: '(address,string,bool,address)',
  2350461865: '(address,string,address,uint)',
  4158874181: '(address,string,address,string)',
  233909110: '(address,string,address,bool)',
  221706784: '(address,string,address,address)',
  3255869470: '(address,bool,uint,uint)',
  2606272204: '(address,bool,uint,string)',
  2244855215: '(address,bool,uint,bool)',
  227337758: '(address,bool,uint,address)',
  2652011374: '(address,bool,string,uint)',
  1197235251: '(address,bool,string,string)',
  1353532957: '(address,bool,string,bool)',
  436029782: '(address,bool,string,address)',
  3484780374: '(address,bool,bool,uint)',
  3754205928: '(address,bool,bool,string)',
  3401856121: '(address,bool,bool,bool)',
  3476636805: '(address,bool,bool,address)',
  3698398930: '(address,bool,address,uint)',
  769095910: '(address,bool,address,string)',
  2801077007: '(address,bool,address,bool)',
  1711502813: '(address,bool,address,address)',
  1425929188: '(address,address,uint,uint)',
  2647731885: '(address,address,uint,string)',
  3270936812: '(address,address,uint,bool)',
  3603321462: '(address,address,uint,address)',
  69767936: '(address,address,string,uint)',
  566079269: '(address,address,string,string)',
  1863997774: '(address,address,string,bool)',
  2406706454: '(address,address,string,address)',
  2513854225: '(address,address,bool,uint)',
  2858762440: '(address,address,bool,string)',
  752096074: '(address,address,bool,bool)',
  2669396846: '(address,address,bool,address)',
  3982404743: '(address,address,address,uint)',
  4161329696: '(address,address,address,string)',
  238520724: '(address,address,address,bool)',
  1717301556: '(address,address,address,address)'
};

/***/ }),

/***/ "../../../dist/libs/remix-lib/src/helpers/txResultHelper.js":
/*!**********************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-lib/src/helpers/txResultHelper.js ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resultToRemixTx = void 0;

const ethereumjs_util_1 = __webpack_require__(/*! ethereumjs-util */ "../../../node_modules/ethereumjs-util/dist.browser/index.js");

const ethjs_util_1 = __webpack_require__(/*! ethjs-util */ "../../../node_modules/ethjs-util/lib/index.js");

function convertToPrefixedHex(input) {
  if (input === undefined || input === null || (0, ethjs_util_1.isHexString)(input)) {
    return input;
  } else if (Buffer.isBuffer(input)) {
    return (0, ethereumjs_util_1.bufferToHex)(input);
  }

  return '0x' + input.toString(16);
}
/*
 txResult.result can be 3 different things:
 - VM call or tx: ethereumjs-vm result object
 - Node transaction: object returned from eth.getTransactionReceipt()
 - Node call: return value from function call (not an object)

 Also, VM results use BN and Buffers, Node results use hex strings/ints,
 So we need to normalize the values to prefixed hex strings
*/


function resultToRemixTx(txResult, execResult) {
  const {
    receipt,
    transactionHash,
    result
  } = txResult;
  const {
    status,
    gasUsed,
    contractAddress
  } = receipt;
  let returnValue, errorMessage;

  if ((0, ethjs_util_1.isHexString)(result)) {
    returnValue = result;
  } else if (execResult !== undefined) {
    returnValue = execResult.returnValue;
    errorMessage = execResult.exceptionError;
  }

  return {
    transactionHash,
    status,
    gasUsed: convertToPrefixedHex(gasUsed),
    error: errorMessage,
    return: convertToPrefixedHex(returnValue),
    createdAddress: convertToPrefixedHex(contractAddress)
  };
}

exports.resultToRemixTx = resultToRemixTx;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../node_modules/node-libs-browser/node_modules/buffer/index.js */ "../../../node_modules/node-libs-browser/node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "../../../dist/libs/remix-lib/src/helpers/uiHelper.js":
/*!****************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-lib/src/helpers/uiHelper.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runInBrowser = exports.normalizeHexAddress = exports.normalizeHex = exports.formatCss = exports.tryConvertAsciiFormat = exports.formatMemory = void 0;

function formatMemory(mem, width) {
  const ret = {};

  if (!mem) {
    return ret;
  }

  if (!mem.substr) {
    mem = mem.join(''); // geth returns an array, eth return raw string
  }

  for (let k = 0; k < mem.length; k += width * 2) {
    const memory = mem.substr(k, width * 2);
    const content = tryConvertAsciiFormat(memory);
    ret['0x' + (k / 2).toString(16)] = content.raw + '\t' + content.ascii;
  }

  return ret;
}

exports.formatMemory = formatMemory;

function tryConvertAsciiFormat(memorySlot) {
  const ret = {
    ascii: '',
    raw: ''
  };

  for (let k = 0; k < memorySlot.length; k += 2) {
    const raw = memorySlot.substr(k, 2);
    let ascii = String.fromCharCode(parseInt(raw, 16));
    ascii = ascii.replace(/[^\w\s]/, '?');

    if (ascii === '') {
      ascii = '?';
    }

    ret.ascii += ascii;
    ret.raw += raw;
  }

  return ret;
}

exports.tryConvertAsciiFormat = tryConvertAsciiFormat;
/**
 * format @args css1, css2, css3 to css inline style
 *
 * @param {Object} css1 - css inline declaration
 * @param {Object} css2 - css inline declaration
 * @param {Object} css3 - css inline declaration
 * @param {Object} ...
 * @return {String} css inline style
 *                  if the key start with * the value is direcly appended to the inline style (which should be already inline style formatted)
 *                  used if multiple occurences of the same key is needed
 */

function formatCss(css1, css2) {
  let ret = '';

  for (const arg in arguments) {
    for (const k in arguments[arg]) {
      if (arguments[arg][k] && ret.indexOf(k) === -1) {
        if (k.indexOf('*') === 0) {
          ret += arguments[arg][k];
        } else {
          ret += k + ':' + arguments[arg][k] + ';';
        }
      }
    }
  }

  return ret;
}

exports.formatCss = formatCss;

function normalizeHex(hex) {
  if (hex.indexOf('0x') === 0) {
    hex = hex.replace('0x', '');
  }

  hex = hex.replace(/^0+/, '');
  return '0x' + hex;
}

exports.normalizeHex = normalizeHex;

function normalizeHexAddress(hex) {
  if (hex.indexOf('0x') === 0) hex = hex.replace('0x', '');

  if (hex.length >= 40) {
    const reg = /(.{40})$/.exec(hex);

    if (reg) {
      return '0x' + reg[0];
    }
  } else {
    return '0x' + new Array(40 - hex.length + 1).join('0') + hex;
  }
}

exports.normalizeHexAddress = normalizeHexAddress;

function runInBrowser() {
  return typeof window !== 'undefined';
}

exports.runInBrowser = runInBrowser;

/***/ }),

/***/ "../../../dist/libs/remix-lib/src/index.js":
/*!*****************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-lib/src/index.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execution = exports.util = exports.Storage = exports.vm = exports.helpers = exports.EventManager = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const eventManager_1 = __webpack_require__(/*! ./eventManager */ "../../../dist/libs/remix-lib/src/eventManager.js");

Object.defineProperty(exports, "EventManager", {
  enumerable: true,
  get: function () {
    return eventManager_1.EventManager;
  }
});
const uiHelper = (0, tslib_1.__importStar)(__webpack_require__(/*! ./helpers/uiHelper */ "../../../dist/libs/remix-lib/src/helpers/uiHelper.js"));
const compilerHelper = (0, tslib_1.__importStar)(__webpack_require__(/*! ./helpers/compilerHelper */ "../../../dist/libs/remix-lib/src/helpers/compilerHelper.js"));
const util = (0, tslib_1.__importStar)(__webpack_require__(/*! ./util */ "../../../dist/libs/remix-lib/src/util.js"));
exports.util = util;

const web3Providers_1 = __webpack_require__(/*! ./web3Provider/web3Providers */ "../../../dist/libs/remix-lib/src/web3Provider/web3Providers.js");

const dummyProvider_1 = __webpack_require__(/*! ./web3Provider/dummyProvider */ "../../../dist/libs/remix-lib/src/web3Provider/dummyProvider.js");

const web3VmProvider_1 = __webpack_require__(/*! ./web3Provider/web3VmProvider */ "../../../dist/libs/remix-lib/src/web3Provider/web3VmProvider.js");

const storage_1 = __webpack_require__(/*! ./storage */ "../../../dist/libs/remix-lib/src/storage.js");

Object.defineProperty(exports, "Storage", {
  enumerable: true,
  get: function () {
    return storage_1.Storage;
  }
});

const eventsDecoder_1 = __webpack_require__(/*! ./execution/eventsDecoder */ "../../../dist/libs/remix-lib/src/execution/eventsDecoder.js");

const txExecution = (0, tslib_1.__importStar)(__webpack_require__(/*! ./execution/txExecution */ "../../../dist/libs/remix-lib/src/execution/txExecution.js"));
const txHelper = (0, tslib_1.__importStar)(__webpack_require__(/*! ./execution/txHelper */ "../../../dist/libs/remix-lib/src/execution/txHelper.js"));
const txFormat = (0, tslib_1.__importStar)(__webpack_require__(/*! ./execution/txFormat */ "../../../dist/libs/remix-lib/src/execution/txFormat.js"));

const txListener_1 = __webpack_require__(/*! ./execution/txListener */ "../../../dist/libs/remix-lib/src/execution/txListener.js");

const txRunner_1 = __webpack_require__(/*! ./execution/txRunner */ "../../../dist/libs/remix-lib/src/execution/txRunner.js");

const logsManager_1 = __webpack_require__(/*! ./execution/logsManager */ "../../../dist/libs/remix-lib/src/execution/logsManager.js");

const forkAt_1 = __webpack_require__(/*! ./execution/forkAt */ "../../../dist/libs/remix-lib/src/execution/forkAt.js");

const typeConversion = (0, tslib_1.__importStar)(__webpack_require__(/*! ./execution/typeConversion */ "../../../dist/libs/remix-lib/src/execution/typeConversion.js"));

const txRunnerVM_1 = __webpack_require__(/*! ./execution/txRunnerVM */ "../../../dist/libs/remix-lib/src/execution/txRunnerVM.js");

const txRunnerWeb3_1 = __webpack_require__(/*! ./execution/txRunnerWeb3 */ "../../../dist/libs/remix-lib/src/execution/txRunnerWeb3.js");

const txResultHelper = (0, tslib_1.__importStar)(__webpack_require__(/*! ./helpers/txResultHelper */ "../../../dist/libs/remix-lib/src/helpers/txResultHelper.js"));
const helpers = {
  ui: uiHelper,
  compiler: compilerHelper,
  txResultHelper
};
exports.helpers = helpers;
const vm = {
  Web3Providers: web3Providers_1.Web3Providers,
  DummyProvider: dummyProvider_1.DummyProvider,
  Web3VMProvider: web3VmProvider_1.Web3VmProvider
};
exports.vm = vm;
const execution = {
  EventsDecoder: eventsDecoder_1.EventsDecoder,
  txExecution: txExecution,
  txHelper: txHelper,
  txFormat: txFormat,
  txListener: txListener_1.TxListener,
  TxRunner: txRunner_1.TxRunner,
  TxRunnerWeb3: txRunnerWeb3_1.TxRunnerWeb3,
  TxRunnerVM: txRunnerVM_1.TxRunnerVM,
  typeConversion: typeConversion,
  LogsManager: logsManager_1.LogsManager,
  forkAt: forkAt_1.forkAt
};
exports.execution = execution;

/***/ }),

/***/ "../../../dist/libs/remix-lib/src/init.js":
/*!****************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-lib/src/init.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extend = exports.extendWeb3 = exports.loadWeb3 = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const web3_1 = (0, tslib_1.__importDefault)(__webpack_require__(/*! web3 */ "../../../node_modules/web3/lib/index.js"));

function loadWeb3(url = 'http://localhost:8545') {
  const web3 = new web3_1.default();
  web3.setProvider(new web3_1.default.providers.HttpProvider(url));
  extend(web3);
  return web3;
}

exports.loadWeb3 = loadWeb3;

function extendWeb3(web3) {
  extend(web3);
}

exports.extendWeb3 = extendWeb3;

function extend(web3) {
  if (!web3.extend) {
    return;
  } // DEBUG


  const methods = [];

  if (!(web3.debug && web3.debug.preimage)) {
    methods.push(new web3.extend.Method({
      name: 'preimage',
      call: 'debug_preimage',
      inputFormatter: [null],
      params: 1
    }));
  }

  if (!(web3.debug && web3.debug.traceTransaction)) {
    methods.push(new web3.extend.Method({
      name: 'traceTransaction',
      call: 'debug_traceTransaction',
      inputFormatter: [null, null],
      params: 2
    }));
  }

  if (!(web3.debug && web3.debug.storageRangeAt)) {
    methods.push(new web3.extend.Method({
      name: 'storageRangeAt',
      call: 'debug_storageRangeAt',
      inputFormatter: [null, null, null, null, null],
      params: 5
    }));
  }

  if (methods.length > 0) {
    web3.extend({
      property: 'debug',
      methods: methods,
      properties: []
    });
  }
}

exports.extend = extend;

/***/ }),

/***/ "../../../dist/libs/remix-lib/src/storage.js":
/*!*******************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-lib/src/storage.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Storage = void 0;

class Storage {
  constructor(prefix) {
    this.prefix = prefix; // on startup, upgrade the old storage layout

    if (typeof window !== 'undefined') {
      this.safeKeys().forEach(function (name) {
        if (name.indexOf('sol-cache-file-', 0) === 0) {
          var content = window.localStorage.getItem(name);
          window.localStorage.setItem(name.replace(/^sol-cache-file-/, 'sol:'), content);
          window.localStorage.removeItem(name);
        }
      });
    } // remove obsolete key


    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('editor-size-cache');
    }
  }

  exists(name) {
    if (typeof window !== 'undefined') {
      return this.get(name) !== null;
    }
  }

  get(name) {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(this.prefix + name);
    }
  }

  set(name, content) {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(this.prefix + name, content);
      }
    } catch (exception) {
      return false;
    }

    return true;
  }

  remove(name) {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(this.prefix + name);
    }

    return true;
  }

  rename(originalName, newName) {
    const content = this.get(originalName);

    if (!this.set(newName, content)) {
      return false;
    }

    this.remove(originalName);
    return true;
  }

  safeKeys() {
    // NOTE: this is a workaround for some browsers
    if (typeof window !== 'undefined') {
      return Object.keys(window.localStorage).filter(function (item) {
        return item !== null && item !== undefined;
      });
    }

    return [];
  }

  keys() {
    return this.safeKeys() // filter any names not including the prefix
    .filter(item => item.indexOf(this.prefix, 0) === 0) // remove prefix from filename and add the 'browser' path
    .map(item => item.substr(this.prefix.length));
  }

}

exports.Storage = Storage;

/***/ }),

/***/ "../../../dist/libs/remix-lib/src/util.js":
/*!****************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-lib/src/util.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.escapeRegExp = exports.concatWithSeperator = exports.groupBy = exports.compareByteCode = exports.extractSwarmHash = exports.extractcborMetadata = exports.cborEncodedValueExtraction = exports.swarmHashExtractionPOC32 = exports.swarmHashExtractionPOC31 = exports.swarmHashExtraction = exports.sha3_256 = exports.buildCallPath = exports.findCall = exports.findClosestIndex = exports.findLowerBoundValue = exports.findLowerBound = exports.formatMemory = exports.hexListFromBNs = exports.hexToIntArray = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const ethereumjs_util_1 = __webpack_require__(/*! ethereumjs-util */ "../../../node_modules/ethereumjs-util/dist.browser/index.js");

const string_similarity_1 = (0, tslib_1.__importDefault)(__webpack_require__(/*! string-similarity */ "../../../node_modules/string-similarity/src/index.js"));
/*
 contains misc util: @TODO should be splitted
  - hex conversion
  - binary search
  - CALL related look up
  - sha3 calculation
  - swarm hash extraction
  - bytecode comparison
*/

/*
    ints: IntArray
  */

/**
   * Converts a hex string to an array of integers.
   */

function hexToIntArray(hexString) {
  if (hexString.slice(0, 2) === '0x') {
    hexString = hexString.slice(2);
  }

  const integers = [];

  for (let i = 0; i < hexString.length; i += 2) {
    integers.push(parseInt(hexString.slice(i, i + 2), 16));
  }

  return integers;
}

exports.hexToIntArray = hexToIntArray;
/*
    ints: list of BNs
  */

function hexListFromBNs(bnList) {
  const ret = [];

  for (const k in bnList) {
    const v = bnList[k];

    if (ethereumjs_util_1.BN.isBN(v)) {
      ret.push('0x' + v.toString('hex', 64));
    } else {
      ret.push('0x' + new ethereumjs_util_1.BN(v).toString('hex', 64)); // TEMP FIX TO REMOVE ONCE https://github.com/ethereumjs/ethereumjs-vm/pull/293 is released
    }
  }

  return ret;
}

exports.hexListFromBNs = hexListFromBNs;
/*
  ints: ints: IntArray
*/

function formatMemory(mem) {
  const hexMem = (0, ethereumjs_util_1.bufferToHex)(mem).substr(2);
  const ret = [];

  for (let k = 0; k < hexMem.length; k += 32) {
    const row = hexMem.substr(k, 32);
    ret.push(row);
  }

  return ret;
}

exports.formatMemory = formatMemory;
/*
  Binary Search:
  Assumes that @arg array is sorted increasingly
  return largest i such that array[i] <= target; return -1 if array[0] > target || array is empty
*/

function findLowerBound(target, array) {
  let start = 0;
  let length = array.length;

  while (length > 0) {
    const half = length >> 1;
    const middle = start + half;

    if (array[middle] <= target) {
      length = length - 1 - half;
      start = middle + 1;
    } else {
      length = half;
    }
  }

  return start - 1;
}

exports.findLowerBound = findLowerBound;
/*
  Binary Search:
  Assumes that @arg array is sorted increasingly
  return largest array[i] such that array[i] <= target; return null if array[0] > target || array is empty
*/

function findLowerBoundValue(target, array) {
  const index = findLowerBound(target, array);
  return index >= 0 ? array[index] : null;
}

exports.findLowerBoundValue = findLowerBoundValue;
/*
  Binary Search:
  Assumes that @arg array is sorted increasingly
  return Return i such that |array[i] - target| is smallest among all i and -1 for an empty array.
  Returns the smallest i for multiple candidates.
*/

function findClosestIndex(target, array) {
  if (array.length === 0) {
    return -1;
  }

  const index = findLowerBound(target, array);

  if (index < 0) {
    return 0;
  } else if (index >= array.length - 1) {
    return array.length - 1;
  } else {
    const middle = (array[index] + array[index + 1]) / 2;
    return target <= middle ? index : index + 1;
  }
}

exports.findClosestIndex = findClosestIndex;
/**
  * Find the call from @args rootCall which contains @args index (recursive)
  *
  * @param {Int} index - index of the vmtrace
  * @param {Object} rootCall  - call tree, built by the trace analyser
  * @return {Object} - return the call which include the @args index
  */

function findCall(index, rootCall) {
  const ret = buildCallPath(index, rootCall);
  return ret[ret.length - 1];
}

exports.findCall = findCall;
/**
  * Find calls path from @args rootCall which leads to @args index (recursive)
  *
  * @param {Int} index - index of the vmtrace
  * @param {Object} rootCall  - call tree, built by the trace analyser
  * @return {Array} - return the calls path to @args index
  */

function buildCallPath(index, rootCall) {
  const ret = [];
  findCallInternal(index, rootCall, ret);
  return ret;
}

exports.buildCallPath = buildCallPath;
/**
  * sha3 the given @arg value (left pad to 32 bytes)
  *
  * @param {String} value - value to sha3
  * @return {Object} - return sha3ied value
  */
// eslint-disable-next-line camelcase

function sha3_256(value) {
  value = (0, ethereumjs_util_1.toBuffer)((0, ethereumjs_util_1.addHexPrefix)(value));
  const retInBuffer = (0, ethereumjs_util_1.keccak)((0, ethereumjs_util_1.setLengthLeft)(value, 32));
  return (0, ethereumjs_util_1.bufferToHex)(retInBuffer);
}

exports.sha3_256 = sha3_256;
/**
  * return a regex which extract the swarmhash from the bytecode.
  *
  * @return {RegEx}
  */

function swarmHashExtraction() {
  return /a165627a7a72305820([0-9a-f]{64})0029$/;
}

exports.swarmHashExtraction = swarmHashExtraction;
/**
  * return a regex which extract the swarmhash from the bytecode, from POC 0.3
  *
  * @return {RegEx}
  */

function swarmHashExtractionPOC31() {
  return /a265627a7a72315820([0-9a-f]{64})64736f6c6343([0-9a-f]{6})0032$/;
}

exports.swarmHashExtractionPOC31 = swarmHashExtractionPOC31;
/**
  * return a regex which extract the swarmhash from the bytecode, from POC 0.3
  *
  * @return {RegEx}
  */

function swarmHashExtractionPOC32() {
  return /a265627a7a72305820([0-9a-f]{64})64736f6c6343([0-9a-f]{6})0032$/;
}

exports.swarmHashExtractionPOC32 = swarmHashExtractionPOC32;
/**
  * return a regex which extract the cbor encoded metadata : {"ipfs": <IPFS hash>, "solc": <compiler version>} from the bytecode.
  * ref https://solidity.readthedocs.io/en/v0.6.6/metadata.html?highlight=ipfs#encoding-of-the-metadata-hash-in-the-bytecode
  * @return {RegEx}
  */

function cborEncodedValueExtraction() {
  return /64697066735822([0-9a-f]{68})64736f6c6343([0-9a-f]{6})0033$/;
}

exports.cborEncodedValueExtraction = cborEncodedValueExtraction;

function extractcborMetadata(value) {
  return value.replace(cborEncodedValueExtraction(), '');
}

exports.extractcborMetadata = extractcborMetadata;

function extractSwarmHash(value) {
  value = value.replace(swarmHashExtraction(), '');
  value = value.replace(swarmHashExtractionPOC31(), '');
  value = value.replace(swarmHashExtractionPOC32(), '');
  return value;
}

exports.extractSwarmHash = extractSwarmHash;
/**
  * Compare bytecode. return true if the code is equal (handle swarm hash and library references)
  * @param {String} code1 - the bytecode that is actually deployed (contains resolved library reference and a potentially different swarmhash)
  * @param {String} code2 - the bytecode generated by the compiler (contains unresolved library reference and a potentially different swarmhash)
                            this will return false if the generated bytecode is empty (asbtract contract cannot be deployed)
  *
  * @return {bool}
  */

function compareByteCode(code1, code2) {
  if (code1 === code2) return true;
  if (code2 === '0x') return false; // abstract contract. see comment

  if (code2.substr(2, 46) === '7300000000000000000000000000000000000000003014') {
    // testing the following signature: PUSH20 00..00 ADDRESS EQ
    // in the context of a library, that slot contains the address of the library (pushed by the compiler to avoid calling library other than with a DELEGATECALL)
    // if code2 is not a library, well we still suppose that the comparison remain relevant even if we remove some information from `code1`
    code1 = replaceLibReference(code1, 4);
  }

  let pos = -1;

  while ((pos = code2.search(/__(.*)__/)) !== -1) {
    code2 = replaceLibReference(code2, pos);
    code1 = replaceLibReference(code1, pos);
  }

  code1 = extractSwarmHash(code1);
  code1 = extractcborMetadata(code1);
  code2 = extractSwarmHash(code2);
  code2 = extractcborMetadata(code2);

  if (code1 && code2) {
    const compare = string_similarity_1.default.compareTwoStrings(code1, code2);
    return compare > 0.93;
  }

  return false;
}

exports.compareByteCode = compareByteCode;
/* util extracted out from remix-ide. @TODO split this file, cause it mix real util fn with solidity related stuff ... */

function groupBy(arr, key) {
  return arr.reduce((sum, item) => {
    const groupByVal = item[key];
    const groupedItems = sum[groupByVal] || [];
    groupedItems.push(item);
    sum[groupByVal] = groupedItems;
    return sum;
  }, {});
}

exports.groupBy = groupBy;

function concatWithSeperator(list, seperator) {
  return list.reduce((sum, item) => sum + item + seperator, '').slice(0, -seperator.length);
}

exports.concatWithSeperator = concatWithSeperator;

function escapeRegExp(str) {
  return str.replace(/[-[\]/{}()+?.\\^$|]/g, '\\$&');
}

exports.escapeRegExp = escapeRegExp;

function replaceLibReference(code, pos) {
  return code.substring(0, pos) + '0000000000000000000000000000000000000000' + code.substring(pos + 40);
}

function findCallInternal(index, rootCall, callsPath) {
  const calls = Object.keys(rootCall.calls);
  const ret = rootCall;
  callsPath.push(rootCall);

  for (const k in calls) {
    const subCall = rootCall.calls[calls[k]];

    if (index >= subCall.start && index <= subCall.return) {
      findCallInternal(index, subCall, callsPath);
      break;
    }
  }

  return ret;
}

/***/ }),

/***/ "../../../dist/libs/remix-lib/src/web3Provider/dummyProvider.js":
/*!**************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-lib/src/web3Provider/dummyProvider.js ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DummyProvider = void 0;

class DummyProvider {
  constructor() {
    this.eth = {};
    this.debug = {};

    this.eth.getCode = (address, cb) => {
      return this.getCode(address, cb);
    };

    this.eth.getTransaction = (hash, cb) => {
      return this.getTransaction(hash, cb);
    };

    this.eth.getTransactionFromBlock = (blockNumber, txIndex, cb) => {
      return this.getTransactionFromBlock(blockNumber, txIndex, cb);
    };

    this.eth.getBlockNumber = cb => {
      return this.getBlockNumber(cb);
    };

    this.debug.traceTransaction = (hash, options, cb) => {
      return this.traceTransaction(hash, options, cb);
    };

    this.debug.storageRangeAt = (blockNumber, txIndex, address, start, end, maxLength, cb) => {
      return this.storageRangeAt(blockNumber, txIndex, address, start, end, maxLength, cb);
    };

    this.providers = {
      HttpProvider: function (url) {}
    };
    this.currentProvider = {
      host: ''
    };
  }

  getCode(address, cb) {
    cb(null, '');
  }

  setProvider(provider) {}

  traceTransaction(txHash, options, cb) {
    if (cb) {
      cb(null, {});
    }

    return {};
  }

  storageRangeAt(blockNumber, txIndex, address, start, end, maxLength, cb) {
    if (cb) {
      cb(null, {});
    }

    return {};
  }

  getBlockNumber(cb) {
    cb(null, '');
  }

  getTransaction(txHash, cb) {
    if (cb) {
      cb(null, {});
    }

    return {};
  }

  getTransactionFromBlock(blockNumber, txIndex, cb) {
    if (cb) {
      cb(null, {});
    }

    return {};
  }

}

exports.DummyProvider = DummyProvider;

/***/ }),

/***/ "../../../dist/libs/remix-lib/src/web3Provider/web3Providers.js":
/*!**************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-lib/src/web3Provider/web3Providers.js ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Web3Providers = void 0;

const web3VmProvider_1 = __webpack_require__(/*! ./web3VmProvider */ "../../../dist/libs/remix-lib/src/web3Provider/web3VmProvider.js");

const init_1 = __webpack_require__(/*! ../init */ "../../../dist/libs/remix-lib/src/init.js");

class Web3Providers {
  constructor() {
    this.modes = {};
  }

  addProvider(type, obj) {
    if (type === 'INTERNAL') {
      const web3 = (0, init_1.loadWeb3)();
      this.addWeb3(type, web3);
    } else if (type === 'vm') {
      this.addVM(type, obj);
    } else {
      (0, init_1.extendWeb3)(obj);
      this.addWeb3(type, obj);
    }
  }

  get(type, cb) {
    if (this.modes[type]) {
      return cb(null, this.modes[type]);
    }

    cb('error: this provider has not been setup (' + type + ')', null);
  }

  addWeb3(type, web3) {
    this.modes[type] = web3;
  }

  addVM(type, vm) {
    const vmProvider = new web3VmProvider_1.Web3VmProvider();
    vmProvider.setVM(vm);
    this.modes[type] = vmProvider;
  }

}

exports.Web3Providers = Web3Providers;

/***/ }),

/***/ "../../../dist/libs/remix-lib/src/web3Provider/web3VmProvider.js":
/*!***************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/dist/libs/remix-lib/src/web3Provider/web3VmProvider.js ***!
  \***************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Web3VmProvider = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const util_1 = __webpack_require__(/*! ../util */ "../../../dist/libs/remix-lib/src/util.js");

const uiHelper_1 = __webpack_require__(/*! ../helpers/uiHelper */ "../../../dist/libs/remix-lib/src/helpers/uiHelper.js");

const hhconsoleSigs_1 = __webpack_require__(/*! ../helpers/hhconsoleSigs */ "../../../dist/libs/remix-lib/src/helpers/hhconsoleSigs.js");

const ethereumjs_util_1 = __webpack_require__(/*! ethereumjs-util */ "../../../node_modules/ethereumjs-util/dist.browser/index.js");

const web3_1 = (0, tslib_1.__importDefault)(__webpack_require__(/*! web3 */ "../../../node_modules/web3/lib/index.js"));

const ethers_1 = __webpack_require__(/*! ethers */ "../../../node_modules/ethers/lib.esm/index.js");

class Web3VmProvider {
  constructor() {
    this.web3 = new web3_1.default();
    this.vm = null;
    this.vmTraces = {};
    this.txs = {};
    this.txsReceipt = {};
    this.hhLogs = {};
    this.processingHash = null;
    this.processingAddress = null;
    this.processingIndex = null;
    this.previousDepth = 0;
    this.incr = 0;
    this.eth = {};
    this.debug = {};

    this.eth.getCode = (address, cb) => this.getCode(address, cb);

    this.eth.getTransaction = (txHash, cb) => this.getTransaction(txHash, cb);

    this.eth.getTransactionReceipt = (txHash, cb) => this.getTransactionReceipt(txHash, cb);

    this.eth.getTransactionFromBlock = (blockNumber, txIndex, cb) => this.getTransactionFromBlock(blockNumber, txIndex, cb);

    this.eth.getBlockNumber = cb => this.getBlockNumber(cb);

    this.debug.traceTransaction = (txHash, options, cb) => this.traceTransaction(txHash, options, cb);

    this.debug.storageRangeAt = (blockNumber, txIndex, address, start, maxLength, cb) => this.storageRangeAt(blockNumber, txIndex, address, start, maxLength, cb);

    this.debug.preimage = (hashedKey, cb) => this.preimage(hashedKey, cb);

    this.providers = {
      HttpProvider: function (url) {}
    };
    this.currentProvider = {
      host: 'vm provider'
    };
    this.storageCache = {};
    this.lastProcessedStorageTxHash = {};
    this.sha3Preimages = {}; // util

    this.sha3 = (...args) => this.web3.utils.sha3(...args);

    this.toHex = (...args) => this.web3.utils.toHex(...args);

    this.toAscii = (...args) => this.web3.utils.hexToAscii(...args);

    this.fromAscii = (...args) => this.web3.utils.asciiToHex(...args);

    this.fromDecimal = (...args) => this.web3.utils.numberToHex(...args);

    this.fromWei = (...args) => this.web3.utils.fromWei(...args);

    this.toWei = (...args) => this.web3.utils.toWei(...args);

    this.toBigNumber = (...args) => this.web3.utils.toBN(...args);

    this.isAddress = (...args) => this.web3.utils.isAddress(...args);

    this.utils = web3_1.default.utils || [];
    this.txsMapBlock = {};
    this.blocks = {};
    this.latestBlockNumber = 0;
  }

  setVM(vm) {
    if (this.vm === vm) return;
    this.vm = vm;
    this.vm.on('step', (data, next) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      yield this.pushTrace(data);
      next();
    }));
    this.vm.on('afterTx', (data, next) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      yield this.txProcessed(data);
      next();
    }));
    this.vm.on('beforeTx', (data, next) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      yield this.txWillProcess(data);
      next();
    }));
  }

  releaseCurrentHash() {
    const ret = this.processingHash;
    this.processingHash = undefined;
    return ret;
  }

  txWillProcess(data) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      this.incr++;
      this.processingHash = (0, ethereumjs_util_1.bufferToHex)(data.hash());
      this.vmTraces[this.processingHash] = {
        gas: '0x0',
        return: '0x0',
        structLogs: []
      };
      const tx = {};
      tx['hash'] = this.processingHash;
      tx['from'] = (0, ethereumjs_util_1.toChecksumAddress)(data.getSenderAddress().toString());

      if (data.to) {
        tx['to'] = (0, ethereumjs_util_1.toChecksumAddress)(data.to.toString());
      }

      this.processingAddress = tx['to'];
      tx['input'] = (0, ethereumjs_util_1.bufferToHex)(data.data);
      tx['gas'] = data.gasLimit.toString(10);

      if (data.value) {
        tx['value'] = data.value.toString(10);
      }

      this.txs[this.processingHash] = tx;
      this.txsReceipt[this.processingHash] = tx;
      this.storageCache[this.processingHash] = {};

      if (data.to) {
        try {
          const storage = yield this.vm.stateManager.dumpStorage(data.to);
          this.storageCache[this.processingHash][tx['to']] = storage;
          this.lastProcessedStorageTxHash[tx['to']] = this.processingHash;
        } catch (e) {
          console.log(e);
        }
      }

      this.processingIndex = 0;
    });
  }

  txProcessed(data) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      const lastOp = this.vmTraces[this.processingHash].structLogs[this.processingIndex - 1];

      if (lastOp) {
        lastOp.error = lastOp.op !== 'RETURN' && lastOp.op !== 'STOP' && lastOp.op !== 'DESTRUCT';
      }

      const gasUsed = '0x' + data.gasUsed.toString(16);
      this.vmTraces[this.processingHash].gas = gasUsed;
      this.txsReceipt[this.processingHash].gasUsed = gasUsed;
      const logs = [];

      for (const l in data.execResult.logs) {
        const log = data.execResult.logs[l];
        const topics = [];

        if (log[1].length > 0) {
          for (var k in log[1]) {
            topics.push('0x' + log[1][k].toString('hex'));
          }
        } else {
          topics.push('0x');
        }

        logs.push({
          address: '0x' + log[0].toString('hex'),
          data: '0x' + log[2].toString('hex'),
          topics: topics,
          rawVMResponse: log
        });
      }

      this.txsReceipt[this.processingHash].logs = logs;
      this.txsReceipt[this.processingHash].transactionHash = this.processingHash;
      const status = data.execResult.exceptionError ? 0 : 1;
      this.txsReceipt[this.processingHash].status = `0x${status}`;

      if (data.createdAddress) {
        const address = data.createdAddress.toString();
        this.vmTraces[this.processingHash].return = (0, ethereumjs_util_1.toChecksumAddress)(address);
        this.txsReceipt[this.processingHash].contractAddress = (0, ethereumjs_util_1.toChecksumAddress)(address);
      } else if (data.execResult.returnValue) {
        this.vmTraces[this.processingHash].return = (0, ethereumjs_util_1.bufferToHex)(data.execResult.returnValue);
      } else {
        this.vmTraces[this.processingHash].return = '0x';
      }

      this.processingIndex = null;
      this.processingAddress = null;
      this.previousDepth = 0;
    });
  }

  pushTrace(data) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
      const depth = data.depth + 1; // geth starts the depth from 1

      if (!this.processingHash) {
        console.log('no tx processing');
        return;
      }

      let previousopcode;

      if (this.vmTraces[this.processingHash] && this.vmTraces[this.processingHash].structLogs[this.processingIndex - 1]) {
        previousopcode = this.vmTraces[this.processingHash].structLogs[this.processingIndex - 1];
      }

      if (this.previousDepth > depth && previousopcode) {
        // returning from context, set error it is not STOP, RETURN
        previousopcode.invalidDepthChange = previousopcode.op !== 'RETURN' && previousopcode.op !== 'STOP';
      }

      const step = {
        stack: (0, util_1.hexListFromBNs)(data.stack),
        memory: (0, util_1.formatMemory)(data.memory),
        storage: data.storage,
        op: data.opcode.name,
        pc: data.pc,
        gasCost: data.opcode.fee.toString(),
        gas: data.gasLeft.toString(),
        depth: depth,
        error: data.error === false ? undefined : data.error
      };
      this.vmTraces[this.processingHash].structLogs.push(step); // Track hardhat console.log call

      if (step.op === 'STATICCALL' && step.stack[step.stack.length - 2] === '0x000000000000000000000000000000000000000000636f6e736f6c652e6c6f67') {
        const stackLength = step.stack.length;
        const payloadStart = parseInt(step.stack[stackLength - 3], 16);
        const memory = step.memory.join('');
        let payload = memory.substring(payloadStart * 2, memory.length);
        const fnselectorStr = payload.substring(0, 8);
        const fnselectorStrInHex = '0x' + fnselectorStr;
        const fnselector = parseInt(fnselectorStrInHex);
        const fnArgs = hhconsoleSigs_1.ConsoleLogs[fnselector];
        const iface = new ethers_1.ethers.utils.Interface([`function log${fnArgs} view`]);
        const functionDesc = iface.getFunction(`log${fnArgs}`);
        const sigHash = iface.getSighash(`log${fnArgs}`);

        if (fnArgs.includes('uint') && sigHash !== fnselectorStrInHex) {
          payload = payload.replace(fnselectorStr, sigHash);
        } else {
          payload = '0x' + payload;
        }

        const consoleArgs = iface.decodeFunctionData(functionDesc, payload);
        this.hhLogs[this.processingHash] = this.hhLogs[this.processingHash] ? this.hhLogs[this.processingHash] : [];
        this.hhLogs[this.processingHash].push(consoleArgs);
      }

      if (step.op === 'CREATE' || step.op === 'CALL') {
        if (step.op === 'CREATE') {
          this.processingAddress = '(Contract Creation - Step ' + this.processingIndex + ')';
          this.storageCache[this.processingHash][this.processingAddress] = {};
          this.lastProcessedStorageTxHash[this.processingAddress] = this.processingHash;
        } else {
          this.processingAddress = (0, uiHelper_1.normalizeHexAddress)(step.stack[step.stack.length - 2]);
          this.processingAddress = (0, ethereumjs_util_1.toChecksumAddress)(this.processingAddress);

          if (!this.storageCache[this.processingHash][this.processingAddress]) {
            const account = ethereumjs_util_1.Address.fromString(this.processingAddress);

            try {
              const storage = yield this.vm.stateManager.dumpStorage(account);
              this.storageCache[this.processingHash][this.processingAddress] = storage;
              this.lastProcessedStorageTxHash[this.processingAddress] = this.processingHash;
            } catch (e) {
              console.log(e);
            }
          }
        }
      }

      if (previousopcode && previousopcode.op === 'SHA3') {
        const preimage = this.getSha3Input(previousopcode.stack, previousopcode.memory);
        const imageHash = step.stack[step.stack.length - 1].replace('0x', '');
        this.sha3Preimages[imageHash] = {
          preimage: preimage
        };
      }

      this.processingIndex++;
      this.previousDepth = depth;
    });
  }

  getCode(address, cb) {
    address = (0, ethereumjs_util_1.toChecksumAddress)(address);
    this.vm.stateManager.getContractCode(ethereumjs_util_1.Address.fromString(address)).then(result => {
      cb(null, (0, ethereumjs_util_1.bufferToHex)(result));
    }).catch(error => {
      cb(error);
    });
  }

  setProvider(provider) {}

  traceTransaction(txHash, options, cb) {
    if (this.vmTraces[txHash]) {
      if (cb) {
        cb(null, this.vmTraces[txHash]);
      }

      return this.vmTraces[txHash];
    }

    if (cb) {
      cb('unable to retrieve traces ' + txHash, null);
    }
  }

  storageRangeAt(blockNumber, txIndex, address, start, maxLength, cb) {
    // we don't use the range params here
    address = (0, ethereumjs_util_1.toChecksumAddress)(address);

    if (txIndex === 'latest') {
      txIndex = this.lastProcessedStorageTxHash[address];
    }

    if (this.storageCache[txIndex] && this.storageCache[txIndex][address]) {
      const storage = this.storageCache[txIndex][address];
      return cb(null, {
        storage: JSON.parse(JSON.stringify(storage)),
        nextKey: null
      });
    } // Before https://github.com/ethereum/remix-project/pull/1703, it used to throw error as
    // 'unable to retrieve storage ' + txIndex + ' ' + address


    cb(null, {
      storage: {}
    });
  }

  getBlockNumber(cb) {
    cb(null, 'vm provider');
  }

  getTransaction(txHash, cb) {
    if (this.txs[txHash]) {
      if (cb) {
        cb(null, this.txs[txHash]);
      }

      return this.txs[txHash];
    }

    if (cb) {
      cb('unable to retrieve tx ' + txHash, null);
    }
  }

  getTransactionReceipt(txHash, cb) {
    // same as getTransaction but return the created address also
    if (this.txsReceipt[txHash]) {
      if (cb) {
        cb(null, this.txsReceipt[txHash]);
      }

      return this.txsReceipt[txHash];
    }

    if (cb) {
      cb('unable to retrieve txReceipt ' + txHash, null);
    }
  }

  getTransactionFromBlock(blockNumber, txIndex, cb) {
    const mes = 'not supposed to be needed by remix in vmmode';
    console.log(mes);

    if (cb) {
      cb(mes, null);
    }
  }

  preimage(hashedKey, cb) {
    hashedKey = hashedKey.replace('0x', '');
    cb(null, this.sha3Preimages[hashedKey] !== undefined ? this.sha3Preimages[hashedKey].preimage : null);
  }

  getSha3Input(stack, memory) {
    let memoryStart = stack[stack.length - 1];
    let memoryLength = stack[stack.length - 2];
    const memStartDec = new ethereumjs_util_1.BN(memoryStart.replace('0x', ''), 16).toString(10);
    memoryStart = parseInt(memStartDec) * 2;
    const memLengthDec = new ethereumjs_util_1.BN(memoryLength.replace('0x', ''), 16).toString(10);
    memoryLength = parseInt(memLengthDec) * 2;
    let i = Math.floor(memoryStart / 32);
    const maxIndex = Math.floor(memoryLength / 32) + i;

    if (!memory[i]) {
      return this.emptyFill(memoryLength);
    }

    let sha3Input = memory[i].slice(memoryStart - 32 * i);
    i++;

    while (i < maxIndex) {
      sha3Input += memory[i] ? memory[i] : this.emptyFill(32);
      i++;
    }

    if (sha3Input.length < memoryLength) {
      const leftSize = memoryLength - sha3Input.length;
      sha3Input += memory[i] ? memory[i].slice(0, leftSize) : this.emptyFill(leftSize);
    }

    return sha3Input;
  }

  emptyFill(size) {
    return new Array(size).join('0');
  }

}

exports.Web3VmProvider = Web3VmProvider;

/***/ }),

/***/ "../../../libs/remix-ui/clipboard/src/index.ts":
/*!*********************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/clipboard/src/index.ts ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _copyToClipboard = __webpack_require__(/*! ./lib/copy-to-clipboard/copy-to-clipboard */ "../../../libs/remix-ui/clipboard/src/lib/copy-to-clipboard/copy-to-clipboard.tsx");

Object.keys(_copyToClipboard).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _copyToClipboard[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _copyToClipboard[key];
    }
  });
});

/***/ }),

/***/ "../../../libs/remix-ui/clipboard/src/lib/copy-to-clipboard/copy-to-clipboard.css":
/*!********************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/clipboard/src/lib/copy-to-clipboard/copy-to-clipboard.css ***!
  \********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var content = __webpack_require__(/*! !../../../../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??ref--5-oneOf-4-2!./copy-to-clipboard.css */ "../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../node_modules/postcss-loader/dist/cjs.js?!../../../libs/remix-ui/clipboard/src/lib/copy-to-clipboard/copy-to-clipboard.css");

if (typeof content === 'string') {
  content = [[module.i, content, '']];
}

var options = {}

options.insert = "head";
options.singleton = false;

var update = __webpack_require__(/*! ../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js")(content, options);

if (content.locals) {
  module.exports = content.locals;
}


/***/ }),

/***/ "../../../libs/remix-ui/clipboard/src/lib/copy-to-clipboard/copy-to-clipboard.tsx":
/*!********************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/clipboard/src/lib/copy-to-clipboard/copy-to-clipboard.tsx ***!
  \********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CopyToClipboard = void 0;

var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty.js"));

var _objectWithoutProperties2 = _interopRequireDefault(__webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

var _copyToClipboard = _interopRequireDefault(__webpack_require__(/*! copy-to-clipboard */ "../../../node_modules/copy-to-clipboard/index.js"));

var _reactBootstrap = __webpack_require__(/*! react-bootstrap */ "../../../node_modules/react-bootstrap/esm/index.js");

__webpack_require__(/*! ./copy-to-clipboard.css */ "../../../libs/remix-ui/clipboard/src/lib/copy-to-clipboard/copy-to-clipboard.css");

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

const _excluded = ["content", "tip", "icon", "direction", "children"];
var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/clipboard/src/lib/copy-to-clipboard/copy-to-clipboard.tsx";

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const CopyToClipboard = props => {
  let {
    content,
    tip = 'Copy',
    icon = 'fa-copy',
    direction = 'right',
    children
  } = props,
      otherProps = (0, _objectWithoutProperties2.default)(props, _excluded);
  const [message, setMessage] = (0, _react.useState)(tip);

  const handleClick = e => {
    if (content && content !== '') {
      // module `copy` keeps last copied thing in the memory, so don't show tooltip if nothing is copied, because nothing was added to memory
      try {
        if (typeof content !== 'string') {
          content = JSON.stringify(content, null, '\t');
        }

        (0, _copyToClipboard.default)(content);
        setMessage('Copied');
      } catch (e) {
        console.error(e);
      }
    } else {
      setMessage('Cannot copy empty content!');
    }

    e.preventDefault();
    return false;
  };

  const reset = () => {
    setTimeout(() => setMessage('Copy'), 500);
  };

  return (
    /*#__PURE__*/
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    (0, _jsxDevRuntime.jsxDEV)("a", {
      href: "#",
      onClick: handleClick,
      onMouseLeave: reset,
      children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_reactBootstrap.OverlayTrigger, {
        placement: direction,
        overlay: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_reactBootstrap.Tooltip, {
          id: "overlay-tooltip",
          children: message
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 46,
          columnNumber: 9
        }, void 0),
        children: children || /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("i", _objectSpread({
          className: `far ${icon} ml-1 p-2`,
          "aria-hidden": "true"
        }, otherProps), void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 51,
          columnNumber: 24
        }, void 0)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 45,
        columnNumber: 7
      }, void 0)
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 44,
      columnNumber: 5
    }, void 0)
  );
};

exports.CopyToClipboard = CopyToClipboard;
var _default = CopyToClipboard;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/index.ts":
/*!***********************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/index.ts ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debuggerUi = __webpack_require__(/*! ./lib/debugger-ui */ "../../../libs/remix-ui/debugger-ui/src/lib/debugger-ui.tsx");

Object.keys(_debuggerUi).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _debuggerUi[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _debuggerUi[key];
    }
  });
});

var _idebuggerApi = __webpack_require__(/*! ./lib/idebugger-api */ "../../../libs/remix-ui/debugger-ui/src/lib/idebugger-api.ts");

Object.keys(_idebuggerApi).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _idebuggerApi[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _idebuggerApi[key];
    }
  });
});

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/button-navigator/button-navigator.css":
/*!********************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/button-navigator/button-navigator.css ***!
  \********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var content = __webpack_require__(/*! !../../../../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??ref--5-oneOf-4-2!./button-navigator.css */ "../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../node_modules/postcss-loader/dist/cjs.js?!../../../libs/remix-ui/debugger-ui/src/lib/button-navigator/button-navigator.css");

if (typeof content === 'string') {
  content = [[module.i, content, '']];
}

var options = {}

options.insert = "head";
options.singleton = false;

var update = __webpack_require__(/*! ../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js")(content, options);

if (content.locals) {
  module.exports = content.locals;
}


/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/button-navigator/button-navigator.tsx":
/*!********************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/button-navigator/button-navigator.tsx ***!
  \********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ButtonNavigation = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

__webpack_require__(/*! ./button-navigator.css */ "../../../libs/remix-ui/debugger-ui/src/lib/button-navigator/button-navigator.css");

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/button-navigator/button-navigator.tsx";

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const ButtonNavigation = ({
  stepOverBack,
  stepIntoBack,
  stepIntoForward,
  stepOverForward,
  jumpOut,
  jumpPreviousBreakpoint,
  jumpNextBreakpoint,
  jumpToException,
  revertedReason,
  stepState,
  jumpOutDisabled
}) => {
  const [state, setState] = (0, _react.useState)({
    intoBackDisabled: true,
    overBackDisabled: true,
    intoForwardDisabled: true,
    overForwardDisabled: true,
    jumpOutDisabled: true,
    jumpNextBreakpointDisabled: true,
    jumpPreviousBreakpointDisabled: true
  });
  (0, _react.useEffect)(() => {
    stepChanged(stepState, jumpOutDisabled);
  }, [stepState, jumpOutDisabled]);

  const reset = () => {
    setState(() => {
      return {
        intoBackDisabled: true,
        overBackDisabled: true,
        intoForwardDisabled: true,
        overForwardDisabled: true,
        jumpOutDisabled: true,
        jumpNextBreakpointDisabled: true,
        jumpPreviousBreakpointDisabled: true
      };
    });
  };

  const stepChanged = (stepState, jumpOutDisabled) => {
    if (stepState === 'invalid') {
      // TODO: probably not necessary, already implicit done in the next steps
      reset();
      return;
    }

    setState(() => {
      return {
        intoBackDisabled: stepState === 'initial',
        overBackDisabled: stepState === 'initial',
        jumpPreviousBreakpointDisabled: stepState === 'initial',
        intoForwardDisabled: stepState === 'end',
        overForwardDisabled: stepState === 'end',
        jumpNextBreakpointDisabled: stepState === 'end',
        jumpOutDisabled: jumpOutDisabled !== null && jumpOutDisabled !== undefined ? jumpOutDisabled : true
      };
    });
  };

  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
    className: "buttons",
    children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
      className: "stepButtons btn-group py-1",
      children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("button", {
        id: "overback",
        className: "btn btn-primary btn-sm navigator stepButton fas fa-reply",
        title: "Step over back",
        onClick: () => {
          stepOverBack && stepOverBack();
        },
        disabled: state.overBackDisabled
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 56,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("button", {
        id: "intoback",
        "data-id": "buttonNavigatorIntoBack",
        className: "btn btn-primary btn-sm navigator stepButton fas fa-level-up-alt",
        title: "Step back",
        onClick: () => {
          stepIntoBack && stepIntoBack();
        },
        disabled: state.intoBackDisabled
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 57,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("button", {
        id: "intoforward",
        "data-id": "buttonNavigatorIntoForward",
        className: "btn btn-primary btn-sm navigator stepButton fas fa-level-down-alt",
        title: "Step into",
        onClick: () => {
          stepIntoForward && stepIntoForward();
        },
        disabled: state.intoForwardDisabled
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 58,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("button", {
        id: "overforward",
        className: "btn btn-primary btn-sm navigator stepButton fas fa-share",
        title: "Step over forward",
        onClick: () => {
          stepOverForward && stepOverForward();
        },
        disabled: state.overForwardDisabled
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 59,
        columnNumber: 9
      }, void 0)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 55,
      columnNumber: 7
    }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
      className: "jumpButtons btn-group py-1",
      children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("button", {
        className: "btn btn-primary btn-sm navigator jumpButton fas fa-step-backward",
        id: "jumppreviousbreakpoint",
        "data-id": "buttonNavigatorJumpPreviousBreakpoint",
        title: "Jump to the previous breakpoint",
        onClick: () => {
          jumpPreviousBreakpoint && jumpPreviousBreakpoint();
        },
        disabled: state.jumpPreviousBreakpointDisabled
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 63,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("button", {
        className: "btn btn-primary btn-sm navigator jumpButton fas fa-eject",
        id: "jumpout",
        title: "Jump out",
        onClick: () => {
          jumpOut && jumpOut();
        },
        disabled: state.jumpOutDisabled
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 64,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("button", {
        className: "btn btn-primary btn-sm navigator jumpButton fas fa-step-forward",
        id: "jumpnextbreakpoint",
        "data-id": "buttonNavigatorJumpNextBreakpoint",
        title: "Jump to the next breakpoint",
        onClick: () => {
          jumpNextBreakpoint && jumpNextBreakpoint();
        },
        disabled: state.jumpNextBreakpointDisabled
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 65,
        columnNumber: 9
      }, void 0)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 62,
      columnNumber: 7
    }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
      id: "reverted",
      style: {
        display: revertedReason === '' ? 'none' : 'block'
      },
      children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("button", {
        id: "jumptoexception",
        title: "Jump to exception",
        className: "btn btn-danger btn-sm navigator button fas fa-exclamation-triangle",
        onClick: () => {
          jumpToException && jumpToException();
        },
        disabled: state.jumpOutDisabled
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 68,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("span", {
        children: "State changes made during this call will be reverted."
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 70,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("span", {
        id: "outofgas",
        style: {
          display: revertedReason === 'outofgas' ? 'inline' : 'none'
        },
        children: "This call will run out of gas."
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 71,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("span", {
        id: "parenthasthrown",
        style: {
          display: revertedReason === 'parenthasthrown' ? 'inline' : 'none'
        },
        children: "The parent call will throw an exception"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 72,
        columnNumber: 9
      }, void 0)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 67,
      columnNumber: 7
    }, void 0)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 54,
    columnNumber: 5
  }, void 0);
};

exports.ButtonNavigation = ButtonNavigation;
var _default = ButtonNavigation;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/debugger-ui.css":
/*!**********************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/debugger-ui.css ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var content = __webpack_require__(/*! !../../../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??ref--5-oneOf-4-2!./debugger-ui.css */ "../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../node_modules/postcss-loader/dist/cjs.js?!../../../libs/remix-ui/debugger-ui/src/lib/debugger-ui.css");

if (typeof content === 'string') {
  content = [[module.i, content, '']];
}

var options = {}

options.insert = "head";
options.singleton = false;

var update = __webpack_require__(/*! ../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js")(content, options);

if (content.locals) {
  module.exports = content.locals;
}


/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/debugger-ui.tsx":
/*!**********************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/debugger-ui.tsx ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DebuggerUI = void 0;

var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

var _txBrowser = _interopRequireDefault(__webpack_require__(/*! ./tx-browser/tx-browser */ "../../../libs/remix-ui/debugger-ui/src/lib/tx-browser/tx-browser.tsx"));

var _stepManager = _interopRequireDefault(__webpack_require__(/*! ./step-manager/step-manager */ "../../../libs/remix-ui/debugger-ui/src/lib/step-manager/step-manager.tsx"));

var _vmDebugger = _interopRequireDefault(__webpack_require__(/*! ./vm-debugger/vm-debugger */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/vm-debugger.tsx"));

var _vmDebuggerHead = _interopRequireDefault(__webpack_require__(/*! ./vm-debugger/vm-debugger-head */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/vm-debugger-head.tsx"));

var _remixDebug = __webpack_require__(/*! @remix-project/remix-debug */ "../../../dist/libs/remix-debug/src/index.js");

var _toaster = __webpack_require__(/*! @remix-ui/toaster */ "../../../libs/remix-ui/toaster/src/index.ts");

__webpack_require__(/*! ./debugger-ui.css */ "../../../libs/remix-ui/debugger-ui/src/lib/debugger-ui.css");

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/debugger-ui.tsx";

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const helper = __webpack_require__(/*! ../../../../../apps/remix-ide/src/lib/helper */ "../../remix-ide/src/lib/helper.js");

const _paq = window._paq = window._paq || [];

const DebuggerUI = props => {
  const debuggerModule = props.debuggerAPI;
  const [state, setState] = (0, _react.useState)({
    isActive: false,
    debugger: null,
    currentReceipt: {
      contractAddress: null,
      to: null
    },
    currentBlock: null,
    currentTransaction: null,
    blockNumber: null,
    txNumber: '',
    debugging: false,
    opt: {
      debugWithGeneratedSources: false,
      debugWithLocalNode: false
    },
    toastMessage: '',
    validationError: '',
    txNumberIsEmpty: true,
    isLocalNodeUsed: false
  });
  (0, _react.useEffect)(() => {
    return unLoad();
  }, []);
  debuggerModule.onDebugRequested((hash, web3) => {
    if (hash) debug(hash, web3);
  });
  debuggerModule.onRemoveHighlights(async () => {
    await debuggerModule.discardHighlight();
  });
  (0, _react.useEffect)(() => {
    const setEditor = () => {
      debuggerModule.onBreakpointCleared((fileName, row) => {
        if (state.debugger) state.debugger.breakPointManager.remove({
          fileName: fileName,
          row: row
        });
      });
      debuggerModule.onBreakpointAdded((fileName, row) => {
        if (state.debugger) state.debugger.breakPointManager.add({
          fileName: fileName,
          row: row
        });
      });
      debuggerModule.onEditorContentChanged(() => {
        if (state.debugger) unLoad();
      });
    };

    setEditor();

    const providerChanged = () => {
      debuggerModule.onEnvChanged(provider => {
        setState(prevState => {
          const isLocalNodeUsed = provider !== 'vm' && provider !== 'injected';
          return _objectSpread(_objectSpread({}, prevState), {}, {
            isLocalNodeUsed: isLocalNodeUsed
          });
        });
      });
    };

    providerChanged();
  }, [state.debugger]);

  const listenToEvents = (debuggerInstance, currentReceipt) => {
    if (!debuggerInstance) return;
    debuggerInstance.event.register('debuggerStatus', async isActive => {
      await debuggerModule.discardHighlight();
      setState(prevState => {
        return _objectSpread(_objectSpread({}, prevState), {}, {
          isActive
        });
      });
    });
    debuggerInstance.event.register('newSourceLocation', async (lineColumnPos, rawLocation, generatedSources, address) => {
      if (!lineColumnPos) return;
      const contracts = await debuggerModule.fetchContractAndCompile(address || currentReceipt.contractAddress || currentReceipt.to, currentReceipt);

      if (contracts) {
        let path = contracts.getSourceName(rawLocation.file);

        if (!path) {
          // check in generated sources
          for (const source of generatedSources) {
            if (source.id === rawLocation.file) {
              path = `browser/.debugger/generated-sources/${source.name}`;
              let content;

              try {
                content = await debuggerModule.getFile(path);
              } catch (e) {
                const message = 'Unable to fetch generated sources, the file probably doesn\'t exist yet.';
                console.log(message, ' ', e);
              }

              if (content !== source.contents) {
                await debuggerModule.setFile(path, source.contents);
              }

              break;
            }
          }
        }

        if (path) {
          await debuggerModule.discardHighlight();
          await debuggerModule.highlight(lineColumnPos, path);
        }
      }
    });
    debuggerInstance.event.register('debuggerUnloaded', () => unLoad());
  };

  const requestDebug = (blockNumber, txNumber, tx) => {
    startDebugging(blockNumber, txNumber, tx);
  };

  const updateTxNumberFlag = empty => {
    setState(prevState => {
      return _objectSpread(_objectSpread({}, prevState), {}, {
        txNumberIsEmpty: empty,
        validationError: ''
      });
    });
  };

  const unloadRequested = (blockNumber, txIndex, tx) => {
    unLoad();
  };

  const unLoad = () => {
    if (state.debugger) state.debugger.unload();
    setState(prevState => {
      return _objectSpread(_objectSpread({}, prevState), {}, {
        isActive: false,
        debugger: null,
        currentReceipt: {
          contractAddress: null,
          to: null
        },
        currentBlock: null,
        currentTransaction: null,
        blockNumber: null,
        ready: {
          vmDebugger: false,
          vmDebuggerHead: false
        },
        debugging: false
      });
    });
  };

  const startDebugging = async (blockNumber, txNumber, tx, optWeb3) => {
    if (state.debugger) unLoad();
    if (!txNumber) return;
    setState(prevState => {
      return _objectSpread(_objectSpread({}, prevState), {}, {
        txNumber: txNumber
      });
    });

    if (!helper.isValidHash(txNumber)) {
      setState(prevState => {
        return _objectSpread(_objectSpread({}, prevState), {}, {
          validationError: 'Invalid transaction hash.'
        });
      });
      return;
    }

    const web3 = optWeb3 || (state.opt.debugWithLocalNode ? await debuggerModule.web3() : await debuggerModule.getDebugWeb3());

    try {
      const networkId = await web3.eth.net.getId();

      _paq.push(['trackEvent', 'debugger', 'startDebugging', networkId]);

      if (networkId === 42) {
        setState(prevState => {
          return _objectSpread(_objectSpread({}, prevState), {}, {
            validationError: 'Unfortunately, the Kovan network is not supported.'
          });
        });
        return;
      }
    } catch (e) {
      console.error(e);
    }

    let currentReceipt;
    let currentBlock;
    let currentTransaction;

    try {
      currentReceipt = await web3.eth.getTransactionReceipt(txNumber);
      currentBlock = await web3.eth.getBlock(currentReceipt.blockHash);
      currentTransaction = await web3.eth.getTransaction(txNumber);
    } catch (e) {
      setState(prevState => {
        return _objectSpread(_objectSpread({}, prevState), {}, {
          validationError: e.message
        });
      });
      console.log(e.message);
    }

    const debuggerInstance = new _remixDebug.TransactionDebugger({
      web3,
      offsetToLineColumnConverter: debuggerModule.offsetToLineColumnConverter,
      compilationResult: async address => {
        try {
          const ret = await debuggerModule.fetchContractAndCompile(address, currentReceipt);
          return ret;
        } catch (e) {
          // debuggerModule.showMessage('Debugging error', 'Unable to fetch a transaction.')
          console.error(e);
        }

        return null;
      },
      debugWithGeneratedSources: state.opt.debugWithGeneratedSources
    });

    try {
      await debuggerInstance.debug(blockNumber, txNumber, tx, () => {
        listenToEvents(debuggerInstance, currentReceipt);
        setState(prevState => {
          return _objectSpread(_objectSpread({}, prevState), {}, {
            blockNumber,
            txNumber,
            debugging: true,
            currentReceipt,
            currentBlock,
            currentTransaction,
            debugger: debuggerInstance,
            toastMessage: `debugging ${txNumber}`,
            validationError: ''
          });
        });
      });
    } catch (error) {
      unLoad();
      setState(prevState => {
        return _objectSpread(_objectSpread({}, prevState), {}, {
          validationError: error.message || error
        });
      });
    }
  };

  const debug = (txHash, web3) => {
    setState(prevState => {
      return _objectSpread(_objectSpread({}, prevState), {}, {
        validationError: '',
        txNumber: txHash
      });
    });
    startDebugging(null, txHash, null, web3);
  };

  const stepManager = {
    jumpTo: state.debugger && state.debugger.step_manager ? state.debugger.step_manager.jumpTo.bind(state.debugger.step_manager) : null,
    stepOverBack: state.debugger && state.debugger.step_manager ? state.debugger.step_manager.stepOverBack.bind(state.debugger.step_manager) : null,
    stepIntoBack: state.debugger && state.debugger.step_manager ? state.debugger.step_manager.stepIntoBack.bind(state.debugger.step_manager) : null,
    stepIntoForward: state.debugger && state.debugger.step_manager ? state.debugger.step_manager.stepIntoForward.bind(state.debugger.step_manager) : null,
    stepOverForward: state.debugger && state.debugger.step_manager ? state.debugger.step_manager.stepOverForward.bind(state.debugger.step_manager) : null,
    jumpOut: state.debugger && state.debugger.step_manager ? state.debugger.step_manager.jumpOut.bind(state.debugger.step_manager) : null,
    jumpPreviousBreakpoint: state.debugger && state.debugger.step_manager ? state.debugger.step_manager.jumpPreviousBreakpoint.bind(state.debugger.step_manager) : null,
    jumpNextBreakpoint: state.debugger && state.debugger.step_manager ? state.debugger.step_manager.jumpNextBreakpoint.bind(state.debugger.step_manager) : null,
    jumpToException: state.debugger && state.debugger.step_manager ? state.debugger.step_manager.jumpToException.bind(state.debugger.step_manager) : null,
    traceLength: state.debugger && state.debugger.step_manager ? state.debugger.step_manager.traceLength : null,
    registerEvent: state.debugger && state.debugger.step_manager ? state.debugger.step_manager.event.register.bind(state.debugger.step_manager.event) : null
  };
  const vmDebugger = {
    registerEvent: state.debugger && state.debugger.vmDebuggerLogic ? state.debugger.vmDebuggerLogic.event.register.bind(state.debugger.vmDebuggerLogic.event) : null,
    triggerEvent: state.debugger && state.debugger.vmDebuggerLogic ? state.debugger.vmDebuggerLogic.event.trigger.bind(state.debugger.vmDebuggerLogic.event) : null
  };
  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
    children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_toaster.Toaster, {
      message: state.toastMessage
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 292,
      columnNumber: 7
    }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
      className: "px-2",
      children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
        children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("p", {
          className: "my-2 debuggerLabel",
          children: "Debugger Configuration"
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 295,
          columnNumber: 11
        }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
          className: "mt-2 mb-2 debuggerConfig custom-control custom-checkbox",
          children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("input", {
            className: "custom-control-input",
            id: "debugGeneratedSourcesInput",
            onChange: ({
              target: {
                checked
              }
            }) => {
              setState(prevState => {
                return _objectSpread(_objectSpread({}, prevState), {}, {
                  opt: _objectSpread(_objectSpread({}, prevState.opt), {}, {
                    debugWithGeneratedSources: checked
                  })
                });
              });
            },
            type: "checkbox",
            title: "Debug with generated sources"
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 297,
            columnNumber: 13
          }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("label", {
            "data-id": "debugGeneratedSourcesLabel",
            className: "form-check-label custom-control-label",
            htmlFor: "debugGeneratedSourcesInput",
            children: "Use generated sources (from Solidity v0.7.2)"
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 302,
            columnNumber: 13
          }, void 0)]
        }, void 0, true, {
          fileName: _jsxFileName,
          lineNumber: 296,
          columnNumber: 11
        }, void 0), state.isLocalNodeUsed && /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
          className: "mt-2 mb-2 debuggerConfig custom-control custom-checkbox",
          children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("input", {
            className: "custom-control-input",
            id: "debugWithLocalNodeInput",
            onChange: ({
              target: {
                checked
              }
            }) => {
              setState(prevState => {
                return _objectSpread(_objectSpread({}, prevState), {}, {
                  opt: _objectSpread(_objectSpread({}, prevState.opt), {}, {
                    debugWithLocalNode: checked
                  })
                });
              });
            },
            type: "checkbox",
            title: "Force the debugger to use the current local node"
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 305,
            columnNumber: 13
          }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("label", {
            "data-id": "debugLocaNodeLabel",
            className: "form-check-label custom-control-label",
            htmlFor: "debugWithLocalNodeInput",
            children: "Force using local node"
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 310,
            columnNumber: 13
          }, void 0)]
        }, void 0, true, {
          fileName: _jsxFileName,
          lineNumber: 304,
          columnNumber: 38
        }, void 0), state.validationError && /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("span", {
          className: "w-100 py-1 text-danger validationError",
          children: state.validationError
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 313,
          columnNumber: 38
        }, void 0)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 294,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_txBrowser.default, {
        requestDebug: requestDebug,
        unloadRequested: unloadRequested,
        updateTxNumberFlag: updateTxNumberFlag,
        transactionNumber: state.txNumber,
        debugging: state.debugging
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 315,
        columnNumber: 9
      }, void 0), state.debugging && /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_stepManager.default, {
        stepManager: stepManager
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 316,
        columnNumber: 30
      }, void 0), state.debugging && /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_vmDebuggerHead.default, {
        vmDebugger: vmDebugger
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 317,
        columnNumber: 30
      }, void 0)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 293,
      columnNumber: 7
    }, void 0), state.debugging && /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_vmDebugger.default, {
      vmDebugger: vmDebugger,
      currentBlock: state.currentBlock,
      currentReceipt: state.currentReceipt,
      currentTransaction: state.currentTransaction
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 319,
      columnNumber: 28
    }, void 0)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 291,
    columnNumber: 5
  }, void 0);
};

exports.DebuggerUI = DebuggerUI;
var _default = DebuggerUI;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/idebugger-api.ts":
/*!***********************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/idebugger-api.ts ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/slider/slider.tsx":
/*!************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/slider/slider.tsx ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Slider = void 0;

var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/slider/slider.tsx";

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// eslint-disable-line
const Slider = ({
  jumpTo,
  sliderValue,
  traceLength
}) => {
  const [state, setState] = (0, _react.useState)({
    currentValue: 0
  });
  (0, _react.useEffect)(() => {
    setValue(sliderValue);
  }, [sliderValue]);

  const setValue = value => {
    if (value === state.currentValue) return;
    setState(prevState => {
      return _objectSpread(_objectSpread({}, prevState), {}, {
        currentValue: value
      });
    });
    jumpTo && jumpTo(value);
  };

  const handleChange = e => {
    const value = parseInt(e.target.value);
    setValue(value);
  };

  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
    children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("input", {
      id: "slider",
      "data-id": "slider",
      className: "w-100 my-0",
      type: "range",
      min: 0,
      max: traceLength ? traceLength - 1 : 0,
      value: state.currentValue,
      onChange: handleChange,
      disabled: traceLength ? traceLength === 0 : true
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 28,
      columnNumber: 7
    }, void 0)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 27,
    columnNumber: 5
  }, void 0);
};

exports.Slider = Slider;
var _default = Slider;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/step-manager/step-manager.tsx":
/*!************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/step-manager/step-manager.tsx ***!
  \************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.StepManager = void 0;

var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

var _slider = _interopRequireDefault(__webpack_require__(/*! ../slider/slider */ "../../../libs/remix-ui/debugger-ui/src/lib/slider/slider.tsx"));

var _buttonNavigator = _interopRequireDefault(__webpack_require__(/*! ../button-navigator/button-navigator */ "../../../libs/remix-ui/debugger-ui/src/lib/button-navigator/button-navigator.tsx"));

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/step-manager/step-manager.tsx";

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// eslint-disable-line
const StepManager = ({
  stepManager: {
    jumpTo,
    traceLength,
    stepIntoBack,
    stepIntoForward,
    stepOverBack,
    stepOverForward,
    jumpOut,
    jumpNextBreakpoint,
    jumpPreviousBreakpoint,
    jumpToException,
    registerEvent
  }
}) => {
  const [state, setState] = (0, _react.useState)({
    sliderValue: 0,
    revertWarning: '',
    stepState: '',
    jumpOutDisabled: true
  });
  (0, _react.useEffect)(() => {
    registerEvent && registerEvent('revertWarning', setRevertWarning);
    registerEvent && registerEvent('stepChanged', updateStep);
  }, [registerEvent]);

  const setRevertWarning = warning => {
    setState(prevState => {
      return _objectSpread(_objectSpread({}, prevState), {}, {
        revertWarning: warning
      });
    });
  };

  const updateStep = (step, stepState, jumpOutDisabled) => {
    setState(prevState => {
      return _objectSpread(_objectSpread({}, prevState), {}, {
        sliderValue: step,
        stepState,
        jumpOutDisabled
      });
    });
  };

  const {
    sliderValue,
    revertWarning,
    stepState,
    jumpOutDisabled
  } = state;
  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
    className: "py-1",
    children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_slider.default, {
      jumpTo: jumpTo,
      sliderValue: sliderValue,
      traceLength: traceLength
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 33,
      columnNumber: 7
    }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_buttonNavigator.default, {
      stepIntoBack: stepIntoBack,
      stepIntoForward: stepIntoForward,
      stepOverBack: stepOverBack,
      stepOverForward: stepOverForward,
      revertedReason: revertWarning,
      stepState: stepState,
      jumpOutDisabled: jumpOutDisabled,
      jumpOut: jumpOut,
      jumpNextBreakpoint: jumpNextBreakpoint,
      jumpPreviousBreakpoint: jumpPreviousBreakpoint,
      jumpToException: jumpToException
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 34,
      columnNumber: 7
    }, void 0)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 32,
    columnNumber: 5
  }, void 0);
};

exports.StepManager = StepManager;
var _default = StepManager;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/tx-browser/tx-browser.css":
/*!********************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/tx-browser/tx-browser.css ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var content = __webpack_require__(/*! !../../../../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??ref--5-oneOf-4-2!./tx-browser.css */ "../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../node_modules/postcss-loader/dist/cjs.js?!../../../libs/remix-ui/debugger-ui/src/lib/tx-browser/tx-browser.css");

if (typeof content === 'string') {
  content = [[module.i, content, '']];
}

var options = {}

options.insert = "head";
options.singleton = false;

var update = __webpack_require__(/*! ../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js")(content, options);

if (content.locals) {
  module.exports = content.locals;
}


/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/tx-browser/tx-browser.tsx":
/*!********************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/tx-browser/tx-browser.tsx ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TxBrowser = void 0;

var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

__webpack_require__(/*! ./tx-browser.css */ "../../../libs/remix-ui/debugger-ui/src/lib/tx-browser/tx-browser.css");

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/tx-browser/tx-browser.tsx";

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const TxBrowser = ({
  requestDebug,
  updateTxNumberFlag,
  unloadRequested,
  transactionNumber,
  debugging
}) => {
  const [state, setState] = (0, _react.useState)({
    txNumber: ''
  });
  const inputValue = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    setState(prevState => {
      return _objectSpread(_objectSpread({}, prevState), {}, {
        txNumber: transactionNumber
      });
    });
  }, [transactionNumber]);

  const handleSubmit = () => {
    if (debugging) {
      unload();
    } else {
      requestDebug(undefined, state.txNumber);
    }
  };

  const unload = () => {
    unloadRequested();
  };

  const txInputChanged = value => {
    // todo check validation of txnumber in the input element, use
    // required
    // oninvalid="setCustomValidity('Please provide a valid transaction number, must start with 0x and have length of 22')"
    // pattern="^0[x,X]+[0-9a-fA-F]{22}"
    // this.state.txNumberInput.setCustomValidity('')
    setState(prevState => {
      return _objectSpread(_objectSpread({}, prevState), {}, {
        txNumber: value
      });
    });
  };

  const txInputOnInput = () => {
    updateTxNumberFlag(!inputValue.current.value);
  };

  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
    className: "container px-0",
    children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
      className: "txContainer",
      children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
        className: "py-1 d-flex justify-content-center w-100 input-group",
        children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("input", {
          ref: inputValue,
          value: state.txNumber,
          className: "form-control m-0 txinput",
          id: "txinput",
          type: "text",
          onChange: ({
            target: {
              value
            }
          }) => txInputChanged(value),
          onInput: txInputOnInput,
          placeholder: 'Transaction hash, should start with 0x',
          "data-id": "debuggerTransactionInput",
          disabled: debugging
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 53,
          columnNumber: 11
        }, void 0)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 52,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
        className: "d-flex justify-content-center w-100 btn-group py-1",
        children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("button", {
          className: "btn btn-primary btn-sm txbutton",
          id: "load",
          title: debugging ? 'Stop debugging' : 'Start debugging',
          onClick: handleSubmit,
          "data-id": "debuggerTransactionStartButton",
          disabled: !state.txNumber,
          children: [debugging ? 'Stop' : 'Start', " debugging"]
        }, void 0, true, {
          fileName: _jsxFileName,
          lineNumber: 67,
          columnNumber: 11
        }, void 0)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 66,
        columnNumber: 9
      }, void 0)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 51,
      columnNumber: 7
    }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("span", {
      id: "error"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 79,
      columnNumber: 7
    }, void 0)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 50,
    columnNumber: 5
  }, void 0);
};

exports.TxBrowser = TxBrowser;
var _default = TxBrowser;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/assembly-items.tsx":
/*!*************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/assembly-items.tsx ***!
  \*************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.AssemblyItems = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

var _assemblyItems = __webpack_require__(/*! ../../reducers/assembly-items */ "../../../libs/remix-ui/debugger-ui/src/reducers/assembly-items.ts");

__webpack_require__(/*! ./styles/assembly-items.css */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/styles/assembly-items.css");

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/assembly-items.tsx";

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const AssemblyItems = ({
  registerEvent
}) => {
  const [assemblyItems, dispatch] = (0, _react.useReducer)(_assemblyItems.reducer, _assemblyItems.initialState);
  const [absoluteSelectedIndex, setAbsoluteSelectedIndex] = (0, _react.useState)(0);
  const [selectedItem, setSelectedItem] = (0, _react.useState)(0);
  const [nextSelectedItems, setNextSelectedItems] = (0, _react.useState)([1]);
  const [returnInstructionIndexes, setReturnInstructionIndexes] = (0, _react.useState)([]);
  const [outOfGasInstructionIndexes, setOutOfGasInstructionIndexes] = (0, _react.useState)([]);
  const refs = (0, _react.useRef)({});
  const asmItemsRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    registerEvent && registerEvent('codeManagerChanged', (code, address, index, nextIndexes, returnInstructionIndexes, outOfGasInstructionIndexes) => {
      dispatch({
        type: 'FETCH_OPCODES_SUCCESS',
        payload: {
          code,
          address,
          index,
          nextIndexes,
          returnInstructionIndexes,
          outOfGasInstructionIndexes
        }
      });
    });
  }, []);
  (0, _react.useEffect)(() => {
    if (absoluteSelectedIndex !== assemblyItems.index) {
      clearItems();
      indexChanged(assemblyItems.index);
      nextIndexesChanged(assemblyItems.nextIndexes);
      returnIndexes(assemblyItems.returnInstructionIndexes);
      outOfGasIndexes(assemblyItems.outOfGasInstructionIndexes);
    }
  }, [assemblyItems.opCodes.index]);

  const clearItem = currentItem => {
    if (currentItem) {
      currentItem.removeAttribute('selected');
      currentItem.removeAttribute('style');

      if (currentItem.firstChild) {
        currentItem.firstChild.removeAttribute('style');
      }
    }
  };

  const clearItems = () => {
    clearItem(refs.current[selectedItem] ? refs.current[selectedItem] : null);

    if (nextSelectedItems) {
      nextSelectedItems.map(index => {
        clearItem(refs.current[index] ? refs.current[index] : null);
      });
    }

    returnInstructionIndexes.map(index => {
      if (index < 0) return;
      clearItem(refs.current[index] ? refs.current[index] : null);
    });
    outOfGasInstructionIndexes.map(index => {
      if (index < 0) return;
      clearItem(refs.current[index] ? refs.current[index] : null);
    });
  };

  const indexChanged = index => {
    if (index < 0) return;
    const codeView = asmItemsRef.current;
    const currentItem = codeView.children[index];

    if (currentItem) {
      currentItem.style.setProperty('background-color', 'var(--primary)');
      currentItem.style.setProperty('color', 'var(--light)');
      currentItem.setAttribute('selected', 'selected');
      codeView.scrollTop = currentItem.offsetTop - parseInt(codeView.offsetTop);
    }

    setSelectedItem(index);
    setAbsoluteSelectedIndex(assemblyItems.opCodes.index);
  };

  const nextIndexesChanged = indexes => {
    indexes.map(index => {
      if (index < 0) return;
      const codeView = asmItemsRef.current;
      const currentItem = codeView.children[index];

      if (currentItem) {
        currentItem.style.setProperty('color', 'var(--primary)');
        currentItem.style.setProperty('font-weight', 'bold');
        currentItem.setAttribute('selected', 'selected');
      }
    });
    setNextSelectedItems(indexes);
  };

  const returnIndexes = indexes => {
    indexes.map(index => {
      if (index < 0) return;
      const codeView = asmItemsRef.current;
      const currentItem = codeView.children[index];

      if (currentItem) {
        currentItem.style.setProperty('border-style', 'dotted');
        currentItem.setAttribute('selected', 'selected');
      }
    });
    setReturnInstructionIndexes(indexes);
  };

  const outOfGasIndexes = indexes => {
    indexes.map(index => {
      if (index < 0) return;
      const codeView = asmItemsRef.current;
      const currentItem = codeView.children[index];

      if (currentItem) {
        currentItem.style.setProperty('border-color', 'var(--danger)');
        currentItem.style.setProperty('border-style', 'dotted');
        currentItem.setAttribute('selected', 'selected');
      }
    });
    setOutOfGasInstructionIndexes(indexes);
  };

  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
    className: "border rounded px-1 mt-1 bg-light",
    children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
      className: "dropdownpanel",
      children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
        className: "dropdowncontent",
        children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
          className: "pl-2 my-1 small instructions",
          id: "asmitems",
          ref: asmItemsRef,
          children: assemblyItems.display.map((item, i) => {
            return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
              className: "px-1",
              ref: ref => {
                refs.current[i] = ref;
              },
              children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("span", {
                children: item
              }, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 131,
                columnNumber: 93
              }, void 0)
            }, i, false, {
              fileName: _jsxFileName,
              lineNumber: 131,
              columnNumber: 24
            }, void 0);
          })
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 128,
          columnNumber: 11
        }, void 0)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 127,
        columnNumber: 9
      }, void 0)
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 126,
      columnNumber: 7
    }, void 0)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 125,
    columnNumber: 5
  }, void 0);
};

exports.AssemblyItems = AssemblyItems;
var _default = AssemblyItems;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/calldata-panel.tsx":
/*!*************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/calldata-panel.tsx ***!
  \*************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CalldataPanel = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

var _dropdownPanel = _interopRequireDefault(__webpack_require__(/*! ./dropdown-panel */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/dropdown-panel.tsx"));

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/calldata-panel.tsx";

// eslint-disable-line
const CalldataPanel = ({
  calldata
}) => {
  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
    id: "calldatapanel",
    children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_dropdownPanel.default, {
      dropdownName: "Call Data",
      calldata: calldata || {}
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 7,
      columnNumber: 7
    }, void 0)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 6,
    columnNumber: 5
  }, void 0);
};

exports.CalldataPanel = CalldataPanel;
var _default = CalldataPanel;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/callstack-panel.tsx":
/*!**************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/callstack-panel.tsx ***!
  \**************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CallstackPanel = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

var _dropdownPanel = _interopRequireDefault(__webpack_require__(/*! ./dropdown-panel */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/dropdown-panel.tsx"));

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/callstack-panel.tsx";

// eslint-disable-line
const CallstackPanel = ({
  calldata
}) => {
  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
    id: "callstackpanel",
    children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_dropdownPanel.default, {
      dropdownName: "Call Stack",
      calldata: calldata || {}
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 7,
      columnNumber: 7
    }, void 0)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 6,
    columnNumber: 5
  }, void 0);
};

exports.CallstackPanel = CallstackPanel;
var _default = CallstackPanel;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/code-list-view.tsx":
/*!*************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/code-list-view.tsx ***!
  \*************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CodeListView = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

var _assemblyItems = _interopRequireDefault(__webpack_require__(/*! ./assembly-items */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/assembly-items.tsx"));

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/code-list-view.tsx";

// eslint-disable-line
const CodeListView = ({
  registerEvent
}) => {
  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
    id: "asmcodes",
    children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_assemblyItems.default, {
      registerEvent: registerEvent
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 7,
      columnNumber: 7
    }, void 0)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 6,
    columnNumber: 5
  }, void 0);
};

exports.CodeListView = CodeListView;
var _default = CodeListView;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/dropdown-panel.tsx":
/*!*************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/dropdown-panel.tsx ***!
  \*************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DropdownPanel = void 0;

var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

var _treeView = __webpack_require__(/*! @remix-ui/tree-view */ "../../../libs/remix-ui/tree-view/src/index.ts");

var _clipboard = __webpack_require__(/*! @remix-ui/clipboard */ "../../../libs/remix-ui/clipboard/src/index.ts");

var _calldata = __webpack_require__(/*! ../../reducers/calldata */ "../../../libs/remix-ui/debugger-ui/src/reducers/calldata.ts");

__webpack_require__(/*! ./styles/dropdown-panel.css */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/styles/dropdown-panel.css");

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/dropdown-panel.tsx";

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const DropdownPanel = props => {
  const [calldataObj, dispatch] = (0, _react.useReducer)(_calldata.reducer, _calldata.initialState);
  const {
    dropdownName,
    dropdownMessage,
    calldata,
    header,
    loading,
    extractFunc,
    formatSelfFunc,
    registerEvent,
    triggerEvent,
    loadMoreEvent,
    loadMoreCompletedEvent,
    headStyle,
    bodyStyle,
    hexHighlight
  } = props;

  const extractDataDefault = (item, parent) => {
    const ret = {};

    if (item instanceof Array) {
      ret.children = item.map((item, index) => {
        return {
          key: index,
          value: item
        };
      });
      ret.self = 'Array';
      ret.isNode = true;
      ret.isLeaf = false;
    } else if (item instanceof Object) {
      ret.children = Object.keys(item).map(key => {
        return {
          key: key,
          value: item[key]
        };
      });
      ret.self = 'Object';
      ret.isNode = true;
      ret.isLeaf = false;
    } else {
      ret.self = item;
      ret.children = null;
      ret.isNode = false;
      ret.isLeaf = true;
    }

    return ret;
  };

  const formatSelfDefault = (key, data) => {
    let value;

    if (hexHighlight && typeof data.self === 'string') {
      const isHex = data.self.startsWith('0x') || hexHighlight;

      if (isHex) {
        const regex = /^(0+)(.*)/g;
        const split = regex.exec(data.self.replace('0x', ''));

        if (split && split[1]) {
          value = /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("span", {
            children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("span", {
              className: "m-0 label_value",
              children: "0x"
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 44,
              columnNumber: 26
            }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("span", {
              className: "m-0 label_value",
              children: split[1]
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 44,
              columnNumber: 69
            }, void 0), split[2] && /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("span", {
              className: "m-0 label_value font-weight-bold text-dark",
              children: split[2]
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 44,
              columnNumber: 134
            }, void 0)]
          }, void 0, true, {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 20
          }, void 0);
        } else value = /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("span", {
          children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("span", {
            className: "m-0 label_value",
            children: "0x"
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 31
          }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("span", {
            className: "m-0 label_value font-weight-bold text-dark",
            children: data.self.replace('0x', '')
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 74
          }, void 0)]
        }, void 0, true, {
          fileName: _jsxFileName,
          lineNumber: 45,
          columnNumber: 25
        }, void 0);
      } else value = /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("span", {
        className: "m-0 label_value",
        children: data.self
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 46,
        columnNumber: 22
      }, void 0);
    } else value = /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("span", {
      className: "m-0 label_value",
      children: data.self
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 47,
      columnNumber: 20
    }, void 0);

    return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
      className: "d-flex mr-1 flex-row label_item",
      children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("label", {
        className: "small font-weight-bold mb-0 pr-1 label_key",
        children: [key, ":"]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 50,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("label", {
        className: "m-0 label_value",
        children: value
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 51,
        columnNumber: 9
      }, void 0)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 49,
      columnNumber: 7
    }, void 0);
  };

  const [state, setState] = (0, _react.useState)({
    header: '',
    toggleDropdown: false,
    message: {
      innerText: 'No data available.',
      display: 'block'
    },
    dropdownContent: {
      innerText: '',
      display: 'none'
    },
    title: {
      innerText: '',
      display: 'none'
    },
    copiableContent: '',
    updating: false,
    expandPath: [],
    data: null
  });
  (0, _react.useEffect)(() => {
    registerEvent && registerEvent(loadMoreCompletedEvent, updatedCalldata => {
      dispatch({
        type: 'UPDATE_CALLDATA_SUCCESS',
        payload: updatedCalldata
      });
    });
  }, []);
  (0, _react.useEffect)(() => {
    dispatch({
      type: 'FETCH_CALLDATA_SUCCESS',
      payload: calldata
    });
  }, [calldata]);
  (0, _react.useEffect)(() => {
    update(calldata);
  }, [calldataObj.calldata]);
  (0, _react.useEffect)(() => {
    message(dropdownMessage);
  }, [dropdownMessage]);
  (0, _react.useEffect)(() => {
    if (loading && !state.updating) setLoading();
  }, [loading]);

  const handleToggle = () => {
    setState(prevState => {
      return _objectSpread(_objectSpread({}, prevState), {}, {
        toggleDropdown: !prevState.toggleDropdown
      });
    });
  };

  const handleExpand = keyPath => {
    if (!state.expandPath.includes(keyPath)) {
      state.expandPath.push(keyPath);
    } else {
      state.expandPath = state.expandPath.filter(path => !path.startsWith(keyPath));
    }
  };

  const message = message => {
    if (message === state.message.innerText) return;
    setState(prevState => {
      return _objectSpread(_objectSpread({}, prevState), {}, {
        message: {
          innerText: message,
          display: message ? 'block' : ''
        },
        updating: false
      });
    });
  };

  const setLoading = () => {
    setState(prevState => {
      return _objectSpread(_objectSpread({}, prevState), {}, {
        message: {
          innerText: '',
          display: 'none'
        },
        dropdownContent: _objectSpread(_objectSpread({}, prevState.dropdownContent), {}, {
          display: 'none'
        }),
        copiableContent: '',
        updating: true
      });
    });
  };

  const update = function update(calldata) {
    let isEmpty = !calldata;
    if (calldata && Array.isArray(calldata) && calldata.length === 0) isEmpty = true;else if (calldata && Object.keys(calldata).length === 0 && calldata.constructor === Object) isEmpty = true;
    setState(prevState => {
      return _objectSpread(_objectSpread({}, prevState), {}, {
        dropdownContent: _objectSpread(_objectSpread({}, prevState.dropdownContent), {}, {
          display: 'block'
        }),
        copiableContent: JSON.stringify(calldata, null, '\t'),
        message: {
          innerText: isEmpty ? 'No data available' : '',
          display: isEmpty ? 'block' : 'none'
        },
        updating: false,
        toggleDropdown: !isEmpty,
        data: calldata
      });
    });
  };

  const renderData = (item, parent, key, keyPath) => {
    const data = extractFunc ? extractFunc(item, parent) : extractDataDefault(item, parent);
    const children = (data.children || []).map(child => {
      return renderData(child.value, data, child.key, keyPath + '/' + child.key);
    });

    if (children && children.length > 0) {
      return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_treeView.TreeViewItem, {
        id: `treeViewItem${key}`,
        label: formatSelfFunc ? formatSelfFunc(key, data) : formatSelfDefault(key, data),
        onClick: () => handleExpand(keyPath),
        expand: state.expandPath.includes(keyPath),
        children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_treeView.TreeView, {
          id: `treeView${key}`,
          children: [children, data.hasNext && /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_treeView.TreeViewItem, {
            id: 'treeViewLoadMore',
            "data-id": 'treeViewLoadMore',
            className: "cursor_pointer",
            label: "Load more",
            onClick: () => {
              triggerEvent(loadMoreEvent, [data.cursor]);
            }
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 185,
            columnNumber: 30
          }, void 0)]
        }, keyPath, true, {
          fileName: _jsxFileName,
          lineNumber: 183,
          columnNumber: 11
        }, void 0)
      }, keyPath, false, {
        fileName: _jsxFileName,
        lineNumber: 182,
        columnNumber: 9
      }, void 0);
    } else {
      return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_treeView.TreeViewItem, {
        id: key.toString(),
        label: formatSelfFunc ? formatSelfFunc(key, data) : formatSelfDefault(key, data),
        onClick: () => handleExpand(keyPath),
        expand: state.expandPath.includes(keyPath)
      }, keyPath, false, {
        fileName: _jsxFileName,
        lineNumber: 190,
        columnNumber: 14
      }, void 0);
    }
  };

  const uniquePanelName = dropdownName.split(' ').join('');
  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
    className: "border rounded px-1 mt-1 bg-light",
    children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
      className: "py-0 px-1 title",
      style: headStyle,
      children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
        className: state.toggleDropdown ? 'icon fas fa-caret-down' : 'icon fas fa-caret-right',
        onClick: handleToggle
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 199,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
        className: "name",
        "data-id": `dropdownPanel${uniquePanelName}`,
        onClick: handleToggle,
        children: dropdownName
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 200,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("span", {
        className: "nameDetail",
        onClick: handleToggle,
        children: header
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 200,
        columnNumber: 118
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_clipboard.CopyToClipboard, {
        content: state.copiableContent,
        "data-id": `dropdownPanelCopyToClipboard${uniquePanelName}`
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 201,
        columnNumber: 9
      }, void 0)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 198,
      columnNumber: 7
    }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
      className: "dropdownpanel",
      style: {
        display: state.toggleDropdown ? 'block' : 'none'
      },
      children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("i", {
        className: "refresh fas fa-sync",
        style: {
          display: state.updating ? 'inline-block' : 'none'
        },
        "aria-hidden": "true"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 204,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
        className: "dropdowncontent",
        style: _objectSpread({
          display: state.dropdownContent.display
        }, bodyStyle),
        children: state.data && /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_treeView.TreeView, {
          id: "treeView",
          children: Object.keys(state.data).map(innerkey => renderData(state.data[innerkey], state.data, innerkey, innerkey))
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 208,
          columnNumber: 13
        }, void 0)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 205,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
        className: "dropdownrawcontent",
        hidden: true,
        children: state.copiableContent
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 215,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
        className: "message",
        style: {
          display: state.message.display
        },
        children: state.message.innerText
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 216,
        columnNumber: 9
      }, void 0)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 203,
      columnNumber: 7
    }, void 0)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 197,
    columnNumber: 5
  }, void 0);
};

exports.DropdownPanel = DropdownPanel;
var _default = DropdownPanel;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/full-storages-changes.tsx":
/*!********************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/full-storages-changes.tsx ***!
  \********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.FullStoragesChanges = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

var _dropdownPanel = __webpack_require__(/*! ./dropdown-panel */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/dropdown-panel.tsx");

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/full-storages-changes.tsx";

// eslint-disable-line
const FullStoragesChanges = ({
  calldata
}) => {
  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
    id: "fullstorageschangespanel",
    children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_dropdownPanel.DropdownPanel, {
      dropdownName: "Full Storage Changes",
      calldata: calldata || {}
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 7,
      columnNumber: 7
    }, void 0)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 6,
    columnNumber: 5
  }, void 0);
};

exports.FullStoragesChanges = FullStoragesChanges;
var _default = FullStoragesChanges;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/function-panel.tsx":
/*!*************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/function-panel.tsx ***!
  \*************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.FunctionPanel = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

var _dropdownPanel = _interopRequireDefault(__webpack_require__(/*! ./dropdown-panel */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/dropdown-panel.tsx"));

var _deepEqual = _interopRequireDefault(__webpack_require__(/*! deep-equal */ "../../../node_modules/deep-equal/index.js"));

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/function-panel.tsx";

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// eslint-disable-line
const FunctionPanel = ({
  data
}) => {
  const [calldata, setCalldata] = (0, _react.useState)(null);
  (0, _react.useEffect)(() => {
    if (!(0, _deepEqual.default)(calldata, data)) setCalldata(data);
  }, [data]);
  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
    id: "FunctionPanel",
    "data-id": "functionPanel",
    children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_dropdownPanel.default, {
      dropdownName: "Function Stack",
      calldata: calldata || {}
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 14,
      columnNumber: 7
    }, void 0)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 13,
    columnNumber: 5
  }, void 0);
};

exports.FunctionPanel = FunctionPanel;
var _default = FunctionPanel;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/global-variables.tsx":
/*!***************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/global-variables.tsx ***!
  \***************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.GlobalVariables = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

var _dropdownPanel = _interopRequireDefault(__webpack_require__(/*! ./dropdown-panel */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/dropdown-panel.tsx"));

var _ethereumjsUtil = __webpack_require__(/*! ethereumjs-util */ "../../../node_modules/ethereumjs-util/dist.browser/index.js");

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/global-variables.tsx";

const GlobalVariables = ({
  block,
  receipt,
  tx
}) => {
  // see https://docs.soliditylang.org/en/latest/units-and-global-variables.html#block-and-transaction-properties
  const globals = {
    'block.chainid': tx.chainId,
    'block.coinbase': block.miner,
    'block.difficulty': block.difficulty,
    'block.gaslimit': block.gasLimit,
    'block.number': block.number,
    'block.timestamp': block.timestamp,
    'msg.sender': tx.from,
    'msg.sig': tx.input.substring(0, 10),
    'msg.value': tx.value + ' Wei',
    'tx.origin': tx.from
  };

  if (block.baseFeePerGas) {
    globals['block.basefee'] = new _ethereumjsUtil.BN(block.baseFeePerGas.replace('0x', ''), 'hex').toString(10) + ` Wei (${block.baseFeePerGas})`;
  }

  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
    id: "globalvariable",
    "data-id": "globalvariable",
    children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_dropdownPanel.default, {
      hexHighlight: false,
      bodyStyle: {
        fontFamily: 'monospace'
      },
      dropdownName: "Global Variables",
      calldata: globals || {}
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 25,
      columnNumber: 7
    }, void 0)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 24,
    columnNumber: 5
  }, void 0);
};

exports.GlobalVariables = GlobalVariables;
var _default = GlobalVariables;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/memory-panel.tsx":
/*!***********************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/memory-panel.tsx ***!
  \***********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MemoryPanel = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

var _dropdownPanel = _interopRequireDefault(__webpack_require__(/*! ./dropdown-panel */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/dropdown-panel.tsx"));

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/memory-panel.tsx";

// eslint-disable-line
const MemoryPanel = ({
  calldata
}) => {
  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_dropdownPanel.default, {
    hexHighlight: true,
    bodyStyle: {
      fontFamily: 'monospace'
    },
    dropdownName: "Memory",
    calldata: calldata || {}
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 6,
    columnNumber: 5
  }, void 0);
};

exports.MemoryPanel = MemoryPanel;
var _default = MemoryPanel;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/solidity-locals.tsx":
/*!**************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/solidity-locals.tsx ***!
  \**************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.SolidityLocals = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

var _dropdownPanel = _interopRequireDefault(__webpack_require__(/*! ./dropdown-panel */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/dropdown-panel.tsx"));

var _solidityTypeFormatter = __webpack_require__(/*! ../../utils/solidityTypeFormatter */ "../../../libs/remix-ui/debugger-ui/src/utils/solidityTypeFormatter.ts");

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/solidity-locals.tsx";

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// eslint-disable-line
const SolidityLocals = ({
  data,
  message,
  registerEvent,
  triggerEvent
}) => {
  const [calldata, setCalldata] = (0, _react.useState)(null);
  (0, _react.useEffect)(() => {
    data && setCalldata(data);
  }, [data]);

  const formatSelf = (key, data) => {
    let color = 'var(--primary)';

    if (data.isArray || data.isStruct || data.isMapping) {
      color = 'var(--info)';
    } else if (data.type.indexOf('uint') === 0 || data.type.indexOf('int') === 0 || data.type.indexOf('bool') === 0 || data.type.indexOf('enum') === 0) {
      color = 'var(--green)';
    } else if (data.type === 'string') {
      color = 'var(--teal)';
    } else if (data.self == 0x0) {
      // eslint-disable-line
      color = 'var(--gray)';
    }

    if (data.type === 'string') {
      data.self = JSON.stringify(data.self);
    }

    return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("label", {
      className: "mb-0",
      style: {
        color: data.isProperty ? 'var(--info)' : '',
        whiteSpace: 'pre-wrap'
      },
      children: [' ' + key, ":", /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("label", {
        className: "mb-0",
        style: {
          color
        },
        children: ' ' + data.self
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 35,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("label", {
        style: {
          fontStyle: 'italic'
        },
        children: data.isProperty || !data.type ? '' : ' ' + data.type
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 38,
        columnNumber: 9
      }, void 0)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 33,
      columnNumber: 7
    }, void 0);
  };

  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
    id: "soliditylocals",
    "data-id": "solidityLocals",
    children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_dropdownPanel.default, {
      dropdownName: "Solidity Locals",
      dropdownMessage: message,
      calldata: calldata || {},
      extractFunc: _solidityTypeFormatter.extractData,
      formatSelfFunc: formatSelf,
      registerEvent: registerEvent,
      triggerEvent: triggerEvent,
      loadMoreEvent: "solidityLocalsLoadMore",
      loadMoreCompletedEvent: "solidityLocalsLoadMoreCompleted"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 47,
      columnNumber: 7
    }, void 0)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 46,
    columnNumber: 5
  }, void 0);
};

exports.SolidityLocals = SolidityLocals;
var _default = SolidityLocals;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/solidity-state.tsx":
/*!*************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/solidity-state.tsx ***!
  \*************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.SolidityState = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

var _dropdownPanel = _interopRequireDefault(__webpack_require__(/*! ./dropdown-panel */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/dropdown-panel.tsx"));

var _solidityTypeFormatter = __webpack_require__(/*! ../../utils/solidityTypeFormatter */ "../../../libs/remix-ui/debugger-ui/src/utils/solidityTypeFormatter.ts");

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/solidity-state.tsx";

// eslint-disable-line
const SolidityState = ({
  calldata,
  message
}) => {
  const formatSelf = (key, data) => {
    try {
      let color = 'var(--primary)';

      if (data.isArray || data.isStruct || data.isMapping) {
        color = 'var(--info)';
      } else if (data.type.indexOf('uint') === 0 || data.type.indexOf('int') === 0 || data.type.indexOf('bool') === 0 || data.type.indexOf('enum') === 0) {
        color = 'var(--green)';
      } else if (data.type === 'string') {
        color = 'var(--teal)';
      } else if (data.self == 0x0) {
        // eslint-disable-line
        color = 'var(--gray)';
      }

      return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("label", {
        className: "mb-0",
        style: {
          color: data.isProperty ? 'var(--info)' : '',
          whiteSpace: 'pre-wrap'
        },
        children: [' ' + key, ":", /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("label", {
          className: "mb-0",
          style: {
            color
          },
          children: ' ' + data.self
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 27,
          columnNumber: 11
        }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("label", {
          style: {
            fontStyle: 'italic'
          },
          children: data.isProperty || !data.type ? '' : ' ' + data.type
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 30,
          columnNumber: 11
        }, void 0)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 25,
        columnNumber: 9
      }, void 0);
    } catch (e) {
      return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_jsxDevRuntime.Fragment, {}, void 0, false);
    }
  };

  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
    id: "soliditystate",
    "data-id": "soliditystate",
    children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_dropdownPanel.default, {
      dropdownName: "Solidity State",
      calldata: calldata || {},
      formatSelfFunc: formatSelf,
      extractFunc: _solidityTypeFormatter.extractData
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 43,
      columnNumber: 9
    }, void 0)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 41,
    columnNumber: 5
  }, void 0);
};

exports.SolidityState = SolidityState;
var _default = SolidityState;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/stack-panel.tsx":
/*!**********************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/stack-panel.tsx ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.StackPanel = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

var _dropdownPanel = _interopRequireDefault(__webpack_require__(/*! ./dropdown-panel */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/dropdown-panel.tsx"));

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/stack-panel.tsx";

// eslint-disable-line
const StackPanel = ({
  calldata
}) => {
  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
    id: "stackpanel",
    children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_dropdownPanel.default, {
      hexHighlight: true,
      bodyStyle: {
        fontFamily: 'monospace'
      },
      dropdownName: "Stack",
      calldata: calldata || {}
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 7,
      columnNumber: 7
    }, void 0)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 6,
    columnNumber: 5
  }, void 0);
};

exports.StackPanel = StackPanel;
var _default = StackPanel;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/step-detail.tsx":
/*!**********************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/step-detail.tsx ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.StepDetail = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

var _dropdownPanel = _interopRequireDefault(__webpack_require__(/*! ./dropdown-panel */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/dropdown-panel.tsx"));

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/step-detail.tsx";

// eslint-disable-line
const StepDetail = ({
  stepDetail
}) => {
  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
    id: "stepdetail",
    "data-id": "stepdetail",
    children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_dropdownPanel.default, {
      hexHighlight: false,
      dropdownName: "Step details",
      calldata: stepDetail || {}
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 7,
      columnNumber: 7
    }, void 0)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 6,
    columnNumber: 5
  }, void 0);
};

exports.StepDetail = StepDetail;
var _default = StepDetail;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/storage-panel.tsx":
/*!************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/storage-panel.tsx ***!
  \************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.StoragePanel = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

var _dropdownPanel = _interopRequireDefault(__webpack_require__(/*! ./dropdown-panel */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/dropdown-panel.tsx"));

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/storage-panel.tsx";

// eslint-disable-line
const StoragePanel = ({
  calldata,
  header
}) => {
  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
    id: "storagepanel",
    children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_dropdownPanel.default, {
      dropdownName: "Storage",
      calldata: calldata || {},
      header: header
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 7,
      columnNumber: 7
    }, void 0)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 6,
    columnNumber: 5
  }, void 0);
};

exports.StoragePanel = StoragePanel;
var _default = StoragePanel;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/styles/assembly-items.css":
/*!********************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/styles/assembly-items.css ***!
  \********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var content = __webpack_require__(/*! !../../../../../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../../../../../node_modules/postcss-loader/dist/cjs.js??ref--5-oneOf-4-2!./assembly-items.css */ "../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../node_modules/postcss-loader/dist/cjs.js?!../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/styles/assembly-items.css");

if (typeof content === 'string') {
  content = [[module.i, content, '']];
}

var options = {}

options.insert = "head";
options.singleton = false;

var update = __webpack_require__(/*! ../../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js")(content, options);

if (content.locals) {
  module.exports = content.locals;
}


/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/styles/dropdown-panel.css":
/*!********************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/styles/dropdown-panel.css ***!
  \********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var content = __webpack_require__(/*! !../../../../../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../../../../../node_modules/postcss-loader/dist/cjs.js??ref--5-oneOf-4-2!./dropdown-panel.css */ "../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../node_modules/postcss-loader/dist/cjs.js?!../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/styles/dropdown-panel.css");

if (typeof content === 'string') {
  content = [[module.i, content, '']];
}

var options = {}

options.insert = "head";
options.singleton = false;

var update = __webpack_require__(/*! ../../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js")(content, options);

if (content.locals) {
  module.exports = content.locals;
}


/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/vm-debugger-head.tsx":
/*!***************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/vm-debugger-head.tsx ***!
  \***************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.VmDebuggerHead = void 0;

var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

var _codeListView = _interopRequireDefault(__webpack_require__(/*! ./code-list-view */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/code-list-view.tsx"));

var _functionPanel = _interopRequireDefault(__webpack_require__(/*! ./function-panel */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/function-panel.tsx"));

var _stepDetail = _interopRequireDefault(__webpack_require__(/*! ./step-detail */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/step-detail.tsx"));

var _solidityState = _interopRequireDefault(__webpack_require__(/*! ./solidity-state */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/solidity-state.tsx"));

var _solidityLocals = _interopRequireDefault(__webpack_require__(/*! ./solidity-locals */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/solidity-locals.tsx"));

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/vm-debugger-head.tsx";

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// eslint-disable-line
const VmDebuggerHead = ({
  vmDebugger: {
    registerEvent,
    triggerEvent
  }
}) => {
  const [functionPanel, setFunctionPanel] = (0, _react.useState)(null);
  const [stepDetail, setStepDetail] = (0, _react.useState)({
    'vm trace step': '-',
    'execution step': '-',
    'add memory': '',
    gas: '',
    'remaining gas': '-',
    'loaded address': '-'
  });
  const [solidityState, setSolidityState] = (0, _react.useState)({
    calldata: null,
    message: null
  });
  const [solidityLocals, setSolidityLocals] = (0, _react.useState)({
    calldata: null,
    message: null
  });
  (0, _react.useEffect)(() => {
    registerEvent && registerEvent('functionsStackUpdate', stack => {
      if (stack === null || stack.length === 0) return;
      const functions = [];

      for (const func of stack) {
        functions.push(func.functionDefinition.name + '(' + func.inputs.join(', ') + ')');
      }

      setFunctionPanel(() => functions);
    });
    registerEvent && registerEvent('traceUnloaded', () => {
      setStepDetail(() => {
        return {
          'vm trace step': '-',
          'execution step': '-',
          'add memory': '',
          gas: '',
          'remaining gas': '-',
          'loaded address': '-'
        };
      });
    });
    registerEvent && registerEvent('newTraceLoaded', () => {
      setStepDetail(() => {
        return {
          'vm trace step': '-',
          'execution step': '-',
          'add memory': '',
          gas: '',
          'remaining gas': '-',
          'loaded address': '-'
        };
      });
    });
    registerEvent && registerEvent('traceCurrentStepUpdate', (error, step) => {
      setStepDetail(prevState => {
        return _objectSpread(_objectSpread({}, prevState), {}, {
          'execution step': error ? '-' : step
        });
      });
    });
    registerEvent && registerEvent('traceMemExpandUpdate', (error, addmem) => {
      setStepDetail(prevState => {
        return _objectSpread(_objectSpread({}, prevState), {}, {
          'add memory': error ? '-' : addmem
        });
      });
    });
    registerEvent && registerEvent('traceStepCostUpdate', (error, gas) => {
      setStepDetail(prevState => {
        return _objectSpread(_objectSpread({}, prevState), {}, {
          gas: error ? '-' : gas
        });
      });
    });
    registerEvent && registerEvent('traceCurrentCalledAddressAtUpdate', (error, address) => {
      setStepDetail(prevState => {
        return _objectSpread(_objectSpread({}, prevState), {}, {
          'loaded address': error ? '-' : address
        });
      });
    });
    registerEvent && registerEvent('traceRemainingGasUpdate', (error, remainingGas) => {
      setStepDetail(prevState => {
        return _objectSpread(_objectSpread({}, prevState), {}, {
          'remaining gas': error ? '-' : remainingGas
        });
      });
    });
    registerEvent && registerEvent('indexUpdate', index => {
      setStepDetail(prevState => {
        return _objectSpread(_objectSpread({}, prevState), {}, {
          'vm trace step': index
        });
      });
    });
    registerEvent && registerEvent('solidityState', calldata => {
      setSolidityState(() => {
        return _objectSpread(_objectSpread({}, solidityState), {}, {
          calldata
        });
      });
    });
    registerEvent && registerEvent('solidityStateMessage', message => {
      setSolidityState(() => {
        return _objectSpread(_objectSpread({}, solidityState), {}, {
          message
        });
      });
    });
    registerEvent && registerEvent('solidityLocals', calldata => {
      setSolidityLocals(() => {
        return _objectSpread(_objectSpread({}, solidityLocals), {}, {
          calldata
        });
      });
    });
    registerEvent && registerEvent('solidityLocalsMessage', message => {
      setSolidityLocals(() => {
        return _objectSpread(_objectSpread({}, solidityLocals), {}, {
          message
        });
      });
    });
  }, [registerEvent]);
  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
    id: "vmheadView",
    className: "mt-1 px-0",
    children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
      className: "d-flex flex-column",
      children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
        className: "w-100",
        children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_functionPanel.default, {
          data: functionPanel
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 104,
          columnNumber: 11
        }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_solidityLocals.default, {
          data: solidityLocals.calldata,
          message: solidityLocals.message,
          registerEvent: registerEvent,
          triggerEvent: triggerEvent
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 105,
          columnNumber: 11
        }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_solidityState.default, {
          calldata: solidityState.calldata,
          message: solidityState.message
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 106,
          columnNumber: 11
        }, void 0)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 103,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
        className: "w-100",
        children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_codeListView.default, {
          registerEvent: registerEvent
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 108,
          columnNumber: 32
        }, void 0)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 108,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
        className: "w-100",
        children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_stepDetail.default, {
          stepDetail: stepDetail
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 109,
          columnNumber: 32
        }, void 0)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 109,
        columnNumber: 9
      }, void 0)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 102,
      columnNumber: 7
    }, void 0)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 101,
    columnNumber: 5
  }, void 0);
};

exports.VmDebuggerHead = VmDebuggerHead;
var _default = VmDebuggerHead;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/vm-debugger.tsx":
/*!**********************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/vm-debugger.tsx ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.VmDebugger = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

var _calldataPanel = _interopRequireDefault(__webpack_require__(/*! ./calldata-panel */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/calldata-panel.tsx"));

var _memoryPanel = _interopRequireDefault(__webpack_require__(/*! ./memory-panel */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/memory-panel.tsx"));

var _callstackPanel = _interopRequireDefault(__webpack_require__(/*! ./callstack-panel */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/callstack-panel.tsx"));

var _stackPanel = _interopRequireDefault(__webpack_require__(/*! ./stack-panel */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/stack-panel.tsx"));

var _storagePanel = _interopRequireDefault(__webpack_require__(/*! ./storage-panel */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/storage-panel.tsx"));

var _dropdownPanel = _interopRequireDefault(__webpack_require__(/*! ./dropdown-panel */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/dropdown-panel.tsx"));

var _fullStoragesChanges = _interopRequireDefault(__webpack_require__(/*! ./full-storages-changes */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/full-storages-changes.tsx"));

var _globalVariables = _interopRequireDefault(__webpack_require__(/*! ./global-variables */ "../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/global-variables.tsx"));

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/vm-debugger.tsx";

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// eslint-disable-line
const VmDebugger = ({
  vmDebugger: {
    registerEvent
  },
  currentBlock,
  currentReceipt,
  currentTransaction
}) => {
  const [calldataPanel, setCalldataPanel] = (0, _react.useState)(null);
  const [memoryPanel, setMemoryPanel] = (0, _react.useState)(null);
  const [callStackPanel, setCallStackPanel] = (0, _react.useState)(null);
  const [stackPanel, setStackPanel] = (0, _react.useState)(null);
  const [storagePanel, setStoragePanel] = (0, _react.useState)({
    calldata: null,
    header: null
  });
  const [returnValuesPanel, setReturnValuesPanel] = (0, _react.useState)(null);
  const [fullStoragesChangesPanel, setFullStoragesChangesPanel] = (0, _react.useState)(null);
  (0, _react.useEffect)(() => {
    registerEvent && registerEvent('traceManagerCallDataUpdate', calldata => {
      setCalldataPanel(() => calldata);
    });
    registerEvent && registerEvent('traceManagerMemoryUpdate', calldata => {
      setMemoryPanel(() => calldata);
    });
    registerEvent && registerEvent('traceManagerCallStackUpdate', calldata => {
      setCallStackPanel(() => calldata);
    });
    registerEvent && registerEvent('traceManagerStackUpdate', calldata => {
      setStackPanel(() => calldata);
    });
    registerEvent && registerEvent('traceManagerStorageUpdate', (calldata, header) => {
      setStoragePanel(() => {
        return {
          calldata,
          header
        };
      });
    });
    registerEvent && registerEvent('traceReturnValueUpdate', calldata => {
      setReturnValuesPanel(() => calldata);
    });
    registerEvent && registerEvent('traceAddressesUpdate', calldata => {
      setFullStoragesChangesPanel(() => {
        return {};
      });
    });
    registerEvent && registerEvent('traceStorageUpdate', calldata => {
      setFullStoragesChangesPanel(() => calldata);
    });
  }, [registerEvent]);
  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
    id: "vmdebugger",
    className: "px-2",
    children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
      children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_stackPanel.default, {
        calldata: stackPanel
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 57,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_memoryPanel.default, {
        calldata: memoryPanel
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 58,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_storagePanel.default, {
        calldata: storagePanel.calldata,
        header: storagePanel.header
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 59,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_callstackPanel.default, {
        calldata: callStackPanel
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 60,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_calldataPanel.default, {
        calldata: calldataPanel
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 61,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_globalVariables.default, {
        block: currentBlock,
        receipt: currentReceipt,
        tx: currentTransaction
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 62,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_dropdownPanel.default, {
        dropdownName: "Return Value",
        calldata: returnValuesPanel || {}
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 63,
        columnNumber: 9
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_fullStoragesChanges.default, {
        calldata: fullStoragesChangesPanel
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 64,
        columnNumber: 9
      }, void 0)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 56,
      columnNumber: 7
    }, void 0)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 55,
    columnNumber: 5
  }, void 0);
};

exports.VmDebugger = VmDebugger;
var _default = VmDebugger;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/reducers/assembly-items.ts":
/*!*****************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/reducers/assembly-items.ts ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reducer = exports.initialState = void 0;

var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty.js"));

var _deepEqual = _interopRequireDefault(__webpack_require__(/*! deep-equal */ "../../../node_modules/deep-equal/index.js"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const initialState = {
  opCodes: {
    code: [],
    index: 0,
    address: ''
  },
  display: [],
  index: 0,
  nextIndexes: [-1],
  returnInstructionIndexes: [],
  outOfGasInstructionIndexes: [],
  top: 0,
  bottom: 0,
  isRequesting: false,
  isSuccessful: false,
  hasError: null
};
exports.initialState = initialState;

const reducedOpcode = (opCodes, payload) => {
  const length = 100;
  let bottom = opCodes.index - 10;
  bottom = bottom < 0 ? 0 : bottom;
  const top = bottom + length;
  return {
    index: opCodes.index - bottom,
    nextIndexes: opCodes.nextIndexes.map(index => index - bottom),
    display: opCodes.code.slice(bottom, top),
    returnInstructionIndexes: payload.returnInstructionIndexes.map(index => index.instructionIndex - bottom),
    outOfGasInstructionIndexes: payload.outOfGasInstructionIndexes.map(index => index.instructionIndex - bottom)
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_OPCODES_REQUEST':
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          isRequesting: true,
          isSuccessful: false,
          hasError: null
        });
      }

    case 'FETCH_OPCODES_SUCCESS':
      {
        const opCodes = action.payload.address === state.opCodes.address ? _objectSpread(_objectSpread({}, state.opCodes), {}, {
          index: action.payload.index,
          nextIndexes: action.payload.nextIndexes
        }) : (0, _deepEqual.default)(action.payload.code, state.opCodes.code) ? state.opCodes : action.payload;
        const reduced = reducedOpcode(opCodes, action.payload);
        return {
          opCodes,
          display: reduced.display,
          index: reduced.index,
          nextIndexes: reduced.nextIndexes,
          isRequesting: false,
          isSuccessful: true,
          hasError: null,
          returnInstructionIndexes: reduced.returnInstructionIndexes,
          outOfGasInstructionIndexes: reduced.outOfGasInstructionIndexes
        };
      }

    case 'FETCH_OPCODES_ERROR':
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          isRequesting: false,
          isSuccessful: false,
          hasError: action.payload
        });
      }

    default:
      throw new Error();
  }
};

exports.reducer = reducer;

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/reducers/calldata.ts":
/*!***********************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/reducers/calldata.ts ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reducer = exports.initialState = void 0;

var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty.js"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const initialState = {
  calldata: {},
  isRequesting: false,
  isSuccessful: false,
  hasError: null
};
exports.initialState = initialState;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_CALLDATA_REQUEST':
      return _objectSpread(_objectSpread({}, state), {}, {
        isRequesting: true,
        isSuccessful: false,
        hasError: null
      });

    case 'FETCH_CALLDATA_SUCCESS':
      return {
        calldata: action.payload,
        isRequesting: false,
        isSuccessful: true,
        hasError: null
      };

    case 'FETCH_CALLDATA_ERROR':
      return _objectSpread(_objectSpread({}, state), {}, {
        isRequesting: false,
        isSuccessful: false,
        hasError: action.payload
      });

    case 'UPDATE_CALLDATA_REQUEST':
      return _objectSpread(_objectSpread({}, state), {}, {
        isRequesting: true,
        isSuccessful: false,
        hasError: null
      });

    case 'UPDATE_CALLDATA_SUCCESS':
      return {
        calldata: mergeLocals(action.payload, state.calldata),
        isRequesting: false,
        isSuccessful: true,
        hasError: null
      };

    case 'UPDATE_CALLDATA_ERROR':
      return _objectSpread(_objectSpread({}, state), {}, {
        isRequesting: false,
        isSuccessful: false,
        hasError: action.payload
      });

    default:
      throw new Error();
  }
};

exports.reducer = reducer;

function mergeLocals(locals1, locals2) {
  Object.keys(locals2).map(item => {
    if (locals2[item].cursor && parseInt(locals2[item].cursor) < parseInt(locals1[item].cursor)) {
      locals2[item] = _objectSpread(_objectSpread({}, locals1[item]), {}, {
        value: [...locals2[item].value, ...locals1[item].value]
      });
    }
  });
  return locals2;
}

/***/ }),

/***/ "../../../libs/remix-ui/debugger-ui/src/utils/solidityTypeFormatter.ts":
/*!*********************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/utils/solidityTypeFormatter.ts ***!
  \*********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractData = extractData;

var _ethereumjsUtil = __webpack_require__(/*! ethereumjs-util */ "../../../node_modules/ethereumjs-util/dist.browser/index.js");

// eslint-disable-line
function extractData(item, parent) {
  const ret = {};

  if (item.isProperty || !item.type) {
    return item;
  }

  try {
    if (item.type.lastIndexOf(']') === item.type.length - 1) {
      ret.children = (item.value || []).map(function (item, index) {
        return {
          key: index,
          value: item
        };
      });
      ret.children.unshift({
        key: 'length',
        value: {
          self: new _ethereumjsUtil.BN(item.length.replace('0x', ''), 16).toString(10),
          type: 'uint',
          isProperty: true
        }
      });
      ret.isArray = true;
      ret.self = parent.isArray ? '' : item.type;
      ret.cursor = item.cursor;
      ret.hasNext = item.hasNext;
    } else if (item.type.indexOf('struct') === 0) {
      ret.children = Object.keys(item.value || {}).map(function (key) {
        return {
          key: key,
          value: item.value[key]
        };
      });
      ret.self = item.type;
      ret.isStruct = true;
    } else if (item.type.indexOf('mapping') === 0) {
      ret.children = Object.keys(item.value || {}).map(function (key) {
        return {
          key: key,
          value: item.value[key]
        };
      });
      ret.isMapping = true;
      ret.self = item.type;
    } else {
      ret.children = null;
      ret.self = item.value;
      ret.type = item.type;
    }
  } catch (e) {
    console.log(e);
  }

  return ret;
}

/***/ }),

/***/ "../../../libs/remix-ui/modal-dialog/src/index.ts":
/*!************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/modal-dialog/src/index.ts ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _modalDialogCustom = __webpack_require__(/*! ./lib/modal-dialog-custom */ "../../../libs/remix-ui/modal-dialog/src/lib/modal-dialog-custom.tsx");

Object.keys(_modalDialogCustom).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _modalDialogCustom[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _modalDialogCustom[key];
    }
  });
});

var _remixUiModalDialog = __webpack_require__(/*! ./lib/remix-ui-modal-dialog */ "../../../libs/remix-ui/modal-dialog/src/lib/remix-ui-modal-dialog.tsx");

Object.keys(_remixUiModalDialog).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _remixUiModalDialog[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _remixUiModalDialog[key];
    }
  });
});

/***/ }),

/***/ "../../../libs/remix-ui/modal-dialog/src/lib/modal-dialog-custom.css":
/*!*******************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/modal-dialog/src/lib/modal-dialog-custom.css ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var content = __webpack_require__(/*! !../../../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??ref--5-oneOf-4-2!./modal-dialog-custom.css */ "../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../node_modules/postcss-loader/dist/cjs.js?!../../../libs/remix-ui/modal-dialog/src/lib/modal-dialog-custom.css");

if (typeof content === 'string') {
  content = [[module.i, content, '']];
}

var options = {}

options.insert = "head";
options.singleton = false;

var update = __webpack_require__(/*! ../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js")(content, options);

if (content.locals) {
  module.exports = content.locals;
}


/***/ }),

/***/ "../../../libs/remix-ui/modal-dialog/src/lib/modal-dialog-custom.tsx":
/*!*******************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/modal-dialog/src/lib/modal-dialog-custom.tsx ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ModalDialogCustom = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

__webpack_require__(/*! ./modal-dialog-custom.css */ "../../../libs/remix-ui/modal-dialog/src/lib/modal-dialog-custom.css");

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/modal-dialog/src/lib/modal-dialog-custom.tsx";

const ModalDialogCustom = props => {
  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
    children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("h1", {
      children: "Welcome to modal-dialog-custom!"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 11,
      columnNumber: 7
    }, void 0)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 10,
    columnNumber: 5
  }, void 0);
};

exports.ModalDialogCustom = ModalDialogCustom;
var _default = ModalDialogCustom;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/modal-dialog/src/lib/remix-ui-modal-dialog.css":
/*!*********************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/modal-dialog/src/lib/remix-ui-modal-dialog.css ***!
  \*********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var content = __webpack_require__(/*! !../../../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??ref--5-oneOf-4-2!./remix-ui-modal-dialog.css */ "../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../node_modules/postcss-loader/dist/cjs.js?!../../../libs/remix-ui/modal-dialog/src/lib/remix-ui-modal-dialog.css");

if (typeof content === 'string') {
  content = [[module.i, content, '']];
}

var options = {}

options.insert = "head";
options.singleton = false;

var update = __webpack_require__(/*! ../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js")(content, options);

if (content.locals) {
  module.exports = content.locals;
}


/***/ }),

/***/ "../../../libs/remix-ui/modal-dialog/src/lib/remix-ui-modal-dialog.tsx":
/*!*********************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/modal-dialog/src/lib/remix-ui-modal-dialog.tsx ***!
  \*********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ModalDialog = void 0;

var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

__webpack_require__(/*! ./remix-ui-modal-dialog.css */ "../../../libs/remix-ui/modal-dialog/src/lib/remix-ui-modal-dialog.css");

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/modal-dialog/src/lib/remix-ui-modal-dialog.tsx";

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const ModalDialog = props => {
  const [state, setState] = (0, _react.useState)({
    toggleBtn: true
  });
  const modal = (0, _react.useRef)(null);

  const handleHide = () => {
    props.handleHide();
  };

  (0, _react.useEffect)(() => {
    modal.current.focus();
  }, [props.hide]);
  (0, _react.useEffect)(() => {
    function handleBlur(e) {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        e.stopPropagation();

        if (document.activeElement !== this) {
          !window.testmode && handleHide();
        }
      }
    }

    if (modal.current) {
      modal.current.addEventListener('blur', handleBlur);
      return () => {
        modal.current.removeEventListener('blur', handleBlur);
      };
    }
  }, [modal.current]);

  const modalKeyEvent = keyCode => {
    if (keyCode === 27) {
      // Esc
      if (props.cancelFn) props.cancelFn();
      handleHide();
    } else if (keyCode === 13) {
      // Enter
      enterHandler();
    } else if (keyCode === 37) {
      // todo && footerIsActive) { // Arrow Left
      setState(prevState => {
        return _objectSpread(_objectSpread({}, prevState), {}, {
          toggleBtn: true
        });
      });
    } else if (keyCode === 39) {
      // todo && footerIsActive) { // Arrow Right
      setState(prevState => {
        return _objectSpread(_objectSpread({}, prevState), {}, {
          toggleBtn: false
        });
      });
    }
  };

  const enterHandler = () => {
    if (state.toggleBtn) {
      if (props.okFn) props.okFn();
    } else {
      if (props.cancelFn) props.cancelFn();
    }

    handleHide();
  };

  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
    "data-id": `${props.id}ModalDialogContainer-react`,
    "data-backdrop": "static",
    "data-keyboard": "false",
    className: "modal",
    style: {
      display: props.hide ? 'none' : 'block'
    },
    role: "dialog",
    children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
      className: "modal-dialog",
      role: "document",
      children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
        ref: modal,
        tabIndex: -1,
        className: 'modal-content remixModalContent ' + (props.modalClass ? props.modalClass : ''),
        onKeyDown: ({
          keyCode
        }) => {
          modalKeyEvent(keyCode);
        },
        children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
          className: "modal-header",
          children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("h6", {
            className: "modal-title",
            "data-id": `${props.id}ModalDialogModalTitle-react`,
            children: props.title && props.title
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 83,
            columnNumber: 13
          }, void 0), !props.showCancelIcon && /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("span", {
            className: "modal-close",
            onClick: () => handleHide(),
            children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("i", {
              title: "Close",
              className: "fas fa-times",
              "aria-hidden": "true"
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 88,
              columnNumber: 15
            }, void 0)
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 87,
            columnNumber: 13
          }, void 0)]
        }, void 0, true, {
          fileName: _jsxFileName,
          lineNumber: 82,
          columnNumber: 11
        }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
          className: "modal-body text-break remixModalBody",
          "data-id": `${props.id}ModalDialogModalBody-react`,
          children: props.children ? props.children : props.message
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 92,
          columnNumber: 11
        }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
          className: "modal-footer",
          "data-id": `${props.id}ModalDialogModalFooter-react`,
          children: [props.okLabel && /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("span", {
            "data-id": `${props.id}-modal-footer-ok-react`,
            className: 'modal-ok btn btn-sm ' + (state.toggleBtn ? 'btn-dark' : 'btn-light'),
            onClick: () => {
              if (props.okFn) props.okFn();
              handleHide();
            },
            children: props.okLabel ? props.okLabel : 'OK'
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 98,
            columnNumber: 15
          }, void 0), props.cancelLabel && /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("span", {
            "data-id": `${props.id}-modal-footer-cancel-react`,
            className: 'modal-cancel btn btn-sm ' + (state.toggleBtn ? 'btn-light' : 'btn-dark'),
            "data-dismiss": "modal",
            onClick: () => {
              if (props.cancelFn) props.cancelFn();
              handleHide();
            },
            children: props.cancelLabel ? props.cancelLabel : 'Cancel'
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 110,
            columnNumber: 15
          }, void 0)]
        }, void 0, true, {
          fileName: _jsxFileName,
          lineNumber: 95,
          columnNumber: 11
        }, void 0)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 76,
        columnNumber: 9
      }, void 0)
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 75,
      columnNumber: 7
    }, void 0)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 67,
    columnNumber: 5
  }, void 0);
};

exports.ModalDialog = ModalDialog;
var _default = ModalDialog;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/toaster/src/index.ts":
/*!*******************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/toaster/src/index.ts ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toaster = __webpack_require__(/*! ./lib/toaster */ "../../../libs/remix-ui/toaster/src/lib/toaster.tsx");

Object.keys(_toaster).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _toaster[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _toaster[key];
    }
  });
});

/***/ }),

/***/ "../../../libs/remix-ui/toaster/src/lib/toaster.css":
/*!**************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/toaster/src/lib/toaster.css ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var content = __webpack_require__(/*! !../../../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??ref--5-oneOf-4-2!./toaster.css */ "../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../node_modules/postcss-loader/dist/cjs.js?!../../../libs/remix-ui/toaster/src/lib/toaster.css");

if (typeof content === 'string') {
  content = [[module.i, content, '']];
}

var options = {}

options.insert = "head";
options.singleton = false;

var update = __webpack_require__(/*! ../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js")(content, options);

if (content.locals) {
  module.exports = content.locals;
}


/***/ }),

/***/ "../../../libs/remix-ui/toaster/src/lib/toaster.tsx":
/*!**************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/toaster/src/lib/toaster.tsx ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Toaster = void 0;

var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

var _modalDialog = __webpack_require__(/*! @remix-ui/modal-dialog */ "../../../libs/remix-ui/modal-dialog/src/index.ts");

__webpack_require__(/*! ./toaster.css */ "../../../libs/remix-ui/toaster/src/lib/toaster.css");

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/toaster/src/lib/toaster.tsx";

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const Toaster = props => {
  const [state, setState] = (0, _react.useState)({
    message: '',
    hide: true,
    hiding: false,
    timeOutId: null,
    timeOut: props.timeOut || 7000,
    showModal: false
  });
  (0, _react.useEffect)(() => {
    if (props.message) {
      const timeOutId = setTimeout(() => {
        setState(prevState => {
          return _objectSpread(_objectSpread({}, prevState), {}, {
            hiding: true
          });
        });
      }, state.timeOut);
      setState(prevState => {
        const shortTooltipText = props.message.length > 201 ? props.message.substring(0, 200) + '...' : props.message;
        return _objectSpread(_objectSpread({}, prevState), {}, {
          hide: false,
          hiding: false,
          timeOutId,
          message: shortTooltipText
        });
      });
    }
  }, [props.message]);
  (0, _react.useEffect)(() => {
    if (state.hiding) {
      setTimeout(() => {
        closeTheToaster();
      }, 1800);
    }
  }, [state.hiding]);

  const showFullMessage = () => {
    setState(prevState => {
      return _objectSpread(_objectSpread({}, prevState), {}, {
        showModal: true
      });
    });
  };

  const hideFullMessage = () => {
    //eslint-disable-line
    setState(prevState => {
      return _objectSpread(_objectSpread({}, prevState), {}, {
        showModal: false
      });
    });
  };

  const closeTheToaster = () => {
    if (state.timeOutId) {
      clearTimeout(state.timeOutId);
    }

    props.handleHide && props.handleHide();
    setState(prevState => {
      return _objectSpread(_objectSpread({}, prevState), {}, {
        message: '',
        hide: true,
        hiding: false,
        timeOutId: null,
        showModal: false
      });
    });
  };

  const handleMouseEnter = () => {
    if (state.timeOutId) {
      clearTimeout(state.timeOutId);
    }

    setState(prevState => {
      return _objectSpread(_objectSpread({}, prevState), {}, {
        timeOutId: null
      });
    });
  };

  const handleMouseLeave = () => {
    if (!state.timeOutId) {
      const timeOutId = setTimeout(() => {
        setState(prevState => {
          return _objectSpread(_objectSpread({}, prevState), {}, {
            hiding: true
          });
        });
      }, state.timeOut);
      setState(prevState => {
        return _objectSpread(_objectSpread({}, prevState), {}, {
          timeOutId
        });
      });
    }
  };

  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_jsxDevRuntime.Fragment, {
    children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_modalDialog.ModalDialog, {
      message: props.message,
      cancelLabel: "Close",
      cancelFn: () => {},
      hide: !state.showModal,
      handleHide: hideFullMessage
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 94,
      columnNumber: 7
    }, void 0), !state.hide && /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
      "data-shared": "tooltipPopup",
      className: `remixui_tooltip alert alert-info p-2 ${state.hiding ? 'remixui_animateTop' : 'remixui_animateBottom'}`,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("span", {
        className: "px-2",
        children: [state.message, props.message.length > 201 && /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("button", {
          className: "btn btn-secondary btn-sm mx-3",
          style: {
            whiteSpace: 'nowrap'
          },
          onClick: showFullMessage,
          children: "Show full message"
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 105,
          columnNumber: 47
        }, void 0)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 103,
        columnNumber: 11
      }, void 0), /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("span", {
        style: {
          alignSelf: 'baseline'
        },
        children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("button", {
          "data-id": "tooltipCloseButton",
          className: "fas fa-times btn-info mx-1 p-0",
          onClick: closeTheToaster
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 108,
          columnNumber: 13
        }, void 0)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 107,
        columnNumber: 11
      }, void 0)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 102,
      columnNumber: 9
    }, void 0)]
  }, void 0, true);
};

exports.Toaster = Toaster;
var _default = Toaster;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/tree-view/src/index.ts":
/*!*********************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/tree-view/src/index.ts ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _treeViewItem = __webpack_require__(/*! ./lib/tree-view-item/tree-view-item */ "../../../libs/remix-ui/tree-view/src/lib/tree-view-item/tree-view-item.tsx");

Object.keys(_treeViewItem).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _treeViewItem[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _treeViewItem[key];
    }
  });
});

var _remixUiTreeView = __webpack_require__(/*! ./lib/remix-ui-tree-view */ "../../../libs/remix-ui/tree-view/src/lib/remix-ui-tree-view.tsx");

Object.keys(_remixUiTreeView).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _remixUiTreeView[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _remixUiTreeView[key];
    }
  });
});

/***/ }),

/***/ "../../../libs/remix-ui/tree-view/src/lib/remix-ui-tree-view.css":
/*!***************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/tree-view/src/lib/remix-ui-tree-view.css ***!
  \***************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var content = __webpack_require__(/*! !../../../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??ref--5-oneOf-4-2!./remix-ui-tree-view.css */ "../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../node_modules/postcss-loader/dist/cjs.js?!../../../libs/remix-ui/tree-view/src/lib/remix-ui-tree-view.css");

if (typeof content === 'string') {
  content = [[module.i, content, '']];
}

var options = {}

options.insert = "head";
options.singleton = false;

var update = __webpack_require__(/*! ../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js")(content, options);

if (content.locals) {
  module.exports = content.locals;
}


/***/ }),

/***/ "../../../libs/remix-ui/tree-view/src/lib/remix-ui-tree-view.tsx":
/*!***************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/tree-view/src/lib/remix-ui-tree-view.tsx ***!
  \***************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TreeView = void 0;

var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty.js"));

var _objectWithoutProperties2 = _interopRequireDefault(__webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

__webpack_require__(/*! ./remix-ui-tree-view.css */ "../../../libs/remix-ui/tree-view/src/lib/remix-ui-tree-view.css");

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

const _excluded = ["children", "id"];
var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/tree-view/src/lib/remix-ui-tree-view.tsx";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const TreeView = props => {
  const {
    children,
    id
  } = props,
        otherProps = (0, _objectWithoutProperties2.default)(props, _excluded);
  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("ul", _objectSpread(_objectSpread({
    "data-id": `treeViewUl${id}`,
    className: "ul_tv ml-0 px-2"
  }, otherProps), {}, {
    children: children
  }), void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 10,
    columnNumber: 5
  }, void 0);
};

exports.TreeView = TreeView;
var _default = TreeView;
exports.default = _default;

/***/ }),

/***/ "../../../libs/remix-ui/tree-view/src/lib/tree-view-item/tree-view-item.css":
/*!**************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/tree-view/src/lib/tree-view-item/tree-view-item.css ***!
  \**************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var content = __webpack_require__(/*! !../../../../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??ref--5-oneOf-4-2!./tree-view-item.css */ "../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../node_modules/postcss-loader/dist/cjs.js?!../../../libs/remix-ui/tree-view/src/lib/tree-view-item/tree-view-item.css");

if (typeof content === 'string') {
  content = [[module.i, content, '']];
}

var options = {}

options.insert = "head";
options.singleton = false;

var update = __webpack_require__(/*! ../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js")(content, options);

if (content.locals) {
  module.exports = content.locals;
}


/***/ }),

/***/ "../../../libs/remix-ui/tree-view/src/lib/tree-view-item/tree-view-item.tsx":
/*!**************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/tree-view/src/lib/tree-view-item/tree-view-item.tsx ***!
  \**************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TreeViewItem = void 0;

var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty.js"));

var _objectWithoutProperties2 = _interopRequireDefault(__webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

__webpack_require__(/*! ./tree-view-item.css */ "../../../libs/remix-ui/tree-view/src/lib/tree-view-item/tree-view-item.css");

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

const _excluded = ["id", "children", "label", "labelClass", "expand", "iconX", "iconY", "icon", "controlBehaviour", "innerRef"];
var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/tree-view/src/lib/tree-view-item/tree-view-item.tsx";

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const TreeViewItem = props => {
  const {
    id,
    children,
    label,
    labelClass,
    expand,
    iconX = 'fas fa-caret-right',
    iconY = 'fas fa-caret-down',
    icon,
    controlBehaviour = false,
    innerRef
  } = props,
        otherProps = (0, _objectWithoutProperties2.default)(props, _excluded);
  const [isExpanded, setIsExpanded] = (0, _react.useState)(false);
  (0, _react.useEffect)(() => {
    setIsExpanded(expand);
  }, [expand]);
  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("li", _objectSpread(_objectSpread({
    ref: innerRef,
    "data-id": `treeViewLi${id}`,
    className: "li_tv"
  }, otherProps), {}, {
    children: [/*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
      "data-id": `treeViewDiv${id}`,
      className: `d-flex flex-row align-items-center ${labelClass}`,
      onClick: () => !controlBehaviour && setIsExpanded(!isExpanded),
      children: [children ? /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
        className: isExpanded ? `px-1 ${iconY} caret caret_tv` : `px-1 ${iconX} caret caret_tv`,
        style: {
          visibility: children ? 'visible' : 'hidden'
        }
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 17,
        columnNumber: 22
      }, void 0) : icon ? /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
        className: `pr-3 pl-1 ${icon} caret caret_tv`
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 17,
        columnNumber: 188
      }, void 0) : null, /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("span", {
        className: "w-100 pl-1",
        children: label
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 18,
        columnNumber: 9
      }, void 0)]
    }, `treeViewDiv${id}`, true, {
      fileName: _jsxFileName,
      lineNumber: 16,
      columnNumber: 7
    }, void 0), isExpanded ? children : null]
  }), `treeViewLi${id}`, true, {
    fileName: _jsxFileName,
    lineNumber: 15,
    columnNumber: 5
  }, void 0);
};

exports.TreeViewItem = TreeViewItem;
var _default = TreeViewItem;
exports.default = _default;

/***/ }),

/***/ "../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../node_modules/postcss-loader/dist/cjs.js?!../../../libs/remix-ui/clipboard/src/lib/copy-to-clipboard/copy-to-clipboard.css":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!/Users/anil/github/anilChinchawale/remix-project/node_modules/postcss-loader/dist/cjs.js??ref--5-oneOf-4-2!/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/clipboard/src/lib/copy-to-clipboard/copy-to-clipboard.css ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = [[module.i, ".copyIcon {\n    margin-left: 5px;\n    cursor: pointer;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcHktdG8tY2xpcGJvYXJkLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUNJLGdCQUFnQjtJQUNoQixlQUFlO0FBQ25CIiwiZmlsZSI6ImNvcHktdG8tY2xpcGJvYXJkLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5jb3B5SWNvbiB7XG4gICAgbWFyZ2luLWxlZnQ6IDVweDtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG59Il19 */", '', '']]

/***/ }),

/***/ "../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../node_modules/postcss-loader/dist/cjs.js?!../../../libs/remix-ui/debugger-ui/src/lib/button-navigator/button-navigator.css":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!/Users/anil/github/anilChinchawale/remix-project/node_modules/postcss-loader/dist/cjs.js??ref--5-oneOf-4-2!/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/button-navigator/button-navigator.css ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = [[module.i, ".buttons {\n    display: flex;\n    flex-wrap: wrap;\n}\n.stepButtons {\n    width: 100%;\n    display: flex;\n    justify-content: center;\n}\n.stepButton {\n}\n.jumpButtons {\n    width: 100%;\n    display: flex;\n    justify-content: center;\n}\n.jumpButton {\n}\n.navigator {\n}\n.navigator:hover {\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1dHRvbi1uYXZpZ2F0b3IuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksYUFBYTtJQUNiLGVBQWU7QUFDbkI7QUFDQTtJQUNJLFdBQVc7SUFDWCxhQUFhO0lBQ2IsdUJBQXVCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0lBQ0ksV0FBVztJQUNYLGFBQWE7SUFDYix1QkFBdUI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnV0dG9uLW5hdmlnYXRvci5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuYnV0dG9ucyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LXdyYXA6IHdyYXA7XG59XG4uc3RlcEJ1dHRvbnMge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG4uc3RlcEJ1dHRvbiB7XG59XG4uanVtcEJ1dHRvbnMge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG4uanVtcEJ1dHRvbiB7XG59XG4ubmF2aWdhdG9yIHtcbn1cbi5uYXZpZ2F0b3I6aG92ZXIge1xufSJdfQ== */", '', '']]

/***/ }),

/***/ "../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../node_modules/postcss-loader/dist/cjs.js?!../../../libs/remix-ui/debugger-ui/src/lib/debugger-ui.css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!/Users/anil/github/anilChinchawale/remix-project/node_modules/postcss-loader/dist/cjs.js??ref--5-oneOf-4-2!/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/debugger-ui.css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = [[module.i, ".statusMessage {\n  margin-left: 15px;\n}\n.debuggerLabel {\n  margin-bottom: 2px;\n  font-size: 11px;\n  line-height: 12px;\n  text-transform: uppercase;\n}\n.debuggerConfig {\n  display: flex;\n  align-items: center;\n}\n.debuggerConfig label {\n  margin: 0;\n}\n.validationError {\n  overflow-wrap: break-word;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlYnVnZ2VyLXVpLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGlCQUFpQjtBQUNuQjtBQUNBO0VBQ0Usa0JBQWtCO0VBQ2xCLGVBQWU7RUFDZixpQkFBaUI7RUFDakIseUJBQXlCO0FBQzNCO0FBQ0E7RUFDRSxhQUFhO0VBQ2IsbUJBQW1CO0FBQ3JCO0FBQ0E7RUFDRSxTQUFTO0FBQ1g7QUFDQTtFQUNFLHlCQUF5QjtBQUMzQiIsImZpbGUiOiJkZWJ1Z2dlci11aS5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuc3RhdHVzTWVzc2FnZSB7XG4gIG1hcmdpbi1sZWZ0OiAxNXB4O1xufVxuLmRlYnVnZ2VyTGFiZWwge1xuICBtYXJnaW4tYm90dG9tOiAycHg7XG4gIGZvbnQtc2l6ZTogMTFweDtcbiAgbGluZS1oZWlnaHQ6IDEycHg7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG59XG4uZGVidWdnZXJDb25maWcge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuLmRlYnVnZ2VyQ29uZmlnIGxhYmVsIHtcbiAgbWFyZ2luOiAwO1xufVxuLnZhbGlkYXRpb25FcnJvciB7XG4gIG92ZXJmbG93LXdyYXA6IGJyZWFrLXdvcmQ7XG59Il19 */", '', '']]

/***/ }),

/***/ "../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../node_modules/postcss-loader/dist/cjs.js?!../../../libs/remix-ui/debugger-ui/src/lib/tx-browser/tx-browser.css":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!/Users/anil/github/anilChinchawale/remix-project/node_modules/postcss-loader/dist/cjs.js??ref--5-oneOf-4-2!/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/tx-browser/tx-browser.css ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = [[module.i, ".container {\n    display: flex;\n    flex-direction: column;\n}\n.txContainer {\n    display: flex;\n    flex-direction: column;\n}\n.txinput {\n    width: inherit;\n    font-size: small;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n.txbutton {\n    width: inherit;\n}\n.txbutton:hover {\n}\n.vmargin {\n    margin-top: 10px;\n    margin-bottom: 10px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInR4LWJyb3dzZXIuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtBQUMxQjtBQUNBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtBQUMxQjtBQUNBO0lBQ0ksY0FBYztJQUNkLGdCQUFnQjtJQUNoQixtQkFBbUI7SUFDbkIsZ0JBQWdCO0lBQ2hCLHVCQUF1QjtBQUMzQjtBQUNBO0lBQ0ksY0FBYztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtJQUNJLGdCQUFnQjtJQUNoQixtQkFBbUI7QUFDdkIiLCJmaWxlIjoidHgtYnJvd3Nlci5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuY29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG59XG4udHhDb250YWluZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbn1cbi50eGlucHV0IHtcbiAgICB3aWR0aDogaW5oZXJpdDtcbiAgICBmb250LXNpemU6IHNtYWxsO1xuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbn1cbi50eGJ1dHRvbiB7XG4gICAgd2lkdGg6IGluaGVyaXQ7XG59XG4udHhidXR0b246aG92ZXIge1xufVxuLnZtYXJnaW4ge1xuICAgIG1hcmdpbi10b3A6IDEwcHg7XG4gICAgbWFyZ2luLWJvdHRvbTogMTBweDtcbn0iXX0= */", '', '']]

/***/ }),

/***/ "../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../node_modules/postcss-loader/dist/cjs.js?!../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/styles/assembly-items.css":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!/Users/anil/github/anilChinchawale/remix-project/node_modules/postcss-loader/dist/cjs.js??ref--5-oneOf-4-2!/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/styles/assembly-items.css ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = [[module.i, ".instructions {\n    overflow-y: scroll;\n    max-height: 130px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2VtYmx5LWl0ZW1zLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUNJLGtCQUFrQjtJQUNsQixpQkFBaUI7QUFDckIiLCJmaWxlIjoiYXNzZW1ibHktaXRlbXMuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmluc3RydWN0aW9ucyB7XG4gICAgb3ZlcmZsb3cteTogc2Nyb2xsO1xuICAgIG1heC1oZWlnaHQ6IDEzMHB4O1xufSJdfQ== */", '', '']]

/***/ }),

/***/ "../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../node_modules/postcss-loader/dist/cjs.js?!../../../libs/remix-ui/debugger-ui/src/lib/vm-debugger/styles/dropdown-panel.css":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!/Users/anil/github/anilChinchawale/remix-project/node_modules/postcss-loader/dist/cjs.js??ref--5-oneOf-4-2!/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/debugger-ui/src/lib/vm-debugger/styles/dropdown-panel.css ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = [[module.i, ".title {\n    display: flex;\n    align-items: center;\n  }\n  .name {\n    font-weight: bold;\n  }\n  .nameDetail {\n    font-weight: bold;\n    margin-left: 3px;\n  }\n  .icon {\n    margin-right: 5%;\n  }\n  .eyeButton {\n    margin: 3px;\n  }\n  .dropdownpanel {\n    width: 100%;\n    word-break: break-word;\n  }\n  .dropdownrawcontent {\n    padding: 2px;\n    word-break: break-word;\n  }\n  .message {\n    padding: 2px;\n    word-break: break-word;\n  }\n  .refresh {\n    display: none;\n    margin-left: 4px;\n    margin-top: 4px; \n    -webkit-animation: spin 2s linear infinite; \n            animation: spin 2s linear infinite;\n  }\n  .cursor_pointer {\n    cursor: pointer;\n  }\n  @-webkit-keyframes spin {\n    to { -webkit-transform: rotate(359deg); }\n  }\n  @keyframes spin {\n    to {transform:rotate(359deg);}\n  }\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRyb3Bkb3duLXBhbmVsLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7RUFDckI7RUFDQTtJQUNFLGlCQUFpQjtFQUNuQjtFQUNBO0lBQ0UsaUJBQWlCO0lBQ2pCLGdCQUFnQjtFQUNsQjtFQUNBO0lBQ0UsZ0JBQWdCO0VBQ2xCO0VBQ0E7SUFDRSxXQUFXO0VBQ2I7RUFDQTtJQUNFLFdBQVc7SUFDWCxzQkFBc0I7RUFDeEI7RUFDQTtJQUNFLFlBQVk7SUFDWixzQkFBc0I7RUFDeEI7RUFDQTtJQUNFLFlBQVk7SUFDWixzQkFBc0I7RUFDeEI7RUFDQTtJQUNFLGFBQWE7SUFDYixnQkFBZ0I7SUFDaEIsZUFBZTtJQUNmLDBDQUFrQztZQUFsQyxrQ0FBa0M7RUFDcEM7RUFDQTtJQUNFLGVBQWU7RUFDakI7RUFJQTtJQUNFLEtBQUssaUNBQWlDLEVBQUU7RUFDMUM7RUFDQTtJQUNFLElBQUksd0JBQXdCLENBQUM7RUFDL0IiLCJmaWxlIjoiZHJvcGRvd24tcGFuZWwuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnRpdGxlIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIH1cbiAgLm5hbWUge1xuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICB9XG4gIC5uYW1lRGV0YWlsIHtcbiAgICBmb250LXdlaWdodDogYm9sZDtcbiAgICBtYXJnaW4tbGVmdDogM3B4O1xuICB9XG4gIC5pY29uIHtcbiAgICBtYXJnaW4tcmlnaHQ6IDUlO1xuICB9XG4gIC5leWVCdXR0b24ge1xuICAgIG1hcmdpbjogM3B4O1xuICB9XG4gIC5kcm9wZG93bnBhbmVsIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICB3b3JkLWJyZWFrOiBicmVhay13b3JkO1xuICB9XG4gIC5kcm9wZG93bnJhd2NvbnRlbnQge1xuICAgIHBhZGRpbmc6IDJweDtcbiAgICB3b3JkLWJyZWFrOiBicmVhay13b3JkO1xuICB9XG4gIC5tZXNzYWdlIHtcbiAgICBwYWRkaW5nOiAycHg7XG4gICAgd29yZC1icmVhazogYnJlYWstd29yZDtcbiAgfVxuICAucmVmcmVzaCB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgICBtYXJnaW4tbGVmdDogNHB4O1xuICAgIG1hcmdpbi10b3A6IDRweDsgXG4gICAgYW5pbWF0aW9uOiBzcGluIDJzIGxpbmVhciBpbmZpbml0ZTtcbiAgfVxuICAuY3Vyc29yX3BvaW50ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgfVxuICBALW1vei1rZXlmcmFtZXMgc3BpbiB7XG4gICAgdG8geyAtbW96LXRyYW5zZm9ybTogcm90YXRlKDM1OWRlZyk7IH1cbiAgfVxuICBALXdlYmtpdC1rZXlmcmFtZXMgc3BpbiB7XG4gICAgdG8geyAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDM1OWRlZyk7IH1cbiAgfVxuICBAa2V5ZnJhbWVzIHNwaW4ge1xuICAgIHRvIHt0cmFuc2Zvcm06cm90YXRlKDM1OWRlZyk7fVxuICB9Il19 */", '', '']]

/***/ }),

/***/ "../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../node_modules/postcss-loader/dist/cjs.js?!../../../libs/remix-ui/modal-dialog/src/lib/modal-dialog-custom.css":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!/Users/anil/github/anilChinchawale/remix-project/node_modules/postcss-loader/dist/cjs.js??ref--5-oneOf-4-2!/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/modal-dialog/src/lib/modal-dialog-custom.css ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = [[module.i, "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJtb2RhbC1kaWFsb2ctY3VzdG9tLmNzcyJ9 */", '', '']]

/***/ }),

/***/ "../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../node_modules/postcss-loader/dist/cjs.js?!../../../libs/remix-ui/modal-dialog/src/lib/remix-ui-modal-dialog.css":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!/Users/anil/github/anilChinchawale/remix-project/node_modules/postcss-loader/dist/cjs.js??ref--5-oneOf-4-2!/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/modal-dialog/src/lib/remix-ui-modal-dialog.css ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = [[module.i, ".remixModalContent {\n  box-shadow: 0 0 8px 10000px rgba(0,0,0,0.6),0 6px 20px 0 rgba(0,0,0,0.19);\n  -webkit-animation-name: animatetop;\n  -webkit-animation-duration: 0.4s;\n  animation-name: animatetop;\n  animation-duration: 0.4s\n}\n.remixModalBody {\n  overflow-y: auto;\n  max-height: 600px;\n}\n@-webkit-keyframes animatetop {\n  from {top: -300px; opacity: 0}\n  to {top: 0; opacity: 1}\n}\n@keyframes animatetop {\n  from {top: -300px; opacity: 0}\n  to {top: 0; opacity: 1}\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbWl4LXVpLW1vZGFsLWRpYWxvZy5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSx5RUFBeUU7RUFDekUsa0NBQWtDO0VBQ2xDLGdDQUFnQztFQUNoQywwQkFBMEI7RUFDMUI7QUFDRjtBQUNBO0VBQ0UsZ0JBQWdCO0VBQ2hCLGlCQUFpQjtBQUNuQjtBQUNBO0VBQ0UsTUFBTSxXQUFXLEVBQUUsVUFBVTtFQUM3QixJQUFJLE1BQU0sRUFBRSxVQUFVO0FBQ3hCO0FBQ0E7RUFDRSxNQUFNLFdBQVcsRUFBRSxVQUFVO0VBQzdCLElBQUksTUFBTSxFQUFFLFVBQVU7QUFDeEIiLCJmaWxlIjoicmVtaXgtdWktbW9kYWwtZGlhbG9nLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5yZW1peE1vZGFsQ29udGVudCB7XG4gIGJveC1zaGFkb3c6IDAgMCA4cHggMTAwMDBweCByZ2JhKDAsMCwwLDAuNiksMCA2cHggMjBweCAwIHJnYmEoMCwwLDAsMC4xOSk7XG4gIC13ZWJraXQtYW5pbWF0aW9uLW5hbWU6IGFuaW1hdGV0b3A7XG4gIC13ZWJraXQtYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjRzO1xuICBhbmltYXRpb24tbmFtZTogYW5pbWF0ZXRvcDtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjRzXG59XG4ucmVtaXhNb2RhbEJvZHkge1xuICBvdmVyZmxvdy15OiBhdXRvO1xuICBtYXgtaGVpZ2h0OiA2MDBweDtcbn1cbkAtd2Via2l0LWtleWZyYW1lcyBhbmltYXRldG9wIHtcbiAgZnJvbSB7dG9wOiAtMzAwcHg7IG9wYWNpdHk6IDB9XG4gIHRvIHt0b3A6IDA7IG9wYWNpdHk6IDF9XG59XG5Aa2V5ZnJhbWVzIGFuaW1hdGV0b3Age1xuICBmcm9tIHt0b3A6IC0zMDBweDsgb3BhY2l0eTogMH1cbiAgdG8ge3RvcDogMDsgb3BhY2l0eTogMX1cbn0iXX0= */", '', '']]

/***/ }),

/***/ "../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../node_modules/postcss-loader/dist/cjs.js?!../../../libs/remix-ui/toaster/src/lib/toaster.css":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!/Users/anil/github/anilChinchawale/remix-project/node_modules/postcss-loader/dist/cjs.js??ref--5-oneOf-4-2!/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/toaster/src/lib/toaster.css ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = [[module.i, ".remixui_tooltip {\n    z-index: 1001;\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    position: fixed;\n    min-height: 50px;\n    padding: 16px 24px 12px;\n    border-radius: 3px;\n    left: 40%;\n    font-size: 14px;\n    text-align: center;\n    bottom: -0px;\n    flex-direction: row;\n}\n@-webkit-keyframes remixui_animatebottom  {\n  0% {bottom: -300px}\n  100% {bottom: 0px}\n}\n@keyframes remixui_animatebottom  {\n  0% {bottom: -300px}\n  100% {bottom: 0px}\n}\n@-webkit-keyframes remixui_animatetop  {\n  0% {bottom: 0px}\n  100% {bottom: -300px}\n}\n@keyframes remixui_animatetop  {\n  0% {bottom: 0px}\n  100% {bottom: -300px}\n}\n.remixui_animateTop {\n  -webkit-animation-name: remixui_animatetop;\n  -webkit-animation-duration: 2s;\n  animation-name: remixui_animatetop;\n  animation-duration: 2s;\n}\n.remixui_animateBottom {\n  -webkit-animation-name: remixui_animatebottom;\n  -webkit-animation-duration: 2s;\n  animation-name: remixui_animatebottom;\n  animation-duration: 2s;    \n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvYXN0ZXIuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksYUFBYTtJQUNiLGFBQWE7SUFDYiw4QkFBOEI7SUFDOUIsbUJBQW1CO0lBQ25CLGVBQWU7SUFDZixnQkFBZ0I7SUFDaEIsdUJBQXVCO0lBQ3ZCLGtCQUFrQjtJQUNsQixTQUFTO0lBQ1QsZUFBZTtJQUNmLGtCQUFrQjtJQUNsQixZQUFZO0lBQ1osbUJBQW1CO0FBQ3ZCO0FBQ0E7RUFDRSxJQUFJLGNBQWM7RUFDbEIsTUFBTSxXQUFXO0FBQ25CO0FBQ0E7RUFDRSxJQUFJLGNBQWM7RUFDbEIsTUFBTSxXQUFXO0FBQ25CO0FBQ0E7RUFDRSxJQUFJLFdBQVc7RUFDZixNQUFNLGNBQWM7QUFDdEI7QUFDQTtFQUNFLElBQUksV0FBVztFQUNmLE1BQU0sY0FBYztBQUN0QjtBQUNBO0VBQ0UsMENBQTBDO0VBQzFDLDhCQUE4QjtFQUM5QixrQ0FBa0M7RUFDbEMsc0JBQXNCO0FBQ3hCO0FBQ0E7RUFDRSw2Q0FBNkM7RUFDN0MsOEJBQThCO0VBQzlCLHFDQUFxQztFQUNyQyxzQkFBc0I7QUFDeEIiLCJmaWxlIjoidG9hc3Rlci5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIucmVtaXh1aV90b29sdGlwIHtcbiAgICB6LWluZGV4OiAxMDAxO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIG1pbi1oZWlnaHQ6IDUwcHg7XG4gICAgcGFkZGluZzogMTZweCAyNHB4IDEycHg7XG4gICAgYm9yZGVyLXJhZGl1czogM3B4O1xuICAgIGxlZnQ6IDQwJTtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIGJvdHRvbTogLTBweDtcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xufVxuQC13ZWJraXQta2V5ZnJhbWVzIHJlbWl4dWlfYW5pbWF0ZWJvdHRvbSAge1xuICAwJSB7Ym90dG9tOiAtMzAwcHh9XG4gIDEwMCUge2JvdHRvbTogMHB4fVxufVxuQGtleWZyYW1lcyByZW1peHVpX2FuaW1hdGVib3R0b20gIHtcbiAgMCUge2JvdHRvbTogLTMwMHB4fVxuICAxMDAlIHtib3R0b206IDBweH1cbn1cbkAtd2Via2l0LWtleWZyYW1lcyByZW1peHVpX2FuaW1hdGV0b3AgIHtcbiAgMCUge2JvdHRvbTogMHB4fVxuICAxMDAlIHtib3R0b206IC0zMDBweH1cbn1cbkBrZXlmcmFtZXMgcmVtaXh1aV9hbmltYXRldG9wICB7XG4gIDAlIHtib3R0b206IDBweH1cbiAgMTAwJSB7Ym90dG9tOiAtMzAwcHh9XG59XG4ucmVtaXh1aV9hbmltYXRlVG9wIHtcbiAgLXdlYmtpdC1hbmltYXRpb24tbmFtZTogcmVtaXh1aV9hbmltYXRldG9wO1xuICAtd2Via2l0LWFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1uYW1lOiByZW1peHVpX2FuaW1hdGV0b3A7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG59XG4ucmVtaXh1aV9hbmltYXRlQm90dG9tIHtcbiAgLXdlYmtpdC1hbmltYXRpb24tbmFtZTogcmVtaXh1aV9hbmltYXRlYm90dG9tO1xuICAtd2Via2l0LWFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1uYW1lOiByZW1peHVpX2FuaW1hdGVib3R0b207XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7ICAgIFxufVxuIl19 */", '', '']]

/***/ }),

/***/ "../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../node_modules/postcss-loader/dist/cjs.js?!../../../libs/remix-ui/tree-view/src/lib/remix-ui-tree-view.css":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!/Users/anil/github/anilChinchawale/remix-project/node_modules/postcss-loader/dist/cjs.js??ref--5-oneOf-4-2!/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/tree-view/src/lib/remix-ui-tree-view.css ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = [[module.i, ".li_tv {\n    list-style-type: none;\n    -webkit-margin-before: 0px;\n    -webkit-margin-after: 0px;\n    -webkit-margin-start: 0px;\n    -webkit-margin-end: 0px;\n    -webkit-padding-start: 0px;\n  }\n  .ul_tv {\n    list-style-type: none;\n    -webkit-margin-before: 0px;\n    -webkit-margin-after: 0px;\n    -webkit-margin-start: 0px;\n    -webkit-margin-end: 0px;\n    -webkit-padding-start: 0px;\n  }\n  .caret_tv {\n    width: 10px;\n    flex-shrink: 0;\n    padding-right: 5px;\n  }\n  .label_item {\n    word-break: break-all;\n  }\n  .label_key {\n    min-width: -webkit-max-content;\n    min-width: -moz-max-content;\n    min-width: max-content;\n    max-width: 80%;\n    word-break: break-word;\n  }\n  .label_value {\n    min-width: 10%;\n  }\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbWl4LXVpLXRyZWUtdmlldy5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxxQkFBcUI7SUFDckIsMEJBQTBCO0lBQzFCLHlCQUF5QjtJQUN6Qix5QkFBeUI7SUFDekIsdUJBQXVCO0lBQ3ZCLDBCQUEwQjtFQUM1QjtFQUNBO0lBQ0UscUJBQXFCO0lBQ3JCLDBCQUEwQjtJQUMxQix5QkFBeUI7SUFDekIseUJBQXlCO0lBQ3pCLHVCQUF1QjtJQUN2QiwwQkFBMEI7RUFDNUI7RUFDQTtJQUNFLFdBQVc7SUFDWCxjQUFjO0lBQ2Qsa0JBQWtCO0VBQ3BCO0VBQ0E7SUFDRSxxQkFBcUI7RUFDdkI7RUFDQTtJQUNFLDhCQUFzQjtJQUF0QiwyQkFBc0I7SUFBdEIsc0JBQXNCO0lBQ3RCLGNBQWM7SUFDZCxzQkFBc0I7RUFDeEI7RUFDQTtJQUNFLGNBQWM7RUFDaEIiLCJmaWxlIjoicmVtaXgtdWktdHJlZS12aWV3LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5saV90diB7XG4gICAgbGlzdC1zdHlsZS10eXBlOiBub25lO1xuICAgIC13ZWJraXQtbWFyZ2luLWJlZm9yZTogMHB4O1xuICAgIC13ZWJraXQtbWFyZ2luLWFmdGVyOiAwcHg7XG4gICAgLXdlYmtpdC1tYXJnaW4tc3RhcnQ6IDBweDtcbiAgICAtd2Via2l0LW1hcmdpbi1lbmQ6IDBweDtcbiAgICAtd2Via2l0LXBhZGRpbmctc3RhcnQ6IDBweDtcbiAgfVxuICAudWxfdHYge1xuICAgIGxpc3Qtc3R5bGUtdHlwZTogbm9uZTtcbiAgICAtd2Via2l0LW1hcmdpbi1iZWZvcmU6IDBweDtcbiAgICAtd2Via2l0LW1hcmdpbi1hZnRlcjogMHB4O1xuICAgIC13ZWJraXQtbWFyZ2luLXN0YXJ0OiAwcHg7XG4gICAgLXdlYmtpdC1tYXJnaW4tZW5kOiAwcHg7XG4gICAgLXdlYmtpdC1wYWRkaW5nLXN0YXJ0OiAwcHg7XG4gIH1cbiAgLmNhcmV0X3R2IHtcbiAgICB3aWR0aDogMTBweDtcbiAgICBmbGV4LXNocmluazogMDtcbiAgICBwYWRkaW5nLXJpZ2h0OiA1cHg7XG4gIH1cbiAgLmxhYmVsX2l0ZW0ge1xuICAgIHdvcmQtYnJlYWs6IGJyZWFrLWFsbDtcbiAgfVxuICAubGFiZWxfa2V5IHtcbiAgICBtaW4td2lkdGg6IG1heC1jb250ZW50O1xuICAgIG1heC13aWR0aDogODAlO1xuICAgIHdvcmQtYnJlYWs6IGJyZWFrLXdvcmQ7XG4gIH1cbiAgLmxhYmVsX3ZhbHVlIHtcbiAgICBtaW4td2lkdGg6IDEwJTtcbiAgfSJdfQ== */", '', '']]

/***/ }),

/***/ "../../../node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!../../../node_modules/postcss-loader/dist/cjs.js?!../../../libs/remix-ui/tree-view/src/lib/tree-view-item/tree-view-item.css":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/src/utils/third-party/cli-files/plugins/raw-css-loader.js!/Users/anil/github/anilChinchawale/remix-project/node_modules/postcss-loader/dist/cjs.js??ref--5-oneOf-4-2!/Users/anil/github/anilChinchawale/remix-project/libs/remix-ui/tree-view/src/lib/tree-view-item/tree-view-item.css ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = [[module.i, "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJ0cmVlLXZpZXctaXRlbS5jc3MifQ== */", '', '']]

/***/ }),

/***/ "../../../node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "../../remix-ide/src/lib/helper.js":
/*!*****************************************************************************************!*\
  !*** /Users/anil/github/anilChinchawale/remix-project/apps/remix-ide/src/lib/helper.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var async = __webpack_require__(/*! async */ "../../../node_modules/async/dist/async.js");

var ethJSUtil = __webpack_require__(/*! ethereumjs-util */ "../../../node_modules/ethereumjs-util/dist.browser/index.js");

module.exports = {
  shortenAddress: function shortenAddress(address, etherBalance) {
    var len = address.length;
    return address.slice(0, 5) + '...' + address.slice(len - 5, len) + (etherBalance ? ' (' + etherBalance.toString() + ' ether)' : '');
  },
  addressToString: function addressToString(address) {
    if (!address) return null;

    if (typeof address !== 'string') {
      address = address.toString('hex');
    }

    if (address.indexOf('0x') === -1) {
      address = '0x' + address;
    }

    return ethJSUtil.toChecksumAddress(address);
  },
  shortenHexData: function shortenHexData(data) {
    if (!data) return '';
    if (data.length < 5) return data;
    var len = data.length;
    return data.slice(0, 5) + '...' + data.slice(len - 5, len);
  },
  createNonClashingNameWithPrefix: function createNonClashingNameWithPrefix(name, fileProvider, prefix, cb) {
    if (!name) name = 'Undefined';
    var counter = '';
    var ext = 'sol';
    var reg = /(.*)\.([^.]+)/g;
    var split = reg.exec(name);

    if (split) {
      name = split[1];
      ext = split[2];
    }

    var exist = true;
    async.whilst(function () {
      return exist;
    }, function (callback) {
      fileProvider.exists(name + counter + prefix + '.' + ext).then(function (currentExist) {
        exist = currentExist;
        if (exist) counter = (counter | 0) + 1;
        callback();
      })["catch"](function (error) {
        if (error) console.log(error);
      });
    }, function (error) {
      cb(error, name + counter + prefix + '.' + ext);
    });
  },
  createNonClashingName: function createNonClashingName(name, fileProvider, cb) {
    this.createNonClashingNameWithPrefix(name, fileProvider, '', cb);
  },
  createNonClashingNameAsync: function createNonClashingNameAsync(name, fileManager) {
    var _arguments = arguments;
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var prefix, counter, ext, reg, split, exist, isDuplicate;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              prefix = _arguments.length > 2 && _arguments[2] !== undefined ? _arguments[2] : '';
              if (!name) name = 'Undefined';
              counter = '';
              ext = 'sol';
              reg = /(.*)\.([^.]+)/g;
              split = reg.exec(name);

              if (split) {
                name = split[1];
                ext = split[2];
              }

              exist = true;

            case 8:
              _context.next = 10;
              return fileManager.exists(name + counter + prefix + '.' + ext);

            case 10:
              isDuplicate = _context.sent;
              if (isDuplicate) counter = (counter | 0) + 1;else exist = false;

            case 12:
              if (exist) {
                _context.next = 8;
                break;
              }

            case 13:
              return _context.abrupt("return", name + counter + prefix + '.' + ext);

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  createNonClashingDirNameAsync: function createNonClashingDirNameAsync(name, fileManager) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var counter, exist, isDuplicate;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!name) name = 'Undefined';
              counter = '';
              exist = true;

            case 3:
              _context2.next = 5;
              return fileManager.exists(name + counter);

            case 5:
              isDuplicate = _context2.sent;
              if (isDuplicate) counter = (counter | 0) + 1;else exist = false;

            case 7:
              if (exist) {
                _context2.next = 3;
                break;
              }

            case 8:
              return _context2.abrupt("return", name + counter);

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  },
  checkSpecialChars: function checkSpecialChars(name) {
    return name.match(/[:*?"<>\\'|]/) != null;
  },
  checkSlash: function checkSlash(name) {
    return name.match(/\//) != null;
  },
  isHexadecimal: function isHexadecimal(value) {
    return /^[0-9a-fA-F]+$/.test(value) && value.length % 2 === 0;
  },
  is0XPrefixed: function is0XPrefixed(value) {
    return value.substr(0, 2) === '0x';
  },
  isNumeric: function isNumeric(value) {
    return /^\+?(0|[1-9]\d*)$/.test(value);
  },
  isValidHash: function isValidHash(hash) {
    // 0x prefixed, hexadecimal, 64digit
    var hexValue = hash.slice(2, hash.length);
    return this.is0XPrefixed(hash) && /^[0-9a-fA-F]{64}$/.test(hexValue);
  },
  removeTrailingSlashes: function removeTrailingSlashes(text) {
    // Remove single or consecutive trailing slashes
    return text.replace(/\/+$/g, '');
  },
  removeMultipleSlashes: function removeMultipleSlashes(text) {
    // Replace consecutive slashes with '/'
    return text.replace(/\/+/g, '/');
  },
  find: find,
  getPathIcon: function getPathIcon(path) {
    return path.endsWith('.txt') ? 'far fa-file-alt' : path.endsWith('.md') ? 'far fa-file-alt' : path.endsWith('.sol') ? 'fak fa-solidity-mono' : path.endsWith('.js') ? 'fab fa-js' : path.endsWith('.json') ? 'fas fa-brackets-curly' : path.endsWith('.vy') ? 'fak fa-vyper-mono' : path.endsWith('.lex') ? 'fak fa-lexon' : path.endsWith('.contract') ? 'fab fa-ethereum' : 'far fa-file';
  },
  joinPath: function joinPath() {
    for (var _len = arguments.length, paths = new Array(_len), _key = 0; _key < _len; _key++) {
      paths[_key] = arguments[_key];
    }

    paths = paths.filter(function (value) {
      return value !== '';
    }).map(function (path) {
      return path.replace(/^\/|\/$/g, '');
    }); // remove first and last slash)

    if (paths.length === 1) return paths[0];
    return paths.join('/');
  },
  extractNameFromKey: function extractNameFromKey(key) {
    var keyPath = key.split('/');
    return keyPath[keyPath.length - 1];
  }
};

function findDeep(object, fn) {
  var found = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    "break": false,
    value: undefined
  };
  if (_typeof(object) !== 'object' || object === null) return;

  for (var i in object) {
    if (found["break"]) break;
    var el = object[i];
    if (el && el.innerText !== undefined && el.innerText !== null) el = el.innerText;

    if (fn(el, i, object)) {
      found.value = el;
      found["break"] = true;
      break;
    } else {
      findDeep(el, fn, found);
    }
  }

  return found.value;
}

function find(args, query) {
  query = query.trim();
  var isMatch = !!findDeep(args, function check(value, key) {
    if (value === undefined || value === null) return false;
    if (typeof value === 'function') return false;
    if (_typeof(value) === 'object') return false;
    var contains = String(value).indexOf(query.trim()) !== -1;
    return contains;
  });
  return isMatch;
}

/***/ }),

/***/ "./app/app.tsx":
/*!*********************!*\
  !*** ./app/app.tsx ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.App = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

var _debuggerUi = __webpack_require__(/*! @remix-ui/debugger-ui */ "../../../libs/remix-ui/debugger-ui/src/index.ts");

var _debugger = __webpack_require__(/*! ./debugger */ "./app/debugger.ts");

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/apps/debugger/src/app/app.tsx";
const remix = new _debugger.DebuggerClientApi();

const App = () => {
  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)("div", {
    className: "debugger",
    children: /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_debuggerUi.DebuggerUI, {
      debuggerAPI: remix
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 12,
      columnNumber: 7
    }, void 0)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 11,
    columnNumber: 5
  }, void 0);
};

exports.App = App;
var _default = App;
exports.default = _default;

/***/ }),

/***/ "./app/debugger-api.ts":
/*!*****************************!*\
  !*** ./app/debugger-api.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DebuggerApiMixin = exports.CompilerAbstract = void 0;

var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty.js"));

var _web = _interopRequireDefault(__webpack_require__(/*! web3 */ "../../../node_modules/web3/lib/index.js"));

var _remixDebug = _interopRequireWildcard(__webpack_require__(/*! @remix-project/remix-debug */ "../../../dist/libs/remix-debug/src/index.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const DebuggerApiMixin = Base => class extends Base {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "initialWeb3", void 0);
  }

  initDebuggerApi() {
    this.debugHash = null;
    const self = this;
    this.web3Provider = {
      sendAsync(payload, callback) {
        self.call('web3Provider', 'sendAsync', payload).then(result => callback(null, result)).catch(e => callback(e));
      }

    };
    this._web3 = new _web.default(this.web3Provider); // this._web3 can be overwritten and reset to initial value in 'debug' method

    this.initialWeb3 = this._web3;

    _remixDebug.default.init.extendWeb3(this._web3);

    this.offsetToLineColumnConverter = {
      async offsetToLineColumn(rawLocation, file, sources, asts) {
        return await self.call('offsetToLineColumnConverter', 'offsetToLineColumn', rawLocation, file, sources, asts);
      }

    };
  } // on()
  // call()
  // onDebugRequested()
  // onRemoveHighlights()


  web3() {
    return this._web3;
  }

  async discardHighlight() {
    await this.call('editor', 'discardHighlight');
  }

  async highlight(lineColumnPos, path) {
    await this.call('editor', 'highlight', lineColumnPos, path, '', {
      focus: true
    });
  }

  async getFile(path) {
    return await this.call('fileManager', 'getFile', path);
  }

  async setFile(path, content) {
    await this.call('fileManager', 'setFile', path, content);
  }

  onBreakpointCleared(listener) {
    this.onBreakpointClearedListener = listener;
  }

  onBreakpointAdded(listener) {
    this.onBreakpointAddedListener = listener;
  }

  onEditorContentChanged(listener) {
    this.onEditorContentChangedListener = listener;
  }

  onEnvChanged(listener) {
    this.onEnvChangedListener = listener;
  }

  onDebugRequested(listener) {
    this.onDebugRequestedListener = listener;
  }

  onRemoveHighlights(listener) {
    this.onRemoveHighlightsListener = listener;
  }

  async fetchContractAndCompile(address, receipt) {
    const target = address && _remixDebug.default.traceHelper.isContractCreation(address) ? receipt.contractAddress : address;
    const targetAddress = target || receipt.contractAddress || receipt.to;
    const codeAtAddress = await this._web3.eth.getCode(targetAddress);
    const output = await this.call('fetchAndCompile', 'resolve', targetAddress, codeAtAddress, 'browser/.debug');

    if (output) {
      return new CompilerAbstract(output.languageversion, output.data, output.source);
    }

    return null;
  }

  async getDebugWeb3() {
    let web3;
    let network;

    try {
      network = await this.call('network', 'detectNetwork');
    } catch (e) {
      web3 = this.web3();
    }

    if (!web3) {
      const webDebugNode = _remixDebug.default.init.web3DebugNode(network.name);

      web3 = !webDebugNode ? this.web3() : webDebugNode;
    }

    _remixDebug.default.init.extendWeb3(web3);

    return web3;
  }

  async getTrace(hash) {
    var _this = this;

    if (!hash) return;
    const web3 = await this.getDebugWeb3();
    const currentReceipt = await web3.eth.getTransactionReceipt(hash);
    const debug = new _remixDebug.TransactionDebugger({
      web3,
      offsetToLineColumnConverter: this.offsetToLineColumnConverter,
      compilationResult: async function (address) {
        try {
          return await _this.fetchContractAndCompile(address, currentReceipt);
        } catch (e) {
          console.error(e);
        }

        return null;
      },
      debugWithGeneratedSources: false
    });
    return await debug.debugger.traceManager.getTrace(hash);
  }

  debug(hash, web3) {
    this.debugHash = hash;
    if (web3) this._web3 = web3;else this._web3 = this.initialWeb3;

    _remixDebug.default.init.extendWeb3(this._web3);

    if (this.onDebugRequestedListener) this.onDebugRequestedListener(hash, web3);
  }

  onActivation() {
    this.on('editor', 'breakpointCleared', (fileName, row) => {
      if (this.onBreakpointClearedListener) this.onBreakpointClearedListener(fileName, row);
    });
    this.on('editor', 'breakpointAdded', (fileName, row) => {
      if (this.onBreakpointAddedListener) this.onBreakpointAddedListener(fileName, row);
    });
    this.on('editor', 'contentChanged', () => {
      if (this.onEditorContentChangedListener) this.onEditorContentChangedListener();
    });
    this.on('network', 'providerChanged', provider => {
      if (this.onEnvChangedListener) this.onEnvChangedListener(provider);
    });
  }

  onDeactivation() {
    if (this.onRemoveHighlightsListener) this.onRemoveHighlightsListener();
    this.off('editor', 'breakpointCleared');
    this.off('editor', 'breakpointAdded');
    this.off('editor', 'contentChanged');
  }

  showMessage(title, message) {}

};

exports.DebuggerApiMixin = DebuggerApiMixin;

class CompilerAbstract {
  // this is a subset of /remix-ide/src/app/compiler/compiler-abstract.js
  constructor(languageversion, data, source) {
    (0, _defineProperty2.default)(this, "languageversion", void 0);
    (0, _defineProperty2.default)(this, "data", void 0);
    (0, _defineProperty2.default)(this, "source", void 0);
    this.languageversion = languageversion;
    this.data = data;
    this.source = source; // source code
  }

  getSourceName(fileIndex) {
    if (this.data && this.data.sources) {
      return Object.keys(this.data.sources)[fileIndex];
    } else if (Object.keys(this.source.sources).length === 1) {
      // if we don't have ast, we return the only one filename present.
      const sourcesArray = Object.keys(this.source.sources);
      return sourcesArray[0];
    }

    return null;
  }

}

exports.CompilerAbstract = CompilerAbstract;

/***/ }),

/***/ "./app/debugger.ts":
/*!*************************!*\
  !*** ./app/debugger.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DebuggerClientApi = void 0;

var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/esm/defineProperty.js"));

var _plugin = __webpack_require__(/*! @remixproject/plugin */ "../../../node_modules/@remixproject/plugin/index.js");

var _pluginWebview = __webpack_require__(/*! @remixproject/plugin-webview */ "../../../node_modules/@remixproject/plugin-webview/index.js");

var _debuggerApi = __webpack_require__(/*! ./debugger-api */ "./app/debugger-api.ts");

class DebuggerClientApi extends (0, _debuggerApi.DebuggerApiMixin)(_plugin.PluginClient) {
  constructor() {
    super();
    (0, _defineProperty2.default)(this, "offsetToLineColumnConverter", void 0);
    (0, _defineProperty2.default)(this, "debugHash", void 0);
    (0, _defineProperty2.default)(this, "debugHashRequest", void 0);
    (0, _defineProperty2.default)(this, "removeHighlights", void 0);
    (0, _defineProperty2.default)(this, "onBreakpointCleared", void 0);
    (0, _defineProperty2.default)(this, "onBreakpointAdded", void 0);
    (0, _defineProperty2.default)(this, "onEditorContentChanged", void 0);
    (0, _defineProperty2.default)(this, "onEnvChanged", void 0);
    (0, _defineProperty2.default)(this, "discardHighlight", void 0);
    (0, _defineProperty2.default)(this, "highlight", void 0);
    (0, _defineProperty2.default)(this, "fetchContractAndCompile", void 0);
    (0, _defineProperty2.default)(this, "getFile", void 0);
    (0, _defineProperty2.default)(this, "setFile", void 0);
    (0, _defineProperty2.default)(this, "getDebugWeb3", void 0);
    (0, _defineProperty2.default)(this, "web3", void 0);
    (0, _pluginWebview.createClient)(this);
    this.initDebuggerApi();
  } // returns an instance of web3.js


}

exports.DebuggerClientApi = DebuggerClientApi;

/***/ }),

/***/ "./main.tsx":
/*!******************!*\
  !*** ./main.tsx ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../../node_modules/@nrwl/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../node_modules/react/index.js"));

var _reactDom = _interopRequireDefault(__webpack_require__(/*! react-dom */ "../../../node_modules/react-dom/index.js"));

var _app = _interopRequireDefault(__webpack_require__(/*! ./app/app */ "./app/app.tsx"));

var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "../../../node_modules/react/jsx-dev-runtime.js");

var _jsxFileName = "/Users/anil/github/anilChinchawale/remix-project/apps/debugger/src/main.tsx";

_reactDom.default.render( /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(_app.default, {}, void 0, false, {
  fileName: _jsxFileName,
  lineNumber: 7,
  columnNumber: 3
}, void 0), document.getElementById('root'));

/***/ }),

/***/ 0:
/*!************************!*\
  !*** multi ./main.tsx ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/anil/github/anilChinchawale/remix-project/apps/debugger/src/main.tsx */"./main.tsx");


/***/ }),

/***/ 1:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 10:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 11:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 12:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 13:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 14:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 15:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 16:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 17:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 18:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 19:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 2:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 20:
/*!****************************!*\
  !*** ./nextTick (ignored) ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 3:
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 4:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 5:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 6:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 7:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 8:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 9:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map