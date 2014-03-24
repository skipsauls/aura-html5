({
  doInit: function(component, event, helper) {

  },

  
  test: function(component, event, helper) {
    
    helper.setup(component);
    
    //var ctx = component.find("paint_area").getElement().getContext("2d");
    //ctx.fillStyle = '#cc3300';
    //ctx.fillRect(0,0,200,200);
    
    var color = "#" + Math.random().toString(16).substr(-6).toUpperCase();
    
    var canvasCommandEvent = $A.get("e.html5:canvasCommand");
    var params = {
      attr: "fillStyle",
      value: [color]
    }
    canvasCommandEvent.setParams(params).fire();
    
    var bounds = {x: 0, y: 0, w: 500, h: 500};
    
    var width = Math.round(Math.random() * (bounds.w / 2));
    var height = Math.round(Math.random() * (bounds.h / 2));
    var x = Math.round(Math.random() * width); 
    var y = Math.round(Math.random() * height); 
    var rect = [x, y, width, height];
    
    canvasCommandEvent = $A.get("e.html5:canvasCommand");
    params = {
      api: "fillRect",
      args: rect
    }
    canvasCommandEvent.setParams(params).fire();
  },
  
  handleCanvasCommand: function(component, event, helper) {
    helper.executeCanvasCommand(component, event.getParams());
  }
  
})


