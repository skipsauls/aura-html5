({
  
  
  blast: function(component, event) {
    console.warn("blasterHelper.blast");
    
    var evt = $A.getEvt("html5:simpleEvent");
    evt.setParams({"value": "test"});
    evt.fire();
    
  },

  handleEvent: function(component, event) {
    console.warn("blasterHelper.handleEvent: ", component, event);
    
  }
})