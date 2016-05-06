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
        deviceAddress = gateway.getDeviceId();
        deviceName = gateway.getDeviceName();
        bluetooth.isEnabled(app.onEnable,function(){ document.querySelector("#console").innerHTML = "BLE OFF"; });
    },
    onEnable: function() {
        bluetooth.stopScan();
        bluetooth.startScan([], app.onDiscover, app.onDeviceReady);
    },
    onDiscover: function(device) {
        if (device.id==deviceAddress) app.display(device);
    },
    onPause: function() {
        bluetooth.stopScan();
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