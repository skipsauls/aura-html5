({
    initScripts: function(component, event, helper) {
      console.warn("requiresTestController.initScripts");
        
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
            
       		$j("#modalToggle", component.getElement()).on("click", function() {
           		$j("#myModal", component.getElement()).modal(); 
        	});
        });
    }
})

