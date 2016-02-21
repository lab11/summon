// app state
var paused = false;
var switch_visibility_console_check = "visible";
var switch_visibility_steadyscan_check = "visible";
var steadyscan_on = true;

// device state
var deviceId = "C0:98:E5:70:00:2D"; // set to value for testing, overwritten by summon
var last_update = 0;

// Load the swipe pane
$(document).on('pageinit',function(){
    $("#main_view").on("swipeleft",function(){
        $("#logPanel").panel( "open");
    });
});

// handle pause clicks
$(function() {
    $("#pause").click(function(e) {
        e.preventDefault();
        if (paused) {
            paused = false;
            app.onEnable();
            app.update_time_ago();
            document.getElementById("pause").innerHTML = "</br>Pause";
        } else {
            paused = true;
            app.onPause();
            app.update_time_ago();
            document.getElementById("pause").innerHTML = "</br>Unpause";
        }
    });
});

// parse BLE packet and display data on screen
function parse_advertisement(adv) {
    // display formatted JSON of the packet data
    document.getElementById("jsonPacket").innerHTML = JSON.stringify(adv, null, '\t');

    // Update data reception timestamp
    last_update = Date.now();
}

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener("deviceready", app.onAppReady, false);
        document.addEventListener("resume", app.onAppReady, false);
        document.addEventListener("pause", app.onPause, false);
    },

    // App Ready Event Handler
    onAppReady: function() {
        // if UI opened through Summon
        //  The app is not opened through Summon when testing directly on the
        //  phone using cordova
        if (typeof window.gateway != "undefined") {
            // Device ID and Name are handed off to UI when summon calls it
            deviceId = window.gateway.getDeviceId();
            deviceName = window.gateway.getDeviceName();
            app.log("Opened via Summon..");
        }
        document.getElementById("title").innerHTML = String(deviceId);
        paused=false;

        app.log("Checking if ble is enabled...");
        bluetooth.isEnabled(app.onEnable);
    },

    // App Paused Event Handler
    onPause: function() {
        // if user leaves app, stop BLE
        app.log("on Pause");
        bluetooth.stopScan();
        paused=true;
    },

    // Bluetooth Enabled Callback
    onEnable: function() {
        // restart BLE scan
        bluetooth.stopScan(function(){
            bluetooth.startScan([], app.onDiscover, function (e) {
                console.log(e)
            });

            // restart BLE scan every second
            setTimeout(function () {
                if (!paused) {
                    app.onEnable();
                }
            },1000);

        },app.onAppReady);
        app.log("Searching for (" + deviceId + ").");
    },

    // BLE Device Discovered Callback
    onDiscover: function(device) {
        if (device.id == deviceId) {
            app.log("Found (" + deviceId + ")!");

            // actually use the advertisement data
            parse_advertisement(device.advertisement);
        }

        // update time notion
        app.update_time_ago();
    },

    // Update UI indication of how long it has been since a packet was received
    update_time_ago: function () {
        // Default output
        var out = 'Waiting for data...';

        // get time since last packet received
        var now = Date.now();
        var diff = now - last_update;

        // less than a minute
        if (diff < 60000) {
            var seconds = Math.round(diff/1000);
            out = 'Last updated ' + seconds + ' second';
            if (seconds != 1) {
                out += 's';
            }
            out += ' ago';

        // more than a minute, less than two
        } else if (diff < 120000) {
            out = 'Last updated about a minute ago';
        }

        if (paused) {
            out = "Paused";
        }

        // update UI
        document.querySelector("#data_update").innerHTML = out;
    },

    // Function to Log Text to Screen
    log: function(string) {
        document.querySelector("#console").innerHTML += (new Date()).toLocaleTimeString() + " : " + string + "<br />";
        document.querySelector("#console").scrollTop = document.querySelector("#console").scrollHeight;
    }
};

app.initialize();

