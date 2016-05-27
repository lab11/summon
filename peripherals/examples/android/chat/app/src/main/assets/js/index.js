/*
 * Broadcasts as BLE peripheral & acts as BLE chat client when connected
 */

var app = {
	initialize: function() {
	    input.addEventListener('change', this.onChange, false);
		input.disabled=true;
		app.log("BLE","Waiting for connection from Summon...");
	},
	onConnect: function() {
	    input.disabled=false;
	    app.log("BLE","Connected. Commence chat.");
	},
	onChange: function(event) {
		if (input.value!="") {
			app.log("PERIPHERAL",input.value); // write tx message;
			client.chat(input.value);
		}
		input.value = "";
	},
	onWrite: function(value) {                 // if user leaves app, stop BLE
		app.log("SUMMON",value)
	},
	onError: function(e) {                     // on error, try restarting BLE
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
                document.querySelector("#console").innerHTML+="<h6 class='t l'>Summon</h6><div></div><h4 class='b l'>"+string+"</h4><div></div>";
            else if (tag=="PERIPHERAL")
                document.querySelector("#console").innerHTML+="<h6 class='t r'>Peripheral (Me)</h6><div></div><h4 class='b r'>"+string+"</h4><div></div>";
    	    else
    	        document.querySelector("#console").innerHTML+="<h6 class='t'>"+ string + "</h6>";
    	}
};

app.initialize();                              // start the app