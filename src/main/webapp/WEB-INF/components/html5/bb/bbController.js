({

  
  doInit: function(component, event, helper) {
    console.log("bbController.init: ", event);
    var params = event.getParams();
    var app = params.app;
    console.warn("app: ", app);
    var el = params.el;
    console.warn("el: ", el);
    // Our overall **AppView** is the top-level piece of UI.
    app.AppView = Backbone.View.extend({
    
      // Bind to the component element
      el: el,
    
      // Delegated events, TBD...
      events: {
        'click .testBB': 'testBB'
      },
    
      // At initialization bind to relevant elements
      initialize: function() {
        console.warn("bbController app.AppView.initialize");
      },
      
      testBB: function(evt) {
        console.warn("testBB clicked: ", evt);
      }
          
    });
    
    new app.AppView();
  }

})