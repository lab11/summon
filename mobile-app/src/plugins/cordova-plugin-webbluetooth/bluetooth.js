module.exports = Object.assign({}, ble);

module.exports.getDeviceId = function() { return gateway.getDeviceId(); }
module.exports.getDeviceUri = function() { return gateway.getDeviceUri(); }
module.exports.getDeviceName = function() { return gateway.getDeviceName(); }
