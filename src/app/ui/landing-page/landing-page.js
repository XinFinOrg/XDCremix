let yo = require('yo-yo')
let csjs = require('csjs-inject')
let globalRegistry = require('../../../global/registry')
let CompilerImport = require('../../compiler/compiler-imports')
var modalDialogCustom = require('../modal-dialog-custom')
var tooltip = require('../tooltip')
var GistHandler = require('../../../lib/gist-handler')
var QueryParams = require('../../../lib/query-params.js')
import * as packageJson from '../../../../package.json'
import { ViewPlugin } from '@remixproject/engine'

let css = csjs`
  .text {
    cursor: pointer;
    font-weight: normal;
    max-width: 300px;
    user-select: none;
    color: var(--primary);
  }
  .text:hover {
    text-decoration: underline;
  }
  .homeContainer {
    user-select:none;
  }
  .thisJumboton {
    padding: 2.5rem 0rem;
    margin-bottom: 4rem;
  }
  .hpLogoContainer {
    margin:30px;
    padding-right: 90px;
  }
  .jumboBtnContainer {
    float: left;
    padding-top: 15px;
    display: flex;
    white-space: nowrap;
  }
  .headlineContainer {
    float: left;
    padding-top: 17px;
    margin: 0 50px 0 70px;
  }
  .hpSections {
    min-width: 640px;
    margin: 0 60px;
  }
  .labelIt {
    margin-bottom: 0;
  }
  .seeAll {
    margin-top: 7px;
    white-space: nowrap;
  }
  .importFrom p {
    margin-right: 10px;
  }
  .logoContainer {
    margin-top: 7px;
    float: left;
  }
  .logoContainer img{
    height: 65px;
  }
  .enviroments {
    display: flex;
  }
}
`

const profile = {
  name: 'home',
  displayName: 'Home',
  methods: [],
  events: [],
  description: ' - ',
  icon: url('./../../../xinfin-logo_42x42.png'),
  location: 'mainPanel',
  version: packageJson.version
}

export class LandingPage extends ViewPlugin {

  constructor (appManager, verticalIcons) {
    super(profile)
    this.profile = profile
    this.appManager = appManager
    this.verticalIcons = verticalIcons
    this.gistHandler = new GistHandler()
  }

