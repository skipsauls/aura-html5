({
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