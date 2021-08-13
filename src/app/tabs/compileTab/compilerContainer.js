/* global Worker */
const yo = require('yo-yo')
var helper = require('../../../lib/helper')
const { canUseWorker, urlFromVersion, baseURLBin, baseURLWasm, promisedMiniXhr, pathToURL } = require('../../../lib/compile-utils')
const addTooltip = require('../../ui/tooltip')
const semver = require('semver')

var css = require('../styles/compile-tab-styles')

class CompilerContainer {

  constructor (compileTabLogic, editor, config, queryParams) {
    this._view = {}
    this.compileTabLogic = compileTabLogic
    this.editor = editor
    this.config = config
    this.queryParams = queryParams

    this.data = {
      hideWarnings: config.get('hideWarnings') || false,
      autoCompile: config.get('autoCompile'),
      compileTimeout: null,
      timeout: 300,
      allversions: null,
      selectedVersion: null,
      defaultVersion: 'soljson-v0.5.1+commit.c8a2cb62.js', // this default version is defined: in makeMockCompiler (for browser test) and in package.json (downloadsolc_root) for the builtin compiler
    }
  }

  /**
   * Update the compilation button with the name of the current file
   */
  set currentFile (name = '') {
    if (!this._view.compilationButton) return
    const button = this.compilationButton(name.split('/').pop())
    yo.update(this._view.compilationButton, button)
  }

  deactivate () {
  }

  activate () {
    this.currentFile = this.config.get('currentFile')
    this.listenToEvents()
  }

  listenToEvents () {
    this.editor.event.register('contentChanged', this.scheduleCompilation.bind(this))
    this.editor.event.register('sessionSwitched', this.scheduleCompilation.bind(this))

    this.compileTabLogic.event.on('startingCompilation', () => {
      if (!this._view.compileIcon) return
      this._view.compileIcon.setAttribute('title', 'compiling...')
      this._view.compileIcon.classList.remove(`${css.bouncingIcon}`)
      this._view.compileIcon.classList.add(`${css.spinningIcon}`)
    })

    this.compileTabLogic.compiler.event.register('compilationDuration', (speed) => {
      if (!this._view.warnCompilationSlow) return
      if (speed > 1000) {
        const msg = `Last compilation took ${speed}ms. We suggest to turn off autocompilation.`
        this._view.warnCompilationSlow.setAttribute('title', msg)
        this._view.warnCompilationSlow.style.visibility = 'visible'
      } else {
        this._view.warnCompilationSlow.style.visibility = 'hidden'
      }
    })

    this.editor.event.register('contentChanged', () => {
      if (!this._view.compileIcon) return
      this._view.compileIcon.classList.add(`${css.bouncingIcon}`) // @TODO: compileView tab
    })

    this.compileTabLogic.compiler.event.register('loadingCompiler', () => {
      if (!this._view.compileIcon) return
      this._view.compileIcon.setAttribute('title', 'compiler is loading, please wait a few moments.')
      this._view.compileIcon.classList.add(`${css.spinningIcon}`)
      this._view.warnCompilationSlow.style.visibility = 'hidden'
      this._updateLanguageSelector()
    })

    this.compileTabLogic.compiler.event.register('compilerLoaded', () => {
      if (!this._view.compileIcon) return
      this._view.compileIcon.setAttribute('title', '')
      this._view.compileIcon.classList.remove(`${css.spinningIcon}`)
    })

    this.compileTabLogic.compiler.event.register('compilationFinished', (success, data, source) => {
      if (!this._view.compileIcon) return
      this._view.compileIcon.setAttribute('title', 'idle')
      this._view.compileIcon.classList.remove(`${css.spinningIcon}`)
      this._view.compileIcon.classList.remove(`${css.bouncingIcon}`)
    })
  }

  /**************
   * SUBCOMPONENT
   */
  compilationButton (name) {
    if (!name) name = ''
    var displayed = name === '' ? '<no file selected>' : name
    var el = yo`
    <div class="${css.compilerArticle}">
      <button class="btn btn-primary btn-block ${name === '' ? 'disabled' : ''}" title="Compile" onclick="${this.compile.bind(this)}">
        <span>${this._view.compileIcon} Compile ${displayed}</span>
      </button>
    </div>`
    if (name === '') {
      el.setAttribute('disabled', 'true')
    }
    return el
  }

  _retrieveVersion () {
    let version = this._view.versionSelector.value
    return version.substring(9, version.length)
  }

