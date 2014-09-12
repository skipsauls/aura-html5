({

  setupGameData: function() {
    var scrollVal = scrollVal || -10000;
    scrollVal = scrollVal < 0 ? 0 : scrollVal;
    
    var gameData = {
      canvasWidth : 0,
      canvasHeight : 0,
      scrollVal : scrollVal,
      speed : 0,
      imgWidth : 0,
      imgHeight : 0,
      imgRatio: 1,
      fieldSize : {
        w: 512,
        h: 384
      },
      fieldScaling : {
        x: 1,
        y: 1
      },
      gridPosition : 0,
      gridSize : 32,
      gridOffset : 0,
      gridSpeed : 0,
      gameTitle : "Flappy SaaSy",
      gamePosition : 0,
      flappySpriteName : null,
      staticSpriteName : null,
      spriteRect : {},
      sprites : {},
      columns : {},
      timeout : null,
      animationFrame : null,
      canvas : null,
      ctx : null,
      debugInfo : {},
      debugSize : {
        w: 200,
        h: 200
      },
      score : 0,
      tscore: 0,
      collisions: {},
      _collisions: {},
      frameStats : {
        count: 0,
        fps: 0,
        oldtime: 0,
        lastUpdate: 0
      },

      actionKeyCodeMap : {
        setup: 115,
        resetGame: 114,
        jump: 32,
        toggleRunning: 15,
        toggleDebug: 27,
        toggleGrid: 8
      },

      // Generated
      keyCodeActionMap : {},

    };
    
    return gameData;
  },

  init: function(component, event) {

    var gameData = this.setupGameData();
    component.setValue("v.gameData", gameData);
    
    this.setupAnimationFrame();
    this.setupKeyCodeActionMap(component);
    var self = this;
    setTimeout(function() {

      var container = component.find("container").getElement();
      var promo = component.find("promo").getElement();

      $A.util.addClass(promo, "fade-out");
      $A.util.addClass(document.body, "fade-to-black");
      
      var canvas = component.find("canvas").getElement();

      // Using the canvas name to get the client type...
      // Sketchy?
      var client = canvas.name || "desktop";

      // Special case for iPhone5 screen
      if (client === "iPhone" && (window.innerHeight === 568 || window.innerWidth === 568)) {
        client = "iPhone5";
      }

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      var maxW = 384;
      var maxH = 512;
      
      if (window.innerWidth > window.innerHeight) {
        var t = maxW;
        maxW = maxH;
        maxH = t;
      }
      
      canvas.width = maxW;
      canvas.height = maxH;
      
      // Set scaling to 1 as this is a fixed-size grid
      var sx = 1; // (window.innerWidth / canvas.width);
      var sy = 1; // (window.innerHeight / canvas.height);

      gameData.fieldScaling.x = sx;
      gameData.fieldScaling.y = sy;
      gameData.debugInfo.scaling = gameData.fieldScaling.x + ", " + gameData.fieldScaling.y;

      self.setup(component, event);

    }, 2000);
  },

  toggleControls: function(component, event) {
    var showControls = !component.get("v.showControls");
    component.setValue("v.showControls", showControls);
  },

  toggleGrid: function(component, event) {
    var showGrid = !component.get("v.showGrid");
    component.setValue("v.showGrid", showGrid);
  },

  toggleDebug: function(component, args) {
    var showDebug = !component.get("v.showDebug");
    component.setValue("v.showDebug", showDebug);
  },

  toggleMode: function(component, args) {
    var mode = component.get("v.mode");
    mode = mode === "game" ? "debug" : "game";
    component.setValue("v.mode", mode);
    gameData.debugInfo.mode = mode;
  },

  toggleRunning: function(component, event) {
    var running = component.get("v.running");
    if (running) {
      this.endGame(component);
    } else {
      this.startGame(component);
    }
    component.setValue("v.running", !running);
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
    var gameData = component.get("v.gameData");
    var actionKeyCodes = component.get("v.actionKeyCodes");
    var actionKeyPairs = actionKeyCodes.split(",");
    for (var i = 0; i < actionKeyPairs.length; i++) {
      var p = actionKeyPairs[i].split(":");
      var action = p[0];
      var keyCode = p[1];
      gameData.actionKeyCodeMap[action] = keyCode;
    }

    console.warn("gameData.actionKeyCodeMap: ", gameData.actionKeyCodeMap);

    // Generate keyCodeActionMap - Need to check for collisions!
    gameData.keyCodeActionMap = {};
    for ( var action in gameData.actionKeyCodeMap) {
      gameData.keyCodeActionMap[gameData.actionKeyCodeMap[action]] = action;
    }

    console.warn("gameData.keyCodeActionMap: ", gameData.keyCodeActionMap);
  },

  setup: function(component, event) {    
    var gameData = component.get("v.gameData");
    
    this.resetGame(component, event);
    this.addSprites(component);
    
    gameData.gamePosition = 0;
    gameData.gridPosition = 32;

    var mode = component.get("v.mode");
    gameData.gridSize = component.get("v.gridSize");
    showGrid = component.get("v.showGrid");
    showDebug = component.get("v.showDebug");
    gameData.gameTitle = component.get("v.gameTitle");
    
    var imageMap = component.get("v.imageMap");
    imageMap = imageMap || {};
    component.setValue("v.imageMap", imageMap);
    
    var canvas = component.find("canvas").getElement();
    var ctx = canvas.getContext("2d");

    ctx.scale(gameData.fieldScaling.x, gameData.fieldScaling.y);

    gameData.canvas = canvas;
    gameData.ctx = ctx;
    gameData.ctx.globalAlpha = 0.01;

    imageMap["scrollImg"] = new Image();
    imageMap["scrollImg"].src = component.get("v.backgroundURL");
    gameData.canvasWidth = canvas.width;
    gameData.canvasHeight = canvas.height;
    // his.scrollVal = 0;
    gameData.speed = 0.5;
    gameData.gridSpeed = 2;

    this.createColumns(component);

    imageMap["columnImg"] = new Image();
    imageMap["columnImg"].src = component.get("v.columnURL");
    imageMap["columnTopImg"] = new Image();
    imageMap["columnTopImg"].src = component.get("v.columnTopURL");
    imageMap["columnBottomImg"] = new Image();
    imageMap["columnBottomImg"].src = component.get("v.columnBottomURL");
    
    var self = this;
    imageMap["scrollImg"].onload = function() {
      gameData.imgWidth = imageMap["scrollImg"].width;
      gameData.imgHeight = imageMap["scrollImg"].height;
      console.warn("gameData.canvasWidth: ", gameData.canvasWidth);
      console.warn("gameData.canvasHeight: ", gameData.canvasHeight);
      console.warn("gameData.imgWidth: ", gameData.imgWidth);
      console.warn("gameData.imgHeight: ", gameData.imgHeight);
      console.warn("gameData.fieldSize: ", gameData.fieldSize);

      gameData.imgRatio = gameData.fieldSize.h / gameData.imgHeight;
      console.warn("gameData.imgRatio: ", gameData.imgRatio);
      gameData.speed = 1 / gameData.imgRatio;

      gameData.gridOffset = ((gameData.canvasWidth / gameData.gridSize) / 2);
      gameData.gamePosition = -gameData.gridOffset;

      console.warn("gridOffset: ", gameData.gridOffset);
      console.warn("sprites: ", gameData.sprites);
      
      // Turn on flappy
      gameData.sprites[gameData.flappySpriteName].display = true;
      
      if (mode === "game") {
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
    var gameData = component.get("v.gameData");
    gameData.flappySpriteName = component.get("v.flappySpriteName");
    gameData.staticSpritesName = component.get("v.staticSpritesName");

    var canvas = component.find("canvas").getElement();
    var ctx = canvas.getContext("2d");
    var spriteCommandEvent = $A.get("e.html5:spriteCommand");
    params = {
      canvas: canvas,
      ctx: ctx,
      name: gameData.flappySpriteName,
      command: "init",
      args: null
    }
    spriteCommandEvent.setParams(params).fire();
  },
  
  resetGame: function(component, event) {
    var gameData = component.get("v.gameData");
    gameData.gamePosition = 0;
    gameData.score = 0;
    component.setValue("v.gameStep", "intro");
  },

  playIntro: function(component, event) {
    var gameData = component.get("v.gameData");
    gameData.gridSize = 128;
    var sprite = gameData.sprites[gameData.flappySpriteName];
    var midY = (gameData.canvasHeight - sprite.bounds.h) / 2;
    sprite.bounds.y = midY;
    sprite.dest.y = midY - gameData.gridSize * 1;
    this.startAnimation(component);
    component.setValue("v.showControls", false);    
  },

  startGame: function(component, event) {
    var gameData = component.get("v.gameData");
    gameData.gridSize = component.get("v.gridSize"); // 32;
    gameData.gamePosition = 0;// -8;
    component.setValue("v.gameStep", "game");
    gameData._collisions = {};
    gameData.score = 0;
    
    var sprite = gameData.sprites[gameData.flappySpriteName];
    var midY = (gameData.canvasHeight - sprite.bounds.h) / 2;
    sprite.bounds.y = midY;
    sprite.dest.y = midY - gameData.gridSize * 1;
    
    component.setValue("v.showControls", false);    
  },
  
  endGame: function(component, canvas, ctx) {
    console.warn("endGame");
    var gameData = component.get("v.gameData");
    component.setValue("v.gameStep", "ending");
    gameData.gamePosition -= 1;
  },
  
  gameOver: function(component, canvas, ctx) {
    console.warn("gameOver");
    var gameData = component.get("v.gameData");
    component.setValue("v.gameStep", "end");    
    window.cancelAnimationFrame(gameData.animationFrame);
  },
  
  startAnimation: function(component) {
    var gameData = component.get("v.gameData");
    var canvas = component.find("canvas").getElement();
    var ctx = canvas.getContext("2d");

    var self = this;
    gameData.frameStats.oldtime = 0;
    gameData.frameStats.lastUpdate = 0;
    function gameLoop(time) {
      gameData.frameStats.fps = Math.round(1000 / (time - gameData.frameStats.oldtime));
      gameData.frameStats.oldtime = time;
      var s = Math.floor(time / 500);
      if (gameData.frameStats.lastUpdate != s) {
        gameData.debugInfo.fps = gameData.frameStats.fps;
        gameData.frameStats.lastUpdate = s;
      }

      gameData.animationFrame = window.requestAnimationFrame(gameLoop);
      $A.run(function() {
        self.render(component, gameData.canvas, gameData.ctx);
      });       
    }
    gameLoop();
  },

  stopAnimation: function(component) {
    var gameData = component.get("v.gameData");
    window.cancelAnimationFrame(gameData.animationFrame);
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
    
    var gameData = component.get("v.gameData");
    
    if (ctx.globalAlpha < 1) {
      ctx.globalAlpha += 0.01;
    }
    ctx.clearRect(0, 0, gameData.canvasWidth, gameData.canvasHeight);

    var gameStep = component.get("v.gameStep");
    var showGrid = component.get("v.showGrid");
    
    if (gameStep === "ending" || gameStep === "end") {
      
    } else {
      if (gameData.scrollVal <= gameData.speed) {
        gameData.scrollVal = gameData.imgWidth - gameData.speed;
      }
      gameData.scrollVal -= gameData.speed;

      gameData.gridPosition += gameData.gridSpeed;
      if (gameData.gridPosition % gameData.gridSize === 0) {
        gameData.gamePosition++;
      }
    }

    this.drawBackground(component, canvas, ctx);

    var maxY = gameData.canvasHeight - gameData.gridSize * 3;

    gameData.debugInfo.spriteY = gameData.spriteRect.y;
    gameData.debugInfo.maxY = maxY;
    
    var collision = false;
    
    if (gameData.spriteRect.y >= maxY) {
      collision = true;
    } else {
      collision = this.checkCollision(component, canvas, ctx);
    }
        
    if (collision === true && component.get("v.mode") === "game") {
      this.playSound("collision");
      this.endGame(component, canvas, ctx);
    }
    
    var p = gameData.gamePosition + gameData.gridOffset;

    gameData.debugInfo.bitmapCollision = collision + " at " + p;

    gameData._collisions = gameData._collisions || {};
    if (typeof gameData.columns[p] !== "undefined") {
      if (gameData._collisions[p] !== true) {
        gameData._collisions[p] = collision;
      }
    }

    var s = 0;
    var t = 0;
    var x = 0;
    var y = 0;
    for ( var i in gameData._collisions) {
      s += gameData._collisions[i] || 0; // === true && gameData.columns[i] ? 1 : 0;
      t++;
    }
    gameData.score = t - s;

    this.drawColumns(component, canvas, ctx, showGrid);

    this.drawSprites(component, canvas, ctx);

    this.drawForeground(component, canvas, ctx);
    this.drawStatus(component, canvas, ctx);

    if (showGrid) {
      this.drawGrid(component, canvas, ctx);
    }

    if (showDebug) {
      this.drawDebug(component, canvas, ctx);
    }

  },

  checkCollision: function(component, canvas, ctx) {
    var gameData = component.get("v.gameData");
    var sprite = gameData.sprites[gameData.flappySpriteName];
    
    var spriteRect = {
      x: sprite.bounds.x + ((sprite.bounds.w - gameData.gridSize) / 2),
      y: sprite.bounds.y + ((sprite.bounds.h - gameData.gridSize) / 2),
      w: gameData.gridSize, // sprite.bounds.w,
      h: gameData.gridSize
    // sprite.bounds.h
    };

    // Move canvas creation to setup
    if (typeof gameData.canvas2 === "undefined") {
      gameData.canvas2 = document.createElement("canvas");
      gameData.canvas2.width = canvas.width;
      gameData.canvas2.height = canvas.height;
      gameData.ctx2 = gameData.canvas2.getContext("2d");
    }

    gameData.ctx2.clearRect(0, 0, gameData.canvas2.width, gameData.canvas2.height);
    
    // Do not draw grid when checking collisions
    this.drawColumns(component, gameData.canvas2, gameData.ctx2, false);

    gameData.debugInfo.columnsPassed = gameData.debugInfo.columnsPassed || 0;

    // var imageData1 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
    var imageData1 = gameData.ctx2.getImageData(spriteRect.x, spriteRect.y, spriteRect.w, spriteRect.h);

    gameData.ctx2.clearRect(0, 0, gameData.canvas2.width, gameData.canvas2.height);
    this.drawSprites(component, gameData.canvas2, gameData.ctx2);
    var imageData2 = gameData.ctx2.getImageData(spriteRect.x, spriteRect.y, spriteRect.w, spriteRect.h);

    gameData.ctx2.clearRect(0, 0, gameData.canvas2.width, gameData.canvas2.height);
    var imageData3 = gameData.ctx2.getImageData(spriteRect.x, spriteRect.y, spriteRect.w, spriteRect.h);

    this.getBitmapCollisionData(imageData1.data, imageData2.data, imageData3.data, spriteRect.w * spriteRect.h);

    var collision = this.checkBitmapCollision(imageData1.data, imageData2.data, spriteRect.w * spriteRect.h);

    if (component.get("v.showDebug") && component.get("v.gameStep") !== "intro") {
      ctx.putImageData(imageData1, 0, 0);
      ctx.putImageData(imageData2, 0, gameData.gridSize);
      ctx.putImageData(imageData3, 0, gameData.gridSize * 2);
    }
    

    return collision;
  },

  /*
   * Draws the background, very simple scroller
   */
  drawBackground: function(component, canvas, ctx) {
    var gameData = component.get("v.gameData");
    var imageMap = component.get("v.imageMap");
    ctx.save();
    ctx.scale(gameData.imgRatio, 1);
    ctx.drawImage(imageMap["scrollImg"], gameData.imgWidth - gameData.scrollVal, 0, gameData.scrollVal, gameData.imgHeight, 0, 0, gameData.scrollVal, gameData.canvasHeight);
    ctx.drawImage(imageMap["scrollImg"], gameData.scrollVal, 0, gameData.imgWidth, gameData.canvasHeight);
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

  // Draws the columns
  // Returns true if the sprite has passed the current column
  drawColumns: function(component, canvas, ctx, showGrid) {
    var gameStep = component.get("v.gameStep");
    if (gameStep === "intro") {
      return;
    }

    var gameData = component.get("v.gameData");
    var imageMap = component.get("v.imageMap");

    var coll = false;

    gameData.debugInfo.gridPosition = gameData.gridPosition;
    gameData.debugInfo.gamePosition = gameData.gamePosition;

    ctx.strokeStyle = "white";
    var y0 = 0;
    var y1 = gameData.canvasHeight - 1;
    var y2 = 0;
    var startX = gameData.gridSize - (gameData.gridPosition % gameData.gridSize);
    startX -= gameData.gridSize;
    var g = gameData.gamePosition;
    var checkRect = {
      x: (gameData.canvasWidth / 2) - gameData.gridSize,
      y: 0,
      w: (gameData.gridSize * 2),
      h: gameData.canvasHeight
    };
    var columnRect = {
      x: 0,
      y: 0,
      w: gameData.gridSize,
      h: (gameData.gridSize * 2)
    };
    var topRect = {
      x: 0,
      y: 0,
      w: gameData.gridSize,
      h: (gameData.gridSize * 2)
    };
    var bottomRect = {
      x: 0,
      y: 0,
      w: gameData.gridSize,
      h: (gameData.gridSize * 2)
    };
    var gapRect = {
      x: 0,
      y: 0,
      w: gameData.gridSize,
      h: (gameData.gridSize * 3)
    };

    var sprite = gameData.sprites[gameData.flappySpriteName];
    var spriteRect = {
      x: sprite.bounds.x + ((sprite.bounds.w - gameData.gridSize) / 2),
      y: sprite.bounds.y + ((sprite.bounds.h - gameData.gridSize) / 2),
      w: gameData.gridSize, // sprite.bounds.w,
      h: gameData.gridSize
    // sprite.bounds.h
    };

    spriteRect.w *= sprite.scale.x;
    spriteRect.h *= sprite.scale.y;

    for (var x = startX; x <= gameData.canvasWidth; x += gameData.gridSize) {
      if (gameData.columns[g]) {
        y2 = (gameData.columns[g] + 1) * gameData.gridSize;
        /*
         * ctx.beginPath(); ctx.rect(x, y0, gameData.gridSize, gameData.gridSize * gameData.columns[g]); ctx.rect(x, y2, gameData.gridSize, gameData.canvasHeight - y2);
         * ctx.fillStyle = "yellow"; ctx.fill();
         */
        ctx.drawImage(imageMap["columnTopImg"], x, y0, gameData.gridSize, gameData.gridSize);
        for (var y = y0 + gameData.gridSize; y < (y2 - (gameData.gridSize * 2)); y += gameData.gridSize) {
          ctx.drawImage(imageMap["columnImg"], x, y, gameData.gridSize, gameData.gridSize);
        }
        ctx.drawImage(imageMap["columnBottomImg"], x, y, gameData.gridSize, gameData.gridSize);

        columnRect = {
          x: x,
          y: 0,
          w: gameData.gridSize,
          h: gameData.gridHeight - 1
        };

        topRect = {
          x: x,
          y: y0,
          w: gameData.gridSize,
          h: (y2 - (gameData.gridSize * 1))
        };

        y2 += (gameData.gridSize * 2);

        ctx.drawImage(imageMap["columnTopImg"], x, y2, gameData.gridSize, gameData.gridSize);
        for (var y = (y2 + gameData.gridSize); y <= gameData.canvasHeight; y += gameData.gridSize) {
          ctx.drawImage(imageMap["columnImg"], x, y, gameData.gridSize, gameData.gridSize);
        }

        bottomRect = {
          x: x,
          y: y2,
          w: gameData.gridSize,
          h: gameData.canvasHeight - y2
        };

        /*
         * Rectangle based collision detection, no longer used for this game.
         * 
         * This is good for simple collision detection, very fast, but it is not pixel-accurate. If the showGrid attribute is set to true then it will show
         * these collisions with various colors.
         */

        // First check if there is an overlap
        gapRect.x = x;
        gapRect.y = y2 - gapRect.h;

        var overlap = this.intersect(checkRect, gapRect);

        gameData.collisions = gameData.collisions || {};

        if (overlap && 2 > showGrid === true) {

          var collision = this.intersect(spriteRect, topRect) || this.intersect(spriteRect, bottomRect);

          if (collision) {
            if (typeof gameData.collisions[g] === "undefined") {
              gameData.collisions[g] = 1;
            }
          }

          if ((spriteRect.x > columnRect.x + columnRect.w) && typeof gameData.collisions[g] === "undefined") {
            gameData.collisions[g] = 0;
            gameData.tscore = gameData.tscore || 0;
            gameData.tscore++;
            gameData.debugInfo.tscore = gameData.tscore;
          }

          gameData.debugInfo.collision = collision;

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
    var gameStep = component.get("v.gameStep");
    var gameData = component.get("v.gameData");
    if (gameStep === "ending") {
      // If the ending sequence is playing, do nothing
      return;
    } else if (gameStep === "end") {
      // If the end screen is showing, restart the game
      this.setup(component, event);
      return;
    } else if (gameStep === "intro") {
      // If the intro is showing, start the game
      component.setValue("v.gameStep", "game");
      this.startGame(component, event);
      return;
    }
    
    this.playSound("flap");
    
    var sprite = gameData.sprites[gameData.flappySpriteName];

    sprite.speed.y = 5;
    sprite.angle = sprite.angle > 15 ? 15 : sprite.angle;

    sprite.bounds.y -= (gameData.gridSize / 4);
    // sprite.bounds.y = sprite.bounds.y < -gameData.gridSize ? -gameData.gridSize : sprite.bounds.y;
    sprite.bounds.y = sprite.bounds.y < 0 ? 0 : sprite.bounds.y; 

    sprite.dest = {
      x: (gameData.canvasWidth - gameData.gridSize) / 2,
      y: sprite.bounds.y - (gameData.gridSize / 0.75)
    }

  },

  drawSprite: function(component, canvas, ctx, name) {
    var gameData = component.get("v.gameData");
    var sprite = gameData.sprites[name];

    sprite.lastTimestamp = sprite.lastTimestamp || 0;
    var currentTimestamp = Date.now();
    if (currentTimestamp >= sprite.lastTimestamp + (1000 / sprite.fps)) {
      sprite.frameIndex++;
      sprite.frameIndex = (sprite.frameIndex >= sprite.frames) ? 0 : sprite.frameIndex;
      sprite.lastTimestamp = currentTimestamp;
    }
    var gameStep = component.get("v.gameStep");
    if (gameStep === "ending" || gameStep === "end") {
      sprite.frameIndex = 0;
    }

    gameData.debugInfo.frameIndex = sprite.frameIndex;

    if (sprite.name == gameData.flappySpriteName) {

      var maxY = gameData.canvasHeight - gameData.gridSize * 2;
      // var maxY = (gameData.canvasHeight - 1) - (sprite.bounds.h * 1)
      
      // Only for flappy games! Keeps the sprite centered on the screen.
      gameData.debugInfo.gridSize = gameData.gridSize;
      sprite.bounds.x = (gameData.canvasWidth - (sprite.scale.x * sprite.bounds.w)) / 2;
  
  
      gameData.debugInfo.spriteRect = sprite.bounds.x + ", " + sprite.bounds.y + ", " + sprite.bounds.w + ", " + sprite.bounds.h;
      gameData.debugInfo.spriteDest = sprite.dest.x + ", " + sprite.dest.y;
      sprite.angle = sprite.angle || 0;
      if (gameStep === "intro") {
        var midY = (gameData.canvasHeight - sprite.bounds.h) / 2;
        sprite.bounds.y = midY;
        sprite.angle = 0;
      } else if (gameStep === "ending" || gameStep === "end") {
        sprite.angle = 90;
      } else {
  
        // var maxY = (gameData.canvasHeight - 1) - (sprite.bounds.h * 1)
        if (sprite.bounds.y >= maxY) { // }(gameData.canvasHeight - 1) - (sprite.bounds.h * 1)) {
          sprite.angle = 0;
          sprite.bounds.y = maxY; // (gameData.canvasHeight - 1) - (sprite.bounds.h * 1);
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

    ctx.scale(gameData.gridSize / sprite.bounds.w, gameData.gridSize / sprite.bounds.h);

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
    if (sprite.name == gameData.flappySpriteName) {

      if (gameStep === "end") {
        
      } else if (gameStep === "ending") {
        sprite.dest.y = gameData.canvasHeight - (sprite.bounds.h * 1);
        if (sprite.bounds.y <= sprite.dest.y) {
          sprite.bounds.y += sprite.speed.y
          sprite.speed.y = sprite.speed.y > 3 ? 3 : sprite.speed.y;
          sprite.speed.y += sprite.speed.y < 3 ? 0.05 : 0;
        } else {
          component.setValue("v.gameStep", "end");
          this.playSound("gameOver");
          this.gameOver(component, canvas, ctx);
        }
      } else {
        if (sprite.bounds.y === sprite.dest.y && sprite.dest.y != 0) {
          sprite.bounds.y -= sprite.speed.y;
        } else if (sprite.bounds.y > sprite.dest.y) {
          sprite.bounds.y -= sprite.speed.y;
          sprite.speed.y -= sprite.speed.y > 1 ? 0.5 : 0;
        } else {
          sprite.dest.y = maxY; // gameData.canvasHeight - (sprite.bounds.h * 1);
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
  drawSprites: function(component, canvas, ctx) {
    var gameData = component.get("v.gameData");

    // Loop for multiple sprites...
    var sprite = null;
    for (var n in gameData.sprites) {
      if (gameData.sprites[n].display === true) {
        this.drawSprite(component, canvas, ctx, n);
      }
    }
 
  },

  drawForeground: function(component, canvas, ctx) {

  },

  drawSpriteText: function(component, canvas, ctx, sprite, offsetName, x, y) {
    var gameData = component.get("v.gameData");
    if (!sprite.offsets) {
      console.warn("no offsets for sprite: ", sprite.name, sprite);
      return;
    }
    var offset = sprite.offsets[offsetName];
    var bounds = {
      x: x || (gameData.canvasWidth - offset.w) / 2, // centered by default
      y: y || (gameData.canvasHeight - offset.h) / 2, // centered by default
      w: offset.w * sprite.scale.x,
      h: offset.h * sprite.scale.y,
    };
    ctx.drawImage(sprite.img, offset.x, offset.y, offset.w, offset.h,
      bounds.x, bounds.y, bounds.w, bounds.h);
  },
  
  drawStatus: function(component, canvas, ctx) {

    var gameStep = component.get("v.gameStep");
    var gameData = component.get("v.gameData");
    
    // Newer sprite-based titles, etc.
    if (gameStep === "intro") {
      this.drawSpriteText(component, canvas, ctx, gameData.sprites[gameData.staticSpritesName], "title", null, 80);
      this.drawSpriteText(component, canvas, ctx, gameData.sprites[gameData.staticSpritesName], "tapToStart", null, gameData.canvasHeight - 120);// 230);
    } else if (gameStep === "end") {
      this.drawSpriteText(component, canvas, ctx, gameData.sprites[gameData.staticSpritesName], "gameOver", null, null);
      this.drawSpriteText(component, canvas, ctx, gameData.sprites[gameData.staticSpritesName], "tapToContinue", null, gameData.canvasHeight - 120);// 230);
    }
    
    if (gameStep !== "intro") {
  
      // Score
      var textSize = 32;
      var margin = 10;
      var x = gameData.canvasWidth / 2;
      var midY = gameData.canvasHeight / 2;
      
      var y = textSize + margin;
      
      var text = gameData.score;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.font = "bold " + textSize + "px 'Marker Felt'";
      ctx.textAlign = "center";
      
      ctx.fillText(text, x, y);
      ctx.strokeText(text, x, y);
    }
    
  },

  drawGrid: function(component, canvas, ctx) {
    var gameData = component.get("v.gameData");
    ctx.strokeStyle = "white";
    var y0 = 0;
    var y1 = gameData.canvasHeight - 1;
    var startX = gameData.gridSize - (gameData.gridPosition % gameData.gridSize);
    startX -= gameData.gridSize;
    var g = gameData.gamePosition;
    for (var x = startX; x <= gameData.canvasWidth; x += gameData.gridSize) {
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
    var x1 = gameData.canvasWidth - 1;
    for (var y = gameData.gridSize; y <= gameData.canvasHeight; y += gameData.gridSize) {
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x1, y);
      ctx.stroke();
    }

    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo((gameData.canvasWidth / 2), 0);
    ctx.lineTo((gameData.canvasWidth / 2), gameData.canvasHeight - 1);
    ctx.moveTo(0, (gameData.canvasHeight / 2));
    ctx.lineTo(gameData.canvasWidth - 1, (gameData.canvasHeight / 2));
    ctx.stroke();
  },

  drawDebug: function(component, canvas, ctx) {
    var gameData = component.get("v.gameData");
    ctx.save();
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    var margin = 10;
    var padding = 4;
    var fontSize = 9;
    var lineHeight = fontSize + padding;
    var x = gameData.canvasWidth - (gameData.debugSize.w + margin);
    var y = margin;
    ctx.rect(x, y, gameData.debugSize.w, gameData.debugSize.h);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "black";
    ctx.font = "normal " + fontSize + "px Lucida Console";
    ctx.textAlign = "left";
    // var x = gameData.canvasWidth - 100;
    x += padding;
    y += lineHeight;
    
    ctx.fillText("gameStep: " + gameData.gameStep, x, y);
    y += lineHeight;
    
    for ( var n in gameData.debugInfo) {
      ctx.fillText(n + ": " + gameData.debugInfo[n], x, y);
      y += lineHeight;
    }
  },

  createColumns: function(component) {
    var gameData = component.get("v.gameData");
    gameData.columns = {};
    var max = {
      x: gameData.canvasWidth / gameData.gridSize,
      y: gameData.canvasHeight / gameData.gridSize
    }
    console.warn("max: ", max);
    var lastY = Math.round(max.y / 2); // Math.floor(Math.random() * (max.y - 3)) + 1;
    var y = 0;
    var startX = (gameData.canvasWidth / gameData.gridSize) / 1;
    console.warn("startX: ", startX);
    for (var x = startX; x < 3000; x += Math.round(Math.random() * 2) + 5) {
      y = lastY + (Math.round(Math.random() * 4) - 2);
      y = y <= 1 ? 2 : y;
      y = y >= max.y - 4 ? y - 4 : y;
      gameData.columns[x] = y;
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
    var gameData = component.get("v.gameData");
    var target = event.getSource ? event.getSource().getElement() : event.target;
    var keyCode = event.getKeyCode || event.getParam("keyCode");
    // console.warn("keyCode: ", keyCode, typeof keyCode);
    var action = gameData.keyCodeActionMap[keyCode];
    // console.warn("action: ", action);
    if (action) {
      this[action](component, event);
    }
    gameData.debugInfo.keyCode = keyCode;
    gameData.debugInfo.keyChar = gameData.keyMap[keyCode];
    if (!gameData.debugInfo.keyChar) {
      gameData.debugInfo.keyChar = String.fromCharCode(keyCode);
    }
    // console.warn("gameData.debugInfo.keyChar: ", gameData.debugInfo.keyChar, gameData.debugInfo.keyCode);
  },

  handleClick: function(component, event) {
    this.jump(component, event);
  },

  // Custom loader for flappy
  handleSpriteCommand: function(component, params) {
    var gameData = component.get("v.gameData");
    console.warn("canvasScrollerHelper.handleSpriteCommand: ", params);
    console.warn("gameData.flappySpriteName: ", gameData.flappySpriteName);
    if (params.command === "add") {
      var sprite = params.args;
      sprite.display = false;
      gameData.sprites[sprite.name] = sprite;
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
