<aura:application template="html5:template">
  <style>
    * {
      margin: 0;
      padding: 0;
    }
    html, body {
      width: 100%;
      height: 100%;
      background: #000000;
    }
    canvas {
      display: block;
      overflow: hidden;
      width: 100%;
      height: 100%;

    }
    .controls {
      background: #C0C0C0;
      display: block;
      left: 0;
      opacity: 0.75;
      position: absolute;
      top: 50px;
      width: 200px;
      padding: 4px;
    }
    .controls .uiButton {
      width: 100%;
      margin: 2px 0;
      display: inline-block;
      text-overflow: ellipsis;
    }
  </style>

<!--
  <html5:flappyScroller actionKeyCodes="jump:32,toggleRunning:13" flappySpriteName="flappy" backgroundURL="/img/flappy_city_720x384.png"
    columnURL="/img/flappy_column_32x32.png" columnTopURL="/img/flappy_column_top_32x32.png" columnBottomURL="/img/flappy_column_bottom_32x32.png" showDebug="true"
    showGrid="true" />

  <html5:flappyScroller actionKeyCodes="jump:32,toggleRunning:13" flappySpriteName="flappy" backgroundURL="/img/sf_skyline_720x256.png"
    columnURL="/img/sf_column_32x32.png" columnTopURL="/img/sf_column_32x32.png" columnBottomURL="/img/sf_column_32x32.png" showDebug="true"
    showGrid="true" />
    
  <html5:sprite aura:id="flappy" name="flappy" imageURL="/img/flappy_sprites_51x12.png" frames="3" fps="12" scaleX="2" scaleY="2" />
  
  <html5:sprite aura:id="flappy" name="flappy" imageURL="/img/saasy_sprites_78x26.png" frames="3" fps="12" scaleX="1" scaleY="1" />
-->

<!--   
  <html5:flappyScroller actionKeyCodes="jump:32,toggleRunning:13" flappySpriteName="flappy" backgroundURL="/img/flappy_city_720x256.png"
    columnURL="/img/flappy_column_32x32.png" columnTopURL="/img/flappy_column_top_32x32.png" columnBottomURL="/img/flappy_column_bottom_32x32.png" showDebug="true"
    showGrid="true" />
    
  <html5:sprite aura:id="flappy" name="flappy" imageURL="/img/flappy_sprites_51x17.png" frames="3" fps="12" scaleX="2" scaleY="2" />
-->
    
  <html5:flappyScroller actionKeyCodes="jump:32,toggleRunning:13" flappySpriteName="flappy" backgroundURL="/img/sf_skyline_720x256.png"
    columnURL="/img/sf_column_32x32.png" columnTopURL="/img/sf_column_32x32.png" columnBottomURL="/img/sf_column_32x32.png" showDebug="true"
    showGrid="true" />
  
  <html5:sprite aura:id="flappy" name="flappy" imageURL="/img/saasy_sprites_78x26.png" frames="3" fps="12" scaleX="1" scaleY="1" />


</aura:application>
