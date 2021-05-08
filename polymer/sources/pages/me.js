// Page containing information about me, and a canvas showing some fun shit 

import { Polymer } from '@polymer/polymer/polymer-legacy.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import { visfun, getWindowFormat } from '../general.js';
// import {getMaxSize, getMaxSquares, getStandardCount, getStandardSize, getWindowFormat, getStandardSpeed, getMaxSpeed} from'../general.js';
import '../elements/tree';

class Me extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          width: 100%;
          height: 100%;
        }        
      </style>
      <me-desktop style="slowdown:[[slowdown]]"></me-desktop>
    `;
  }
  
  static get properties() {
    return {
      slowdown: {
        type: Boolean
      },
    };
  }
  
  connectedCallback() {
    super.connectedCallback();
  }
}

window.customElements.define('me-page', Me);

// Desktop version
class MeDesktop extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          --paper-input-container-color: var(--theme-purple);
          --paper-input-container-input-color: var(--lightest-gray);
          --paper-input-container-focus-color: var(--theme-light-purple);
        }
        .container {
          display: grid; 
          height: 100%;
          width: 100%;
        }
        .verticon {
          position:relative;
          z-index: 10;
          height: 100%;
          display: grid;
          grid-template-rows: [st1] auto [st2] auto [md1] auto [md2] auto [en1] auto [en2]
        }
        .theme-purple {
          color: var(--theme-purple);
        }
        .start {
          grid-row: st1/st2;
        }
        .mid {
          grid-row: md1/md2; 
        }
        .end {
          grid-row: en1/en2;
        }
        .sidebyside {
          display: grid;
          grid-template-columns: 50% auto;
        }
        h1 {
          display: inline;
          margin: 0px;
        }
        h3 {
          margin: 0px;
        }
        .leftSpace {
          margin-left: 10%;
        }
        hr {
          border: 1px solid var(--theme-dark-purple);
        }
        .spacer {
          margin-top: 10%;
        }
      </style>
      <flex-container>
      
      <div id="dogshite" class="container" style="grid-template-columns: [[columnus]];">
        <div>
          <tree-canvas ctype="desktop" viscount=[[inputcount]] vissize=[[inputsize]] visspeed=[[inputspeed]]></tree-canvas>
        </div>
        <div>
          <div style="z-index: 10"class="verticon">
            <div class="mid" style="grid-row: [[highrows]]">
              <h1>Youri_Reijne</h1>
              <hr>
              <div class="sidebyside">
                <h3 class="theme-purple">.Properties()</h3><h3 class= "theme-purple">.Qualifications()</h3>
              </div>
              <div class="sidebyside">
                <h3 class="leftSpace">Driven</h3><h3 class="leftSpace">Software Engineer</h3>
              </div>
              <div class="sidebyside">
                <h3 class="leftSpace">Creative</h3><h3 class="leftSpace">Game Developer</h3>
              </div>
              <div class="sidebyside">
                <h3 class="leftSpace">Enthusiastic</h3><h3 class="leftSpace">Website Designer</h3>
              </div>
            </div>
            <div class="end" style="grid-row: [[lowrows]]">
              <form>
                <paper-input id="inCount" type="text" on-input="changeCount" label="Count:" value="[[inputcount]]"></paper-input>
                <paper-input id="inSize" type="text" on-input="changeSize" label="Size:" value="[[inputsize]]"></paper-input>
                <paper-input id="inSpeed" type="text" on-input="changeSpeed" label="Speed:" value="[[inputspeed]]"></paper-input>
              </form>
            </div>  
          </div>
        </div>
      </div>
      

      </flex-container>
    `;
  }

  static get properties() {
    return {
      inputcount: String,
      inputsize: String,
      inputspeed: String,
      themecolor: String,
      columnus: String,
      lowrows: String,
      highrows: String,
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.inputcount = visfun.getStandardCount();
    this.inputsize = visfun.getStandardSize();
    window.addEventListener("resize", this._onResize.bind(this));
    this._onResize();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("resize", this._onResize.bind(this));
  }


  _onResize() {
    const showSize = getWindowFormat();
    if (showSize == "mobile") {
      this.columnus = "0% auto";
      this.highrows = "st2/md1";
      this.lowrows = "md1/md2";
    } else if (showSize == "tablet") {
      this.columnus = "30% auto";
      this.highrows = "md1/md2";
      this.lowrows = "en1/en2";
    } else {
      this.columnus = "50% auto";
      this.highrows = "md1/md2";
      this.lowrows = "en1/en2";
    }
    this.setStandard();
  }

  setStandard() {
    const viscount = visfun.getStandardCount();
    this.$.inCount.value = viscount;
    this.inputcount = viscount;
    
    const vissize = visfun.getStandardSize();
    this.$.inSize.value = vissize;
    this.inputsize = vissize;

    const visspeed = visfun.getStandardSpeed();
    this.$.inSpeed.value = visspeed;
    this.inputspeed = visspeed;
  }

  changeCount() {
    if (this.$.inCount.value < 0) {
      this.$.inCount.value = 1;
    } else if (this.$.inCount.value > visfun.getMaxSquares()) {
      this.$.inCount.value = visfun.getMaxSquares();
    } 
    this.inputcount = this.$.inCount.value;
  }
  changeSize() {
    if (this.$.inSize.value < 0) {
      this.$.inSize.value = 1;
    } else if (this.$.inSize.value > visfun.getMaxSize()) {
      this.$.inSize.value = visfun.getMaxSize();
    } 
    this.inputsize = this.$.inSize.value;
  }
  changeSpeed() {
    if (this.$.inSpeed.value < 0) {
      this.$.inSpeed.value = 1;
    } else if (this.$.inSpeed.value > visfun.getMaxSpeed()) {
      this.$.inSpeed.value = visfun.getMaxSpeed();
    } 
    this.inputspeed = this.$.inSpeed.value;
  }
}

window.customElements.define('me-desktop', MeDesktop);

// Tablet version

// Mobile version