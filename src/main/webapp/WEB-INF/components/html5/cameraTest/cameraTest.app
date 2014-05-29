<aura:application>

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <div>
    <html5:sink/>
  </div>
  <div>
    <div class="row">
      <div class="left">
        <h1>&lt;html5:camera/&gt;</h1>
        <html5:camera />
      </div>
      <div class="right">
        <h1>&lt;html5:imageList/&gt;</h1>
        <html5:imageList />
      </div>
    </div>
    <div class="row">
      <div class="left">
        <h1>&lt;html5:camera type="file"/&gt;</h1>
        <html5:camera type="file"/>
      </div>
      <div class="right">
        <h1>&lt;html5:camera multiple="true"/&gt;</h1>
        <html5:camera multiple="true"/>
      </div>
    </div>
  </div>

</aura:application>