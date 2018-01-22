
// Copyright 2011 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var canvas;
var context;
var images = {};
var totalResources = 11;
var numResourcesLoaded = 0;
var fps = 30;
var charX = 30;
var charY = 250;
var breathInc = 0.1;
var breathDir = 1;
var breathAmt = 0;
var breathMax = 2;
var breathInterval = setInterval(updateBreath, 1000 / fps);
var maxEyeHeight = 40;
var curEyeHeight = maxEyeHeight;
var curEyeColor1 = "white"
var curEyeColor2 = "black"
var curEyeColor3 = "red"
var eyeOpenTime = 0;
var timeBtwBlinks = 4000;
var blinkUpdateTime = 200;                    
var blinkTimer = setInterval(updateBlink, blinkUpdateTime);
var fpsInterval = setInterval(updateFPS, 1000);
var numFramesDrawn = 0;
var curFPS = 0;
var jumping = false;
var tickling = false;
var firstMove = false;
var waitingtime = 8000;
var recording = false;

// initialize global variable showing whether tickle audio is playing --maxim
var tickle_audio_playing = false

var audio1 = new Audio('audio/tick_laugh1.mp3');
var audio2 = new Audio('audio/tick_laugh2.mp3');
var audio3 = new Audio('audio/tick_laugh3.mp3');
var audio4 = new Audio('audio/tick_laugh4.mp3');
var audio5 = new Audio('audio/woohoo.mp3');
var audio6 = new Audio('audio/hi.mp3');
var audio7 = new Audio('audio/good.mp3');
var audio8 = new Audio('audio/bad.mp3');
var audio9 = new Audio('audio/notsure.mp3');
var audio10 = new Audio('audio/sohappy.mp3');
var audio12 = new Audio('audio/bad2.mp3');
var audio16 = new Audio('audio/tickle_harder.mp3');

var audiotip1 = new Audio('audio/touch.mp3');
var audiotip2 = new Audio('audio/tip2.mp3');
var audiotip3 = new Audio('audio/tip3.mp3');


/* add event listeners to each audio: when audio ends, 
 * tickle_audio_playing variable is set to false --maxim */
// audio1.addEventListener('ended', function() {
//   this.currentTime = 0;
//   tickle_audio_playing = false
//   }, false);

// audio2.addEventListener('ended', function() {
//   this.currentTime = 0;
//   tickle_audio_playing = false
//   }, false);

var audioArray=[audio1, audio2, audio3, audio4];
var audioArraytip=[audiotip1, audiotip2, audiotip3];

for(i=0; i<audioArray.length;i++) {
  var audio = audioArray[i]
  audio.addEventListener('ended', function() {
  this.currentTime = 0;
  tickle_audio_playing = false
  }, false);
}


function updateFPS() {
  
  curFPS = numFramesDrawn;
  numFramesDrawn = 0;
}

function prepareCanvas(canvasDiv, canvasWidth, canvasHeight)
{
  // Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
  canvas = document.createElement('canvas');
  canvas.setAttribute('width', canvasWidth);
  canvas.setAttribute('height', canvasHeight);
  canvas.setAttribute('id', 'canvas');
  canvasDiv.appendChild(canvas);
  
  if(typeof G_vmlCanvasManager != 'undefined') {
    canvas = G_vmlCanvasManager.initElement(canvas);
  }
  context = canvas.getContext("2d"); // Grab the 2d canvas context
  // Note: The above code is a workaround for IE 8and lower. Otherwise we could have used:
  //     context = document.getElementById('canvas').getContext("2d");
  
  canvas.width = canvas.width; // clears the canvas 
  context.fillText("I'm coming...", 150, 300);
  
  loadImage("leftArm");
  loadImage("leftLeg");
  loadImage("torso");
  loadImage("rightArm");
  loadImage("rightLeg");
  loadImage("head");
  loadImage("hair");  
  loadImage("leftArm-jump");  
  loadImage("leftArm-tickle");
  loadImage("leftLeg-jump");
  loadImage("rightArm-jump");
  loadImage("rightLeg-jump");
  loadImage("rightArm-tickle");
  loadImage("rightLeg-jump");
  loadImage("head-tickle");
}

function loadImage(name) {

  images[name] = new Image();
  images[name].onload = function() { 
    resourceLoaded();
  }
  images[name].src = "images/" + name + ".png";
}

function resourceLoaded() {

  numResourcesLoaded += 1;
  if(numResourcesLoaded === totalResources) {
  
  setInterval(redraw, 1000 / fps);
  }
}

