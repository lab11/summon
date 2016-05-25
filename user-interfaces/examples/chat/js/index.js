/*
 * Connects to device and acts as a chat client with device
 */

var deviceID = "";

var uart = {
	service: 'B1D5',                                                                                                                          // chat service uuid
	tx:      'B1DC',                                                                                                                          // chat tx characteristic uuid
	rx:      'B1DD',                                                                                                                          // chat rx characteristic uuid
};

var app = {
	initialize: function() {
		this.bindEvents();
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener('pause', this.onPause, false);
		document.addEventListener('resume', this.onDeviceReady, false);
		input.addEventListener('change', this.onChange, false);                                                                               // user inputted message event
	},
	onDeviceReady: function() {
	    input.disabled=true;
		ble.isEnabled(app.onEnable);                                                                                                          // if BLE enabled, goto: onEnable
	},
	onEnable: function() {
		app.log("BLE","Searching...");
		bluetooth.connectDevice(app.onConnect, app.onDeviceReady);                                                                            // if device matches, connect; goto: onConnect
	},
	onConnect: function(device) {
		deviceID = device.id;
	    input.disabled=false;
	    app.log("BLE","Connected. Commence chat.");
	    console.log(JSON.stringify(device, null, 2));
		bluetooth.startNotification(deviceID, uart.service, uart.rx, function(d){app.log("PERIPHERAL",app.bytesToString(d))}, app.onError);  // request rx notifications; on rx, display text
	},
	onChange: function(event) {
		if (input.value!="")
			bluetooth.write(deviceID, uart.service, uart.tx, app.stringToBytes(input.value), app.log("SUMMON",input.value), app.onError);    // write tx message; if good, display text
		input.value = "";
	},
	onPause: function() {                                                                                                                    // if user leaves app, stop BLE
		app.log("BLE","Disconnecting.")
		bluetooth.disconnectDevice(function(){deviceID="";});
		bluetooth.stopScan();
	},
	onError: function(e) {                                                                                                                   // on error, try restarting BLE
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
	    document.querySelector("#console").innerHTML += "<h6 class='t'>"+(new Date()).toLocaleTimeString()+"</h6>";
        if (tag=="SUMMON")
            document.querySelector("#console").innerHTML+="<h6 class='t r'>Summon (Me)</h6><div></div><h4 class='b r'>"+string+"</h4><div></div>";
        else if (tag=="PERIPHERAL")
            document.querySelector("#console").innerHTML+="<h6 class='t l'>Peripheral</h6><div></div><h4 class='b l'>"+string+"</h4><div></div>";
	    else
	        document.querySelector("#console").innerHTML+="<h6 class='t'>"+ string + "</h6>";
	}
};

app.initialize();                                                                                                                            // start the app