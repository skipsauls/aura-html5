({
  doInit: function(component, event, helper) {
    setTimeout(function() {
      helper.init(component, event);
    });
  },

  start: function(component, event, helper) {
    helper.start(component, event);
  },

  resume: function(component, event, helper) {
    helper.resume(component, event);
  },

  help: function(component, event, helper) {
    helper.help(component, event);
  },

  options: function(component, event, helper) {
    helper.options(component, event);
  },

  reset: function(component, event, helper) {
    helper.reset(component, event);
  },

  rotate: function(component, event, helper) {
    helper.rotate(component, event);
  },

  refresh: function(component, event, helper) {
    helper.refresh(component, event);
  },

  addValue: function(component, event, helper) {
    helper.addValue(component);
  },
  
  onTouchEvent: function(component, event, helper) {
    helper.onTouchEvent(component, event);
  },
  
  onMouseEvent: function(component, event, helper) {
    helper.onMouseEvent(component, event);
  },
  
  onKeyEvent: function(component, event, helper) {
    helper.onKeyEvent(component, event);
  },

  handleEvent: function(component, event, helper) {
    helper.handleEvent(component, event);
  }
})