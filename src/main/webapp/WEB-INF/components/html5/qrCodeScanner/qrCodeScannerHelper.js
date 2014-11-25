({
  process: function(component, img) {
    console.warn("qrCodeScannerHelper.process");
    //var canvas = component.find("preview").getElement();
    //var ctx = canvas.getContext("2d");
    
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    console.warn("canvas: ", canvas);
    ctx.drawImage(img, 0, 0, img.width, img.height);
    
    var result = null;
    var maxDim = Math.max(canvas.width, canvas.height);
    console.warn("maxDim: ", maxDim);
    //var preview = component.find("preview").getElement();
    //var pctx = preview.getContext("2d");
    var buffer = document.createElement("canvas");
    var bctx = buffer.getContext("2d");
    buffer.width = maxDim;
    buffer.height = maxDim;
    qrcode.width = buffer.width;
    qrcode.height = buffer.height;
    var angle = 0;
    var imageData = ctx.getImageData(0, 0, buffer.width, buffer.height);
    qrcode.imagedata = ctx.getImageData(0, 0, qrcode.width, qrcode.height);
    var done = false;
    var count = 0;
    while (!done && angle < 360) {
      try {
        result = qrcode.process(ctx);
        console.warn("result: ", result);
        done = true;
      } catch (e) {
        //console.warn("e: ", e);
        bctx.clearRect(0, 0, buffer.width, buffer.height);
        //console.warn("angle: ", angle);
        bctx.save();
        bctx.translate((canvas.width / 2), (canvas.height / 2));
        bctx.rotate(angle * (Math.PI / 180));
        //bctx.translate(-(buffer.width / 2), -(buffer.height / 2));
        //bctx.putImageData(imageData, 0, 0);
        bctx.drawImage(canvas, -(canvas.width / 2), -(canvas.height / 2));//, canvas.width, canvas.height);
        //bctx.clearRect(0, 0, canvas.width, canvas.height);
        bctx.restore();
        angle += 1;
        qrcode.imagedata = bctx.getImageData(0, 0, qrcode.width, qrcode.height);
        
        //pctx.clearRect(0, 0, preview.width, preview.height);
        //pctx.drawImage(buffer, 0, 0, canvas.width, canvas.height);
        //pctx.fillRect(0, 0, 10, 10);
      }
      count++;
    }
    console.warn("----> result: ", result);
    if (result) {
      component.set("v.code", result);
    } else {
      component.set("v.code", "N/A");
    }
  },
  
  /*
   * Adapted from http://davidwalsh.name/browser-camera Thanks Dave Walsh!
   */
    
  previewPhoto: function(component, photo) {
    
    var self = this;
    var multiple = component.get("v.multiple");
    var preview = component.find("preview").getElement();
    var img = document.createElement("img");
    var item = document.createElement("li");
    
    item.appendChild(img);
    img.onload = function() {
      //preview.appendChild(item);
      self.process(component, img);
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
          
          video.addEventListener("play", function() {
            
          });
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