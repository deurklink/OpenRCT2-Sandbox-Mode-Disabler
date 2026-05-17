var PLUGIN_NAME = "Sandbox Mode Disabler";
var PLUGIN_VERSION = "0.1.0";
var CHEAT_SANDBOX_MODE = 0;
var CHECK_EVERY_TICKS = 1;
var CHAT_COOLDOWN_TICKS = 40;

var disablePending = false;
var ticksSinceLastChatMessage = CHAT_COOLDOWN_TICKS;

function main() {
    if (typeof network !== "undefined" && network.mode === "client") {
        console.log("[" + PLUGIN_NAME + "] Client mode detected; server-side guard disabled.");
        return;
    }

    context.subscribe("action.query", function (e) {
        if (isSandboxEnableAction(e)) {
            e.result = {
                error: 2,
                errorTitle: "Sandbox mode is disabled",
                errorMessage: "This server does not allow sandbox mode."
            };
        }
    });

    context.subscribe("action.execute", function (e) {
        if (isSandboxEnableAction(e)) {
            requestSandboxOff("blocked action");
        }
    });

    context.subscribe("interval.tick", function () {
        ticksSinceLastChatMessage++;
        if ((date.ticksElapsed % CHECK_EVERY_TICKS) !== 0) {
            return;
        }
        if (cheats.sandboxMode) {
            requestSandboxOff("tick guard");
        }
    });

    requestSandboxOff("startup");
}

function isSandboxEnableAction(e) {
    return e &&
        e.action === "cheatset" &&
        e.args &&
        e.args.type === CHEAT_SANDBOX_MODE &&
        e.args.param1 !== 0;
}

function requestSandboxOff(reason) {
    if (!cheats.sandboxMode || disablePending) {
        return;
    }

    disablePending = true;
    context.executeAction("cheatset", {
        type: CHEAT_SANDBOX_MODE,
        param1: 0,
        param2: 0
    }, function (result) {
        disablePending = false;

        if (result && result.error) {
            console.log("[" + PLUGIN_NAME + "] Failed to disable sandbox mode after " + reason + ": " + getActionError(result));
            return;
        }

        announceSandboxDisabled();

        if (cheats.sandboxMode) {
            context.setTimeout(function () {
                requestSandboxOff("retry");
            }, 1);
        }
    });
}

function announceSandboxDisabled() {
    if (ticksSinceLastChatMessage < CHAT_COOLDOWN_TICKS) {
        return;
    }

    ticksSinceLastChatMessage = 0;
    if (typeof park !== "undefined" && park.postMessage) {
        park.postMessage("Sandbox mode was turned off by the server.");
    }
}

function getActionError(result) {
    if (result.errorMessage) {
        return result.errorMessage;
    }
    if (result.errorTitle) {
        return result.errorTitle;
    }
    return "OpenRCT2 rejected the cheatset action.";
}

registerPlugin({
    name: PLUGIN_NAME,
    version: PLUGIN_VERSION,
    authors: ["Sandbox Mode Disabler contributors"],
    type: "local",
    licence: "MIT",
    minApiVersion: 77,
    targetApiVersion: context.apiVersion,
    main: main
});
