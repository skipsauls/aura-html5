({
  doInit: function(component, evt, helper) {
    var location = $A.historyService.get().token;
    location = location === "" ? "/" : location;
  }
});