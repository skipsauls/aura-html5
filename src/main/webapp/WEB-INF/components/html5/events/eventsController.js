({
  init: function(component, event, helper) {
    // helper.init(component, event);
  },

  handleValueChange: function(component, event, helper) {
    console.warn("handleValueChange: ", event);
  },

  doChangeValue: function(component, event, helper) {
    console.warn("doChangeValue");
    component.setValue("v.value", Date.now());
  },

  doIncrement: function(component, event, helper) {
    console.warn("doIncrement");
    var index = component.get("v.index");
    component.setValue("v.index", ++index);
  },

  doFireChangeValue: function(component, event, helper) {
    console.warn("doFireChangeValue");
    foo = component;
    var valueChangeEvent = $A.get("e.aura:valueChange");
    bar = valueChangeEvent;
    console.warn("valueChangeEvent: ", valueChangeEvent);
    params = {
      value: "value",
      index: null
    }
    valueChangeEvent.setParams(params);
    console.warn("1");
    valueChangeEvent.fire();
    console.warn("2");
  },

})