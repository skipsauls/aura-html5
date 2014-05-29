({
  
  handleApplicationEvent: function(event) {
    console.warn("------------------------------------------------------------");
    console.warn("sinkHelper.handleApplicationEvent: ", event);
    
    var name = event.getName();
    var eventDef = event.getDef();
    var eventAttributeDefs = eventDef.getAttributeDefs();
    
    for (var a in eventAttributeDefs) {
      console.warn("attribute: ", eventAttributeDefs[a]);
    }
    
    var eventDescriptor = eventDef.getDescriptor();
    var params = event.getParams();
    console.warn("event: ", name, eventDef, params);
    console.warn("attributeDefs: ", eventAttributeDefs);
    console.warn("descriptor: ", eventDescriptor);
    
    var namespace = eventDescriptor.getNamespace();
    var name = eventDescriptor.getName();
    var prefix = eventDescriptor.getPrefix();
    var qualifiedName = eventDescriptor.getQualifiedName();
    
    console.warn("namespace: ", namespace);
    console.warn("name: ", name);
    console.warn("prefix: ", prefix);
    console.warn("qualifieName: ", qualifiedName);
    
    
    var srcCmp = event.getSource();
    console.warn("srcCmp: ", srcCmp);
    if (srcCmp) {
      var srcDef = srcCmp.getDef();
      var srcDescriptor = srcDef.getDescriptor();
      console.warn("source: ", srcDescriptor.getNamespace() + ":" + srcDescriptor.getName());    
    }
  },
  
  setupApplicationEvents: function(component, event) {
    var index = $A.eventService.getRegisteredEvents().split(/\n/g);
    var evt = null;
    var globalId = component.getGlobalId();
    config = {
      globalId: globalId,
      handler: this.handleApplicationEvent,
      event: null
    };
    for (var i = 0; i < index.length; i++) {
      evt = index[i];
      console.warn("evt: ", evt);
      config.event = evt;
      $A.eventService.addHandler(config);
    }
  },
  
  setupComponentEvents: function(component, event) {
    var index = $A.componentService.getIndex().split(/\n/g);
    var globalId = null;
    var cmp = null;
    for (var i = 0; i < index.length; i++) {
      globalId = index[i].split(" :")[0].trim();

      cmp = $A.getCmp(globalId);
      if (cmp) {

        componentDef = cmp.getDef();
        //console.warn("componentDef: ", componentDef);
        descriptor = componentDef.getDescriptor();
        //console.warn("descriptor: ", descriptor);

        var name = descriptor.getNamespace() + ":" + descriptor.getName();
        var allEvents = componentDef.getAllEvents();
        var cmpHandlerDefs = componentDef.getCmpHandlerDefs();
        var appHandlerDefs = componentDef.getAppHandlerDefs();
        
        // Keep from duplicating...
        this.cmpEventHandlers = this.cmpEventHandlers || {};
        
        if (allEvents && allEvents.length > 0) {

          var eventHandlers = this.cmpEventHandlers[globalId] || {};
          
          for (var e = 0; e < allEvents.length; e++) {
            eventName = allEvents[e];
            if (typeof eventHandlers[eventName] === "undefined") {
              cmp.addHandler(eventName, component, "c.handleEvent");
              eventHandlers[eventName] = eventName;
            }
          }
          
          this.cmpEventHandlers[globalId] = eventHandlers;
        }

        /*
        if (cmpHandlerDefs && cmpHandlerDefs.length > 0) {
          console.warn(name + " has cmpHandlers");
          console.warn(cmpHandlerDefs);          
        }
        if (appHandlerDefs && appHandlerDefs.length > 0) {
          console.warn(name + " has appHandlers");
          console.warn(appHandlerDefs);          
        }
        */
        
      }
    }

  },

  doSetup: function(component, event) {
    this.setupComponentEvents(component, event);
    this.setupApplicationEvents(component, event);
    
  },

  handleEvent: function(component, event) {
    console.warn("sinkHelper.handleEvent: ", component, event);
    foo = component;
    bar = event;
    
    var srcCmp = event.getSource();
    var srcDef = srcCmp.getDef();
    var srcDescriptor = srcDef.getDescriptor();
    console.warn("source: ", srcDescriptor.getNamespace() + ":" + srcDescriptor.getName());

    // Can the event be mapped back to all that consume it?
    // If so, could illustrate the events...
    
  }
})