<aura:application>
  <aura:handler event="html5:qrCodeDecoded" action="{!c.handleQRCode}" />
  <div>
    <div class="row">
      <div class="left">
        <html5:camera />
      </div>
      <div class="right">
        <html5:qrEncoder value="Dreamforce" />
      </div>
    </div>
    <div class="row">
      <div class="left">
        <html5:qrEncoder />
      </div>
      <div class="right">
        <html5:qrDecoder />
      </div>
    </div>
  </div>

</aura:application>