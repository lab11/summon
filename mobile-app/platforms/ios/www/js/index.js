var SERVICE_UUID = 'fed8';
var PREFIXES = ["http://www.","https://www.","http://","https://","urn:uuid:"];
var SUFFIXES = [".com/",".org/",".edu/",".net/",".info/",".biz/",".gov/",".com",".org",".edu",".net",".info",".biz",".gov"]; var p;
var app = {
    initialize: function() {
        this.bindEvents();
        $.mobile.defaultHomeScroll = 0;
    },
    bindEvents: function() {
        document.addEventListener("deviceready", app.onAppReady, false);
        document.addEventListener('pause', app.onPause, false);
        document.addEventListener('resume', app.onAppReady, false);
        $('#list').scrollz({ pull : true });
        $('#list').bind('pulled', app.onAppReady);
        $(".pref").change(app.onPrefChange);
    },
    onAppReady: function() {
        $(".pref").each(function(){$(this).prop("checked",window.localStorage.getItem($(this).attr("id"))=="true").flipswitch("refresh")});
        $('#devs').html('<li data-role="list-divider" id="other" class="other">Other BLE Devices</li>');
        $("#other").hide();
        $("#count").html("0");
        app.peripherals = {};
        $('#list').scrollz('hidePullHeader');
        $.mobile.loading("show");
        ble.stopScan(function(){
            ble.startScan([],app.onPeripheralFound);
        },app.onAppReady);
    },
    onPause: function() {
        ble.stopScan();
    },
    onPrefChange: function() {
        window.localStorage.setItem($(this).attr("id"),$(this).prop("checked"));
        if ($(this).attr("id")=="dv") $(this).prop("checked") ? $(".other").show() : $(".other").hide();
        if ($("#other").is( "li:last-child" )) $("#other").hide();
    },
    onPeripheralFound: function(peripheral) {
        if (typeof app.peripherals[peripheral.id] == "undefined") {
            data = app.getServiceData(peripheral.advertising);
            if (typeof data != "undefined" && data) {
                app.parseUriBeacon(peripheral,data);
                $.post("https://summon-caster.appspot.com/resolve-scan",JSON.stringify({objects:[{url:peripheral.uri}]}),function(data){
                    if (data.metadata[0]) {
                        $("#other").before("<li><a href='#' onclick='window.gateway.setDeviceId(\""+peripheral.id+"\"); window.gateway.setDeviceName(\""+peripheral.name+"\"); location.href=\""+data.metadata[0].url+"\";'><img src='"+data.metadata[0].icon+"'/><h3>" + data.metadata[0].title + "</h3><p>" + data.metadata[0].url + "<br/>"+ peripheral.name+" ("+peripheral.id +")</p></a><a href='#dialog' data-rel='popup' data-position-to='window' onclick='app.infoPopup(\""+peripheral.id+"\")'></a></li>");
                        peripheral.meta = data.metadata[0];
                    } else $("#other").before("<li><a href='#' onclick='window.gateway.setDeviceId(\""+peripheral.id+"\"); window.gateway.setDeviceName(\""+peripheral.name+"\"); location.href=\""+peripheral.uri+"\";'><p>" + peripheral.uri + "<br/>"+ peripheral.name+" ("+peripheral.id +")</p></a></li>");
                    $.mobile.loading("hide");
                    $("#devs").listview("refresh");
                    $("#count").html($("#count").html()- -1);
                });
            } else { 
                $("#other").hide().after($("<li>",{class:"other"}).hide().html(peripheral.name+" ("+peripheral.id +")"));
                $.mobile.loading("hide");
                $("#devs").listview("refresh");
                if ($("#dv").prop("checked")) $(".other").show();
            }
            app.peripherals[peripheral.id] = peripheral;
        }
    },
    getServiceData: function(advertisingdata) {
        if (device.platform=="Android") {
            scanRecord = new Uint8Array(advertisingdata);
            index = 0;
            while (index < scanRecord.length) {
                length = scanRecord[index++];
                if (length == 0) return null; //Done once we run out of records
                type = scanRecord[index];
                if (type == 0) return null; //Done if our record isn't a valid type
                data = scanRecord.subarray(index + 1, index + length); 
                if (type==22 && length>4 && data[0]==0xd8 && data[1]==0xfe) return data.subarray(2);
                index += length; //Advance
            }
        } else if (advertisingdata.kCBAdvDataServiceData.FED8) return new Uint8Array(advertisingdata.kCBAdvDataServiceData.FED8);
        return null;
    },
    parseUriBeacon: function(peripheral,data) {
        peripheral.flags = data[0]; // flag is the 1st byte
        peripheral.txPower = data[1]; // TX Power is 2nd byte
        uriScheme = data[2];
        uriData = data.subarray(3); // remainder in the URI
        uri = '';
        if (uriScheme < PREFIXES.length) uri = PREFIXES[uriScheme]; // valid prefix, uncompress
        else uri = String.fromCharCode(uriScheme); // invalid prefix, just append character
        for (x = 0; x < uriData.length; x++) {
            if (uriData[x] < SUFFIXES.length) uri += SUFFIXES[uriData[x]]; // valid suffix, uncompress
            else uri += String.fromCharCode(uriData[x]); // regular character, just append
        }
        peripheral.uri = uri;
    },
    infoPopup: function(id) {
        p = app.peripherals[id];
        $('#dh img').attr("src",p.meta.icon);
        $('#dh h3').html(p.meta.title)
        $("#dm p").html("<b>Device</b><br/>"+p.name+" ("+p.id+")<br/><br/><b>UI</b><br/>"+p.meta.url+"<br/><i>"+p.meta.description+"</i><br/><br/><b>Type</b><br/>"+(p.meta.cordova ? "Application<br /><br/><b>Plugins Used</b><br/>"+JSON.stringify(p.meta.cordova,null,4).replace(/[{},]/g,'') : "Website"));
        $("#dm #go").click(function(){window.gateway.setDeviceId(p.id); window.gateway.setDeviceName(p.name); location.href=p.meta.url;})
    },
    peripherals: {}
};
app.initialize();
