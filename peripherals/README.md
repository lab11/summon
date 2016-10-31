Peripherals
===========

To quickly create a Bluetooth beacon device to test with, install the [Eddystone-URL app](https://play.google.com/store/apps/details?id=edu.umich.eecs.lab11.eddystone) on a separate Android device.

For Bluetooth peripherals to be listed the Summon's scan, it must advertise the URI for its corresponding web interface according to the [Bluetooth URI AD type specification](https://www.bluetooth.org/DocMan/handlers/DownloadDoc.ashx?doc_id=302735) (page 27), or the [Eddystone-URL specification](https://github.com/google/eddystone/blob/master/protocol-specification.md).

Local Wi-Fi peripherals can advertise the URL as an HTTP service over mDNS/ZeroConf/Bonjour.


Examples
--------

Example implementations of peripherals can be found in [`examples/`](peripherals/examples), including the source for the beacon app.
In addition, several Lab11 projects include their own Summon-compatible peripherals:
- [AudiBLE](https://github.com/lab11/audiBLE/)
- [BLEES](https://github.com/lab11/blees/)
- [Blink](https://github.com/lab11/blees/)
- [E-Ink](https://github.com/lab11/eink/)
- [Monoxalyze](https://github.com/lab11/monoxalyze/)
- [Polypoint](https://github.com/lab11/polypoint/)
- [PowerBlade](https://github.com/lab11/powerblade/)
- [Signpost](https://github.com/lab11/signpost/)
- [Torch](https://github.com/lab11/torch/)
