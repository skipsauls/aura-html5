({
  initScripts: function(component, event, helper) {

    requirejs.config({
      baseUrl: "/resource/",
      paths: {
        qrcodejs: "/resource/qrcodejs/qrcode"
      }
    });

    requirejs([
      "qrcodejs"
    ], function(_qr) {
      // Encode the default value
      var value = component.get("v.textValue");
      helper.encode(component, value);
    });
  },

  encode: function(component, event, helper) {
    var textValue = component.get("v.textValue");
    var output = component.find("output");
    var qrCode = component.get("v.qrCode");
    if (qrCode) {
      qrCode.makeCode(textValue);
    } else {
      qrCode = new QRCode(output.getElement(), textValue);
      component.setValue("v.qrCode", qrCode);
    }
  },

  fireDecode: function(component, event, helper) {
    // Need to make sure this is robust...
    var output = component.find("output").getElement();
    var img = output.getElementsByTagName("img")[0];
    console.warn("img: ", img);
    var decodeImageEvent = $A.get("e.html5:qrDecodeImage");
    console.warn("decodeImageEvent: ", decodeImageEvent);
    decodeImageEvent.setParams({
      dataURL: img.src
    }).fire();
  }

})