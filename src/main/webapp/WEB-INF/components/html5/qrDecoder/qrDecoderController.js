({
  initScripts: function(component, event, helper) {
    requirejs.config({
      baseUrl: "/resource/",
      paths: {
        jsqrcode: "/resource/jsqrcode/jsqrcode"
      }
    });

    requirejs([
      "jsqrcode"
    ], function(_qr) {
      // Anything to do?
    });
  },

  handleAddImage: function(component, event, helper) {
    var params = event.getParams();
    helper.processImage(component, params.dataURL);
  },

  handleDecodeImage: function(component, event, helper) {
    var params = event.getParams();
    helper.processImage(component, params.dataURL);
  },

  handleQRCodeDecoded: function(component, event, helper) {
    // Do nothing
  }
})