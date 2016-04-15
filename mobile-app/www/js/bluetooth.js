var PRTCOL = ["","","aaa:","aaas:","about:","acap:","acct:","cap:","cid:","coap:","coaps:","crid:","data:","dav:","dict:","dns:","file:","ftp:","geo:","go:","gopher:","h323:","http:","https:","iax:","icap:","im:","imap:","info:","ipp:","ipps:","iris:","iris.beep:","iris.xpc:","iris.xpcs:","iris.lwz:","jabber:","ldap:","mailto:","mid:","msrp:","msrps:","mtqp:","mupdate:","news:","nfs:","ni:","nih:","nntp:","opaquelocktoken:","pop:","pres:","reload:","rtsp:","rtsps:","rtspu:","service:","session:","shttp:","sieve:","sip:","sips:","sms:","snmp:","soap.beep:","soap.beeps:","stun:","stuns:","tag:","tel:","telnet:","tftp:","thismessage:","tn3270:","tip:","turn:","turns:","tv:","urn:","vemmi:","ws:","wss:","xcon:","xcon-userid:","xmlrpc.beep:","xmlrpc.beeps:","xmpp:","z39.50r:","z39.50s:","acr:","adiumxtra:","afp:","afs:","aim:","apt:","attachment:","aw:","barion:","beshare:","bitcoin:","bolo:","callto:","chrome:","chrome-extension:","com-eventbrite-attendee:","content:","cvs:","dlna-playsingle:","dlna-playcontainer:","dtn:","dvb:","ed2k:","facetime:","feed:","feedready:","finger:","fish:","gg:","git:","gizmoproject:","gtalk:","ham:","hcp:","icon:","ipn:","irc:","irc6:","ircs:","itms:","jar:","jms:","keyparc:","lastfm:","ldaps:","magnet:","maps:","market:","message:","mms:","ms-help:","ms-settings-power:","msnim:","mumble:","mvn:","notes:","oid:","palm:","paparazzi:","pkcs11:","platform:","proxy:","psyc:","query:","res:","resource:","rmi:","rsync:","rtmfp:","rtmp:","secondlife:","sftp:","sgn:","skype:","smb:","smtp:","soldat:","spotify:","ssh:","steam:","submit:","svn:","teamspeak:","teliaeid:","things:","udp:","unreal:","ut2004:","ventrilo:","view-source:","webcal:","wtai:","wyciwyg:","xfire:","xri:","ymsgr:","example:","ms-settings-cloudstorage:"];
var SUFFIX = [".com/",".org/",".edu/",".net/",".info/",".biz/",".gov/",".com",".org",".edu",".net",".info",".biz",".gov"];
var PREFIX = ["http://www.","https://www.","http://","https://","urn:uuid:"];

var bluetooth = {};

