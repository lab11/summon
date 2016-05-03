var express = require('express');
var mdns    = require('mdns');
// var exec    = require('child_process').exec;
var app     = express();

app.use(express.static(__dirname));
app.listen(0,function(){
  console.log('Serving http://localhost:'+this.address().port);
  // exec(
  //   'dns-sd -P "BBB2909 Hues" _http._tcp . '+this.address().port+' hues.local 192.168.1.28',
  //   function(error,stdout,stderr){console.log(stdout)}
  // );
  mdns.createAdvertisement(
  	mdns.tcp('http'),
    this.address().port,
    {name:'BBB2909 Hues'},
    function(d){console.log(d);}
  ).start();
});
