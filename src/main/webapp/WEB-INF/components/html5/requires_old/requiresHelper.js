({
	// These are the scripts we have loaded.  
	scripts: [],

	//
	// TODO:
	// Change this to handle requiring multiple scripts
	//
	//
	
	// Triggers the requires process
	requires: function(component, event, helper) {
		var path = component.get("v.script");
		var current = this.scripts[path];
		
		if (current) {
			if (current.loading) {
				// Still loading this script
				current.components.push(component);
			} else {
				// Script loaded, callback directly
				helper.callback(component);
			}
		} else {
			this.scripts[path] = { loading: true, components: [ component ] };
			
			// And load the script
			this.load(path);
		}
	},
	load: function(scriptPath) {
	   var head = document.getElementsByTagName('head')[0];
	   var script = document.createElement('script');
	   
	   script.src = scriptPath; 
	   script.type = 'text/javascript';
	   script.key = scriptPath;
	   script.helper = this;
	   
	   // IE and the rest of the world of course disagree..
	   script.onload = function() { 
		   var helper = this.helper;
		   var current = helper.scripts[this.key];
		   
		   // We have the script
		   current.loading = false;
		   
		   // Now call any registered actions
		   for (var index = 0; index < current.components.length; index++) {
			   helper.callback.call(helper, current.components[index]);
		   }
	   }
	   /*
	    * TODO: Check to see if this is actually required with modern IE
	   script.onreadystatechange= function () { if (this.readyState == 'complete') callback.apply(this.helper, this.arguments); }
	   */
	   
	   head.appendChild(script);		
	},
	callback: function(component) {
		component.get("v.callback").run();
	}
})
