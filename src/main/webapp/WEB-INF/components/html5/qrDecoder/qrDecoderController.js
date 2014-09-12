({
  doInit: function(component, event, helper) {

  },
  
  initScripts: function(component, event, helper) {
    console.warn("qrCodeScannerController.initScripts");

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
      console.warn("loaded jsqrcode - _qr: ", _qr);

    });
  },
  
  handleAddImage: function(component, event, helper) {
    var photo = event.getParams();
    helper.processImage(component, photo);
  }
})