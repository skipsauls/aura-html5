({
  handleQRCode: function(component, event, helper) {
    var params = event.getParams();
    var qrCode = params.qrcode;
    // Do something with the QR Code
    alert("QR Code: " + qrCode);
  }
})