'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLowLevelCall = exports.isTransfer = exports.isStateVariable = exports.isWriteOnStateVariable = exports.isLocalCall = exports.isLocalCallGraphRelevantNode = exports.isLibraryCall = exports.isSuperLocalCall = exports.isThisLocalCall = exports.isBlockBlockHashAccess = exports.isBlockTimestampAccess = exports.isNowAccess = exports.isTxOriginAccess = exports.isEffect = exports.isInteraction = exports.hasFunctionBody = exports.isSubScopeWithTopLevelUnAssignedBinOp = exports.isMappingIndexAccess = exports.isDynamicArrayLengthAccess = exports.isDynamicArrayAccess = exports.isVariableTurnedIntoGetter = exports.isSpecialVariableAccess = exports.isAbiNamespaceCall = exports.isDeleteFromDynamicArray = exports.isDeleteOfDynamicArray = exports.getCompilerVersion = exports.getMethodParamsSplittedTypeDesc = exports.getUnAssignedTopLevelBinOps = exports.getFunctionDefinitionReturnParameterPart = exports.getFunctionOrModifierDefinitionParameterPart = exports.getStateVariableDeclarationsFromContractNode = exports.getFullQuallyfiedFuncDefinitionIdent = exports.getFullQualifiedFunctionCallIdent = exports.getLibraryCallMemberName = exports.getLibraryCallContractName = exports.getFunctionCallTypeParameterType = exports.getFunctionDefinitionName = exports.getExternalDirectCallMemberName = exports.getThisLocalCallContractName = exports.getExternalDirectCallContractName = exports.getInheritsFromName = exports.getLocalCallName = exports.getDeclaredVariableType = exports.getDeclaredVariableName = exports.getEffectedVariableName = exports.getContractName = exports.getFunctionCallType = exports.getSuperLocalCallName = exports.getThisLocalCallName = exports.getType = void 0;
exports.helpers = exports.specialVariables = exports.lowLevelCallTypes = exports.basicFunctionTypes = exports.basicTypes = exports.nodeTypes = exports.isStatement = exports.isConstructor = exports.isPayableFunction = exports.isConstantFunction = exports.isStorageVariableDeclaration = exports.isDeleteUnaryOperation = exports.isLoop = exports.isBytesLengthCheck = exports.isStringToBytesConversion = exports.isIntDivision = exports.isRequireCall = exports.isAssertCall = exports.isSelfdestructCall = exports.isBuiltinFunctionCall = exports.isMinusMinusUnaryOperation = exports.isPlusPlusUnaryOperation = exports.isCallToNonConstLocalFunction = exports.isLibrary = exports.isFullyImplementedContract = exports.isExternalDirectCall = exports.isLLSend04 = exports.isLLSend = exports.isLLDelegatecall04 = exports.isLLDelegatecall = exports.isLLCallcode = exports.isLLCall04 = exports.isLLCall = void 0;
const remix_lib_1 = require("@remix-project/remix-lib");
const nodeTypes = {
    SOURCEUNIT: 'SourceUnit',
    PRAGMADIRECTIVE: 'PragmaDirective',
    IMPORTDIRECTIVE: 'ImportDirective',
    CONTRACTDEFINITION: 'ContractDefinition',
    INHERITANCESPECIFIER: 'InheritanceSpecifier',
    USINGFORDIRECTIVE: 'UsingForDirective',
    STRUCTDEFINITION: 'StructDefinition',
    ENUMDEFINITION: 'EnumDefinition',
    ENUMVALUE: 'EnumValue',
    PARAMETERLIST: 'ParameterList',
    OVERRIDESPECIFIER: 'OverrideSpecifier',
    FUNCTIONDEFINITION: 'FunctionDefinition',
    VARIABLEDECLARATION: 'VariableDeclaration',
    MODIFIERDEFINITION: 'ModifierDefinition',
    MODIFIERINVOCATION: 'ModifierInvocation',
    EVENTDEFINITION: 'EventDefinition',
    ELEMENTARYTYPENAME: 'ElementaryTypeName',
    USERDEFINEDTYPENAME: 'UserDefinedTypeName',
    FUNCTIONTYPENAME: 'FunctionTypeName',
    MAPPING: 'Mapping',
    ARRAYTYPENAME: 'ArrayTypeName',
    INLINEASSEMBLY: 'InlineAssembly',
    BLOCK: 'Block',
    PLACEHOLDERSTATEMENT: 'PlaceholderStatement',
    IFSTATEMENT: 'IfStatement',
    TRYCATCHCLAUSE: 'TryCatchClause',
    TRYSTATEMENT: 'TryStatement',
    WHILESTATEMENT: 'WhileStatement',
    DOWHILESTATEMENT: 'DoWhileStatement',
    FORSTATEMENT: 'ForStatement',
    CONTINUE: 'Continue',
    BREAK: 'Break',
    RETURN: 'Return',
    THROW: 'Throw',
    EMITSTATEMENT: 'EmitStatement',
    VARIABLEDECLARATIONSTATEMENT: 'VariableDeclarationStatement',
    EXPRESSIONSTATEMENT: 'ExpressionStatement',
    CONDITIONAL: 'Conditional',
    ASSIGNMENT: 'Assignment',
    TUPLEEXPRESSION: 'TupleExpression',
    UNARYOPERATION: 'UnaryOperation',
    BINARYOPERATION: 'BinaryOperation',
    FUNCTIONCALL: 'FunctionCall',
    FUNCTIONCALLOPTIONS: 'FunctionCallOptions',
    NEWEXPRESSION: 'NewExpression',
    MEMBERACCESS: 'MemberAccess',
    INDEXACCESS: 'IndexAccess',
    INDEXRANGEACCESS: 'IndexRangeAccess',
    ELEMENTARYTYPENAMEEXPRESSION: 'ElementaryTypeNameExpression',
    LITERAL: 'Literal',
    IDENTIFIER: 'Identifier',
    STRUCTUREDDOCUMENTATION: 'StructuredDocumentation'
};
exports.nodeTypes = nodeTypes;
const basicTypes = {
    UINT: 'uint256',
    BOOL: 'bool',
    ADDRESS: 'address',
    PAYABLE_ADDRESS: 'address payable',
    BYTES32: 'bytes32',
    STRING_MEM: 'string memory',
    BYTES_MEM: 'bytes memory',
    BYTES4: 'bytes4'
};
exports.basicTypes = basicTypes;
const basicRegex = {
    CONTRACTTYPE: '^contract ',
    FUNCTIONTYPE: '^function \\(',
    EXTERNALFUNCTIONTYPE: '^function \\(.*\\).* external',
    CONSTANTFUNCTIONTYPE: '^function \\(.*\\).* (view|pure)',
    REFTYPE: '(storage)|(mapping\\()|(\\[\\])',
    FUNCTIONSIGNATURE: '^function \\(([^\\(]*)\\)',
    LIBRARYTYPE: '^type\\(library (.*)\\)'
};
const basicFunctionTypes = {
    SEND: buildFunctionSignature([basicTypes.UINT], [basicTypes.BOOL], false),
    'CALL-0.4': buildFunctionSignature([], [basicTypes.BOOL], true),
    CALL: buildFunctionSignature([basicTypes.BYTES_MEM], [basicTypes.BOOL, basicTypes.BYTES_MEM], true),
    'DELEGATECALL-0.4': buildFunctionSignature([], [basicTypes.BOOL], false),
    DELEGATECALL: buildFunctionSignature([basicTypes.BYTES_MEM], [basicTypes.BOOL, basicTypes.BYTES_MEM], false),
    TRANSFER: buildFunctionSignature([basicTypes.UINT], [], false)
};
exports.basicFunctionTypes = basicFunctionTypes;
const builtinFunctions = {
    'keccak256()': true,
    'sha3()': true,
    'sha256()': true,
    'ripemd160()': true,
    'ecrecover(bytes32,uint8,bytes32,bytes32)': true,
    'addmod(uint256,uint256,uint256)': true,
    'mulmod(uint256,uint256,uint256)': true,
    'selfdestruct(address)': true,
    'selfdestruct(address payable)': true,
    'revert()': true,
    'revert(string memory)': true,
    'assert(bool)': true,
    'require(bool)': true,
    'require(bool,string memory)': true,
    'gasleft()': true,
    'blockhash(uint256)': true,
    'address(address)': true
};
const lowLevelCallTypes = {
    'CALL-0.4': { ident: 'call', type: basicFunctionTypes['CALL-0.4'] },
    CALL: { ident: 'call', type: basicFunctionTypes.CALL },
    CALLCODE: { ident: 'callcode', type: basicFunctionTypes['CALL-0.4'] },
    'DELEGATECALL-0.4': { ident: 'delegatecall', type: basicFunctionTypes['DELEGATECALL-0.4'] },
    DELEGATECALL: { ident: 'delegatecall', type: basicFunctionTypes.DELEGATECALL },
    SEND: { ident: 'send', type: basicFunctionTypes.SEND },
    TRANSFER: { ident: 'transfer', type: basicFunctionTypes.TRANSFER }
};
exports.lowLevelCallTypes = lowLevelCallTypes;
const specialVariables = {
    BLOCKTIMESTAMP: { obj: 'block', member: 'timestamp', type: basicTypes.UINT },
    BLOCKHASH: {
        obj: 'block',
        member: 'blockhash',
        type: buildFunctionSignature([basicTypes.UINT], [basicTypes.BYTES32], false, 'view')
    }
};
exports.specialVariables = specialVariables;
const abiNamespace = {
    ENCODE: {
        obj: 'abi',
        member: 'encode',
        type: buildFunctionSignature([], [basicTypes.BYTES_MEM], false, 'pure')
    },
    ENCODEPACKED: {
        obj: 'abi',
        member: 'encodePacked',
        type: buildFunctionSignature([], [basicTypes.BYTES_MEM], false, 'pure')
    },
    ENCODE_SELECT: {
        obj: 'abi',
        member: 'encodeWithSelector',
        type: buildFunctionSignature([basicTypes.BYTES4], [basicTypes.BYTES_MEM], false, 'pure')
    },
    ENCODE_SIG: {
        obj: 'abi',
        member: 'encodeWithSignature',
        type: buildFunctionSignature([basicTypes.STRING_MEM], [basicTypes.BYTES_MEM], false, 'pure')
    }
};
// #################### Trivial Getters
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function getType(node) {
    return node.typeDescriptions.typeString;
}
exports.getType = getType;
// #################### Complex Getters
/**
 * Returns the type parameter of function call AST nodes. Throws if not a function call node
 * @func {ASTNode} Function call node
 * @return {string} type of function call
 */
