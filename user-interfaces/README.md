Making Interactive User Interfaces
==================================

In addition to opening regular websites, Summon can open app-like web UIs that use [Apache Cordova](https://cordova.apache.org/) framework plugins. These UIs are still developed using standard web tools, but they are able to interact directly over Bluetooth and perform native application functions through provided Javascript APIs. Once the UI is hosted online, a peripheral can advertise a link to it, as with an ordinary website. UIs may request and use the native smartphone APIs listed below.

Example implementations of apps can be found in [`examples/`](examples).
You can use the content in [`examples/template/www/`](examples/template/www/) to get started.


APIs
----
 
Information
- [Battery Information](https://github.com/apache/cordova-plugin-battery-status/blob/master/README.md)
- [Device Information](https://github.com/apache/cordova-plugin-device/blob/master/README.md)
- [Locale Information](https://github.com/apache/cordova-plugin-globalization/README.md)
- [Network Information](https://github.com/apache/cordova-plugin-network-information/blob/master/README.md)

Radio
- [Bluetooth](bluetooth.js.md)

Sensors & Actuators
- [Accelerometer](https://github.com/apache/cordova-plugin-device-motion/blob/master/README.md)
- [Camera](https://github.com/apache/cordova-plugin-camera/blob/master/README.md)
- [Compass](https://github.com/apache/cordova-plugin-device-orientation/blob/master/README.md)
- [Geolocation](https://github.com/apache/cordova-plugin-geolocation/README.md)
- [Media Capture](https://github.com/apache/cordova-plugin-media-capture/blob/master/README.md)
- [Vibration](https://github.com/apache/cordova-plugin-vibration/blob/master/README.md)

Content
- [Contacts](https://github.com/apache/cordova-plugin-contacts/blob/master/README.md)
- [File Read/Write](https://github.com/apache/cordova-plugin-file/README.md)
- [File Upload/Download](https://github.com/apache/cordova-plugin-file-transfer/blob/master/README.md)
- [Media View](https://github.com/apache/cordova-plugin-media/blob/master/README.md)

UI Elements
- [Dialogs](https://github.com/apache/cordova-plugin-dialogs/blob/master/README.md)


'Summoning' the UI
------------------

If the UI is hosted online, a BLE device can advertise the URL to display as the UI for the device in Summon.

If you do not have anywhere to host web content, you might want to try [hosting from Google Drive](https://support.google.com/drive/answer/2881970?hl=en).

To fit the URL of the app in a BLE advertisement, you will likely have to create a short URL link. Google provides a [service for this](http://goo.gl).

Setup the BLE device to advertise the short URL using the [Eddystone-URL specification](https://github.com/google/eddystone/tree/master/eddystone-url) or the BLE URI ad type. 

Check out [peripheral examples](../peripherals/) to see implementation of software for various BLE devices.


Creating & Testing a UI as a Native App
---------------------------------------

1.  Install [NodeJS](https://nodejs.org/).

2.  Install Cordova.

        sudo npm install -g cordova

3.  Create the app in a directory of your choice.

        cordova create [project dir name] [package name] [project title]

    e.g.

        cordova create my-app edu.umich.eecs.lab11.myapp MyApp

4.  Move into project directory and perform setup.

        cd my-app
        cordova platform add android
        cordova plugin add com.megster.cordova.ble

5.  Copy directory `www` from `template` into your project directory.

6.  Modify `www/index.html`, `www/css/index.css`, & `www/js/index.js` to your liking.

7.  Run on phone (requires Android SDK).

        cordova run

Check out [Cordova Documentation](http://cordova.apache.org/docs/en/edge/) for more information.


Debugging
---------

One way to debug a Summon app is to use the Android logging utility. To get log
messages pertinent to Summon:

    adb logcat -s "chromium"
