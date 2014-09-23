({
  initScripts: function(component, event, helper) {
    helper.initScripts(component);
  },

  init: function(component, event, helper) {
    helper.initScripts(component);
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