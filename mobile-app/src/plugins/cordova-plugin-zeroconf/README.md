# Cordova ZeroConf Plugin

A modified version of (cordova-plugin-zeroconf)[https://github.com/becvert/cordova-plugin-zeroconf/tree/master] for Summon.

This plugin allows you to browse and publish ZeroConf/Bonjour/mDNS services from applications developed using PhoneGap/Cordova 3.0 or newer.

This is not a background service. When the cordova view is destroyed/terminated, publish and watch operations are stopped.

## Installation ##

In your application project directory:

```bash
cordova plugin add cordova-plugin-zeroconf
```

## Usage ##

```javascript
var zeroconf = cordova.plugins.zeroconf;
```

#### `register(type, name, port, txtRecord)`
Publishes a new service.

```javascript
zeroconf.register('_http._tcp.local.', 'Tom\'s iPad', 80, {
    'foo' : 'bar'
});
```

#### `unregister(type, name)`
Unregisters a service.

```javascript
zeroconf.unregister('_http._tcp.local.', 'Tom\'s iPad');
```

#### `stop()`
Unregisters all published services.

```javascript
zeroconf.stop();
```

#### `watch(type, callback)`
Starts watching for services of the specified type.

```javascript
zeroconf.watch('_http._tcp.local.', function(result) {
    var action = result.action;
    var service = result.service;
    if (action == 'added') {
        console.log('service added', service);
    } else {
        console.log('service removed', service);
    }
});
```

To detect all services, specify the "Service Type Enumeration" meta-query type:

```javascript
zeroconf.watch("_services._dns-sd._udp.local.",function(result){...});
```


#### `unwatch(type)`
Stops watching for services of the specified type.

```javascript
zeroconf.unwatch('_http._tcp.local.')
```

#### `close()`
Closes the service browser and stops watching.

```javascript
zeroconf.close()
```

## Credits

#### Android
It depends on [the JmDNS library](http://jmdns.sourceforge.net/). Bundles [the jmdns.jar](https://github.com/twitwi/AndroidDnssdDemo/) library.

Many thanks to [cambiocreative](https://github.com/cambiocreative/cordova-plugin-zeroconf) that got me started

#### iOS
See https://developer.apple.com/bonjour/

## Licence ##

The MIT License
