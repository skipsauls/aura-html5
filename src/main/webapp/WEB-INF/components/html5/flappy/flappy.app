<aura:application template="html5:template">
  <aura:handler name="init" value="{!this}" action="{!c.doInit}" />
  <style>
    * {
      margin: 0;
      padding: 0;
    }
    html {
      width: 100%;
      height: 100%;
      background: #000000;
    }
    body {
      width: 100%;
      height: 100%;
      background: #FFFFFF;
    }
    .fade-to-black {
      background: #000000;
      -webkit-transition: background 1000ms ease-out 500ms; /* property duration timing-function delay */
      -moz-transition: background 1000ms ease-out 500ms;
      -o-transition: background 1000ms ease-out 500ms;
      transition: background 1000ms ease-out 100ms;    
    }


  </style>

  <html5:flappyScroller
    gameTitle="Flappy SaaSy"
    mode="game"
    showDebug="false"
    showGrid="false"
    showControls="false"
    actionKeyCodes="jump:32,toggleRunning:13"
    flappySpriteName="saasy"
    staticSpritesName="static"
    backgroundURL="/img/sf_skyline_2240x256.jpg"
    columnURL="/img/column_32x32.png"
    columnTopURL="/img/column_top_32x32.png"
    columnBottomURL="/img/column_bottom_32x32.png"
  />
  
  <html5:sprite
    aura:id="saasy"
    name="saasy"
    type="animated"
    imageURL="/img/saasy_sprites_270x90.png"
    frames="3"
    fps="12"
  />
  
  <html5:sprite
    aura:id="static"
    name="static"
    type="static"
    imageURL="/img/flappy_text_320x320.png"
    offsets='{
      "title":{"x":0,"y":0,"w":320,"h":80},
      "gameOver":{"x":0,"y":80,"w":320,"h":80},
      "tapToStart":{"x":0,"y":160,"w":320,"h":80},
      "tapToContinue":{"x":0,"y":240,"w":320,"h":80}
    }'
  />


  <html5:sprite
    aura:id="mini"
    name="mini"
    type="animated"
    imageURL="/img/mini_sprites_270x90.png"
    positionX="50"
    positionY="10"
    frames="3"
    fps="12"
  />

  <html5:sprite
    aura:id="flappy"
    name="flappy"
    type="animated"
    imageURL="/img/flappy_sprites_51x17.png"
    positionX="20"
    positionY="20"
    frames="3"
    fps="12"
    scaleX="1"
    scaleY="1"
    speedX="4"
    speedY="4"
  />
  
  <html5:sound
    name="flap"
    src="/mp3/Shh.mp3"
    startTime="0.5"
    count="4"
  />

  <html5:sound
    name="collision"
    src="/mp3/Whack.mp3"
  />

  <html5:sound
    name="gameOver"
    src="/mp3/WilhelmScream.mp3"
  />
  
</aura:application>
