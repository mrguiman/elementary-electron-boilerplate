let emitsSounds = false;
function onMakeNoiseDown() {
  emitsSounds = true;
  window.electron.sendMessage({
    type: "emit-sound",
  });
}
function onMouseUp() {
  if (emitsSounds) {
    window.electron.sendMessage({
      type: "stop-sound",
    });
    emitsSounds = false;
  }
}
window.electron.onUpdate((_, message) => {
  if (message.type === "update-tone") {
    document.getElementById("tone").innerHTML = message.data
      ? `${message.data}hz`
      : "No Tone Playing";
  }
});
document
  .getElementById("makeNoiseButton")
  .addEventListener("mousedown", onMakeNoiseDown);
document.addEventListener("mouseup", onMouseUp);
