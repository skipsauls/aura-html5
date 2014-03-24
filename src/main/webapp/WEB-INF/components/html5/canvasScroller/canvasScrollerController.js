({
  doInit: function(component, event, helper) {
    
  },

  
  toggleRunning: function(component, event, helper) {
    var running = component.get("v.running");
    if (running) {
      helper.stopAnimation(component);
    } else {
      helper.startAnimation(component);
    }
    component.setValue("v.running", !running);
  },
  
  addSprites: function(component, event, helper) {
    helper.addSprites(component);
  },

  moveSprite: function(component, event, helper) {
    var keyCode = event.getKeyCode ? event.getKeyCode() : event.keyCode;
    var target = event.getSource ? event.getSource().getElement() : event.target;
    var dir = {
      x: (keyCode === 37 || keyCode == 39) ? keyCode - 38 : 0,
      y: (keyCode === 38 || keyCode == 40) ? keyCode - 39 : 0,
    }
    helper.moveSprite(component, dir);
  }, 
  moveRight: function(component, event, helper) {
    helper.moveSprite(component, {x: 1, y: 0});
  },
  moveLeft: function(component, event, helper) {
    helper.moveSprite(component, {x: -1, y: 0});
  },
  moveUp: function(component, event, helper) {
    helper.moveSprite(component, {x: 0, y: -1});
  },
  moveDown: function(component, event, helper) {
    helper.moveSprite(component, {x: 0, y: 1});
  },
 
  handleSpriteCommand: function(component, event, helper) {
    helper.handleSpriteCommand(component, event.getParams());
  }
  
})