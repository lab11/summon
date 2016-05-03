NodeJS mDNS Peripheral Example
==============================

Hosts a user interface on the local Wi-Fi network and broadcasts the address over mDNS/Bonjour/ZeroConf.
Summon will display the UI when the phone is connected to that network.


Getting Started
---------------

    npm install
    node serve.js

By default, content is hosted at a random port. 
The URL is announced to the local network as an HTTP service over mDNS.
The UI content should be placed in [`www`](www).

[Summon](https://github.com/lab11/summon) ([Android](https://play.google.com/store/apps/details?id=edu.umich.eecs.lab11.summon), [iOS](https://itunes.apple.com/us/app/summon-lab11/id1051205682)) will display the user interface when your phone is connected to the WiFi network.

__NOTE__: For Debian-based systems like Raspberry Pis, you may need to first `apt-get install libavahi-compat-libdnssd-dev`.

