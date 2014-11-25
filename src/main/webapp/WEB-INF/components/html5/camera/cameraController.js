({
  doInit: function(component, event, helper) {
    /*
     * Create unique ID attribute for camera Necessary due to the use of the "for" attribute on the label that is being used as a proxy for the input element.
     */
    var cameraId = "camera" + Date.now();
    component.set("v.cameraId", cameraId);

    /*
     * Check for WebRTC support This will determine which controls and features are available
     */
    navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

    component.set("v.webRTC", typeof navigator.getUserMedia !== "undefined");
  },

  snapPhoto: function(component, event, helper) {
    helper.snapPhoto(component, event);
  },

  enableCamera: function(component, event, helper) {
    helper.enableCamera(component, event);
  },

  addPhoto: function(component, event, helper) {
    helper.addPhoto(component, event);
  }
})