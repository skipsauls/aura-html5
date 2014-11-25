({
  doInit: function(component, event, helper) {

  },

  doTestAdd: function(component, event, helper) {

    var idx = $A.componentService.getIndex();
    var r = idx.split(/\n/g);
    var s = null;
    for (var i = 0; i < r.length; i++) {
      try {
        s = r[i].split(/\ :\ /g);
        cmp = $A.getCmp(s[0]);
        def = cmp.getDef();
        facets = def.getFacets();
        if (facets) {
          console.warn(r[i], "is region: ", def.isInstanceOf("html5:region"));
          console.warn("facets: ", facets, facets.length);
          for (var j = 0; j < facets.length; j++) {
            console.warn("facet: ", facets[j]);
          }
        }

      } catch (e) {

      }
    }
    /*
     * c = $A.getCmp("30:1.1") d = c.getDef() d.getFacets() d.isInstanceOf("html5:region")
     */
  }

})