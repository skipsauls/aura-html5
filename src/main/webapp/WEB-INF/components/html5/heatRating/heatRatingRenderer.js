({
  render: function(component, helper) {
    var ret = this.superRender();
    helper.setup(component);
    return ret;
  },
  
  afterRender: function(component, helper) {
    this.superAfterRender();
    helper.setLabelPosition(component);
  }
  
})