({
  initScripts: function(component, event, helper) {
    helper.initScripts(component);
  },

  init: function(component, event, helper) {
    helper.initScripts(component);
  },

  encode: function(component, event, helper) {
    var textValue = component.get("v.textValue");
    var output = component.find("output");
    var qrCode = component.get("v.qrCode");
    if (qrCode) {
      qrCode.makeCode(textValue);
    } else {
      qrCode = new QRCode(output.getElement(), textValue);
      component.set("v.qrCode", qrCode);
    }
  },

  fireDecode: function(component, event, helper) {
    // Need to make sure this is robust...
    var output = component.find("output").getElement();
    var img = output.getElementsByTagName("img")[0];
    var decodeImageEvent = $A.get("e.html5:qrDecodeImage");
    decodeImageEvent.setParams({
      dataURL: img.src
    }).fire();
  }

})