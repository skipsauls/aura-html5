({

  detectVerticalSquash: function(img) {
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = ih;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var data = ctx.getImageData(0, 0, 1, ih).data;
    // search image edge pixel position in case it is squashed vertically.
    var sy = 0;
    var ey = ih;
    var py = ih;
    while (py > sy) {
      var alpha = data[(py - 1) * 4 + 3];
      if (alpha === 0) {
        ey = py;
      } else {
        sy = py;
      }
      py = (ey + sy) >> 1;
    }
    var ratio = (py / ih);
    return (ratio === 0) ? 1 : ratio;
  },

  drawImageIOSFix: function(canvas, ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
    var rotation = undefined;
    if (typeof window.orientation !== "undefined") {
      rotation = window.orientation + 90;
    }
    var vertSquashRatio = this.detectVerticalSquash(img);
    // Works only if whole image is displayed:
    // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
    // The following works correct also when only a part of the image is displayed:
    if (typeof rotation !== "undefined") {
      ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio, sw * vertSquashRatio, sh * vertSquashRatio, dx, dy, dw, dh);
      var buffer = document.createElement('canvas');
      buffer.width = dw;
      buffer.height = dh;
      var bctx = buffer.getContext('2d');
      bctx.save();
      bctx.translate(buffer.width / 2, buffer.height / 2);
      bctx.rotate(rotation * Math.PI / 180)
      bctx.drawImage(canvas, -(dw / 2), -(dh / 2), dw, dh);
      bctx.restore();
      ctx.clearRect(0, 0, dw, dh);
      ctx.drawImage(buffer, 0, 0);
    } else {
      ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio, sw * vertSquashRatio, sh * vertSquashRatio, dx, dy, dw, dh);
    }

  },

  scaleImage: function(srcwidth, srcheight, targetwidth, targetheight, fLetterBox) {

    var result = {
      width: 0,
      height: 0,
      fScaleToTargetWidth: true
    };

    if ((srcwidth <= 0) || (srcheight <= 0) || (targetwidth <= 0) || (targetheight <= 0)) {
      return result;
    }

    // scale to the target width
    var scaleX1 = targetwidth;
    var scaleY1 = (srcheight * targetwidth) / srcwidth;

    // scale to the target height
    var scaleX2 = (srcwidth * targetheight) / srcheight;
    var scaleY2 = targetheight;

    // now figure out which one we should use
    var fScaleOnWidth = (scaleX2 > targetwidth);
    if (fScaleOnWidth) {
      fScaleOnWidth = fLetterBox;
    } else {
      fScaleOnWidth = !fLetterBox;
    }

    if (fScaleOnWidth) {
      result.width = Math.floor(scaleX1);
      result.height = Math.floor(scaleY1);
      result.fScaleToTargetWidth = true;
    } else {
      result.width = Math.floor(scaleX2);
      result.height = Math.floor(scaleY2);
      result.fScaleToTargetWidth = false;
    }
    result.targetleft = Math.floor((targetwidth - result.width) / 2);
    result.targettop = Math.floor((targetheight - result.height) / 2);

    return result;
  },

  /*
   * Adapted from http://davidwalsh.name/browser-camera Thanks Dave Walsh!
   */

  previewPhoto: function(component, photo) {

    var multiple = component.get("v.multiple");
    var preview = component.find("preview").getElement();
    var img = document.createElement("img");
    var item = document.createElement("li");
    // item.appendChild(img);
    preview.appendChild(item);
    var self = this;

    var imageObj = new Image();
    imageObj.onload = function() {

      var maxSize = 256;

      var ratio = (imageObj.width > maxSize || imageObj.height > maxSize) ? Math.min(maxSize / imageObj.width, maxSize / imageObj.height) : 1;

      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");

      canvas.width = imageObj.width * ratio;
      canvas.height = imageObj.height * ratio;

      var ratio = Math.min(canvas.width / imageObj.width, canvas.height / imageObj.height);
      var width = Math.round(imageObj.width * ratio);
      var height = Math.round(imageObj.height * ratio);

      var result = self.scaleImage(imageObj.width, imageObj.height, canvas.width, canvas.height, false);

      self.drawImageIOSFix(canvas, ctx, this, 0, 0, imageObj.width, imageObj.height, 0, 0, result.width, result.height);

      photo.dataURL = canvas.toDataURL();

      var img = document.createElement("img");
      img.src = photo.dataURL;
      item.appendChild(img);

      var addImageEvent = $A.get("e.html5:addImage");

      if (addImageEvent) {
        addImageEvent.setParams(photo);
        addImageEvent.fire();
      }
    };
    imageObj.src = photo.dataURL;
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
   * Based on the excellent blog post by David Walsh: http://davidwalsh.name/browser-camera
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
     * Keeps track of the current video, stream, etc. Uses the unique cameraId from the component
     */
    this.cameras = this.cameras || {};

    self = this;

    navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

    if (navigator.getUserMedia) {
      navigator.getUserMedia({
        video: true,
        audio: false
      }, function(stream) {
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
      }, function(error) {
        /* do something */
        console.warn("error: ", error);
      });
    } else {
      console.warn("no camera!!!!");
    }
  },

  /*
   * Turn off the camera and clean up Note that the stream must be closed for the camera to be turned off! Otherwise you end up with the light staying on and
   * people thinking you are creepy.
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
   * Captures the current video image by rendering it into a canvas and sending the details object to preview.
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