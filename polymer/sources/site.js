/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';

import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';

import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';

import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';

import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';

import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icon/iron-icon.js'
import '@polymer/iron-icons/iron-icons.js';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class Site extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
        }
        .full-height {
          height: calc(100% - 16px);
        }
        a {
          color: var(--theme-purple);
          text-decoration: none;
        }
      </style>

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>

      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
      </app-route>
      
      <app-header-layout>
        <app-header class="full-height" slot="header" fixed condenses effects="waterfall">
          <app-toolbar>
            <a href="[[rootPath]]"><div main-title>.me()</div></a>
            <a href="[[rootPath]]/cv"><div>.cv()</div></a>
            <a href="[[rootPath]]/projects"><div>.projects()</div></a>
          </app-toolbar>
          <iron-pages class="full-height" selected="[[page]]" attr-for-selected="name" role="main">
            <me-page name="me"></me-page>
            <projects-page name="projects"></projects-page>
            <contact-page name="contact"></contact-page>
            <page-404 name="page404"></page-404>
          </iron-pages>
      </app-header>


      <!-- <app-drawer-layout fullbleed="" narrow="{{narrow}}"> -->
        <!-- Drawer content -->
        <!-- <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
          <app-toolbar>Menu</app-toolbar>
          <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
            <a name="me" href="[[rootPath]]me">me</a>
            <a name="projects" href="[[rootPath]]projects">projects</a>
            <a name="contact" href="[[rootPath]]contact">contact</a>
          </iron-selector>
        </app-drawer> -->

        <!-- Main content -->
        <!-- <app-header-layout has-scrolling-region="">

          <app-header slot="header" condenses="" reveals="" effects="waterfall">
            <app-toolbar>
              <paper-icon-button icon="my-icons:menu" drawer-toggle=""></paper-icon-button>
              <div main-title="">Youri Reijne</div>
            </app-toolbar>
          </app-header>

        </app-header-layout>
      </app-drawer-layout> -->    
    `;
  }

  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      routeData: Object,
      subroute: Object
    };
  }

  connectedCallback() {
    super.connectedCallback();
    // console.log("halp");
    // console.log(route);
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.page)'
    ];
  }

  _routePageChanged(page) {
    // Show the corresponding page according to the route.
    //
    // If no page was found in the route data, page will be an empty string.
    // Show 'view1' in that case. And if the page doesn't exist, show 'view404'.
    if (!page) {
      this.page = 'me';
    } else if (['me', 'projects', 'contact'].indexOf(page) !== -1) {
      this.page = page;
    } else {
      this.page = 'page404';
    }

    // Close a non-persistent drawer when the page & route are changed.
    if (this.$.drawer) {
      if (!this.$.drawer.persistent) {
        this.$.drawer.close();
      }
    }
  }

  _pageChanged(page) {
    // Import the page component on demand.
    //
    // Note: `polymer build` doesn't like string concatenation in the import
    // statement, so break it up.
    switch (page) {
      case 'me':
        import('./pages/me.js');
        break;
      case 'projects':
        import('./pages/projects.js');
        break;
      case 'contact':
        import('./pages/contact.js');
        break;
      case 'page404':
        import('./pages/404.js');
        break;
    };
  };
}

window.customElements.define('web-site', Site);
