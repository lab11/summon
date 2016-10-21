/* JavaScript for Signpost Summon UI */

var MODULES = [
  { name:"2.4GHz Spectrum", dev:"2.4ghz_spectrum", x:[11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26], y:[-128,-.1] },
  { name:"Ambient", dev:"ambient" },
  { name:"Radio", dev:"radio" },
  { name:"Controller", dev:"gps" },
  { name:"Power Supply", dev:"status" },
  { name:"Audio Frequency", dev:"audio_frequency", x:[63,160,400,1000,2500,6250,16000], y:[0,4095] },
  { name:"Air Quality", dev:"ucsd_air_quality" },
  { name:"Microwave Radar", dev:"microwave_radar" }
]

var app = {
  // Application Constructor
  initialize: function() {
    document.addEventListener("deviceready", app.onAppReady, false);
    document.addEventListener("resume", app.onAppReady, false);
    document.addEventListener("pause", app.onPause, false);
    document.addEventListener("data", app.onData, false);
    document.querySelector("#rect").addEventListener("click", app.onClick);
    for (i=0; i<Math.min(MODULES.length,8); i++) app.createModule(i,MODULES[i].name);
    if (typeof summon == "undefined") simulatePackets();
    else app.log("Running Signpost UI on Summon");
  },
  // Module Constructor
  createModule: function(i,name) {
    var svg = d3.select("#mod"+i);
    var module = document.querySelectorAll(".mod")[i];
    module.addEventListener("click", app.onClick);
    module.insertBefore(document.createTextNode(name),module.querySelector("svg"));
    switch(name) {
      case "Controller":
        app.projection = d3.geo.equirectangular();
        d3.json("js/map.json",function(e,geodata) {
          if (e) return app.log(e);
          svg.selectAll("path")
            .data(topojson.feature(geodata,geodata.objects.collection).features).enter().append("path")
            .attr("d",d3.geo.path().projection(app.projection.scale(19).translate([120/2,65/2])));
          svg.append("text").text("--.---° N ---.---° E").attr({ "x":60, "y":80 });
        });
        break;
      case "2.4GHz Spectrum":
      case "Audio Frequency":
        var box = { top:5, right:0, bottom:15, left:20, width:100, height:70 };
        var g = svg.append("g").attr({ "transform":"translate("+box.left+","+box.top+")" });
        app.x[i] = d3.scale.ordinal().rangeRoundBands([0, box.width], 0.1, 0.2).domain(MODULES[i].x);
        app.y[i] = d3.scale.linear().range([box.height, 0]).domain(MODULES[i].y);
        g.append("g").attr({ "class":"x axis", "transform":"translate(0,"+box.height+")" })
          .call(d3.svg.axis().scale(app.x[i]).orient("bottom").tickFormat(d3.format(".2s")));
        g.append("g").attr({ "class":"y axis" })
          .call(d3.svg.axis().scale(app.y[i]).orient("left").tickFormat(d3.format(".2s")));
        break;
      case "Microwave Radar":
        svg.append("text").text("0.0").attr({ "x":60, "y":55, "id":"velocity" });
        svg.append("text").text("m/s").attr({ "x":60, "y":75 });
        break;
      case "Ambient":
        svg.append("image").attr({ "x":20, "y":10, "width":20, "height":20, "xlink:href":"img/temperature.svg" });
        svg.append("text").attr({ "x":30, "y":40, "id":"temp"}).text("-- °C");
        svg.append("image").attr({ "x":80, "y":10, "width":20, "height":20, "xlink:href":"img/humidity.svg" });
        svg.append("text").attr({ "x":90, "y":40, "id":"hum"}).text("-- %");
        svg.append("image").attr({ "x":20, "y":55, "width":20, "height":20, "xlink:href":"img/light.svg" });
        svg.append("text").attr({ "x":30, "y":85, "id":"lux"}).text("-- lx");
        svg.append("image").attr({ "x":80, "y":55, "width":20, "height":20, "xlink:href":"img/pressure.svg" });
        svg.append("text").attr({ "x":90, "y":85, "id":"pres"}).text("-- kPa");
        break;
      case "Air Quality":
        svg.append("text").attr({ "x":60, "y":14, "class":"unit"}).text("CO₂");
        svg.append("text").attr({ "x":60, "y":32, "id":"co2"}).text("---");
        svg.append("text").attr({ "x":60, "y":41}).text("ppm");
        svg.append("text").attr({ "x":30, "y":57, "class":"unit"}).text("VOC(PID)");
        svg.append("text").attr({ "x":30, "y":75, "id":"vocp"}).text("---");
        svg.append("text").attr({ "x":30, "y":84}).text("ppb");
        svg.append("text").attr({ "x":90, "y":57, "class":"unit"}).text("VOC(IAQ)");
        svg.append("text").attr({ "x":90, "y":75, "id":"voci"}).text("---");
        svg.append("text").attr({ "x":90, "y":84}).text("ppb");
        break;
      case "Radio":
        var table = svg.append("foreignObject").attr({ "width":"100%", "height":"100%"}).append("xhtml:table");
        table.append("tr").html("<td>RADIO</td><td class='pkt'>PACKETS</td><td class='byt'>BYTES</td>");
        table.append("tr").html("<td>Lora </td><td class='lora pkt'>0</td><td class='lora byt'>0</td>");
        table.append("tr").html("<td>BLE  </td><td class='ble  pkt'>0</td><td class='ble  byt'>0</td>");
        table.append("tr").html("<td>Cell </td><td class='cell pkt'>0</td><td class='cell byt'>0</td>");
        break;
      case "Power Supply":
        var table = svg.append("foreignObject").attr({ "width":"100%", "height":"100%"}).append("xhtml:table");
        table.append("tr").html("<td>MODULE</td><td>STATE</td><td class='mah'>ENERGY[mAh]</td>");
        for (i=0; i<8; i=[1,2,5,8,8,6,7,8][i]) 
          table.append("tr").html("<td>"+i+"</td><td class='m"+i+" state'>-</td><td class='m"+i+" mah'>-</td>");
        break;
    }
  },
  // Module Data Updater 
  updateModule: function(i,data) {
    var svg = d3.select("#mod"+i);
    var mod = MODULES[i];
    var values = [];
    switch(mod.name) {
      case "Controller":
        var lat = data.latitude * (data.latitude_direction=="N"?1:-1); 
        var lon = data.longitude * (data.longitude_direction=="E"?1:-1);
        svg.selectAll("line").remove();
        svg.selectAll("line")
          .data([[[lon,-90],[lon,90]],[[-180,lat],[180,lat]]]).enter().append("line")
          .attr("x1", function(d) { return app.projection(d[0])[0]; })
          .attr("y1", function(d) { return app.projection(d[0])[1]; })
          .attr("x2", function(d) { return app.projection(d[1])[0]; })
          .attr("y2", function(d) { return app.projection(d[1])[1]; });
        svg.select("text").text(
          data.latitude.toFixed(3) + "° " + data.latitude_direction + " " +
          data.longitude.toFixed(3)+ "° " + data.longitude_direction );
        break;
      case "2.4GHz Spectrum":
        for (n in mod.x) values.push({ x:mod.x[n], y:data["channel_"+mod.x[n]] });
      case "Audio Frequency":
        if (!values.length) for (n in mod.x) values.push({ x:mod.x[n], y:data[mod.x[n]+"Hz"] });
        svg.select("g").selectAll(".bar").remove();
        svg.select("g").selectAll(".bar").data(values).enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return app.x[i](d.x); })
          .attr("width", app.x[i].rangeBand())
          .attr("y", function(d) { return app.y[i](d.y); })
          .attr("height", function(d) { return 70 - app.y[i](d.y); });
        break;
      case "Microwave Radar":
        svg.select("text").text( (data["motion"] * data["velocity_m/s"]).toFixed(1) );
        break;
      case "Ambient":
        svg.select("#temp").text(data.temperature_c.toFixed(1) + " °C");
        svg.select("#hum" ).text(data.humidity.toFixed(1) + " %");
        svg.select("#lux" ).text(data.light_lux.toFixed(1) + " lx");
        svg.select("#pres").text((data.pressure_pascals*1000).toFixed(1) + " kPa");
        break;
      case "Air Quality":
        svg.select("#co2" ).text(data.co2_ppm);
        svg.select("#vocp").text(data.VOC_PID_ppb);
        svg.select("#voci").text(data.VOC_IAQ_ppb);
        break;
      case "Power Supply":
        for (i=0; i<8; i=[1,2,5,8,8,6,7,8][i]) {
          svg.selectAll(".state.m"+i).text(data["module"+i+"_enabled"]?"On":"Off");
          svg.selectAll(".mah.m"+i).text(data["module"+i+"_energy_mAh"].toFixed(3));
        }
        break;
    }
  },
  // App Ready Event Handler
  onAppReady: function() {
    app.log("onAppReady");
    app.log("Checking if BLE is enabled...");
    summon.bluetooth.isEnabled(app.onEnable);
  },
  // App Paused Event Handler
  onPause: function() {
    app.log("Pause");
    summon.bluetooth.stopScan();
  },
  // New Data Received Event Handeler 
  onData: function(data) {
    app.updateModule(MODULES.findIndex(x=>x.dev==data.detail.device.substr(9)),data.detail);
  },
  // Bluetooth Enabled Callback
  onEnable: function() {
    app.onPause();
    summon.bluetooth.startScan([], app.onDiscover, app.onAppReady);
    app.log("Searching");
  },
  // BLE Device Discovered Callback
  onDiscover: function(device) {
    if (device.name == "Signpost") {
      app.log("Found " + device.name + " (" + device.id + ")!");
      var advertisement = device.advertisement;
      if (advertisement.serviceUuids.indexOf("181A") !== -1) {

        // Parse advertisement

      }
    }
  },
  // Module Click Event Handler
  onClick: function() {
    if (this.id!="rect" && document.body.style.transform=="") {
      el = this.getBoundingClientRect();
      x = window.innerWidth / 2 - el.width / 2 - el.left;
      y = window.innerHeight / 2 - el.height / 2 - el.top;
      s = Math.min(window.innerHeight,window.innerWidth) / (el.width + 20);
      document.body.style.transform = "scale("+s+") translate("+x+"px,"+y+"px)";
    } else document.body.style.transform = "";
  },
  // Function to Log Text to Screen
  log: function(string) {
    console.log(string);
  },
  x:{},
  y:{}
};

app.initialize();