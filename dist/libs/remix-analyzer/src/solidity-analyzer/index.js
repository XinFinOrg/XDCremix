'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const remix_astwalker_1 = require("@remix-project/remix-astwalker");
const list_1 = (0, tslib_1.__importDefault)(require("./modules/list"));
class staticAnalysisRunner {
    /**
     * Run analysis (Used by IDE)
     * @param compilationResult contract compilation result
     * @param toRun module indexes (compiled from remix IDE)
     * @param callback callback
     */
    run(compilationResult, toRun, callback) {
        const modules = toRun.map((i) => {
            const Module = this.modules()[i];
            const m = new Module();
            return { name: m.name, mod: m };
        });
        this.runWithModuleList(compilationResult, modules, callback);
    }
    /**
     * Run analysis passing list of modules to run
     * @param compilationResult contract compilation result
     * @param modules analysis module
     * @param callback callback
     */
    runWithModuleList(compilationResult, modules, callback) {
        let reports = [];
        // Also provide convenience analysis via the AST walker.
        const walker = new remix_astwalker_1.AstWalker();
        for (const k in compilationResult.sources) {
            walker.walkFull(compilationResult.sources[k].ast, (node) => {
                modules.map((item) => {
                    if (item.mod.visit !== undefined) {
                        try {
                            item.mod.visit(node);
                        }
                        catch (e) {
                            reports.push({
                                name: item.name, report: [{ warning: 'INTERNAL ERROR in module ' + item.name + ' ' + e.message, error: e.stack }]
                            });
                        }
                    }
                });
                return true;
            });
        }
        // Here, modules can just collect the results from the AST walk,
        // but also perform new analysis.
        reports = reports.concat(modules.map((item) => {
            let report = null;
            try {
                report = item.mod.report(compilationResult);
            }
            catch (e) {
                report = [{ warning: 'INTERNAL ERROR in module ' + item.name + ' ' + e.message, error: e.stack }];
            }
            return { name: item.name, report: report };
        }));
        callback(reports);
    }
    /**
     * Get list of all analysis modules
     */
    modules() {
        return list_1.default;
    }
}
exports.default = staticAnalysisRunner;
//# sourceMappingURL=index.js.map