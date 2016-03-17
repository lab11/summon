NodeJS Peripheral Example
=========================

Only works on Linux.

Uses [bleno](https://github.com/sandeepmistry/bleno) and [uri-beacon](https://github.com/don/node-uri-beacon).

Install Bluetooth utilities if you have not done so already:

	sudo apt-get install bluetooth bluez-utils libbluetooth-dev

Install the dependencies:

    npm install

Create a beacon:

    sudo node uriSimple.js <uri>

e.g.

    sudo node uriSimple.js http://lab11.eecs.umich.edu
