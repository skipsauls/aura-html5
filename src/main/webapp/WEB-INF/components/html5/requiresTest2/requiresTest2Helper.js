({
    initHandlers: function(component, event) {
        // Set the context for jQuery to the component element
        // This prevents conflict between components
        var ctx = component.getElement();
        $j("#toggleAlert", ctx).on("click", function() {
            $j("div#test_alert", ctx).toggle();
        });
        
        $j("[data-press]", ctx).each(function(i, el) {
          console.warn(i, el);

            $j(el).on("click", function(a, b) {
                console.warn("click: ", a, b);
                var f = $j(el).data("press");
                console.warn(f);
                component.get("c." + f).run(component, null, component.get("h"));
            });
            
        });
    }
})