var argscheck = require('cordova/argscheck'),
    channel = require('cordova/channel'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    cordova = require('cordova');

/**
 * Identify a broadcast service.
 *
 * Usage:
 * 
 * Discovery.identify(function(serviceData) {
 *   // serviceData contains info about the identified service
 * }, function(error) {}, {
 *   clientName: "myname" // the name the server expects to see for clients connecting
 *   port: 41234 // the port the service's broadcast service is running on
 * });
 *
 * @param {Function} successCallback The function to call when the heading data is available
 * @param {Function} errorCallback The function to call when there is an error getting the heading data. (OPTIONAL)
 * @param {Object} opts The objects to pass to the plugin
 */
var Discovery = {
  identify: function(successCallback, errorCallback, opts) {
    console.log('Doing identify', opts);
    exec(successCallback, errorCallback, "Discovery", "identify", [opts]);
  }
}


module.exports = Discovery;
