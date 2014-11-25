({
  render: function(component, helper) {
    var ret = this.superRender();
    helper.init(component, event);
    return ret;
  }

})