  render () {
    this.compileTabLogic.compiler.event.register('compilerLoaded', (version) => this.setVersionText(version))
    this.fetchAllVersion((allversions, selectedVersion) => {
      this.data.allversions = allversions
      this.data.selectedVersion = selectedVersion
      if (this._view.versionSelector) this._updateVersionSelector()
    })

    this._view.warnCompilationSlow = yo`<i title="Compilation Slow" style="visibility:hidden" class="${css.warnCompilationSlow} fas fa-exclamation-triangle" aria-hidden="true"></i>`
    this._view.compileIcon = yo`<i class="fas fa-sync ${css.icon}" aria-hidden="true"></i>`
    this._view.autoCompile = yo`<input class="${css.autocompile}" onchange=${this.updateAutoCompile.bind(this)} id="autoCompile" type="checkbox" title="Auto compile">`
    this._view.hideWarningsBox = yo`<input class="${css.autocompile}" onchange=${this.hideWarnings.bind(this)} id="hideWarningsBox" type="checkbox" title="Hide warnings">`
    if (this.data.autoCompile) this._view.autoCompile.setAttribute('checked', '')
    if (this.data.hideWarnings) this._view.hideWarningsBox.setAttribute('checked', '')

    this._view.optimize = yo`<input onchange=${this.onchangeOptimize.bind(this)} id="optimize" type="checkbox">`
    if (this.compileTabLogic.optimize) this._view.optimize.setAttribute('checked', '')

    this._view.versionSelector = yo`
      <select onchange="${this.onchangeLoadVersion.bind(this)}" class="custom-select" id="versionSelector" disabled>
        <option disabled selected>${this.data.defaultVersion}</option>
      </select>`
    this._view.languageSelector = yo`
      <select onchange="${this.onchangeLanguage.bind(this)}" class="custom-select" id="compilierLanguageSelector" title="Available since v0.5.7">
        <option>Solidity</option>
        <option>Yul</option>
      </select>`
    this._view.version = yo`<span id="version"></span>`

    this._view.evmVersionSelector = yo`
      <select onchange="${this.onchangeEvmVersion.bind(this)}" class="custom-select" id="evmVersionSelector">
        <option value="default">compiler default</option>
        <option>petersburg</option>
        <option>constantinople</option>
        <option>byzantium</option>
        <option>spuriousDragon</option>
        <option>tangerineWhistle</option>
        <option>homestead</option>
      </select>`
    if (this.compileTabLogic.evmVersion) {
      let s = this._view.evmVersionSelector
      let i
      for (i = 0; i < s.options.length; i++) {
        if (s.options[i].value === this.compileTabLogic.evmVersion) {
          break
        }
      }
      if (i === s.options.length) { // invalid evmVersion from queryParams
        s.selectedIndex = 0 // compiler default
        this.onchangeEvmVersion()
      } else {
        s.selectedIndex = i
      }
    }

    this._view.compilationButton = this.compilationButton()

    this._view.compileContainer = yo`
      <section>
        <!-- Select Compiler Version -->
        <article>
          <header class="navbar navbar-light p-2 bg-light">
            <div class="row w-100 no-gutters mb-2">
              <div class="col-sm-4">
                <label class="${css.compilerLabel} input-group-text pl-0 border-0" for="versionSelector">Compiler</label>
              </div>
              <div class="col-sm-8">
                ${this._view.versionSelector}
              </div>
            </div>
            <div class="row w-100 no-gutters mb-2">
              <div class="col-sm-4">
                <label class="${css.compilerLabel} input-group-text pl-0 border-0" for="compilierLanguageSelector">Language</label>
              </div>
              <div class="col-sm-8">
                ${this._view.languageSelector}
              </div>
            </div>
            <div class="row w-100 no-gutters">
              <div class="col-sm-4">
                <label class="${css.compilerLabel} input-group-text pl-0 border-0" for="evmVersionSelector">EVM Version</label>
              </div>
              <div class="col-sm-8">
                ${this._view.evmVersionSelector}
              </div>
            </div>
          </header>
          ${this._view.compilationButton}
        </article>
        <!-- Config -->
        <article>
          <small class="${css.compilerSm}">Compiler Configuration</small>
          <ul class="list-group list-group-flush">
            <li class="list-group-item form-group ${css.compilerConfig}">
              ${this._view.autoCompile}
              <label for="autoCompile">Auto compile</label>
            </li>
            <li class="list-group-item form-group ${css.compilerConfig}">
              ${this._view.optimize}
              <label for="optimize">Enable Optimization</label>
            </li>
            <li class="list-group-item form-group ${css.compilerConfig}">
              ${this._view.hideWarningsBox}
              <label for="hideWarningsBox">Hide warnings</label>
            </li>
          </ul>
        </article>
      </section>`

    return this._view.compileContainer
  }

  updateAutoCompile (event) {
    this.config.set('autoCompile', this._view.autoCompile.checked)
  }

  compile (event) {
    if (this.config.get('currentFile')) {
      this.compileTabLogic.runCompiler()
    }
  }

  compileIfAutoCompileOn () {
    if (this.config.get('autoCompile')) {
      this.compile()
    }
  }

  hideWarnings (event) {
    this.config.set('hideWarnings', this._view.hideWarningsBox.checked)
    this.compileIfAutoCompileOn()
  }

  onchangeOptimize () {
    this.compileTabLogic.setOptimize(!!this._view.optimize.checked)
    this.compileIfAutoCompileOn()
  }

  onchangeLanguage (event) {
    this.compileTabLogic.setLanguage(event.target.value)
    this.compileIfAutoCompileOn()
  }

