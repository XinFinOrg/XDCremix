'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraceStepManager = void 0;
const traceHelper_1 = require("./traceHelper");
const remix_lib_1 = require("@remix-project/remix-lib");
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
//# sourceMappingURL=traceStepManager.js.map