function redraw() {

  var x = charX;
  var y = charY;
  var jumpHeight = 45;
  var tickleHeight=3;
  
  canvas.width = canvas.width; // clears the canvas 

  if (jumping) {
    audio5.play();
  }

  if (tickling && !tickle_audio_playing) {

  // verify that ranom choice of audio actually works --maxim
    //console.log("audioArray length: " + audioArray.length)
    var random_choice = Math.floor(Math.random() * audioArray.length)
    console.log("Random choice: " + random_choice)

  // set tickle_audio_playing to true, so that we do not enter here again 
  // until audio is finished --maxim
    tickle_audio_playing = true;
    audioArray[random_choice].play();
  }
  // Draw shadow--jumping
  if (jumping) {
  drawEllipse(x + 75, y + 43, 100 - breathAmt, 4);
  } else {
  drawEllipse(x + 75, y + 43, 160 - breathAmt, 6);
  }
  
  if (jumping) {
  y -= jumpHeight;
  }else if (tickling) {
    y += tickleHeight;
  };
  
  if (jumping) {
  context.drawImage(images["rightLeg-jump"], x+80, y- 6);
  } else if(tickling){
  context.drawImage(images["rightLeg"], x+75, y-3);
  }else {
  context.drawImage(images["rightLeg"], x+75, y);
  }

  if (jumping) {
  context.drawImage(images["leftLeg-jump"], x - 5, y - 6);
  } else if(tickling){
  context.drawImage(images["leftLeg"], x + 6, y-1);
  }else {
  context.drawImage(images["leftLeg"], x + 6, y+2);
  }

  context.drawImage(images["torso"], x - 10, y - 50);
  if (jumping) {
    context.drawImage(images["head"], x+10 , y - 125 - breathAmt);
  }else if (tickling) {
    context.drawImage(images["head-tickle"], x+10 , y - 125 - breathAmt);
  }else{
    context.drawImage(images["head"], x+10 , y - 125 - breathAmt);
  }
  
  context.drawImage(images["hair"], x + 10, y - 138 - breathAmt);

  if (jumping) {
  context.drawImage(images["rightArm-jump"], x + 129, y - 69 - breathAmt);
  } else if(tickling){
  context.drawImage(images["rightArm-tickle"], x + 103, y - 39 - breathAmt);
  }else {
  context.drawImage(images["rightArm"], x + 129, y - 49 - breathAmt);
  }
  
  if (jumping) {
  context.drawImage(images["leftArm-jump"], x - 28, y - 70 - breathAmt);
  } else if(tickling){
  context.drawImage(images["leftArm-tickle"], x - 3, y - 40 - breathAmt);
  }else {
  context.drawImage(images["leftArm"], x - 28, y - 50 - breathAmt);
  }
  
  drawEllipse(x + 67, y - 68 - breathAmt, 50, curEyeHeight, curEyeColor1); // Left Eye
  drawEllipse(x + 88, y - 68 - breathAmt, 50, curEyeHeight, curEyeColor1); // Right Eye
if (recording) {
  drawEllipse(x + 67, y - 68 - breathAmt, 5, 5, curEyeColor3); // Left Eye
  drawEllipse(x + 88, y - 68 - breathAmt, 5, 5, curEyeColor3); // Right Eye
}else{
  drawEllipse(x + 67, y - 68 - breathAmt, 5, 5, curEyeColor2); // Left Eye
  drawEllipse(x + 88, y - 68 - breathAmt, 5, 5, curEyeColor2); // Right Eye
}
}

function drawEllipse(centerX, centerY, width, height, color) {
  if (!tickling) {
  context.beginPath();
  
  context.moveTo(centerX, centerY - height/2);
  
  context.bezierCurveTo(
  centerX + width/2, centerY - height/2,
  centerX + width/2, centerY + height/2,
  centerX, centerY + height/2);

  context.bezierCurveTo(
  centerX - width/2, centerY + height/2,
  centerX - width/2, centerY - height/2,
  centerX, centerY - height/2);
 
  context.fillStyle = color;
  context.fill();
  context.closePath();  
  }
}
function setEyeColor(color) {
    curEyeColor = color;
}

function updateBreath() { 
 
  if (breathDir === 1) {  // breath in
  breathAmt -= breathInc;
  if (breathAmt < -breathMax) {
    breathDir = -1;
  }
  } else {  // breath out
  breathAmt += breathInc;
  if(breathAmt > breathMax) {
    breathDir = 1;
  }
  }
}

function setBreathInc(inc) {
  breathInc = inc;
}

function updateBlink() { 
  eyeOpenTime += blinkUpdateTime;
  if(eyeOpenTime >= timeBtwBlinks){
    blink();
  }
}

function setTimeBetweenBlinks(duration) {
  timeBtwBlinks = duration
}

function blink() {
  curEyeHeight -= 1;
  if (curEyeHeight <= 0) {
    eyeOpenTime = 0;
    curEyeHeight = maxEyeHeight;
  } else {
    setTimeout(blink, 10);
  }
}

function jump() {
  if (!jumping) {
    jumping = true;
    setTimeout(land, 500);
  }
  tickling=false;
  firstMove=true;
  setTimeout(resetFirstMove, waitingtime)
}

function land() {
  jumping = false;
  tickling = false;
}

function tickle(){
  if (!tickling)  {
    if (speedX  > 400 || speedX < -400 ) {
      tickling=true;
      firstMove=true;
      setTimeout(resetFirstMove, waitingtime)
    }else {
      audio16.play();
    }
  }
}

function remind(){
  if (!firstMove && !recording) {
    var random_choicetip = Math.floor(Math.random() * audioArraytip.length);
    console.log("Random tip: " + random_choicetip)
    audioArraytip[random_choicetip].play();
  };
}

function resetFirstMove() {
  firstMove=false;
}

function unfocus(){
  jumping=false;
  tickling=false;
}

function record(){
  if (!recording) {
    recording = true ;
  }
}

function stoprecord(){
  recording = false;
}

/* Mouse speed code from http://stackoverflow.com/questions/6417036/track-mouse-speed-with-js --maxim */
var timestamp = null;
var lastMouseX = null;
var lastMouseY = null;
var speedX = 0;
var speedY = 0;

document.body.addEventListener("mousemove", function(e) {
    if (timestamp === null) {
        timestamp = Date.now();
        lastMouseX = e.screenX;
        lastMouseY = e.screenY;
        return;
    }

    var now = Date.now();
    var dt =  now - timestamp;
    var dx = e.screenX - lastMouseX;
    var dy = e.screenY - lastMouseY;
    speedX = Math.round(dx / dt * 100);
    speedY = Math.round(dy / dt * 100);
    console.log("Speed: " + speedX + ", " + speedY)

    timestamp = now;
    lastMouseX = e.screenX;
    lastMouseY = e.screenY;
});

