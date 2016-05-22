/*
 * Acts as a remote for Flappy app on another phone
 */

var deviceID = "";

var bid = {
  service: 'B1D5',                                                                                   // remote service uuid
  character: 'B1DC',                                                                                 // remote switch characteristic uuid
};

var app = {
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
    document.addEventListener('pause', this.onPause, false);
    document.addEventListener('resume', this.onDeviceReady, false);
    document.addEventListener('touchstart', this.onToggle, false);                                   // if screen touched, goto: onToggle
  },
  onDeviceReady: function() {
    document.querySelector("div").setAttribute("class","Dis");                                       // bird image in 'disconnected' mode
    ble.isEnabled(app.onEnable,function(){console.log("Bluetooth Off.")});                           // if BLE enabled, goto: onEnable
  },
  onEnable: function() {
    bluetooth.connectDevice(app.onConnect, app.onDeviceReady);                                       // find device; if connect, goto: onConnect
  },
  onConnect: function(device) {
    deviceID=device.id;
    document.querySelector("div").setAttribute("class","Off");  
  },
  onToggle: function(event) {
    if (document.querySelector("div").getAttribute("class")!="Dis") {                                // if screen touched while connected,
      data = new Uint8Array([0]);
      bluetooth.write(deviceID, bid.service, bid.character, data.buffer, app.onWrite, app.onError);  // write characteristic; if ok, goto: onWrite
    }
  },
  onWrite: function(data) {
    document.querySelector("div").setAttribute("class","On");                                        // flap on
    setTimeout(function(){document.querySelector("div").setAttribute("class","Off")},500);           // flap off
  },
  onError: function() {                                                                              // on error, try restarting
    bluetooth.isEnabled(deviceID,function(){},app.onDeviceReady);
    bluetooth.isConnected(deviceID,function(){},app.onDeviceReady);
  },
  onPause: function() {                                                                              // if user leaves app, stop BLE
    bluetooth.disconnectDevice();
    bluetooth.stopScan();
  }
};

app.initialize();                                                                                    // start the app