/* JavaScript for Template Summon UI */

var deviceId = "C0:98:E5:30:03:14";                                                 // while testing, replace with address of a BLE peripheral
var deviceName = "BLE Device";                                                      // while testing, replace with desired name
var serviceUuid = "1800";                                                           // example service UUID to access
var characteristicUuid = "2A00";                                                    // example characteristic UUID to read or write
var writeValue = "Written Name";                                                    // value to write to characteristic

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener("deviceready", app.onAppReady, false);
        document.addEventListener("resume", app.onAppReady, false);
        document.addEventListener("pause", app.onPause, false);
    },
    // App Ready Event Handler
    onAppReady: function() {
        if (gateway) {                                                              // if UI opened through Summon (gateway var exists),
            deviceId = gateway.getDeviceId();                                       // get device ID from Summon
            deviceName = gateway.getDeviceName();                                   // get device name from Summon
        }
        summon.bluetooth.isEnabled(app.onEnable);                                   // if BLE enabled, goto: onEnable
    },
    // App Paused Event Handler
    onPause: function() {                                                           // if user leaves app, stop BLE
        summon.bluetooth.disconnectDevice();
        summon.bluetooth.stopScan();
    },
    // Bluetooth Enabled Callback
    onEnable: function() {
        summon.bluetooth.connectDevice(app.onConnect, app.onDeviceReady);           // start BLE scan; if device connected, goto: onConnect
        app.log("Searching for " + deviceName + " (" + deviceId + ").");
    },
    // BLE Device Connected Callback
    onConnect: function(device) {
        app.log("Connected to " + deviceName + " (" + deviceId + ")!");
        // uncomment to read characteristic on connect; if read is good, goto: onRead
        summon.bluetooth.read(deviceId, serviceUuid, characteristicUuid, app.onRead, app.onError);  
        // uncomment to write writeValue to characteristic on connect; if write is good, goto: onWrite
        // summon.bluetooth.write(deviceId, serviceUuid, characteristicUuid, app.stringToBytes(writeValue), app.onWrite, app.onError); 
    },
    // BLE Characteristic Read Callback
    onRead: function(data) {
        app.log("Characteristic Read: " + app.bytesToString(data));                 // display read value as string
    },
    // BLE Characteristic Write Callback
    onWrite : function() {
        app.log("Characeristic Written: " + writeValue);                            // display write success
    },
    // BLE Characteristic Read/Write Error Callback
    onError: function() {                                                           // on error, try restarting BLE
        app.log("Read/Write Error.")
        summon.bluetooth.isEnabled(deviceId,function(){},app.onAppReady);
        summon.bluetooth.isConnected(deviceId,function(){},app.onAppReady);
    },
    // Function to Convert String to Bytes (to Write Characteristics)
    stringToBytes: function(string) {
        array = new Uint8Array(string.length);
        for (i = 0, l = string.length; i < l; i++) array[i] = string.charCodeAt(i);
        return array.buffer;
    },
    // Function to Convert Bytes to String (to Read Characteristics)
    bytesToString: function(buffer) {
        return String.fromCharCode.apply(null, new Uint8Array(buffer));
    },
    // Function to Log Text to Screen
    log: function(string) {
        document.querySelector("#console").innerHTML += (new Date()).toLocaleTimeString() + " : " + string + "<br />"; 
    }
};

app.initialize();