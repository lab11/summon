/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onDeviceReady, false);
        document.querySelector("svg").addEventListener('touchstart', this.onToggle, false);                       // if bulb image touched, goto: onToggle
    },
    onDeviceReady: function() {
        deviceID = window.gateway.getDeviceId();                                                                  // get device ID from Gateway
        deviceName = window.gateway.getDeviceName();                                                              // get device name from Gateway
        document.querySelector("svg").setAttribute("class","Dis");                                                // bulb image in 'disconnected' mode
        ble.isEnabled(app.onEnable,function(){                                                                    // if BLE enabled, goto: onEnable
            document.querySelector("#console").innerHTML = "Bluetooth Off.";                                      // else, alert user
        });
    },
    onEnable: function() {
        document.querySelector("#console").innerHTML = "Searching...";
        ble.stopScan(function(){ble.startScan([], app.onDiscover, app.onDeviceReady);},app.onDeviceReady);        // start BLE scan; if device discovered, goto: onDiscover
    },
    onDiscover: function(device) {
        if (device.name.startsWith("SHL")) {
            deviceID=device.id;
            document.querySelector("#console").innerHTML = "Connecting...";
            ble.stopScan(function(){ble.connect(deviceID, app.onConnect, app.onDeviceReady);},app.onDeviceReady); // if device matches, connect; if connected, goto: onConnect
        }
    },
    onConnect: function(device) {
        document.querySelector("#console").innerHTML = "Syncing...";
        ble.read(deviceID, light.service, light.onoff, app.onRead, app.onRWError);                                // read switch characteristic; if read is good, goto: onRead 
    },
    onRead: function(data) {
        document.querySelector("svg").setAttribute("class",((new Uint8Array(data))[0]===0x1) ? "On" : "Off");     // bulb image in 'on' or 'off' mode
        document.querySelector("#console").innerHTML = document.querySelector("svg").getAttribute("class");       // display text: "On" or "Off"
    },
    onToggle: function(event) {
        if (document.querySelector("svg").getAttribute("class")!="Dis") {                                         // if image touched & bulb connected,
            data = new Uint8Array(1);
            data[0] = (document.querySelector("svg").getAttribute("class")=="Off") ? 0x1 : 0x0;                   // set up switch toggle write 
            ble.write(deviceID, light.service, light.onoff, data.buffer, app.onRead(data), app.onRWError);        // write switch characteristic; if good, goto: onRead
        }
    },
    onPause: function() {                                                                                         // if user leaves app, stop BLE
        ble.disconnect(deviceID);
        ble.stopScan();
    },
    onRWError: function() {                                                                                       // on error, try restarting BLE
        ble.isEnabled(deviceID,function(){},app.onDeviceReady);
        ble.isConnected(deviceID,function(){},app.onDeviceReady);
    }
};

app.initialize();                                                                                                 // start the app