/* verbal part */
var state = "initial"
var slowBreathInc = 0.1
var fastBreathInc = 0.6
var slowTimeBetweenBlinks = 4000
var fastTimeBetweenBlinks = 500

// var audio1 = new Audio('audio/tick_laugh1.mp3');
// var audio2 = new Audio('audio/woohoo.mp3');


var jumping=false;
var tickling=false;


var audioj1 = new Audio('audio/joke1.mp3');
var audioj2 = new Audio('audio/joke2.mp3');
var audioj3 = new Audio('audio/joke3.mp3');

var audioArray2=[audioj1, audioj2, audioj3];

var audio13 = new Audio('audio/jokeagain.mp3');
var audio14 = new Audio('audio/bye.mp3');
var audio15 = new Audio('audio/election.mp3');

function startDictation() {

  if (window.hasOwnProperty('webkitSpeechRecognition')) {

    var recognition = new webkitSpeechRecognition();

    /* Nonverbal actions at the start of listening */
    setTimeBetweenBlinks(fastTimeBetweenBlinks);
    setBreathInc(slowBreathInc);

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.lang = "en-US";
    recognition.start();


    recognition.onresult = function(e) {
      document.getElementById('transcript').value
                               = e.results[0][0].transcript;
      var user_said = e.results[0][0].transcript;
      recognition.stop();

      /* Nonverbal actions at the end of listening */
      setTimeBetweenBlinks(slowTimeBetweenBlinks);
      jump(); //perform a nonverbal action from nonverbal.js
      stoprecord();

      var bot_response = decide_response(user_said)
      speak(bot_response)

      //`document.getElementById('labnol').submit();
    };

    recognition.onerror = function(e) {
      recognition.stop();
    }

  }
}

/* decide what to say.
 * input: transcription of what user said
 * output: what bot should say
 */
function decide_response(user_said) {
  var response;

  if (user_said.toLowerCase().includes("hello") || user_said.toLowerCase().includes("hi")) {
    audio6.play();
    response=" ";
  } else if ((user_said.toLowerCase().includes("bad") || user_said.toLowerCase().includes("terrible") || user_said.toLowerCase().includes("not good"))) {
    audio12.play();
     response=" ";
  } else if ((user_said.toLowerCase().includes("good") || user_said.toLowerCase().includes("nice") || user_said.toLowerCase().includes("wonderful") || user_said.toLowerCase().includes("great"))) {
    audio7.play();
     response=" ";
  } else if (user_said.toLowerCase().includes("haha") || user_said.toLowerCase().includes("hehe")) {
    audio10.play();
     response=" ";
  }else if (user_said.toLowerCase().includes("joke") && state == "initial") {
     var random_choice2 = Math.floor(Math.random() * audioArray2.length)
     audioArray2[random_choice2].play();
     response=" ";
     console.log("Ramdom joke:" + random_choice2);
     state="jokeagain";
  }else if(user_said.toLowerCase().includes("joke") && state == "jokeagain"){
    audio13.play();
    response=" ";
    state = "initial";
  }else if(user_said.toLowerCase().includes("election") || user_said.toLowerCase().includes("trump")){
    audio15.play();
    response=" ";
  }else if (user_said.toLowerCase().includes("bye") || user_said.toLowerCase().includes("see you")) {
    audio14.play();
     response=" ";
  }else {
    audio9.play();
    response=" ";
  }
  return response;
}


/* Load and print voices */
function printVoices() {
  // Fetch the available voices.
  var voices = speechSynthesis.getVoices();
  
  // Loop through each of the voices.
  voices.forEach(function(voice, i) {
        console.log(voice.name)
  });
}

printVoices();

/* 
 *speak out some text 
 */
function speak(text, callback) {

 /* Nonverbal actions at the start of robot's speaking */
  setBreathInc(fastBreathInc); 

  console.log("Voices: ")
  printVoices();

  var u = new SpeechSynthesisUtterance();
  u.text = text;
  u.lang = 'en-US';
  u.volume = 0.5 //between 0.1
  u.pitch = 1.3//between 0 and 2
  u.rate = 0.8 //between 0.1 and 5-ish
  u.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == "Google US English"; })[0]; //pick a voice

  u.onend = function () {
      
      /* Nonverbal actions at the end of robot's speaking */
      setBreathInc(slowBreathInc); 

      if (callback) {
          callback();
      }
  };

  u.onerror = function (e) {
      if (callback) {
          callback(e);
      }
  };

  speechSynthesis.speak(u);
}
