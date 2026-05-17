# Sandbox Mode Disabler plugin for OpenRCT2

Sandbox Mode Disabler is a small local OpenRCT2 plugin that keeps the sandbox mode cheat switched off whenever the plugin is loaded.

Its main use case is multiplayer servers where the admin wants to allow players to toggle cheats, but not turn on sandbox mode. This prevents players from changing or removing park entrances and from building outside the owned park area.

As long as this plugin is in an OpenRCT2 `plugin` directory where it is loaded, sandbox mode cannot be used there. This includes non-server games too.

## How it works

- Watches for `cheatset` game actions that try to enable sandbox mode.
- Rejects those actions during the query phase when OpenRCT2 exposes the result to the plugin hook.
- Uses the built-in networked `cheatset` game action to turn sandbox mode back off if it ever becomes enabled.
- Runs a tick guard as a fallback, so direct or unexpected sandbox changes are also corrected quickly.
- Installs as a `local` plugin.

OpenRCT2's sandbox mode cheat is cheat type `0`, and disabling it is done with:

```js
context.executeAction("cheatset", { type: 0, param1: 0, param2: 0 });
```

## Installation

1. Download `sandbox-mode-disabler.js`.
2. Put the file into the OpenRCT2 `plugin` folder where you want sandbox mode to be blocked.
   - The easiest way to find this folder is to launch OpenRCT2, click and hold the red toolbox on the main menu, then choose "Open custom content folder".
   - On Windows, the folder is usually `C:/Users/<YOUR NAME>/Documents/OpenRCT2/plugin`.
3. Restart OpenRCT2.

For multiplayer servers, clients do not need to install this plugin.

As long as `sandbox-mode-disabler.js` is in an OpenRCT2 `plugin` directory where it is loaded, sandbox mode cannot be used there. To use sandbox mode again, remove or rename the plugin file and restart OpenRCT2.

## Notes

- On multiplayer servers, the plugin should be installed on the server or host only.
- As long as this plugin is in a loaded plugin directory, sandbox mode will be turned off automatically.
- If the file is accidentally installed on a multiplayer client, it detects client mode and does nothing.
- Other cheats remain unaffected.
- For multiplayer servers, the server still needs to allow cheat actions generally, since OpenRCT2 currently does not expose separate multiplayer permissions for individual cheats.

## For Developers

This repository ships the plugin as a single JavaScript file:

- `sandbox-mode-disabler.js`: the OpenRCT2 plugin script
- `openrct2.d.ts`: OpenRCT2 scripting API declarations used as a local reference while developing

To test a local change, copy `sandbox-mode-disabler.js` into your OpenRCT2 server's `plugin` folder and restart OpenRCT2.

## License

MIT
