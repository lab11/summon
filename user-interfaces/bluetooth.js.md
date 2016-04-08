# Bluetooth Plugin for Summon UIs

Summon provides the object `bluetooth` to UIs, a less platform-dependent version of [BLE Central plugin](https://github.com/don/cordova-plugin-ble-central)'s plugin object `ble`.

An example of a Summon UI script using this object can be found in [`light/`](light)

When a peripheral is discovered during `bluetooth.scan`, `bluetooth.startScan`, or `bluetooth.connect`, the success callback will return a modified peripheral object.

The peripheral object has the original fields as defined by [cordova-plugin-ble-central](https://github.com/don/cordova-plugin-ble-central#advertising-data) as well as an additional field, `advertisment`, which is OS-agnostic. The format follows that of [noble](https://github.com/sandeepmistry/noble), the node.js BLE library. The original `advertising` field is maintained for backwards compatibility.

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
    flags: <int>,               // Android only
}
```

Beyond this variation, `bluetooth` has the same methods and data structures as [BLE Central plugin](https://github.com/don/cordova-plugin-ble-central#api)'s `ble`.