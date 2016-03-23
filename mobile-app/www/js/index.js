var PREFIX = ["http://www.","https://www.","http://","https://","urn:uuid:"];
var SUFFIX = [".com/",".org/",".edu/",".net/",".info/",".biz/",".gov/",".com",".org",".edu",".net",".info",".biz",".gov"];
var PRTCOL = [undefined,undefined,"aaa:","aaas:","about:","acap:","acct:","cap:","cid:","coap:","coaps:","crid:","data:","dav:","dict:","dns:","file:","ftp:","geo:","go:","gopher:","h323:","http:","https:","iax:","icap:","im:","imap:","info:","ipp:","ipps:","iris:","iris.beep:","iris.xpc:","iris.xpcs:","iris.lwz:","jabber:","ldap:","mailto:","mid:","msrp:","msrps:","mtqp:","mupdate:","news:","nfs:","ni:","nih:","nntp:","opaquelocktoken:","pop:","pres:","reload:","rtsp:","rtsps:","rtspu:","service:","session:","shttp:","sieve:","sip:","sips:","sms:","snmp:","soap.beep:","soap.beeps:","stun:","stuns:","tag:","tel:","telnet:","tftp:","thismessage:","tn3270:","tip:","turn:","turns:","tv:","urn:","vemmi:","ws:","wss:","xcon:","xcon-userid:","xmlrpc.beep:","xmlrpc.beeps:","xmpp:","z39.50r:","z39.50s:","acr:","adiumxtra:","afp:","afs:","aim:","apt:","attachment:","aw:","barion:","beshare:","bitcoin:","bolo:","callto:","chrome:","chrome-extension:","com-eventbrite-attendee:","content:","cvs:","dlna-playsingle:","dlna-playcontainer:","dtn:","dvb:","ed2k:","facetime:","feed:","feedready:","finger:","fish:","gg:","git:","gizmoproject:","gtalk:","ham:","hcp:","icon:","ipn:","irc:","irc6:","ircs:","itms:","jar:","jms:","keyparc:","lastfm:","ldaps:","magnet:","maps:","market:","message:","mms:","ms-help:","ms-settings-power:","msnim:","mumble:","mvn:","notes:","oid:","palm:","paparazzi:","pkcs11:","platform:","proxy:","psyc:","query:","res:","resource:","rmi:","rsync:","rtmfp:","rtmp:","secondlife:","sftp:","sgn:","skype:","smb:","smtp:","soldat:","spotify:","ssh:","steam:","submit:","svn:","teamspeak:","teliaeid:","things:","udp:","unreal:","ut2004:","ventrilo:","view-source:","webcal:","wtai:","wyciwyg:","xfire:","xri:","ymsgr:","example:","ms-settings-cloudstorage:"]
var PRMISN = {"cordova-plugin-ble-central":"Bluetooth","com.randdusing.bluetoothle":" ","com.megster.cordova.ble":"Bluetooth","cordova-plugin-chrome-apps-common":"Chrome Apps Common Utils","cordova-plugin-chrome-apps-iossocketscommon":"Chrome Apps Sockets Utils","cordova-plugin-chrome-apps-sockets-udp":"Chrome Apps UDP Sockets","cordova-plugin-console":" ","cordova-plugin-device":"Device Information","cordova-plugin-file":"Memory Storage","cordova-plugin-inappbrowser":"Browser Utils","cordova-plugin-network-information":"Network Information","cordova-plugin-statusbar":"StatusBar","cordova-plugin-whitelist":" ","cordova-plugin-zeroconf":"Bonjour/mDNS","cordova-plugin-zip":"ZIP Compression"};
var SRVICE = {"1800":"Generic Access","1801":"Generic Attribute","1802":"Immediate Alert","1803":"Link Loss","1804":"Tx Power","1805":"Current Time Service","1806":"Reference Time Update Service","1807":"Next DST Change Service","1808":"Glucose","1809":"Health Thermometer","180a":"Device Information","180d":"Heart Rate","180e":"Phone Alert Status Service","180f":"Battery Service","1810":"Blood Pressure","1811":"Alert Notification Service","1812":"Human Interface Device","1813":"Scan Parameters","1814":"Running Speed and Cadence","1815":"Automation IO","1816":"Cycling Speed and Cadence","1818":"Cycling Power","1819":"Location and Navigation","181a":"Environmental Sensing","181b":"Body Composition","181c":"User Data","181d":"Weight Scale","181e":"Bond Management","181f":"Continuous Glucose Monitoring","1820":"Internet Protocol Support"};
var CHRCTR = {"2a00":"Device Name","2a01":"Appearance","2a02":"Peripheral Privacy Flag","2a03":"Reconnection Address","2a04":"Peripheral Preferred Connection Parameters","2a05":"Service Changed","2a06":"Alert Level","2a07":"Tx Power Level","2a08":"Date Time","2a09":"Day of Week","2a0a":"Day Date Time","2a0c":"Exact Time 256","2a0d":"DST Offset","2a0e":"Time Zone","2a0f":"Local Time Information","2a11":"Time with DST","2a12":"Time Accuracy","2a13":"Time Source","2a14":"Reference Time Information","2a16":"Time Update Control Point","2a17":"Time Update State","2a18":"Glucose Measurement","2a19":"Battery Level","2a1c":"Temperature Measurement","2a1d":"Temperature Type","2a1e":"Intermediate Temperature","2a21":"Measurement Interval","2a22":"Boot Keyboard Input Report","2a23":"System ID","2a24":"Model Number String","2a25":"Serial Number String","2a26":"Firmware Revision String","2a27":"Hardware Revision String","2a28":"Software Revision String","2a29":"Manufacturer Name String","2a2a":"IEEE 11073-20601 Regulatory Certification Data List","2a2b":"Current Time","2a2c":"Magnetic Declination","2a31":"Scan Refresh","2a32":"Boot Keyboard Output Report","2a33":"Boot Mouse Input Report","2a34":"Glucose Measurement Context","2a35":"Blood Pressure Measurement","2a36":"Intermediate Cuff Pressure","2a37":"Heart Rate Measurement","2a38":"Body Sensor Location","2a39":"Heart Rate Control Point","2a3f":"Alert Status","2a40":"Ringer Control Point","2a41":"Ringer Setting","2a42":"Alert Category ID Bit Mask","2a43":"Alert Category ID","2a44":"Alert Notification Control Point","2a45":"Unread Alert Status","2a46":"New Alert","2a47":"Supported New Alert Category","2a48":"Supported Unread Alert Category","2a49":"Blood Pressure Feature","2a4a":"HID Information","2a4b":"Report Map","2a4c":"HID Control Point","2a4d":"Report","2a4e":"Protocol Mode","2a4f":"Scan Interval Window","2a50":"PnP ID","2a51":"Glucose Feature","2a52":"Record Access Control Point","2a53":"RSC Measurement","2a54":"RSC Feature","2a55":"SC Control Point","2a56":"Digital","2a58":"Analog","2a5a":"Aggregate","2a5b":"CSC Measurement","2a5c":"CSC Feature","2a5d":"Sensor Location","2a63":"Cycling Power Measurement","2a64":"Cycling Power Vector","2a65":"Cycling Power Feature","2a66":"Cycling Power Control Point","2a67":"Location and Speed","2a68":"Navigation","2a69":"Position Quality","2a6a":"LN Feature","2a6b":"LN Control Point","2a6c":"Elevation","2a6d":"Pressure","2a6e":"Temperature","2a6f":"Humidity","2a70":"True Wind Speed","2a71":"True Wind Direction","2a72":"Apparent Wind Speed","2a73":"Apparent Wind Direction","2a74":"Gust Factor","2a75":"Pollen Concentration","2a76":"UV Index","2a77":"Irradiance","2a78":"Rainfall","2a79":"Wind Chill","2a7a":"Heat Index","2a7b":"Dew Point","2a7d":"Descriptor Value Changed","2a7e":"Aerobic Heart Rate Lower Limit","2a7f":"Aerobic Threshold","2a80":"Age","2a81":"Anaerobic Heart Rate Lower Limit","2a82":"Anaerobic Heart Rate Upper Limit","2a83":"Anaerobic Threshold","2a84":"Aerobic Heart Rate Upper Limit","2a85":"Date of Birth","2a86":"Date of Threshold Assessment","2a87":"Email Address","2a88":"Fat Burn Heart Rate Lower Limit","2a89":"Fat Burn Heart Rate Upper Limit","2a8a":"First Name","2a8b":"Five Zone Heart Rate Limits","2a8c":"Gender","2a8d":"Heart Rate Max","2a8e":"Height","2a8f":"Hip Circumference","2a90":"Last Name","2a91":"Maximum Recommended Heart Rate","2a92":"Resting Heart Rate","2a93":"Sport Type for Aerobic and Anaerobic Threshold","2a94":"Three Zone Heart Rate Limits","2a95":"Two Zone Heart Rate Limit","2a96":"VO2 Max","2a97":"Waist Circumference","2a98":"Weight","2a99":"Database Change Increment","2a9a":"User Index","2a9b":"Body Composition Feature","2a9c":"Body Composition Measurement","2a9d":"Weight Measurement","2a9e":"Weight Scale Feature","2a9f":"User Control Point","2aa0":"Magnetic Flux Density - 2D","2aa1":"Magnetic Flux Density - 3D","2aa2":"Language","2aa3":"Barometric Pressure Trend","2aa4":"Bond Management Control Point","2aa5":"Bond Management Feature","2aa6":"Central Address Resolution","2aa7":"CGM Measurement","2aa8":"CGM Feature","2aa9":"CGM Status","2aaa":"CGM Session Start Time","2aab":"CGM Session Run Time","2aac":"CGM Specific Ops Control Point"};
var PRVIDE = navigator.platform.startsWith("iP") ? ["E49CE9DC-734F-F89C-6242-AFF158D0BE83","E49CE9DB-734F-F89C-6242-AFF158D0BE83"] : ["e49ce9dc-734f-f89c-6242-aff158d0be83","e49ce9db-734f-f89c-6242-aff158d0be83"];
var g, d = {};
var UI_Array;
var read_count = 0;
var read_to = 0;
var size = 0;
var fileUrl = null;
var dirUrl = null;
var prfocus = false;

