({
  init: function(component, event) {
    console.warn("scrollerHelper.init");
    var data = component.get("v.data") || {};
    component.set("v.data", data);
    this.setupAnimationFrame();
    this.setupImage(component);
    var container = component.find("container");
    setTimeout(function() {
      var el = container.getElement();
      el.focus();
    }, 100);
  },

  setupImage: function(component) {
    console.warn("animateHelper.setupImage");
    var image = component.get("v.image");
    var data = component.get("v.data");
    data.name = component.get("v.name");
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

  handleKeydown: function(component, event) {
    event.preventDefault();
    event.stopPropagation();
    var data = component.get("v.data");
    //var target = event.getSource ? event.getSource().getElement() : event.target;
    var keyCode = event.keyCode || event.getKeyCode() || event.getParam("keyCode");

    console.warn("keyCode: ", keyCode);
    if (keyCode === 48) {
      // Deselect all
      for (var k in data.sprites) {
        data.sprites[k].selected = false;
      }
    }
    if (keyCode > 48 && keyCode < 58) {
      // Index is number hit - 1
      var index = keyCode - 49;
      data.spriteArray[index].selected = data.spriteArray[index].selected ? false : true;
    }
    
    var delta = {x: 0, y: 0};
    if (keyCode === 39) {
      delta.x = 5;
    } else if (keyCode === 37) {
      delta.x = -5;
    } else if (keyCode === 38) {
      delta.y = -5;
    } else if (keyCode === 40) {
      delta.y = 5;
    }

    var scale = {x: 0, y: 0};
    if (keyCode === 187) {
      scale.x = 0.1;
      scale.y = 0.1;
    } else if (keyCode === 189) {
      scale.x = -0.1;
      scale.y = -0.1;
    }
    var maxScale = {x:5,y:5};
    var minScale = {x:0.1,y:0.1};
    
    var rotate = 0;
    if (keyCode === 188) {
      rotate = -5;
    } else if (keyCode == 190) {
      rotate = 5;
    }
    
    var autoMove = false;
    if (keyCode === 97) {
      autoMove = true;
    }
    
    for (var k in data.sprites) {
      if (data.sprites[k].selected === true) {
        data.sprites[k].position.x += delta.x;
        data.sprites[k].position.y += delta.y;
        data.sprites[k].scale.x += scale.x;
        data.sprites[k].scale.y += scale.y;
        data.sprites[k].scale.x = data.sprites[k].scale.x > maxScale.x ? maxScale.x : data.sprites[k].scale.x;
        data.sprites[k].scale.y = data.sprites[k].scale.y > maxScale.y ? maxScale.y : data.sprites[k].scale.y;
        data.sprites[k].scale.x = data.sprites[k].scale.x < minScale.x ? minScale.x : data.sprites[k].scale.x;
        data.sprites[k].scale.y = data.sprites[k].scale.y < minScale.y ? minScale.y : data.sprites[k].scale.y;
        data.sprites[k].angle = data.sprites[k].angle || 0;
        data.sprites[k].angle += rotate;
        if (autoMove === true) {
          data.sprites[k].autoMove = data.sprites[k].autoMove ? false : true;
        }
      }
    }
  },
  
  handleSpriteCommand: function(component, event) {
    var data = component.get("v.data");
    console.warn("scrollerHelper.handleSpriteCommand: ", event);
    var command = event.getParam("command");
    if (params.command === "add") {
      var sprite = event.getParam("args");
      sprite.display = false;
      console.warn("sprite: ", sprite);
      data.sprites = data.sprites || {};
      data.spriteArray = data.spriteArray || [];
      data.sprites[sprite.name] = sprite;
      data.spriteArray.push(sprite);
    }
    console.warn("data.sprites: ", data.sprites);
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
    
    data.imgRatio = data.canvas.height / data.img.height;

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
    console.warn("calling animationLoop");
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
    var data = component.get("v.data");

    this.moveBackground(data);
    this.moveSprites(data);
    
    data.ctx.clearRect(0, 0, data.canvas.width, data.canvas.height);
    this.drawBackground(data);
    
    var collision = this.checkCollision(data);
    //console.warn("collision: ", collision);
    
    this.drawSprites(data, data.canvas, data.ctx);
  },

  moveBackground: function(data) {
    var width = data.img.width;
    var height = data.img.height;
    var x = (data.canvas.width / 2) - (width / 2);
    var y = (data.canvas.height / 2) - (height / 2);
    
    data.scroll = data.scroll || {x: data.img.width, y: 0};
    
    if (--data.scroll.x <= 0) {
      data.scroll.x = data.img.width;
    }    
  },
  
  // Very simple movement, in a game there would be logic, user input, etc. to determine sprite position
  moveSprites: function(data) {
    for (var k in data.sprites) {
      if (data.sprites[k].autoMove === true) {
        this.moveSprite(data, data.sprites[k]);
      } else if (data.sprites[k].pin === true) {
        /*
        data.sprites[k].position.x--;
        console.warn("position.x: ", data.sprites[k].position.x);
        console.warn("scroll.x: ", data.scroll.x);
        console.warn("neg bounds: ", -data.sprites[k].bounds.w);
        if (data.sprites[k].position.x <= -(data.sprites[k].bounds.w / 2)) {
          console.warn("!!!");
          data.sprites[k].position.x = data.canvas.width + (data.sprites[k].bounds.w / 2);
        }
        */
      }
    }
  },
  
  moveSprite: function(data, sprite) {
    sprite.position.x += (Math.random() * 4) - 2;
    sprite.position.y += (Math.random() * 4) - 2;
  },
  
  drawBackground: function(data) {
    data.ctx.save();
    data.ctx.scale(data.imgRatio, 1);
    data.ctx.drawImage(data.img, data.img.width - data.scroll.x, 0, data.scroll.x, data.img.height, 0, 0, data.scroll.x, data.canvas.height);
    data.ctx.drawImage(data.img, data.scroll.x, 0, data.img.width, data.canvas.height);
    data.ctx.restore();
  },
  
  drawSprites: function(data, canvas, ctx) {
    for (var k in data.sprites) {
      this.drawSprite(data, canvas, ctx, data.sprites[k]);
    }
  },
  
  drawSprite: function(data, canvas, ctx, sprite, hideSelected) {

    // Compute the frame to draw based on the elapsed time and fps
    sprite.lastTimestamp = sprite.lastTimestamp || 0;
    var currentTimestamp = Date.now();
    if (currentTimestamp >= sprite.lastTimestamp + (1000 / sprite.fps)) {
      sprite.frameIndex++;
      sprite.frameIndex = (sprite.frameIndex >= sprite.frames) ? 0 : sprite.frameIndex;
      sprite.lastTimestamp = currentTimestamp;
    }

    sprite.bounds.x = sprite.position.x - (sprite.scale.x * sprite.bounds.w) / 2;
    sprite.bounds.y = sprite.position.y - (sprite.scale.y * sprite.bounds.h) / 2;
    
    if (sprite.pin === true) {
    }
    
    // Draw the sprite using the frameIndex as the offset to the current image
    ctx.save();

    ctx.translate((sprite.bounds.x + (sprite.scale.x * sprite.bounds.w) / 2), (sprite.bounds.y + (sprite.scale.y * sprite.bounds.h) / 2));

    ctx.rotate(sprite.angle * (Math.PI / 180));

    //ctx.scale(gameData.gridSize / sprite.bounds.w, gameData.gridSize / sprite.bounds.h);

    ctx.translate(-(sprite.bounds.x + (sprite.scale.x * sprite.bounds.w) / 2), -(sprite.bounds.y + (sprite.scale.y * sprite.bounds.h) / 2));

    try {
      ctx.drawImage(sprite.img, (sprite.bounds.w * sprite.frameIndex), 0, sprite.bounds.w, sprite.bounds.h, sprite.bounds.x, sprite.bounds.y,
        (sprite.bounds.w * sprite.scale.x), (sprite.bounds.h * sprite.scale.y));
    } catch (e) {
      console.warn("exception: ", e);
      console.warn("sprite.bounds: ", sprite.bounds);
    }
    if (sprite.selected === true && hideSelected !== true) {
      ctx.strokeStyle = "#FF0000";
      ctx.strokeRect(sprite.bounds.x, sprite.bounds.y,
        (sprite.bounds.w * sprite.scale.x), (sprite.bounds.h * sprite.scale.y));
    }
    ctx.restore();    
  },
  
  /*
   * Adapted from Google's Closure Library http://docs.closure-library.googlecode.com/git/closure_goog_math_rect.js.source.html
   * 
   * Used for rectangular collision detection
   */
  intersect: function(rect1, rect2) {
    var x0 = Math.max(rect1.x, rect2.x);
    var x1 = Math.min(rect1.x + rect1.w, rect2.x + rect2.w);

    if (x0 <= x1) {
      var y0 = Math.max(rect1.y, rect2.y);
      var y1 = Math.min(rect1.y + rect1.h, rect2.y + rect2.h);

      if (y0 <= y1) {
        return true;
      }
    }
    return false;
  },
  
  checkBitmapCollision: function(imageData1, imageData2, length) {
    var p1, p2;
    var collision = false;
    for (var i = 0; i < length * 4; i += 4) {
      p1 = imageData1[i] + imageData1[i + 1] + imageData1[i + 2];
      p2 = imageData2[i] + imageData2[i + 1] + imageData2[i + 2];

      if (p1 > 0 && p2 > 0) {
        collision = true;
        break;
      }
    }
    return collision;
  },

  getBitmapCollisionData: function(imageData1, imageData2, imageData3, length) {

    var p1, p2;
    for (var i = 0; i < length * 4; i += 4) {
      p1 = imageData1[i] + imageData1[i + 1] + imageData1[i + 2];
      p2 = imageData2[i] + imageData2[i + 1] + imageData2[i + 2];

      if (p1 > 0 && p2 > 0) {
        imageData3[i] = 255;
        imageData3[i + 1] = 255;
        imageData3[i + 2] = 255;
        imageData3[i + 3] = 255;
      }
    }
    return imageData3;
  },
  
  checkCollision: function(data) {
    if (!data.spriteArray) {
      return;
    }
    
    // Move canvas creation to setup
    if (typeof data.canvas2 === "undefined") {
      data.canvas2 = document.createElement("canvas");
      data.canvas2.width = data.canvas.width;
      data.canvas2.height = data.canvas.height;
      data.ctx2 = data.canvas2.getContext("2d");
    }
    
    data.ctx2.fillStyle = "#000000";
    data.ctx2.fillRect(0, 0, data.canvas2.width, data.canvas2.height);
    
    var sprite1 = null;
    var spriteRect1 = null;
    var sprite2 = null;
    var spriteRect2 = null;
    var max = 0;
    var s = 1.43;
    var intersects = false;
    var collision = false;
    var offsetX = 0;
    for (var i = 0; i < data.spriteArray.length; i++) {
      sprite1 = data.spriteArray[i];
      // Simple max rectangle, better math is possible (only works well for square sprites...)
      max = Math.round(Math.max(sprite1.bounds.w * sprite1.scale.x, sprite1.bounds.h * sprite1.scale.y) * s);
      spriteRect1 = {
        x: sprite1.position.x - (max / 2),
        y: sprite1.position.y - (max / 2),
        w: max,
        h: max
      };
      //data.ctx.strokeStyle = "#FF00FF";
      //data.ctx.strokeRect(spriteRect1.x, spriteRect1.y, spriteRect1.w, spriteRect1.h);
      for (var j = 0; j < data.spriteArray.length; j++) {
        if (j !== i) {
          sprite2 = data.spriteArray[j];
          // Simple max rectangle, better math is possible (only works well for square sprites...)
          max = Math.round(Math.max(sprite2.bounds.w * sprite2.scale.x, sprite2.bounds.h * sprite2.scale.y) * s);
          spriteRect2 = {
            x: sprite2.position.x - (max / 2),
            y: sprite2.position.y - (max / 2),
            w: max,
            h: max
          };
          data.ctx.strokeStyle = "#FFFF00";
          data.ctx.strokeRect(spriteRect2.x, spriteRect2.y, spriteRect2.w, spriteRect2.h);
          
          // Check to see if the rects intersect, simple and fast first pass
          intersects = this.intersect(spriteRect1, spriteRect2);
          if (intersects === true) {
            //console.warn("spriteRect ", i, spriteRect1, " intersects spriteRect ", j, spriteRect2);
            
            // Clear the second canvas
            data.ctx2.fillStyle = "#000000";
            
            // Draw sprite1 and get the image data
            //data.ctx2.clearRect(0, 0, data.canvas2.width, data.canvas2.height);
            data.ctx2.fillRect(0, 0, data.canvas2.width, data.canvas2.height);
            this.drawSprite(data, data.canvas2, data.ctx2, sprite1, true);
            var imageData1 = data.ctx2.getImageData(spriteRect1.x, spriteRect1.y, spriteRect1.w, spriteRect1.h);


            // Draw sprite2 and get the image data
            data.ctx2.fillRect(0, 0, data.canvas2.width, data.canvas2.height);
            this.drawSprite(data, data.canvas2, data.ctx2, sprite2, true);
            var imageData2 = data.ctx2.getImageData(spriteRect1.x, spriteRect1.y, spriteRect1.w, spriteRect1.h);

            
            // Clear the canvas and get image data under sprite1
            data.ctx2.fillRect(0, 0, data.canvas2.width, data.canvas2.height);            
            var imageData3 = data.ctx2.getImageData(spriteRect1.x, spriteRect1.y, spriteRect1.w, spriteRect1.h);

            this.getBitmapCollisionData(imageData1.data, imageData2.data, imageData3.data, spriteRect1.w * spriteRect1.h);

            var collision = this.checkBitmapCollision(imageData1.data, imageData2.data, spriteRect1.w * spriteRect1.h);

            if (collision === true) {
              //console.warn("sprite ", i, " collides with sprite ", j);
            }

            data.ctx.fillStyle = "#00FF00";
            data.ctx.strokeStyle = "#0000FF";
            
            data.ctx.fillRect(offsetX, 0, spriteRect1.w, (spriteRect1.h * 3));
            
            data.ctx.putImageData(imageData1, offsetX, 0);
            data.ctx.strokeRect(offsetX, 0, spriteRect1.w, spriteRect1.h);
            
            data.ctx.putImageData(imageData2, offsetX, spriteRect1.h);
            data.ctx.strokeRect(offsetX, spriteRect1.h, spriteRect1.w, spriteRect1.h);
            
            data.ctx.putImageData(imageData3, offsetX, (spriteRect1.h * 2));
            data.ctx.strokeRect(offsetX, (spriteRect1.h * 2), spriteRect1.w, spriteRect1.h);
            
            offsetX += spriteRect1.w;
          }
        }
      }
    }
    
    return false;
  },
  
/*  
      data.ctx.strokeStyle = "#FFFF00";
      data.ctx.strokeRect(spriteRect.x, spriteRect.y, spriteRect.w, spriteRect.h);
      
      this.drawSprites(data, data.canvas2, data.ctx2);

      var imageData1 = data.ctx2.getImageData(spriteRect.x, spriteRect.y, spriteRect.w, spriteRect.h);

      //gameData.ctx2.clearRect(0, 0, gameData.canvas2.width, gameData.canvas2.height);
      ///this.drawSprites(component, gameData.canvas2, gameData.ctx2);
      
      var imageData2 = data.ctx2.getImageData(spriteRect.x, spriteRect.y, spriteRect.w, spriteRect.h);

      data.ctx2.clearRect(0, 0, data.canvas2.width, data.canvas2.height);
      
      var imageData3 = data.ctx2.getImageData(spriteRect.x, spriteRect.y, spriteRect.w, spriteRect.h);

      this.getBitmapCollisionData(imageData1.data, imageData2.data, imageData3.data, spriteRect.w * spriteRect.h);

      var collision = this.checkBitmapCollision(imageData1.data, imageData2.data, spriteRect.w * spriteRect.h);
      
      console.warn("collision: ", collision);
      
      //data.ctx.fillStyle = "#FF0000";
      
      data.ctx.putImageData(imageData1, index * 128, 0);
      data.ctx.putImageData(imageData2, index * 128, 128);
      data.ctx.putImageData(imageData3, index * 128, 256);
     
      index++;
    }
    
    return false;
  },
*/
  
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