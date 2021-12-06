import { FunctionDefinitionAstNode, ModifierDefinitionAstNode, ParameterListAstNode, ForStatementAstNode, WhileStatementAstNode, VariableDeclarationAstNode, ContractDefinitionAstNode, InheritanceSpecifierAstNode, MemberAccessAstNode, BinaryOperationAstNode, FunctionCallAstNode, ExpressionStatementAstNode, UnaryOperationAstNode, IdentifierAstNode, IndexAccessAstNode, BlockAstNode, AssignmentAstNode, InlineAssemblyAstNode, IfStatementAstNode, CompiledContractObj } from '../../types';
declare type SpecialObjDetail = {
    obj: string;
    member: string;
    type: string;
};
declare const nodeTypes: Record<string, string>;
declare const basicTypes: Record<string, string>;
declare const basicFunctionTypes: Record<string, string>;
declare const lowLevelCallTypes: Record<string, Record<string, string>>;
declare const specialVariables: Record<string, SpecialObjDetail>;
declare function getType(node: any): string;
/**
 * Returns the type parameter of function call AST nodes. Throws if not a function call node
 * @func {ASTNode} Function call node
 * @return {string} type of function call
 */
declare function getFunctionCallType(func: FunctionCallAstNode): string;
/**
 * Get the variable name written to by a effect node, except for inline assembly because there is no information to find out where we write to. Trows if not a effect node or is inlineassmbly.
 * Example: x = 10; => x
 * @effectNode {ASTNode} Assignmnet node
 * @return {string} variable name written to
 */
declare function getEffectedVariableName(effectNode: AssignmentAstNode | UnaryOperationAstNode): string;
/**
 * Returns the identifier of a local call, Throws on wrong node.
 * Example: f(103) => f
 * @localCallNode {ASTNode} Function call node
 * @return {string} name of the function called
 */
declare function getLocalCallName(localCallNode: FunctionCallAstNode): string;
/**
 * Returns the identifier of a this local call, Throws on wrong node.
 * Example: this.f(103) => f
 * @localCallNode {ASTNode} Function call node
 * @return {string} name of the function called
 */
declare function getThisLocalCallName(thisLocalCallNode: FunctionCallAstNode): string;
/**
 * Returns the identifier of a super local call, Throws on wrong node.
 * Example: super.f(103) => f
 * @localCallNode {ASTNode} Function call node
 * @return {string} name of the function called
 */
declare function getSuperLocalCallName(superLocalCallNode: FunctionCallAstNode): string;
/**
 * Returns the contract type of a external direct call, Throws on wrong node.
 * Example:
 *  foo x = foo(0xdeadbeef...);
 *  x.f(103) => foo
 * @extDirectCall {ASTNode} Function call node
 * @return {string} name of the contract the function is defined in
 */
declare function getExternalDirectCallContractName(extDirectCall: FunctionCallAstNode): string;
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
declare function getThisLocalCallContractName(thisLocalCall: FunctionCallAstNode): string;
/**
 * Returns the function identifier of a external direct call, Throws on wrong node.
 * Example:
 *  foo x = foo(0xdeadbeef...);
 *  x.f(103) => f
 * @extDirectCall {ASTNode} Function call node
 * @return {string} name of the function called
 */
declare function getExternalDirectCallMemberName(extDirectCall: FunctionCallAstNode): string;
/**
 * Returns the name of a contract, Throws on wrong node.
 * Example:
 *   Contract foo { => foo
 * @contract {ASTNode} Contract Definition node
 * @return {string} name of a contract defined
 */
declare function getContractName(contract: ContractDefinitionAstNode): string;
/**
 * Returns the name of a function definition, Throws on wrong node.
 * Example:
 *   func foo(uint bla) { => foo
 * @funcDef {ASTNode} Function Definition node
 * @return {string} name of a function defined
 */
declare function getFunctionDefinitionName(funcDef: FunctionDefinitionAstNode): string;
/**
 * Returns the identifier of an inheritance specifier, Throws on wrong node.
 * Example:
 *   contract KingOfTheEtherThrone is b { => b
 * @func {ASTNode} Inheritance specifier
 * @return {string} name of contract inherited from
 */
declare function getInheritsFromName(inheritsNode: InheritanceSpecifierAstNode): string;
/**
 * Returns the identifier of a variable definition, Throws on wrong node.
 * Example:
 *   var x = 10; => x
 * @varDeclNode {ASTNode} Variable declaration node
 * @return {string} variable name
 */
