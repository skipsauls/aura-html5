({
  handleChange: function(component, event, helper) {
    var label = component.get("v.label");
    var x = component.get("v.xVal");
    var y = component.get("v.yVal");
    console.warn("name: ", name);
    console.warn("x: ", x);
    console.warn("y: ", y);
    var evt = $A.get("e.html5:evtB");
    if (evt) {
      params = {
        label: label,
        xVal: x,
        yVal: y
      }
      evt.setParams(params).fire();
    }
  },
  
  handleEvtB: function(component, event, helper) {
    
  }
})