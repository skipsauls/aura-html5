({
  setup: function(component) {
    var container = component.find("container").getElement();
    var label = component.find("label").getElement();
    var self = this;
    window.addEventListener("resize", function(evt) {
      self.setLabelPosition(component);
    }, true);
  },
  
  setLabelPosition: function(component) {
    var container = component.find("container").getElement();
    var label = component.find("label").getElement();
    var value = component.get("v.value");
    var x = container.offsetLeft + (container.offsetWidth / 2) - (label.offsetWidth / 2);
    // Get width of label as percentage of container
    var w = label.offsetWidth / container.offsetWidth;
    // Find center point based on value
    var x = (value / 100) * container.offsetWidth;
    // Subtract 1/2 the label width to center
    x -= label.offsetWidth;
    label.style.left = x + "px";
  }  
})