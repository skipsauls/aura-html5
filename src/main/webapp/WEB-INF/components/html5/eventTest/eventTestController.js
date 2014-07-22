({
    init: function(component, event, helper) {
        setTimeout(function() {
            helper.init(component, event);
        }, 10);
    },
    
    selectEventDef: function(component, event, helper) {
        var select = component.find("eventSelect").getElement();
        var qualifiedName = select.value;
        helper.selectEventDef(component, qualifiedName);
        helper.handleValueChange(component, event);
    },
    
    fireEvent: function(component, event, helper) {
        helper.fireEvent(component, event);
    },
    
    handleEvent: function(component, event, helper) {
        helper.handleEvent(component, event);
    },
    
    handleValueChange: function(component, event, helper) {
        helper.handleValueChange(component, event);
    },
    
    // Simple tabs
    selectTab: function(component, event, helper) {
        var target = event.getSource ? event.getSource().getElement() : event.target;
        var tab = $A.util.getDataAttribute(target, "tab");
        var tabs = document.getElementsByClassName("tab");
        for (var i = 0; i < tabs.length; i++) {
            $A.util.removeClass(tabs[i], "current");
        }
        $A.util.addClass(target, "current");
        
        var tabContent = component.find(tab);
        var tabContents = document.getElementsByClassName("tab-content");
        for (var i = 0; i < tabContents.length; i++) {
            $A.util.removeClass(tabContents[i], "current");
        }
        $A.util.addClass(tabContent.getElement(), "current");
    },
    
    copyToClipboard: function(component, event, helper) {
        var target = event.getSource ? event.getSource().getElement() : event.target;
        var tab = $A.util.getDataAttribute(target, "tab-content");
        var tabContent = component.find(tab).getElement();
        var text = tabContent.innerText;
        window.prompt("Use Ctrl/Cmd-C to Copy to Clipboard", text);
    }
    
})