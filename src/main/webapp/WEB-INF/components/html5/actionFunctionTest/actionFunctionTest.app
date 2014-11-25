<aura:application controller="java://html5.TestController">
  <aura:attribute name="valueA" type="Double" default="1.23"/>
  <aura:attribute name="valueB" type="Double" default="3.14"/>
  <aura:attribute name="result" type="Double" default="0.0"/>
  
  <h1>ActionFunction Test</h1>
  <html5:actionFunction action="{!c.testServerAction}" name="fireTestServerAction">
    <html5:actionParam name="foo" value="bar"/>
    <html5:actionParam name="bork" value="fnord"/>
  </html5:actionFunction>
  <html5:actionFunction action="{!c.addValues}" name="fireAddValues" actionResult="{!c.handleActionResult}">
    <html5:actionParam name="valueA" value="1.2"/>
    <html5:actionParam name="valueB" value="3.4"/>    
  </html5:actionFunction>
  <ul>
    <li><ui:button label="c.fireTestServerAction" press="{!c.fireTestServerAction}"/></li>
    <li><ui:button label="c.globalFireTestServerAction" press="{!c.globalFireTestServerAction}"/></li>
    <li><ui:button label="c.fireAddValues" press="{!c.fireAddValues}"/></li>
    <li><ui:button label="c.globalFireAddValues" press="{!c.globalFireAddValues}"/></li>
  </ul>

  <div>
    <ui:inputNumber label="Value A:" value="{!v.valueA}"/>
  </div>  
  <div>
    <ui:inputNumber label="Value B:" value="{!v.valueB}"/>
  </div>
  <div>
    <ui:button label="Add Values" press="{!c.globalFireAddValues}"/>
  </div>
  <div>
    <ui:outputNumber label="Result" value="{!v.result}"/>
  </div>
<!-- 
<apex:actionFunction action=”{!addCaseId}” name=”findCaseDetails” rerender=”form”>
<apex:param name=”caseId” assignTo=”{!caseId}” value=”” />
</apex:actionFunction>

<apex:actionFunction name="vfeditor_checkName" action="{!checkName}" rerender="checkNameResult">
    <apex:param name="layoutName" value=""/>
</apex:actionFunction>
<apex:actionFunction name="vfeditor_hideIEMessage" action="{!hideIEMessage}" rerender="messagePanel" oncomplete="VFEditor.refreshTroughPosition();"/>
                
 -->
 
</aura:application>
