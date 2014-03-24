({

  setupStructs: function() {
    this.component = null,
    this.mode = "game",
    this.gameStep = "intro",
    this.showGrid = false;
    this.showDebug = false;
    this.running = false;
    this.scrollImg = null;
    this.columnImg = null;
    this.columnTopImg = null;
    this.columnBottomImg = null;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.scrollVal = this.scrollVal || -10000;
    this.scrollVal = this.scollVal < 0 ? 0 : this.scrollVal;
    this.speed = 0;
    this.imgWidth = 0;
    this.imgHeight = 0;
    this.fieldSize = {
      w: 512,
      h: 384
    };
    this.fieldScaling = {
      x: 1,
      y: 1
    };
    this.gridPosition = 0;
    this.gridSize = 32;
    this.gridOffset = 0;
    this.gridSpeed = 0;
    this.gameTitle = "Flappy SaaSy"
    this.gamePosition = 0;
    this.flappySpriteName = null;
    this.statisSpriteName = null,
    this.spriteRect = {};
    this.sprites = {};
    this.columns = {};
    this.timeout = null;
    this.animationFrame = null;
    this.canvas = null;
    this.ctx = null;
    this.debugInfo = {};
    this.debugSize = {
      w: 200,
      h: 200
    };
    this.score = 0;
    this.frameStats = {
      count: 0,
      fps: 0,
      oldtime: 0,
      lastUpdate: 0
    };

    this.actionKeyCodeMap = {
      setup: 115,
      resetGame: 114,
      jump: 32,
      toggleRunning: 15,
      toggleDebug: 27,
      toggleGrid: 8
    };

    // Generated
    this.keyCodeActionMap = {};

    this.containerSizes = {
      desktop: {
        w: 1024,
        h: 768
      },
      iPad: {
        w: 1024,
        h: 768
      },
      iPhone: {
        w: 480,
        h: 320
      },
      iPhone5: {
        w: 480,
        h: 320
      }

    };

  },

  init: function(component, event) {

    this.setupStructs();
    this.component = component;
    this.setupAnimationFrame();
    this.setupKeyCodeActionMap(component);
    var self = this;
    setTimeout(function() {

      var container = component.find("container").getElement();
      console.warn("container: ", container);
      var promo = component.find("promo").getElement();

      $A.util.addClass(promo, "fade-out");
      $A.util.addClass(document.body, "fade-to-black");
      
      var canvas = component.find("canvas").getElement();
      console.warn("canvas: ", canvas);

      // Using the canvas name to get the client type...
      // Sketchy?
      var client = canvas.name || "desktop";

      // Special case for iPhone5 screen
      if (client === "iPhone" && (window.innerHeight === 568 || window.innerWidth === 568)) {
        client = "iPhone5";
      }

      console.warn("client: ", client);

      container.style.width = self.containerSizes[client].w + "px";
      container.style.height = self.containerSizes[client].h + "px";

      console.warn("container size: ", container.style.width, container.style.height);

      console.warn("window size: ", window.innerWidth, window.innerHeight);

      self.debugInfo.windowSize = window.innerWidth + ", " + window.innerHeight;

      if (window.innerWidth < window.innerHeight) {
        var d = canvas.width;
        canvas.width = canvas.height;
        canvas.height = d;

        var s = container.style.width;
        container.style.width = container.style.height;
        container.style.height = s;
      }

      console.warn("canvas size: ", canvas.width, canvas.height);
      console.warn("container size: ", container.width, container.height);

      // Set scaling to 1 as this is a fixed-size grid
      var sx = 1; // (window.innerWidth / canvas.width);
      var sy = 1; // (window.innerHeight / canvas.height);

      self.fieldScaling.x = sx;
      self.fieldScaling.y = sy;
      self.debugInfo.scaling = self.fieldScaling.x + ", " + self.fieldScaling.y;


      self.setup(component, event);

    }, 2000);
  },

  toggleControls: function(component, event) {
    this.showControls = !component.get("v.showControls");
    component.setValue("v.showControls", this.showControls);
  },

  toggleGrid: function(component, event) {
    this.showGrid = !component.get("v.showGrid");
    component.setValue("v.showGrid", this.showGrid);
  },

  toggleDebug: function(component, args) {
    this.showDebug = !component.get("v.showDebug");
    component.setValue("v.showDebug", this.showDebug);
  },

  toggleMode: function(component, args) {
    this.mode = component.get("v.mode");
    this.mode = this.mode === "game" ? "debug" : "game";
    component.setValue("v.mode", this.mode);
    this.debugInfo.mode = this.mode;
  },

  toggleRunning: function(component, event) {
    this.running = component.get("v.running");
    if (this.running) {
      this.endGame(component);
    } else {
      this.startGame(component);
      //this.showControls = !component.get("v.showControls");
      //component.setValue("v.showControls", this.showControls);
    }
    component.setValue("v.running", !this.running);
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

  setupKeyCodeActionMap: function(component) {
    var actionKeyCodes = component.get("v.actionKeyCodes");
    var actionKeyPairs = actionKeyCodes.split(",");
    for (var i = 0; i < actionKeyPairs.length; i++) {
      var p = actionKeyPairs[i].split(":");
      var action = p[0];
      var keyCode = p[1];
      this.actionKeyCodeMap[action] = keyCode;
    }

    console.warn("this.actionKeyCodeMap: ", this.actionKeyCodeMap);

    // Generate keyCodeActionMap - Need to check for collisions!
    this.keyCodeActionMap = {};
    for ( var action in this.actionKeyCodeMap) {
      this.keyCodeActionMap[this.actionKeyCodeMap[action]] = action;
    }

    console.warn("this.keyCodeActionMap: ", this.keyCodeActionMap);
  },

  setup: function(component, event) {
    this.resetGame();
    this.addSprites(component);
    
    //this.scrollVal = 0;
    this.gamePosition = 0;
    this.gridPosition = 32;

    this.mode = component.get("v.mode");
    this.gridSize = component.get("v.gridSize");
    this.showGrid = component.get("v.showGrid");
    this.showDebug = component.get("v.showDebug");
    this.gameTitle = component.get("v.gameTitle");
    
    var canvas = component.find("canvas").getElement();
    var ctx = canvas.getContext("2d");

    // ctx.save();
    ctx.scale(this.fieldScaling.x, this.fieldScaling.y);

    this.canvas = canvas;
    this.ctx = ctx;
    this.ctx.globalAlpha = 0.01;

    this.scrollImg = new Image();
    this.scrollImg.src = component.get("v.backgroundURL");
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    //his.scrollVal = 0;
    this.speed = 0.5;
    this.gridSpeed = 2;

    this.createColumns(component);

    this.columnImg = new Image();
    this.columnImg.src = component.get("v.columnURL");
    this.columnTopImg = new Image();
    this.columnTopImg.src = component.get("v.columnTopURL");
    this.columnBottomImg = new Image();
    this.columnBottomImg.src = component.get("v.columnBottomURL");
    
    var self = this;
    this.scrollImg.onload = function() {
      console.warn("loadImage");
      self.imgWidth = self.scrollImg.width;
      self.imgHeight = self.scrollImg.height;
      console.warn("self.canvasWidth: ", self.canvasWidth);
      console.warn("self.canvasHeight: ", self.canvasHeight);
      console.warn("self.imgWidth: ", self.imgWidth);
      console.warn("self.imgHeight: ", self.imgHeight);
      console.warn("self.fieldSize: ", self.fielSize);

      self.imgRatio = self.fieldSize.h / self.imgHeight;
      console.warn("self.imgRatio: ", self.imgRatio);
      self.speed = 1 / self.imgRatio;

      self.gridOffset = ((self.canvasWidth / self.gridSize) / 2);
      self.gamePosition = -self.gridOffset;

      console.warn("gridOffset: ", self.gridOffset);
      console.warn("sprites: ", self.sprites);
      
      // Turn on flappy
      self.sprites[self.flappySpriteName].display = true;
      
      if (self.mode === "game") {
        self.playIntro(component, event);
      }
    }

  },
  
  playSound: function(name) {
    var playSoundEvent = $A.get("e.html5:playSound");
    playSoundEvent.setParams({name:name}).fire();    
  },
  
  // This will be customized for different games
  // May be parameterized?
  addSprites: function(component) {
    this.flappySpriteName = component.get("v.flappySpriteName");
    
    this.staticSpritesName = component.get("v.staticSpritesName");

    var canvas = component.find("canvas").getElement();
    var ctx = canvas.getContext("2d");
    var spriteCommandEvent = $A.get("e.html5:spriteCommand");
    params = {
      canvas: canvas,
      ctx: ctx,
      name: this.flappySpriteName,
      command: "init",
      args: null
    }
    spriteCommandEvent.setParams(params).fire();
  },
  
  resetGame: function(component, event) {
    //this.scrollVal = 0;
    this.gridPosition = 0;
    this.gamePosition = 0;
    this.score = 0;
    this.gameStep = "intro";
  },

  playIntro: function(component, event) {
    this.gridSize = 128;
    var sprite = this.sprites[this.flappySpriteName];
    var midY = (this.canvasHeight - sprite.bounds.h) / 2;
    sprite.bounds.y = midY;
    sprite.dest.y = midY - this.gridSize * 1;
    this.startAnimation(component);
    this.showControls = false;
    component.setValue("v.showControls", this.showControls);    
  },

  startGame: function(component, event) {
    this.gridSize = component.get("v.gridSize"); //32;
    this.gamePosition = 0;//-8;
    this.gameStep = "game";
    this._collisions = {};
    this.score = 0;
    
    var sprite = this.sprites[this.flappySpriteName];
    var midY = (this.canvasHeight - sprite.bounds.h) / 2;
    sprite.bounds.y = midY;
    sprite.dest.y = midY - this.gridSize * 1;
    
    //this.startAnimation(component);
    this.showControls = false;
    component.setValue("v.showControls", this.showControls);    
  },
  
  endGame: function(component, canvas, ctx) {
    this.gameStep = "ending";
    this.gamePosition -= 1;
    //this.gridPosition -= 1;
  },
  
  gameOver: function(component, canvas, ctx) {
    this.gameStep = "end";
    window.cancelAnimationFrame(this.animationFrame);
  },
  
  startAnimation: function(component) {
    var canvas = component.find("canvas").getElement();
    var ctx = canvas.getContext("2d");

    var self = this;
    self.frameStats.oldtime = 0;
    self.frameStats.lastUpdate = 0;
    function gameLoop(time) {
      self.frameStats.fps = Math.round(1000 / (time - self.frameStats.oldtime));
      self.frameStats.oldtime = time;
      var s = Math.floor(time / 500);
      if (self.frameStats.lastUpdate != s) {
        self.debugInfo.fps = self.frameStats.fps;
        self.frameStats.lastUpdate = s;
      }

      self.animationFrame = window.requestAnimationFrame(gameLoop);
      self.render(null, self.canvas, self.ctx);
    }
    gameLoop();
  },

  stopAnimation: function(component) {
    window.cancelAnimationFrame(this.animationFrame);
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

  render: function(component, canvas, ctx) {
    
    if (ctx.globalAlpha < 1) {
      ctx.globalAlpha += 0.01;
    }
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    if (this.gameStep === "ending" || this.gameStep === "end") {
      
    } else {
      if (this.scrollVal <= this.speed) {
        //this.scrollVal = this.canvasWidth - this.speed;
        this.scrollVal = this.imgWidth - this.speed;
      }
      this.scrollVal -= this.speed;

      this.gridPosition += this.gridSpeed;
      if (this.gridPosition % this.gridSize === 0) {
        this.gamePosition++;
      }
    }

    this.drawBackground(canvas, ctx);

    var maxY = this.canvasHeight - this.gridSize * 3;

    this.debugInfo.spriteY = this.spriteRect.y;
    this.debugInfo.maxY = maxY;
    
    var collision = false;
    
    if (this.spriteRect.y >= maxY) {
      collision = true;
    } else {
      collision = this.checkCollision(canvas, ctx);
    }
        
    if (collision === true && this.mode === "game") {
      this.playSound("collision");
      this.endGame(component, canvas, ctx);
    }
    
    var p = this.gamePosition + this.gridOffset;

    this.debugInfo.bitmapCollision = collision + " at " + p;

    this._collisions = this._collisions || {};
    if (typeof this.columns[p] !== "undefined") {
      if (this._collisions[p] !== true) {
        this._collisions[p] = collision;
      }
    }

    var s = 0;
    var t = 0;
    var x = 0;
    var y = 0;
    for ( var i in this._collisions) {
      s += this._collisions[i] || 0; // === true && this.columns[i] ? 1 : 0;
      t++;
    }
    this.score = t - s;

    this.drawColumns(canvas, ctx, this.showGrid);

    this.drawSprites(canvas, ctx);

    this.drawForeground(canvas, ctx);
    this.drawStatus(canvas, ctx);

    if (this.showGrid) {
      this.drawGrid(canvas, ctx);
    }

    if (this.showDebug) {
      this.drawDebug(canvas, ctx);
    }

  },

  checkCollision: function(canvas, ctx) {
    var sprite = this.sprites[this.flappySpriteName];
    
    var spriteRect = {
      x: sprite.bounds.x + ((sprite.bounds.w - this.gridSize) / 2),
      y: sprite.bounds.y + ((sprite.bounds.h - this.gridSize) / 2),
      w: this.gridSize, // sprite.bounds.w,
      h: this.gridSize
    // sprite.bounds.h
    };

    // Move canvas creation to setup
    if (typeof this.canvas2 === "undefined") {
      this.canvas2 = document.createElement("canvas");
      this.canvas2.width = canvas.width;
      this.canvas2.height = canvas.height;
      this.ctx2 = this.canvas2.getContext("2d");
    }

    this.ctx2.clearRect(0, 0, this.canvas2.width, this.canvas2.height);
    
    // Do not draw grid when checking collisions
    this.drawColumns(this.canvas2, this.ctx2, false);

    this.debugInfo.columnsPassed = this.debugInfo.columnsPassed || 0;

    // var imageData1 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
    var imageData1 = this.ctx2.getImageData(spriteRect.x, spriteRect.y, spriteRect.w, spriteRect.h);

    this.ctx2.clearRect(0, 0, this.canvas2.width, this.canvas2.height);
    this.drawSprites(this.canvas2, this.ctx2);
    // var imageData2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
    var imageData2 = this.ctx2.getImageData(spriteRect.x, spriteRect.y, spriteRect.w, spriteRect.h);

    this.ctx2.clearRect(0, 0, this.canvas2.width, this.canvas2.height);
    var imageData3 = this.ctx2.getImageData(spriteRect.x, spriteRect.y, spriteRect.w, spriteRect.h);

    this.getBitmapCollisionData(imageData1.data, imageData2.data, imageData3.data, spriteRect.w * spriteRect.h);

    var collision = this.checkBitmapCollision(imageData1.data, imageData2.data, spriteRect.w * spriteRect.h);

    if (this.showDebug && this.gameStep !== "intro") {
      ctx.putImageData(imageData1, 0, 0);
      ctx.putImageData(imageData2, 0, this.gridSize);
      ctx.putImageData(imageData3, 0, this.gridSize * 2);
    }
    

    return collision;
  },

  /*
   * Draws the background, very simple scroller
   */
  drawBackground: function(canvas, ctx) {
    ctx.save();
    ctx.scale(this.imgRatio, 1);
    ctx.drawImage(this.scrollImg, this.imgWidth - this.scrollVal, 0, this.scrollVal, this.imgHeight, 0, 0, this.scrollVal, this.canvasHeight);
    ctx.drawImage(this.scrollImg, this.scrollVal, 0, this.imgWidth, this.canvasHeight);
    ctx.restore();
  },

  /* Adapted from Google's Closure Library
   * http://docs.closure-library.googlecode.com/git/closure_goog_math_rect.js.source.html
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

  // Draws the columns
  // Returns true if the sprite has passed the current column
  drawColumns: function(canvas, ctx, showGrid) {

    if (this.gameStep === "intro") {
      return;
    }
    
    var coll = false;

    this.debugInfo.gridPosition = this.gridPosition;
    this.debugInfo.gamePosition = this.gamePosition;

    ctx.strokeStyle = "white";
    var y0 = 0;
    var y1 = this.canvasHeight - 1;
    var y2 = 0;
    var startX = this.gridSize - (this.gridPosition % this.gridSize);
    startX -= this.gridSize;
    var g = this.gamePosition;
    var checkRect = {
      x: (this.canvasWidth / 2) - this.gridSize,
      y: 0,
      w: (this.gridSize * 2),
      h: this.canvasHeight
    };
    var columnRect = {
      x: 0,
      y: 0,
      w: this.gridSize,
      h: (this.gridSize * 2)
    };
    var topRect = {
      x: 0,
      y: 0,
      w: this.gridSize,
      h: (this.gridSize * 2)
    };
    var bottomRect = {
      x: 0,
      y: 0,
      w: this.gridSize,
      h: (this.gridSize * 2)
    };
    var gapRect = {
      x: 0,
      y: 0,
      w: this.gridSize,
      h: (this.gridSize * 3)
    };

    var sprite = this.sprites[this.flappySpriteName];
    var spriteRect = {
      x: sprite.bounds.x + ((sprite.bounds.w - this.gridSize) / 2),
      y: sprite.bounds.y + ((sprite.bounds.h - this.gridSize) / 2),
      w: this.gridSize, // sprite.bounds.w,
      h: this.gridSize
    // sprite.bounds.h
    };

    spriteRect.w *= sprite.scale.x;
    spriteRect.h *= sprite.scale.y;

    for (var x = startX; x <= this.canvasWidth; x += this.gridSize) {
      if (this.columns[g]) {
        y2 = (this.columns[g] + 1) * this.gridSize;
        /*
         * ctx.beginPath(); ctx.rect(x, y0, this.gridSize, this.gridSize * this.columns[g]); ctx.rect(x, y2, this.gridSize, this.canvasHeight - y2);
         * ctx.fillStyle = "yellow"; ctx.fill();
         */
        ctx.drawImage(this.columnTopImg, x, y0, this.gridSize, this.gridSize);
        for (var y = y0 + this.gridSize; y < (y2 - (this.gridSize * 2)); y += this.gridSize) {
          ctx.drawImage(this.columnImg, x, y, this.gridSize, this.gridSize);
        }
        ctx.drawImage(this.columnBottomImg, x, y, this.gridSize, this.gridSize);

        columnRect = {
          x: x,
          y: 0,
          w: this.gridSize,
          h: this.gridHeight - 1
        };

        topRect = {
          x: x,
          y: y0,
          w: this.gridSize,
          h: (y2 - (this.gridSize * 1))
        };

        y2 += (this.gridSize * 2);

        ctx.drawImage(this.columnTopImg, x, y2, this.gridSize, this.gridSize);
        for (var y = (y2 + this.gridSize); y <= this.canvasHeight; y += this.gridSize) {
          ctx.drawImage(this.columnImg, x, y, this.gridSize, this.gridSize);
        }

        bottomRect = {
          x: x,
          y: y2,
          w: this.gridSize,
          h: this.canvasHeight - y2
        };

        /*
         * Rectangle based collision detection, no longer used for this game.
         * 
         * This is good for simple collision detection, very fast, but
         * it is not pixel-accurate. If the showGrid attribute is set to 
         * true then it will show these collisions with various colors.
         */

        // First check if there is an overlap
        gapRect.x = x;
        gapRect.y = y2 - gapRect.h;

        var overlap = this.intersect(checkRect, gapRect);

        this.collisions = this.collisions || {};

        if (overlap && 2 > this.showGrid === true) {

          var collision = this.intersect(spriteRect, topRect) || this.intersect(spriteRect, bottomRect);

          if (collision) {
            if (typeof this.collisions[g] === "undefined") {
              this.collisions[g] = 1;
            }
          }

          if ((spriteRect.x > columnRect.x + columnRect.w) && typeof this.collisions[g] === "undefined") {
            this.collisions[g] = 0;
            this.tscore = this.tscore || 0;
            this.tscore++;
            this.debugInfo.tscore = this.tscore;
          }

          this.debugInfo.collision = collision;

          if (showGrid) {

            var color = collision ? "red" : null;

            ctx.save();
            ctx.globalAlpha = 0.5;

            // For debug only!
            ctx.beginPath();
            ctx.rect(checkRect.x, checkRect.y, checkRect.w, checkRect.h);
            ctx.fillStyle = "yellow";
            ctx.fill();

            ctx.beginPath();
            ctx.rect(topRect.x, topRect.y, topRect.w, topRect.h);
            ctx.fillStyle = color || "orange";
            ctx.fill();

            ctx.beginPath();
            ctx.rect(bottomRect.x, bottomRect.y, bottomRect.w, bottomRect.h);
            ctx.fillStyle = color || "purple";
            ctx.fill();

            ctx.beginPath();
            ctx.rect(gapRect.x, gapRect.y, gapRect.w, gapRect.h);
            ctx.fillStyle = color || "green";
            ctx.fill();

            ctx.beginPath();
            ctx.rect(spriteRect.x, spriteRect.y, spriteRect.w, spriteRect.h);
            ctx.fillStyle = color || "blue";
            ctx.fill();

            ctx.restore();
          }
        }
      }

      g++;
    }
  },

  // This is the main "action" function, use for jumping, flapping, etc.
  // Typically will map to the spacebar, mouse, tap, etc.
  jump: function(component, event) {
    if (this.gameStep === "ending") {
      // If the ending sequence is playing, do nothing
      return;
    } else if (this.gameStep === "end") {
      // If the end screen is showing, restart the game
      this.setup(component, event);
      return;
    } else if (this.gameStep === "intro") {
      // If the intro is showing, start the game
      this.gameStep = "game";
      this.startGame(component, event);
      return;
    }
    
    this.playSound("flap");
    
    var sprite = this.sprites[this.flappySpriteName];

    sprite.speed.y = 5;
    sprite.angle = sprite.angle > 15 ? 15 : sprite.angle;

    sprite.bounds.y -= (this.gridSize / 4);
    //sprite.bounds.y = sprite.bounds.y < -this.gridSize ? -this.gridSize : sprite.bounds.y; 
    sprite.bounds.y = sprite.bounds.y < 0 ? 0 : sprite.bounds.y; 

    sprite.dest = {
      x: (this.canvasWidth - this.gridSize) / 2,
      y: sprite.bounds.y - (this.gridSize / 0.75)
    }

  },

  drawSprite: function(canvas, ctx, name) {

    var sprite = this.sprites[name];

    sprite.lastTimestamp = sprite.lastTimestamp || 0;
    var currentTimestamp = Date.now();
    if (currentTimestamp >= sprite.lastTimestamp + (1000 / sprite.fps)) {
      sprite.frameIndex++;
      sprite.frameIndex = (sprite.frameIndex >= sprite.frames) ? 0 : sprite.frameIndex;
      sprite.lastTimestamp = currentTimestamp;
    }
    if (this.gameStep === "ending" || this.gameStep === "end") {
      sprite.frameIndex = 0;
    }

    this.debugInfo.frameIndex = sprite.frameIndex;

    if (sprite.name == this.flappySpriteName) {

      var maxY = this.canvasHeight - this.gridSize * 2;
      //var maxY = (this.canvasHeight - 1) - (sprite.bounds.h * 1)
      
      // Only for flappy games! Keeps the sprite centered on the screen.
      this.debugInfo.gridSize = this.gridSize;
      sprite.bounds.x = (this.canvasWidth - (sprite.scale.x * sprite.bounds.w)) / 2;
  
  
      this.debugInfo.spriteRect = sprite.bounds.x + ", " + sprite.bounds.y + ", " + sprite.bounds.w + ", " + sprite.bounds.h;
      this.debugInfo.spriteDest = sprite.dest.x + ", " + sprite.dest.y;
      sprite.angle = sprite.angle || 0;
      if (this.gameStep === "intro") {
        var midY = (this.canvasHeight - sprite.bounds.h) / 2;
        sprite.bounds.y = midY;
        sprite.angle = 0;
      } else if (this.gameStep === "ending" || this.gameStep === "end") {
        sprite.angle = 90;
      } else {
  
        //var maxY = (this.canvasHeight - 1) - (sprite.bounds.h * 1)
        if (sprite.bounds.y >= maxY) { //}(this.canvasHeight - 1) - (sprite.bounds.h * 1)) {
          sprite.angle = 0;
          sprite.bounds.y = maxY; //(this.canvasHeight - 1) - (sprite.bounds.h * 1);
        } else if (sprite.bounds.y < sprite.dest.y) {
          sprite.angle += sprite.angle < 90 ? 4 : 0;
        } else {
          sprite.angle -= sprite.angle > -45 ? 8 : 0;
        }
      }
    } else {
      sprite.bounds.x = sprite.position.x;
      sprite.bounds.y = sprite.position.y;
    }
    
    ctx.save();

    ctx.translate((sprite.bounds.x + sprite.bounds.w / 2), (sprite.bounds.y + sprite.bounds.h / 2));

    ctx.rotate(sprite.angle * (Math.PI / 180));

    ctx.scale(this.gridSize / sprite.bounds.w, this.gridSize / sprite.bounds.h);

    ctx.translate(-(sprite.bounds.x + sprite.bounds.w / 2), -(sprite.bounds.y + sprite.bounds.h / 2));


    try {
      ctx.drawImage(sprite.img, (sprite.bounds.w * sprite.frameIndex), 0, sprite.bounds.w, sprite.bounds.h, sprite.bounds.x, sprite.bounds.y,
        (sprite.bounds.w * sprite.scale.x), (sprite.bounds.h * sprite.scale.y));
    } catch (e) {
      console.warn("exception: ", e);
      console.warn("sprite.bounds: ", sprite.bounds);
    }

    ctx.restore();

    /*
     * Make sprite movement simple. Try to reach the dest if it is less (above), otherwise let gravity do its thing.
     * 
     */
    if (sprite.name == this.flappySpriteName) {

      if (this.gameStep === "end") {
        
      } else if (this.gameStep === "ending") {
        sprite.dest.y = this.canvasHeight - (sprite.bounds.h * 1);
        if (sprite.bounds.y <= sprite.dest.y) {
          sprite.bounds.y += sprite.speed.y
          sprite.speed.y = sprite.speed.y > 3 ? 3 : sprite.speed.y;
          sprite.speed.y += sprite.speed.y < 3 ? 0.05 : 0;
        } else {
          this.gameStep = "end";
          this.playSound("gameOver");
          this.gameOver(null, canvas, ctx);
        }
      } else {
        if (sprite.bounds.y === sprite.dest.y && sprite.dest.y != 0) {
          sprite.bounds.y -= sprite.speed.y;
        } else if (sprite.bounds.y > sprite.dest.y) {
          sprite.bounds.y -= sprite.speed.y;
          sprite.speed.y -= sprite.speed.y > 1 ? 0.5 : 0;
        } else {
          sprite.dest.y = maxY; //this.canvasHeight - (sprite.bounds.h * 1);
          if (sprite.bounds.y <= sprite.dest.y) {
            sprite.bounds.y += sprite.speed.y
            sprite.speed.y = sprite.speed.y > 3 ? 3 : sprite.speed.y;
            sprite.speed.y += sprite.speed.y < 3 ? 0.05 : 0;
          }
        }
      }
    }
    

  },

  // This can be used to draw multiple sprites, but for this game we'll only draw flappy
  drawSprites: function(canvas, ctx) {

    //this.drawSprite(canvas, ctx, this.flappySpriteName);

    // Loop for multiple sprites...
    var sprite = null;
    for (var n in this.sprites) {
      if (this.sprites[n].display === true) {
        this.drawSprite(canvas, ctx, n);
      }
    }
 
  },

  drawForeground: function(canvas, ctx) {

  },

  drawSpriteText: function(canvas, ctx, sprite, offsetName, x, y) {
    
    var offset = sprite.offsets[offsetName];
    var bounds = {
      x: x || (this.canvasWidth - offset.w) / 2, // centered by default
      y: y || (this.canvasHeight - offset.h) / 2, // centered by default
      w: offset.w * sprite.scale.x,
      h: offset.h * sprite.scale.y,
    };
    ctx.drawImage(sprite.img, offset.x, offset.y, offset.w, offset.h,
      bounds.x, bounds.y, bounds.w, bounds.h);
  },
  
  drawStatus: function(canvas, ctx) {

    // Newer sprite-based titles, etc.
    if (this.gameStep === "intro") {
      this.drawSpriteText(canvas, ctx, this.sprites[this.staticSpritesName], "title", null, 80);
      this.drawSpriteText(canvas, ctx, this.sprites[this.staticSpritesName], "tapToStart", null, this.canvasHeight - 120);//230);
    } else if (this.gameStep === "end") {
      this.drawSpriteText(canvas, ctx, this.sprites[this.staticSpritesName], "gameOver", null, null);
      this.drawSpriteText(canvas, ctx, this.sprites[this.staticSpritesName], "tapToContinue", null, this.canvasHeight - 120);//230);
    }
    
    if (this.gameStep !== "intro") {
  
      // Score
      var textSize = 32;
      var margin = 10;
      var x = this.canvasWidth / 2;
      var midY = this.canvasHeight / 2;
      
      var y = textSize + margin;
      
      var text = this.score;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.font = "bold " + textSize + "px 'Marker Felt'";
      ctx.textAlign = "center";
      
      ctx.fillText(text, x, y);
      ctx.strokeText(text, x, y);
    }
    
  },

  drawGrid: function(canvas, ctx) {
    ctx.strokeStyle = "white";
    var y0 = 0;
    var y1 = this.canvasHeight - 1;
    var startX = this.gridSize - (this.gridPosition % this.gridSize);
    startX -= this.gridSize;
    var g = this.gamePosition;
    for (var x = startX; x <= this.canvasWidth; x += this.gridSize) {
      ctx.fillStyle = "black";
      ctx.font = "normal 12px Arial";
      ctx.fillText("" + g, x, y1 - 20);
      ctx.strokeText("" + g, x, y1 - 20);

      ctx.beginPath();
      ctx.moveTo(x, y0);
      ctx.lineTo(x, y1);
      ctx.stroke();
      g++;
    }

    var x0 = 0;
    var x1 = this.canvasWidth - 1;
    for (var y = this.gridSize; y <= this.canvasHeight; y += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x1, y);
      ctx.stroke();
    }

    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo((this.canvasWidth / 2), 0);
    ctx.lineTo((this.canvasWidth / 2), this.canvasHeight - 1);
    ctx.moveTo(0, (this.canvasHeight / 2));
    ctx.lineTo(this.canvasWidth - 1, (this.canvasHeight / 2));
    ctx.stroke();
  },

  drawDebug: function(canvas, ctx) {
    ctx.save();
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    var margin = 10;
    var padding = 4;
    var fontSize = 9;
    var lineHeight = fontSize + padding;
    var x = this.canvasWidth - (this.debugSize.w + margin);
    var y = margin;
    ctx.rect(x, y, this.debugSize.w, this.debugSize.h);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "black";
    ctx.font = "normal " + fontSize + "px Lucida Console";
    ctx.textAlign = "left";
    // var x = this.canvasWidth - 100;
    x += padding;
    y += lineHeight;
    
    ctx.fillText("gameStep: " + this.gameStep, x, y);
    y += lineHeight;
    
    for ( var n in this.debugInfo) {
      ctx.fillText(n + ": " + this.debugInfo[n], x, y);
      y += lineHeight;
    }
  },

  createColumns: function(component) {
    this.columns = {};
    var max = {
      x: this.canvasWidth / this.gridSize,
      y: this.canvasHeight / this.gridSize
    }
    console.warn("max: ", max);
    var lastY = Math.round(max.y / 2); // Math.floor(Math.random() * (max.y - 3)) + 1;
    var y = 0;
    var startX = (this.canvasWidth / this.gridSize) / 1;
    console.warn("startX: ", startX);
    for (var x = startX; x < 3000; x += Math.round(Math.random() * 2) + 5) {
      y = lastY + (Math.round(Math.random() * 4) - 2);
      y = y <= 1 ? 2 : y;
      y = y >= max.y - 4 ? y - 4 : y;
      this.columns[x] = y;
      lastY = y;
    }
  },


  keyMap: {
    8: "[delete]",
    9: "[tab]",
    13: "[return]",
    27: "[esc]",
    32: "[space]",
  },

  handleKeypress: function(component, event) {
    var target = event.getSource ? event.getSource().getElement() : event.target;
    var keyCode = event.getKeyCode || event.getParam("keyCode");
    // console.warn("keyCode: ", keyCode, typeof keyCode);
    var action = this.keyCodeActionMap[keyCode];
    // console.warn("action: ", action);
    if (action) {
      this[action](component, event);
    }
    this.debugInfo.keyCode = keyCode;
    this.debugInfo.keyChar = this.keyMap[keyCode];
    if (!this.debugInfo.keyChar) {
      this.debugInfo.keyChar = String.fromCharCode(keyCode);
    }
    // console.warn("this.debugInfo.keyChar: ", this.debugInfo.keyChar, this.debugInfo.keyCode);
  },

  handleClick: function(component, event) {
    this.jump(component, event);
  },

  // Custom loader for flappy
  handleSpriteCommand: function(compoent, params) {
    console.warn("canvasScrollerHelper.handleSpriteCommand: ", params);
    console.warn("this.flappySpriteName: ", this.flappySpriteName);
    if (params.command === "add") {
      var sprite = params.args;
      sprite.display = false;
      this.sprites[sprite.name] = sprite;
    }
  },

  executeCanvasCommand: function(component, params) {
    // console.warn("executeCanvasCommand: ", params);
    var ctx = component.find("paint_area").getElement().getContext("2d");
    if (params.attr && params.value) {
      ctx[params.attr] = params.value;
    }
    if (params.api && params.args) {
      try {
        var exec = "ctx." + params.api + "(" + params.args.toString() + ")";
        // console.warn("exec: ", exec);
        eval(exec);
      } catch (e) {
        // console.warn("Exception: ", e);
      }
      // ctx[params.api]
    }
    /*
     * ctx[params.api] ctx.fillStyle = '#cc3300'; ctx.fillRect(0,0,200,200);
     */
  },

  getMousePos: function(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  },

  handleMouseMove: function(component, canvas, event) {
    console.warn("handleMouseMove");
    var pos = this.getMousePos(canvas, event);
    console.warn("pos: ", pos);
    // foo = component;
    bar = event;
  }
});
