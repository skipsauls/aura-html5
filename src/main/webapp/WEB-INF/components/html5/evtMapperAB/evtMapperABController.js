({
  handleEvtA: function(component, event, helper) {
    var params = event.getParams();    
    var evt = $A.get("e.html5:evtB");
    if (evt) {
      params = {
        label: params.name,
        xVal: params.value,
        yVal: params.value
      }
      evt.setParams(params).fire();
    }
  },
  
  handleEvtB: function(component, event, helper) {
    var params = event.getParams();    
    var evt = $A.get("e.html5:evtA");
    if (evt) {
      params = {
        name: params.label,
        value: params.xVal
      }
      evt.setParams(params).fire();
    }
  }
})