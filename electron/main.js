const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { fork } = require("child_process");

const audioEngine = fork("audio/main.js", {
  execPath: "./node_modules/.bin/elementary",
}).on("message", function (data) {
  const window = BrowserWindow.getFocusedWindow();
  window && window.webContents.send("update", data);
});

ipcMain.on("async-message", (_, messageData) => audioEngine.send(messageData));

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 400,
    x: 0,
    y: 0,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      devTools: false
    },
  });

  win.loadFile("public/index.html");
  win.webContents.openDevTools();
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
