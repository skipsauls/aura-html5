({
  setup: function(component) {
    
  },
  
  handleChangeValue: function(component, event, helper) {
    var value = event.target.value;
    console.warn("value: ", value);
    //component.set("v.value", value);
    //helper.setLabelPosition(component);
  }  
})