declare function getDeclaredVariableName(varDeclNode: VariableDeclarationAstNode): string;
/**
 * Returns the type of a variable definition, Throws on wrong node.
 * Example:
 *   var x = 10; => x
 * @varDeclNode {ASTNode} Variable declaration node
 * @return {string} variable type
 */
declare function getDeclaredVariableType(varDeclNode: VariableDeclarationAstNode): string;
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
declare function getStateVariableDeclarationsFromContractNode(contractNode: ContractDefinitionAstNode): VariableDeclarationAstNode[];
/**
 * Returns parameter node for a function or modifier definition, Throws on wrong node.
 * Example:
 * function bar(uint a, uint b) => uint a, uint b
 * @funcNode {ASTNode} Contract Definition node
 * @return {parameterlist node} parameterlist node
 */
declare function getFunctionOrModifierDefinitionParameterPart(funcNode: FunctionDefinitionAstNode | ModifierDefinitionAstNode): ParameterListAstNode;
/**
 * Returns return parameter node for a function or modifier definition, Throws on wrong node.
 * Example:
 * function bar(uint a, uint b) returns (bool a, bool b) => bool a, bool b
 * @funcNode {ASTNode} Contract Definition node
 * @return {parameterlist node} parameterlist node
 */
declare function getFunctionDefinitionReturnParameterPart(funcNode: FunctionDefinitionAstNode): ParameterListAstNode;
/**
 * Extracts the parameter types for a function type signature
 * Example:
 * function(uint a, uint b) returns (bool) => uint a, uint b
 * @func {ASTNode} function call node
 * @return {string} parameter signature
 */
declare function getFunctionCallTypeParameterType(func: FunctionCallAstNode): string | undefined;
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
declare function getLibraryCallContractName(node: FunctionCallAstNode): string | undefined;
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
declare function getLibraryCallMemberName(funcCall: FunctionCallAstNode): string;
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
declare function getFullQualifiedFunctionCallIdent(contract: ContractDefinitionAstNode, func: FunctionCallAstNode): string;
declare function getFullQuallyfiedFuncDefinitionIdent(contract: ContractDefinitionAstNode, func: FunctionDefinitionAstNode, paramTypes: any[]): string;
declare function getUnAssignedTopLevelBinOps(subScope: BlockAstNode | IfStatementAstNode | WhileStatementAstNode | ForStatementAstNode): ExpressionStatementAstNode[];
declare function isStatement(node: any): boolean;
/**
 * True if function defintion has function body
 * @funcNode {ASTNode} function defintion node
 * @return {bool}
 */
declare function hasFunctionBody(funcNode: FunctionDefinitionAstNode): boolean;
/**
 * True if node is a delete instruction of a dynamic array
 * @node {ASTNode} node to check for
 * @return {bool}
 */
declare function isDeleteOfDynamicArray(node: UnaryOperationAstNode): boolean;
/**
 * True if node is node is a ref to a dynamic array
 * @node {ASTNode} node to check for
 * @return {bool}
 */
declare function isDynamicArrayAccess(node: IdentifierAstNode): boolean;
/**
 * True if node accesses 'length' member of dynamic array
 * @node {ASTNode} node to check for
 * @return {bool}
 */
declare function isDynamicArrayLengthAccess(node: MemberAccessAstNode): boolean;
/**
 * True if node is a delete instruction for an element from a dynamic array
 * @node {ASTNode} node to check for
 * @return {bool}
 */
declare function isDeleteFromDynamicArray(node: UnaryOperationAstNode): boolean;
/**
 * True if node is the access of a mapping index
 * @node {ASTNode} node to check for
 * @return {bool}
 */
declare function isMappingIndexAccess(node: IndexAccessAstNode): boolean;
/**
 * True if call to code within the current contracts context including (delegate) library call
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isLocalCallGraphRelevantNode(node: FunctionCallAstNode): boolean;
/**
 * True if is builtin function like assert, sha3, erecover, ...
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isBuiltinFunctionCall(node: FunctionCallAstNode): boolean;
/**
 * True if is builtin function like assert, sha3, erecover, ...
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isAbiNamespaceCall(node: FunctionCallAstNode): boolean;
/**
 * True if node is a call to selfdestruct
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isSelfdestructCall(node: FunctionCallAstNode): boolean;
/**
 * True if node is a call to builtin assert(bool)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isAssertCall(node: FunctionCallAstNode): boolean;
/**
 * True if node is a call to builtin require(bool)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isRequireCall(node: FunctionCallAstNode): boolean;
/**
 * True if is storage variable declaration
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isStorageVariableDeclaration(node: VariableDeclarationAstNode): boolean;
/**
 * True if is interaction with external contract (change in context, no delegate calls) (send, call of other contracts)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isInteraction(node: FunctionCallAstNode): boolean;
/**
 * True if node changes state of a variable or is inline assembly (does not include check if it is a global state change, on a state variable)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isEffect(node: AssignmentAstNode | UnaryOperationAstNode | InlineAssemblyAstNode): boolean;
/**
 * True if node changes state of a variable or is inline assembly (Checks if variable is a state variable via provided list)
 * @node {ASTNode} some AstNode
 * @node {list Variable declaration} state variable declaration currently in scope
 * @return {bool}
 */
