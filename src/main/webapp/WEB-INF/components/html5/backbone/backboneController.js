({

  initScripts: function(component, event, helper) {
    console.warn("backboneController.initScripts");
      // Use requirejs as usual
      requirejs.config({
        baseUrl: "/",
        paths: {
            backbone: "/js/backbone_all"
        }
    });
      
      requirejs(["backbone"], function(_bb) {
          // Init the backbone app
          helper.appInit(component, event);
      });
  },
  
  doInit: function(component, event, helper) {
    'use strict';  
    console.log("backboneController.init");
  },

  backboneLoaded: function(component, event, helper) {
    console.warn("backboneLoaded");
    helper.appInit(component, event);
  }
})