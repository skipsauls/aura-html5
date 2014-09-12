({
  init: function(component, event) {
    console.warn("animateHelper.init");
    var data = component.get("v.data") || {};
    component.setValue("v.data", data);
    
    this.setupAnimationFrame();
    this.setupImage(component);
  },
  
  setupImage: function(component) {
    console.warn("animateHelper.setupImage");
    var image = component.get("v.image");
    var data = component.get("v.data");
    var self = this;
    console.warn("image: ", image);
    if (image) {
      if (image.indexOf("/") >= 0) {
        var img = document.createElement("img");
        var self = this;
        img.onload = function() {
          data.img = img;
          console.warn("img loaded");
          self.startAnimation(component);
        };
        img.src = image;
      }
    }
  },
  
  toggleRotation: function(component, value) {
    var data = component.get("v.data");
    data.animation.rotating = value;
  },

  toggleScaling: function(component, value) {
    var data = component.get("v.data");
    data.animation.scaling = value;
  },
  
  startAnimation: function(component, event) {
    var data = component.get("v.data");
    if (data && data.animationFrame) {
      return;
    }
    
    var canvas = component.find("canvas").getElement();
    var ctx = canvas.getContext("2d");
    data.canvas = canvas;
    data.ctx = ctx;
    data.animationFrame = null;
    data.frameStats = {
      oldtime: 0,
      lastUpdate: 0
    };
    data.sliders = {
      scale: component.find("scaleSlider").getElement(),
      angle: component.find("angleSlider").getElement()
    };
    data.animation = {
      scaling: component.find("toggleScaling").getElement().checked,
      rotating: component.find("toggleRotation").getElement().checked,
      scaleInc: 0.1,
      rotationInc: 1
    }
    
    var self = this;
    function animationLoop(time) {
      data.frameStats.fps = Math.round(1000 / (time - data.frameStats.oldtime));
      data.frameStats.oldtime = time;
      var s = Math.floor(time / 500);
      if (data.frameStats.lastUpdate != s) {
        data.frameStats.lastUpdate = s;
      }
      
      data.animationFrame = window.requestAnimationFrame(animationLoop);
      $A.run(function() {
        self.render(component);
      });      
    }
    animationLoop();    
  },
  
  stopAnimation: function(component, event) {
    var data = component.get("v.data");
    if (!data || !data.animationFrame) {
      return;
    } else {
      window.cancelAnimationFrame(data.animationFrame);
      delete data.animationFrame;
    }
  },
  
  render: function(component) {
    var now = Date.now();
    var data = component.get("v.data");
    var angle = data.sliders.angle.value;
    var scale = data.sliders.scale.value;
    
    // TODO - Get the min/max from the component!
    if (data.animation.rotating === true) {
      angle++;
      if (++angle >= 360) {
        angle = 0;
      }
      data.sliders.angle.value = angle;
    }

    // TODO - Get the min/max from the component!
    if (data.animation.scaling === true) {
      scale++;
      if (++angle >= 360) {
        angle = 0;
      }
      data.sliders.angle.value = angle;
    }
    
    //console.log(now, data.frameStats.fps, scale, angle);
    component.setValue("v.timestamp", now);
    
    component.setValue("v.angleVal", angle);
    component.setValue("v.scaleVal", scale);
    
    data.ctx.clearRect(0, 0, data.canvas.width, data.canvas.height);
    //this.drawBox(data);
    this.drawImage(data);
  },

  drawImage: function(data) {
    var scale = data.sliders.scale.value;
    var angle = data.sliders.angle.value;
    var width = data.img.width;
    var height = data.img.height;
    var x = (data.canvas.width / 2) - (width / 2);
    var y = (data.canvas.height / 2) - (height / 2);
    

    data.ctx.save();
    
    data.ctx.translate((x + width / 2), (y + height / 2));

    data.ctx.rotate(angle * (Math.PI / 180));

    data.ctx.scale(scale, scale);

    data.ctx.translate(-(x + width / 2), -(y + height / 2));
    
    data.ctx.drawImage(data.img, x, y, width, height);
    
    data.ctx.restore();
  },
  
  drawBox: function(data) {
    var scale = data.sliders.scale.value;
    var angle = data.sliders.angle.value;
    var width = data.canvas.width / 4;
    var height = data.canvas.height / 4;
    var x = (data.canvas.width / 2) - (width / 2);
    var y = (data.canvas.height / 2) - (height / 2);
    
    
    data.ctx.clearRect(0, 0, data.canvas.width, data.canvas.height);
    
    data.ctx.fillStyle = '#0000FF';
    data.ctx.fillRect(x, y, width, height);
    
    data.ctx.save();
    
    data.ctx.translate((x + width / 2), (y + height / 2));

    data.ctx.rotate(angle * (Math.PI / 180));

    data.ctx.scale(scale, scale);

    data.ctx.translate(-(x + width / 2), -(y + height / 2));
    
    data.ctx.fillStyle = '#FF0000';
    data.ctx.fillRect(x, y, width, height);
    
    data.ctx.restore();
  },
  
  // Adapted from:
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  // requestAnimationFrame polyfill by Erik MÃ¶ller. fixes from Paul Irish and Tino Zijdel
  // MIT license
  setupAnimationFrame: function() {
    var lastTime = 0;
    var vendors = [
      'ms', 'moz', 'webkit', 'o'
    ];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };

    if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
  },

})