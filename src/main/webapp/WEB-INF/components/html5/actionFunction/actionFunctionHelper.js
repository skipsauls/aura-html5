({
  getParams: function(component, args) {
    var body = component.get("v.body");
    var cmp = null;
    var params = {};
    for (var i = 0; i < body.length; i++) {
      cmp = body[i];
      if (cmp.isInstanceOf("html5:actionParam")) {
        // TODO - Type checking & casting/coercing!
        console.warn(cmp.getValue("v.name") + " param type " + typeof cmp.get("v.value"));
        console.warn(cmp.getValue("v.name") + " args type " + typeof args[i]);
        params[cmp.get("v.name")] = "" + (typeof args[i] !== "undefined" ? args[i] : cmp.get("v.value"));
      }
    }
    return params;
  },
  
  fireAction: function(component, params, callback) {
    console.warn("actionFunctionHelper.fireAction");

    var action = component.get("v.action");
    action.setParams(params);
    action.setCallback(this, function(a) {
      var r = a.getReturnValue();
      console.warn("r: ", r)
      if (callback && typeof callback === "function") {
        callback(r);
      }
      
      var evt = component.getEvent("actionResult");
      console.warn("evt: ", evt);
      evt.setParams({result: r});
      evt.fire();
    });
    $A.enqueueAction(action); 
  },
  
  createGlobalFunction: function(component) {
    console.warn("actionFunctionHelper.createGlobalFunction");
    var name = component.get("v.name");
    console.warn("name: ", name);
    var self = this;
    window[name] = function() {
      console.warn(name + " called");
      console.warn("component: ", component);
      console.warn("arguments: ", arguments);
      var args = [];
      var callback = null;
      for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === "function") {
          callback = arguments[i];
        } else {
          args.push(arguments[i]);
        }
      }

      var params = self.getParams(component, args);
      console.warn("params: ", params);
      $A.run(function() {
        self.fireAction(component, params, callback);
      });
    }
  },
  
  init: function(component) {
    console.warn("actionFunctionHelper.init");
    this.createGlobalFunction(component);
    
    var body = component.get("v.body");
    console.warn("body: ", body);
    var cmp = null;
    for (var i = 0; i < body.length; i++) {
      cmp = body[i];
      if (cmp.isInstanceOf("html5:actionParam")) {
        console.warn(cmp.get("v.name") + " : " + cmp.get("v.value"));
      }
    }
  }
})
