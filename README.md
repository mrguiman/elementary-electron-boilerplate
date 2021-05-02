# elementary-electron-boilerplate

Boilerplate(s) to run the [elementary audio](https://www.npmjs.com/package/@nick-thompson/elementary) engine within an [electron](https://www.electronjs.org/) app.

This repository is organized in a list of branches that vary in the dependencies they include.

**Disclaimer**: I'm brand new to electron so some things may not make much sense while I'm figuring out what works best / is the cleanest.

# Getting Started

```
npm install
npm run dev
```

# How it works

- The main process is the electron process (electron/main.js). Upon startup, it:
  - Spins up the elementary audio engine
  - Renders index.html in the main window
  - Listens to messages from the renderer process and forwards them to the audio process
  - Listens to messages from the audio process and forwards them to the renderer process
  - Uses preload.js to make functions available to the front-end code. [This is the more secure way to do things](https://github.com/electron/electron/issues/28504#issuecomment-813321192) but there are alternatives, such as allowing nodeIntegration
- The elementary audio process starts with audio/main.js and mostly waits for messages sent by the main process
- The front-end javascript (renderer.js):
  - Listens to events to send messages to the main electron process
  - Receives messages forwarded by main process to update the view

# TODO

-[ ] Figure out application packaging

# Contributing

You're welcome to contribute to this repository in order to improve the quality of the boilerplates by forking and making a pull request

# Acknowledgments

Big thanks to Nick for his help on sorting out elementary audio usage on the discord channel before official release.
