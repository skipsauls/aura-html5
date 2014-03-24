({

  init: function(component, event) {

    // Internal structure to keep track of the sounds
    this.soundDefs = this.soundDefs || {};
    var name = component.get("v.name");
    var def = this.soundDefs[name];
    if (!def) {
      def = {
        name: name,
        src: component.get("v.src"),
        startTime: component.get("v.startTime"),
        endTime: component.get("v.endTime"),
        duration: component.get("v.duration"),
        playbackRate: component.get("v.playbackRate"),
        count: component.get("v.count"),
        index: 0,
        sounds: []
      };
      
      this.soundDefs[name] = def;
    }
    
    for (var i = 0; i < def.count; i++) {
      var sound = new Audio(def.src);
      sound.id = name + i;
      sound.playbackRate = def.playbackRate || 1;
      sound.load();
      def.sounds.push(sound);
    }
  },

  handlePlaySound: function(component, event) {
    var params = event.getParams();
    var name = params.name;
    if (name === component.get("v.name")) {
      var def = this.soundDefs[name];
      def.index = ++def.index > (def.count - 1) ? 0 : def.index;
      var sound = def.sounds[def.index];
      sound.currentTime = def.startTime;
      sound.play();
    }
  }  

})