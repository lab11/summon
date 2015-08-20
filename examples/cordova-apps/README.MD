Making Interactive Apps
=======================


Getting Started
---------------

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

5.  Copy directory `www` from a template app into your project directory.

6.  Modify `www/index.html`, `www/css/index.css`, & `www/js/index.js` to your liking.

7.  Run on phone (requires Android SDK).

        cordova run


Additional Info
---------------

[Documentation for Cordova](http://cordova.apache.org/docs/en/edge/)

[Documentation for the Bluetooth Plugin](https://github.com/don/cordova-plugin-ble-central)


Summoning the App
-----------------

If the app is hosted online, a BLE device can advertise the URL to display as the UI for the device in Summon.

If you do not have anywhere host web content, you might want to try [hosting from Google Drive](https://support.google.com/drive/answer/2881970?hl=en).

To fit the URL in a BLE advertisement, you will likely have to create a short URL link. Google provides a [service for this](http://goo.gl).

Setup the BLE device to advertise the short URL using the [Eddystone-URL specification](https://github.com/google/eddystone/tree/master/eddystone-url) or the BLE URI ad type. 

Check out [peripheral examples](../peripherals/) to see implementation of software for various BLE devices.