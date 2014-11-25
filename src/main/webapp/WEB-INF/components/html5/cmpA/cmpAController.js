({
  handleChange: function(component, event, helper) {
    var name = component.get("v.name");
    var value = component.get("v.value");
    console.warn("name: ", name);
    console.warn("value: ", value);
    var evt = $A.get("e.html5:evtA");
    if (evt) {
      params = {
        name: name,
        value: value
      }
      evt.setParams(params).fire();
    }
  },
  
  handleEvtA: function(component, event, helper) {
    foo = event;
    var params = event.getParams();
    return;
    component.set("v.name", params.name);
    component.set("v.value", params.value);
  }
})