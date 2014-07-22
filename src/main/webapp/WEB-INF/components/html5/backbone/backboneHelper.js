({

  
  appInit: function(component, event) {
    console.log("backboneHelper.appInit");
    
    var _body = component.getElement();
    //var _content = component.find("content").getElement();
    console.warn("backboneHelper.appInit _body: ", _body);
    //console.warn("backboneHelper.appInit _content: ", _content);
    
    /*
    var _delegateEvents = Backbone.View.prototype.delegateEvents;
    console.warn("_delegateEvents: ", _delegateEvents);
    Backbone.View.prototype.delegateEvents = function(events) {
      console.warn("Backbone.View.prototype.delegateEvents called");
      _delegateEvents(events);
    }
    */
    
    var app = app || {};

    /*
    var backboneInitEvent = $A.get("e.html5:backboneInit");
    backboneInitEvent.setParams({app: app});
    backboneInitEvent.fire();
     */

    var el = component.find("content").getElement();

    // Our overall **AppView** is the top-level piece of UI.
    app._baseAppView = Backbone.View.extend({
    
      // Bind to the component element
      el: el,
    
      // Delegated events, TBD...
      events: {
        'click .testBackbone': 'testBackbone'
      },
    
      // At initialization bind to relevant elements
      initialize: function() {
        console.warn("initialize");
        var backboneInitEvent = $A.get("e.html5:backboneInit");
        backboneInitEvent.setParams({app: app, el: el});
        backboneInitEvent.fire();
      },
      
      testBackbone: function(evt) {
        console.warn("testBackbone: ", evt);
      }    
    });
    
    new app._baseAppView();
  }


})