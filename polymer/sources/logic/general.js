export var visfun = {
  getMaxSquares() {
    return 960;
  },
  
  getMaxSize() {
    return 128;
  },
  
  getMaxSpeed() {
    return 16;
  },
  
  getStandardSize() {
    const size = Math.round(((window.innerHeight*window.innerWidth) * 8) / (3840*2160))
    return size <= 1 ? 1 : size;
  },
  
  getStandardCount() {
    return Math.round(0.1*(window.innerHeight*window.innerWidth) / visfun.getMaxSquares());
  },
  
  getStandardSpeed() {
    const speed = Math.round(((window.innerHeight*window.innerWidth) * 6) / (3840*2160));
    return speed <= 1 ? 1 : speed;
  },

  mouse_x: null,
  mouse_y: null,
  justClicked: false,
  directionMultiplier: 10,
  setMousePosition(x, y, mousebutton) {
    visfun.mouse_x = x;
    visfun.mouse_y = y;
    if (mousebutton == 1) visfun.directionMultiplier = -10;
    else visfun.directionMultiplier = 10;
  },

  getMousePosition() {
    return visfun.mouse_x, visfun.mouse_y
  }
}

export function getThemeColors() {
  return ['#5222ff', '#00f7ff', '#00ff36'];
}

export function getWindowFormat() {
  if (window.innerHeight > window.innerWidth) {
    return "mobile";
  } else if (window.innerWidth <= 1365) {
    return "tablet"
  } else {
    return "desktop"
  }
}