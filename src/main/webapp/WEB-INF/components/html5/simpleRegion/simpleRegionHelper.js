({
  addComponent: function(component, facet, config) {
    $A.componentService.newComponentAsync(this, function(element) {
      console.warn("element: ", element);
      //
      // NOTE - Change get to get for newer versions of Aura!
      //
      facet.push(element);
    }, config);
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
  
  testAddComponent: function(component, region) {
    var facet = component.get("v." + region);
    console.warn("facet: ", facet);
    this.addButton(component, facet);
  }

})