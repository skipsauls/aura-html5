({

  doInit: function(component, event, helper) {
    console.warn("mapController.doInit: ", component, event, helper);
    helper.doInit(component, event);
  },

  getCurrentPosition: function(component, event, helper) {
    helper.getCurrentPosition(component, event);
  },
  
  handleEvent: function(component, event, helper) {
    helper.handleEvent(component, event);
  }
})