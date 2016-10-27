Making Interactive User Interfaces
==================================

In addition to opening regular websites, Summon can open app-like web UIs that use [Apache Cordova](https://cordova.apache.org/) framework plugins. These UIs are still developed using standard web tools, but they are able to interact directly over Bluetooth and perform native application functions through provided Javascript APIs. Once the UI is hosted online, a peripheral can advertise a link to it, as with an ordinary website. UIs may request and use the native smartphone APIs listed below.

You can use the content in [`examples/template/www/`](examples/template/www/) to get started.

Examples
--------
Example implementations of apps can be found in [`examples/`](examples). 
In addition, several Lab11 projects include their own Summon apps:
- [AudiBLE](https://github.com/lab11/audiBLE/tree/master/software/summon/audible)
- [BLEES](https://github.com/lab11/blees/tree/master/summon/blees-demo)
- [Blink](https://github.com/lab11/blees/tree/master/summon/squall-pir)
- [E-Ink](https://github.com/lab11/eink/tree/master/software/summon)
- [Monoxalyze](https://github.com/lab11/monoxalyze/tree/master/software/summon/monoxalyze-collect)
- [Polypoint](https://github.com/lab11/polypoint/tree/master/phone/tritag-summon)
- [PowerBlade](https://github.com/lab11/powerblade/tree/master/software/summon)
- [Signpost](https://github.com/lab11/signpost/tree/master/summon/demo)
- [Torch](https://github.com/lab11/torch/tree/master/summon/torch)

APIs
----
 
Information
- [`summon.battery` (Battery Information)](https://github.com/apache/cordova-plugin-battery-status/blob/master/README.md)
- [`summon.device` (Device Information)](https://github.com/apache/cordova-plugin-device/blob/master/README.md)
- [`summon.globalization` (Locale Information)](https://github.com/apache/cordova-plugin-globalization/blob/master/README.md)
- [`summon.connection` (Network Information)](https://github.com/apache/cordova-plugin-network-information/blob/master/README.md)

Radio
- [`summon.bluetooth` (Bluetooth)](mobile-app/src/plugins/cordova-plugin-bluetooth/README.md)

Sensors & Actuators
- [`summon.accelerometer` (Accelerometer)](https://github.com/apache/cordova-plugin-device-motion/blob/master/README.md)
- [`summon.camera` (Camera)](https://github.com/apache/cordova-plugin-camera/blob/master/README.md)
- [`summon.compass` (Compass)](https://github.com/apache/cordova-plugin-device-orientation/blob/master/README.md)
- [`summon.geolocation` (Geolocation)](https://github.com/apache/cordova-plugin-geolocation/blob/master/README.md)
- [`summon.device.capture` (Media Capture)](https://github.com/apache/cordova-plugin-media-capture/blob/master/README.md)
- [`summon.vibrate` (Vibration)](https://github.com/apache/cordova-plugin-vibration/blob/master/README.md)

Content
- [`summon.contacts` (Contacts)](https://github.com/apache/cordova-plugin-contacts/blob/master/README.md)
- [`summon.file` (File Read/Write)](https://github.com/apache/cordova-plugin-file/blob/master/README.md)
- [`window.FileTransfer` (File Upload/Download)](https://github.com/apache/cordova-plugin-file-transfer/blob/master/README.md)
- [`window.Media` (Media View)](https://github.com/apache/cordova-plugin-media/blob/master/README.md)

UI Elements
- [`summon.notification` (Dialogs)](https://github.com/apache/cordova-plugin-dialogs/blob/master/README.md)


'Summoning' the UI
------------------

If the UI is hosted online, a BLE device can advertise the URL to display as the UI for the device in Summon.

To quickly host a UI, we like to use [RawGit](http://rawgit.com/), which is a free convenient service that serves your raw HTML, CSS, and Javascript from GitHub.

To fit the URL of the UI in a BLE advertisement, you will likely have to create a short URL link. Google provides a [service for this](http://goo.gl).

Setup the BLE device to advertise the short URL using the [Eddystone-URL specification](https://github.com/google/eddystone/tree/master/eddystone-url). 

For example, a BLE light bulb can advertise [`https://goo.gl/rwOVN2`](https://goo.gl/rwOVN2), which redirects to [`https://cdn.rawgit.com/lab11/summon/master/user-interfaces/examples/light/www/`](https://cdn.rawgit.com/lab11/summon/master/user-interfaces/examples/light/www/index.html), a UI hosted on RawGit with source content located at [`https://github.com/lab11/summon/tree/master/user-interfaces/examples/light/www`](https://github.com/lab11/summon/tree/master/user-interfaces/examples/light/www).

Check out [peripheral examples](../peripherals/) to see implementation of software for various BLE devices.

<!--
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
        cordova plugin add cordova-plugin-ble-central

5.  Copy directory `www` from `template` into your project directory.

6.  Modify `www/index.html`, `www/css/index.css`, & `www/js/index.js` to your liking.

7.  Run on phone (requires Android SDK).

        cordova run

Check out [Cordova Documentation](http://cordova.apache.org/docs/en/edge/) for more information.
-->

Debugging
---------

One way to debug a Summon UI is to use the Android logging utility. To get log
messages pertinent to Summon:

    adb logcat -s "chromium"
