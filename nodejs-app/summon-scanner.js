var noble   = require('noble');
var request = require('request');

var UUID    = ['feaa','fed8']
var PREFIX  = ['http://www.','https://www.','http://','https://','urn:uuid:'];
var SUFFIX  = ['.com/','.org/','.edu/','.net/','.info/','.biz/','.gov/','.com','.org','.edu','.net','.info','.biz','.gov'];

noble.on('stateChange', function(state) {
  (state === 'poweredOn') ? noble.startScanning() : noble.stopScanning();
});

noble.on('discover', function(peripheral) {
  var ad = peripheral.advertisement.serviceData;
  for (var i in ad) 
    if (ad && UUID.indexOf(ad[i].uuid)>-1) {
      var uri  = PREFIX[ad[i].data[2]] || String.fromCharCode(ad[i].data[2]);
      for (var j=3; j<ad[i].data.length; j++) 
        uri += SUFFIX[ad[i].data[j]] || String.fromCharCode(ad[i].data[j]);
      request.post({
        url: 'https://summon-caster.appspot.com/resolve-scan',
        headers: {'content-type':'application/json'},
        body: JSON.stringify({objects:[{url:uri}]})
      }, function(error,response,body){
        try {
          var b = JSON.parse(body);
          console.log('\n',b.metadata[0].title,'\n',b.metadata[0].url,'\n',peripheral.advertisement.localName||''+'('+peripheral.uuid+')');
        } catch(e) {
          console.log('\n','Unresolved','\n',uri,'\n',peripheral.advertisement.localName||''+'('+peripheral.uuid+')');
        }
      });
    }
});