  render () {
    let load = function (service, item, examples, info) {
      let compilerImport = new CompilerImport()
      let fileProviders = globalRegistry.get('fileproviders').api
      const msg = yo`
        <div class="p-2">
          <span>Enter the ${item} you would like to load.</span>
          <div>${info}</div>
          <div>e.g ${examples.map((url) => { return yo`<div class="p-1"><a>${url}</a></div>` })}</div>
        </div>`

      modalDialogCustom.prompt(`Import from ${service}`, msg, null, (target) => {
        if (target !== '') {
          compilerImport.import(
            target,
            (loadingMsg) => { tooltip(loadingMsg) },
            (error, content, cleanUrl, type, url) => {
              if (error) {
                modalDialogCustom.alert(error)
              } else {
                if (fileProviders[type]) {
                  fileProviders[type].addReadOnly(cleanUrl, content, url)
                  globalRegistry.get('verticalicon').api.select('fileExplorers')
                }
              }
            }
          )
        }
      })
    }

    let learnMore = () => { window.open('https://remix.readthedocs.io/en/latest/layout.html', '_blank') }

    let startSolidity = () => {
      this.appManager.ensureActivated('solidity')
      this.appManager.ensureActivated('udapp')
      this.appManager.ensureActivated('solidityStaticAnalysis')
      this.appManager.ensureActivated('solidityUnitTesting')
      this.verticalIcons.select('solidity')
    }
    let startVyper = () => {
      this.appManager.ensureActivated('vyper')
      this.appManager.ensureActivated('udapp')
      this.verticalIcons.select('vyper')
    }

    let startPipeline = () => {
      this.appManager.ensureActivated('solidity')
      this.appManager.ensureActivated('pipeline')
      this.appManager.ensureActivated('udapp')
    }
    let startDebugger = () => {
      this.appManager.ensureActivated('debugger')
      this.verticalIcons.select('debugger')
    }
    let startPluginManager = () => {
      this.appManager.ensureActivated('pluginManager')
      this.verticalIcons.select('pluginManager')
    }

    let createNewFile = () => {
      let fileExplorer = globalRegistry.get('fileexplorer/browser').api
      fileExplorer.createNewFile()
    }
    let connectToLocalhost = () => {
      this.appManager.ensureActivated('remixd')
    }
    let importFromGist = () => {
      this.gistHandler.loadFromGist({gist: ''}, globalRegistry.get('filemanager').api)
      this.verticalIcons.select('fileExplorers')
    }

    globalRegistry.get('themeModule').api.events.on('themeChanged', (theme) => {
      const invert = theme.quality === 'dark' ? 1 : 0
      const img = document.getElementById('remixLogo')
      if (img) {
        img.style.filter = `invert(${invert})`
      }
    })

    let switchToPreviousVersion = () => {
      const query = new QueryParams()
      query.update({appVersion: '0.7.7'})
      document.location.reload()
    }
    let container = yo`<div class="${css.homeContainer} bg-light">
      <div>
        <div class="alert alert-info clearfix ${css.thisJumboton}">
          <div class="${css.headlineContainer}">
            <h2 class="">The new layout has arrived</h2>
          </div>
        </div><!-- end of jumbotron -->
      </div><!-- end of jumbotron container -->
      <div class="row ${css.hpSections}">
        <div id="col1" class="col-sm-6">
          <div class="mb-5">
            <h4>Environments</h4>
            <div class="${css.enviroments} pt-2">
              <button class="btn btn-lg btn-secondary mr-3" onclick=${() => { startSolidity() }}>Solidity</button>
              <button class="btn btn-lg btn-secondary" onclick=${() => { startVyper() }}>Vyper</button>
            </div>
          </div>
          <div class="file">
            <h4>File</h4>
            <p class="mb-1 ${css.text}" onclick=${() => { createNewFile() }}>New File</p>
            <p class="mb-1">
              <label class="${css.labelIt} ${css.text}">
                Open Files
                <input title="open file" type="file" onchange="${
                  (event) => {
                    event.stopPropagation()
                    let fileExplorer = globalRegistry.get('fileexplorer/browser').api
                    fileExplorer.uploadFile(event)
                  }
                }" multiple />
              </label>
            </p>
            <p class="mb-1 ${css.text}" onclick=${() => { connectToLocalhost() }}>Connect to Localhost</p>
            <p class="mb-1">Import From:</p>
            <div class="btn-group">
              <button class="btn btn-sm btn-secondary" onclick=${() => { importFromGist() }}>Gist</button>
              <button class="btn btn-sm btn-secondary" onclick=${() => { load('Github', 'github URL', ['https://github.com/0xcert/ethereum-erc721/src/contracts/tokens/nf-token-metadata.sol', 'https://github.com/OpenZeppelin/openzeppelin-solidity/blob/67bca857eedf99bf44a4b6a0fc5b5ed553135316/contracts/access/Roles.sol', 'github:OpenZeppelin/openzeppelin-solidity/contracts/ownership/Ownable.sol#v2.1.2']) }}>GitHub</button>
              <button class="btn btn-sm btn-secondary" onclick=${() => { load('Swarm', 'bzz-raw URL', ['bzz-raw://<swarm-hash>']) }}>Swarm</button>
              <button class="btn btn-sm btn-secondary" onclick=${() => { load('Ipfs', 'ipfs URL', ['ipfs://<ipfs-hash>']) }}>Ipfs</button>
              <button class="btn btn-sm btn-secondary" onclick=${() => { load('Https', 'http/https raw content', ['https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-solidity/master/contracts/crowdsale/validation/IndividuallyCappedCrowdsale.sol']) }}>https</button>
              <button class="btn btn-sm btn-secondary" onclick=${() => { load('@resolver-engine', 'resolver-engine URL', ['github:OpenZeppelin/openzeppelin-solidity/contracts/ownership/Ownable.sol#v2.1.2'], yo`<span>please checkout <a class='text-primary' href="https://github.com/Crypto-Punkers/resolver-engine" target='_blank'>https://github.com/Crypto-Punkers/resolver-engine</a> for more information</span>`) }}>Resolver-engine</button>
            </div><!-- end of btn-group -->
          </div><!-- end of div.file -->
        </div><!-- end of #col1 -->
        <div id="col2" class="col-sm-6">
          <div class="plugins mb-5">
            <h4>Featured Plugins</h4>
            <p class="mb-1 ${css.text}" onclick=${() => { startPipeline() }}>Pipeline</p>
            <p class="mb-1 ${css.text}" onclick=${() => { startDebugger() }}>Debugger</p>
            <p class="mb-1">
              <button onclick=${() => { startPluginManager() }} class="btn btn-sm btn-secondary ${css.seeAll}">
                See all Plugins
                <i class="fas fa-plug p-1" ></i>
              </button>
            </p>
          </div>
        </div><!-- end of #col2 -->
      </div><!-- end of hpSections -->
      </div>`

    return container
  }
}
