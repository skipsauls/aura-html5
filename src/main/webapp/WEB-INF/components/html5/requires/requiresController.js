({
	init: function(component, event, helper) {
    console.warn("setup, component: ", component, component.getGlobalId(), component.get("v.initScripts"));
		
        helper.setup(component, event, function(status) {
            console.warn("setup returned, component: ", component, component.getGlobalId(), component.get("v.initScripts"));
            console.warn(component.getElement());
            component.get("v.initScripts").run();
        });
	}
})

