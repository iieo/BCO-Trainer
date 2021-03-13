//https://paulrosen.github.io/abcjs/audio/synthesized-sound.html#pitchtonotename-pitchnumber

let isPaperVisible = false;
let visualObj, startAudioButton, stopAudioButton, paperSheet;
function generateModule() {
  let len = 0;
  let sheet = "M: 4/4\n" + "L:1/1\n" + "Q:75\n" + "|:";
  sheet += "c/4 c/4 c/4 c/4 |";
  while (len < 2) {
    let ran = Math.round(Math.random() * 12);
    let cPattern = getPattern(ran);
    len += cPattern.length;
    sheet += cPattern.patter + " ";
    if (len % 1 === 0) {
      sheet += "|";
    }
  }
  console.log(sheet);
  return sheet;
}

function getPattern(i) {
  let pattern;
  switch (i) {
    case 0:
      pattern = { patter: "c/16c/16c/16c/16", length: 0.25 };
      break;
    case 1:
      pattern = { patter: "c/4", length: 0.25 };
      break;
    case 2:
      pattern = { patter: "c/4", length: 0.25 };
      break;
    case 3:
      pattern = { patter: "c/8c/8", length: 0.25 };
      break;
    case 4:
      pattern = { patter: "c/8c/16c/16", length: 0.25 };
      break;
    case 5:
      pattern = { patter: "c/16c/16c/8", length: 0.25 };
      break;
    case 6:
      pattern = { patter: "c/6c/16", length: 0.25 };
      break;
    case 7:
      pattern = { patter: "(3c/8c/8c/8", length: 0.25 };
      break;
    case 8:
      pattern = { patter: "z/8 c/8", length: 0.25 };
      break;
    case 9:
      pattern = { patter: "z/8", length: 0.25 };
      break;
    case 10:
      pattern = { patter: "(3 c/8c/8c/8", length: 0.25 };
      break;
    case 11:
      pattern = { patter: "c/8c/16", length: 0.25 };
      break;
    case 12:
      pattern = { patter: "c/4", length: 0.25 };
      break;
  }
  return pattern;
}
function load() {
  initMusic();
  initToggleVisibilityBtn();
  initReloadPaperBtn();
}
function initMusic() {
  visualObj = ABCJS.renderAbc("paper", generateModule(), {
    responsive: "resize",
  })[0];
  initMusicPlayer();
}

function initToggleVisibilityBtn() {
  let showSheetButton = document.querySelector(".show-sheet");
  paperSheet = document.querySelector("#paper");

  showSheetButton.addEventListener("click", function () {
    if (isPaperVisible) {
      paperSheet.style.backgroundColor = "#34495e";
    } else {
      paperSheet.style.backgroundColor = "#ecf0f1";
    }
    isPaperVisible = !isPaperVisible;
  });
}
function initReloadPaperBtn() {
  let reloadSheetButton = document.querySelector(".reload-sheet");

  reloadSheetButton.addEventListener("click", function () {
    initMusic();
    paperSheet.style.backgroundColor = "#34495e";
  });
}

function initMusicPlayer() {
  startAudioButton = document.querySelector(".activate-audio");
  stopAudioButton = document.querySelector(".stop-audio");
  startAudioButton.removeEventListener("click", clickStartAudioButton);
  startAudioButton.addEventListener("click", clickStartAudioButton);

  stopAudioButton.removeEventListener("click", clickStopAudioButton);
  stopAudioButton.addEventListener("click", clickStopAudioButton);
}
function clickStopAudioButton() {
  startAudioButton.setAttribute("style", "");
  stopAudioButton.setAttribute("style", "display:none;");
  if (midiBuffer) midiBuffer.stop();
}
function clickStartAudioButton() {
  startAudioButton.setAttribute("style", "display:none;");
  if (ABCJS.synth.supportsAudio()) {
    stopAudioButton.setAttribute("style", "");

    window.AudioContext =
      window.AudioContext ||
      window.webkitAudioContext ||
      navigator.mozAudioContext ||
      navigator.msAudioContext;
    let audioContext = new window.AudioContext();
    audioContext.resume().then(function () {
      midiBuffer = new ABCJS.synth.CreateSynth();
      return midiBuffer
        .init({
          visualObj: visualObj,
          audioContext: audioContext,
          millisecondsPerMeasure: visualObj.millisecondsPerMeasure(),
        })
        .then(function (response) {
          return midiBuffer.prime();
        })
        .then(function () {
          midiBuffer.start();
          return Promise.resolve();
        })
        .catch(function (error) {
          if (error.status === "NotSupported") {
            stopAudioButton.setAttribute("style", "display:none;");
            let audioError = document.querySelector(".audio-error");
            audioError.setAttribute("style", "");
          } else console.warn("synth error", error);
        });
    });
  } else {
    let audioError = document.querySelector(".audio-error");
    audioError.setAttribute("style", "");
  }
}
