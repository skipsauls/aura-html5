({
    init: function(component, event) {
        var filterNamespaces = component.get("v.filterNamespaces");
        this.createEventSelect(component, filterNamespaces);
        
    },
    
    getFilteredEventDefs: function(component, filterNamespaces) {

        // Get the names for the events
        // $A.eventService.getRegisteredEvents is not available in prod mode, so use attribute value
    var names = null;        
        if (typeof $A.eventService.getRegisteredEvents !== "undefined") {
          names = $A.eventService.getRegisteredEvents().split(/\n/); 
        } else {
          names = component.get("v.eventNames");
            
        }
        
        var eventDef = null;
        var eventDefs = [];
        var match = false;
        foo = [];
        for (var i = 0; i < names.length; i++) {
            match = false;
            name = names[i];
            foo.push(names[i].replace("markup://", ""));
            if (name && name.length > 0) {
                for (var j = 0; j < filterNamespaces.length; j++) {
                    match = name.indexOf(filterNamespaces[j]) >= 0;
                }
                if (!match) {
                    eventDef = $A.eventService.getEventDef(name);
                    if (eventDef) {
                        eventDefs.push(eventDef);
                    }
                }
                
            }
        }
        return eventDefs;
    },
    
    createEventSelect: function(component, filterNamespaces) {
        var eventDefs = this.getFilteredEventDefs(component, filterNamespaces);
        
        var select = component.find("eventSelect").getElement();
        var option = null;
        option = document.createElement("option");
        option.textContent = "Select an Event";
        option.setAttribute("disabled", "disabled");
        option.setAttribute("selected", "selected");
        select.appendChild(option);
        
        var eventDef = null;
        var eventDefsMap = {};
        var descriptor = null;
        for (var i = 0; i < eventDefs.length; i++) {
            eventDef = eventDefs[i];
            descriptor = eventDef.getDescriptor();
            // Add the eventDef to the map for easy lookup
            eventDefsMap[descriptor.getQualifiedName()] = eventDef;
            option = document.createElement("option");
            option.textContent = descriptor.getNamespace() + ":" + descriptor.getName();
            option.value = descriptor.getQualifiedName();
            select.appendChild(option);
        }
        component.setValue("v.eventDefsMap", eventDefsMap);
        
    },
    
    selectEventDef: function(component, qualifiedName) {
        component.setValue("v.selectedEvent", qualifiedName);
        
        var eventDefsMap = component.getValue("v.eventDefsMap").value;
        var eventDef = eventDefsMap[qualifiedName.toLowerCase()] || eventDefsMap[qualifiedName];;
        var attributeDefs = eventDef.getAttributeDefs();
        var attributes = [];
        var attributeDef = null;
        for (var name in attributeDefs) {
            attributeDef = attributeDefs[name];
            attribute = JSON.parse(JSON.stringify(attributeDef));
            attribute.name = attribute.descriptor;
            attribute.type = attributeDef.typeDefDescriptor.replace("aura://", "");
            attribute.value = null;
            attributes.push(attribute);
        }
        component.setValue("v.eventAttributes", attributes);
        return;
        var attributeDef = null;
        for (var name in attributeDefs) {
            attributeDef = attributeDefs[name];
        }
    },
    
    fireEvent: function(component, event) {
        var selectedEvent = component.get("v.selectedEvent");
        var attributes = component.get("v.eventAttributes");
        var params = {};
        var attribute = undefined;
        var reqCheck = [];
        for (var i = 0; i < attributes.length; i++) {
            attribute = attributes[i];
            value = this.validate(attribute.type, attribute.value);
            if (typeof value !== "undefined") {
              params[attribute.name] = value;
            }
            if (attribute.required === true && value === null) {
                reqCheck.push(attribute.name);
            }
        }
        if (reqCheck.length > 0) {
            alert("Please complete these required fields: " + reqCheck.toString());
        } else { 
            var name = selectedEvent.replace("markup://", "");
            var evt = $A.get("e." + name);
            evt.setParams(params);            
            evt.fire();
        }
    },
    
    validate: function(type, value) {
        var v = undefined;
        if (type === "String") {
            v = typeof value !== "undefined" ? value : undefined;
            v = v ? v : undefined;            
        } else if (type === "Object") {
            v = v ? v : undefined;
        } else {
            try {
                v = JSON.parse(value);
                v = typeof v === type.toLowerCase() ? v : undefined;
            } catch (e) {
                console.error(e);
            }
        }
        
        return v;
    },
    
    handleValueChange: function(component, event) {
        var selectedEvent = component.get("v.selectedEvent");
        var attributes = component.get("v.eventAttributes");
        var params = {};
        var attribute = undefined;
        var value = null;
        var pCount = 0;
        for (var i = 0; i < attributes.length; i++) {
            attribute = attributes[i];
            value = this.validate(attribute.type, attribute.value);
            if (typeof value !== "undefined") {
              params[attribute.name] = value;
                pCount++;
            }
        }
        // Generate the fire event code
        var name = selectedEvent.replace("markup://", "");
        var prettyParams = JSON.stringify(params, undefined, 2);
        var sampleFireEventCode = '';
        sampleFireEventCode += 'var evt = $A.get("e.' + name + '");\n';
        if (pCount > 0) {
          sampleFireEventCode += 'evt.setParams(' + prettyParams + ');\n';
        }
        sampleFireEventCode += 'evt.fire();\n'        
        component.setValue("v.sampleFireEventCode", sampleFireEventCode);
        
        // Generate the handle event code
        var sampleHandleEventCode = '';
        var nameParts = name.split(":");
        var funcName = 'handle';
        for (var i = 0; i < nameParts.length; i++) {
            funcName += nameParts[i].substring(0, 1).toUpperCase() + nameParts[i].substring(1);
        }
        sampleHandleEventCode += funcName + ': function(component, evt, helper) {\n';
        for (var i = 0; i < attributes.length; i++) {
            attribute = attributes[i];
            sampleHandleEventCode += '    var ' + attribute.name + ' = evt.getParam("' + attribute.name + '"); // ' + attribute.type + '\n';
        }
        sampleHandleEventCode += '    // Do something with the parameters...\n';
        sampleHandleEventCode += '}\n';

        component.setValue("v.sampleHandleEventCode", sampleHandleEventCode);
         
    },
    
    handleEvent: function(component, event) {
        console.warn("helper.handleEvent: ", component, event);
    }
    
})