<aura:application>
  <aura:handler name="init" value="{!this}" action="{!c.doInit}" />
  <div class="container">
    <h1>regionTest</h1>
    <div>
      <html5:palette/>
    </div>
    <div>
      <ui:button label="Test Add" press="{!c.doTestAdd}"/>
    </div>
    <html5:simpleRegion aura:id="root" name="test"/>
    <html5:layout aura:id="layout" name="layout"/>
    <html5:twoColumnLayout aura:id="twoColumnLayout" name="twoColumnLayout"/>
  </div>
</aura:application>
