const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { fork } = require("child_process");

const audioEngine = fork("audio/main.js", {
  execPath: "./node_modules/.bin/elementary",
}).on("message", function (data) {
  console.log("[elementaryProcess] " + data);
});

ipcMain.on("async-message", (_, message) => {
  const window = BrowserWindow.getFocusedWindow();
  switch (message.type) {
    case "stop-sound":
      updateSound(window, 0);
      break;
    case "emit-sound":
    default:
      updateSound(window, 1);
      break;
  }
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("public/index.html");
  win.webContents.openDevTools();
  win.webContents.on("before-input-event", (_, input) =>
    handleKeyboardEvents(win, input)
  );
}

function updateSound(win, gain, frequency = 440) {
  audioEngine.send({
    gain: gain,
    frequency: frequency,
  });

  updateRenderer(win, "update-tone", gain > 0 ? frequency : null);
}

function updateRenderer(window, eventType, data) {
  window.webContents.send("update", {
    type: eventType,
    data,
  });
}

function handleKeyboardEvents(win, input) {
  const gain = input.type === "keyDown" ? 1 : 0;

  if (!input.isAutoRepeat && input.key === "a") {
    updateSound(win, gain);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  audioEngine.kill("SIGINT");
  if (process.platform !== "darwin") {
    app.quit();
  }
});
