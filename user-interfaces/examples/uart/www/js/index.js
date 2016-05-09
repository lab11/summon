/*
 * Connects to device which echos written characteristics
 */

var deviceID = "";

var uart = {
	service: '6E400001-B5A3-F393-E0A9-E50E24DCCA9E',                                                                               // uart service uuid
	tx:      '6E400002-B5A3-F393-E0A9-E50E24DCCA9E',                                                                               // uart tx characteristic uuid
	rx:      '6E400003-B5A3-F393-E0A9-E50E24DCCA9E',                                                                               // uart rx characteristic uuid
};

var app = {
	initialize: function() {
		this.bindEvents();
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener('pause', this.onPause, false);
		document.addEventListener('resume', this.onDeviceReady, false);
		input.addEventListener('change', this.onChange, false);                                                                      // user inputted message event
	},
	onDeviceReady: function() {
		bluetooth.isEnabled(app.onEnable, app.log("BLE","Bluetooth Off."));                                                          // if BLE enabled, goto: onEnable
	},
	onEnable: function() {
		app.log("BLE","Searching...");
		bluetooth.connectDevice(app.onConnect, app.onDeviceReady);                                                                   // if device matches, connect; goto: onConnect
	},
	onConnect: function(device) {
		deviceID = device.id;
		bluetooth.startNotification(deviceID, uart.service, uart.rx, function(d){app.log("RX",app.bytesToString(d))}, app.onError);  // request rx notifications; on rx, goto:onData
	},
	onChange: function(event) {
		if (input.value!="")
			bluetooth.write(deviceID, uart.service, uart.tx, app.stringToBytes(input.value), app.log("TX",input.value), app.onError);  // write tx message; if good, goto: onRead
		input.value = "";
	},
	onPause: function() {                                                                                                          // if user leaves app, stop BLE
		app.log("BLE","Disconnecting.")
		bluetooth.disconnectDevice(function(){deviceID="";});
		bluetooth.stopScan();
	},
	onError: function(e) {                                                                                                         // on error, try restarting BLE
		app.log("ERR",e);
		bluetooth.isEnabled(deviceID,function(){},app.onDeviceReady);
		bluetooth.isConnected(deviceID,function(){},app.onDeviceReady);
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
		document.querySelector("#console").innerHTML+="["+(new Date()).toLocaleTimeString()+"] " + tag + " : " + string + "<br />"; 
	}
};

app.initialize();                                                                                                               // start the app