// var rssiData = {start:[]};
var app = {
  initialize: function() { this.bindEvents(); },
  bindEvents: function() {
    document.addEventListener("deviceready", app.onAppReady, false);
    document.addEventListener('resume', app.onAppReady, false);
    document.addEventListener('pause', app.onPause, false);
    $('#content').xpull({'callback':app.onAppReady,'spinnerTimeout':10,'pullThreshold':100});
    $(".pref").change(app.onPrefChange);
    $("#panel a").click(function(e){e.preventDefault();window.open($(this).attr("href"),'_system');return false;});
    $(document).bind('swiperight', function () { $.mobile.back(); });
    $.mobile.changePage.defaults.transition = 'slide';
    $("#pr").click(function(e){
        if (prfocus && !$("#filter").val().length) $("#filter").blur();
        else $("#filter").focus().val('').trigger("keyup");
    });
    $("#filter").focusin(function(){
      if (device.platform=="iOS") $(".ph").css("position","absolute");
      $(window).scrollTop(0);
      $("#pr i").removeClass("zmdi-search").addClass("zmdi-close");
      $("#filter").attr("placeholder","Search");
      setTimeout(function(){prfocus=true;},100);
    });
    $("#filter").focusout(function(){
      if (device.platform=="iOS") $(window).scrollTop(0);
      $(".ph").css("position","fixed");
      if ($("#filter").val()=='') $("#pr i").removeClass("zmdi-close").addClass("zmdi-search");
      $("#filter").attr("placeholder","Summon");
      setTimeout(function(){prfocus=false;},100);
    });
  },
  onAppReady: function() {
    // rssiData.start.push($.now());
    // setTimeout(function(){$.post("https://f1lqsmvf82az.runscope.net/",JSON.stringify(rssiData),null)},60000);
    location.hash='';
    $("#dialog").popup("close");
    if ( device.platform === "iOS" ) {$.mobile.hashListeningEnabled=false; }
    $('body').addClass(device.platform.toLowerCase());
    $(".pref").each(function(){$(this).prop("checked",localStorage.getItem($(this).attr("id"))!="false").flipswitch("refresh")});
    $('#devs').html($("<li>",{"data-role":"list-divider",id:"other",class:"other"}).html("Other Devices"));
    $("#other").hide();
    gateway.cache($("#ch").prop("checked"));
    app.peripherals = {};
    app.cachelist = app.getStoredObject("peripherals")||{};
    app.readQueue=[];
    $.mobile.loading("show");
    bluetooth.disconnect(d.id||"",null);
    if ( device.platform === "iOS" ) bluetooth.stopScan(function(){ bluetooth.startScan([],app.onPeripheralFound); },app.onAppReady);
	  else bluetooth.isEnabled(app.scan,function(){bluetooth.enable(app.onAppReady,null)});
    // nfc.addNdefListener(app.onNfcFound, function(){console.log("nfc success")}, function(){console.log("nfc fail")});
    if(navigator.network.connection.type != Connection.NONE) {
      cordova.plugins.zeroconf.watch("_http._tcp.local.",app.onDiscover); 
      cordova.plugins.zeroconf.watch("_services._dns-sd._udp.local.",app.onDiscover);
    }
    $('#content').data('plugin_xpull').reset();
    $("body").pagecontainer({ beforeshow: function(e,ui) { if (ui.toPage.attr("id")=="page1") app.onAppReady(); } });
  },
  onPause: function() {
    bluetooth.disconnect(d.id||"");
    bluetooth.stopScan();
    cordova.plugins.zeroconf.close();
    // nfc.removeNdefListener(app.onNfcFound);
  },
  onPrefChange: function() {
    localStorage.setItem($(this).attr("id"),$(this).prop("checked"));
    if ($(this).attr("id")=="dv") $(this).prop("checked") ? $(".other").show() : $(".other").hide();
    else if ($(this).attr("id")=="ch") {
      if(!app.getStoredObject("ch")) {
        app.cachelist={};
        localStorage.setItem("peripherals","{}");
      }
      gateway.cache($("#ch").prop("checked"));
    }
    if ($("#other").is( "li:last-child" )) $("#other").hide();
  },
  scan: function() {
    bluetooth.stopScan(function(){
      bluetooth.startScan([],app.onPeripheralFound,function(e){console.log(e)});
      setTimeout(function(){if ($("body").pagecontainer("getActivePage").attr("id")!="page1") app.scan()},2000);
    },app.onAppReady);
  },
  onDiscover: function(peripheral) {
    peripheral.service.qualifiedname = peripheral.service.name + "." + peripheral.service.type;
    if (peripheral.action=="type") cordova.plugins.zeroconf.watch(peripheral.service.qualifiedname,app.onDiscover);
    else if (peripheral.action=="removed") {
      if (typeof app.peripherals[peripheral.service.qualifiedname] != "undefined") {
        $('li[dev-id="'+peripheral.service.qualifiedname+'"]').remove();
        delete app.peripherals[peripheral.service.qualifiedname];
      }
    } else {
      if (typeof app.peripherals[peripheral.service.qualifiedname] == "undefined") {
        app.peripherals[peripheral.service.qualifiedname] = peripheral;
        if (peripheral.service.type.startsWith("_http._tcp.")) {
          $('li.other[dev-id="'+peripheral.service.qualifiedname+'"]').remove(); 
          peripheral.uri = peripheral.service.urls ? peripheral.service.urls[0] : ("http://"+peripheral.service.addresses[0]+":"+peripheral.service.port);
          if ($('li[dev-id="'+peripheral.service.qualifiedname+'"]:not(.other)').length==0) $("#other").before($("<li>",{class:"nsd item","dev-rssi":-200,"dev-id":peripheral.service.qualifiedname}).append($("<a>",{href:"#",style:"opacity:.5; pointer-events:none",onclick:"app.go('"+peripheral.service.qualifiedname+"')"}).append($("<img>",{src:"img/dnssd.svg"})).append($("<h2>").html(peripheral.service.name)).append($("<p>").html(peripheral.uri+"<br/><i class='zmdi zmdi-network-wifi-alt zmd-fw'></i> "+(peripheral.service.server||peripheral.service.hostName)+" ("+(peripheral.service.application||peripheral.service.type)+")"))));
          if (typeof app.cachelist[peripheral.service.qualifiedname] != "undefined" && typeof (app.cachelist[peripheral.service.qualifiedname]).meta != undefined) {
            peripheral.meta = (app.cachelist[peripheral.service.qualifiedname]).meta;
            $('li[dev-id="'+peripheral.service.qualifiedname+'"]').html($("<a>",{href:'#'}).click(function(){app.go(peripheral.service.qualifiedname)}).append($("<img>",{src:peripheral.meta.icon}).error(function(){$(this).attr("src","img/nsd.svg")})).append($("<h2>").html(peripheral.meta.title)).append($("<p>").html(peripheral.meta.url+"<br/>"+"<i class='zmdi zmdi-network-wifi-alt zmd-fw'></i> "+(peripheral.service.server||peripheral.service.hostName)+" ("+(peripheral.service.application||peripheral.service.type)+")"))).append($("<a>",{href:"#dialog","data-rel":"popup","data-transition":"pop",class:"zmdi zmdi-more-vert"}).click(function(){app.infoPopup(peripheral.service.qualifiedname,"nsd")}));
            app.peripherals[peripheral.service.qualifiedname] = peripheral;
          }
          $.post("https://summon-caster.appspot.com/resolve-scan",JSON.stringify({objects:[{url:peripheral.uri}]}),function(data){
            if (data.metadata[0]) {
              peripheral.meta = data.metadata[0];
              peripheral.apps = device.platform=="iOS" ? [] : JSON.parse(gateway.checkApps(peripheral.meta.url));
              peripheral.permissions = [];
              if (peripheral.meta.cordova) for (n in peripheral.meta.cordova) if(!PRMISN[n]||PRMISN[n]!=" ") peripheral.permissions.push(PRMISN[n]||n);
              $('li[dev-id="'+peripheral.service.qualifiedname+'"]').html($("<a>",{href:'#',onclick:"app.go('"+peripheral.service.qualifiedname+"')"}).append($("<img>",{src:peripheral.apps.length?peripheral.apps[0].icon:peripheral.meta.icon})).append($("<h2>").html(peripheral.meta.title)).append($("<p>").html(peripheral.meta.url+"<br/>"+"<i class='zmdi zmdi-network-wifi-alt zmd-fw'></i> "+(peripheral.service.server||peripheral.service.hostName)+" ("+(peripheral.service.application||peripheral.service.type)+")"))).append($("<a>",{href:'#dialog',"data-rel":'popup',"data-transition":"pop",class:'zmdi zmdi-more-vert',onclick:"app.infoPopup('"+peripheral.service.qualifiedname+"','nsd')"}));
              if ($("#ch").prop("checked")) app.cachelist[peripheral.service.qualifiedname] = peripheral;
              localStorage.setItem("peripherals",JSON.stringify(app.cachelist));
            } else $('li[dev-id="'+peripheral.service.qualifiedname+'"]').html($("<a>",{href:'#',onclick:"app.go('"+peripheral.service.qualifiedname+"')"}).append($("<img>",{src:peripheral.uri+"/favicon.ico"}).error(function(){$(this).attr("src","img/dnssd.svg")})).append($("<h2>").html(peripheral.service.name)).append($("<p>").html(peripheral.uri+"/<br/><i class='zmdi zmdi-network-wifi-alt zmd-fw'></i> "+(peripheral.service.server||peripheral.service.hostName)+" ("+(peripheral.service.application||peripheral.service.type)+")"))).append($("<a>",{href:"#dialog","data-rel":"popup","data-transition":"pop",class:"zmdi zmdi-more-vert",onclick:"app.infoPopup('"+peripheral.service.qualifiedname+"','nsd')"}));
            $("#devs").listview("refresh");
            app.peripherals[peripheral.service.qualifiedname] = peripheral;
          }).fail(function(e){
            $('li[dev-id="'+peripheral.service.qualifiedname+'"]').html($("<a>",{href:'#',onclick:"app.go('"+peripheral.service.qualifiedname+"')"}).append($("<img>",{src:peripheral.uri+"/favicon.ico"}).error(function(){$(this).attr("src","img/dnssd.svg")})).append($("<h2>").html(peripheral.service.name)).append($("<p>").html(peripheral.uri+"/<br/><i class='zmdi zmdi-network-wifi-alt zmd-fw'></i> "+(peripheral.service.server||peripheral.service.hostName)+" ("+(peripheral.service.application||peripheral.service.type)+")"))).append($("<a>",{href:"#dialog","data-rel":"popup","data-transition":"pop",class:"zmdi zmdi-more-vert",onclick:"app.infoPopup('"+peripheral.service.qualifiedname+"','nsd')"}));
            $("#devs").listview("refresh");
          });
        } else if (typeof app.cachelist[peripheral.service.qualifiedname] != "undefined" && typeof (app.cachelist[peripheral.service.qualifiedname]).meta != undefined) {
            peripheral.meta = (app.cachelist[peripheral.service.qualifiedname]).meta;
            $("#other").before($("<li>",{class:"nsd item","dev-rssi":-200,"dev-id":peripheral.service.qualifiedname}).html($("<a>",{href:'#'}).click(function(){app.go(peripheral.service.qualifiedname)}).append($("<img>",{src:peripheral.meta.icon}).error(function(){$(this).attr("src","img/nsd.svg")})).append($("<h2>").html(peripheral.meta.title)).append($("<p>").html(peripheral.meta.url+"<br/>"+"<i class='zmdi zmdi-network-wifi-alt zmd-fw'></i> "+(peripheral.service.server||peripheral.service.hostName)+" ("+(peripheral.service.application||peripheral.service.type)+")"))).append($("<a>",{href:"#dialog","data-rel":"popup","data-transition":"pop",class:"zmdi zmdi-more-vert"}).click(function(){app.infoPopup(peripheral.service.qualifiedname,"nsd")})));
            app.peripherals[peripheral.service.qualifiedname] = peripheral;
        } else {
          $(".other:last-child").hide().after($("<li>",{class:"other nsd item","data-icon":"false",'dev-id':peripheral.service.qualifiedname}).hide().html($("<a>",{href:"#page2","data-transition":"slide"}).click(function(){app.generate(peripheral.service.qualifiedname);}).html("<i class='zmdi zmdi-network-wifi-alt zmd-fw'></i> "+peripheral.service.name+" ("+(peripheral.service.application||peripheral.service.type)+")")));
          if ($("#dv").prop("checked")) $(".other").show();
        }
        $.mobile.loading("hide");
        $("#devs").listview("refresh");
      }
    }
  },
  // onPostSuccess: function(data,peripheral){
  //   if (data.metadata[0]) {
  //     peripheral.meta = data.metadata[0];
  //     peripheral.apps = [];
  //     $('li[dev-id="'+(peripheral.id||peripheral.service.name)+'"]').html($("<a>",{href:'#',onclick:"window.open(\""+peripheral.meta.url+"\",'_system')"}).append($("<img>",{src:peripheral.meta.icon})).append($("<h2>").html(peripheral.meta.title)).append($("<p>").html(peripheral.meta.url+"<br/>"+"<i class='zmdi "+(peripheral.service?"zmdi-network-wifi-alt":"zmdi-bluetooth")+"zmd-fw'></i> "+(peripheral.name||(peripheral.service.name+" - "+peripheral.service.hostName))+" ("+peripheral.service.type+")"))).append($("<a>",{href:'#dialog',"data-rel":'popup',"data-transition":"pop",class:'zmdi zmdi-more-vert',onclick:"app.infoPopup(\""+(peripheral.id||peripheral.service.name)+"\",\""+(peripheral.id?"ble":"nsd")+"\")"}));
  //   } else $('li[dev-id="'+(peripheral.id||peripheral.service.name)+'"]').html($("<a>",{href:"#",onclick:"window.open(\""+(peripheral.uri||("http://"+peripheral.service.addresses[0]+":"+peripheral.service.port))+"\",'_system');"}).append($("<img>",{src:"img/"+(peripheral.id?"ble":"dnssd")+".svg"})).append($("<h2>").html(peripheral.name||peripheral.service.name)).append($("<p>").html((peripheral.uri||("http://"+peripheral.service.addresses[0]+":"+peripheral.service.port))+"<br/><i class='zmdi "+(peripheral.id?"zmdi-bluetooth":"zmdi-network-wifi-alt")+" zmd-fw'></i> "+(peripheral.name||(peripheral.service.name+" - "+peripheral.service.hostName))+" ("+peripheral.service.type+")"))).append($("<a>",{href:"#dialog","data-rel":"popup","data-transition":"pop",class:"zmdi zmdi-more-vert",onclick:"app.infoPopup('"+peripheral.service.name+"','nsd')"}));
  //   } else $('li[dev-id="'+peripheral.id+                           '"]').html($("<a>",{href:'#',onclick:"window.open(\""+peripheral.uri+                                                                           "\",'_system');"})                                                                                                                                      .append($("<p>").html(peripheral.uri+                                                                           "<br/><i class='zmdi zmdi-bluetooth                                               zmd-fw'></i> "+peripheral.name+" ("+peripheral.id +")")));
  //   $.mobile.loading("hide");
  //   app.peripherals[peripheral.id||peripheral.service.name] = peripheral;
  //   window.localStorage.setItem("peripherals",JSON.stringify($.extend(true,{},app.getStoredObject("peripherals"),app.peripherals)));
  //   $("#devs").listview("refresh");
  // },
  // onPostFail: function(e,peripheral) {
  // },
  // onNfcFound: function(nfcEvent) {
  //   payload = util.bytesToString(nfcEvent.tag.ndefMessage[0].payload);
  //   if (typeof app.peripherals[payload] == "undefined") {
  //     console.log(payload); 
  //     app.peripherals[payload] = nfcEvent;
  //     n = payload;
  //     (function(n){
  //       $("#other").before($("<li>",{class:"nfc item","dev-rssi":-200}).append($("<a>",{href:payload}).append($("<img>",{src:"img/dnssd.svg"})).append($("<h2>").html(payload)).append($("<p>").html(payload+"<br/>"+payload+" ("+payload+")"))).append($("<a>",{href:"#dialog","data-rel":"popup","data-transition":"pop",class:"zmdi zmdi-more-vert",onclick:"app.infoPopup(n,'nfc')"})));
  //     })(n);
  //     $.mobile.loading("hide");
  //     $("#devs").listview("refresh");
  //   }
  // },
  onPeripheralFound: function(peripheral) {
    // if (typeof rssiData[peripheral.id] == "undefined") rssiData[peripheral.id] = {time:[],rssi:[]};
    // rssiData[peripheral.id].time.push($.now());
    // rssiData[peripheral.id].rssi.push(peripheral.rssi);
    adData = app.getServiceData(peripheral);
    if (!peripheral.name) peripheral.name = "";
    if (peripheral.id==(d.id||"")) app.updateHead(peripheral,true);
    if (typeof adData != "undefined" && adData) {
      app.parseAdData(peripheral,adData);
      $('li.other[dev-id="'+peripheral.id+'"]').remove(); 
      if ($('li[dev-id="'+peripheral.id+'"]').length==0) {
        $("#other").before($("<li>",{class:"ble item","dev-id":peripheral.id}).append($("<a>",{href:'#',style:"opacity:.5; pointer-events:none"}).append($("<img>",{src:"img/ble.svg"})).append($("<h2>").html(peripheral.name+" ("+peripheral.id+")")).append($("<p>").html(peripheral.uri+"<br/>"+"<i class='zmdi zmdi-bluetooth zmd-fw'></i> "+peripheral.name+" ("+peripheral.id+")"))));
        $('li[dev-id="'+peripheral.id+'"]').attr("dev-rssi",peripheral.rssi);
        // $(".item:not(.other)").each(function(i){ if (peripheral.rssi < $(this).attr("dev-rssi")) $(this).before($('li[dev-id="'+peripheral.id+'"]')); });
      }
      if (peripheral.uri != "local") {
        if (!app.peripherals[peripheral.id] || !app.peripherals[peripheral.id].meta /*|| app.peripherals[peripheral.id].uri!=peripheral.uri*/) {
          if (typeof app.cachelist[peripheral.id] != "undefined" && typeof (app.cachelist[peripheral.id]).meta != undefined) {
            peripheral.meta = (app.cachelist[peripheral.id]).meta;
            $('li[dev-id="'+peripheral.id+'"]').html($("<a>",{href:'#'}).click(function(){app.go(peripheral.id)}).append($("<img>",{src:peripheral.meta.icon}).error(function(){$(this).attr("src","img/ble.svg")})).append($("<h2>").html(peripheral.meta.title)).append($("<p>").html(peripheral.meta.url+"<br/>"+"<i class='zmdi zmdi-bluetooth zmd-fw'></i> "+peripheral.name+" ("+peripheral.id+")"))).append($("<a>",{href:"#dialog","data-rel":"popup","data-transition":"pop",class:"zmdi zmdi-more-vert"}).click(function(){app.infoPopup(peripheral.id,"ble")}));
            $("#devs").listview("refresh");
          }
          $.post("https://summon-caster.appspot.com/resolve-scan",JSON.stringify({objects:[{url:peripheral.uri}]}),function(data){
            if (data.metadata[0]) {
              peripheral.meta = data.metadata[0];
              peripheral.apps = device.platform=="iOS" ? [] : JSON.parse(gateway.checkApps(peripheral.meta.url));
              peripheral.permissions = [];
              if (peripheral.meta.cordova) for (n in peripheral.meta.cordova) if(!PRMISN[n]||PRMISN[n]!=" ") peripheral.permissions.push(PRMISN[n]||n);
              $('li[dev-id="'+peripheral.id+'"]').addClass("ble").html($("<a>",{href:'#',onclick:"app.go('"+peripheral.id+"')"}).append($("<img>",{src:peripheral.apps.length?peripheral.apps[0].icon:peripheral.meta.icon}).error(function(){$(this).attr("src","img/ble.svg")})).append($("<h2>").html(peripheral.meta.title)).append($("<p>").html(peripheral.meta.url+"<br/>"+"<i class='zmdi zmdi-bluetooth zmd-fw'></i> "+peripheral.name+" ("+peripheral.id +")"))).append($("<a>",{href:'#dialog',"data-rel":'popup',"data-transition":"pop",class:'zmdi zmdi-more-vert',onclick:"app.infoPopup('"+peripheral.id+"','ble')"}));
              if ($("#ch").prop("checked")) app.cachelist[peripheral.id] = peripheral;
              localStorage.setItem("peripherals",JSON.stringify(app.cachelist));
            } else $('li[dev-id="'+peripheral.id+'"]').addClass("ble").html($("<a>",{href:'#',onclick:"app.go('"+peripheral.id+"');"}).append($("<p>").html(peripheral.uri+"<br/>"+"<i class='zmdi zmdi-bluetooth zmd-fw'></i> "+peripheral.name+" ("+peripheral.id +")")));
            $("#devs").listview("refresh");
            app.peripherals[peripheral.id] = peripheral;
          }).fail(function(e){
            if (typeof app.cachelist[peripheral.id] != "undefined" && typeof (app.cachelist[peripheral.id]).meta != undefined) {
              peripheral.meta = (app.cachelist[peripheral.id]).meta;
              $('li[dev-id="'+peripheral.id+'"]').html($("<a>",{href:'#'}).click(function(){app.go(peripheral.id)}).append($("<img>",{src:peripheral.meta.icon}).error(function(){$(this).attr("src","img/ble.svg")})).append($("<h2>").html(peripheral.meta.title)).append($("<p>").html(peripheral.meta.url+"<br/>"+"<i class='zmdi zmdi-bluetooth zmd-fw'></i> "+peripheral.name+" ("+peripheral.id+")"))).append($("<a>",{href:"#dialog","data-rel":"popup","data-transition":"pop",class:"zmdi zmdi-more-vert"}).click(function(){app.infoPopup(peripheral.id,"ble")}));
              app.peripherals[peripheral.id] = peripheral;
            } else if(peripheral.ad==2) {
              $('li[dev-id="'+peripheral.id+'"]').addClass("ble").html($("<a>",{href:'#',onclick:"app.uiLoad('"+peripheral.id+"');"}).append($("<img>",{src:"img/ble.svg"})).append($("<h2>").html(peripheral.name+" ("+peripheral.id+")")).append($("<p>").html(peripheral.uri+"<br/>"+"<i class='zmdi zmdi-bluetooth zmd-fw'></i> "+peripheral.name+" ("+peripheral.id +")"))).append($("<a>",{href:'#dialog',"data-rel":'popup',"data-transition":"pop",class:'zmdi zmdi-more-vert',onclick:"app.infoPopup('"+peripheral.id+"','ble')"})); 
            } else $('li[dev-id="'+peripheral.id+'"] a').attr("style","").click(function(){app.go(peripheral.id);});
            $("#devs").listview("refresh");
          });
        }
      } else $('li[dev-id="'+peripheral.id+'"]').addClass("ble").html($("<a>",{href:'#',onclick:"app.uiLoad('"+peripheral.id+"');"}).append($("<img>",{src:"img/ble.svg"})).append($("<h2>").html(peripheral.name+" ("+peripheral.id+")")).append($("<p>").html(peripheral.uri+"<br/>"+"<i class='zmdi zmdi-bluetooth zmd-fw'></i> "+peripheral.name+" ("+peripheral.id +")"))).append($("<a>",{href:'#dialog',"data-rel":'popup',"data-transition":"pop",class:'zmdi zmdi-more-vert',onclick:"app.infoPopup('"+peripheral.id+"','ble')"})); 
    } else if (app.cachelist[peripheral.id] && app.cachelist[peripheral.id].meta && $('li[dev-id="'+peripheral.id+'"]:not(.other)').length==0) {
      peripheral.meta = (app.cachelist[peripheral.id]).meta;
      $('li.other[dev-id="'+peripheral.id+'"]').remove(); 
      $("#other").before($("<li>",{class:"ble item","dev-id":peripheral.id}).html($("<a>",{href:'#'}).click(function(){app.go(peripheral.id)}).append($("<img>",{src:peripheral.meta.icon}).error(function(){$(this).attr("src","img/ble.svg")})).append($("<h2>").html(peripheral.meta.title)).append($("<p>").html(peripheral.meta.url+"<br/>"+"<i class='zmdi zmdi-bluetooth zmd-fw'></i> "+peripheral.name+" ("+peripheral.id+")"))).append($("<a>",{href:"#dialog","data-rel":"popup","data-transition":"pop",class:"zmdi zmdi-more-vert"}).click(function(){app.infoPopup(peripheral.id,"ble")})));
      $("#devs").listview("refresh");
      app.peripherals[peripheral.id] = peripheral;
    } else if ($('li[dev-id="'+peripheral.id+'"]:not(.other)').length==0) { 
      if ($('li.other[dev-id="'+peripheral.id+'"]').length==0) $(".other:last-child").hide().after($("<li>",{class:"other ble item","data-icon":"false","dev-id":peripheral.id}).hide().append($("<a>",{href:"#page2","data-transition":"slide"}).click(function(){app.generate(peripheral.id);}).html("<i class='zmdi zmdi-bluetooth zmd-fw'></i> "+peripheral.name+" ("+peripheral.id +")")));
      if ($("#dv").prop("checked")) $(".other").show();
    }
    $("#devs").listview("refresh");
    $.mobile.loading("hide");
    app.peripherals[peripheral.id] = $.extend(peripheral,app.peripherals[peripheral.id]);
  },
  getServiceData: function(peripheral) {
    for (n in peripheral.advertisement.serviceData) {
      a = peripheral.advertisement.serviceData[n];
      if (a.uuid=="URI") return {uri:a.data,ad:1};
      else if (a.uuid=="FED8" || a.uuid=="FEAA") return {uri:a.data,ad:0}; 
    }
    return null;
  },
  parseAdData: function(peripheral,adData) {
    if (adData.ad==0) {
      peripheral.flags = adData.uri[0]; // flag is the 1st byte
      peripheral.txPower = adData.uri[1]; // TX Power is 2nd byte
      uriScheme = adData.uri[2];
      uriData = adData.uri.subarray(3); // remainder in the URI
      if (peripheral.flags==0xFF) adData.ad=2;
    } else {
      uriScheme = adData.uri[0];
      uriData = adData.uri.subarray(1); // remainder in the URI
    } 
    uri = '';
    if (adData.ad==1 && typeof PRTCOL[uriScheme] != "undefined") uri = PRTCOL[uriScheme];
    else if (uriScheme < PREFIX.length) uri = PREFIX[uriScheme]; // valid prefix, uncompress
    else uri = String.fromCharCode(uriScheme); // invalid prefix, just append character
    for (x = 0; x < uriData.length; x++) {
      if (uriData[x] < SUFFIX.length) uri += SUFFIX[uriData[x]]; // valid suffix, uncompress
      else uri += String.fromCharCode(uriData[x]); // regular character, just append
    }
    peripheral.uri = uri;
    peripheral.ad = adData.ad;
  },
  go: function(id,n,url) {
    p = app.peripherals[id];
    if (typeof url == "undefined") url = (p.meta && p.meta.url) ? p.meta.url : p.uri;
    if (device.platform=="iOS") gateway.setDeviceAdvertisement({id:id,name:p.service?p.service.name:(p.name.length?p.name:"Unnamed")});
    else gateway.setDeviceAdvertisement( JSON.stringify( {id:id,name:p.service?p.service.name:p.name} ) );
    (p.apps && p.apps.length && typeof n != "string") ? gateway.go(url,p.apps[n||0].package,p.apps[n||0].activity) : location=url;
  },
  infoPopup: function(id,comm) {
    p = app.peripherals[id];
    if (!(p.id==id||(p.service&&p.service.qualifiedname==id))) {setTimeout(function(){app.infoPopup(id,comm)},50); return;}
    if (p.meta) {
      $('#dh img').attr("src",(p.apps&&p.apps.length)?p.apps[0].icon:(p.meta.icon||(comm=="ble"?"img/ble.svg":"img/dnssd.svg"))).error(function(){$(this).attr("src",(comm=="ble"?"img/ble.svg":"img/dnssd.svg"))});
      $('#dh h3').html(p.meta.title);
      $('#dm #dev').html((comm=="ble"?p.name:p.service.name)+(comm=="ble"?(" ("+p.id+")"):(" - "+(p.service.server||p.service.hostName)+"("+(p.service.application||p.service.type)+")"))+"<br/>"+p.meta.url);
      $("#dm #ui").html("");
      for (n in p.apps) $("#dm #ui").append($("<div>",{"style":"margin:.5em 0; padding:1em .5em .05em .5em; border-radius:3px; background:#eee"}).html("<b>Native App :</b> <img src='"+p.apps[n].icon+"' height=12> "+p.apps[n].name+"<br/>").append($("<a>",{href:"#",class:"ui-btn ui-btn-raised clr-primary","onclick":"app.go('"+id+"',"+n+")"}).html("Open App")));
      $("#dm #ui").append($("<div>",{"style":"margin:.5em 0; padding:1em .5em .05em .5em; border-radius:3px; background:#eee"}).html((p.meta.cordova?"<b>Interactive UI :</b> ":"<b>Website :</b> ")+"<img src='"+p.meta.icon+"' height=12> "+p.meta.title+"<br/><i>"+p.meta.description+"</i><br/>"+(p.permissions&&p.permissions.length ? "<br/><b>Features Used :</b>"+JSON.stringify(p.permissions,null,"<br/>").replace(/[\[\],"]/g,'')+"<br>" : "")).append($("<a>",{href:"#","onclick":"app.go('"+id+"','')","id":"go","class":"ui-btn ui-btn-raised clr-primary"}).html("Open "+(p.meta.cordova?"UI":"Site"))));
    } else {
      $('#dh img').attr("src",(p.apps&&p.apps.length)?p.apps[0].icon:((p.uri+"/favicon.ico")||(comm=="ble"?"img/ble.svg":"img/dnssd.svg")));
      $('#dh h3').html(p.service?p.service.name:p.name)
      $('#dm #dev').html(comm=='ble'?(p.name+" ("+p.id+")<br/>"+p.uri):(p.service.name+" - "+(p.service.server||p.service.hostName)+" ("+(p.service.application||p.service.type)+")<br/>"+p.uri)); 
      $("#dm #ui").html("");
      for (n in p.apps) $("#dm #ui").append($("<div>",{"style":"margin:.5em 0; padding:1em .5em .05em .5em; border-radius:3px; background:#eee"}).html("<b>Native App :</b> <img src='"+p.apps[n].icon+"' height=12> "+p.apps[n].name+"<br/>").append($("<a>",{href:"#",class:"ui-btn ui-btn-raised clr-primary","onclick":"app.go('"+id+"',"+n+")"}).html("Open App")));
      $("#dm #ui").append($("<div>",{"style":"margin:.5em 0; padding:1em .5em .05em .5em; border-radius:3px; background:#eee"}).html("<b>Local Content :</b> "+(comm=='ble'?"":("<img src='"+p.uri+"/favicon.ico' height=12> "+p.service.name+"<br/><i>"+(p.service.server||p.service.hostName)+"</i><br/>"))).append($("<a>",{href:"#","onclick":(comm=="ble"?'app.uiLoad("'+p.id+'")':"app.go('"+id+"',null,'"+p.uri+"')"),"id":"go","class":"ui-btn ui-btn-raised clr-primary"}).html("Attempt to Open"))); //JSON.stringify(p.service.txtRecord,null,2)
    }
    $("#dm #gen").html("Inspect "+(comm=="ble"?"BLE":"Service")).off("click").click(function(){$("#dialog").popup("close");app.generate(id);});
  },
  generate: function(id) {
    d = app.peripherals[id];
    d.count = 0;
    if (!((d.id&&d.id==id)||(d.service&&d.service.qualifiedname==id))) {setTimeout(function(){app.generate(id)},50); return;}
    if (!d.service) {
      $("#list").html($("<li>",{"data-role":"list-divider","id":"advertising"}).html("Advertisement Data"));
      app.readQueue=[]; 
      app.writeQueue=[];
    } else $("#list").html(""); 
    app.updateHead(d,true);
    app.connect();
  },
  connect: function() {
    $("#page2 .status").off("click").html($("<i>",{class:"zmdi zmd-lg zmdi-refresh zmd-spin"}));
    if (typeof d.service=="undefined"&&d.advertising&&(device.platform=="Android"||d.advertising["kCBAdvDataIsConnectable"])) bluetooth.connect(d.id,app.onConnect,function(e){if(app.readQueue.length) app.blacklist.push(app.readQueue[0].service); app.readQueue=[]; if (d.count++<3) setTimeout(app.connect,800); else $("#page2 .status").click(app.connect).html($("<i>",{class:"zmdi zmd-lg zmdi-replay"}));});
    else setTimeout(function(){$("#page2 .status").click(app.connect).html($("<i>",{class:"zmdi zmd-lg zmdi-replay"}))},200);
  },
  updateHead: function(peripheral,refresh) {
    if (peripheral.service) {
      $("#page2 .id").html((peripheral.service.hostName||peripheral.service.server)+" ("+(peripheral.service.application||peripheral.service.type)+")");
      $("#page2 .name").html(peripheral.service.name||"Unnamed");
      $("#page2 .rssi").html("");
      for (n in peripheral.service) 
        if (!$("#s"+n).length) {
          $("#list").append($("<li>",{"data-role":"list-divider","id":"s"+n}).html(n));
          if (typeof peripheral.service[n] == "object") for (m in peripheral.service[n]) $("#s"+n).after($("<li>",{"id":n+m}).append($("<span>").html(m)).append($("<div>",{"class":"value"}).html(peripheral.service[n][m])));
          else $("#s"+n).after($("<li>",{"id":"c"+peripheral.service[n]}).append($("<span>").html(peripheral.service[n])));
        }
    } else {
      $("#page2 .id").html(peripheral.id);
      $("#page2 .name").html(peripheral.name||"Unnamed");
      $("#page2 .rssi").html("("+peripheral.rssi+")");
      for (n in peripheral.advertisement) if (!$("#"+n).length) $("#advertising").after($("<li>",{"id":n}).append($("<span>").html(n[0].toUpperCase()+n.slice(1).replace(/([a-z]+)/g,"$1 "))).append($("<div>",{"class":"value"}).html(JSON.stringify(peripheral.advertisement[n]))));
    }
    if (refresh) setTimeout(function(){$("#list").listview("refresh")},100);
  },
  onConnect: function(peripheral) {
    d = peripheral;
    app.readQueue=[];
    for (n in peripheral.services) 
      if (!$('#s'+peripheral.services[n]).length) 
        $('#list').append($("<li>",{"data-role":"list-divider","id":"s"+peripheral.services[n]}).html(SRVICE[peripheral.services[n].toLowerCase()]||peripheral.services[n])).listview("refresh");
    for (n in peripheral.characteristics) {
      c = peripheral.characteristics[n];
      if (!$("#c"+c.characteristic).length) {
        $('#s'+c.service).after($("<li>",{"id":"c"+c.characteristic,value:""}).append($("<span>").html(CHRCTR[c.characteristic.toLowerCase()]||c.characteristic)).append($("<i>",{class:"zmdi zmdi-edit"}).css({"opacity":0,"margin-left":"5px"})).append($("<div>",{"class":"value"})).click(function(){if ($(this).hasClass("write")||$(this).hasClass("writewithoutresponse")) app.write($(this).attr("id").substr(1),app.hex2ab(prompt($(this).find("span").html(),$(this).attr("value"))));})); 
        for (l in c.properties) $("#c"+c.characteristic).addClass(c.properties[l].toLowerCase());
        $("#list").listview("refresh");
      }
      if (app.writeQueue.length) {
        if (app.writeQueue[0].characteristic==c.characteristic) bluetooth.write(d.id,c.service,c.characteristic,app.writeQueue[0].value,app.onWrite,bluetooth.writeWithoutResponse(d.id,c.service,c.characteristic,app.writeQueue[0].value,app.onWrite,app.onWrite));
      } else if (c.properties.indexOf("Read")>=0 && app.blacklist.indexOf(c.service)==-1)  app.read(c);
    }
    if (!app.readQueue.length&&!app.writeQueue.length) {
      bluetooth.disconnect(d.id||"");
      d.count=0;
      $("#page2 .status").click(app.connect).html($("<i>",{class:"zmdi zmd-lg zmdi-replay"}));
    }
  },
  onRead: function(data) {
    ch = app.readQueue.shift();
    c = ch.characteristic;
    $("#c"+c).attr("value",Array.prototype.map.call(new Uint8Array(data),function(m){return ("0"+m.toString(16)).substr(-2);}).join(''));
    $("#c"+c+">.value").html(String.fromCharCode.apply(null, new Uint8Array(data))+" ["+Array.prototype.map.call(new Uint8Array(data),function(m){return ("0"+m.toString(16)).substr(-2);}).join('')+"]");
    if ($("#c"+c+">.value").html()==" []") app.blacklist.push(ch.service);
    if (c=="2a00" && !d.name) {
      d.name = String.fromCharCode.apply(null, new Uint8Array(data));
      app.updateHead(d,false);
      // if ($("#ch").prop("checked")) app.cachelist[d.id].name = d.name;
      // localStorage.setItem("peripherals",JSON.stringify(app.cachelist));
    }
    if (app.readQueue.length) {
      if (app.blacklist.indexOf(app.readQueue[0].service)>=0) app.onRWError();
      else bluetooth.read(d.id,app.readQueue[0].service,app.readQueue[0].characteristic,app.onRead,app.onRWError);
    } else if (!app.writeQueue.length) bluetooth.isConnected(d.id,function(){bluetooth.disconnect(d.id||""); app.readQueue=[]; d.count=0; $("#page2 .status").click(app.connect).html($("<i>",{class:"zmdi zmd-lg zmdi-replay"}));},function(){app.readQueue=[]});
  },
  onWrite: function() {
    if (app.writeQueue.length) {
      c == app.writeQueue.shift();
      for (n in d.characteristics)
        if (c.characteristic==d.characteristics[n].characteristic && c.service)
          bluetooth.write(d.id,d.characteristics[n].service,d.characteristics[n].characteristic,c.value,app.onWrite,bluetooth.writeWithoutResponse(d.id,d.characteristics[n].service,d.characteristics[n].characteristic,c.value,app.onWrite,app.onWrite));
    } else if (!app.readQueue.length) {bluetooth.disconnect(d.id||""); $("#page2 .status").click(app.connect).html($("<i>",{class:"zmdi zmd-lg zmdi-replay"}));}
  },
  onRWError: function(e) {                                                             // on error,try restarting BLE
    console.log("error " + app.readQueue.shift().characteristic + " : " + e);
    if (app.readQueue.length) {
      if (app.blacklist.indexOf(app.readQueue[0].service)>=0) app.onRWError();
      else bluetooth.read(d.id,app.readQueue[0].service,app.readQueue[0].characteristic,app.onRead,app.onRWError);
    } else if (!app.writeQueue.length) bluetooth.isConnected(d.id,function(){bluetooth.disconnect(d.id||""); app.readQueue=[]; d.count=0; $("#page2 .status").click(app.connect).html($("<i>",{class:"zmdi zmd-lg zmdi-replay"}));},function(){app.readQueue=[]});
  },
  read: function(characteristic) {
    app.readQueue.push(characteristic);
    if (app.readQueue.length==1) bluetooth.read(d.id,characteristic.service,characteristic.characteristic,app.onRead,app.onRWError);
  },
  write: function(characteristic,value) {
    app.writeQueue.push({characteristic:characteristic,value:value});
    bluetooth.isConnected(d.id,function(){
      if (app.writeQueue.length==1)
        for (n in d.characteristics)
          if (characteristic==d.characteristics[n].characteristic)
            bluetooth.write(d.id,d.characteristics[n].service,d.characteristics[n].characteristic,value,app.onWrite,bluetooth.writeWithoutResponse(d.id,d.characteristics[n].service,d.characteristics[n].characteristic,value,app.onWrite,app.onWrite));
    },app.connect());
  },
  hex2ab: function(str) { 
    var result = [];
    while (str.length >= 2) { result.push(parseInt(str.substring(0, 2), 16)); str = str.substring(2, str.length); }
    return (new Uint8Array(result)).buffer;
  },
  getStoredObject: function(name) {
    try { return JSON.parse(localStorage.getItem(name)); } 
    catch (e) { return {} }
  },
  uiLoad: function(id) {
    p = app.peripherals[id];
    gateway.setDeviceAdvertisement( JSON.stringify( {id:p.id,name:p.name,rssi:p.rssi,advertising:p.advertising,ads:p.ads} ) ); 
    $("#lh .id").html(p.id);
    $("#lh .name").html(p.name||"Unnamed");
    $("#lh .rssi").html("("+p.rssi+")");
    $('#lm h4').html('Connecting.').attr("dev-id",id);
    try{$('#lm input').val(0).slider("refresh");} catch(e) {}
    jQuery.mobile.changePage("#page3",{"transition":"slide"});
    $('#lh a').click(function(){bluetooth.disconnect(id);app.onAppReady();});
    read_count = 0; read_to = 0; size = 0; fileUrl = null; dirUrl = null;
    app.updateHead(p,false);
    requestFileSystem(TEMPORARY, 0, function(fs) {
      fs.root.getDirectory('temp', {create: true}, function(dirEntry) {
        dirEntry.removeRecursively(function() { console.log('Directory removed.'); }, function(e) {console.log("ERROR",e)});
      });
    });
    bluetooth.connect(id, app.onLoadConnect, app.onDisconnect);
  },
  onLoadConnect: function(peripheral) {
    $('#lm h4').html('Connected. Reading.');
    $('#lm input').val(10).slider("refresh");
    g = peripheral;
    g.start =  g.characteristics.map(function(e) { return e.characteristic; }).indexOf(PRVIDE[0]);
    //find out how long the UI is by reading len
    bluetooth.read(peripheral.id, PRVIDE[1], peripheral.characteristics[g.start].characteristic, app.onData, app.onError);
    bluetooth.stopScan(function(){},function(reason){});
  },
  onData: function(buffer) {
    if(read_count == 0) {
      var data = new Uint8Array(buffer);
      read_count += 1;
      bluetooth.read(g.id, PRVIDE[1], g.characteristics[g.start+1].characteristic, app.onData, app.onError);
      $('#lm input').val(15).slider("refresh");
    } else if(read_count == 1) {
      var data = new Uint32Array(buffer);
      size = data[0];
      UI_Array = new Uint8Array(size);
      read_to = Math.ceil(data[0]/512) + 1;
      $('#lm input').val(20).slider("refresh");
      bluetooth.read(g.id, PRVIDE[1], g.characteristics[g.start+2].characteristic, app.onData, app.onError);
      read_count += 1;
    } else if(read_count > 1 && read_count < read_to) {
      UI_Array.set(new Uint8Array(buffer), (read_count-2)*512);
      $('#lm input').val(20- -Math.round(read_count/read_to*80)).slider("refresh");
      read_count += 1;
      bluetooth.read(g.id, PRVIDE[1], g.characteristics[read_count+g.start].characteristic, app.onData, app.onError);
    } else {
      UI_Array.set(new Uint8Array(buffer), (read_count-2)*512);
      bluetooth.disconnect(g.id);
      onError = function(e) {console.log("ERROR: " + e)};
      requestFileSystem(TEMPORARY, 0, function(fs) {
        fs.root.getDirectory('temp', {create: true}, function(dirEntry) {
          fs.root.getFile('www.bin', {create: true}, function(fileEntry) {
            fileEntry.createWriter(function(writer) {
              fileUrl = fileEntry.toURL();
              writer.onwrite = function(d) {
                if (fileUrl!=null && dirEntry.toURL()!=null) 
                  zip.unzip(fileUrl, dirEntry.toURL(), function(result) {
                    if (result==0) {
                      $('#lm h4').html('Connected. Read. Loaded. Opening.');
                      $('#lm input').val(100).slider("refresh");
                      dirEntry.createReader().readEntries (function(results) { console.log(results) }, onError);
                      app.go(g.id,null,dirEntry.toURL()+"www/index.html");
                    } else app.onError("Failed to load.");
                  }, function(progressEvent) { 
                    $('#lm h4').html('Connected. Read. Loading.');
                    $('#lm input').val(99+Math.round(progressEvent.loaded/progressEvent.total*1)).slider("refresh");
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
  onDisconnect: function(e){console.log(e);},
  onError: function(e) {
    bluetooth.disconnect(g.id);
    $('#lm h4').html('Error. ' + e + '<br /><a href="#" onclick="app.uiLoad('+g.id+')">Retry</a>');
  },
  blacklist: []
};
app.initialize();
