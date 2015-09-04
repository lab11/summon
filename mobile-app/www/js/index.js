var PWPREFIXES = ["http://www.","https://www.","http://","https://","urn:uuid:"];
var PWSUFFIXES = [".com/",".org/",".edu/",".net/",".info/",".biz/",".gov/",".com",".org",".edu",".net",".info",".biz",".gov"]; var p; var q;
var BSPREFIXES = [undefined,undefined,"aaa:","aaas:","about:","acap:","acct:","cap:","cid:","coap:","coaps:","crid:","data:","dav:","dict:","dns:","file:","ftp:","geo:","go:","gopher:","h323:","http:","https:","iax:","icap:","im:","imap:","info:","ipp:","ipps:","iris:","iris.beep:","iris.xpc:","iris.xpcs:","iris.lwz:","jabber:","ldap:","mailto:","mid:","msrp:","msrps:","mtqp:","mupdate:","news:","nfs:","ni:","nih:","nntp:","opaquelocktoken:","pop:","pres:","reload:","rtsp:","rtsps:","rtspu:","service:","session:","shttp:","sieve:","sip:","sips:","sms:","snmp:","soap.beep:","soap.beeps:","stun:","stuns:","tag:","tel:","telnet:","tftp:","thismessage:","tn3270:","tip:","turn:","turns:","tv:","urn:","vemmi:","ws:","wss:","xcon:","xcon-userid:","xmlrpc.beep:","xmlrpc.beeps:","xmpp:","z39.50r:","z39.50s:","acr:","adiumxtra:","afp:","afs:","aim:","apt:","attachment:","aw:","barion:","beshare:","bitcoin:","bolo:","callto:","chrome:","chrome-extension:","com-eventbrite-attendee:","content:","cvs:","dlna-playsingle:","dlna-playcontainer:","dtn:","dvb:","ed2k:","facetime:","feed:","feedready:","finger:","fish:","gg:","git:","gizmoproject:","gtalk:","ham:","hcp:","icon:","ipn:","irc:","irc6:","ircs:","itms:","jar:","jms:","keyparc:","lastfm:","ldaps:","magnet:","maps:","market:","message:","mms:","ms-help:","ms-settings-power:","msnim:","mumble:","mvn:","notes:","oid:","palm:","paparazzi:","pkcs11:","platform:","proxy:","psyc:","query:","res:","resource:","rmi:","rsync:","rtmfp:","rtmp:","secondlife:","sftp:","sgn:","skype:","smb:","smtp:","soldat:","spotify:","ssh:","steam:","submit:","svn:","teamspeak:","teliaeid:","things:","udp:","unreal:","ut2004:","ventrilo:","view-source:","webcal:","wtai:","wyciwyg:","xfire:","xri:","ymsgr:","example:","ms-settings-cloudstorage:"]
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
        $('#devs').html($("<li>",{"data-role":"list-divider",id:"other",class:"other"}).html("Other Devices"));
        $("#other").hide();
        $("#count").html("0");
        app.peripherals = {};
        $.mobile.loading("show");
        ble.stopScan(function(){ ble.startScan([],app.onPeripheralFound); },app.onAppReady);
        ZeroConf.watch("_http._tcp.local.",app.onDiscover); 
        ZeroConf.watch("_tcp.local.",app.onDiscover); 
        return new Promise( function( resolve, reject ) {resolve()} );
    },
    onPause: function() {
        ble.stopScan();
    },
    onDiscover: function(peripheral) {
        if (typeof app.peripherals[peripheral.service.qualifiedname] == "undefined") {
            console.log(peripheral);
            app.peripherals[peripheral.service.qualifiedname] = peripheral;
            if (peripheral.service.application=="http") {
                n = peripheral.service.qualifiedname;
                (function(n){
                    $("#other").before($("<li>",{class:"nsd item"}).append($("<a>",{href:peripheral.service.urls[0]}).append($("<img>",{src:"img/dnssd.svg"})).append($("<h2>").html(peripheral.service.name)).append($("<p>").html(peripheral.service.urls[0]+"<br/>"+peripheral.service.server+" ("+peripheral.service.application+")"))).append($("<a>",{href:"#dialog","data-rel":"popup",class:"zmdi zmdi-more-vert",onclick:"app.infoPopup(n,'nsd')"})));
                })(n);
            } else {
                $(".other:last-child").hide().after($("<li>",{class:"other item"}).attr('dev-id',peripheral.service.qualifiedname).hide().html(""+peripheral.service.name+" ("+peripheral.service.application +")"));
                if ($("#dv").prop("checked")) $(".other").show();
            }
            $.mobile.loading("hide");
            $("#devs").listview("refresh");
        }
    },
    onPrefChange: function() {
        window.localStorage.setItem($(this).attr("id"),$(this).prop("checked"));
        if ($(this).attr("id")=="dv") $(this).prop("checked") ? $(".other").show() : $(".other").hide();
        if ($("#other").is( "li:last-child" )) $("#other").hide();
    },
    onPeripheralFound: function(peripheral) {
       if (typeof app.peripherals[peripheral.id] == "undefined") {
            adData = app.getServiceData(peripheral.advertising);
            if (typeof adData != "undefined" && adData) {
                app.parseAdData(peripheral,adData);
                $.post("https://summon-caster.appspot.com/resolve-scan",JSON.stringify({objects:[{url:peripheral.uri}]}),function(data){
                    if (data.metadata[0]) {
                        peripheral.meta = data.metadata[0];
                        peripheral.apps = JSON.parse(window.gateway.checkApps(peripheral.meta.url));
                        $("#other").before($("<li>",{class:'ble item'}).append($("<a>",{href:'#',onclick:"window.gateway.setDeviceId(\""+peripheral.id+"\"); window.gateway.setDeviceName(\""+peripheral.name+"\"); window.gateway.go(\""+peripheral.meta.url+"\""+(peripheral.apps.length?",\""+peripheral.apps[0].package+"\",\""+peripheral.apps[0].activity+"\"":"")+");"}).append($("<img>",{src:peripheral.meta.icon})).append($("<h2>").html(peripheral.meta.title)).append($("<p>").html(peripheral.meta.url+"<br/>"+peripheral.name+" ("+peripheral.id +")"))).append($("<a>",{href:'#dialog',"data-rel":'popup',class:'zmdi zmdi-more-vert',onclick:"app.infoPopup(\""+peripheral.id+"\",\"ble\")"})));
                    } else $("#other").before($("<li>",{class:'ble item'}).append("<a>",{href:'#',onclick:"window.gateway.setDeviceId(\""+peripheral.id+"\"); window.gateway.setDeviceName(\""+peripheral.name+"\"); window.gateway.go(\""+peripheral.uri+"\");"}).append($("<p>").html(peripheral.uri+"<br/>"+peripheral.name+" ("+peripheral.id +")")));
                    $.mobile.loading("hide");
                    $("#devs").listview("refresh");
                }).fail(function(){
                    q = app.getStoredObject('peripherals');
                    console.log(q);
                    if (typeof q[peripheral.id] != "undefined" && typeof (q[peripheral.id]).meta != undefined) {
                        peripheral.meta = (q[peripheral.id]).meta;
                        $("#other").before($("<li>",{class:'item'}).append($("<a>",{href:'#'}).click(function(){window.gateway.setDeviceId(peripheral.id); window.gateway.setDeviceName(peripheral.name); location.href=peripheral.meta.url;}).append($("<img>",{src:peripheral.meta.icon})).append($("<h2>").html(peripheral.meta.title)).append($("<p>").html(peripheral.meta.url+"<br/>"+peripheral.name+" ("+peripheral.id+")"))).append($("<a>",{href:"#dialog","data-rel":"popup",class:"zmdi zmdi-more-vert"}).click(function(){app.infoPopup(peripheral.id,"ble")})));
                    } else $("#other").before($("<li>",{class:'item'}).append($("<a>",{href:'#'}).click(function(){window.gateway.setDeviceId(peripheral.id); window.gateway.setDeviceName(peripheral.name); location.href=peripheral.uri;}).append($("<p>").html(peripheral.uri+"<br/>"+peripheral.name+" ("+peripheral.id+")"))));
                    $.mobile.loading("hide");
                    $("#devs").listview("refresh");
                });
            } else { 
                $(".other:last-child").hide().after($("<li>",{class:"other item","dev-id":peripheral.id}).hide().append($("<a>",{href:"#"}).click(function(){window.gateway.setDeviceId(peripheral.id); window.gateway.setDeviceName(peripheral.name); location.href="generated.html";}).html(peripheral.name+" ("+peripheral.id +")")));
                if ($("#dv").prop("checked")) $(".other").show();
            }
            $.mobile.loading("hide");
            $("#devs").listview("refresh");
            app.peripherals[peripheral.id] = peripheral;
            window.localStorage.setItem("peripherals",JSON.stringify($.extend(true,{},app.getStoredObject("peripherals"),app.peripherals)));
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
                if (type==22 && length>4 && data[1]==0xfe && (data[0]==0xd8 || data[0]==0xaa)) return {uri:data.subarray(2),ad:false};
                if (type==36) return {uri:data,ad:true};
                index += length; //Advance
            }
        } 
        else if (advertisingdata.kCBAdvDataServiceData.FED8) return new Uint8Array(advertisingdata.kCBAdvDataServiceData.FED8);
        else if (advertisingdata.kCBAdvDataServiceData.FEAA) return new Uint8Array(advertisingdata.kCBAdvDataServiceData.FEAA);
        return null;
    },
    parseAdData: function(peripheral,adData) {
        if (!adData.ad) {
            peripheral.flags = adData.uri[0]; // flag is the 1st byte
            peripheral.txPower = adData.uri[1]; // TX Power is 2nd byte
            uriScheme = adData.uri[2];
            uriData = adData.uri.subarray(3); // remainder in the URI
        } else {
            uriScheme = adData.uri[0];
            uriData = adData.uri.subarray(1); // remainder in the URI
        }
        uri = '';
        if (adData.ad && typeof BSPREFIXES[uriScheme] != "undefined") uri = BSPREFIXES[uriScheme];
        else if (uriScheme < PWPREFIXES.length) uri = PWPREFIXES[uriScheme]; // valid prefix, uncompress
        else uri = String.fromCharCode(uriScheme); // invalid prefix, just append character
        for (x = 0; x < uriData.length; x++) {
            if (uriData[x] < PWSUFFIXES.length) uri += PWSUFFIXES[uriData[x]]; // valid suffix, uncompress
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
            $('#dm #dev').html(p.name+" ("+p.id+")<br/>"+p.meta.url);
            $("#dm #ui").html("");
            for (n in p.apps) $("#dm #ui").append($("<span>").html("NATIVE APP : "+p.apps[n].name+"<br/>").append($("<a>",{href:"#",class:"ui-btn ui-btn-raised clr-primary"}).html("Open "+p.apps[n].name).click(function(){window.gateway.setDeviceId(p.id); window.gateway.setDeviceName(p.name); window.gateway.go(p.meta.url,p.apps[n].package,p.apps[n].activity);})).append("<br/>"));
            $("#dm #ui").append("WEB CONTENT : "+p.meta.title+"<br/><i>"+p.meta.description+"</i><br/>"+(p.meta.cordova ? "Plugins Used:<br/>"+JSON.stringify(p.meta.cordova,null,4).replace(/[{},]/g,'') : ""));
            $("#dm #go").click(function(){window.gateway.setDeviceId(p.id); window.gateway.setDeviceName(p.name); location.href=p.meta.url;})
            $("#dm #gen").show().click(function(){window.gateway.setDeviceId(p.id); window.gateway.setDeviceName(p.name); location.href="generated.html";})
        } else if (type=="nsd") {
            $('#dh img').attr("src",'img/dnssd.svg');
            $('#dh h3').html(p.service.name)
            $('#dm #dev').html(p.service.server+" ("+p.service.application+")<br/>"+p.service.urls[0]);
            $("#dm #ui").html("");
            for (n in p.apps) $("#dm #ui").append($("<span>").html("NATIVE APP : "+p.apps[n].name+"<br/>").append($("<a>",{href:"#",class:"ui-btn ui-btn-raised clr-primary"}).html("Open "+p.apps[n].name).click(function(){window.gateway.setDeviceId(p.id); window.gateway.setDeviceName(p.name); window.gateway.go(p.meta.url,p.apps[n].package,p.apps[n].activity);})).append("<br/>"));
            $("#dm #ui").append("LOCAL WEB CONTENT : "+p.service.name+"<br/><i>"+p.service.qualifiedname+"<br/>"+p.service.description+"</i><br/>");
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