declare function isWriteOnStateVariable(effectNode: AssignmentAstNode | InlineAssemblyAstNode | UnaryOperationAstNode, stateVariables: VariableDeclarationAstNode[]): boolean;
/**
 * True if there is a variable with name, name in stateVariables
 * @node {ASTNode} some AstNode
 * @node {list Variable declaration} state variable declaration currently in scope
 * @return {bool}
 */
declare function isStateVariable(name: string, stateVariables: VariableDeclarationAstNode[]): boolean;
/**
 * True if is function defintion that is flaged as constant
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isConstantFunction(node: FunctionDefinitionAstNode): boolean;
/**
* True if variable decalaration is converted into a getter method
 * @node {ASTNode} variable declaration AstNode
 * @return {bool}
 */
declare function isVariableTurnedIntoGetter(varDeclNode: VariableDeclarationAstNode): boolean;
/**
 * True if is function defintion has payable modifier
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isPayableFunction(node: FunctionDefinitionAstNode): boolean;
/**
 * True if is constructor
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isConstructor(node: FunctionDefinitionAstNode): boolean;
/**
 * True if node is integer division that truncates (not only int literals since those yield a rational value)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isIntDivision(node: BinaryOperationAstNode): boolean;
/**
 * True if is block / SubScope has top level binops (e.g. that are not assigned to anything, most of the time confused compare instead of assign)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isSubScopeWithTopLevelUnAssignedBinOp(node: BlockAstNode | IfStatementAstNode | WhileStatementAstNode | ForStatementAstNode): boolean | undefined;
/**
 * True if unary increment operation
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isPlusPlusUnaryOperation(node: UnaryOperationAstNode): boolean;
/**
 * True if unary delete operation
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isDeleteUnaryOperation(node: UnaryOperationAstNode): boolean;
/**
 * True if unary decrement operation
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isMinusMinusUnaryOperation(node: UnaryOperationAstNode): boolean;
/**
 * True if all functions on a contract are implemented
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isFullyImplementedContract(node: ContractDefinitionAstNode): boolean;
/**
 * True if it is a library contract defintion
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isLibrary(node: ContractDefinitionAstNode): boolean;
/**
 * True if it is a local call to non const function
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isCallToNonConstLocalFunction(node: FunctionCallAstNode): boolean;
/**
 * True if it is a call to a library
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isLibraryCall(node: MemberAccessAstNode): boolean;
/**
 * True if it is an external call via defined interface (not low level call)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isExternalDirectCall(node: FunctionCallAstNode): boolean;
/**
 * True if access to block.timestamp via now alias
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isNowAccess(node: IdentifierAstNode): boolean;
/**
 * True if access to block.timestamp via now alias
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isTxOriginAccess(node: MemberAccessAstNode): boolean;
/**
 * True if access to block.timestamp
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isBlockTimestampAccess(node: MemberAccessAstNode): boolean;
/**
 * True if access to block.blockhash
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isBlockBlockHashAccess(node: FunctionCallAstNode): boolean;
/**
 * True if call to local function via this keyword
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isThisLocalCall(node: MemberAccessAstNode): boolean;
/**
 * True if access to local function via super keyword
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isSuperLocalCall(node: MemberAccessAstNode): boolean;
/**
 * True if call to local function
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isLocalCall(node: FunctionCallAstNode): boolean;
/**
 * True if low level call (send, call, delegatecall, callcode)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isLowLevelCall(node: MemberAccessAstNode): boolean;
/**
 * True if low level send (solidity < 0.5)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isLLSend04(node: MemberAccessAstNode): boolean;
/**
 * True if low level send (solidity >= 0.5)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isLLSend(node: MemberAccessAstNode): boolean;
/**
 * True if low level call
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isLLCall(node: MemberAccessAstNode): boolean;
/**
 * True if low level payable call (solidity < 0.5)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isLLCall04(node: MemberAccessAstNode): boolean;
/**
 * True if low level callcode
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isLLCallcode(node: MemberAccessAstNode): boolean;
/**
 * True if low level delegatecall
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isLLDelegatecall(node: MemberAccessAstNode): boolean;
/**
 * True if low level delegatecall (solidity < 0.5)
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isLLDelegatecall04(node: MemberAccessAstNode): boolean;
/**
 * True if transfer call
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isTransfer(node: MemberAccessAstNode): boolean;
declare function isStringToBytesConversion(node: FunctionCallAstNode): boolean;
declare function isBytesLengthCheck(node: MemberAccessAstNode): boolean;
/**
 * True if it is a loop
 * @node {ASTNode} some AstNode
 * @return {bool}
 */
