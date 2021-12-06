import { Address as AddressType } from './types/Address';
import { ArrayType } from './types/ArrayType';
import { Bool as BoolType } from './types/Bool';
import { DynamicByteArray as BytesType } from './types/DynamicByteArray';
import { FixedByteArray as BytesXType } from './types/FixedByteArray';
import { Enum as EnumType } from './types/Enum';
import { StringType } from './types/StringType';
import { Struct as StructType } from './types/Struct';
import { Int as IntType } from './types/Int';
import { Uint as UintType } from './types/Uint';
/**
  * Uint decode the given @arg type
  *
  * @param {String} type - type given by the AST (e.g uint256, uint32)
  * @return {Object} returns decoded info about the current type: { storageBytes, typeName}
  */
declare function uint(type: any): UintType;
/**
  * Int decode the given @arg type
  *
  * @param {String} type - type given by the AST (e.g int256, int32)
  * @return {Object} returns decoded info about the current type: { storageBytes, typeName}
  */
declare function int(type: any): IntType;
/**
  * Address decode the given @arg type
  *
  * @param {String} type - type given by the AST (e.g address)
  * @return {Object} returns decoded info about the current type: { storageBytes, typeName}
  */
declare function address(type: any): AddressType;
/**
  * Bool decode the given @arg type
  *
  * @param {String} type - type given by the AST (e.g bool)
  * @return {Object} returns decoded info about the current type: { storageBytes, typeName}
  */
declare function bool(type: any): BoolType;
/**
  * DynamicByteArray decode the given @arg type
  *
  * @param {String} type - type given by the AST (e.g bytes storage ref)
  * @param {null} stateDefinitions - all state definitions given by the AST (including struct and enum type declaration) for all contracts
  * @param {null} contractName - contract the @args typeName belongs to
  * @param {String} location - location of the data (storage ref| storage pointer| memory| calldata)
  * @return {Object} returns decoded info about the current type: { storageBytes, typeName}
  */
declare function dynamicByteArray(type: any, stateDefinitions: any, contractName: any, location: any): BytesType;
/**
  * FixedByteArray decode the given @arg type
  *
  * @param {String} type - type given by the AST (e.g bytes16)
  * @return {Object} returns decoded info about the current type: { storageBytes, typeName}
  */
declare function fixedByteArray(type: any): BytesXType;
/**
  * StringType decode the given @arg type
  *
  * @param {String} type - type given by the AST (e.g string storage ref)
  * @param {null} stateDefinitions - all state definitions given by the AST (including struct and enum type declaration) for all contracts
  * @param {null} contractName - contract the @args typeName belongs to
  * @param {String} location - location of the data (storage ref| storage pointer| memory| calldata)
  * @return {Object} returns decoded info about the current type: { storageBytes, typeName}
  */
declare function stringType(type: any, stateDefinitions: any, contractName: any, location: any): StringType;
/**
  * ArrayType decode the given @arg type
  *
  * @param {String} type - type given by the AST (e.g int256[] storage ref, int256[] storage ref[] storage ref)
  * @param {Object} stateDefinitions - all state definitions given by the AST (including struct and enum type declaration) for all contracts
  * @param {String} contractName - contract the @args typeName belongs to
  * @param {String} location - location of the data (storage ref| storage pointer| memory| calldata)
  * @return {Object} returns decoded info about the current type: { storageBytes, typeName, arraySize, subArray}
  */
declare function array(type: any, stateDefinitions: any, contractName: any, location: any): ArrayType;
/**
  * Enum decode the given @arg type
  *
  * @param {String} type - type given by the AST (e.g enum enumDef)
  * @param {Object} stateDefinitions - all state definitions given by the AST (including struct and enum type declaration) for all contracts
  * @param {String} contractName - contract the @args typeName belongs to
  * @return {Object} returns decoded info about the current type: { storageBytes, typeName, enum}
  */
declare function enumType(type: any, stateDefinitions: any, contractName: any): EnumType;
/**
  * Struct decode the given @arg type
  *
  * @param {String} type - type given by the AST (e.g struct structDef storage ref)
  * @param {Object} stateDefinitions - all state definitions given by the AST (including struct and enum type declaration) for all contracts
  * @param {String} contractName - contract the @args typeName belongs to
  * @param {String} location - location of the data (storage ref| storage pointer| memory| calldata)
  * @return {Object} returns decoded info about the current type: { storageBytes, typeName, members}
  */
declare function struct(type: any, stateDefinitions: any, contractName: any, location: any): StructType;
/**
  * parse the type and return an object representing the type
  *
  * @param {Object} type - type name given by the ast node
  * @param {Object} stateDefinitions - all state stateDefinitions given by the AST (including struct and enum type declaration) for all contracts
  * @param {String} contractName - contract the @args typeName belongs to
  * @param {String} location - location of the data (storage ref| storage pointer| memory| calldata)
  * @return {Object} - return the corresponding decoder or null on error
  */
declare function parseType(type: any, stateDefinitions: any, contractName: any, location: any): any;
/**
  * compute offset (slot offset and byte offset of the @arg list of types)
  *
  * @param {Array} types - list of types
  * @param {Object} stateDefinitions - all state definitions given by the AST (including struct and enum type declaration) for all contracts
  * @param {String} contractName - contract the @args typeName belongs to
  * @param {String} location - location of the data (storage ref| storage pointer| memory| calldata)
  * @return {Array} - return an array of types item: {name, type, location}. location defines the byte offset and slot offset
  */
declare function computeOffsets(types: any, stateDefinitions: any, contractName: any, location: any): {
    typesOffsets: any[];
    endLocation: {
        offset: number;
        slot: number;
    };
};
export { parseType, computeOffsets, uint as Uint, address as Address, bool as Bool, dynamicByteArray as DynamicByteArray, fixedByteArray as FixedByteArray, int as Int, stringType as String, array as Array, enumType as Enum, struct as Struct };
