/* JavaScript for Signpost Summon UI */

var app = {
    // Application Constructor
    initialize: function() {
        app.log("Signpost init");
        document.addEventListener("deviceready", app.onAppReady, false);
        document.addEventListener("resume", app.onAppReady, false);
        document.addEventListener("pause", app.onPause, false);

        // Map for GPS module
        var map = d3.select("#mod6");
        var projection = d3.geo.equirectangular();
        d3.json("js/map.json",function(e,geodata) {
            if (e) return console.log(e);
            map.selectAll("path")
                .data(topojson.feature(geodata,geodata.objects.collection).features).enter().append("path")
                .attr("d",d3.geo.path().projection(projection.scale(19).translate([120/2,65/2])));
            lat=40; lon=173;
            map.selectAll("line").remove()
            map.selectAll("line")
                .data([[[lon,-90],[lon,90]],[[-180,lat],[180,lat]]]).enter().append("line")
                .attr("x1", function (d) { return projection(d[0])[0]; })
                .attr("y1", function (d) { return projection(d[0])[1]; })
                .attr("x2", function (d) { return projection(d[1])[0]; })
                .attr("y2", function (d) { return projection(d[1])[1]; });
            map.append("text").text(lat.toFixed(4) + "\u00B0 N " + lon.toFixed(4) + "\u00B0 W").attr("x",60).attr("y",80)
        });
    },
    // App Ready Event Handler
    onAppReady: function() {
        app.log("onAppReady");
        app.log("Checking if BLE is enabled...");
        summon.bluetooth.isEnabled(app.onEnable);                                     // if BLE enabled, goto: onEnable
    },
    // App Paused Event Handler
    onPause: function() {
        app.log("Pause");                                                             // if user leaves app, stop BLE
        summon.bluetooth.stopScan();
    },
    // Bluetooth Enabled Callback
    onEnable: function() {
        app.onPause();                                                                // halt any previously running BLE processes
        summon.bluetooth.startScan([], app.onDiscover, app.onAppReady);               // start BLE scan; if device discovered, goto: onDiscover
        app.log("Searching");
    },
    // BLE Device Discovered Callback
    onDiscover: function(device) {
        if (device.name == "Signpost") {
            app.log("Found " + device.name + " (" + device.id + ")!");
            //Parse Advertised Data
            var advertisement = device.advertisement;
            // Check this is something we can parse
            if (advertisement.localName == 'Signpost' && advertisement.serviceUuids.indexOf('181A') !== -1) {

                // Parse advertisement

            } else {
                // Not a Signpost packet...
                app.log('Advertisement was not Signpost.');
            }
        }
    },
    // Function to Log Text to Screen
    log: function(string) {
        console.log(string);
    }
};

app.initialize();