({
  scrollImg: null,
  imgWidth: 0,
  imgHeight: 0,
  sprites: {},
  timeout: null,

  loadSprites: function(component, canvas, ctx) {
    //var sprite = component.find("")
    foo = component;
  },
  
  init: function(component) {
    console.warn("init");
    var canvas = component.find("canvas").getElement();
    var ctx = canvas.getContext("2d");
    if (!this.scrollImg) {
      this.loadSprites(component, canvas, ctx);
      console.warn("loading image");
      this.scrollImg = new Image();
      this.scrollImg.src = "/img/citybg.png";
      this.canvasWidth = 600;
      this.canvasHeight = 480;
      this.scrollVal = 0;
      this.speed = 2;
      var self = this;
      this.scrollImg.onload = function() {
        console.warn("loadImage");
        self.imgWidth = self.scrollImg.width;
        self.imgHeight = self.scrollImg.height;
        console.warn("self.imgWidth: ", self.imgWidth);
        console.warn("self.imgHeight: ", self.imgHeight);
        self.render(component, canvas, ctx);
      }
    } else {
      this.render(component, canvas, ctx);
    }
    console.warn("----");
  },

  render: function(component, canvas, ctx) {
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    if (this.scrollVal >= this.canvasWidth) {
      console.log(this.scrollVal);
      this.scrollVal = 0;
    }

    this.scrollVal += this.speed;
    ctx.drawImage(this.scrollImg, this.canvasWidth - this.scrollVal, 0, this.scrollVal, this.imgHeight, 0, 0, this.scrollVal, this.imgHeight);
    ctx.drawImage(this.scrollImg, this.scrollVal, 0, this.imgWidth, this.imgHeight);
    
    var sprite = null;
    for (var n in this.sprites) {
      sprite = this.sprites[n];
      ctx.drawImage(sprite.img, sprite.bounds.x, sprite.bounds.y, sprite.bounds.w, sprite.bounds.h);
    }
    
    var self = this;
    this.timeout = setTimeout(function() {
      self.render(component, canvas, ctx);
    }, 17);
  },

  startAnimation: function(component) {
    this.init(component);
  },

  stopAnimation: function(component) {
    var canvas = component.find("canvas").getElement();
    var ctx = canvas.getContext("2d");
    clearTimeout(this.timeout);
  },

  addSprites: function(component) {
    var canvas = component.find("canvas").getElement();
    var ctx = canvas.getContext("2d");
    var spriteCommandEvent = $A.get("e.html5:spriteCommand");
    params = {
      canvas: canvas,
      ctx: ctx,
      command: "init",
      args: null
    }
    spriteCommandEvent.setParams(params).fire();    
  },
  
  moveSprite: function(component, dir) {
    var spriteCommandEvent = $A.get("e.html5:spriteCommand");
    params = {
      command: "move",
      args: dir
    }
    spriteCommandEvent.setParams(params).fire();    
    
  },
  
  handleSpriteCommand: function(compoent, params) {
    //console.warn("canvasScrollerHelper.handleSpriteCommand: ", params);
    if (params.command === "add") {
      var sprite = params.args;
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
  },

  setup: function(component) {
    var canvas = component.find("paint_area").getElement();
    var ctx = canvas.getContext("2d");
    var self = this;
    canvas.addEventListener('mousemove', function(evt) {
      self.handleMouseMove(component, canvas, evt);
    });
  }
});
