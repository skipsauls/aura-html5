({
  process: function(component, img) {
    console.warn("qrCodeScannerHelper.process");
    //var canvas = component.find("preview").getElement();
    //var ctx = canvas.getContext("2d");
    
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    console.warn("canvas: ", canvas);
    
    // Need to scale/resize the images if > 1024px, iPhones, etc. break
    // Look on blitz for older samples?
    ctx.drawImage(img, 0, 0, img.width, img.height);
    
    var result = null;
    var maxDim = Math.max(canvas.width, canvas.height);
    console.warn("maxDim: ", maxDim);
    //var preview = component.find("preview").getElement();
    //var pctx = preview.getContext("2d");
    var buffer = document.createElement("canvas");
    var bctx = buffer.getContext("2d");
    buffer.width = maxDim;
    buffer.height = maxDim;
    qrcode.width = buffer.width;
    qrcode.height = buffer.height;
    var angle = 0;
    var imageData = ctx.getImageData(0, 0, buffer.width, buffer.height);
    qrcode.imagedata = ctx.getImageData(0, 0, qrcode.width, qrcode.height);
    var done = false;
    var count = 0;
    while (!done && angle < 360) {
      try {
        result = qrcode.process(ctx);
        console.warn("result: ", result);
        done = true;
      } catch (e) {
        //console.warn("e: ", e);
        bctx.clearRect(0, 0, buffer.width, buffer.height);
        //console.warn("angle: ", angle);
        bctx.save();
        bctx.translate((canvas.width / 2), (canvas.height / 2));
        bctx.rotate(angle * (Math.PI / 180));
        //bctx.translate(-(buffer.width / 2), -(buffer.height / 2));
        //bctx.putImageData(imageData, 0, 0);
        bctx.drawImage(canvas, -(canvas.width / 2), -(canvas.height / 2));//, canvas.width, canvas.height);
        //bctx.clearRect(0, 0, canvas.width, canvas.height);
        bctx.restore();
        angle += 1;
        qrcode.imagedata = bctx.getImageData(0, 0, qrcode.width, qrcode.height);
        
        //pctx.clearRect(0, 0, preview.width, preview.height);
        //pctx.drawImage(buffer, 0, 0, canvas.width, canvas.height);
        //pctx.fillRect(0, 0, 10, 10);
      }
      count++;
    }
    console.warn("----> result: ", result);
    if (result) {
      component.setValue("v.code", result);
    } else {
      component.setValue("v.code", "N/A");
    }
  },
  
  processImage: function(component, photo) {
    
    var self = this;
    var img = document.createElement("img");
    
    img.onload = function() {
      //preview.appendChild(item);
      self.process(component, img);
    }
    img.src = photo.dataURL;
  }
  
})