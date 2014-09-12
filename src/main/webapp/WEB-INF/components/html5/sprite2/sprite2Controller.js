({
  doInit: function(component, event, helper) {
    console.warn("spriteController.doInit");
    helper.doInit(component, event);
  },

  handleSpriteCommand: function(component, event, helper) {
    helper.handleSpriteCommand(component, event);
  }
})