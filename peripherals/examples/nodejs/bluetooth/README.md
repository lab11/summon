NodeJS Peripheral Example
=========================

Creates a BLE beacon using the Eddystone-URL format. 

Uses [bleno](https://github.com/sandeepmistry/bleno) and [eddystone-beacon](https://github.com/don/node-eddystone-beacon).

Works on Mac, Linux, & Windows ([see prerequisites](https://github.com/sandeepmistry/bleno#prerequisites)).

Install the dependencies:

    npm install

Create a beacon:

    sudo node uriSimple.js <uri>

e.g.

    sudo node uriSimple.js http://lab11.eecs.umich.edu
