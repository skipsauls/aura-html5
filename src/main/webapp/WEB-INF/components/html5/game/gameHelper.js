({
  init: function(component, event) {
    console.warn("gameHelper.init");
    var data = component.get("v.data") || {};
    component.setValue("v.data", data);
  },

  handleScrollerCommand: function(component, event) {
    var data = component.get("v.data");
    console.warn("gamerHelper.handleScrollerCommand: ", event);
    var command = event.getParam("command");
    if (params.command === "add") {
      var scroller = event.getParam("args");
      console.warn("scroller: ", scroller);
      data.scrollers = data.scrollers || {};
      data.scrollers[scroller.name] = scroller;
    }
    console.warn("data.scrollers: ", data.scrollers);
    
  },

  handleSpriteCommand: function(component, event) {
    var data = component.get("v.data");
    console.warn("gamerHelper.handleSpriteCommand: ", event);
    var command = event.getParam("command");
    if (params.command === "add") {
      var sprite = event.getParam("args");
      sprite.display = false;
      console.warn("sprite: ", sprite);
      data.sprites = data.sprites || {};
      data.sprites[sprite.name] = sprite;
    }
    console.warn("data.sprites: ", data.sprites);
  },
  

})