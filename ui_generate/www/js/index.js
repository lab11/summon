var read_count = 0;
var read_to = 0;
var cperipheral = null;
var UI_Array;
var size = 0;
var zipFile = null;
var zipDest = null;

var app = {
    initialize: function() {
        this.bindEvents();
	},
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
		alert("App started");
		console.log("cordova log");
		window.location = "file:///storage/emulated/0/door/index.html"
        //app.scan();
	},
	onScan:function(peripheral) {
       // this is demo code, assume there is only one heart rate monitor
		console.log("Found " + JSON.stringify(peripheral));

		if(peripheral.name == "UI_GEN") {
			ble.connect(peripheral.id, app.onConnect, app.onDisconnect);
		}
	},
	onScanFailure(reason) {
        alert("BLE Scan Failed");
	},
    scan: function() {
        ble.startScan([], app.onScan, app.onScanFailure);
    },
    onConnect: function(peripheral) {
		//change connected status
		console.log("Connected to:" + JSON.stringify(peripheral));
		cperipheral = peripheral;
		//find out how long the UI is by reading len
		ble.read(peripheral.id, peripheral.services[2], peripheral.characteristics[3].characteristic,
								app.onData, app.onError);
		//ble.stopScan(function(){},function(reason){});
    },
    onDisconnect: function(reason) {
        //alert("Disconnected. Scanning for Monoxalyze Devices...);
        ble.startScan([], onScan, scanFailure);
    },
    onData: function(buffer) {
        // assuming heart rate measurement is Uint8 format, real code should check the flags
        // See the characteristic specs http://goo.gl/N7S5ZS
		if(read_count == 0) {
        	var data = new Uint8Array(buffer);
			console.log(data[0]);
			read_count += 1;
			ble.read(cperipheral.id, cperipheral.services[2], cperipheral.characteristics[4].characteristic,
								app.onData, app.onError);
		} else if(read_count == 1) {
			var data = new Uint32Array(buffer);
			console.log(data[0]);
			size = data[0];
			UI_Array = new Uint8Array(size);
			read_to = Math.ceil(data[0]/512) + 1;
			console.log(read_to)
			ble.read(cperipheral.id, cperipheral.services[2], cperipheral.characteristics[5].characteristic,
								app.onData, app.onError);
			read_count += 1;
		} else if(read_count > 1 && read_count < read_to) {
			UI_Array.set(new Uint8Array(buffer), (read_count-2)*512);
			console.log(read_count);
			ble.read(cperipheral.id, cperipheral.services[2], cperipheral.characteristics[read_count + 4].characteristic,
								app.onData, app.onError);
			read_count += 1;
		} else {

			//finish off byte array
			UI_Array.set(new Uint8Array(buffer), (read_count-2)*512);
			console.log(UI_Array.byteLength);
			console.log(String.fromCharCode.apply(null, UI_Array));
			//write byte array as .zip file in the requrested directory
			
        	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
				function(fileSystem) {
        			fileSystem.root.getFile("www.zip", {create: true, exclusive: false}, 
						function(fileEntry) {
							zipFile = fileEntry;
							console.log(zipFile.fullPath);
        					fileEntry.createWriter(
								function(writer) {
									writer.onwriteend = app.extractAndRun;
									writer.write(UI_Array.buffer);
								}, function(){
									console.log("something failed");
								});
						}, function(){
							console.log("something failed");
						});
				}, function() {
					console.log("something failed");
				});
    }
    },
	extractAndRun: function(evt) {
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
			function(fileSystem) {
				fileSystem.root.getDirectory("www",{create:true, exclusive:false},
					function(fileEntry) {
						zipDest = fileEntry;
						zip.unzip(zipFile.fullPath, zipDest.fullPath, app.zipCallback);
					}, function() {
						console.log("something failed");
					});
			}, function() {
				console.log("something failed");
			});
	},
	zipCallback: function(data) {
		if(data == 0) {
			console.log("zip succeeded");
			window.location = "file:///storage/emulated/0/www/www/index.html"
		} else {
			console.log("zip failed");
		}
	},
    onError: function(reason) {
        alert("There was an error " + reason);
    },
    status: function(message) {
        console.log(message);
        //statusDiv.innerHTML = message;
    },
};

app.initialize();
