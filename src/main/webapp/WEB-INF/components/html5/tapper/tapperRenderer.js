({
  render: function(component, helper) {
    console.warn("tapperRenderer.render: ", component, helper);
    var ret = this.superRender();
    console.warn("ret: ", ret);
    helper.render(component);
    return ret;
  },

  rerender : function(component, helper) {
    console.warn("tapperRenderer.rerender");
    this.superRerender();
  },

  afterRender: function(component, helper) {
    console.warn("tapperRenderer.afterRender");
    // helper.doInit(component, event);
  }
})