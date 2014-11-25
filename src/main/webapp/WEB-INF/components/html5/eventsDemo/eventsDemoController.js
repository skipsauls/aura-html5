({

  handleEvent: function(component, event, helper) {
    console.warn("handleEvent: ", event);
    var params = event.getParams();
    for (var name in params) {
      console.warn(name, " = ", params[name]);
    }
  }
  
})