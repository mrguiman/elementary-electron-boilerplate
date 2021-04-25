const core = require("elementary-core");
const el = require("@nick-thompson/elementary");

process.on("message", (data) => {
  handleInput(data);
});
core.on("load", () => {
  process.send("elementary Core Loaded");
});

function handleInput(data) {
  process.send(`Emitting ${data.frequency}hz at gain ${data.gain}`);
  core.render(
    el.mul(
      el.const({ key: "jahzGate", value: data.gain }),
      el.cycle(el.const({ key: "jahzFreq", value: data.frequency }))
    )
  );
}