document.addEventListener("deviceready", function () {

  bluetooth = Object.assign({}, ble);

  bluetooth.scan = function(services, seconds, success, failure) {
    ble.scan(services, seconds, function (peripheral) {
      parse(peripheral, success);
    }, failure);
  };

  bluetooth.startScan = function(services, success, failure) {
    ble.startScan(services, function (peripheral) {
      parse(peripheral, success);
    }, failure);
  };

  bluetooth.connect = function(device_id, success, failure) {
    ble.connect(device_id, function (peripheral) {
      parse(peripheral, success);
    }, failure);
  };

  bluetooth.connectDevice = function(success, failure) {
    ble.stopScan(function(){
      ble.startScan([], function(device){
        if (device.id == gateway.getDeviceId()) {
          ble.stopScan(function(){
            bluetooth.connect(gateway.getDeviceId(), success, failure)
          },failure);
        }
      }, failure)
    },failure);
  };

  bluetooth.disconnectDevice = function(success, failure) {
    bluetooth.disconnect(gateway.getDeviceId(), success, failure);
  }

  // Create a common advertisement interface between iOS and android
  //  This format follows the nodejs BLE library, noble
  //  https://github.com/sandeepmistry/noble#peripheral-discovered
  parse = function (peripheral, success) {
    var advertisement = {};

    if (navigator.platform.startsWith("iP")) {
      // Platform is iOS
      for (var n in peripheral.advertising) {
        advertisement[n[10].toLowerCase()+n.substr(11)] = peripheral.advertising[n];
      }
      if (peripheral.advertising.kCBAdvDataManufacturerData) {
        advertisement.manufacturerData = new Uint8Array(peripheral.advertising.kCBAdvDataManufacturerData);
      }
      if (peripheral.advertising.kCBAdvDataServiceUUIDs) {
        delete advertisement.serviceUUIDs;
        advertisement.serviceUuids = peripheral.advertising.kCBAdvDataServiceUUIDs;
      }
      if (peripheral.advertising.kCBAdvDataServiceData) { // format for service data is different
        advertisement.serviceData=[];
        for (var serviceDataUuid in peripheral.advertising.kCBAdvDataServiceData) {
          advertisement.serviceData.push({
            uuid: serviceDataUuid,
            data: new Uint8Array(peripheral.advertising.kCBAdvDataServiceData[serviceDataUuid]),
          });
        }
      }
    } else {
      // Platform is Android
      var scanRecord = new Uint8Array(peripheral.advertising);
      var index = 0;
      while (index < scanRecord.length) {
        // First is length of the field, length of zero indicates advertisement is complete
        var length = scanRecord[index++];
        if (length == 0) {
          break;
        }

        // Next is type of field and then field data (if any)
        var type = scanRecord[index];
        var data = scanRecord.subarray(index+1, index+length);

        // Determine data based on field type
        switch (type) {
          case 0x01: // Flags
            advertisement.flags = data[0] & 0xFF;
            break;
          case 0x02: // Incomplete List of 16-Bit Service UUIDs
          case 0x03: // Complete List of 16-Bit Service UUIDs
            for (var n=0; n<data.length; n+=2) {
              advertisement.serviceUuids = (advertisement.serviceUuids||[]).concat(uuid(data.subarray(n,n+2)));
            }
            break;
          case 0x04: // Incomplete List of 32-Bit Service UUIDs
          case 0x05: // Complete List of 32-Bit Service UUIDs
            for (var n=0; n<data.length; n+=4) {
              advertisement.serviceUuids = (advertisement.serviceUuids||[]).concat(uuid(data.subarray(n,n+4)));
            }
            break;
          case 0x06: // Incomplete List of 128-Bit Service UUIDs
          case 0x07: // Complete List of 128-Bit Service UUIDs
            for (var n=0; n<data.length; n+=16) {
              advertisement.serviceUuids = (advertisement.serviceUuids||[]).concat(uuid(data.subarray(n,n+16)));
            }
            break;
          case 0x08: // Short Local Name
          case 0x09: // Complete Local Name
            advertisement.localName = String.fromCharCode.apply(null,data);
            break;
          case 0x0A: // TX Power Level
            advertisement.txPowerLevel = data[0] & 0xFF;
            break;
          case 0x16: // Service Data
            advertisement.serviceData = (advertisement.serviceData||[]).concat({
              uuid: uuid(data.subarray(0,2)),
              data: new Uint8Array(data.subarray(2)),
            });
            break;
          case 0x24: // Bluetooth URI
            advertisement.uri = PRTCOL[data[0]] + String.fromCharCode.apply(null, data.subarray(1));
            peripheral.uri = advertisement.uri; // Attach URI if Bluetooth URI exists
            break;
          case 0xFF: // Manufacturer Specific Data
            advertisement.manufacturerData = new Uint8Array(data);
            break;
        }

        // Shift to next advertisement field
        index += length;
      }
    }

    // Attach URI if Eddystone-URL exists
    for (i in advertisement.serviceData) {
      n = advertisement.serviceData[i];
      if (n.uuid == "FEAA" || n.uuid == "FED8") {
        peripheral.uriFrame = n.data[0]; // Frame type is the 1st byte
        peripheral.uriTxPower = n.data[1]; // TX Power is 2nd byte
        peripheral.uri = (PREFIX[n.data[2]] || String.fromCharCode(n.data[2])) + (function(){
          for (var s = j = c = ''; (c=this[j++]) || c==0; s += SUFFIX[c] || String.fromCharCode(c)) {} 
          return s;
        }).call(n.data.subarray(3));
      }
    }

    peripheral.advertisement = advertisement;

    // Finished parsing, call originally intended callback
    success(peripheral);
  };

  // convert an array of bytes representing a UUID into a hex string
  //    Note that all arrays need to be reversed before presenting to the user
  uuid = function (id) {
    id = id.reverse();
    if (id.length <= 4) {
      return hex(id);
    } else if (id.length == 16) {
      return hex(id.subarray( 0, 4)) + "-" + hex(id.subarray( 4, 6)) + "-" + hex(id.subarray( 6, 8)) +  "-" +
             hex(id.subarray( 8,10)) + "-" + hex(id.subarray(10,16));
    } else {  // invalid number of bytes
      return "";
    }
  };

  // convert an array of bytes into hex data
  hex = function (ab) {
    return Array.prototype.map.call(ab,function(m){
      return ("0"+m.toString(16)).substr(-2);
    }).join('').toUpperCase();
  };

});
