module.exports = function(ctx) {
    var fs = ctx.requireCordovaModule('fs');
    var path = ctx.requireCordovaModule('path');
     
    var rootdir = ctx.opts.projectRoot;

    if (rootdir) {
        var filestoreplace = [
            "platforms/android/assets/www/",
            "platforms/ios/www/",
        ];
        filestoreplace.forEach(function(val, index, array) {
            var filename = path.join(rootdir, val, "cordova_plugins.js");
            if (fs.existsSync(filename)) {
                var data = fs.readFileSync(filename, 'utf8');
                var lstr = data.substring(data.indexOf("["),data.indexOf(";"));
                var list = JSON.parse(lstr);
                list.forEach(function(v,i,a){
                    if (v.clobbers) {
                        var c = v.clobbers[0];
                        if  (c.search("cordova.plugins.") == 0) v.clobbers.push(c.replace("cordova.plugins","summon"));
                        else if (c.search("navigator")    == 0) v.clobbers.push(c.replace("navigator","summon"));
                        else if (c.search("cordova")      == 0) v.clobbers.push(c.replace("cordova","summon"));
                        else if (c.search("window.[a-z]") == 0) v.clobbers.push(c.replace("window","summon"));
                        else if (c.search("[a-vx-z]")     == 0) v.clobbers.push("summon."+c);
                    }
                });
                var result = data.replace(lstr,JSON.stringify(list,null,4));
                fs.writeFileSync(filename, result, 'utf8');
            }
        });
        filestoreplace.forEach(function(val, index, array) {
            var filename = path.join(rootdir, val, "cordova.js");
            if (fs.existsSync(filename)) {
                var data = fs.readFileSync(filename, 'utf8');
                var expr = "window.cordova = require('cordova');";
                var result = data.replace(expr,expr+" window.summon={};");
                fs.writeFileSync(filename, result, 'utf8');
            }
        });
     
    }
}