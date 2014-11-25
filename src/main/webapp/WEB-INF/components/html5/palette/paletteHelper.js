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
  
  setupComponentDefs: function(component) {
    console.warn("setupComponentDefs");
    var idx = $A.componentService.getIndex();
    console.warn("idx: ", idx);
    var r = idx.split(/\n/g);
    console.warn(r);
    var s = null;
    var def = null;
    var desc = null;
    var defDescMap = {};
    for (var i = 0; i < r.length; i++) {
      try {
        s = r[i].split(/\ :\ /g);
        cmp = $A.getCmp(s[0]);
        def = cmp.getDef();
        desc = def.getDescriptor();
        defDescMap[desc.name] = {
          def: def,
          desc: desc
        };
        /*
        facets = def.getFacets();
        if (facets) {
          console.warn(r[i], "is region: ", def.isInstanceOf("html5:region"));
          console.warn("facets: ", facets, facets.length);
          for (var j = 0; j < facets.length; j++) {
            console.warn("facet: ", facets[j]);
          }
        }
        */
      } catch (e) {
        console.warn("Exception: ", e);
      }
    }
    for (var name in defDescMap) {
      console.warn(name, defDescMap[name]);
    }
  },
  
  init: function(component, event) {
    console.warn("init");
    this.setupComponentDefs(component);
    
  }

})