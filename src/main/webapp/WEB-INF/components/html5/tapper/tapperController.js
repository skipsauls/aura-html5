({
  doInit: function(component, event, helper) {
    console.warn("tapperController.doInit");
    //helper.doInit(component, event);
    var data = component.get("v.data");
    console.warn("data: ", data);
    if (typeof data === "undefined") {
      data = {};
      console.warn("data: ", data);
      component.set("v.data", data);
      console.warn("data: ", data);
    }
    
  }
})