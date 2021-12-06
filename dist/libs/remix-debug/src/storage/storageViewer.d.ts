/**
   * easier access to the storage resolver
   * Basically one instance is created foreach execution step and foreach component that need it.
   * (TODO: one instance need to be shared over all the components)
   */
export declare class StorageViewer {
    context: any;
    storageResolver: any;
    web3: any;
    initialMappingsLocationPromise: any;
    currentMappingsLocationPromise: any;
    storageChanges: any;
    mappingsLocationChanges: any;
    constructor(_context: any, _storageResolver: any, _traceManager: any);
    /**
      * return the storage for the current context (address and vm trace index)
      * by default now returns the range 0 => 1000
      *
      * @param {Function} - callback - contains a map: [hashedKey] = {key, hashedKey, value}
      */
    storageRange(): Promise<unknown>;
    /**
      * return a slot value for the current context (address and vm trace index)
      * @param {String} - slot - slot key (not hashed key!)
      * @param {Function} - callback - {key, hashedKey, value} -
      */
    storageSlot(slot: any, callback: any): any;
    /**
      * return True if the storage at @arg address is complete
      *
      * @param {String} address  - contract address
      * @return {Bool} - return True if the storage at @arg address is complete
      */
    isComplete(address: any): any;
    /**
      * return all the possible mappings locations for the current context (cached) do not return state changes during the current transaction
      *
      * @param {Array} corrections - used in case the calculated sha3 has been modifyed before SSTORE (notably used for struct in mapping).
      */
    initialMappingsLocation(corrections: any): Promise<any>;
    /**
      * return all the possible mappings locations for the current context (cached) and current mapping slot. returns state changes during the current transaction
      *
      * @param {Array} corrections - used in case the calculated sha3 has been modifyed before SSTORE (notably used for struct in mapping).
      */
    mappingsLocation(corrections: any): Promise<any>;
    /**
      * retrieve mapping location changes from the storage changes.
      * @param {Map} storageChanges
      * @param {Array} corrections - used in case the calculated sha3 has been modifyed before SSTORE (notably used for struct in mapping).
      */
    extractMappingsLocationChanges(storageChanges: any, corrections: any): any;
}
