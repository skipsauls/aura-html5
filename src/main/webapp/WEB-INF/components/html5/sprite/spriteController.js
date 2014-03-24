({
  doInit: function(component, event, helper) {
    console.warn("spriteController.doInit");
  },

  handleSpriteCommand: function(component, event, helper) {
    helper.handleSpriteCommand(component, event);
  }
})