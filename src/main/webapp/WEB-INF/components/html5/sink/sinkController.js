({
  
  
  doSetup: function(component, event, helper) {
    
    
    component.set("v.test", {foo:"bar"});
    
    helper.doSetup(component, event);

  },

  doInit: function(component, event, helper) {
  },

  handleEvent: function(component, event, helper) {
    helper.handleEvent(component, event);
  }
})