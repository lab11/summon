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
// var deviceAddress="FA:1E:EC:43:9A:07";
var app = {
    initialize: function() {
        this.bindEvents();
        document.querySelector("#console").innerHTML = "-&deg;C";
        document.querySelector("#console").className = "0";
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        deviceAddress = window.gateway.getDeviceId();
        deviceName = window.gateway.getDeviceName();
        ble.isEnabled(app.onEnable,function(){ document.querySelector("#console").innerHTML = "BLE OFF"; });
    },
    onEnable: function() {
        ble.stopScan();
        ble.startScan([], app.onDiscover, app.onDeviceReady);
    },
    onDiscover: function(device) {
        if (device.id==deviceAddress) app.display(device);
    },
    onPause: function() {
        ble.stopScan();
    },
    display: function(device) {
        data     = app.getServiceData(device.advertising);
        value    = (data[15]==73) ? parseInt(String.fromCharCode.apply(null,data.subarray(19,21)),16) : data[16];
        current  = document.querySelector("#console").className;
        delta    = (current-value)/100;
        i        = 0;
        dig = function () {
            current  -= delta;
            document.querySelector("#console").className=Math.round(current);
            document.querySelector("#console").innerHTML=Math.round(current) + "&deg;C";
            if(i++<100) setTimeout(function () {dig()},10);
        };
        if (isNaN(parseInt(current))) {
            document.querySelector("#console").innerHTML=value + "&deg;C";
            document.querySelector("#console").className=value;
        } else if (current!=value) dig();
        if (device.name) document.querySelector("#title").innerHTML=device.name + " Temperature";
        document.querySelector('body').style.background = 'rgb(' + Math.round(9.75 * value) + ',' + 96 + ',' + Math.round(255 - (9.75*value)) + ')';
        app.onEnable;
    },
    getServiceData:function(device) {
        scanRecord = new Uint8Array(device);
        index = 0;
        while (index < scanRecord.length) {
            length = scanRecord[index++];
            if (length == 0) return new Uint8Array(20); //Done once we run out of records
            type = scanRecord[index];
            if (type == 0) return new Uint8Array(20); //Done if our record isn't a valid type
            data = scanRecord.subarray(index + 1, index + length); 
            if (type==22 && data[0]>=' ') return data;
            index += length; //Advance
        }
    }
};

app.initialize();