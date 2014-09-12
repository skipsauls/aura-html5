({
  initScripts: function(component, event, helper) {
    console.warn("requiresTestController.initScripts");
      
      // Use requirejs as usual
      requirejs.config({
          baseUrl: "/",
          paths: {
              pixi: "/js/pixi.js/pixi.dev"
          }
      });
      
      requirejs(["pixi"], function(PIXI) {
        console.warn("PIXI: ", PIXI);
        helper.setup(component, event, PIXI);
      });
  }
  
})
