({

  require: function(component, type, url) {
    
    var globalId = component.getGlobalId();
    
    this.loadedResources = this.loadedResources || {};

    this.loadedResources[globalId] = this.loadedResources[globalId] || {
      "js": {},
      "css": {}
    };
    if (this.loadedResources[globalId][type][url] === true) {
      return;
    } else {
      this.loadedResources[globalId][type][url] = false;
    }

    var self = this;

    if (type === "js" || type === "script") {
      var match = false;
      var scripts = document.getElementsByTagName("script");
      for ( var s in scripts) {
        if (url === scripts[s].src) {
          match = true;
        }
      }
      if (!match) {
        self.resourceCount++;
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.onload = function(e) {
          self.loaded(component, type, url);
        }
        document.body.appendChild(script);
      } else {
        console.warn("MATCH FOR: ", url);
      }
    } else if (type === "css" || type === "stylesheet") {
      var match = false;
      var links = document.getElementsByTagName("link");
      for ( var l in links) {
        if (url === links[l].href) {
          match = true;
        }
      }
      if (!match) {
        self.resourceCount++;
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        link.onload = function(e) {
          self.loaded(component, type, url);
        }
        document.head.appendChild(link);
      } else {
        console.warn("MATCH FOR: ", url);
      }
    }
  },

  loaded: function(component, type, url) {
    console.warn("this.resourceCount: ", this.resourceCount);
    var globalId = component.getGlobalId();
    this.loadedResources[globalId][type][url] = true;
    this.resourceCount--;
    if (this.resourceCount === 0) {
      console.warn("READY");
      // this.initMap(component)
    }
  },

  loadResources: function(component) {
    var scripts = component.get("v.scripts");
    scripts = typeof scripts === "array" ? scripts : [scripts];
    var styles = component.get("v.styles");
    styles = typeof styles === "array" ? styles : [styles];
    var resources = {
      js: scripts,
      css: styles
    };
    
    this.resourceCount = this.resourceCount || 0;
    for (var i = 0; i < resources.css.length; i++) {
      this.require(component, "css", resources.css[i]);
    }
    for (var i = 0; i < resources.js.length; i++) {
      this.require(component, "js", resources.js[i]);
    }
  },

  getMapOptions: function(component) {
    var lat = component.get("v.latitude");
    var lng = component.get("v.longitude");
    var zoom = component.get("v.zoom");
    
    var mapOptions = {
      zoom: zoom, 
      center: new google.maps.LatLng(lat, lng)
    };
    
    return mapOptions;
  },
  
  initMap: function(component) {
    console.warn("mapHelper.initMap: ", google.maps, google.maps.LatLng);
    
    var mapOptions = this.getMapOptions(component);
    var mapEl = component.find("map").getElement();
    var map = new google.maps.Map(mapEl, mapOptions);
    
    // Keep track of the map
    component.setValue("v.map", map);

    console.warn("component.get(\"v.currentMarker\"): ", component.get("v.currentMarker"));
    
    if (component.get("v.currentMarker") === true) {
      this.addMarker(component, mapOptions.center, "Salesforce.com, Inc.");
    }
  },
  
  getCurrentPosition: function(component) {
    if (navigator.geolocation) {
      var self = this;
      navigator.geolocation.getCurrentPosition(function(pos) {
        component.setValue("v.latitude", pos.coords.latitude);
        component.setValue("v.longitude", pos.coords.longitude);
        self.addMarker(component, pos.coords, "Current Location");
      });
    }
  },
  
  addMarker: function(component, position, title) {
    console.warn("addMarker: ", position, typeof position, title);
    var map = component.get("v.map");
    if (map) {
      /*
       * Position object has multiple variants: {latitude: XX.XX, longitude: XX.XX} {latitude: {degrees: XX, minutes: XX, seconds: XX, direction: "N|S"},
       * longitude: {degrees: XX, minutes: XX, seconds: XX, direction: "E|W"}}
       */
      
      var lat = 0;
      var lng = 0;

      var pos = null;
      
      if (position) {
        if (position.latitude && position.longitude) {
          if (typeof position.latitude === "object") {
              lat = this.convertDegreesToDecimal(position.latitude);
              lng = this.convertDegreesToDecimal(position.longitude);
          } else {
            lat = position.latitude;
            lng = position.longitude;
          }
        } else {
          pos = position;
        }
      }
      
      pos = pos || new google.maps.LatLng(lat, lng);
      
      console.warn("pos: ", pos);
      
      var marker = new google.maps.Marker({
        position: pos, 
        map: map, 
        title: title
      });
      var markers = component.get("v.markers");
      markers.push(marker);
    } else {
      console.warning("No map found for ", component.getGlobalId());
    }
    
  },

  // Utility function to convert classic coordinates into decimal
  convertDegreesToDecimal: function(position) {
    
    var decimal = ((position.minutes * 60) + position.seconds) / (60*60);
    var result = position.degrees + decimal
    result = position.direction === "S" || position.direction === "W" ? -result : result;
    return result;    
  },
  
  doInit: function(component, event) {
    console.warn("mapHelper.doInit: ", component, component.getElement(), component.getGlobalId());

    var scripts = component.get("v.scripts");
    console.warn("scripts: ", scripts);
    
    var self = this;
    window.gMapsInitialize = function() {
      console.warn("window.gMapsInitialize");
      self.initMap(component);
    }
    this.loadResources(component);

    setTimeout(function(a, b, c) {
      console.warn(component, component.getElement());
    }, 0);
  }
})
