var PREFIXES = ["http://www.","https://www.","http://","https://","urn:uuid:"];
var SUFFIXES = [".com/",".org/",".edu/",".net/",".info/",".biz/",".gov/",".com",".org",".edu",".net",".info",".biz",".gov"]; var p; var q;
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener("deviceready", app.onAppReady, false);
        document.addEventListener('pause', app.onPause, false);
        document.addEventListener('resume', app.onAppReady, false);
        WebPullToRefresh.init( { loadingFunction: app.onAppReady } );
        $(".pref").change(app.onPrefChange);
        $(".other").click(function(){
            window.gateway.setDeviceId($(this).attr('dev-id'));
            window.gateway.setDeviceName("hi"); 
            location.href='generated.html';
        });
    },
    onAppReady: function() {
        $('body').addClass(device.platform.toLowerCase());
        $(".pref").each(function(){$(this).prop("checked",window.localStorage.getItem($(this).attr("id"))=="true").flipswitch("refresh")});
        $('#devs').html('<li data-role="list-divider" id="other" class="other">Other Devices</li>');
        $("#other").hide();
        $("#count").html("0");
        app.peripherals = {};
        $.mobile.loading("show");
        ble.stopScan(function(){ ble.startScan([],app.onPeripheralFound); },app.onAppReady);
        ZeroConf.watch("_http._tcp.local.",app.onDiscover); 
        ZeroConf.watch("_tcp.local.",app.onDiscover); 
    },
    onPause: function() {
        ble.stopScan();
    },
    onDiscover: function(peripheral) {
        if (typeof app.peripherals[peripheral.service.qualifiedname] == "undefined") {
            console.log(peripheral);
            if (peripheral.service.application=="http") {
                $("#other").before("<li class='nsd item'><a href=\""+peripheral.service.urls[0]+"\";><img src='"+"'/><h2>" + peripheral.service.name + "</h2><p>" + peripheral.service.urls[0] + "<br/>"+ peripheral.service.server+" ("+peripheral.service.application +")</p></a><a href='#dialog' data-rel='popup' class='zmdi zmdi-more-vert' onclick='app.infoPopup(\""+peripheral.service.qualifiedname+"\",\"nsd\")'></a></li>");
            } else {
                $(".other:last-child").hide().after($("<li>",{class:"other item"}).attr('dev-id',peripheral.service.qualifiedname).hide().html(""+peripheral.service.name+" ("+peripheral.service.application +")"));
                if ($("#dv").prop("checked")) $(".other").show();
            }
            $("#devs").listview("refresh");
            app.peripherals[peripheral.service.qualifiedname] = peripheral;
        }
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
                        peripheral.meta = data.metadata[0];
                        $("#other").before("<li class='ble item'><a href='#' onclick='window.gateway.setDeviceId(\""+peripheral.id+"\"); window.gateway.setDeviceName(\""+peripheral.name+"\"); location.href=\""+peripheral.meta.url+"\";'><img src='"+peripheral.meta.icon+"'/><h2>" + peripheral.meta.title + "</h2><p>" + peripheral.meta.url + "<br/>"+ peripheral.name+" ("+peripheral.id +")</p></a><a href='#dialog' data-rel='popup' class='zmdi zmdi-more-vert' onclick='app.infoPopup(\""+peripheral.id+"\",\"ble\")'></a></li>");
                    } else $("#other").before("<li class='ble item'><a href='#' onclick='window.gateway.setDeviceId(\""+peripheral.id+"\"); window.gateway.setDeviceName(\""+peripheral.name+"\"); location.href=\""+peripheral.uri+"\";'><p>" + peripheral.uri + "<br/>"+ peripheral.name+" ("+peripheral.id +")</p></a></li>");
                    $.mobile.loading("hide");
                    $("#devs").listview("refresh");
                }).fail(function(){
                    q = app.getStoredObject('peripherals');
                    console.log(q);
                    if (typeof q[peripheral.id] != "undefined" && typeof (q[peripheral.id]).meta != undefined) {
                        peripheral.meta = (q[peripheral.id]).meta;
                        $("#other").before("<li class='item'><a href='#' onclick='window.gateway.setDeviceId(\""+peripheral.id+"\"); window.gateway.setDeviceName(\""+peripheral.name+"\"); location.href=\""+peripheral.meta.url+"\";'><img src='"+peripheral.meta.icon+"'/><h2>" + peripheral.meta.title + "</h2><p>" + peripheral.meta.url + "<br/>"+ peripheral.name+" ("+peripheral.id +")</p></a><a href='#dialog' data-rel='popup' class='zmdi zmdi-more-vert' onclick='app.infoPopup(\""+peripheral.id+"\",\"ble\")'></a></li>");
                    } else $("#other").before("<li class='item'><a href='#' onclick='window.gateway.setDeviceId(\""+peripheral.id+"\"); window.gateway.setDeviceName(\""+peripheral.name+"\"); location.href=\""+peripheral.uri+"\";'><p>" + peripheral.uri + "<br/>"+ peripheral.name+" ("+peripheral.id +")</p></a></li>");
                    $.mobile.loading("hide");
                    $("#devs").listview("refresh");
                });
            } else { 
                $(".other:last-child").hide().after($("<li>",{class:"other item"}).attr('dev-id',peripheral.id).hide().html("<a href='#' onclick='window.gateway.setDeviceId(\""+peripheral.id+"\"); window.gateway.setDeviceName(\""+peripheral.name+"\"); location.href=\"generated.html\";'>"+peripheral.name+" ("+peripheral.id +")</a>"));
                if ($("#dv").prop("checked")) $(".other").show();
            }
            $.mobile.loading("hide");
            $("#devs").listview("refresh");
            app.peripherals[peripheral.id] = peripheral;
            window.localStorage.setItem('peripherals',JSON.stringify($.extend(true,{},app.getStoredObject('peripherals'),app.peripherals)));
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
                if (type==22 && length>4 && data[1]==0xfe && (data[0]==0xd8 || data[0]==0xaa)) return data.subarray(2);
                index += length; //Advance
            }
        } 
        else if (advertisingdata.kCBAdvDataServiceData.FED8) return new Uint8Array(advertisingdata.kCBAdvDataServiceData.FED8);
        else if (advertisingdata.kCBAdvDataServiceData.FEAA) return new Uint8Array(advertisingdata.kCBAdvDataServiceData.FEAA);
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
        console.log(peripheral);
    },
    infoPopup: function(id,type) {
        p = app.peripherals[id];
        if (type=="ble") {
            $('#dh img').attr("src",p.meta.icon);
            $('#dh h3').html(p.meta.title)
            $("#dm p").html("<b>Device</b><br/>"+p.name+" ("+p.id+")<br/><br/><b>UI</b><br/>"+p.meta.url+"<br/><i>"+p.meta.description+"</i><br/><br/><b>Type</b><br/>"+(p.meta.cordova ? "Application<br /><br/><b>Plugins Used</b><br/>"+JSON.stringify(p.meta.cordova,null,4).replace(/[{},]/g,'') : "Website"));
            $("#dm #go").click(function(){window.gateway.setDeviceId(p.id); window.gateway.setDeviceName(p.name); location.href=p.meta.url;})
            $("#dm #gen").show().click(function(){window.gateway.setDeviceId(p.id); window.gateway.setDeviceName(p.name); location.href="generated.html";})
        } else if (type=="nsd") {
            $('#dh img').attr("src",'');
            $('#dh h3').html(p.service.name)
            $("#dm p").html("<b>Device</b><br/>"+p.service.server+" ("+p.service.application+")<br/><br/><b>UI</b><br/>"+p.service.urls[0]+"<br/><i>"+p.service.qualifiedname + "<br/>" + p.service.description+"</i><br/><br/><b>Type</b><br/>"+"Local Network Content");
            $("#dm #go").click(function(){location.href=p.service.urls[0];});
            $("#dm #gen").hide();
        }
    },
    getStoredObject: function(name) {
        try { return JSON.parse(window.localStorage.getItem(name)); } 
        catch (e) { return {} }
    },
    peripherals: {}
};
app.initialize();

