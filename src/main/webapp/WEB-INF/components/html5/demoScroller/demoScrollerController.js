({
  doInit: function(component, event, helper) {
    setTimeout(function() {
      helper.init(component, event);
    }, 10);
  },
  
  handleKeypress: function(component, event, helper) {
    helper.handleKeypress(component, event);
  },

  handleMouseDown: function(component, event, helper) {
    console.warn("mouseDown " + Date.now());
    //helper.handleClick(component, event);
  },
  
  handleMouseUp: function(component, event, helper) {
    console.warn("mouseUp " + Date.now());
    //helper.handleClick(component, event);
  },

  handleClick: function(component, event, helper) {
    helper.handleClick(component, event);
  },
 
  handleSpriteCommand: function(component, event, helper) {
    helper.handleSpriteCommand(component, event.getParams());
  }
  
})