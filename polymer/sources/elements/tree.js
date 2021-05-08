import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
// import { getThemeColors, getStandardCount, getStandardSize, getStandardSpeed } from '../general.js'
import { visfun, getThemeColors } from '../logic/general.js'

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
      width: {
        type: Number,
        observer: '_redraw'
      },
      height: {type: Number,
               observer: '_redraw'
      },
      canvas: Object,
      ctx: Object,
      squares: Object,
      viscount: {
        type: Number,
        observer: '_redraw'
      },
      vissize: {
        type: Number,
        observer: '_redraw'
      },
      visspeed: {
        type: Number,
        observer: '_redraw'
      }
    };
  }
  
  connectedCallback() {
    super.connectedCallback();
    this._onResize = this.setSize.bind(this);
    window.addEventListener("resize", this._onResize);
    window.addEventListener("mousedown", this._onMouseDown);
    window.addEventListener("mouseup", this._onMouseUp);

    this.canvas = this.$.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.setSize();
    this.createSquares();
    this._animate();
    console.log(getThemeColors());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("resize", this._onResize);
    window.removeEventListener("mousedown", this._onMouseDown);
    window.removeEventListener("mouseup", this._onMouseUp);
  }

  setSize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  createSquares() {
    // Define the amount of visualisations and their size
    var thisManyVis = visfun.getStandardCount();
    var size = visfun.getStandardSize();
    var speed = visfun.getStandardSpeed();
    if (this.viscount) thisManyVis = parseInt(this.viscount);
    if (this.vissize) size = parseInt(this.vissize);
    if (this.visspeed) speed = parseInt(this.visspeed);

    // Set the style
    var alpha = 50 / (size * Math.sqrt(thisManyVis));
    if (alpha < 0.1) alpha = 0.1;
    this.ctx.fillStyle = "rgba(255,255,255," + alpha + ")";

    this.squares = [];
    var colors = getThemeColors();
    var whiteTransparant = "rgba(255,255,255," + alpha + ")"
    for (let i = 0; i < thisManyVis; i++) {
      var x = Math.random() * (this.width - 3*size) + size;
      var y = Math.random() * (this.height - 3*size) + size;
      var dx = (Math.random() - 0.5) * speed;
      var dy = (Math.random() - 0.5) * speed;
      var color = colors[Math.floor(Math.random() * colors.length)]
      var choice = Math.random();
      // var randSize = Math.random() * size;
      var randSize = size;
      if (choice > 0.3) color = whiteTransparant;
      this.squares.push(new WalkingSquare(x, y, dx, dy, this.ctx, randSize, this.width, this.height,
                                           color));
    }
  }

  _animate() {
    requestAnimationFrame(this._animate.bind(this));
    this.ctx.clearRect(0, 0, this.width, this.height)
    for (let i = 0; i < this.squares.length; i++) {
      this.squares[i].update();
      if (visfun.justClicked) this.squares[i].setRandomDirection();
    }
    if (visfun.justClicked) visfun.justClicked = false; 
  }

  _redraw() {
    this.createSquares();
  }

  _onMouseDown(event) {
    visfun.setMousePosition(event.pageX, event.pageY, event.which);
  }

  _onMouseUp() {
    visfun.setMousePosition(null, null, 1);
    visfun.justClicked = true;
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

  // Draw the square
  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  // Draw the tail of the square based on the velocity and a minimal size for a tail segment
  drawTail(size, accumSize) {
    if (size < 0.0625 * this.size) return;
    this.ctx.fillStyle = this.color;
    var xer;
    var yer;
    if (this.dx > 0) {
      xer = this.x - 0.5 * this.dx * (this.size + accumSize);    
    } else {
      xer = this.x - this.dx * (this.size + accumSize);    
    }

    if (this.dy > 0) {
      yer = this.y - 0.5 * this.dy * (this.size + accumSize);
    } else {
      yer = this.y - this.dy * (this.size + accumSize);
    }
    this.ctx.fillRect(xer, yer, size, size);
    this.drawTail(0.5*size, accumSize+size);
  }

  // Move the square along using its velocity but clip at the screen and bounce.
  update() {
    this.bounceOnBorders();
    this.moveSquare();
    this.drawTail(0.5*this.size, 0);
    this.draw();
  }

  // Bounce the square of the borders of the screen if it reaches it.
  bounceOnBorders() {
    if (this.x > (this.width - this.size)) {
      this.x = this.width - this.size;
      this.dx = -this.dx;
    } else if (this.x < 0) {
      this.x = 0;
      this.dx = -this.dx;
    } 
    if (this.y > (this.height - this.size - 64)) {
      this.y = this.height - this.size - 64;
      this.dy = -this.dy;
    } else if (this.y < 0){
      this.y = 0;
      this.dy = -this.dy;
    }
  }

  // Move the square to the mousedown position, or just along using the velocity.
  moveSquare() {
    if (visfun.mouse_x != null) {
      if (visfun.mouse_x > this.x) this.x -= visfun.directionMultiplier*Math.abs(this.dx);
      else if (visfun.mouse_x < this.x) this.x += visfun.directionMultiplier*Math.abs(this.dx);

      if (visfun.mouse_y > this.y+64) this.y -= visfun.directionMultiplier*Math.abs(this.dy);
      else if (visfun.mouse_y < this.y+64) this.y += visfun.directionMultiplier*Math.abs(this.dy);
    } else {
      this.x += this.dx;
      this.y += this.dy;
    }
  }

  setRandomDirection() {
    console.log("setting random position");
    if (Math.random() > 0.5) this.dx = -this.dx;
    if (Math.random() > 0.5) this.dy = -this.dy;
  }

}