({
  /*
   * Adapted from http://davidwalsh.name/browser-camera Thanks Dave Walsh!
   */
  toggleWebcam: function(component, event) {

  },

  snapPhoto: function(component, event) {

  },
  
  previewPhoto: function(component, photo) {
    var spriteCommandEvent = $A.get("e.html5:spriteCommand");
    console.warn("spriteCommandEvent: ", spriteCommandEvent);
    
    var multiple = component.get("v.multiple");
    var preview = component.find("preview").getElement();
    var img = document.createElement("img");
    var item = document.createElement("li");
    item.appendChild(img);
    img.onload = function() {
      photo.width = img.naturalWidth;
      photo.height = img.naturalHeight;
      console.warn("photo: ", photo);
      if (multiple === false) {
        preview.innerHTML = "";
      }
      preview.appendChild(item);
      
      // Fire event to allow others to consume the new image
      var addImageEvent = $A.get("e.html5:addImage");
      if  (addImageEvent) {
        addImageEvent.setParams(photo).fire();  
      }
    }
    img.src = photo.dataURL;
  },
  
  addPhoto: function(component, event) {
    var files = event.target.files;
    var file = null;
    var reader = null;
    var self = this;
    for (var i = 0; i < files.length; i++) {
      file = files[i];
      reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          
          var photo = {
            src: "file",
            name: file.name,
            timestamp: file.lastModifiedDate.getTime(),
            type: file.type,
            size: file.size,
            dataURL: e.target.result
          };
          
          self.previewPhoto(component, photo);
        };
      })(file);
      
      reader.readAsDataURL(file);
    }
  },
  
  /*
   * Based on the excellent blog post by David Walsh:
   * http://davidwalsh.name/browser-camera
   */
  enableCamera: function(component, event) {
    var preview = component.find("preview").getElement();
    
    // Create a video element and append it to the preview
    var video = document.createElement("video");
    video.id = "video";
    video.setAttribute("autoplay", "autoplay");
    video.style.setProperty("width", preview.clientWidth + "px")
    video.style.setProperty("height", preview.clientHeight + "px");

    var item = document.createElement("li");
    item.appendChild(video);

    preview.innerHTML = "";
    
    preview.appendChild(item);

    /*
     *  Keeps track of the current video, stream, etc.
     *  Uses the unique cameraId from the component
     */
    this.cameras = this.cameras || {};
    
    self = this;
    
    navigator.getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);    
    
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        {
           video: true,
           audio: false
        },        
        function(stream) {
          // Hide the camera button and display the shutter button
          var cameraButton = component.find("cameraButton").getElement();
          cameraButton.style.setProperty("display", "none");
          var shutterButton = component.find("shutterButton").getElement();
          shutterButton.style.setProperty("display", "inline-block");

          // Keep track of the video and stream associated with component
          var cameraId = component.get("cameraId");
          self.cameras[cameraId] = {
            video: video,
            stream: stream
          };
          
          var url = window.URL || window.webkitURL;
          video.src = url ? url.createObjectURL(stream) : stream;
          video.play();
        },
        function(error) {
          /* do something */
          console.warn("error: ", error);
        }
     );
    } else {
      console.warn("no camera!!!!");
    }
  },
  
  /*
   * Turn off the camera and clean up
   * Note that the stream must be closed for the camera
   * to be turned off! Otherwise you end up with the light
   * staying on and people thinking you are creepy.
   */
  disableCamera: function(component) {    
    var cameraId = component.get("cameraId");
    var camera = this.cameras[cameraId];
    if (camera) {
      if (camera.video) {
        camera.video.pause();
        delete camera.video;
     }
      if (camera.stream) {
        camera.stream.stop();
        delete camera.stream;
      }
      delete this.cameras[cameraId];
    }
  },
  
  /*
   * Captures the current video image by rendering it into
   * a canvas and sending the details object to preview.
   */
  snapPhoto: function(component, event) {
    var date = new Date();
  
    var preview = component.find("preview").getElement();
    
    // Need better Aura way to find element?
    var video = preview.getElementsByTagName("video")[0];

    // Stop the video to freeze the image
    video.pause();
    
    // Hide the shutter button and display the camera button
    var shutterButton = component.find("shutterButton").getElement();
    shutterButton.style.setProperty("display", "none");
    var cameraButton = component.find("cameraButton").getElement();
    cameraButton.style.setProperty("display", "inline-block");

    // Create a canvas to draw the video into
    var canvas = document.createElement("canvas");
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    var context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get the PNG data to use for the preview
    var dataURL = canvas.toDataURL();
    
    var photo = {
      src: video.src,
      name: "Capture_" + date.toISOString(),
      timestamp: date.getTime(),
      type: "image/png",
      width: video.videoWidth,
      height: video.videoHeight,
      dataURL: dataURL 
    };

    // Remove the video and it's parent, and clean them up
    var item = video.parentElement;
    item.remove();
    delete item;

    // Clean up the temporary canvas
    canvas.remove();
    delete canvas;
    
    this.disableCamera(component);
    
    this.previewPhoto(component, photo);
    
  }
  
})