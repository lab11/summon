var express = require('express');
var mdns    = require('mdns');
var app     = express();

app.use(express.static(__dirname));
app.listen(0,function(){
  console.log('Serving http://localhost:'+this.address().port);
  mdns.createAdvertisement(
  	mdns.tcp('http'),
    this.address().port,
    {name:'Example UI'},
    function(d){console.log(d);}
  ).start();
});
