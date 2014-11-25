({
  doInit: function(component, event, helper) {
    // Load the components that are in the region
  },
  
  testAddToHeader: function(component, event, helper) {
    helper.testAddComponent(component, "header");
  },
  
  testAddToMain: function(component, event, helper) {
    helper.testAddComponent(component, "body");
  }

})