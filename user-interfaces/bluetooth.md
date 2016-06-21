# Bluetooth Plugin for Summon UIs

Summon provides the object `summon.bluetooth` to UIs, a less platform-dependent version of [BLE Central plugin](https://github.com/don/cordova-plugin-ble-central)'s object `ble`.

Examples of a Summon UI script using this object can be found in [`light/`](light) and [`template/`](template).

When a peripheral is discovered during `summon.bluetooth.scan`, `summon.bluetooth.startScan`, or `summon.bluetooth.connect`, the success callback will return a modified peripheral object.

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

Additionally, Summon includes the quick-connect method [`summon.bluetooth.connectDevice`](https://github.com/lab11/summon/blob/86badcce75e4b1afa73c97c6f28df84bd24fe499/mobile-app/src/plugins/cordova-plugin-bluetooth/bluetooth.js#L157), which scans for and connects to the device that "summoned" it. 

[`summon.bluetooth.disconnectDevice`](https://github.com/lab11/summon/blob/86badcce75e4b1afa73c97c6f28df84bd24fe499/mobile-app/src/plugins/cordova-plugin-bluetooth/bluetooth.js#L169) disconnects from that device. 

Beyond these variations, `summon.bluetooth` has the same methods and data structures as [BLE Central](https://github.com/don/cordova-plugin-ble-central#api)'s `ble`.