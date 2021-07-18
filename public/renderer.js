const initialGain = 0.5;
const maxGainValue = 1;

function handleKeypress(e) {
  if (e.key === "a") {
    makeNoise();
  } else if (e.key === "s"){
    stopSound();
  } else if (e.key === "w"){
    maxGain();
  } else if (e.key === "38"){
    gainVolume();
  } else if (e.key === "40"){
    gainVolume();
  }
}

function makeNoise() {
  window.electron.sendMessage({
    type: "emit-sound",
    value: {
      gain: initialGain
    },
  });
  o.innerHTML = initialGain;
  i.value = initialGain;
}

function stopSound() {
  window.electron.sendMessage({
    type: "stop-sound",
    value: {
      gain: 0
    },
  });
  o.innerHTML = 0;
  i.value = 0;
}

function maxGain() {
  window.electron.sendMessage({
    type: "max-gain",
    value: {
      gain: maxGainValue
    },
  });
  o.innerHTML = maxGainValue;
  i.value = maxGainValue;
}

function gainVolume() {
  o.innerHTML = i.value;
  window.electron.sendMessage({
    type: "gain-volume",
    value: {
      gain: Number(i.value)
    },
  });
}

document
  .getElementById("muteButton")
  .addEventListener("click", stopSound);
document.addEventListener("keypress", handleKeypress);

let i = document.querySelector('input'),
    o = document.querySelector('output');

o.innerHTML = i.value;
i.addEventListener('change', gainVolume);

