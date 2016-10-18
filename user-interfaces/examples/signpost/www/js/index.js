/* JavaScript for Signpost Summon UI */

var xAudioFreq = ["63","160","400","1k","2k","6k","\0 16k Hz"];
var xRFSpectrm = ["11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26"];

var app = {
    // Application Constructor
    initialize: function() {
        app.log("Signpost init");
        document.addEventListener("deviceready", app.onAppReady, false);
        document.addEventListener("resume", app.onAppReady, false);
        document.addEventListener("pause", app.onPause, false);
        document.querySelector("#rect").addEventListener("click", app.onClick);
        for (i=0; i<8; i++) document.querySelectorAll(".mod")[i].addEventListener("click", app.onClick);

        // Map for GPS module
        var map = d3.select("#mod6");
        var projection = d3.geo.equirectangular();
        d3.json("js/map.json",function(e,geodata) {
            if (e) return console.log(e);
            map.selectAll("path")
                .data(topojson.feature(geodata,geodata.objects.collection).features).enter().append("path")
                .attr("d",d3.geo.path().projection(projection.scale(19).translate([120/2,65/2])));
            lat=40; lon=73;
            map.selectAll("line").remove()
            map.selectAll("line")
                .data([[[lon,-90],[lon,90]],[[-180,lat],[180,lat]]]).enter().append("line")
                .attr("x1", function (d) { return projection(d[0])[0]; })
                .attr("y1", function (d) { return projection(d[0])[1]; })
                .attr("x2", function (d) { return projection(d[1])[0]; })
                .attr("y2", function (d) { return projection(d[1])[1]; });
            map.append("text").text(lat.toFixed(4) + "\u00B0 N " + lon.toFixed(4) + "\u00B0 W").attr("x",60).attr("y",80)
        });

        // Chart display metrics
        var margin = {top: 10, right: 10, bottom: 20, left: 25},
                width = 120 - margin.left - margin.right,
                height = 90 - margin.top - margin.bottom;

        // Chart for Audio Fequency module
        var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1, 0.2);
        var y = d3.scale.linear().range([height, 0]);
        var svg = d3.select("#mod0").append("g").attr("transform","translate("+margin.left+","+margin.top+")");
        x.domain(xAudioFreq);
        y.domain([0,4095]);
        svg.append("g").attr("class","x axis").attr("transform", "translate(0,"+height+")").call(d3.svg.axis().scale(x).orient("bottom"));
        svg.append("g").attr("class","y axis").call(d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s")));
        svg.selectAll(".bar")
            .data([{x:"63",y:500},{x:"160",y:1000},{x:"400",y:1500},{x:"1k",y:2000},{x:"2k",y:2500},{x:"6k",y:3000},{x:"\0 16k Hz",y:3500}])
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.x); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.y); })
            .attr("height", function(d) { return height - y(d.y); });

        // Chart for RF Spectrum module
        var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1, 0.2);
        var y = d3.scale.linear().range([height, 0]);
        var svg = d3.select("#mod5").append("g").attr("transform","translate("+margin.left+","+margin.top+")");
        x.domain(xRFSpectrm);
        y.domain([0,30]);
        svg.append("g").attr("class","x axis").attr("transform", "translate(0,"+height+")").call(d3.svg.axis().scale(x).orient("bottom"));
        svg.append("g").attr("class","y axis").call(d3.svg.axis().scale(y).orient("left"));
        svg.selectAll(".bar")
            .data([{x:11,y:11},{x:12,y:12},{x:13,y:13},{x:14,y:14},{x:15,y:15},{x:16,y:16},{x:17,y:17},{x:18,y:18},{x:19,y:19},{x:20,y:20},{x:21,y:21},{x:22,y:22},{x:23,y:23},{x:24,y:24},{x:25,y:25},{x:26,y:26}])
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.x); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.y); })
            .attr("height", function(d) { return height - y(d.y); });

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
    // Module Click Event Handler
    onClick: function() {
        if (this.id!="rect" && document.body.style.transform=='') {
            el = this.getBoundingClientRect();
            x = window.innerWidth / 2 - el.width / 2 - el.left;
            y = window.innerHeight / 2 - el.height / 2 - el.top;
            s = Math.min(window.innerHeight,window.innerWidth) / (el.width + 20);
            document.body.style.transform = 'scale('+s+') translate('+x+'px,'+y+'px)';
        } else document.body.style.transform = '';
    },
    // Function to Log Text to Screen
    log: function(string) {
        console.log(string);
    }
};

app.initialize();