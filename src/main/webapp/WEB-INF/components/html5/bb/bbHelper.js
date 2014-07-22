({

  
  appInit: function(component, event) {
    console.log("bbHelper.appInit");
    
    var app = app || {};

    // Our overall **AppView** is the top-level piece of UI.
    app.AppView = Backbone.View.extend({
    
      // Bind to the component element
      //el: component.getElement(),
      el: component.find("body").getElement(),
    
      // Delegated events, TBD...
      events: {
        'click .testBB': 'testBB'
      },
    
      // At initialization bind to relevant elements
      initialize: function() {
        console.warn("initialize");
      },
      
      testBB: function(evt) {
        console.warn("testBB clicked: ", evt);
      }
    
    });
    
    new app.AppView();
  }


})