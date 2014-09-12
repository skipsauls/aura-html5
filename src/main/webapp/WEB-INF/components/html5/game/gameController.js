({
  doInit: function(component, event, helper) {
    helper.init(component, event);
  },

  handleScrollerCommand: function(component, event, helper) {
    console.warn("gameController.handleScrollerCommand");
    helper.handleScrollerCommand(component, event);
  },

  handleSpriteCommand: function(component, event, helper) {
    console.warn("gameController.handleSpriteCommand");
    helper.handleSpriteCommand(component, event);
  }
  
  
})
