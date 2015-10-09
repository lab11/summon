Summon
======

<img src="mobile-app/res/icon-android.png" alt="Summon" height="80" align="left"><i>The browser for the Web of Things. </i>
<br />A platform for mobile devices that provides a convenient and scalable mechanism for IoT device interactivity, enabled by web-based interfaces and driven by the devices themselves.

![Screenshot 1](https://lh3.googleusercontent.com/mZjhpdgXmufctor4O-_kJTROVItbnK9V5HSfcl_FOZ448S1yFL-w90dxBAgC1rkpuA=w350-rw) 
![Screenshot 2](https://lh3.googleusercontent.com/6sl6v2lT4HHC83cJZSPoOz9BgIvs_WEhd-C3ZqEJdoTXMuNNJTDlzXzWxy1kmPVSLA=w350-rw)

[![Google Play](https://developer.android.com/images/brand/en_app_rgb_wo_45.png)](https://play.google.com/store/apps/details?id=edu.umich.eecs.lab11.summon)


Bluetooth Devices
-----------------
For Bluetooth peripherals to show up in the app's scan, it must advertise the URI for its corresponding website or web app according to the [Bluetooth URI AD type specification](https://www.bluetooth.org/DocMan/handlers/DownloadDoc.ashx?doc_id=302735) (page 27), or the [Eddystone-URL specification](https://github.com/google/eddystone/blob/master/protocol-specification.md).

Example implementations can be found in `examples/peripherals/`.


Creating Web Apps
-----------------
In addition to opening of links to regular websites, Summon supports opening of links to hosted apps generated using the [Apache Cordova](https://cordova.apache.org/) framework. Content in the app's generated platform `www` directory can be hosted online. A peripheral can then advertise a link to the web app. Such web apps can interact with the device directly over Bluetooth and perform native application functions. All standard Cordova plugins are supported, as well as [cordova-plugin-ble-central](https://github.com/don/cordova-plugin-ble-central) and [cordova-plugin-chrome-apps-sockets-udp](https://github.com/MobileChromeApps/cordova-plugin-chrome-apps-sockets-udp).

Example implementations of apps can be found in `examples/cordova-apps/`.