declare function isLoop(node: any): boolean;
declare function isSpecialVariableAccess(node: MemberAccessAstNode, varType: SpecialObjDetail): boolean;
declare function expressionTypeDescription(node: any, typeRegex: string): boolean;
declare function nodeType(node: any, typeRegex: string): boolean;
declare function memName(node: any, memNameRegex: any): boolean;
declare function operator(node: any, opRegex: string): boolean;
/**
 * Builds a function signature as used in the AST of the solc-json AST
 * @param {Array} paramTypes
 *  list of parameter type names
 * @param {Array} returnTypes
 *  list of return type names
 * @return {Boolean} isPayable
 */
declare function buildFunctionSignature(paramTypes: any[], returnTypes: any[], isPayable: boolean, additionalMods?: any): string;
declare function buildAbiSignature(funName: string, paramTypes: any[]): string;
declare function getMethodParamsSplittedTypeDesc(node: FunctionDefinitionAstNode, contracts: CompiledContractObj): string[];
/**
 * Get compiler version from compiler contract object
 * This is used to redirect the user to specific version of Solidity documentation
 * @param contractFiles compiled contract object
 */
declare function getCompilerVersion(contractFiles: CompiledContractObj): string;
declare const helpers: {
    expressionTypeDescription: typeof expressionTypeDescription;
    nodeType: typeof nodeType;
    memName: typeof memName;
    operator: typeof operator;
    buildFunctionSignature: typeof buildFunctionSignature;
    buildAbiSignature: typeof buildAbiSignature;
};
export { getType, getThisLocalCallName, getSuperLocalCallName, getFunctionCallType, getContractName, getEffectedVariableName, getDeclaredVariableName, getDeclaredVariableType, getLocalCallName, getInheritsFromName, getExternalDirectCallContractName, getThisLocalCallContractName, getExternalDirectCallMemberName, getFunctionDefinitionName, getFunctionCallTypeParameterType, getLibraryCallContractName, getLibraryCallMemberName, getFullQualifiedFunctionCallIdent, getFullQuallyfiedFuncDefinitionIdent, getStateVariableDeclarationsFromContractNode, getFunctionOrModifierDefinitionParameterPart, getFunctionDefinitionReturnParameterPart, getUnAssignedTopLevelBinOps, getMethodParamsSplittedTypeDesc, getCompilerVersion, isDeleteOfDynamicArray, isDeleteFromDynamicArray, isAbiNamespaceCall, isSpecialVariableAccess, isVariableTurnedIntoGetter, isDynamicArrayAccess, isDynamicArrayLengthAccess, isMappingIndexAccess, isSubScopeWithTopLevelUnAssignedBinOp, hasFunctionBody, isInteraction, isEffect, isTxOriginAccess, isNowAccess, isBlockTimestampAccess, isBlockBlockHashAccess, isThisLocalCall, isSuperLocalCall, isLibraryCall, isLocalCallGraphRelevantNode, isLocalCall, isWriteOnStateVariable, isStateVariable, isTransfer, isLowLevelCall, isLLCall, isLLCall04, isLLCallcode, isLLDelegatecall, isLLDelegatecall04, isLLSend, isLLSend04, isExternalDirectCall, isFullyImplementedContract, isLibrary, isCallToNonConstLocalFunction, isPlusPlusUnaryOperation, isMinusMinusUnaryOperation, isBuiltinFunctionCall, isSelfdestructCall, isAssertCall, isRequireCall, isIntDivision, isStringToBytesConversion, isBytesLengthCheck, isLoop, isDeleteUnaryOperation, isStorageVariableDeclaration, isConstantFunction, isPayableFunction, isConstructor, isStatement, nodeTypes, basicTypes, basicFunctionTypes, lowLevelCallTypes, specialVariables, helpers };