function getFunctionCallType(func) {
    return getType(func.expression);
}
exports.getFunctionCallType = getFunctionCallType;
/**
 * Get the variable name written to by a effect node, except for inline assembly because there is no information to find out where we write to. Trows if not a effect node or is inlineassmbly.
 * Example: x = 10; => x
 * @effectNode {ASTNode} Assignmnet node
 * @return {string} variable name written to
 */
function getEffectedVariableName(effectNode) {
    if (!isEffect(effectNode))
        throw new Error('staticAnalysisCommon.js: not an effect Node');
    if (effectNode.nodeType === 'Assignment' || effectNode.nodeType === 'UnaryOperation') {
        const IdentNode = findFirstSubNodeLTR(effectNode, exactMatch(nodeTypes.IDENTIFIER));
        return IdentNode.name;
    }
    else
        throw new Error('staticAnalysisCommon.js: wrong node type');
}
exports.getEffectedVariableName = getEffectedVariableName;
/**
 * Returns the identifier of a local call, Throws on wrong node.
 * Example: f(103) => f
 * @localCallNode {ASTNode} Function call node
 * @return {string} name of the function called
 */
function getLocalCallName(localCallNode) {
    if (!isLocalCall(localCallNode) && !isAbiNamespaceCall(localCallNode))
        throw new Error('staticAnalysisCommon.js: not a local call Node');
    return localCallNode.expression.name;
}
exports.getLocalCallName = getLocalCallName;
/**
 * Returns the identifier of a this local call, Throws on wrong node.
 * Example: this.f(103) => f
 * @localCallNode {ASTNode} Function call node
 * @return {string} name of the function called
 */
