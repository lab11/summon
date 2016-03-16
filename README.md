Summon
======

<img src="mobile-app/res/icon-android.png" alt="Summon" height="80" align="left"><i>The browser for the Web of Things. </i>
<br />A platform for mobile devices that provides a convenient and scalable mechanism for IoT device interactivity, enabled by web-based interfaces and driven by the devices themselves.

![Screenshot 1](https://lh3.googleusercontent.com/HTsNrOxas0_-gczMrosP2jo6WV3vtxb3Wba3xDLP7UQLuDQSvrFTd5BkXdS1nFPlGfBj=w350-r) 
![Screenshot 2](https://lh3.googleusercontent.com/OzlZsmVuk78PptIiuJ61dZXRitTFIqhGqJJwYPYmhhpDGv0DmgQBGkfDp8aFOfSgDQ=w350-r)

[<img src='https://play.google.com/intl/en_us/badges/images/generic/en-play-badge.png' alt="Google Play Store" height=38 />](https://play.google.com/store/apps/details?id=edu.umich.eecs.lab11.summon)
[<img src="http://images.apple.com/itunes/link/images/link-badge-appstore.png" alt="iOS App Store" height=40 />](https://itunes.apple.com/us/app/summon-lab11/id1051205682)


Bluetooth Devices
-----------------
To quickly create a Bluetooth beacon device to test with, install the [Eddystone-URL app](https://play.google.com/store/apps/details?id=edu.umich.eecs.lab11.eddystone) on a separate Android device.

For Bluetooth peripherals to show up in the app's scan, it must advertise the URI for its corresponding website or web app according to the [Bluetooth URI AD type specification](https://www.bluetooth.org/DocMan/handlers/DownloadDoc.ashx?doc_id=302735) (page 27), or the [Eddystone-URL specification](https://github.com/google/eddystone/blob/master/protocol-specification.md).

Example implementations can be found in `examples/peripherals/`.


Creating Web Apps
-----------------
In addition to opening of links to regular websites, Summon supports opening of links to hosted apps generated using the [Apache Cordova](https://cordova.apache.org/) framework. Content in the app's generated platform `www` directory can be hosted online. A peripheral can then advertise a link to the web app. Such web apps can interact with the device directly over Bluetooth and perform native application functions. All standard Cordova plugins are supported, as well as [cordova-plugin-ble-central](https://github.com/don/cordova-plugin-ble-central) and [cordova-plugin-chrome-apps-sockets-udp](https://github.com/MobileChromeApps/cordova-plugin-chrome-apps-sockets-udp).

Example implementations of apps can be found in `examples/cordova-apps/`.
