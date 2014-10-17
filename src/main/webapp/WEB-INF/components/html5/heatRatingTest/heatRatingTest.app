<aura:application>
  <html5:heatRating label="1" value="1"/>
  <html5:heatRating label="10" value="10"/>
  <html5:heatRating label="20" value="20"/>
  <html5:heatRating label="50" value="50"/>
  <html5:heatRating label="70" value="70"/>
  <html5:heatRating label="90" value="90"/>
  <html5:heatRating label="100" value="100"/>
  <html5:heatRating label="Testing" value="1"/>
  <html5:heatRating label="Testing" value="50"/>
  <html5:heatRating label="Testing" value="100"/>
  <input type="range" min="{!v.min}" max="{!v.max}" step="{!v.step}" value="{!v.value}" onchange="{!c.handleChangeValue}"/>
  
</aura:application>