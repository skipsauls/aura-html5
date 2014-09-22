({
  process: function(component, img) {

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0, img.width, img.height);

    var result = null;
    var maxDim = Math.max(canvas.width, canvas.height);

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
    while (!done && angle < 360) {
      t1 = Date.now();
      try {
        result = qrcode.process(ctx);
        done = true;
      } catch (e) {
        angle += 1;
        bctx.clearRect(0, 0, buffer.width, buffer.height);
        bctx.save();
        bctx.translate((canvas.width / 2), (canvas.height / 2));
        bctx.rotate(angle * (Math.PI / 180));
        bctx.drawImage(canvas, -(canvas.width / 2), -(canvas.height / 2));// , canvas.width, canvas.height);
        bctx.restore();
        qrcode.imagedata = bctx.getImageData(0, 0, qrcode.width, qrcode.height);
      }
    }

    if (result) {
      component.set("v.qrCode", result);
      var evt = $A.get("e.aotp1:qrCodeDecoded");
      if (evt) {
        evt.setParams({
          "qrcode": result
        });
        evt.fire();
      }
    }
  },

  processImage: function(component, dataURL) {

    var self = this;
    var imageObj = new Image();
    imageObj.onload = function() {
      self.process(component, imageObj);
    }
    imageObj.src = dataURL;
  }
})