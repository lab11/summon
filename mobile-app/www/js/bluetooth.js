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

  // create a common advertisement interface between iOS and android
  //  This format follows the nodejs BLE library, noble
  //  https://github.com/sandeepmistry/noble#peripheral-discovered
  parse = function (peripheral, success) {
    // common advertisement interface is created as a new field
    //  This format follows the nodejs BLE library, noble
    //  https://github.com/sandeepmistry/noble#peripheral-discovered
    var advertisement = {};

    // this is a hack and only has to be in place until this code gets pulled
    //  into the summon app. Since we use the same hack to decide which
    //  cordova.js to load, it seems pretty saft to use it here too
    if (navigator.platform.startsWith("iP")) {
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
      // we are on android
      //XXX: can we determine `connectable` on android?
      var scanRecord = new Uint8Array(peripheral.advertising);
      var index = 0;
      while (index < scanRecord.length) {
        // first is length of the field, length of zero indicates advertisement
        //  is complete
        var length = scanRecord[index++];
        if (length == 0) {
          break;
        }

        // next is type of field and then field data (if any)
        var type = scanRecord[index];
        var data = scanRecord.subarray(index+1, index+length);

        // determine data based on field type
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
            advertisement.serviceData = (advertisement.serviceData||[]).concat({
              uuid: "URI",
              data: new Uint8Array(data),
            });
          case 0xFF: // Manufacturer Specific Data
            advertisement.manufacturerData = new Uint8Array(data);
            break;
        }

        // move to next advertisement field
        index += length;
      }
    }

    peripheral.advertisement = advertisement;

    // finished parsing, call originally intended callback
    success(peripheral);
  };

  //XXX: This needs to be tested!!
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
