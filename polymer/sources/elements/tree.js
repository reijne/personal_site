import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';


class Tree extends PolymerElement {
  static get template() {
    return html`
      <style>
        canvas {
          background-color: rgba(0,0,0,0);
          margin: 0px;
          padding: 0px;
        }
        .behind {
          z-index: 0;
        }
      </style>      
      <canvas class="behind" id="canvas"></canvas>
    `;
  }
  
  static get properties() {
    return {
      ctype: {
        type: String	
      },
      width: {
        type: Number,
        observer: '_redraw'
      },
      height: {
        type: Number,
        observer: '_redraw'
      },
      canvas: {
        type: Object
      },
      ctx: {
        type: Object
      },
      squares: {
        type: Object
      },
      viscount: {
        type: Number,
        observer: '_redraw'
      },
      vissize: {
        type: Number,
        observer: '_redraw'
      }
    };
  }
  
  connectedCallback() {
    super.connectedCallback();
    this._onResize = this.setSize.bind(this);
    window.addEventListener("resize", this._onResize);

    this.canvas = this.$.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.setSize();
    this.createSquares();
    this._animate();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("resize", this._onResize);
  }

  setSize() {
    if (this.ctype == "desktop") {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
    } else if (this.ctype == "tablet") {

    } else if (this.ctype == "mobile") {

    }
  }

  createSquares() {
    // Define the amount of visualisations and their size
    var thisManyVis = 50;
    var size = 5;
    if (this.viscount) thisManyVis = parseInt(this.viscount);
    if (this.vissize) size = parseInt(this.vissize);

    // Set the style
    var alpha = 50 / (size * (0.1*thisManyVis));
    if (alpha < 0.1) alpha = 0.1;
    this.ctx.fillStyle = "rgba(255,255,255," + alpha + ")";

    this.squares = [];
    const speed = 4;    
    for (let i = 0; i < thisManyVis; i++) {
      var x = Math.random() * (this.width - 3*size) + size;
      var y = Math.random() * (this.height - 3*size) + size;
      var dx = (Math.random() - 0.5) * speed;
      var dy = (Math.random() - 0.5) * speed;
      this.squares.push(new WalkingSquare(x, y, dx, dy, this.ctx, size, this.width, this.height,
                                           "rgba(255,255,255," + alpha + ")"));
    }
  }

  _animate() {
    requestAnimationFrame(this._animate.bind(this));
    this.ctx.clearRect(0, 0, this.width, this.height)
    for (let i = 0; i < this.squares.length; i++) {
      this.squares[i].update();
    }
  }

  _redraw() {
    this.createSquares();
    // this._animate();
  }
}

window.customElements.define('tree-canvas', Tree);

class WalkingSquare {
  constructor(x, y, dx, dy, ctx, size, width, height, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.ctx = ctx;
    this.size = size;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  // Move the square along using its velocity but clip at the screen and bounce.
  update() {
    if (this.x > (this.width - this.size)) {
      this.x = this.width - this.size;
      this.dx = -this.dx;
    } else if (this.x < 0) {
      this.x = 0;
      this.dx = -this.dx;
    } 
    if (this.y > (this.height - this.size)) {
      this.y = this.height - this.size;
      this.dy = -this.dy;
    } else if (this.y < 0){
      this.y = 0;
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }
}