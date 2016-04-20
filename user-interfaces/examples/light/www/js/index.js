/*
 * Connects to light bulb, and reads/writes the switch characteristic to turn it on or off
 */

var deviceID = "";

var light = {
    service: 'FF10',                                                                                              // light service uuid
    onoff: 'FF11',                                                                                                // light switch characteristic uuid
};

var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onDeviceReady, false);
        document.querySelector("svg").addEventListener('touchstart', this.onToggle, false);                       // if bulb image touched, goto: onToggle
    },
    onDeviceReady: function() {
        document.querySelector("svg").setAttribute("class","Dis");                                                // bulb image in 'disconnected' mode
        bluetooth.isEnabled(app.onEnable,function(){                                                              // if BLE enabled, goto: onEnable
            document.querySelector("#console").innerHTML = "Bluetooth Off.";                                      // else, alert user
        });
    },
    onEnable: function() {
        document.querySelector("#console").innerHTML = "Searching...";
        bluetooth.connectDevice(app.onConnect, app.onDeviceReady);                                                // start BLE scan; if device connected, goto: onConnect
    },
    onConnect: function(device) {
        document.querySelector("#console").innerHTML = "Syncing...";
        deviceID=device.id;
        bluetooth.read(deviceID, light.service, light.onoff, app.onRead, app.onRWError);                          // read switch characteristic; if read is good, goto: onRead 
    },
    onRead: function(data) {
        document.querySelector("svg").setAttribute("class",((new Uint8Array(data))[0]===0x1) ? "On" : "Off");     // bulb image in 'on' or 'off' mode
        document.querySelector("#console").innerHTML = document.querySelector("svg").getAttribute("class");       // display text: "On" or "Off"
    },
    onToggle: function(event) {
        if (document.querySelector("svg").getAttribute("class")!="Dis") {                                         // if image touched & bulb connected,
            data = new Uint8Array(1);
            data[0] = (document.querySelector("svg").getAttribute("class")=="Off") ? 0x1 : 0x0;                   // set up switch toggle write 
            bluetooth.write(deviceID, light.service, light.onoff, data.buffer, app.onRead(data), app.onRWError);  // write switch characteristic; if good, goto: onRead
        }
    },
    onPause: function() {                                                                                         // if user leaves app, stop BLE
        bluetooth.disconnectDevice();
        bluetooth.stopScan();
    },
    onRWError: function() {                                                                                       // on error, try restarting BLE
        bluetooth.isEnabled(deviceID,function(){},app.onDeviceReady);
        bluetooth.isConnected(deviceID,function(){},app.onDeviceReady);
    }
};

app.initialize();                                                                                                 // start the app