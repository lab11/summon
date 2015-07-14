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

var uart = {
    service: '6E400001-B5A3-F393-E0A9-E50E24DCCA9E',                                                                             // uart service uuid
    tx:      '6E400002-B5A3-F393-E0A9-E50E24DCCA9E',                                                                             // uart tx characteristic uuid
    rx:      '6E400003-B5A3-F393-E0A9-E50E24DCCA9E',                                                                             // uart rx characteristic uuid
};

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onDeviceReady, false);
        input.addEventListener('change', this.onChange, false);                                                                 // user inputted message event
    },
    onDeviceReady: function() {
        // deviceID = "E0:44:D5:5D:84:F2";
        deviceID = window.gateway.getDeviceId();                                                                                // get device ID from Gateway
        ble.isEnabled(app.onEnable, app.log("BLE","Bluetooth Off."));                                                           // if BLE enabled, goto: onEnable
    },
    onEnable: function() {
        app.log("BLE","Searching...");
        ble.stopScan();
        ble.startScan([], app.onDiscover, app.onDeviceReady);                                                                   // start BLE scan; see a device? goto: onDiscover
    },
    onDiscover: function(device) {
        if (device.id == deviceID) {
            app.log("BLE","Found! Connecting...");
            ble.connect(deviceID, app.onConnect, app.onDeviceReady);                                                            // if device matches, connect; goto: onConnect
        }
    },
    onConnect: function(device) {
        ble.startNotification(deviceID, uart.service, uart.rx, function(d){app.log("RX",app.bytesToString(d))}, app.onError);   // request rx notifications; on rx, goto:onData
    },
    onChange: function(event) {
        if (input.value!="")
            ble.write(deviceID, uart.service, uart.tx, app.stringToBytes(input.value), app.log("TX",input.value), app.onError); // write tx message; if good, goto: onRead
        input.value = "";
    },
    onPause: function() {                                                                                                       // if user leaves app, stop BLE
        app.log("BLE","Disconnecting.")
        ble.disconnect(deviceID,function(){deviceID="";});
        ble.stopScan();
    },
    onError: function(e) {                                                                                                      // on error, try restarting BLE
        app.log("ERR",e);
        ble.isEnabled(deviceID,function(){},app.onDeviceReady);
        ble.isConnected(deviceID,function(){},app.onDeviceReady);
    },
    stringToBytes: function(string) {
        array = new Uint8Array(string.length);
        for (i = 0, l = string.length; i < l; i++) array[i] = string.charCodeAt(i);
        return array.buffer;
    },
    bytesToString: function(buffer) {
        return String.fromCharCode.apply(null, new Uint8Array(buffer));
    },
    log: function(tag,string) {
        document.querySelector("#console").innerHTML+= "["+(new Date()).toLocaleTimeString()+"] " + tag + " : " + string + "<br />"; 
    }
};

app.initialize();                                                                                           // start the app