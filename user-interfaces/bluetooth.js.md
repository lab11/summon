# [bluetooth.js](https://github.com/lab11/summon/blob/master/examples/cordova-apps/bluetooth.js)
## Bluetooth Plugin Shim For Summon UIs

This file provides a less platform-dependent experience for UI developers using the [BLE Central plugin](https://github.com/don/cordova-plugin-ble-central).

To use, call `bluetooth.js` in `index.html`:
````
<script type="text/javascript" src="bluetooth.js"></script>
````

This will provide object `bluetooth`, similar in functionality to the regular BLE plugin object `ble`.
An example Summon app using this script can be found in `os-agnostic/`


However, when a peripheral is discovered during `bluetooth.scan` or `bluetooth.startScan`, the success callback will return a peripheral object that looks like this on both iOS and Android:

The advertisement object has the original fields as defined by [cordova-plugin-ble-central](https://github.com/don/cordova-plugin-ble-central#advertising-data) as well as an additional field, `advertisment`, which is OS-agnostic. The format follows that of [noble](https://github.com/sandeepmistry/noble), the node.js BLE library. The original `advertising` field is maintained for backwards compatibility.

```javascript
advertisement: {
    localName: "<string>",
    txPowerLevel: <int>,
    manufacturerData: <Uint8Array>,
    serviceUuids: ["<string>", ...],
    serviceData: [
        {
            uuid: "<string>",
            data: <Uint8Array>,
        },
        ...
    ],
    channel: <int>,             // iOS only
    isConnectable: <boolean>,   // iOS only
    flags: <int>,               // android only
}
```

