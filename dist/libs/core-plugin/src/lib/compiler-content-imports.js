'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompilerImports = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("@remixproject/engine");
const remix_url_resolver_1 = require("@remix-project/remix-url-resolver");
const profile = {
    name: 'contentImport',
    displayName: 'content import',
    version: '0.0.1',
    methods: ['resolve', 'resolveAndSave', 'isExternalUrl']
};
class CompilerImports extends engine_1.Plugin {
    constructor() {
        super(profile);
        this.urlResolver = new remix_url_resolver_1.RemixURLResolver();
        this.previouslyHandled = {}; // cache import so we don't make the request at each compilation.
    }
    setToken() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            try {
                const protocol = typeof window !== 'undefined' && window.location.protocol;
                const token = yield this.call('settings', 'get', 'settings/gist-access-token');
                this.urlResolver.setGistToken(token, protocol);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    isRelativeImport(url) {
        return /^([^/]+)/.exec(url);
    }
    isExternalUrl(url) {
        const handlers = this.urlResolver.getHandlers();
        return handlers.some(handler => handler.match(url));
    }
    /**
      * resolve the content of @arg url. This only resolves external URLs.
      *
      * @param {String} url  - external URL of the content. can be basically anything like raw HTTP, ipfs URL, github address etc...
      * @returns {Promise} - { content, cleanUrl, type, url }
      */
    resolve(url) {
        return new Promise((resolve, reject) => {
            this.import(url, null, (error, content, cleanUrl, type, url) => {
                if (error)
                    return reject(error);
                resolve({ content, cleanUrl, type, url });
            }, null);
        });
    }
    import(url, force, loadingCb, cb) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (typeof force !== 'boolean') {
                const temp = loadingCb;
                loadingCb = force;
                cb = temp;
                force = false;
            }
            if (!loadingCb)
                loadingCb = () => { };
            if (!cb)
                cb = () => { };
            var self = this;
            if (force)
                delete this.previouslyHandled[url];
            var imported = this.previouslyHandled[url];
            if (imported) {
                return cb(null, imported.content, imported.cleanUrl, imported.type, url);
            }
            let resolved;
            try {
                yield this.setToken();
                resolved = yield this.urlResolver.resolve(url);
                const { content, cleanUrl, type } = resolved;
                self.previouslyHandled[url] = {
                    content,
                    cleanUrl,
                    type
                };
                cb(null, content, cleanUrl, type, url);
            }
            catch (e) {
                return cb(new Error('not found ' + url));
            }
        });
    }
    importExternal(url, targetPath) {
        return new Promise((resolve, reject) => {
            this.import(url, 
            // TODO: handle this event
            (loadingMsg) => { this.emit('message', loadingMsg); }, (error, content, cleanUrl, type, url) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                if (error)
                    return reject(error);
                try {
                    const provider = yield this.call('fileManager', 'getProviderOf', null);
                    const path = targetPath || type + '/' + cleanUrl;
                    if (provider)
                        provider.addExternal('.deps/' + path, content, url);
                }
                catch (err) {
                    console.error(err);
                }
                resolve(content);
            }), null);
        });
    }
    /**
      * import the content of @arg url.
      * first look in the browser localstorage (browser explorer) or locahost explorer. if the url start with `browser/*` or  `localhost/*`
      * then check if the @arg url is located in the localhost, in the node_modules or installed_contracts folder
      * then check if the @arg url match any external url
      *
      * @param {String} url - URL of the content. can be basically anything like file located in the browser explorer, in the localhost explorer, raw HTTP, github address etc...
      * @param {String} targetPath - (optional) internal path where the content should be saved to
      * @returns {Promise} - string content
      */
    resolveAndSave(url, targetPath) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            try {
                const provider = yield this.call('fileManager', 'getProviderOf', url);
                if (provider) {
                    if (provider.type === 'localhost' && !provider.isConnected()) {
                        throw new Error(`file provider ${provider.type} not available while trying to resolve ${url}`);
                    }
                    const exist = yield provider.exists(url);
                    /*
                      if the path is absolute and the file does not exist, we can stop here
                      Doesn't make sense to try to resolve "localhost/node_modules/localhost/node_modules/<path>" and we'll end in an infinite loop.
                    */
                    if (!exist && url.startsWith('browser/'))
                        throw new Error(`not found ${url}`);
                    if (!exist && url.startsWith('localhost/'))
                        throw new Error(`not found ${url}`);
                    if (exist) {
                        const content = yield (() => {
                            return new Promise((resolve, reject) => {
                                provider.get(url, (error, content) => {
                                    if (error)
                                        return reject(error);
                                    resolve(content);
                                });
                            });
                        })();
                        return content;
                    }
                    else {
                        const localhostProvider = yield this.call('fileManager', 'getProviderByName', 'localhost');
                        if (localhostProvider.isConnected()) {
                            const splitted = /([^/]+)\/(.*)$/g.exec(url);
                            const possiblePaths = ['localhost/installed_contracts/' + url];
                            if (splitted)
                                possiblePaths.push('localhost/installed_contracts/' + splitted[1] + '/contracts/' + splitted[2]);
                            possiblePaths.push('localhost/node_modules/' + url);
                            if (splitted)
                                possiblePaths.push('localhost/node_modules/' + splitted[1] + '/contracts/' + splitted[2]);
                            for (const path of possiblePaths) {
                                try {
                                    const content = yield this.resolveAndSave(path, null);
                                    if (content) {
                                        localhostProvider.addNormalizedName(path.replace('localhost/', ''), url);
                                        return content;
                                    }
                                }
                                catch (e) { }
                            }
                            return yield this.importExternal(url, targetPath);
                        }
                        return yield this.importExternal(url, targetPath);
                    }
                }
            }
            catch (e) {
                throw new Error(`not found ${url}`);
            }
        });
    }
}
exports.CompilerImports = CompilerImports;
//# sourceMappingURL=compiler-content-imports.js.map