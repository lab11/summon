# [bluetooth.js](https://github.com/lab11/summon/blob/master/examples/cordova-apps/bluetooth.js)
## Bluetooth Plugin Shim For Summon UIs

This file provides a less platform-dependent experience for UI developers using the [BLE Central plugin](https://github.com/don/cordova-plugin-ble-central).

To use, call `bluetooth.js` after `cordova.js` in `index.html`:
````
<script type="text/javascript" src="bluetooth.js"></script>
````

This will provide object `bluetooth`, similar in functionality to the regular BLE plugin object `ble`.

However, when a peripheral is discovered during `bluetooth.scan` or `bluetooth.startScan`, the success callback will return a peripheral object that looks like this on both iOS and Android:

    {
        "name": "demo",
        "id": "D8479A4F-7517-BCD3-91B5-3302B2F81802", // iOS
    //  "id": "00:1A:7D:DA:71:13", // Android
        "advertising": {
            "serviceData": {
                "FED8": Uint8Array
            },
            "localName": "demo",
            "serviceUUIDs": ["FED8"],
            "manufacturerData": Uint8Array,
            "txPowerLevel": 32,
            "isConnectable": true // iOS only
            "channel": 37, // iOS only
    //      "flags": 6, // Android only 
        },
        "rssi": -53
    }
