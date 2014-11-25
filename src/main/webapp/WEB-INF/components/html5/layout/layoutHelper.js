({
  addComponent: function(component, target, config) {
    $A.componentService.newComponentAsync(this, function(element) {
      console.warn("element: ", element);
      //
      // NOTE - Change get to get for newer versions of Aura!
      //
      var body = target.get("v.body");
      body.push(element);
      
    }, config);
  },

  addRegion: function(component, name) {
    var regions = component.find("regions");
    var body = regions.get("v.body");
    var config = {
      componentDef : "markup://html5:simpleRegion",
      attributes : {
        values : {
          name: "Region_" + body.getLength(),
          "aura:id": "Region_" + body.getLength(),
          "class": "region"
        }
      }
    };
    
    this.addComponent(component, regions, config);
  },
  
  addButton: function(component, target) {
    var config = {
      componentDef : "markup://ui:button",
      attributes : {
        values : {
          label: "Button " + Date.now()
        }
      }
    };
    
    this.addComponent(component, target, config);
  },
  
  
  testLoadRegions: function(component) {
    this.addRegion(component, "one");
  }

})