let emitsSounds = false;

function handleKeydown(e) {
  if (e.key === "a") {
    makeNoise();
  }
}
function makeNoise() {
  emitsSounds = true;
  window.electron.sendMessage({
    type: "emit-sound",
    value: {
      gain: 1,
      frequency: 440,
    },
  });
}
function stopSound() {
  if (emitsSounds) {
    window.electron.sendMessage({
      type: "stop-sound",
      value: {
        gain: 0,
        frequency: 0,
      },
    });
    emitsSounds = false;
  }
}
window.electron.onUpdate((_, message) => {
  document.getElementById("tone").innerHTML =
    message.type === "emit-sound"
      ? `${message.value.frequency}hz`
      : "No Tone Playing";
});
document
  .getElementById("makeNoiseButton")
  .addEventListener("mousedown", makeNoise);
document.addEventListener("keydown", handleKeydown);
document.addEventListener("keyup", stopSound);
document.addEventListener("mouseup", stopSound);
