({

  
  doInit: function(component, event, helper) {
    'use strict';  
    console.log("backboneController.init");
  },

  backboneLoaded: function(component, event, helper) {
    console.warn("backboneLoaded");
    helper.appInit(component, event);
  }
})