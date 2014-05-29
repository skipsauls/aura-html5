<aura:application>
  <aura:handler name="init" value="{!this}" action="{!c.doInit}" />
  <aura:handler event="html5:simpleEvent" action="{!c.doNothing}" />
  <div class="container">
    <h1>Aura Map Test</h1>
    <html5:map />
  </div>
</aura:application>
