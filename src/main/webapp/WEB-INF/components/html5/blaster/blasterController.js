({
  
  
  doSetup: function(component, event, helper) {
  },
  
  blast: function(component, event, helper) {
    console.warn("blasterController.blast");
    helper.blast(component, event);
  },

  handleEvent: function(component, event, helper) {
    helper.handleEvent(component, event);
  }
})