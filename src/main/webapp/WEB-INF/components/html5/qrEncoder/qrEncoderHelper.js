({
  ready: false,

  initScripts: function(component) {
    if (this.ready === false && typeof requirejs !== "undefined") {
      var self = this;
      requirejs.config({
        baseUrl: "/resource/",
        paths: {
          qrcodejs: "/resource/qrcodejs/qrcode"
        }
      });

      requirejs([
        "qrcodejs"
      ], function(_qr) {
        // Anything to do?
        self.ready = true;
        var value = component.get("v.textValue");
        self.encode(component, value);
      });
    }
  },

  encode: function(component, value) {
    if (typeof QRCode === "undefined") {
      return;
    }
    var qrCode = component.get("v.qrCode");
    if (!qrCode) {
      var output = component.find("output");
      qrCode = new QRCode(output.getElement(), value);
      component.setValue("v.qrCode", qrCode);
    }
    qrCode.makeCode(value);
  }
})