function getThisLocalCallName(thisLocalCallNode) {
    if (!isThisLocalCall(thisLocalCallNode.expression))
        throw new Error('staticAnalysisCommon.js: not a this local call Node');
    return thisLocalCallNode.expression.memberName;
}
exports.getThisLocalCallName = getThisLocalCallName;
/**
 * Returns the identifier of a super local call, Throws on wrong node.
 * Example: super.f(103) => f
 * @localCallNode {ASTNode} Function call node
 * @return {string} name of the function called
 */
function getSuperLocalCallName(superLocalCallNode) {
    if (!isSuperLocalCall(superLocalCallNode.expression))
        throw new Error('staticAnalysisCommon.js: not a super local call Node');
    return superLocalCallNode.expression.memberName;
}
exports.getSuperLocalCallName = getSuperLocalCallName;
/**
 * Returns the contract type of a external direct call, Throws on wrong node.
 * Example:
 *  foo x = foo(0xdeadbeef...);
 *  x.f(103) => foo
 * @extDirectCall {ASTNode} Function call node
 * @return {string} name of the contract the function is defined in
 */
function getExternalDirectCallContractName(extDirectCall) {
    if (!isExternalDirectCall(extDirectCall))
        throw new Error('staticAnalysisCommon.js: not an external direct call Node');
    return extDirectCall.expression.expression.typeDescriptions.typeString.replace(new RegExp(basicRegex.CONTRACTTYPE), '');
}
exports.getExternalDirectCallContractName = getExternalDirectCallContractName;
/**
 * Returns the name of the contract of a this local call (current contract), Throws on wrong node.
 * Example:
 * Contract foo {
 *    ...
 *    this.f(103) => foo
 *    ...
 * @thisLocalCall {ASTNode} Function call node
 * @return {string} name of the contract the function is defined in
 */
function getThisLocalCallContractName(thisLocalCall) {
    if (!isThisLocalCall(thisLocalCall.expression))
        throw new Error('staticAnalysisCommon.js: not a this local call Node');
    return thisLocalCall.expression.expression.typeDescriptions.typeString.replace(new RegExp(basicRegex.CONTRACTTYPE), '');
}
exports.getThisLocalCallContractName = getThisLocalCallContractName;
/**
 * Returns the function identifier of a external direct call, Throws on wrong node.
 * Example:
 *  foo x = foo(0xdeadbeef...);
 *  x.f(103) => f
 * @extDirectCall {ASTNode} Function call node
 * @return {string} name of the function called
 */
function getExternalDirectCallMemberName(extDirectCall) {
    if (!isExternalDirectCall(extDirectCall))
        throw new Error('staticAnalysisCommon.js: not an external direct call Node');
    return extDirectCall.expression.memberName;
}
exports.getExternalDirectCallMemberName = getExternalDirectCallMemberName;
/**
 * Returns the name of a contract, Throws on wrong node.
 * Example:
 *   Contract foo { => foo
 * @contract {ASTNode} Contract Definition node
 * @return {string} name of a contract defined
 */
function getContractName(contract) {
    if (!nodeType(contract, exactMatch(nodeTypes.CONTRACTDEFINITION)))
        throw new Error('staticAnalysisCommon.js: not a ContractDefinition Node');
    return contract.name;
}
exports.getContractName = getContractName;
/**
 * Returns the name of a function definition, Throws on wrong node.
 * Example:
 *   func foo(uint bla) { => foo
 * @funcDef {ASTNode} Function Definition node
 * @return {string} name of a function defined
 */
function getFunctionDefinitionName(funcDef) {
    if (!nodeType(funcDef, exactMatch(nodeTypes.FUNCTIONDEFINITION)))
        throw new Error('staticAnalysisCommon.js: not a FunctionDefinition Node');
    return funcDef.name;
}
exports.getFunctionDefinitionName = getFunctionDefinitionName;
/**
 * Returns the identifier of an inheritance specifier, Throws on wrong node.
 * Example:
 *   contract KingOfTheEtherThrone is b { => b
 * @func {ASTNode} Inheritance specifier
 * @return {string} name of contract inherited from
 */
function getInheritsFromName(inheritsNode) {
    if (!nodeType(inheritsNode, exactMatch(nodeTypes.INHERITANCESPECIFIER)))
        throw new Error('staticAnalysisCommon.js: not an InheritanceSpecifier Node');
    return inheritsNode.baseName.name;
}
exports.getInheritsFromName = getInheritsFromName;
/**
 * Returns the identifier of a variable definition, Throws on wrong node.
 * Example:
 *   var x = 10; => x
 * @varDeclNode {ASTNode} Variable declaration node
 * @return {string} variable name
 */
function getDeclaredVariableName(varDeclNode) {
    if (!nodeType(varDeclNode, exactMatch(nodeTypes.VARIABLEDECLARATION)))
        throw new Error('staticAnalysisCommon.js: not a VariableDeclaration Node');
    return varDeclNode.name;
}
exports.getDeclaredVariableName = getDeclaredVariableName;
/**
 * Returns the type of a variable definition, Throws on wrong node.
 * Example:
 *   var x = 10; => x
 * @varDeclNode {ASTNode} Variable declaration node
 * @return {string} variable type
 */
function getDeclaredVariableType(varDeclNode) {
    return varDeclNode.typeName.name;
}
exports.getDeclaredVariableType = getDeclaredVariableType;
/**
 * Returns state variable declaration nodes for a contract, Throws on wrong node.
 * Example:
 * contract foo {
 *     ...
 *   var y = true;
 *   var x = 10; => [y,x]
 * @contractNode {ASTNode} Contract Definition node
 * @return {list variable declaration} state variable node list
 */
function getStateVariableDeclarationsFromContractNode(contractNode) {
    return contractNode.nodes.filter(el => el.nodeType === 'VariableDeclaration');
}
exports.getStateVariableDeclarationsFromContractNode = getStateVariableDeclarationsFromContractNode;
/**
 * Returns parameter node for a function or modifier definition, Throws on wrong node.
 * Example:
 * function bar(uint a, uint b) => uint a, uint b
 * @funcNode {ASTNode} Contract Definition node
 * @return {parameterlist node} parameterlist node
 */
