export declare function decodeIntFromHex(value: any, byteLength: any, signed: any): string;
export declare function readFromStorage(slot: any, storageResolver: any): Promise<string>;
/**
 * @returns a hex encoded byte slice of length @arg byteLength from inside @arg slotValue.
 *
 * @param {String} slotValue  - hex encoded value to extract the byte slice from
 * @param {Int} byteLength  - Length of the byte slice to extract
 * @param {Int} offsetFromLSB  - byte distance from the right end slot value to the right end of the byte slice
 */
export declare function extractHexByteSlice(slotValue: any, byteLength: any, offsetFromLSB: any): any;
/**
 * @returns a hex encoded storage content at the given @arg location. it does not have Ox prefix but always has the full length.
 *
 * @param {Object} location  - object containing the slot and offset of the data to extract.
 * @param {Object} storageResolver  - storage resolver
 * @param {Int} byteLength  - Length of the byte slice to extract
 */
export declare function extractHexValue(location: any, storageResolver: any, byteLength: any): Promise<any>;
export declare function toBN(value: any): any;
export declare function add(value1: any, value2: any): any;
export declare function sub(value1: any, value2: any): any;
export declare function removeLocation(type: any): any;
export declare function extractLocation(type: any): any;
export declare function extractLocationFromAstVariable(node: any): any;
export declare function normalizeHex(hex: any): string;
