({
    initScripts: function(component, event, helper) {
      console.warn("requiresTest2Controller.initScripts");
        // Use requirejs as usual
        requirejs.config({
          baseUrl: "/",
          paths: {
              jquery: "/js/jquery/jquery",
              bootstrap: "/js/bootstrap"
          },
          shim: {
              bootstrap: {deps: ["jquery"]}
          }
      });
        
        requirejs(["jquery", "bootstrap"], function(_jq, _bs) {
            // An optimization to avoid conflicts for jQuery
            // Use $j rather than $
            if (typeof jQuery !== "undefined" && typeof $j === "undefined") {
                $j = jQuery.noConflict(true);;
            }
            
            // Setup some event handlers using jQuery
            helper.initHandlers(component, event);
        });
    },
    
    toggleAlert: function(component, event, helper) {
        console.warn("requiresTest2Controller.toggleAlert: ", component, event, helper);
        $j("div#test_alert", component.getElement()).toggle();
    }
})

