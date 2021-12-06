'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Struct = void 0;
const tslib_1 = require("tslib");
const util_1 = require("./util");
const RefType_1 = require("./RefType");
const Mapping_1 = require("./Mapping");
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
                }
                catch (e) {
                    console.log(e);
                    ret[item.name] = { error: '<decoding failed - ' + e.message + '>' };
                }
            }
            return { value: ret, type: this.typeName };
        });
    }
    decodeFromMemoryInternal(offset, memory) {
        const ret = {};
        this.members.map((item, i) => {
            var contentOffset = offset;
            var member = item.type.decodeFromMemory(contentOffset, memory);
            ret[item.name] = member;
            if (!(item.type instanceof Mapping_1.Mapping))
                offset += 32;
        });
        return { value: ret, type: this.typeName };
    }
}
exports.Struct = Struct;
//# sourceMappingURL=Struct.js.map