function getFunctionOrModifierDefinitionParameterPart(funcNode) {
    if (!nodeTypeIn(funcNode, [exactMatch(nodeTypes.FUNCTIONDEFINITION), exactMatch(nodeTypes.MODIFIERDEFINITION)]))
        throw new Error('staticAnalysisCommon.js: not a FunctionDefinition or ModifierDefinition Node');
    return funcNode.parameters;
}
exports.getFunctionOrModifierDefinitionParameterPart = getFunctionOrModifierDefinitionParameterPart;
/**
 * Returns return parameter node for a function or modifier definition, Throws on wrong node.
 * Example:
 * function bar(uint a, uint b) returns (bool a, bool b) => bool a, bool b
 * @funcNode {ASTNode} Contract Definition node
 * @return {parameterlist node} parameterlist node
 */
function getFunctionDefinitionReturnParameterPart(funcNode) {
    return funcNode.returnParameters;
}
exports.getFunctionDefinitionReturnParameterPart = getFunctionDefinitionReturnParameterPart;
/**
 * Extracts the parameter types for a function type signature
 * Example:
 * function(uint a, uint b) returns (bool) => uint a, uint b
 * @func {ASTNode} function call node
 * @return {string} parameter signature
 */
function getFunctionCallTypeParameterType(func) {
    const type = getFunctionCallType(func);
    if (type.startsWith('function (')) {
        let paramTypes = '';
        let openPar = 1;
        for (let x = 10; x < type.length; x++) {
            const c = type.charAt(x);
            if (c === '(')
                openPar++;
            else if (c === ')')
                openPar--;
            if (openPar === 0)
                return paramTypes;
            paramTypes += c;
        }
    }
    else {
        throw new Error('staticAnalysisCommon.js: cannot extract parameter types from function call');
    }
}
exports.getFunctionCallTypeParameterType = getFunctionCallTypeParameterType;
/**
 * Returns the name of the library called, Throws on wrong node.
 * Example:
 *  library set{...}
 *  contract foo {
 *    ...
 *    function () { set.union() => set}
 * @funcCall {ASTNode} function call node
 * @return {string} name of the lib defined
 */
function getLibraryCallContractName(node) {
    if (!isLibraryCall(node.expression))
        throw new Error('staticAnalysisCommon.js: not a library call Node');
    const types = new RegExp(basicRegex.LIBRARYTYPE).exec(node.expression.expression.typeDescriptions.typeString);
    if (types) {
        return types[1];
    }
}
exports.getLibraryCallContractName = getLibraryCallContractName;
/**
 * Returns the name of the function of a library call, Throws on wrong node.
 * Example:
 *  library set{...}
 *  contract foo {
 *    ...
 *    function () { set.union() => uinion}
 * @func {ASTNode} function call node
 * @return {string} name of function called on the library
 */
function getLibraryCallMemberName(funcCall) {
    if (!isLibraryCall(funcCall.expression))
        throw new Error('staticAnalysisCommon.js: not a library call Node');
    return funcCall.expression.memberName;
}
exports.getLibraryCallMemberName = getLibraryCallMemberName;
/**
 * Returns full qualified name for a function call, Throws on wrong node.
 * Example:
 *  contract foo {
 *    ...
 *    function bar(uint b) { }
 *    function baz() {
 *      bar(10) => foo.bar(uint)
 * @func {ASTNode} function call node
 * @func {ASTNode} contract defintion
 * @return {string} full qualified identifier for the function call
 */
function getFullQualifiedFunctionCallIdent(contract, func) {
    if (isLocalCall(func))
        return getContractName(contract) + '.' + getLocalCallName(func) + '(' + getFunctionCallTypeParameterType(func) + ')';
    else if (isThisLocalCall(func.expression))
        return getThisLocalCallContractName(func) + '.' + getThisLocalCallName(func) + '(' + getFunctionCallTypeParameterType(func) + ')';
    else if (isSuperLocalCall(func.expression))
        return getContractName(contract) + '.' + getSuperLocalCallName(func) + '(' + getFunctionCallTypeParameterType(func) + ')';
    else if (isExternalDirectCall(func))
        return getExternalDirectCallContractName(func) + '.' + getExternalDirectCallMemberName(func) + '(' + getFunctionCallTypeParameterType(func) + ')';
    else if (isLibraryCall(func.expression))
        return getLibraryCallContractName(func) + '.' + getLibraryCallMemberName(func) + '(' + getFunctionCallTypeParameterType(func) + ')';
    else
        throw new Error('staticAnalysisCommon.js: Can not get function name from non function call node');
}
exports.getFullQualifiedFunctionCallIdent = getFullQualifiedFunctionCallIdent;
function getFullQuallyfiedFuncDefinitionIdent(contract, func, paramTypes) {
    return getContractName(contract) + '.' + getFunctionDefinitionName(func) + '(' + remix_lib_1.util.concatWithSeperator(paramTypes, ',') + ')';
}
exports.getFullQuallyfiedFuncDefinitionIdent = getFullQuallyfiedFuncDefinitionIdent;
function getUnAssignedTopLevelBinOps(subScope) {
    let result = [];
    if (subScope && subScope.nodeType === 'Block')
        result = subScope.statements.filter(isBinaryOpInExpression);
    // for 'without braces' loops
    else if (subScope && subScope.nodeType && subScope.nodeType !== 'Block' && isSubScopeStatement(subScope)) {
        if (subScope.nodeType === 'IfStatement') {
            if ((subScope.trueBody && subScope.trueBody.nodeType === 'ExpressionStatement' && isBinaryOpInExpression(subScope.trueBody))) {
                result.push(subScope.trueBody);
            }
            if (subScope.falseBody && subScope.falseBody.nodeType === 'ExpressionStatement' && isBinaryOpInExpression(subScope.falseBody)) {
                result.push(subScope.falseBody);
            }
        }
        else {
            if (subScope.body && subScope.body.nodeType === 'ExpressionStatement' && isBinaryOpInExpression(subScope.body)) {
                result.push(subScope.body);
            }
        }
    }
    return result;
}
exports.getUnAssignedTopLevelBinOps = getUnAssignedTopLevelBinOps;
// #################### Trivial Node Identification
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function isStatement(node) {
    return nodeType(node, 'Statement$') || node.nodeType === 'Block' || node.nodeType === 'Return';
}
exports.isStatement = isStatement;
// #################### Complex Node Identification
/**
 * True if function defintion has function body
 * @funcNode {ASTNode} function defintion node
 * @return {bool}
 */
