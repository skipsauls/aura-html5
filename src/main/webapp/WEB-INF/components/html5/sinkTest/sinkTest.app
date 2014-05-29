<aura:application>
  <aura:handler event="html5:simpleEvent" action="{!c.doNothing}" />
  <div class="container">
    <h1>Aura Sink Test</h1>
    <html5:blaster/>
    <html5:sink/>
  </div>
<script>
console.warn("fnord");
</script>  
</aura:application>
