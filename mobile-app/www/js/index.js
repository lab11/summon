var PWPREFIXES = ["http://www.","https://www.","http://","https://","urn:uuid:"];
var PWSUFFIXES = [".com/",".org/",".edu/",".net/",".info/",".biz/",".gov/",".com",".org",".edu",".net",".info",".biz",".gov"]; var q;
var BSPREFIXES = [undefined,undefined,"aaa:","aaas:","about:","acap:","acct:","cap:","cid:","coap:","coaps:","crid:","data:","dav:","dict:","dns:","file:","ftp:","geo:","go:","gopher:","h323:","http:","https:","iax:","icap:","im:","imap:","info:","ipp:","ipps:","iris:","iris.beep:","iris.xpc:","iris.xpcs:","iris.lwz:","jabber:","ldap:","mailto:","mid:","msrp:","msrps:","mtqp:","mupdate:","news:","nfs:","ni:","nih:","nntp:","opaquelocktoken:","pop:","pres:","reload:","rtsp:","rtsps:","rtspu:","service:","session:","shttp:","sieve:","sip:","sips:","sms:","snmp:","soap.beep:","soap.beeps:","stun:","stuns:","tag:","tel:","telnet:","tftp:","thismessage:","tn3270:","tip:","turn:","turns:","tv:","urn:","vemmi:","ws:","wss:","xcon:","xcon-userid:","xmlrpc.beep:","xmlrpc.beeps:","xmpp:","z39.50r:","z39.50s:","acr:","adiumxtra:","afp:","afs:","aim:","apt:","attachment:","aw:","barion:","beshare:","bitcoin:","bolo:","callto:","chrome:","chrome-extension:","com-eventbrite-attendee:","content:","cvs:","dlna-playsingle:","dlna-playcontainer:","dtn:","dvb:","ed2k:","facetime:","feed:","feedready:","finger:","fish:","gg:","git:","gizmoproject:","gtalk:","ham:","hcp:","icon:","ipn:","irc:","irc6:","ircs:","itms:","jar:","jms:","keyparc:","lastfm:","ldaps:","magnet:","maps:","market:","message:","mms:","ms-help:","ms-settings-power:","msnim:","mumble:","mvn:","notes:","oid:","palm:","paparazzi:","pkcs11:","platform:","proxy:","psyc:","query:","res:","resource:","rmi:","rsync:","rtmfp:","rtmp:","secondlife:","sftp:","sgn:","skype:","smb:","smtp:","soldat:","spotify:","ssh:","steam:","submit:","svn:","teamspeak:","teliaeid:","things:","udp:","unreal:","ut2004:","ventrilo:","view-source:","webcal:","wtai:","wyciwyg:","xfire:","xri:","ymsgr:","example:","ms-settings-cloudstorage:"]
var cperipheral = null;
var UI_Array;
var read_count = 0;
var read_to = 0;
var size = 0;
var fileUrl = null;
var dirUrl = null;
var scanEnabled = false;
var app = {
    initialize: function() {
        try { this.bindEvents(); } catch (e) {alert(e);}
    },
    bindEvents: function() {
        document.addEventListener("deviceready", app.onAppReady, false);
        document.addEventListener('pause', app.onPause, false);
        document.addEventListener('resume', app.onAppReady, false);
        WebPullToRefresh.init( { loadingFunction: app.onAppReady } );
        $(".pref").change(app.onPrefChange);
    },
    onAppReady: function() {
        $('body').addClass(device.platform.toLowerCase());
        $(".pref").each(function(){$(this).prop("checked",localStorage.getItem($(this).attr("id"))!="false").flipswitch("refresh")});
        $('#devs').html($("<li>",{"data-role":"list-divider",id:"other",class:"other"}).html("Other Devices"));
        $("#other").hide();
        gateway.cache($("#ch").prop("checked"));
        $("#count").html("0");
        app.peripherals = {};
        $.mobile.loading("show");
        ble.isEnabled(app.scan,function(){ble.enable(app.onAppReady,null)});
        // nfc.addNdefListener(app.onNfcFound, function(){console.log("nfc success")}, function(){console.log("nfc fail")});
        if(navigator.network.connection.type != Connection.NONE){
            ZeroConf.watch("_http._tcp.local.",app.onDiscover); 
            ZeroConf.watch("_tcp.local.",app.onDiscover); 
        }
        return new Promise( function( resolve, reject ) {resolve()} );
    },
    onPause: function() {
        ble.stopScan();
        scanEnabled = false;
        // nfc.removeNdefListener(app.onNfcFound);
    },
    scan: function() {
        scanEnabled = true;
        ble.stopScan(function(){
            ble.startScan([],app.onPeripheralFound,function(e){console.log(e)});
            setTimeout(function(){if (scanEnabled) app.scan()},2000);
        },app.onAppReady);
    },
    onDiscover: function(peripheral) {
        if (typeof app.peripherals[peripheral.service.qualifiedname] == "undefined") {
            console.log(peripheral); 
            app.peripherals[peripheral.service.qualifiedname] = peripheral;
            if (peripheral.service.application=="http") {
                n = peripheral.service.qualifiedname;
                (function(n){
                    $("#other").before($("<li>",{class:"nsd item","dev-rssi":-200}).append($("<a>",{href:peripheral.service.urls[0]}).append($("<img>",{src:"img/dnssd.svg"})).append($("<h2>").html(peripheral.service.name)).append($("<p>").html(peripheral.service.urls[0]+"<br/>"+peripheral.service.server+" ("+peripheral.service.application+")"))).append($("<a>",{href:"#dialog","data-rel":"popup","data-transition":"pop",class:"zmdi zmdi-more-vert",onclick:"app.infoPopup(n,'nsd')"})));
                })(n);
            } else {
                $(".other:last-child").hide().after($("<li>",{class:"other item"}).attr('dev-id',peripheral.service.qualifiedname).hide().html(""+peripheral.service.name+" ("+peripheral.service.application +")"));
                if ($("#dv").prop("checked")) $(".other").show();
            }
            $.mobile.loading("hide");
            $("#devs").listview("refresh");
        }
    },
    // onNfcFound: function(nfcEvent) {
    //     console.log(nfcEvent);
    // },
    onPrefChange: function() {
        localStorage.setItem($(this).attr("id"),$(this).prop("checked"));
        if ($(this).attr("id")=="dv") $(this).prop("checked") ? $(".other").show() : $(".other").hide();
        else if ($(this).attr("id")=="ch") gateway.cache($(this).prop("checked"));
        if ($("#other").is( "li:last-child" )) $("#other").hide();
    },
    onPeripheralFound: function(peripheral) {
        adData = app.getServiceData(peripheral);
        if (!peripheral.name) peripheral.name = "";
        if (typeof adData != "undefined" && adData) {
            app.parseAdData(peripheral,adData);
            $('li.other[dev-id="'+peripheral.id+'"]').remove(); 
            if ($('li[dev-id="'+peripheral.id+'"]:not(.other)').length==0) { 
                $("#other").before($("<li>",{class:"item","dev-id":peripheral.id}).append($("<a>",{href:'#',style:"opacity:.5; pointer-events:none"}).append($("<img>",{src:"img/ble.svg"})).append($("<h2>").html(peripheral.name+" ("+peripheral.id+")")).append($("<p>").html(peripheral.uri+"<br/>"+peripheral.name+" ("+peripheral.id+")"))));
                $('li[dev-id="'+peripheral.id+'"]').attr("dev-rssi",peripheral.rssi);
                $(".item:not(.other)").each(function(i){
                    if (peripheral.rssi < $(this).attr("dev-rssi")) $(this).before($('li[dev-id="'+peripheral.id+'"]'));
                });
            }
            if (peripheral.uri != "Local") {
                $.post("https://summon-caster.appspot.com/resolve-scan",JSON.stringify({objects:[{url:peripheral.uri}]}),function(data){
                    if (data.metadata[0]) {
                        peripheral.meta = data.metadata[0];
                        peripheral.apps = JSON.parse(gateway.checkApps(peripheral.meta.url));
                        $('li[dev-id="'+peripheral.id+'"]').addClass("ble").html($("<a>",{href:'#'}).click(function(){app.go(peripheral.id)}).append($("<img>",{src:peripheral.meta.icon}).error(function(){$(this).attr("src","img/ble.svg")})).append($("<h2>").html(peripheral.meta.title)).append($("<p>").html(peripheral.meta.url+"<br/>"+peripheral.name+" ("+peripheral.id +")"))).append($("<a>",{href:'#dialog',"data-rel":'popup',"data-transition":"pop",class:'zmdi zmdi-more-vert',onclick:"app.infoPopup(\""+peripheral.id+"\",\"ble\")"}));
                    } else $('li[dev-id="'+peripheral.id+'"]').addClass("ble").html($("<a>",{href:'#',onclick:"app.go(\""+peripheral.id+"\");"}).append($("<p>").html(peripheral.uri+"<br/>"+peripheral.name+" ("+peripheral.id +")")));
                    $.mobile.loading("hide");
                    app.peripherals[peripheral.id] = peripheral;
                    localStorage.setItem("peripherals",JSON.stringify($.extend(true,{},app.getStoredObject("peripherals"),app.peripherals)));
                    $("#devs").listview("refresh");
                }).fail(function(){
                    q = app.getStoredObject('peripherals');
                    if (typeof q[peripheral.id] != "undefined" && typeof (q[peripheral.id]).meta != undefined) {
                        peripheral.meta = (q[peripheral.id]).meta;
                        $('li[dev-id="'+peripheral.id+'"]').html($("<a>",{href:'#'}).click(function(){app.go(peripheral.id)}).append($("<img>",{src:peripheral.meta.icon}).error(function(){$(this).attr("src","img/ble.svg")})).append($("<h2>").html(peripheral.meta.title)).append($("<p>").html(peripheral.meta.url+"<br/>"+peripheral.name+" ("+peripheral.id+")"))).append($("<a>",{href:"#dialog","data-rel":"popup","data-transition":"pop",class:"zmdi zmdi-more-vert"}).click(function(){app.infoPopup(peripheral.id,"ble")}));
                        app.peripherals[peripheral.id] = peripheral;
                    } else if(peripheral.ad==2) {
                        $('li[dev-id="'+peripheral.id+'"]').addClass("ble").html($("<a>",{href:"#loadview","data-rel":"popup","data-transition":"pop",}).click(function(){app.uiLoad(peripheral.id);}).append($("<img>",{src:"img/ble.svg"})).append($("<h2>").html(peripheral.name+" ("+peripheral.id+")")).append($("<p>").html(peripheral.uri+"<br/>"+peripheral.name+" ("+peripheral.id+")")));
                    } else $('li[dev-id="'+peripheral.id+'"]').html($("<a>",{href:'#'}).click(function(){app.go(peripheral.id);}).append($("<p>").html(peripheral.uri+"<br/>"+peripheral.name+" ("+peripheral.id+")")));
                    $.mobile.loading("hide");
                    $("#devs").listview("refresh");
                });
            } else $('li[dev-id="'+peripheral.id+'"]').addClass("ble").html($("<a>",{href:"#loadview","data-rel":"popup","data-transition":"pop",}).click(function(){app.uiLoad(peripheral.id);}).append($("<img>",{src:"img/ble.svg"})).append($("<h2>").html(peripheral.name+" ("+peripheral.id+")")).append($("<p>").html(peripheral.uri+"<br/>"+peripheral.name+" ("+peripheral.id+")")));
        } else if ($('li[dev-id="'+peripheral.id+'"]:not(.other)').length==0) { 
            if ($('li.other[dev-id="'+peripheral.id+'"]').length==0) $(".other:last-child").hide().after($("<li>",{class:"other item","dev-id":peripheral.id}).hide().append($("<a>",{href:"#"}).click(function(){app.go(peripheral.id,-1);}).html(peripheral.name+" ("+peripheral.id +")")));
            if ($("#dv").prop("checked")) $(".other").show();
        }
        $.mobile.loading("hide");
        $("#devs").listview("refresh");
        app.peripherals[peripheral.id] = $.extend(peripheral,app.peripherals[peripheral.id]);
        if (typeof app.peripherals[peripheral.id].ads == "undefined") app.peripherals[peripheral.id].ads = [peripheral.advertising];
        if (JSON.stringify(app.peripherals[peripheral.id].ads||[]).indexOf(JSON.stringify(peripheral.advertising))==-1) app.peripherals[peripheral.id].ads.push(peripheral.advertising);
        localStorage.setItem("peripherals",JSON.stringify($.extend(true,{},app.getStoredObject("peripherals"),app.peripherals)));
    },
    getServiceData: function(peripheral) {
        advertisingdata = peripheral.advertising;
        if (device.platform=="Android") {
            scanRecord = new Uint8Array(advertisingdata);
            peripheral.advertising = Array.apply(null,scanRecord);
            index = 0;
            provided = false;
            while (index < scanRecord.length) {
                length = scanRecord[index++];
                if (length == 0) return null; //Done once we run out of records
                type = scanRecord[index];
                if (type == 0) return null; //Done if our record isn't a valid type
                data = scanRecord.subarray(index + 1, index + length); 
                if ((type==8 || type==9) && String.fromCharCode.apply(null,data)=="UI_GEN") return {uri:new Uint8Array("Local".split('').map(function(c){return c.charCodeAt(0);})),ad:2};
                if (type==22 && length>4 && data[1]==0xfe && (data[0]==0xd8 || data[0]==0xaa)) return {uri:data.subarray(2),ad:0};
                if (type==22 && length>4 && data[1]==0xfd && (data[0]==0xd8 || data[0]==0xaa)) return {uri:data.subarray(2),ad:2};
                if (type==36) return {uri:data,ad:1};
                if (type==37) return {uri:data,ad:2};
                index += length; //Advance
            }
        } 
        else if (advertisingdata.kCBAdvDataServiceData.FED8) return new Uint8Array(advertisingdata.kCBAdvDataServiceData.FED8);
        else if (advertisingdata.kCBAdvDataServiceData.FEAA) return new Uint8Array(advertisingdata.kCBAdvDataServiceData.FEAA);
        return null;
    },
    parseAdData: function(peripheral,adData) {
        if (adData.ad==0) {
            peripheral.flags = adData.uri[0]; // flag is the 1st byte
            peripheral.txPower = adData.uri[1]; // TX Power is 2nd byte
            uriScheme = adData.uri[2];
            uriData = adData.uri.subarray(3); // remainder in the URI
        } else {
            uriScheme = adData.uri[0];
            uriData = adData.uri.subarray(1); // remainder in the URI
        } 
        uri = '';
        if (adData.ad==1 && typeof BSPREFIXES[uriScheme] != "undefined") uri = BSPREFIXES[uriScheme];
        else if (uriScheme < PWPREFIXES.length) uri = PWPREFIXES[uriScheme]; // valid prefix, uncompress
        else uri = String.fromCharCode(uriScheme); // invalid prefix, just append character
        for (x = 0; x < uriData.length; x++) {
            if (uriData[x] < PWSUFFIXES.length) uri += PWSUFFIXES[uriData[x]]; // valid suffix, uncompress
            else uri += String.fromCharCode(uriData[x]); // regular character, just append
        }
        peripheral.uri = uri;
        peripheral.ad = adData.ad;
    },
    go: function(id,n) {
        p = app.peripherals[id];
        gateway.setDeviceAdvertisement( JSON.stringify( {id:p.id,name:p.name,rssi:p.rssi,advertising:p.advertising,ads:p.ads} ) ); 
        url = (n<0) ? "file:///android_asset/www/generated.html" : (p.meta && p.meta.url) ? p.meta.url : p.uri;
        (p.apps && p.apps.length) ? gateway.go(url,p.apps[n||0].package,p.apps[n||0].activity) : gateway.go(url);
    },
    infoPopup: function(id,type) {
        p = app.peripherals[id];
        if (type=="ble") {
            if (p.id!=id) {setTimeout(function(){app.infoPopup(id,type)},50); return;}
            $('#dh img').attr("src",p.meta.icon||"img/ble.svg").error(function(){$(this).attr("src","img/ble.svg")});
            $('#dh h3').html(p.meta.title);
            $('#dm #dev').html(p.name+" ("+p.id+")<br/>"+p.meta.url);
            $("#dm #ui").html("");
            for (n in p.apps) $("#dm #ui").append($("<span>").html("NATIVE APP : "+p.apps[n].name+"<br/>").append($("<a>",{href:"#",class:"ui-btn ui-btn-raised clr-primary"}).html("Open "+p.apps[n].name).click(function(){app.go(p.id,n);})).append("<br/>"));
            $("#dm #ui").append("WEB CONTENT : "+p.meta.title+"<br/><i>"+p.meta.description+"</i><br/>"+(p.meta.cordova ? "<br/>Plugins Used:<br/>"+JSON.stringify(p.meta.cordova,null,"<br/>").replace(/[{},]/g,'') : "<br>"));
            $("#dm #go").click(function(){app.go(p.id);})
            $("#dm #gen").show().click(function(){app.go(p.id,-1);})
        } else if (type=="nsd") {
            $('#dh img').attr("src",'img/dnssd.svg');
            $('#dh h3').html(p.service.name)
            $('#dm #dev').html(p.service.server+" ("+p.service.application+")<br/>"+p.service.urls[0]);
            $("#dm #ui").html("");
            for (n in p.apps) $("#dm #ui").append($("<span>").html("NATIVE APP : "+p.apps[n].name+"<br/>").append($("<a>",{href:"#",class:"ui-btn ui-btn-raised clr-primary"}).html("Open "+p.apps[n].name).click(function(){app.go(p.id,n);})).append("<br/>"));
            $("#dm #ui").append("LOCAL WEB CONTENT : "+p.service.name+"<br/><i>"+p.service.qualifiedname+"<br/>"+p.service.description+"</i><br/>");
            $("#dm #go").click(function(){location.href=p.service.urls[0];});
            $("#dm #gen").hide();
        }
    },
    getStoredObject: function(name) {
        try { return JSON.parse(localStorage.getItem(name)); } 
        catch (e) { return {} }
    },
    uiLoad: function(id) {
        p = app.peripherals[id];
        gateway.setDeviceAdvertisement( JSON.stringify( {id:p.id,name:p.name,rssi:p.rssi,advertising:p.advertising,ads:p.ads} ) ); 
        $('#lh h3').html(p.name + "(" + p.id + ")");
        $('#lm h4').html('Connecting.').attr("dev-id",id);
        $('#lm .ui-slider-track').css("margin","0 15px");
        $('#lm input').val(0).slider("refresh");
        requestFileSystem(TEMPORARY, 0, function(fs) {
            fs.root.getDirectory('temp', {create: true}, function(dirEntry) {
                dirEntry.removeRecursively(function() { console.log('Directory removed.'); }, function(e) {console.log("ERROR",e)});
            });
        });
        ble.connect(id, app.onConnect, app.onDisconnect);
    },
    onConnect: function(peripheral) {
        $('#lm h4').html('Connected. Reading.');
        $('#lm input').val(10).slider("refresh");
        cperipheral = peripheral;
        //find out how long the UI is by reading len
        ble.read(peripheral.id, peripheral.services[2], peripheral.characteristics[3].characteristic, app.onData, app.onError);
        ble.stopScan(function(){},function(reason){});
        scanEnabled = false;
    },
    onData: function(buffer) {
        if(read_count == 0) {
            var data = new Uint8Array(buffer);
            console.log(data[0]);
            read_count += 1;
            ble.read(cperipheral.id, cperipheral.services[2], cperipheral.characteristics[4].characteristic, app.onData, app.onError);
            $('#lm input').val(15).slider("refresh");
        } else if(read_count == 1) {
            var data = new Uint32Array(buffer);
            console.log(data[0]);
            size = data[0];
            UI_Array = new Uint8Array(size);
            read_to = Math.ceil(data[0]/512) + 1;
            $('#lm input').val(20).slider("refresh");
            ble.read(cperipheral.id, cperipheral.services[2], cperipheral.characteristics[5].characteristic, app.onData, app.onError);
            read_count += 1;
        } else if(read_count > 1 && read_count < read_to) {
            UI_Array.set(new Uint8Array(buffer), (read_count-2)*512);
            console.log(read_count);
            $('#lm input').val(20- -Math.round(read_count/read_to*50)).slider("refresh");
            console.log(20- -Math.round(read_count/read_to*55));
            ble.read(cperipheral.id, cperipheral.services[2], cperipheral.characteristics[read_count + 4].characteristic, app.onData, app.onError);
            read_count += 1;
        } else {
            //finish off byte array
            UI_Array.set(new Uint8Array(buffer), (read_count-2)*512);
            ble.disconnect(cperipheral.id);

            console.log(UI_Array.byteLength);
            console.log(String.fromCharCode.apply(null, UI_Array));

            onError = function(e) {console.log("ERROR: " + e)};
            requestFileSystem(TEMPORARY, 0, function(fs) {
                fs.root.getDirectory('temp', {create: true}, function(dirEntry) {
                    dirUrl = dirEntry.toURL();
                    console.log("dir success"); 
                    fs.root.getFile('www.bin', {create: true}, function(fileEntry) {
                        fileEntry.createWriter(function(writer) {
                            console.log(writer);
                            fileUrl = fileEntry.toURL();
                            writer.onwrite = function(d) {
                                console.log("write success",d); 
                                console.log(fileUrl + " -> " + dirUrl);
                                if (fileUrl!=null && dirUrl!=null) 
                                    zip.unzip(fileUrl, dirUrl, function(result) {
                                        console.log("write zip " + result);
                                        if (result==0) {
                                            $('#lm h4').html('Connected. Read. Loaded. Opening.');
                                            $('#lm input').val(100).slider("refresh");
                                            dirEntry.createReader().readEntries (function(results) { console.log(results) }, onError);
                                            location = dirUrl+"/www/index.html";
                                        } else {
                                            app.onError("Failed to load.")
                                        }
                                    }, function(progressEvent) { 
                                        $('#lm h4').html('Connected. Read. Loading.');
                                        $('#lm input').val(75+Math.round(progressEvent.loaded/progressEvent.total*25)).slider("refresh");
                                        console.log(progressEvent.loaded,progressEvent.total); 
                                    });
                            };
                            writer.onerror = onError;
                            writer.write(UI_Array.buffer);
                        }, onError);
                    }, onError);
                }, onError);
            }, onError);
        }
    },
    onDisconnect: function(){},
    onError: function(e) {
        ble.disconnect(cperipheral.id);
        $('#lm h4').html('Error. ' + e + '<br /><a href="#" onclick="app.uiLoad('+cperipheral.id+')">Retry</a> | <a href="#" data-rel="back" onclick="app.onAppReady()">Close</a>');
    },
    peripherals: {}
};
app.initialize();

