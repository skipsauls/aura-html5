<aura:application>
  <aura:attribute name="recordId" type="String" description="The recordId for the currently selected record" default="001R0000001nMLh" />

  <div aura:id="container" class="container">
    <ui:inputSelect aura:id="recordSelect" change="{!c.onChangeRecord}" label="Record">
      <ui:inputSelectOption label="Burlington" text="001R0000001nMLh" value="false" />
      <ui:inputSelectOption label="Dickenson" text="001R0000001nMLj" value="false" />
    </ui:inputSelect>
    <h1>
      recordId:
      <ui:outputText value="{!v.recordId}" />
    </h1>

    <h1>Foo</h1>
    <ui:menu visible="true">

      <ui:menuList label="Bork">
        <ui:actionMenuItem label="One" visible="true" />
      </ui:menuList>
    </ui:menu>
    <h1>Bar</h1>


    <ui:menu>
      <ui:menuList class="actionMenu" aura:id="actionMenu2">
        <ui:actionMenuItem class="actionItem4" aura:id="actionItem4" label="Something 4" click="{!c.updateTriggerLabel}" />
        <ui:actionMenuItem class="actionItem5" aura:id="actionItem5" label="Something 5" click="{!c.updateTriggerLabel}" />
        <ui:actionMenuItem class="actionItem6" aura:id="actionItem6" label="Something 6" click="{!c.updateTriggerLabel}" />
        <!--some menu items -->
      </ui:menuList>
    </ui:menu>

  </div>
</aura:application>