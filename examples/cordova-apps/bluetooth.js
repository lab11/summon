var bluetooth = {};

document.addEventListener("deviceready", function () {

  bluetooth = Object.assign({}, ble);
  
  bluetooth.scan = function(services,seconds,success,failure) {
    ble.scan(services, seconds, function (peripheral) {
      win(peripheral, success);
    }, failure);
  };
  
  bluetooth.startScan = function(services,success,failure) {
    ble.startScan(services, function (peripheral) {
      win(peripheral, success);
    }, failure);
  };
  
  win = function (peripheral, success) {
    var advertising = peripheral.advertising;
    peripheral.advertising = {};
    if (navigator.platform.startsWith("iP")) // iOS
      for (var n in advertising)
        if (n == "kCBAdvDataManufacturerData")
          peripheral.advertising[n[10].toLowerCase()+n.substr(11)] = new Uint8Array(advertising[n]);
        else if (n == "kCBAdvDataServiceData") {
          peripheral.advertising[n[10].toLowerCase()+n.substr(11)] = {};
          for (v in advertising[n])
            peripheral.advertising[n[10].toLowerCase()+n.substr(11)][v] = new Uint8Array(advertising[n][v]);
        } else peripheral.advertising[n[10].toLowerCase()+n.substr(11)] = advertising[n];
    else { // Android
      var scanRecord = new Uint8Array(advertising);
      var index = 0;
      while (index < scanRecord.length) {
        var length = scanRecord[index++];
        if (length == 0) break; // Done once we run out of records
        var type = scanRecord[index];
        if (type == 0) break; // Done if our record isn't a valid type
        var data = scanRecord.subarray(index+1, index+length); 
        switch (type) {
          case 0x01: // Flags
            peripheral.advertising.flags = data[0] & 0xFF;
            break;
          case 0x02: // Incomplete List of 16-Bit Service UUIDs
          case 0x03: // Complete List of 16-Bit Service UUIDs
            for (var n=0; n<data.length; n+=2) 
              peripheral.advertising.serviceUUIDs = (peripheral.advertising.serviceUUIDs||[]).push(uuid(data.subarray(n,n+2)));
            break;
          case 0x04: // Incomplete List of 32-Bit Service UUIDs
          case 0x05: // Complete List of 32-Bit Service UUIDs
            for (var n=0; n<data.length; n+=4) 
              peripheral.advertising.serviceUUIDs = (peripheral.advertising.serviceUUIDs||[]).push(uuid(data.subarray(n,n+4)));
            break;
          case 0x06: // Incomplete List of 128-Bit Service UUIDs
          case 0x07: // Complete List of 128-Bit Service UUIDs
            for (var n=0; n<data.length; n+=16) 
              peripheral.advertising.serviceUUIDs = (peripheral.advertising.serviceUUIDs||[]).push(uuid(data.subarray(n,n+16)));
            break;
          case 0x08: // Short Local Name
          case 0x09: // Complete Local Name
            peripheral.advertising.localName = String.fromCharCode.apply(null,data);
            break;
          case 0x0A: // TX Power Level
            peripheral.advertising.txPowerLevel = data[0] & 0xFF;
            break;
          case 0x16: // Service Data
            peripheral.advertising.serviceData = peripheral.advertising.serviceData||{};
            peripheral.advertising.serviceData[uuid([data[1],data[0]])] = data.subarray(2);
            break;
          case 0xFF: // Manufacturer Specific Data
            peripheral.advertising.manufacturerData = data;
            break;
        }
        index += length; //Advance
      }
    }
      success(peripheral);
  };

  uuid = function(id) {
    if (id.length <= 4)
      return hex(id)
    else if (id.length == 16)
      return hex(id.subarray(0,4))+"-"+hex(id.subarray(4,6))+"-"+hex(id.subarray(6,8))+"-"+hex(id.subarray(8,10))+"-"+hex(id.subarray(10,16));
    else return ""; 
  };

  hex = function(ab) {
    return Array.prototype.map.call(ab,function(m){return ("0"+m.toString(16)).substr(-2);}).join('').toUpperCase();
  }

});