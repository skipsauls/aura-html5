({
  doInit: function(component, event, helper) {
    helper.init(component, event);
  },
  
  start: function(component, event, helper) {
    helper.startAnimation(component, event);
  },
  
  stop: function(component, event, helper) {
    helper.stopAnimation(component, event);
  },
  
  toggleRotation: function(component, event, helper) {
    var value = component.find("toggleRotation").getElement().checked;
    helper.toggleRotation(component, value);
  },
  
  toggleScaling: function(component, event, helper) {
    var value = component.find("toggleScaling").getElement().checked;
    helper.toggleScaling(component, value);
  },
  
  setScale: function(component, event, helper) {
    console.warn("setScale: ", component, event.target.value);
  },
  
  setAngle: function(component, event, helper) {
    
  }
  
})
