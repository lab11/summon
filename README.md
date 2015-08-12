Summon (tentative name)
========================

The user interface medium for the Internet of Things.
A platform that provides a convenient and scalable mechanism for Bluetooth device interactivity using web-based interfaces.

![Screenshot 1](https://lh3.googleusercontent.com/mZjhpdgXmufctor4O-_kJTROVItbnK9V5HSfcl_FOZ448S1yFL-w90dxBAgC1rkpuA=w350-rw) 
![Screenshot 2](https://lh3.googleusercontent.com/6sl6v2lT4HHC83cJZSPoOz9BgIvs_WEhd-C3ZqEJdoTXMuNNJTDlzXzWxy1kmPVSLA=w350-rw)

[![Google Play](https://developer.android.com/images/brand/en_app_rgb_wo_45.png)](https://play.google.com/store/apps/details?id=edu.umich.eecs.lab11.summon)


Bluetooth Devices
-----------------
For Bluetooth peripherals to show up in the app's scan, it must advertise the URI for its corresponding website or web app according to the [Uribeacon specification](https://github.com/google/uribeacon/blob/master/specification/AdvertisingMode.md).

Example implementations can be found in `examples/peripherals/`.


Creating Web Apps
-----------------
In addition to opening of links to regular websites, Summon supports opening of links to hosted apps generated using the [Apache Cordova](https://cordova.apache.org/) framework. Content in the app's generated platform `www` directory can be hosted online. A peripheral can then advertise a link to the web app. Such web apps can interact with the device directly over Bluetooth and perform native application functions. All standard Cordova plugins are supported, as well as [cordova-plugin-ble-central](https://github.com/don/cordova-plugin-ble-central) and [cordova-plugin-chrome-apps-sockets-udp](https://github.com/MobileChromeApps/cordova-plugin-chrome-apps-sockets-udp).

Example implementations of apps can be found in `examples/cordova-apps/`.