function hasFunctionBody(funcNode) {
    return funcNode.body !== null;
}
exports.hasFunctionBody = hasFunctionBody;
/**
 * True if node is a delete instruction of a dynamic array
 * @node {ASTNode} node to check for
 * @return {bool}
 */
function isDeleteOfDynamicArray(node) {
    return isDeleteUnaryOperation(node) && isDynamicArrayAccess(node.subExpression);
}
exports.isDeleteOfDynamicArray = isDeleteOfDynamicArray;
/**
 * True if node is node is a ref to a dynamic array
 * @node {ASTNode} node to check for
 * @return {bool}
 */
function isDynamicArrayAccess(node) {
    return getType(node).endsWith('[] storage ref') || typeDescription(node, 'bytes storage ref') || typeDescription(node, 'string storage ref');
}
exports.isDynamicArrayAccess = isDynamicArrayAccess;
/**
 * True if node accesses 'length' member of dynamic array
 * @node {ASTNode} node to check for
 * @return {bool}
 */
function isDynamicArrayLengthAccess(node) {
    return (node.memberName === 'length') && // accessing 'length' member
        node.expression.typeDescriptions.typeString.indexOf('[]') !== -1; // member is accessed from dynamic array, notice [] without any number
}
exports.isDynamicArrayLengthAccess = isDynamicArrayLengthAccess;
/**
 * True if node is a delete instruction for an element from a dynamic array
 * @node {ASTNode} node to check for
 * @return {bool}
 */
function isDeleteFromDynamicArray(node) {
    return isDeleteUnaryOperation(node) && node.subExpression.nodeType === 'IndexAccess';
}
exports.isDeleteFromDynamicArray = isDeleteFromDynamicArray;
/**
 * True if node is the access of a mapping index
 * @node {ASTNode} node to check for
 * @return {bool}
 */
function isMappingIndexAccess(node) {
    return node.typeDescriptions.typeString.startsWith('mapping');
}
exports.isMappingIndexAccess = isMappingIndexAccess;
/**
 * True if call to code within the current contracts context including (delegate) library call
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isLocalCallGraphRelevantNode(node) {
    return ((isLocalCall(node) || isSuperLocalCall(node.expression) || isLibraryCall(node.expression)) && !isBuiltinFunctionCall(node));
}
exports.isLocalCallGraphRelevantNode = isLocalCallGraphRelevantNode;
/**
 * True if is builtin function like assert, sha3, erecover, ...
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isBuiltinFunctionCall(node) {
    return (node.nodeType === 'FunctionCall' && isLocalCall(node) && builtinFunctions[getLocalCallName(node) + '(' + getFunctionCallTypeParameterType(node) + ')'] === true) || isAbiNamespaceCall(node);
}
exports.isBuiltinFunctionCall = isBuiltinFunctionCall;
/**
 * True if is builtin function like assert, sha3, erecover, ...
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isAbiNamespaceCall(node) {
    return Object.keys(abiNamespace).some((key) => Object.prototype.hasOwnProperty.call(abiNamespace, key) && node.expression && isSpecialVariableAccess(node.expression, abiNamespace[key]));
}
exports.isAbiNamespaceCall = isAbiNamespaceCall;
/**
 * True if node is a call to selfdestruct
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isSelfdestructCall(node) {
    return isBuiltinFunctionCall(node) && getLocalCallName(node) === 'selfdestruct';
}
exports.isSelfdestructCall = isSelfdestructCall;
/**
 * True if node is a call to builtin assert(bool)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isAssertCall(node) {
    return isBuiltinFunctionCall(node) && getLocalCallName(node) === 'assert';
}
exports.isAssertCall = isAssertCall;
/**
 * True if node is a call to builtin require(bool)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isRequireCall(node) {
    return isBuiltinFunctionCall(node) && getLocalCallName(node) === 'require';
}
exports.isRequireCall = isRequireCall;
/**
 * True if is storage variable declaration
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isStorageVariableDeclaration(node) {
    return node.storageLocation === 'storage' && new RegExp(basicRegex.REFTYPE).test(node.typeDescriptions.typeIdentifier);
}
exports.isStorageVariableDeclaration = isStorageVariableDeclaration;
/**
 * True if is interaction with external contract (change in context, no delegate calls) (send, call of other contracts)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isInteraction(node) {
    return isLLCall(node.expression) || isLLSend(node.expression) || isExternalDirectCall(node) || isTransfer(node.expression) ||
        isLLCall04(node.expression) || isLLSend04(node.expression) ||
        // to cover case of address.call.value.gas , See: inheritance.sol
        (node.expression && node.expression.expression && isLLCall(node.expression.expression)) ||
        (node.expression && node.expression.expression && isLLCall04(node.expression.expression));
}
exports.isInteraction = isInteraction;
/**
 * True if node changes state of a variable or is inline assembly (does not include check if it is a global state change, on a state variable)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isEffect(node) {
    return node.nodeType === 'Assignment' ||
        (node.nodeType === 'UnaryOperation' && (isPlusPlusUnaryOperation(node) || isMinusMinusUnaryOperation(node))) ||
        node.nodeType === 'InlineAssembly';
}
exports.isEffect = isEffect;
/**
 * True if node changes state of a variable or is inline assembly (Checks if variable is a state variable via provided list)
 * @node {ASTNode} some AstNode
 * @node {list Variable declaration} state variable declaration currently in scope
 * @return {bool}
 */
function isWriteOnStateVariable(effectNode, stateVariables) {
    return effectNode.nodeType === 'InlineAssembly' || (isEffect(effectNode) && isStateVariable(getEffectedVariableName(effectNode), stateVariables));
}
exports.isWriteOnStateVariable = isWriteOnStateVariable;
/**
 * True if there is a variable with name, name in stateVariables
 * @node {ASTNode} some AstNode
 * @node {list Variable declaration} state variable declaration currently in scope
 * @return {bool}
 */
function isStateVariable(name, stateVariables) {
    return stateVariables.some((item) => item.stateVariable && name === getDeclaredVariableName(item));
}
exports.isStateVariable = isStateVariable;
/**
 * True if is function defintion that is flaged as constant
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isConstantFunction(node) {
    return node.stateMutability === 'view' || node.stateMutability === 'pure';
}
exports.isConstantFunction = isConstantFunction;
/**
* True if variable decalaration is converted into a getter method
 * @node {ASTNode} variable declaration AstNode
 * @return {bool}
 */