  onchangeEvmVersion (_) {
    let s = this._view.evmVersionSelector
    let v = s.value
    if (v === 'default') {
      v = null
    }
    this.compileTabLogic.setEvmVersion(v)
    this.compileIfAutoCompileOn()
  }

  onchangeLoadVersion (event) {
    this.data.selectedVersion = this._view.versionSelector.value
    this._updateVersionSelector()
    this._updateLanguageSelector()
  }

  _updateVersionSelector () {
    this._view.versionSelector.innerHTML = ''
    this.data.allversions.forEach(build => {
      const option = build.path === this.data.selectedVersion
        ? yo`<option value="${build.path}" selected>${build.longVersion}</option>`
        : yo`<option value="${build.path}">${build.longVersion}</option>`
      this._view.versionSelector.appendChild(option)
    })
    this._view.versionSelector.removeAttribute('disabled')
    this.queryParams.update({ version: this.data.selectedVersion })
    let url
    if (this.data.selectedVersion === 'builtin') {
      let location = window.document.location
      location = `${location.protocol}//${location.host}/${location.pathname}`
      if (location.endsWith('index.html')) location = location.substring(0, location.length - 10)
      if (!location.endsWith('/')) location += '/'
      url = location + 'soljson.js'
    } else {
      if (this.data.selectedVersion.indexOf('soljson') !== 0 || helper.checkSpecialChars(this.data.selectedVersion)) {
        return console.log('loading ' + this.data.selectedVersion + ' not allowed')
      }
      url = `${urlFromVersion(this.data.selectedVersion)}`
    }
    // Workers cannot load js on "file:"-URLs and we get a
    // "Uncaught RangeError: Maximum call stack size exceeded" error on Chromium,
    // resort to non-worker version in that case.
    if (this.data.selectedVersion !== 'builtin' && canUseWorker(this.data.selectedVersion)) {
      this.compileTabLogic.compiler.loadVersion(true, url)
    } else {
      this.compileTabLogic.compiler.loadVersion(false, url)
    }
  }

  _updateLanguageSelector () {
    if (semver.lt(this._retrieveVersion(), 'v0.5.7+commit.6da8b019.js')) {
      this._view.languageSelector.setAttribute('disabled', '')
      this._view.languageSelector.value = 'Solidity'
      this.compileTabLogic.setLanguage('Solidity')
    } else {
      this._view.languageSelector.removeAttribute('disabled')
    }
  }

  setVersionText (text) {
    this.data.version = text
    if (this._view.version) this._view.version.innerText = text
  }

  async fetchAllVersion (callback) {
    let selectedVersion, allVersionsWasm
    let allVersions = [{ path: 'builtin', longVersion: 'latest local version - 0.7.4' }]
    // fetch normal builds
    const binRes = await promisedMiniXhr(`${baseURLBin}/list.json`)
    // fetch wasm builds
    const wasmRes = await promisedMiniXhr(`${baseURLWasm}/list.json`)

    if (binRes.event.type === 'error' && wasmRes.event.type === 'error') {
      selectedVersion = 'builtin'
      return callback(allVersions, selectedVersion)
    }
    try {
      const versions = JSON.parse(binRes.json).builds.slice().reverse()

      allVersions = [...allVersions, ...versions]
      selectedVersion = this.data.defaultVersion
      if (this.queryParams.get().version) selectedVersion = this.queryParams.get().version
      // // Check if version is a URL and corresponding filename starts with 'soljson'
      // if (selectedVersion.startsWith('https://')) {
      //   const urlArr = selectedVersion.split('/')

      //   if (urlArr[urlArr.length - 1].startsWith('soljson')) isURL = true
      // }
      if (wasmRes.event.type !== 'error') {
        allVersionsWasm = JSON.parse(wasmRes.json).builds.slice().reverse()
      }
    } catch (e) {
      console.log(e);
      addTooltip('Cannot load compiler version list. It might have been blocked by an advertisement blocker. Please try deactivating any of them from this page and reload.')
    }

    // replace in allVersions those compiler builds which exist in allVersionsWasm with new once
    if (allVersionsWasm && allVersions) {
      allVersions.forEach((compiler, index) => {
        const wasmIndex = allVersionsWasm.findIndex(wasmCompiler => { return wasmCompiler.longVersion === compiler.longVersion })
        if (wasmIndex !== -1) {
          allVersions[index] = allVersionsWasm[wasmIndex]
          pathToURL[compiler.path] = baseURLWasm
        } else {
          pathToURL[compiler.path] = baseURLBin
        }
      })
    }
    
    callback(allVersions, selectedVersion)
  }

  scheduleCompilation () {
    if (!this.config.get('autoCompile')) return
    if (this.data.compileTimeout) window.clearTimeout(this.data.compileTimeout)
    this.data.compileTimeout = window.setTimeout(() => this.compileIfAutoCompileOn(), this.data.timeout)
  }

}

module.exports = CompilerContainer
