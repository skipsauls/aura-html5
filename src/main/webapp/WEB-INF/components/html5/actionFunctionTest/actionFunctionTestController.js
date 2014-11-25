({
  fireTestServerAction: function(component, event, helper) {
    var action = component.get("c.testServerAction");
    console.warn("action: ", action);
    action.setParams({foo:"greeble", bork:"sneech"});
    action.setCallback(this, function(a) {
      var r = a.getReturnValue();
      console.warn("r: ", r)
    });
    $A.enqueueAction(action); 
  },

  handleActionResult: function(component, event, helper) {
    console.warn("actionFunctionTestController.handleActionResult");
    var params = event.getParams();
    var result = params.result;
    console.warn("result", result);
  },
  
  globalFireTestServerAction: function(component, event, helper) {
    fireTestServerAction();
  },
  
  globalFireAddValues: function(component, event, helper) {
    var valueA = component.get("v.valueA");
    var valueB = component.get("v.valueB");
    console.warn("valueA: ", valueA, typeof valueA);
    console.warn("valueB: ", valueB, typeof valueB);
    fireAddValues(valueA, valueB, function(result) {
      console.warn("result: ", result);
      component.setValue("v.result", result);
    });
  }
  
})
