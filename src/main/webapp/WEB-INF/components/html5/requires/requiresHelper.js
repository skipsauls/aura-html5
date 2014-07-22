({
    
    ready: null,
    callbacks: [],
    
    setup: function(component, event, next) {
        var styles = component.get("v.styles");

		// Load the styles        
        if (styles && styles.length > 0) {
            for (var i = 0; i < styles.length; i++) {
                this.loadStyle(styles[i]);
            }
        }

        // Load require.js        
        var self = this;
        if (self.ready === true) {
            next();
        } else {
          	self.callbacks.push(next);
            if (typeof self.ready === "undefined") {
                self.ready = false;
              	self.loadScript("requirejs", "/js/require/require.js", function() {
                    self.ready = true;
                    for (var i = 0; i < self.callbacks.length; i++) {
                        self.callbacks[i]();
                    }
                });
            }
        }
    },
    
    loadStyle: function(stylePath, next) {
        var id = stylePath.replace("/", "_");
        var link = document.getElementById(id);
        if (!link) {
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            
            link.href = stylePath; 
            link.rel = 'stylesheet';
            link.helper = this;
            link.id = id;
            
            link.onload = function() {
                if (typeof next === "function") {
                    next();
                }
            }
            
            head.appendChild(link);
        }
    },
    
    loadScript: function(name, scriptPath, next) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        
        script.src = scriptPath; 
        script.type = 'text/javascript';
        script.key = scriptPath;
        script.helper = this;
        script.id = "script_" + name;
        
        script.onload = next;
        head.appendChild(script);
    }
})

