/* JavaScript for ESS Summon UI */

var last_update = 0;

// Load the swipe pane
$(document).on('pageinit',function(){
    $("#main_view").on("swipeleft",function(){
        $("#logPanel").panel( "open");
    });
});

var app = {
    // Application Constructor
    initialize: function() {
        app.log("BLEES init");
        document.addEventListener("deviceready", app.onAppReady, false);
        document.addEventListener("resume", app.onAppReady, false);
        document.addEventListener("pause", app.onPause, false);
    },
    // App Ready Event Handler
    onAppReady: function() {
        app.log("onAppReady");

        // Setup update for last data time
        setInterval(app.update_time_ago, 5000);
        app.log("Checking if ble is enabled...");
        summon.bluetooth.isEnabled(app.onEnable);                                                // if BLE enabled, goto: onEnable
        // app.onEnable();
    },
    // App Paused Event Handler
    onPause: function() {
        app.log("on Pause");                                                           // if user leaves app, stop BLE
        summon.bluetooth.stopScan();
    },
    // Bluetooth Enabled Callback
    onEnable: function() {
        app.log("onEnable");
        // app.onPause();                                                              // halt any previously running BLE processes
        summon.bluetooth.startScan([], app.onDiscover, app.onAppReady);                          // start BLE scan; if device discovered, goto: onDiscover
        app.log("Searching ");
    },
    // BLE Device Discovered Callback
    onDiscover: function(device) {
        if (device.name == "BLEES") {
            app.log("Found " + device.name + " (" + device.id + ")!");
            if (!$("#"+device.id.replace(/:/g,'')).length) $("#template").clone().attr("id",device.id.replace(/:/g,'')).appendTo(".ui-page");
            app.onParseAdvData(device);
        }
    },
   onParseAdvData: function(device){
       deviceId = device.id.replace(/:/g,'');
        //Parse Advertised Data
        var advertisement = device.advertisement;
        $("#"+deviceId+" .devtitle")[0].innerHTML = String(device.id);
        // Check this is something we can parse
        if (advertisement.localName == 'BLEES' && advertisement.serviceUuids.indexOf('181A') !== -1) {

            var mandata = advertisement.manufacturerData;
            var signedmandata = new Int16Array(advertisement.manufacturerData.buffer);

            // Save when we got this.
            last_update = Date.now();

            //app.log("Parsing advertised data...");
            var pressure_pascals = (( (mandata[6] * 16777216) + (mandata[5] * 65536 ) + (mandata[4] * 256) + mandata[3] )/10);
            var pressure_mmHg = (pressure_pascals*0.007500616827042).toFixed(2);
            var pressure_atm = (pressure_pascals*0.00000986923266716).toFixed(4);
            var pressureOut = pressure_mmHg + ' mmHg<br />';// + pressure_atm + ' atm';
            app.log( "Pressure: " + pressureOut);
            $("#"+deviceId+" .presVal")[0].innerHTML = String(pressureOut);

            var humidityOut = (( (mandata[8] * 256) + mandata[7] )/100) + String.fromCharCode(37);
            app.log( "Humidity: " + humidityOut);
            $("#"+deviceId+" .humVal")[0].innerHTML = String(humidityOut);

            var temp_celsius = (mandata[10] * 256) + mandata[9];
			app.log(temp_celsius);
			if(temp_celsius > 32767) {
				temp_celsius = (temp_celsius - 65536);
			} 
			app.log(temp_celsius);
            temp_celsius = (temp_celsius/100).toFixed(1);
			app.log(temp_celsius);
            var temp_fahrenheit = ((temp_celsius * (9/5)) + 32).toFixed(1);
            var temperatureOut = temp_celsius + " " + String.fromCharCode(176) + "C";
            temperatureOut    += '<br />' + temp_fahrenheit + " " + String.fromCharCode(176) + "F";
            app.log( "Temperature: " + temperatureOut);
            $("#"+deviceId+" .tempVal")[0].innerHTML = String(temperatureOut);

            var luxOut = ( (mandata[12] * 256) + mandata[11]) + " lux" ;
            app.log( "Lux: " + luxOut);
            $("#"+deviceId+" .luxVal")[0].innerHTML = String(luxOut);

            var accdata = mandata[13];
            var immAcc = ((accdata & 17) >> 4);
            var intAcc = (accdata & 1);
            app.log("Immediate Acceleration: " + ((accdata & 17) >> 4) );
            app.log("Interval Acceleration: " + (accdata & 1) );
            $("#"+deviceId+" .accVal")[0].innerHTML = intAcc;
            $("#"+deviceId+" .data_update")[0].innerHTML = "";
            app.update_time_ago();

        } else {
            // Not a BLEES packet...
            app.log('Advertisement was not BLEES.');
        }

    },
    update_time_ago: function () {
        summon.bluetooth.stopScan();
        summon.bluetooth.startScan([], app.onDiscover, app.onAppReady);


        // if (last_update > 0) {
        //     // Only do something after we've gotten a packet
        //     // Default output
        //     var out = 'Haven\'t gotten a packet in a while...';

        //     var now = Date.now();
        //     var diff = now - last_update;
        //     if (diff < 60000) {
        //         // less than a minute
        //         var seconds = Math.round(diff/1000);
        //         out = 'Last updated ' + seconds + ' second';
        //         if (seconds != 1) {
        //             out += 's';
        //         }
        //         out += ' ago';

        //     } else if (diff < 120000) {
        //         out = 'Last updated about a minute ago';
        //     }

        //     document.querySelector("#data_update").innerHTML = out;
        // }
    },
    // Function to Log Text to Screen
    log: function(string) {
        console.log(string);
        // document.querySelector("#console").innerHTML += (new Date()).toLocaleTimeString() + " : " + string + "<br />";
        // document.querySelector("#console").scrollTop = document.querySelector("#console").scrollHeight;
    }
};

app.initialize();
