/* JavaScript for ESS Summon UI */

var app = {
    // Application Constructor
    initialize: function() {
        app.log("Signpost init");
        document.addEventListener("deviceready", app.onAppReady, false);
        document.addEventListener("resume", app.onAppReady, false);
        document.addEventListener("pause", app.onPause, false);
    },
    // App Ready Event Handler
    onAppReady: function() {
        app.log("onAppReady");
        app.log("Checking if BLE is enabled...");
        summon.bluetooth.isEnabled(app.onEnable);                                      // if BLE enabled, goto: onEnable
    },
    // App Paused Event Handler
    onPause: function() {
        app.log("on Pause");                                                           // if user leaves app, stop BLE
        summon.bluetooth.stopScan();
    },
    // Bluetooth Enabled Callback
    onEnable: function() {
        app.log("onEnable");
        app.onPause();                                                                 // halt any previously running BLE processes
        summon.bluetooth.startScan([], app.onDiscover, app.onAppReady);                // start BLE scan; if device discovered, goto: onDiscover
        app.log("Searching ");
    },
    // BLE Device Discovered Callback
    onDiscover: function(device) {
        if (device.name == "Signpost") {
            app.log("Found " + device.name + " (" + device.id + ")!");
            //Parse Advertised Data
            var advertisement = device.advertisement;
            // Check this is something we can parse
            if (advertisement.localName == 'Signpost' && advertisement.serviceUuids.indexOf('181A') !== -1) {

                // Parse advertisement

            } else {
                // Not a Signpost packet...
                app.log('Advertisement was not Signpost.');
            }
        }
    },
    // Function to Log Text to Screen
    log: function(string) {
        console.log(string);
    }
};

app.initialize();
