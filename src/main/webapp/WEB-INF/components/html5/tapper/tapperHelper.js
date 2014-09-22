({
  render: function(component) {
    console.warn("tapperHelper.render");
    var data = component.get("v.data");
    console.warn("data: ", data);
    
    console.warn("1");
    var canvas = component.find("canvas").getElement();
    var ctx = canvas.getContext("2d");
    data.canvas = canvas;

    ctx.strokeStyle = "#000000";
    ctx.strokeRect(10, 10, 100, 100);
  }
})