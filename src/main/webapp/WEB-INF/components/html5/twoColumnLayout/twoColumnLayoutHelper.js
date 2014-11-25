({
  addComponent: function(component, facet, config) {
    $A.componentService.newComponentAsync(this, function(element) {
      console.warn("element: ", element);
      //
      // NOTE - Change getValue to get for newer versions of Aura!
      //
      facet.push(element);
    }, config);
  },

  addRegion: function(component, facet, name) {
    var config = {
      componentDef : "markup://html5:simpleRegion",
      attributes : {
        values : {
          name: name,
          "aura:id": name
        }
      }
    };
    
    this.addComponent(component, facet, config);
  },
  
  addButton: function(component, facet) {
    var config = {
      componentDef : "markup://ui:button",
      attributes : {
        values : {
          label: "Button " + Date.now()
        }
      }
    };
    
    this.addComponent(component, facet, config);
  },
  
  
  testLoadRegion: function(component, region) {
    var facet = component.getValue("v." + region);
    this.addRegion(component, facet, "test");
  }

})