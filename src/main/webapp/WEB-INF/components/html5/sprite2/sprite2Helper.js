({

  doInit: function(component, event) {
    console.warn("sprite2Helper.doInit");
    
    var data = {
      name: component.get("v.name"),
      type: component.get("v.type"),
      img: null,
      frames: component.get("v.frames"),
      fps: component.get("v.fps"),
      frameIndex: component.get("v.frameIndex"),
      bounds: {
        x: 0,
        y: 0,
        w: 0,
        h: 0
      },
      position: {
        x: component.get("v.positionX"),
        y: component.get("v.positionY")
      },
      speed: {
        x: component.get("v.speedX"),
        y: component.get("v.speedY")
      },
      scale: {
        x: component.get("v.scaleX"),
        y: component.get("v.scaleY")
      },
      dest: {
        x: 0,
        y: 0
      }
    };
    
    component.set("v.data", data);
    
    var sprite = data;
    var imgURL = component.get("v.imageURL");
    sprite.img = new Image();
    sprite.img.src = imgURL;
    var self = this;
    sprite.img.onload = function() {
      sprite.bounds.h = sprite.img.height;
      sprite.bounds.w = sprite.img.width;
      if (sprite.type === "animated") {
        if (sprite.frames > 0) {
          // Divide the width by the number of frames
          sprite.bounds.w /= sprite.frames;
        }
      } else if (sprite.type === "static") {
        var offsets = component.get("v.offsets");
        console.warn("offsets: ", offsets);
        sprite.offsets = JSON.parse(offsets);
        console.warn("sprite.offsets: ", sprite.offsets);
      }
      self.addToCanvas(component, sprite);
    }
    console.warn("spriteHelper, this.name: ", this.name);
  },
  
  addToCanvas: function(component) {
    console.warn("sprite2Helper.addToCanvas");
    var spriteCommandEvent = component.getEvent("spriteCommandFired");
    var data = component.get("v.data");
    console.warn("data: ", data);
    params = {
      command: "add",
      args: data,
    }
    console.warn("firing spriteCommandEvent: ", spriteCommandEvent);
    spriteCommandEvent.setParams(params).fire();
  },

  render: function(canvas, ctx) {
    ctx.drawImage(this.img, 20, 20, this.imgWidth, this.imgHeight);
  },

  move: function(component, delta) {
    this.bounds.x += (this.speed.x * delta.x);
    this.bounds.y += (this.speed.y * delta.y);
  },

  handleSpriteCommand: function(component, event) {
    console.warn("sprite2Helper.handleSpriteCommand: ", event.getParams());
    var params = event.getParams();
    console.warn("params: ", params);
    var command = params.command;
    console.warn("command: ", command);
    var args = params.args;
    if (command === "init") {
      this.init(component, params.canvas, params.ctx);
    } else if (command === "move") {
      this.move(component, args);
    }
  }
})