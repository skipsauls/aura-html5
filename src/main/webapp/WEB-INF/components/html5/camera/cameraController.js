({
  doInit: function(component, event, helper) {
    /*
     *  Create unique ID attribute for camera
     *  Necessary due to the use of the "for" attribute on the label
     *  that is being used as a proxy for the input element.
     */
    
    var cameraId = "camera" + Date.now();
    component.setValue("v.cameraId", cameraId);
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