# elementary-electron-boilerplate

Boilerplate(s) to run the [elementary audio](https://www.npmjs.com/package/@nick-thompson/elementary) engine within an [electron](https://www.electronjs.org/) app running React. Uses Typescript as a main language.

This repository is organized in a list of branches that vary in the dependencies they include.

**Disclaimer**: I'm brand new to electron so some things may not make much sense while I'm figuring out what works best / is the cleanest.

## Getting Started

First off, follow the installation guide for elementary audio [from the official website](https://docs.elementary.audio/).
Elementary needs to be in your path for you to be able to start the app.

Then, run the following command:

```
npm install
```

In the project directory, you can run:

### `start`

Uses concurrently to run the react app and electron / elementary in parralel, thus removing the need to start them independently

### `start:react`

Starts the react app with webpack in BROWSER=NONE mode to be included within the electron wrapper. Since the React app runs with webpack, hot reloading happens within the electron wrapper.

### `build:react`

Generates built files for the react app. Currently useless until we figure out packaging everything for production

### `start:electron`

Compiles and starts the electron app using nodemon to watch for changes within the electron and audio folders.
The electron app also spins up the elementary audio child process.

### `npm run eject`

The project was initialized with Create-React-App, so it uses the same eject script.

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## How it works

There are 2 main processes used to run the app.

- The Electron process (electron/main.js). Upon startup, it:
  - Spins up the elementary audio engine as a child process
  - Renders whatever's running on localhost port 3000 (ergo the react app)
  - Listens to messages from the renderer process and forwards them to the audio process
  - Listens to messages from the audio process and forwards them to the renderer process
  - Uses preload.js to make functions available to the front-end code. [This is the more secure way to do things](https://github.com/electron/electron/issues/28504#issuecomment-813321192) but there are alternatives, such as allowing nodeIntegration
- The elementary audio process starts with audio/main.js and mostly waits for messages sent forwarded by the main process
- The Create-React-App process
  - Starts in dev mode (using webpack-dev-server) and provides hot reloading for any change made to the react application
  - Renders the app using the normal react way
  - Uses functions provided by electron via preload.js using window.electron to send and receive messages from it

## TODO

- Figure out application packaging
- Solve Electron CSP Security Warning
- Solve "devtools failed to load sourcemap for preload" warning
- Find a clean way to share types with CRA (which currently complains when requiring types outside of the src folder)

## Contributing

You're welcome to contribute to this repository in order to improve the quality of the boilerplates by forking and making a pull request

# Acknowledgments

Big thanks to Nick for his help on sorting out elementary audio usage on the discord channel before official release.
