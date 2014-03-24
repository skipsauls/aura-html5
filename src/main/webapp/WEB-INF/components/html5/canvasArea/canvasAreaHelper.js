({
  executeCanvasCommand: function(component, params) {
    //console.warn("executeCanvasCommand: ", params);
    var ctx = component.find("paint_area").getElement().getContext("2d");
    if (params.attr && params.value) {
      ctx[params.attr] = params.value;
    }
    if (params.api && params.args) {
      try {
        var exec = "ctx." + params.api + "(" + params.args.toString() + ")";
        //console.warn("exec: ", exec);
        eval(exec);
      } catch (e) {
        //console.warn("Exception: ", e);
      }
      //ctx[params.api]
    }
    /*
    ctx[params.api]
    ctx.fillStyle = '#cc3300';
    ctx.fillRect(0,0,200,200);
    */
  },
  
  getMousePos: function(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  },
  
  handleMouseMove: function(component, canvas, event) {
    console.warn("handleMouseMove");
    var pos = this.getMousePos(canvas, event);
    console.warn("pos: ", pos);
    //foo = component;
    bar = event;
  },
  
  setup: function(component) {
    var canvas = component.find("paint_area").getElement();
    var ctx = canvas.getContext("2d");
    var self = this;
    canvas.addEventListener('mousemove', function(evt) {
      self.handleMouseMove(component, canvas, evt);
    });
  }
});
