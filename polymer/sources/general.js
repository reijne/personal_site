export var visfun = {
  getMaxSquares: function () {
    return 960;
  },
  
  getMaxSize: function () {
    return 128;
  },
  
  getMaxSpeed: function () {
    return 16;
  },
  
  getStandardSize: function () {
    const size = Math.round(((window.innerHeight*window.innerWidth) * 8) / (3840*2160))
    return size <= 1 ? 1 : size;
  },
  
  getStandardCount: function () {
    return Math.round(0.1*(window.innerHeight*window.innerWidth) / visfun.getMaxSquares());
  },
  
  getStandardSpeed: function () {
    const speed = Math.round(((window.innerHeight*window.innerWidth) * 6) / (3840*2160));
    return speed <= 1 ? 1 : speed;
  },
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