function isVariableTurnedIntoGetter(varDeclNode) {
    return varDeclNode.stateVariable && varDeclNode.visibility === 'public';
}
exports.isVariableTurnedIntoGetter = isVariableTurnedIntoGetter;
/**
 * True if is function defintion has payable modifier
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isPayableFunction(node) {
    return node.stateMutability === 'payable';
}
exports.isPayableFunction = isPayableFunction;
/**
 * True if is constructor
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isConstructor(node) {
    return node.kind === 'constructor';
}
exports.isConstructor = isConstructor;
/**
 * True if node is integer division that truncates (not only int literals since those yield a rational value)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isIntDivision(node) {
    return operator(node, exactMatch(remix_lib_1.util.escapeRegExp('/'))) && typeDescription(node.rightExpression, remix_lib_1.util.escapeRegExp('int'));
}
exports.isIntDivision = isIntDivision;
/**
 * True if is block / SubScope has top level binops (e.g. that are not assigned to anything, most of the time confused compare instead of assign)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isSubScopeWithTopLevelUnAssignedBinOp(node) {
    if (node.nodeType === 'Block')
        return node.statements.some(isBinaryOpInExpression);
    // for 'without braces' loops
    else if (node && node.nodeType && isSubScopeStatement(node)) {
        if (node.nodeType === 'IfStatement') {
            return (node.trueBody && node.trueBody.nodeType === 'ExpressionStatement' && isBinaryOpInExpression(node.trueBody)) ||
                (node.falseBody && node.falseBody.nodeType === 'ExpressionStatement' && isBinaryOpInExpression(node.falseBody));
        }
        else {
            return node.body && node.body.nodeType === 'ExpressionStatement' && isBinaryOpInExpression(node.body);
        }
    }
}
exports.isSubScopeWithTopLevelUnAssignedBinOp = isSubScopeWithTopLevelUnAssignedBinOp;
function isSubScopeStatement(node) {
    if (node.nodeType === 'IfStatement') {
        return (node.trueBody && node.trueBody.nodeType && !nodeType(node.trueBody, exactMatch(nodeTypes.BLOCK))) ||
            (node.falseBody && node.falseBody.nodeType && !nodeType(node.falseBody, exactMatch(nodeTypes.BLOCK)));
    }
    else {
        return node.body && node.body.nodeType && !nodeType(node.body, exactMatch(nodeTypes.BLOCK));
    }
}
/**
 * True if binary operation inside of expression statement
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isBinaryOpInExpression(node) {
    return node.nodeType === 'ExpressionStatement' && node.expression.nodeType === 'BinaryOperation';
}
/**
 * True if unary increment operation
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isPlusPlusUnaryOperation(node) {
    return node.operator === '++';
}
exports.isPlusPlusUnaryOperation = isPlusPlusUnaryOperation;
/**
 * True if unary delete operation
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isDeleteUnaryOperation(node) {
    return node.operator === 'delete';
}
exports.isDeleteUnaryOperation = isDeleteUnaryOperation;
/**
 * True if unary decrement operation
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isMinusMinusUnaryOperation(node) {
    return node.operator === '--';
}
exports.isMinusMinusUnaryOperation = isMinusMinusUnaryOperation;
/**
 * True if all functions on a contract are implemented
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isFullyImplementedContract(node) {
    return node.fullyImplemented === true;
}
exports.isFullyImplementedContract = isFullyImplementedContract;
/**
 * True if it is a library contract defintion
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isLibrary(node) {
    return node.contractKind === 'library';
}
exports.isLibrary = isLibrary;
/**
 * True if it is a local call to non const function
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isCallToNonConstLocalFunction(node) {
    return isLocalCall(node) && !expressionTypeDescription(node, basicRegex.CONSTANTFUNCTIONTYPE);
}
exports.isCallToNonConstLocalFunction = isCallToNonConstLocalFunction;
/**
 * True if it is a call to a library
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isLibraryCall(node) {
    return isMemberAccess(node, basicRegex.FUNCTIONTYPE, undefined, basicRegex.LIBRARYTYPE, undefined);
}
exports.isLibraryCall = isLibraryCall;
/**
 * True if it is an external call via defined interface (not low level call)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isExternalDirectCall(node) {
    return isMemberAccess(node.expression, basicRegex.EXTERNALFUNCTIONTYPE, undefined, basicRegex.CONTRACTTYPE, undefined) && !isThisLocalCall(node.expression) && !isSuperLocalCall(node.expression);
}
exports.isExternalDirectCall = isExternalDirectCall;
/**
 * True if access to block.timestamp via now alias
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isNowAccess(node) {
    return node.name === 'now' && typeDescription(node, exactMatch(basicTypes.UINT));
}
exports.isNowAccess = isNowAccess;
/**
 * True if access to block.timestamp via now alias
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isTxOriginAccess(node) {
    return isMemberAccess(node, 'address', 'tx', 'tx', 'origin');
}
exports.isTxOriginAccess = isTxOriginAccess;
/**
 * True if access to block.timestamp
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isBlockTimestampAccess(node) {
    return isSpecialVariableAccess(node, specialVariables.BLOCKTIMESTAMP);
}
exports.isBlockTimestampAccess = isBlockTimestampAccess;
/**
 * True if access to block.blockhash
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isBlockBlockHashAccess(node) {
    return (isBuiltinFunctionCall(node) && getLocalCallName(node) === 'blockhash') ||
        isSpecialVariableAccess(node.expression, specialVariables.BLOCKHASH);
}
exports.isBlockBlockHashAccess = isBlockBlockHashAccess;
/**
 * True if call to local function via this keyword
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isThisLocalCall(node) {
    return isMemberAccess(node, basicRegex.FUNCTIONTYPE, exactMatch('this'), basicRegex.CONTRACTTYPE, undefined);
}
exports.isThisLocalCall = isThisLocalCall;
/**
 * True if access to local function via super keyword
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isSuperLocalCall(node) {
    return isMemberAccess(node, basicRegex.FUNCTIONTYPE, exactMatch('super'), basicRegex.CONTRACTTYPE, undefined);
}
exports.isSuperLocalCall = isSuperLocalCall;
/**
 * True if call to local function
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isLocalCall(node) {
    return node.nodeType === 'FunctionCall' && node.kind === 'functionCall' &&
        node.expression.nodeType === 'Identifier' && expressionTypeDescription(node, basicRegex.FUNCTIONTYPE) &&
        !expressionTypeDescription(node, basicRegex.EXTERNALFUNCTIONTYPE);
}
exports.isLocalCall = isLocalCall;
/**
 * True if low level call (send, call, delegatecall, callcode)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isLowLevelCall(node) {
    return isLLCall(node) ||
        isLLDelegatecall(node) ||
        isLLSend(node) ||
        isLLSend04(node) ||
        isLLCallcode(node) ||
        isLLCall04(node) ||
        isLLDelegatecall04(node);
}
exports.isLowLevelCall = isLowLevelCall;
/**
 * True if low level send (solidity < 0.5)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isLLSend04(node) {
    return isMemberAccess(node, exactMatch(remix_lib_1.util.escapeRegExp(lowLevelCallTypes.SEND.type)), undefined, exactMatch(basicTypes.ADDRESS), exactMatch(lowLevelCallTypes.SEND.ident));
}
exports.isLLSend04 = isLLSend04;
/**
 * True if low level send (solidity >= 0.5)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isLLSend(node) {
    return isMemberAccess(node, exactMatch(remix_lib_1.util.escapeRegExp(lowLevelCallTypes.SEND.type)), undefined, exactMatch(basicTypes.PAYABLE_ADDRESS), exactMatch(lowLevelCallTypes.SEND.ident));
}
exports.isLLSend = isLLSend;
/**
 * True if low level call
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isLLCall(node) {
    return isMemberAccess(node, exactMatch(remix_lib_1.util.escapeRegExp(lowLevelCallTypes.CALL.type)), undefined, exactMatch(basicTypes.ADDRESS), exactMatch(lowLevelCallTypes.CALL.ident)) ||
        isMemberAccess(node, exactMatch(remix_lib_1.util.escapeRegExp(lowLevelCallTypes.CALL.type)), undefined, exactMatch(basicTypes.PAYABLE_ADDRESS), exactMatch(lowLevelCallTypes.CALL.ident));
}
exports.isLLCall = isLLCall;
/**
 * True if low level payable call (solidity < 0.5)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isLLCall04(node) {
    return isMemberAccess(node, exactMatch(remix_lib_1.util.escapeRegExp(lowLevelCallTypes['CALL-0.4'].type)), undefined, exactMatch(basicTypes.ADDRESS), exactMatch(lowLevelCallTypes['CALL-0.4'].ident));
}
exports.isLLCall04 = isLLCall04;
/**
 * True if low level callcode
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isLLCallcode(node) {
    return isMemberAccess(node, exactMatch(remix_lib_1.util.escapeRegExp(lowLevelCallTypes.CALLCODE.type)), undefined, exactMatch(basicTypes.ADDRESS), exactMatch(lowLevelCallTypes.CALLCODE.ident));
}
exports.isLLCallcode = isLLCallcode;
/**
 * True if low level delegatecall
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isLLDelegatecall(node) {
    return isMemberAccess(node, exactMatch(remix_lib_1.util.escapeRegExp(lowLevelCallTypes.DELEGATECALL.type)), undefined, matches(basicTypes.PAYABLE_ADDRESS, basicTypes.ADDRESS), exactMatch(lowLevelCallTypes.DELEGATECALL.ident));
}
exports.isLLDelegatecall = isLLDelegatecall;
/**
 * True if low level delegatecall (solidity < 0.5)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isLLDelegatecall04(node) {
    return isMemberAccess(node, exactMatch(remix_lib_1.util.escapeRegExp(lowLevelCallTypes['DELEGATECALL-0.4'].type)), undefined, matches(basicTypes.PAYABLE_ADDRESS, basicTypes.ADDRESS), exactMatch(lowLevelCallTypes['DELEGATECALL-0.4'].ident));
}
exports.isLLDelegatecall04 = isLLDelegatecall04;
/**
 * True if transfer call
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
function isTransfer(node) {
    return isMemberAccess(node, exactMatch(remix_lib_1.util.escapeRegExp(lowLevelCallTypes.TRANSFER.type)), undefined, matches(basicTypes.ADDRESS, basicTypes.PAYABLE_ADDRESS), exactMatch(lowLevelCallTypes.TRANSFER.ident));
}
exports.isTransfer = isTransfer;
function isStringToBytesConversion(node) {
    return isExplicitCast(node, remix_lib_1.util.escapeRegExp('string *'), remix_lib_1.util.escapeRegExp('bytes'));
}
exports.isStringToBytesConversion = isStringToBytesConversion;
function isExplicitCast(node, castFromType, castToType) {
    return node.kind === 'typeConversion' &&
        nodeType(node.expression, exactMatch(nodeTypes.ELEMENTARYTYPENAMEEXPRESSION)) && node.expression.typeName === castToType &&
        nodeType(node.arguments[0], exactMatch(nodeTypes.IDENTIFIER)) && typeDescription(node.arguments[0], castFromType);
}
function isBytesLengthCheck(node) {
    return isMemberAccess(node, exactMatch(remix_lib_1.util.escapeRegExp(basicTypes.UINT)), undefined, remix_lib_1.util.escapeRegExp('bytes *'), 'length');
}
exports.isBytesLengthCheck = isBytesLengthCheck;
/**
 * True if it is a loop
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function isLoop(node) {
    return nodeType(node, exactMatch(nodeTypes.FORSTATEMENT)) ||
        nodeType(node, exactMatch(nodeTypes.WHILESTATEMENT)) ||
        nodeType(node, exactMatch(nodeTypes.DOWHILESTATEMENT));
}
exports.isLoop = isLoop;
// #################### Complex Node Identification - Private
function isMemberAccess(node, retType, accessor, accessorType, memberName) {
    if (node && nodeType(node, exactMatch('MemberAccess'))) {
        const nodeTypeDef = typeDescription(node, retType);
        const nodeMemName = memName(node, memberName);
        const nodeExpMemName = memName(node.expression, accessor);
        const nodeExpTypeDef = expressionTypeDescription(node, accessorType);
        return nodeTypeDef && nodeMemName && nodeExpTypeDef && nodeExpMemName;
    }
    else
        return false;
}
function isSpecialVariableAccess(node, varType) {
    return isMemberAccess(node, exactMatch(remix_lib_1.util.escapeRegExp(varType.type)), varType.obj, varType.obj, varType.member);
}
exports.isSpecialVariableAccess = isSpecialVariableAccess;
// #################### Node Identification Primitives
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function expressionTypeDescription(node, typeRegex) {
    return new RegExp(typeRegex).test(node.expression.typeDescriptions.typeString);
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function typeDescription(node, typeRegex) {
    return new RegExp(typeRegex).test(node.typeDescriptions.typeString);
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function nodeType(node, typeRegex) {
    return new RegExp(typeRegex).test(node.nodeType);
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function nodeTypeIn(node, typeRegex) {
    return typeRegex.some((typeRegex) => nodeType(node, typeRegex));
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function memName(node, memNameRegex) {
    return (node && !memNameRegex) || new RegExp(memNameRegex).test(node.name) || new RegExp(memNameRegex).test(node.memberName);
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function operator(node, opRegex) {
    return new RegExp(opRegex).test(node.operator);
}
// #################### Helpers
function exactMatch(regexStr) {
    return '^' + regexStr + '$';
}
function matches(...fnArgs) {
    const args = [];
    for (let k = 0; k < fnArgs.length; k++) {
        args.push(fnArgs[k]);
    }
    return '(' + args.join('|') + ')';
}
/**
 * Finds first node of a certain type under a specific node.
 * @node {AstNode} node to start form
 * @type {String} Type the ast node should have
 * @return {AstNode} null or node found
 * Note: developed keeping identifier node search in mind to get first identifier node from left in subscope
 */
