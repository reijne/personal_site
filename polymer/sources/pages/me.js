// Page containing information about me, and a canvas showing some fun shit 

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import {getMaxSize, getMaxSquares} from'../general.js';
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
      <me-desktop style="display:[[showdesktop]]"></me-desktop>
    `;
  }
  
  static get properties() {
    return {
      showmobile: {
        type: String
      }, 
      showtablet: {
        type: String
      },
      showdesktop: {
        type: String
      }
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
          grid-template-columns: 50% auto; 
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
        h1 {
          display: inline;
        }
        p {
          margin-left: 10%;
        }
        hr {
          border: 1px solid var(--theme-dark-purple);
        }
      </style>

      <div class="container">
        <div>
          <tree-canvas ctype="desktop" viscount=[[inputcount]] vissize=[[inputsize]]></tree-canvas>
        </div>
        <div>
          <div style="z-index: 10"class="verticon">
            <div class="mid">
              <h1>Youri</h1><h1 class="theme-purple">.me()</h1>
              <hr>
              <p>Software Engineer</p>
              <p>Game Developer</p>
              <p>Website Designer</p>
            </div>
            <div class="end">
              <form>
                <paper-input id="inCount" type="text" on-input="changeCount" label="Count:" value="50"></paper-input>
                <paper-input id="inSize" type="text" on-input="changeSize" label="Size:" value="5"></paper-input>
              </form>
            </div>  
          </div>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      inputcount: {
        type: String
      },
      inputsize: {
        type: String
      },
      themecolor: {
        type: String
      }
    }
  }

  changeCount() {
    if (this.$.inCount.value < 0) {
      this.$.inCount.value = 1;
    } else if (this.$.inCount.value > getMaxSquares()) {
      this.$.inCount.value = getMaxSquares();
    } 
    this.inputcount = this.$.inCount.value;
  }
  changeSize() {
    if (this.$.inSize.value < 0) {
      this.$.inSize.value = 1;
    } else if (this.$.inSize.value > getMaxSize()) {
      this.$.inSize.value = getMaxSize();
    } 
    this.inputsize = this.$.inSize.value;
  }
}

window.customElements.define('me-desktop', MeDesktop);

// Tablet version

// Mobile version