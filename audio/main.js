const core = elementary.core;
const el = require("@nick-thompson/elementary");

process.on("message", (messageData) => {
  switch (messageData.type) {
    case "emit-sound":
      emitSound(messageData);
      break;
    default:
      stopSound(messageData);
      break;
  }
});
core.on("load", () => {
  process.send("elementary Core Loaded");
});
function emitSound(messageData) {
  console.log(
    `Emitting ${messageData.value.frequency}hz at gain ${messageData.value.gain}`
  );
  renderTone(messageData.value.gain, messageData.value.frequency);
  process.send(messageData);
}
function stopSound(messageData) {
  console.log(`Stopping sound`);
  renderTone(0, 0);
  process.send(messageData);
}

function renderTone(gain, frequency) {
  return core.render(
    el.mul(
      el.const({ key: "jahzGate", value: gain }),
      el.cycle(el.const({ key: "jahzFreq", value: frequency }))
    )
  );
}