function findFirstSubNodeLTR(node, type) {
    if (node.nodeType && nodeType(node, type)) {
        return node;
    }
    else if (node.nodeType && nodeType(node, exactMatch('Assignment'))) {
        return findFirstSubNodeLTR(node.leftHandSide, type);
    }
    else if (node.nodeType && nodeType(node, exactMatch('MemberAccess'))) {
        return findFirstSubNodeLTR(node.expression, type);
    }
    else if (node.nodeType && nodeType(node, exactMatch('IndexAccess'))) {
        return findFirstSubNodeLTR(node.baseExpression, type);
    }
    else if (node.nodeType && nodeType(node, exactMatch('UnaryOperation'))) {
        return findFirstSubNodeLTR(node.subExpression, type);
    }
}
/**
 * Builds a function signature as used in the AST of the solc-json AST
 * @param {Array} paramTypes
 *  list of parameter type names
 * @param {Array} returnTypes
 *  list of return type names
 * @return {Boolean} isPayable
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function buildFunctionSignature(paramTypes, returnTypes, isPayable, additionalMods) {
    return 'function (' + remix_lib_1.util.concatWithSeperator(paramTypes, ',') + ')' + ((isPayable) ? ' payable' : '') + ((additionalMods) ? ' ' + additionalMods : '') + ((returnTypes.length) ? ' returns (' + remix_lib_1.util.concatWithSeperator(returnTypes, ',') + ')' : '');
}
function buildAbiSignature(funName, paramTypes) {
    return funName + '(' + remix_lib_1.util.concatWithSeperator(paramTypes, ',') + ')';
}
// To create the method signature similar to contract.evm.gasEstimates.external object
// For address payable, return address
function getMethodParamsSplittedTypeDesc(node, contracts) {
    return node.parameters.parameters.map((varNode, varIndex) => {
        let finalTypeString;
        const typeString = varNode.typeDescriptions.typeString;
        if (typeString.includes('struct')) {
            const fnName = node.name;
            for (const filename in contracts) {
                for (const contractName in contracts[filename]) {
                    const methodABI = contracts[filename][contractName].abi
                        .find(e => {
                        var _a;
                        return e.name === fnName && ((_a = e.inputs) === null || _a === void 0 ? void 0 : _a.length) &&
                            e.inputs[varIndex]['type'].includes('tuple') &&
                            e.inputs[varIndex]['internalType'] === typeString;
                    });
                    if (methodABI && methodABI.inputs) {
                        const inputs = methodABI.inputs[varIndex];
                        const typeStr = getTypeStringFromComponents(inputs['components']);
                        finalTypeString = typeStr + inputs['type'].replace('tuple', '');
                    }
                }
            }
        }
        else {
            finalTypeString = typeString.split(' ')[0];
        }
        return finalTypeString;
    });
}
exports.getMethodParamsSplittedTypeDesc = getMethodParamsSplittedTypeDesc;
function getTypeStringFromComponents(components) {
    let typeString = '(';
    for (let i = 0; i < components.length; i++) {
        const param = components[i];
        if (param.type.includes('tuple') && param.components && param.components.length > 0) {
            typeString = typeString + getTypeStringFromComponents(param.components);
            typeString = typeString + param.type.replace('tuple', '');
        }
        else {
            typeString = typeString + param.type;
        }
        if (i !== components.length - 1) {
            typeString = typeString + ',';
        }
    }
    typeString = typeString + ')';
    return typeString;
}
/**
 * Get compiler version from compiler contract object
 * This is used to redirect the user to specific version of Solidity documentation
 * @param contractFiles compiled contract object
 */
function getCompilerVersion(contractFiles) {
    let version = 'latest';
    const fileNames = Object.keys(contractFiles);
    const contracts = contractFiles[fileNames[0]];
    const contractNames = Object.keys(contracts);
    const contract = contracts[contractNames[0]];
    // For some compiler/contract,  metadata is ""
    if (contract && contract.metadata) {
        const metadata = JSON.parse(contract.metadata);
        const compilerVersion = metadata.compiler.version;
        if (!compilerVersion.includes('nightly')) {
            version = 'v' + compilerVersion.split('+commit')[0];
        }
    }
    return version;
}
exports.getCompilerVersion = getCompilerVersion;
const helpers = {
    expressionTypeDescription,
    nodeType,
    memName,
    operator,
    buildFunctionSignature,
    buildAbiSignature
};
exports.helpers = helpers;
//# sourceMappingURL=staticAnalysisCommon.js.map