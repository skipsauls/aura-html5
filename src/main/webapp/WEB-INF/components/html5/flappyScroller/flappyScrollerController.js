({
  doInit: function(component, event, helper) {
    helper.init(component, event);
  },
  
  handleFlappyCommand: function(component, event, helper) {
  },

  toggleMode: function(component, event, helper) {
    helper.toggleMode(component, event);
  },

  toggleControls: function(component, event, helper) {
    helper.toggleControls(component, event);
  },

  toggleRunning: function(component, event, helper) {
    helper.toggleRunning(component, event);
  },

  toggleGrid: function(component, event, helper) {
    helper.toggleGrid(component, event);
  },

  toggleDebug: function(component, event, helper) {
    helper.toggleDebug(component, event);
  },
  
  setup: function(component, event, helper) {
    helper.setup(component, event);
  },

  resetGame: function(component, event, helper) {
    helper.resetGame(component, event);
  },
  
  reload: function(component, event, helper) {
    window.location.reload();
  },
  
  handleKeypress: function(component, event, helper) {
    helper.handleKeypress(component, event);
  },

  handleMouseDown: function(component, event, helper) {
    //console.warn("mouseDown " + Date.now());
    //helper.handleClick(component, event);
  },
  
  handleMouseUp: function(component, event, helper) {
    //console.warn("mouseUp " + Date.now());
    //helper.handleClick(component, event);
  },

  handleClick: function(component, event, helper) {
    //helper.handleClick(component, event);
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