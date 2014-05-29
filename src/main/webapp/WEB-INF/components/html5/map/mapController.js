({

  doInit: function(component, event, helper) {
    console.warn("mapController.doInit: ", component, event, helper);
    helper.doInit(component, event);
  },

  handleEvent: function(component, event, helper) {
    helper.handleEvent(component, event);
  }
})