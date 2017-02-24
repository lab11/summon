/* @license
 * 
 * WebBluetooth Cordova Plugin
 * Copyright (c) 2017 Thomas Zachariah
 *
 * Includes: BLE Abstraction Tool, Copyright (c) 2016 Rob Moran
 * 
 * The MIT License (MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals with support for web workers (root is window)
        root.bleatHelpers = factory();
    }
}(this, function() {
    "use strict";

    var bluetoothServices = {
        "alert_notification": 0x1811,
        "automation_io": 0x1815,
        "battery_service": 0x180F,
        "blood_pressure": 0x1810,
        "body_composition": 0x181B,
        "bond_management": 0x181E,
        "continuous_glucose_monitoring": 0x181F,
        "current_time": 0x1805,
        "cycling_power": 0x1818,
        "cycling_speed_and_cadence": 0x1816,
        "device_information": 0x180A,
        "environmental_sensing": 0x181A,
        "generic_access": 0x1800,
        "generic_attribute": 0x1801,
        "glucose": 0x1808,
        "health_thermometer": 0x1809,
        "heart_rate": 0x180D,
        "human_interface_device": 0x1812,
        "immediate_alert": 0x1802,
        "indoor_positioning": 0x1821,
        "internet_protocol_support": 0x1820,
        "link_loss": 0x1803,
        "location_and_navigation": 0x1819,
        "next_dst_change": 0x1807,
        "phone_alert_status": 0x180E,
        "pulse_oximeter": 0x1822,
        "reference_time_update": 0x1806,
        "running_speed_and_cadence": 0x1814,
        "scan_parameters": 0x1813,
        "tx_power": 0x1804,
        "user_data": 0x181C,
        "weight_scale": 0x181D
    };

    var bluetoothCharacteristics = {
        "aerobic_heart_rate_lower_limit": 0x2A7E,
        "aerobic_heart_rate_upper_limit": 0x2A84,
        "aerobic_threshold": 0x2A7F,
        "age": 0x2A80,
        "aggregate": 0x2A5A,
        "alert_category_id": 0x2A43,
        "alert_category_id_bit_mask": 0x2A42,
        "alert_level": 0x2A06,
        "alert_notification_control_point": 0x2A44,
        "alert_status": 0x2A3F,
        "altitude": 0x2AB3,
        "anaerobic_heart_rate_lower_limit": 0x2A81,
        "anaerobic_heart_rate_upper_limit": 0x2A82,
        "anaerobic_threshold": 0x2A83,
        "analog": 0x2A58,
        "apparent_wind_direction": 0x2A73,
        "apparent_wind_speed": 0x2A72,
        "gap.appearance": 0x2A01,
        "barometric_pressure_trend": 0x2AA3,
        "battery_level": 0x2A19,
        "blood_pressure_feature": 0x2A49,
        "blood_pressure_measurement": 0x2A35,
        "body_composition_feature": 0x2A9B,
        "body_composition_measurement": 0x2A9C,
        "body_sensor_location": 0x2A38,
        "bond_management_control_point": 0x2AA4,
        "bond_management_feature": 0x2AA5,
        "boot_keyboard_input_report": 0x2A22,
        "boot_keyboard_output_report": 0x2A32,
        "boot_mouse_input_report": 0x2A33,
        "gap.central_address_resolution_support": 0x2AA6,
        "cgm_feature": 0x2AA8,
        "cgm_measurement": 0x2AA7,
        "cgm_session_run_time": 0x2AAB,
        "cgm_session_start_time": 0x2AAA,
        "cgm_specific_ops_control_point": 0x2AAC,
        "cgm_status": 0x2AA9,
        "csc_feature": 0x2A5C,
        "csc_measurement": 0x2A5B,
        "current_time": 0x2A2B,
        "cycling_power_control_point": 0x2A66,
        "cycling_power_feature": 0x2A65,
        "cycling_power_measurement": 0x2A63,
        "cycling_power_vector": 0x2A64,
        "database_change_increment": 0x2A99,
        "date_of_birth": 0x2A85,
        "date_of_threshold_assessment": 0x2A86,
        "date_time": 0x2A08,
        "day_date_time": 0x2A0A,
        "day_of_week": 0x2A09,
        "descriptor_value_changed": 0x2A7D,
        "gap.device_name": 0x2A00,
        "dew_point": 0x2A7B,
        "digital": 0x2A56,
        "dst_offset": 0x2A0D,
        "elevation": 0x2A6C,
        "email_address": 0x2A87,
        "exact_time_256": 0x2A0C,
        "fat_burn_heart_rate_lower_limit": 0x2A88,
        "fat_burn_heart_rate_upper_limit": 0x2A89,
        "firmware_revision_string": 0x2A26,
        "first_name": 0x2A8A,
        "five_zone_heart_rate_limits": 0x2A8B,
        "floor_number": 0x2AB2,
        "gender": 0x2A8C,
        "glucose_feature": 0x2A51,
        "glucose_measurement": 0x2A18,
        "glucose_measurement_context": 0x2A34,
        "gust_factor": 0x2A74,
        "hardware_revision_string": 0x2A27,
        "heart_rate_control_point": 0x2A39,
        "heart_rate_max": 0x2A8D,
        "heart_rate_measurement": 0x2A37,
        "heat_index": 0x2A7A,
        "height": 0x2A8E,
        "hid_control_point": 0x2A4C,
        "hid_information": 0x2A4A,
        "hip_circumference": 0x2A8F,
        "humidity": 0x2A6F,
        "ieee_11073-20601_regulatory_certification_data_list": 0x2A2A,
        "indoor_positioning_configuration": 0x2AAD,
        "intermediate_blood_pressure": 0x2A36,
        "intermediate_temperature": 0x2A1E,
        "irradiance": 0x2A77,
        "language": 0x2AA2,
        "last_name": 0x2A90,
        "latitude": 0x2AAE,
        "ln_control_point": 0x2A6B,
        "ln_feature": 0x2A6A,
        "local_east_coordinate.xml": 0x2AB1,
        "local_north_coordinate": 0x2AB0,
        "local_time_information": 0x2A0F,
        "location_and_speed": 0x2A67,
        "location_name": 0x2AB5,
        "longitude": 0x2AAF,
        "magnetic_declination": 0x2A2C,
        "magnetic_flux_density_2D": 0x2AA0,
        "magnetic_flux_density_3D": 0x2AA1,
        "manufacturer_name_string": 0x2A29,
        "maximum_recommended_heart_rate": 0x2A91,
        "measurement_interval": 0x2A21,
        "model_number_string": 0x2A24,
        "navigation": 0x2A68,
        "new_alert": 0x2A46,
        "gap.peripheral_preferred_connection_parameters": 0x2A04,
        "gap.peripheral_privacy_flag": 0x2A02,
        "plx_continuous_measurement": 0x2A5F,
        "plx_features": 0x2A60,
        "plx_spot_check_measurement": 0x2A5E,
        "pnp_id": 0x2A50,
        "pollen_concentration": 0x2A75,
        "position_quality": 0x2A69,
        "pressure": 0x2A6D,
        "protocol_mode": 0x2A4E,
        "rainfall": 0x2A78,
        "gap.reconnection_address": 0x2A03,
        "record_access_control_point": 0x2A52,
        "reference_time_information": 0x2A14,
        "report": 0x2A4D,
        "report_map": 0x2A4B,
        "resting_heart_rate": 0x2A92,
        "ringer_control_point": 0x2A40,
        "ringer_setting": 0x2A41,
        "rsc_feature": 0x2A54,
        "rsc_measurement": 0x2A53,
        "sc_control_point": 0x2A55,
        "scan_interval_window": 0x2A4F,
        "scan_refresh": 0x2A31,
        "sensor_location": 0x2A5D,
        "serial_number_string": 0x2A25,
        "gatt.service_changed": 0x2A05,
        "software_revision_string": 0x2A28,
        "sport_type_for_aerobic_and_anaerobic_thresholds": 0x2A93,
        "supported_new_alert_category": 0x2A47,
        "supported_unread_alert_category": 0x2A48,
        "system_id": 0x2A23,
        "temperature": 0x2A6E,
        "temperature_measurement": 0x2A1C,
        "temperature_type": 0x2A1D,
        "three_zone_heart_rate_limits": 0x2A94,
        "time_accuracy": 0x2A12,
        "time_source": 0x2A13,
        "time_update_control_point": 0x2A16,
        "time_update_state": 0x2A17,
        "time_with_dst": 0x2A11,
        "time_zone": 0x2A0E,
        "true_wind_direction": 0x2A71,
        "true_wind_speed": 0x2A70,
        "two_zone_heart_rate_limit": 0x2A95,
        "tx_power_level": 0x2A07,
        "uncertainty": 0x2AB4,
        "unread_alert_status": 0x2A45,
        "user_control_point": 0x2A9F,
        "user_index": 0x2A9A,
        "uv_index": 0x2A76,
        "vo2_max": 0x2A96,
        "waist_circumference": 0x2A97,
        "weight": 0x2A98,
        "weight_measurement": 0x2A9D,
        "weight_scale_feature": 0x2A9E,
        "wind_chill": 0x2A79
    };

    var bluetoothDescriptors = {
        "gatt.characteristic_extended_properties": 0x2900,
        "gatt.characteristic_user_description": 0x2901,
        "gatt.client_characteristic_configuration": 0x2902,
        "gatt.server_characteristic_configuration": 0x2903,
        "gatt.characteristic_presentation_format": 0x2904,
        "gatt.characteristic_aggregate_format": 0x2905,
        "valid_range": 0x2906,
        "external_report_reference": 0x2907,
        "report_reference": 0x2908,
        "number_of_digitals": 0x2909,
        "value_trigger_setting": 0x290A,
        "es_configuration": 0x290B,
        "es_measurement": 0x290C,
        "es_trigger_setting": 0x290D,
        "time_trigger_setting": 0x290E
    };

    function getCanonicalUUID(uuid) {
        if (typeof uuid === "number") uuid = uuid.toString(16);
        uuid = uuid.toLowerCase();
        if (uuid.length <= 8) uuid = ("00000000" + uuid).slice(-8) + "-0000-1000-8000-00805f9b34fb";
        if (uuid.length === 32) uuid = uuid.match(/^([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})$/).splice(1).join("-");
        return uuid;
    }

    function getServiceUUID(uuid) {
        if (bluetoothServices[uuid]) uuid = bluetoothServices[uuid];
        return getCanonicalUUID(uuid);
    }

    function getCharacteristicUUID(uuid) {
        if (bluetoothCharacteristics[uuid]) uuid = bluetoothCharacteristics[uuid];
        return getCanonicalUUID(uuid);
    }

    function getDescriptorUUID(uuid) {
        if (bluetoothDescriptors[uuid]) uuid = bluetoothDescriptors[uuid];
        return getCanonicalUUID(uuid);
    }

    return {
        Services: bluetoothServices,
        Characteristics: bluetoothCharacteristics,
        Descriptors: bluetoothDescriptors,
        getCanonicalUUID: getCanonicalUUID,
        getServiceUUID: getServiceUUID,
        getCharacteristicUUID: getCharacteristicUUID,
        getDescriptorUUID: getDescriptorUUID
    };
}));

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        if (root.navigator.bluetooth) {
            // Return existing web-bluetooth
            define(root.navigator.bluetooth);
        } else {
            define(['es6-promise', 'es6-map', 'bluetooth.helpers'], factory);
        }
    } else {
        // Browser globals with support for web workers (root is window)
        // Assume Promise exists or has been poly-filled
        root.bleat = root.navigator.bluetooth || factory(root.Promise, root.Map, root.bleatHelpers);
    }
}(this, function(Promise, Map, helpers) {
    "use strict";

    var defaultScanTime = 10.24 * 1000;
    var adapter = null;
    var adapters = {};

    function wrapReject(reject, msg) {
        return function(error) {
            reject(msg + ": " + error);
        };
    }

    function mergeDictionary(base, extension) {
        if (extension) {
            Object.keys(extension).forEach(function(key) {
                if (extension[key] && base.hasOwnProperty(key)) {
                    if (Object.prototype.toString.call(base[key]) === "[object Object]") mergeDictionary(base[key], extension[key]);
                    else if (Object.prototype.toString.call(base[key]) === "[object Map]" && Object.prototype.toString.call(extension[key]) === "[object Object]") {
                        Object.keys(extension[key]).forEach(function(mapKey) {
                            base[key].set(mapKey, extension[key][mapKey]);
                        });
                    }
                    else base[key] = extension[key];
                }
            });
        }
    }

    var events = {};
    function createListenerFn(eventTypes) {
        return function(type, callback, capture) {
            if (eventTypes.indexOf(type) < 0) return; //error
            if (!events[this]) events[this] = {};
            if (!events[this][type]) events[this][type] = [];
            events[this][type].push(callback);
        };
    }
    function removeEventListener(type, callback, capture) {
        if (!events[this] || !events[this][type]) return; //error
        var i = events[this][type].indexOf(callback);
        if (i >= 0) events[this][type].splice(i, 1);
        if (events[this][type].length === 0) delete events[this][type];
        if (Object.keys(events[this]).length === 0) delete events[this];
    }
    function dispatchEvent(event) {
        if (!events[this] || !events[this][event.type]) return; //error
        event.target = this;
        events[this][event.type].forEach(function(callback) {
            if (typeof callback === "function") callback(event);
        });
    }

    function filterDevice(options, deviceInfo) {
        var valid = false;
        var validServices = [];

        options.filters.forEach(function(filter) {
            // Name
            if (filter.name && filter.name !== deviceInfo.name) return;

            // NamePrefix
            if (filter.namePrefix) {
                if (filter.namePrefix.length > deviceInfo.name.length) return;
                if (filter.namePrefix !== deviceInfo.name.substr(0, filter.namePrefix.length)) return;
            }

            // Services
            if (filter.services) {
                var serviceUUIDs = filter.services.map(helpers.getServiceUUID);
                var servicesValid = serviceUUIDs.every(function(serviceUUID) {
                    return (deviceInfo.uuids.indexOf(serviceUUID) > -1);
                });

                if (!servicesValid) return;
                validServices = validServices.concat(serviceUUIDs);
            }

            valid = true;
        });

        if (!valid) return false;

        // Add additional services
        if (options.optionalServices) {
            validServices = validServices.concat(options.optionalServices.map(helpers.getServiceUUID));
        }

        // Set unique list of allowed services
        deviceInfo._allowedServices = validServices.filter(function(item, index, array) {
            return array.indexOf(item) === index;
        });

        return deviceInfo;
    }

    var scanner = null;
    function requestDevice(options) {
        return new Promise(function(resolve, reject) {
            if (scanner !== null) return reject("requestDevice error: request in progress");

            if (!options.deviceFound) {
                // Must have a filter
                if (!options.filters || options.filters.length === 0) {
                    return reject(new TypeError("requestDevice error: no filters specified"));
                }

                // Don't allow empty filters
                var emptyFilter = options.filters.some(function(filter) {
                    return (Object.keys(filter).length === 0);
                });
                if (emptyFilter) {
                    return reject(new TypeError("requestDevice error: empty filter specified"));
                }

                // Don't allow empty namePrefix
                var emptyPrefix = options.filters.some(function(filter) {
                    return (typeof filter.namePrefix !== "undefined" && filter.namePrefix === "");
                });
                if (emptyPrefix) {
                    return reject(new TypeError("requestDevice error: empty namePrefix specified"));
                }
            }

            var searchUUIDs = [];
            if (options.filters) {
                options.filters.forEach(function(filter) {
                    if (filter.services) searchUUIDs = searchUUIDs.concat(filter.services.map(helpers.getServiceUUID));
                });
            }
            // Unique-ify
            searchUUIDs = searchUUIDs.filter(function(item, index, array) {
                return array.indexOf(item) === index;
            });

            var scanTime = options.scanTime || defaultScanTime;
            var completeFn = options.deviceFound ? resolve : function() {
                reject("requestDevice error: no devices found");
            };

            adapter.startScan(searchUUIDs, function(deviceInfo) {

                // filter devices if filters specified
                if (options.filters) {
                    deviceInfo = filterDevice(options, deviceInfo);
                }

                if (deviceInfo) {
                    var bluetoothDevice = new BluetoothDevice(deviceInfo);
                    if (!options.deviceFound || options.deviceFound(bluetoothDevice)) {
                        cancelRequest()
                        .then(function() {
                            resolve(bluetoothDevice);
                        });
                    }
                }
            }, function() {
                scanner = setTimeout(function() {
                    cancelRequest()
                    .then(completeFn);
                }, scanTime);
            }, wrapReject(reject, "requestDevice error"));
        });
    }
    function cancelRequest() {
        return new Promise(function(resolve, reject) {
            if (scanner) {
                clearTimeout(scanner);
                scanner = null;
                adapter.stopScan();
            }
            resolve();
        });
    }

    // BluetoothDevice Object
    var BluetoothDevice = function(properties) {
        this._handle = null;
        this._allowedServices = [];

        this.id = "unknown"; 
        this.name = null;
        this.adData = {
            appearance: null,
            txPower: null,
            rssi: null,
            manufacturerData: new Map(),
            serviceData: new Map()
        };
        this.gatt = new BluetoothRemoteGATTServer();
        this.gatt.device = this;
        this.uuids = [];

        mergeDictionary(this, properties);
    };
    BluetoothDevice.prototype.addEventListener = createListenerFn([
        "gattserverdisconnected",
    ]);
    BluetoothDevice.prototype.removeEventListener = removeEventListener;
    BluetoothDevice.prototype.dispatchEvent = dispatchEvent;

    // BluetoothRemoteGATTServer Object
    var BluetoothRemoteGATTServer = function() {
        this._services = null;

        this.device = null;
        this.connected = false;
    };
    BluetoothRemoteGATTServer.prototype.connect = function() {
        return new Promise(function(resolve, reject) {
            if (this.connected) return reject("connect error: device already connected");

            adapter.connect(this.device._handle, function() {
                this.connected = true;
                resolve(this);
            }.bind(this), function() {
                this.connected = false;
                this.device.dispatchEvent({ type: "gattserverdisconnected", bubbles: true });
            }.bind(this), wrapReject(reject, "connect error"));
        }.bind(this));
    };
    BluetoothRemoteGATTServer.prototype.disconnect = function() {
        adapter.disconnect(this.device._handle);
        this.connected = false;
    };
    BluetoothRemoteGATTServer.prototype.getPrimaryService = function(serviceUUID) {
        return new Promise(function(resolve, reject) {
            if (!this.connected) return reject("getPrimaryService error: device not connected");
            if (!serviceUUID) return reject("getPrimaryService error: no service specified");

            this.getPrimaryServices(serviceUUID)
            .then(function(services) {
                if (services.length !== 1) return reject("getPrimaryService error: service not found");
                resolve(services[0]);
            })
            .catch(function(error) {
                reject(error);
            });
        }.bind(this));
    };
    BluetoothRemoteGATTServer.prototype.getPrimaryServices = function(serviceUUID) {
        return new Promise(function(resolve, reject) {
            if (!this.connected) return reject("getPrimaryServices error: device not connected");

            function complete() {
                if (!serviceUUID) return resolve(this._services);
                var filtered = this._services.filter(function(service) {
                    return (service.uuid === helpers.getServiceUUID(serviceUUID));
                });
                if (filtered.length !== 1) return reject("getPrimaryServices error: service not found");
                resolve(filtered);
            }
            if (this._services) return complete.call(this);
            adapter.discoverServices(this.device._handle, this.device._allowedServices, function(services) {
                this._services = services.map(function(serviceInfo) {
                    serviceInfo.device = this.device;
                    return new BluetoothRemoteGATTService(serviceInfo);
                }.bind(this));
                complete.call(this);
            }.bind(this), wrapReject(reject, "getPrimaryServices error"));
        }.bind(this));
    };

    // BluetoothRemoteGATTService Object
    var BluetoothRemoteGATTService = function(properties) {
        this._handle = null;
        this._services = null;
        this._characteristics = null;

        this.device = null;
        this.uuid = null;
        this.isPrimary = false;

        mergeDictionary(this, properties);
        this.dispatchEvent({ type: "serviceadded", bubbles: true });
    };
    BluetoothRemoteGATTService.prototype.getCharacteristic = function(characteristicUUID) {
        return new Promise(function(resolve, reject) {
            if (!this.device.gatt.connected) return reject("getCharacteristic error: device not connected");
            if (!characteristicUUID) return reject("getCharacteristic error: no characteristic specified");

            this.getCharacteristics(characteristicUUID)
            .then(function(characteristics) {
                if (characteristics.length !== 1) return reject("getCharacteristic error: characteristic not found");
                resolve(characteristics[0]);
            })
            .catch(function(error) {
                reject(error);
            });
        }.bind(this));
    };
    BluetoothRemoteGATTService.prototype.getCharacteristics = function(characteristicUUID) {
        return new Promise(function(resolve, reject) {
            if (!this.device.gatt.connected) return reject("getCharacteristics error: device not connected");

            function complete() {
                if (!characteristicUUID) return resolve(this._characteristics);
                var filtered = this._characteristics.filter(function(characteristic) {
                    return (characteristic.uuid === helpers.getCharacteristicUUID(characteristicUUID));
                });
                if (filtered.length !== 1) return reject("getCharacteristics error: characteristic not found");
                resolve(filtered);
            }
            if (this._characteristics) return complete.call(this);
            adapter.discoverCharacteristics(this._handle, [], function(characteristics) {
                this._characteristics = characteristics.map(function(characteristicInfo) {
                    characteristicInfo.service = this;
                    return new BluetoothRemoteGATTCharacteristic(characteristicInfo);
                }.bind(this));
                complete.call(this);
            }.bind(this), wrapReject(reject, "getCharacteristics error"));
        }.bind(this));
    };
    BluetoothRemoteGATTService.prototype.getIncludedService = function(serviceUUID) {
        return new Promise(function(resolve, reject) {
            if (!this.device.gatt.connected) return reject("getIncludedService error: device not connected");
            if (!serviceUUID) return reject("getIncludedService error: no service specified");

            this.getIncludedServices(serviceUUID)
            .then(function(services) {
                if (services.length !== 1) return reject("getIncludedService error: service not found");
                resolve(services[0]);
            })
            .catch(function(error) {
                reject(error);
            });
        }.bind(this));
    };
    BluetoothRemoteGATTService.prototype.getIncludedServices = function(serviceUUID) {
        return new Promise(function(resolve, reject) {
            if (!this.device.gatt.connected) return reject("getIncludedServices error: device not connected");

            function complete() {
                if (!serviceUUID) return resolve(this._services);
                var filtered = this._services.filter(function(service) {
                    return (service.uuid === helpers.getServiceUUID(serviceUUID));
                });
                if (filtered.length !== 1) return reject("getIncludedServices error: service not found");
                resolve(filtered);
            }
            if (this._services) return complete.call(this);
            adapter.discoverIncludedServices(this._handle, this.device._allowedServices, function(services) {
                this._services = services.map(function(serviceInfo) {
                    serviceInfo.device = this.device;
                    return new BluetoothRemoteGATTService(serviceInfo);
                }.bind(this));
                complete.call(this);
            }.bind(this), wrapReject(reject, "getIncludedServices error"));
        }.bind(this));
    };
    BluetoothRemoteGATTService.prototype.addEventListener = createListenerFn([
        "serviceadded",
        "servicechanged",
        "serviceremoved"
    ]);
    BluetoothRemoteGATTService.prototype.removeEventListener = removeEventListener;
    BluetoothRemoteGATTService.prototype.dispatchEvent = dispatchEvent;

    // BluetoothRemoteGATTCharacteristic Object
    var BluetoothRemoteGATTCharacteristic = function(properties) {
        this._handle = null;
        this._descriptors = null;

        this.service = null;
        this.uuid = null;
        this.properties = {
            broadcast: false,
            read: false,
            writeWithoutResponse: false,
            write: false,
            notify: false,
            indicate: false,
            authenticatedSignedWrites: false,
            reliableWrite: false,
            writableAuxiliaries: false
        };
        this.value = null;

        mergeDictionary(this, properties);
    };
    BluetoothRemoteGATTCharacteristic.prototype.getDescriptor = function(descriptorUUID) {
        return new Promise(function(resolve, reject) {
            if (!this.service.device.gatt.connected) return reject("getDescriptor error: device not connected");
            if (!descriptorUUID) return reject("getDescriptor error: no descriptor specified");

            this.getDescriptors(descriptorUUID)
            .then(function(descriptors) {
                if (descriptors.length !== 1) return reject("getDescriptor error: descriptor not found");
                resolve(descriptors[0]);
            })
            .catch(function(error) {
                reject(error);
            });
        }.bind(this));
    };
    BluetoothRemoteGATTCharacteristic.prototype.getDescriptors = function(descriptorUUID) {
        return new Promise(function(resolve, reject) {
            if (!this.service.device.gatt.connected) return reject("getDescriptors error: device not connected");

            function complete() {
                if (!descriptorUUID) return resolve(this._descriptors);
                var filtered = this._descriptors.filter(function(descriptor) {
                    return (descriptor.uuid === helpers.getDescriptorUUID(descriptorUUID));
                });
                if (filtered.length !== 1) return reject("getDescriptors error: descriptor not found");
                resolve(filtered);
            }
            if (this._descriptors) return complete.call(this);
            adapter.discoverDescriptors(this._handle, [], function(descriptors) {
                this._descriptors = descriptors.map(function(descriptorInfo) {
                    descriptorInfo.characteristic = this;
                    return new BluetoothRemoteGATTDescriptor(descriptorInfo);
                }.bind(this));
                complete.call(this);
            }.bind(this), wrapReject(reject, "getDescriptors error"));
        }.bind(this));
    };
    BluetoothRemoteGATTCharacteristic.prototype.readValue = function() {
        return new Promise(function(resolve, reject) {
            if (!this.service.device.gatt.connected) return reject("readValue error: device not connected");

            adapter.readCharacteristic(this._handle, function(dataView) {
                this.value = dataView;
                resolve(dataView);
                this.dispatchEvent({ type: "characteristicvaluechanged", bubbles: true });
            }.bind(this), wrapReject(reject, "readValue error"));
        }.bind(this));
    };
    BluetoothRemoteGATTCharacteristic.prototype.writeValue = function(bufferSource) {
        return new Promise(function(resolve, reject) {
            if (!this.service.device.gatt.connected) return reject("writeValue error: device not connected");

            var arrayBuffer = bufferSource.buffer || bufferSource;
            var dataView = new DataView(arrayBuffer);
            adapter.writeCharacteristic(this._handle, dataView, function() {
                this.value = dataView;
                resolve();
            }.bind(this), wrapReject(reject, "writeValue error"));
        }.bind(this));
    };
    BluetoothRemoteGATTCharacteristic.prototype.startNotifications = function() {
        return new Promise(function(resolve, reject) {
            if (!this.service.device.gatt.connected) return reject("startNotifications error: device not connected");

            adapter.enableNotify(this._handle, function(dataView) {
                this.value = dataView;
                this.dispatchEvent({ type: "characteristicvaluechanged", bubbles: true });
            }.bind(this), resolve, wrapReject(reject, "startNotifications error"));
        }.bind(this));
    };
    BluetoothRemoteGATTCharacteristic.prototype.stopNotifications = function() {
        return new Promise(function(resolve, reject) {
            if (!this.service.device.gatt.connected) return reject("stopNotifications error: device not connected");

            adapter.disableNotify(this._handle, resolve, wrapReject(reject, "stopNotifications error"));
        }.bind(this));
    };
    BluetoothRemoteGATTCharacteristic.prototype.addEventListener = createListenerFn([
        "characteristicvaluechanged"
    ]);
    BluetoothRemoteGATTCharacteristic.prototype.removeEventListener = removeEventListener;
    BluetoothRemoteGATTCharacteristic.prototype.dispatchEvent = dispatchEvent;

    // BluetoothRemoteGATTDescriptor Object
    var BluetoothRemoteGATTDescriptor = function(properties) {
        this._handle = null;

        this.characteristic = null;
        this.uuid = null;
        this.value = null;

        mergeDictionary(this, properties);
    };
    BluetoothRemoteGATTDescriptor.prototype.readValue = function() {
        return new Promise(function(resolve, reject) {
            if (!this.characteristic.service.device.gatt.connected) return reject("readValue error: device not connected");

            adapter.readDescriptor(this._handle, function(dataView) {
                this.value = dataView;
                resolve(dataView);
            }.bind(this), wrapReject(reject, "readValue error"));
        }.bind(this));
    };
    BluetoothRemoteGATTDescriptor.prototype.writeValue = function(bufferSource) {
        return new Promise(function(resolve, reject) {
            if (!this.characteristic.service.device.gatt.connected) return reject("writeValue error: device not connected");

            var arrayBuffer = bufferSource.buffer || bufferSource;
            var dataView = new DataView(arrayBuffer);
            adapter.writeDescriptor(this._handle, dataView, function() {
                this.value = dataView;
                resolve();
            }.bind(this), wrapReject(reject, "writeValue error"));
        }.bind(this));
    };

    // Bluetooth Object
    return {
        _addAdapter: function(adapterName, definition) {
            adapters[adapterName] = definition;
            adapter = definition;
        },
        requestDevice: requestDevice,
        cancelRequest: cancelRequest
    };
}));

;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    // Not supported by Cordova.
    define(['bleat', 'bluetooth.helpers'], factory.bind(this, root));
  } else {
    // Browser globals with support for web workers (root is window)
    // Used with Cordova.
    factory(root, root.bleat, root.bleatHelpers);
  }
})(this, function(root, bleat, helpers) {
  "use strict";

  // Object that holds Bleat adapter functions.
  var adapter = {};

  var mDeviceIdToDeviceHandle = {};
  var mServiceHandleToDeviceHandle = {};
  var mCharacteristicHandleToDeviceHandle = {};
  var mDescriptorHandleToDeviceHandle = {};
  var mCharacteristicHandleToCCCDHandle = {};

  // Add adapter object to Bleat. Adapter functions are defined below.
  bleat._addAdapter('evothings', adapter);

  function init(readyFn) {
    if (root.evothings && evothings.ble) readyFn();
    else document.addEventListener("deviceready", readyFn);
  }

  // Begin scanning for devices
  adapter.startScan = function(
    serviceUUIDs, // String[] serviceUUIDs    advertised service UUIDs to restrict results by
    foundFn,    // Function(Object deviceInfo)  function called with each discovered deviceInfo
    completeFn,   // Function()         function called once starting scanning
    errorFn     // Function(String errorMsg)  function called if error occurs
    )
  {
    init(function() {
      evothings.ble.stopScan();
      evothings.ble.startScan(
          serviceUUIDs,
        function(deviceInfo) {
          if (foundFn) { foundFn(createBleatDeviceObject(deviceInfo)); }
        },
        function(error) {
          if (errorFn) { errorFn(error); }
        });
      if (completeFn) { completeFn(); }
    });
  };

  // Stop scanning for devices
  adapter.stopScan = function(
    errorFn     // Function(String errorMsg)  function called if error occurs
    )
  {
    init(function() {
      evothings.ble.stopScan();
    });
  };

  // Connect to a device
  adapter.connect = function(
    handle,     // String handle        device handle
    connectFn,    // Function()         function called when device connected
    disconnectFn, // Function()         function called when device disconnected
    errorFn     // Function(String errorMsg)  function called if error occurs
    )
  {
    // Check that device is not already connected.
    var deviceHandle = mDeviceIdToDeviceHandle[handle];
    if (deviceHandle) {
      if (errorFn) { errorFn('device already connected'); }
      return;
    }
    // Connect to the device.
    evothings.ble.connect(
      handle,
      // Connect success.
      function(connectInfo) {
        // Connected.
        if (2 === connectInfo.state && connectFn) {
          mDeviceIdToDeviceHandle[handle] = connectInfo.deviceHandle;
          connectFn();
        }
        // Disconnected.
        else if (0 === connectInfo.state && disconnectFn) {
          disconnectDevice(handle);
          disconnectFn();
        }
      },
      // Connect error.
      function(error) {
        if (errorFn) { errorFn(error); }
      });
  };

  // Disconnect from a device
  adapter.disconnect = function(
    handle,     // String handle        device handle
    errorFn     // Function(String errorMsg)  function called if error occurs
    )
  {
    disconnectDevice(handle);
  };

  // Discover services on a device
  adapter.discoverServices = function(
    handle,     // String handle          device handle
    serviceUUIDs, // String[] serviceUUIDs      service UUIDs to restrict results by
    completeFn,   // Function(Object[] serviceInfo) function called when discovery completed
    errorFn     // Function(String errorMsg)    function called if error occurs
    )
  {
    var deviceHandle = getDeviceHandleFromDeviceId(handle, errorFn);
    if (!deviceHandle) {
      return;
    }

    evothings.ble.services(
      deviceHandle,
      function(services) {

        // Collect found services.
        var discoveredServices = [];

        services.forEach(function(serviceInfo) {
          var serviceUUID = helpers.getCanonicalUUID(serviceInfo.uuid);

          // Filter services.
          var includeService =
            !serviceUUIDs ||
            0 === serviceUUIDs.length ||
            serviceUUIDs.indexOf(serviceUUID) >= 0;

          if (includeService) {
            // Set device for service.
            mServiceHandleToDeviceHandle[serviceInfo.handle] = deviceHandle;

            // Add the service.
            discoveredServices.push(
              {
                _handle: serviceInfo.handle,
                uuid: serviceUUID,
                primary: true
              });
          }
        });

        // Return result.
        if (completeFn) {
          completeFn(discoveredServices);
        }
      },
      function(error) {
        if (errorFn) { errorFn(error); }
      });
  };

  // Discover included services on a service
  adapter.discoverIncludedServices = function(
    handle,     // String handle          service handle
    serviceUUIDs, // String[] serviceUUIDs      service UUIDs to restrict results by
    completeFn,   // Function(Object[] serviceInfo) function called when discovery completed
    errorFn     // Function(String errorMsg)    function called if error occurs
    )
  {
    // Not implemented in the BLE plugin.
    completeFn([]);
  };

  // Discover characteristics on a service
  adapter.discoverCharacteristics = function(
    handle,         // String handle              service handle
    characteristicUUIDs,  // String[] characteristicUUIDs       characteristic UUIDs to restrict results by
    completeFn,       // Function(Object[] characteristicInfo)  function called when discovery completed
    errorFn         // Function(String errorMsg)        function called if error occurs
    )
  {
    var deviceHandle = getDeviceHandleFromServiceHandle(handle, errorFn);
    if (!deviceHandle) {
      return;
    }

    evothings.ble.characteristics(
      deviceHandle,
      handle,
      function(characteristics) {

        // Collect found characteristics.
        var discoveredCharacteristics = [];

        characteristics.forEach(function(characteristicInfo) {
          var characteristicUUID =
            helpers.getCanonicalUUID(characteristicInfo.uuid);

          // Filter characteristics.
          var includeCharacteristic =
            !characteristicUUIDs ||
            0 === characteristicUUIDs.length ||
            characteristicUUIDs.indexOf(characteristicUUID) >= 0;

          if (includeCharacteristic) {
            // Set device for characteristic.
            mCharacteristicHandleToDeviceHandle[
              characteristicInfo.handle] = deviceHandle;

            // Add the characteristic.
            // For the characteristic property constants, see:
            //   https://github.com/evothings/cordova-ble/blob/master/ble.js#L256
            // Goes without saying they should have symbolic names!!
            // Created issue: https://github.com/evothings/cordova-ble/issues/90
            discoveredCharacteristics.push(
              {
                _handle: characteristicInfo.handle,
                uuid: characteristicUUID,
                properties: {
                  broadcast:
                    characteristicInfo.property & 1,
                  read:
                    characteristicInfo.property & 2,
                  writeWithoutResponse:
                    (characteristicInfo.property & 4) && // AND or OR?
                    (characteristicInfo.writeType & 1),
                  write:
                    characteristicInfo.property & 8,
                  notify:
                    characteristicInfo.property & 16,
                  indicate:
                    characteristicInfo.property & 32,
                  authenticatedSignedWrites:
                    (characteristicInfo.property & 64) && // AND or OR?
                    (characteristicInfo.writeType & 4),
                  reliableWrite:
                    false,
                  writableAuxiliaries:
                    false
                }
              });
          }
        });

        // Return result.
        if (completeFn) {
          completeFn(discoveredCharacteristics);
        }
      },
      function(error) {
        if (errorFn) { errorFn(error); }
      });
  };

  // Discover descriptors on a characteristic
  adapter.discoverDescriptors = function(
    handle,       // String handle            characteristic handle
    descriptorUUIDs,  // String[] descriptorUUIDs       descriptor UUIDs to restrict results by
    completeFn,     // Function(Object[] descriptorInfo)  function called when discovery completed
    errorFn       // Function(String errorMsg)      function called if error occurs
    )
  {
    var deviceHandle = getDeviceHandleFromCharacteristicHandle(handle, errorFn);
    if (!deviceHandle) {
      return;
    }

    evothings.ble.descriptors(
      deviceHandle,
      handle,
      function(descriptors) {

        // Collect found descriptors.
        var discoveredDescriptors = [];

        descriptors.forEach(function(descriptorInfo) {
          var descriptorUUID = helpers.getCanonicalUUID(descriptorInfo.uuid);

          // If this is the CCCD we save it for use in enableNotify.
          if (descriptorUUID === '00002902-0000-1000-8000-00805f9b34fb') {
            mCharacteristicHandleToCCCDHandle[handle] = descriptorInfo.handle;
          }

          // Filter descriptors.
          var includeDescriptor =
            !descriptorUUIDs ||
            0 === descriptorUUIDs.length ||
            descriptorUUIDs.indexOf(descriptorUUID) >= 0;

          if (includeDescriptor) {
            // Set device for descriptor.
            mDescriptorHandleToDeviceHandle[descriptorInfo.handle] = deviceHandle;

            // Add the descriptor.
            discoveredDescriptors.push(
              {
                _handle: descriptorInfo.handle,
                uuid: descriptorUUID
              });
          }
        });

        // Return result.
        if (completeFn) {
          completeFn(discoveredDescriptors);
        }
      },
      function(error) {
        if (errorFn) { errorFn(error); }
      });
  };

  // Read a characteristic value
  adapter.readCharacteristic = function(
    handle,     // String handle        characteristic handle
    completeFn,   // Function(DataView value)   function called when read completes
    errorFn     // Function(String errorMsg)  function called if error occurs
    )
  {
    var deviceHandle = getDeviceHandleFromCharacteristicHandle(handle, errorFn);
    if (!deviceHandle) {
      return;
    }

    // TODO: Re-enable notification on iOS if there was one, see issue:
    // https://github.com/evothings/cordova-ble/issues/61
    // Currently we do not work around this limitation.

    evothings.ble.readCharacteristic(
      deviceHandle,
      handle,
      function(data) {
        if (completeFn) {
          completeFn(bufferToDataView(data));
        }
      },
      function(error) {
        if (errorFn) { errorFn(error); }
      });
  };

  // Write a characteristic value
  adapter.writeCharacteristic = function(
    handle,     // String handle        characteristic handle
    value,      // DataView value       value to write
    completeFn,   // Function()         function called when write completes
    errorFn     // Function(String errorMsg)  function called if error occurs
    )
  {
    var deviceHandle = getDeviceHandleFromCharacteristicHandle(handle, errorFn);
    if (!deviceHandle) {
      return;
    }

    evothings.ble.writeCharacteristic(
      deviceHandle,
      handle,
      value,
      function() {
        if (completeFn) {
          completeFn();
        }
      },
      function(error) {
        if (errorFn) { errorFn(error); }
      });
  };

  // Enable value change notifications on a characteristic
  adapter.enableNotify = function(
    handle,     // String handle        characteristic handle
    notifyFn,   // Function(DataView value)   function called when value changes
    completeFn,   // Function()         function called when notifications enabled
    errorFn     // Function(String errorMsg)  function called if error occurs
    )
  {
    var deviceHandle = getDeviceHandleFromCharacteristicHandle(handle, errorFn);
    if (!deviceHandle) {
      return;
    }

    // TODO: Android needs the CCCD written to for notifications
    // Should be encapsulated in native android layer, see issue:
    // https://github.com/evothings/cordova-ble/issues/30

    // Write the CCCD regardless of platform, makes no harm on iOS.
    writeCCCD(
      deviceHandle,
      handle,
      enableNotification,
      function(error) {
        if (errorFn) { errorFn(error); }
      });

    function enableNotification()
    {
      evothings.ble.enableNotification(
        deviceHandle,
        handle,
        function(data) {
          if (notifyFn) {
            notifyFn(bufferToDataView(data));
          }
        },
        function(error) {
          if (errorFn) { errorFn(error); }
        });

      // Notifications "should have" been enabled.
      if (completeFn) {
        completeFn();
      }
    }
  };

  // Disable value change notifications on a characteristic
  adapter.disableNotify = function(
    handle,     // String handle        characteristic handle
    completeFn,   // Function()         function called when notifications disabled
    errorFn     // Function(String errorMsg)  function called if error occurs
    )
  {
    var deviceHandle = getDeviceHandleFromCharacteristicHandle(handle, errorFn);
    if (!deviceHandle) {
      return;
    }

    evothings.ble.disableNotification(
      deviceHandle,
      handle,
      function() {
        if (completeFn) {
          completeFn();
        }
      },
      function(error) {
        if (errorFn) { errorFn(error); }
      });

    // TODO: iOS doesn't call back after disable, see issue:
    // https://github.com/evothings/cordova-ble/issues/65
    // Hack to compensate.
    if (platformIsIOS()) {
      setTimeout(completeFn, 0); // Timeout perhaps not needed.
    }
  };

  // Read a descriptor value
  adapter.readDescriptor = function(
    handle,     // String handle        descriptor handle
    completeFn,   // Function(DataView value)   function called when read completes
    errorFn     // Function(String errorMsg)  function called if error occurs
    )
  {
    var deviceHandle = getDeviceHandleFromDescriptorHandle(handle, errorFn);
    if (!deviceHandle) {
      return;
    }

    evothings.ble.readDescriptor(
      deviceHandle,
      handle,
      function(data) {
        if (completeFn) {
          completeFn(bufferToDataView(data));
        }
      },
      function(error) {
        if (errorFn) { errorFn(error); }
      });
  };

  // Write a descriptor value
  adapter.writeDescriptor = function(
    handle,     // String handle        descriptor handle
    value,      // DataView value       value to write
    completeFn,   // Function()         function called when write completes
    errorFn     // Function(String errorMsg)  function called if error occurs
    )
  {
    var deviceHandle = getDeviceHandleFromDescriptorHandle(handle, errorFn);
    if (!deviceHandle) {
      return;
    }

    evothings.ble.writeDescriptor(
      deviceHandle,
      handle,
      value,
      function() {
        if (completeFn) {
          completeFn();
        }
      },
      function(error) {
        if (errorFn) { errorFn(error); }
      });
  };

  function disconnectDevice(handle)
  {
    var deviceHandle = mDeviceIdToDeviceHandle[handle];
    if (deviceHandle) {
      // Disconnect the device.
      evothings.ble.close(deviceHandle);
      // Delete device handle mapping.
      delete mDeviceIdToDeviceHandle[handle];
      // Delete related mappings for service handles etc.
      deleteDeviceHandleMappings(deviceHandle, mServiceHandleToDeviceHandle);
      deleteDeviceHandleMappings(deviceHandle, mCharacteristicHandleToDeviceHandle, true);
      deleteDeviceHandleMappings(deviceHandle, mDescriptorHandleToDeviceHandle);
    }
  }

  function deleteDeviceHandleMappings(deviceHandle, map, isCharateristicsMap)
  {
    for (var key in map) {
      if (deviceHandle === map[key]) {

        // Delete the mapping.
        delete map[key];

        // If mapping for this key exists (yes it is a hack to do this here).
        if (isCharateristicsMap && mCharacteristicHandleToCCCDHandle[key]) {
          delete mCharacteristicHandleToCCCDHandle[key];
        }
      }
    }
  }

  function getDeviceHandleFromDeviceId(handle, errorFn)
  {
    var deviceHandle = mDeviceIdToDeviceHandle[handle];
    if (!deviceHandle) {
      if (errorFn) { errorFn('Device does not exist for device id: ' + handle); }
      return null;
    }
    return deviceHandle;
  }

  function getDeviceHandleFromServiceHandle(handle, errorFn)
  {
    var deviceHandle = mServiceHandleToDeviceHandle[handle];
    if (!deviceHandle) {
      if (errorFn) { errorFn('Device does not exist for service handle: ' + handle); }
      return null;
    }
    return deviceHandle;
  }

  function getDeviceHandleFromCharacteristicHandle(handle, errorFn)
  {
    var deviceHandle = mCharacteristicHandleToDeviceHandle[handle];
    if (!deviceHandle) {
      if (errorFn) { errorFn('Device does not exist for characteristic handle: ' + handle); }
      return null;
    }
    return deviceHandle;
  }

  function writeCCCD(deviceHandle, characteristicHandle, successCallback, errorCallback)
  {
    // Do we have a saved descriptor handle from descriptor discovery?
    var cccdHandle = mCharacteristicHandleToCCCDHandle[characteristicHandle];
    if (cccdHandle) {
      writeTheCCCD(cccdHandle);
    }
    else {
      discoverTheCCCD();
    }

    function writeTheCCCD(cccdHandle)
    {
      evothings.ble.writeDescriptor(
        deviceHandle,
        cccdHandle,
        new Uint8Array([1,0]),
        function() {
          successCallback();
        },
        function(error) {
          errorCallback(error);
        });
    }

    function discoverTheCCCD()
    {
      adapter.discoverDescriptors(
        characteristicHandle,
        '00002902-0000-1000-8000-00805f9b34fb', // CCCD UUID
        function(descriptors) {
          var cccdHandle = mCharacteristicHandleToCCCDHandle[characteristicHandle];
          if (cccdHandle) {
            writeTheCCCD(cccdHandle);
          }
          else {
            errorCallback('Could not find CCCD for characteristic: ' + characteristicHandle);
          }
        },
        function(error) {
          errorCallback(error);
          return;
        });
    }
  }

  /**
   * Create a Bleat deviceInfo object based on the device info from the BLE plugin.
   * @param deviceInfo BLE plugin deviceInfo object (source).
   * @return Bleat deviceInfo object.
   */
  function createBleatDeviceObject(deviceInfo)
  {
    // Bleat device object.
    var device = {};

    // Device handle and id.
    device._handle = deviceInfo.address;
    device.id = deviceInfo.address;

    // Use the advertised name as default. Use name in
    // advertisement data if available (see below).
    device.name = deviceInfo.name;

    // Array or service UUIDs (populated below).
    device.uuids = [];

    // Object that holds advertisement data.
    device.adData = {};

    // RSSI value.
    device.adData.rssi = deviceInfo.rssi;

    // txPower not available.
    device.adData.txPower = null;

    // Service data (set below).
    device.adData.serviceData = {};

    // Manufacturer data (set below).
    device.adData.manufacturerData = null;

    if (deviceInfo.advertisementData) {
      parseiOSAdvertisementData(deviceInfo, device);
    }
    else if (deviceInfo.scanRecord) {
      parseScanRecordAdvertisementData(deviceInfo, device);
    }

    return device;
  }

  /**
   * @param deviceInfo BLE plugin deviceInfo object (source).
   * @param device Bleat deviceInfo object (destination).
   */
  function parseiOSAdvertisementData(deviceInfo, device)
  {
    // On iOS advertisement data is available in predefined fields.
    if (deviceInfo.advertisementData) {

      // Device name.
      if (deviceInfo.advertisementData.kCBAdvDataLocalName) {
        device.name = deviceInfo.advertisementData.kCBAdvDataLocalName;
      }

      // txPower.
      if (deviceInfo.advertisementData.kCBAdvDataTxPowerLevel) {
        device.adData.txPower = deviceInfo.advertisementData.kCBAdvDataTxPowerLevel;
      }

      // Service UUIDs.
      if (deviceInfo.advertisementData.kCBAdvDataServiceUUIDs) {
        deviceInfo.advertisementData.kCBAdvDataServiceUUIDs.forEach(function(serviceUUID) {
          device.uuids.push(helpers.getCanonicalUUID(serviceUUID));
        });
      }

      // Service data.
      if (deviceInfo.advertisementData.kCBAdvDataServiceData) {
        for (var uuid in deviceInfo.advertisementData.kCBAdvDataServiceData) {
          var data = deviceInfo.advertisementData.kCBAdvDataServiceData[uuid];
          device.adData.serviceData[helpers.getCanonicalUUID(uuid)] = bufferToDataView(base64DecToArr(data));
        }
      }

      // Manufacturer data.
      // TODO: Create map with company identifier (see Noble adapter).
      if (deviceInfo.advertisementData.kCBAdvDataManufacturerData) {
        // Save raw data as well.
        device.adData.manufacturerDataRaw = deviceInfo.advertisementData.kCBAdvDataManufacturerData;
      }
    }
  }

  /**
   * Decode the scan record. Data is encoded using a length byte followed by data.
   * @param deviceInfo BLE plugin deviceInfo object (source).
   * @param device Bleat deviceInfo object (destination).
   */
  function parseScanRecordAdvertisementData(deviceInfo, device)
  {
    var byteArray = base64DecToArr(deviceInfo.scanRecord);
    var pos = 0;
    while (pos < byteArray.length) {

      var length = byteArray[pos++];
      if (length === 0) break;
      length -= 1;
      var type = byteArray[pos++];
      var i;

      // Local Name.
      if (type === 0x08 || type === 0x09) {
        // Convert UTF8 encoded buffer and strip null characters from the resulting string.
        device.name = evothings.ble.fromUtf8(
          new Uint8Array(byteArray.buffer, pos, length)).replace('\0', '');
      }
      // TX Power Level.
      else if (type === 0x0a) {
        device.adData.txPower = littleEndianToInt8(byteArray, pos);
      }
      // 16-bit Service Class UUID.
      else if (type === 0x02 || type === 0x03) {
        for (i = 0; i < length; i += 2) {
          device.uuids.push(
            helpers.getCanonicalUUID(
              littleEndianToUint16(byteArray, pos + i).toString(16)));
        }
      }
      // 32-bit Service Class UUID.
      else if (type === 0x04 || type === 0x05) {
        for (i = 0; i < length; i += 4) {
          device.uuids.push(
            helpers.getCanonicalUUID(
              littleEndianToUint32(byteArray, pos + i).toString(16)));
        }
      }
      // 128-bit Service Class UUID.
      else if (type === 0x06 || type === 0x07) {
        for (i = 0; i < length; i += 16) {
          device.uuids.push(
            helpers.getCanonicalUUID(arrayToUUID(byteArray, pos + i)));
        }
      }

      pos += length;
    }
  }
/*
  Not used.
  function stringToArrayBuffer(string) {
    var buffer = new ArrayBuffer(string.length);
    var bufferView = new Uint8Array(buffer);
    for (var i = 0; i < string.length; ++i)
    {
      bufferView[i] = string.charCodeAt(i);
    }
    return buffer;
  }
  function arrayBufferToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }
*/
  // Code from https://github.com/evothings/evothings-libraries/blob/master/libs/evothings/easyble/easyble.js
  // Should be encapsulated in the native Android implementation, see issue:
  // https://github.com/evothings/cordova-ble/issues/62

  function b64ToUint6(nChr)
  {
    return nChr > 64 && nChr < 91 ? nChr - 65
      : nChr > 96 && nChr < 123 ? nChr - 71
      : nChr > 47 && nChr < 58 ? nChr + 4
      : nChr === 43 ? 62
      : nChr === 47 ? 63
      : 0;
  }

  function base64DecToArr(sBase64, nBlocksSize)
  {
    var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, "");
    var nInLen = sB64Enc.length;
    var nOutLen = nBlocksSize ?
      Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize :
      nInLen * 3 + 1 >> 2;
    var taBytes = new Uint8Array(nOutLen);

    for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
      nMod4 = nInIdx & 3;
      nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
      if (nMod4 === 3 || nInLen - nInIdx === 1) {
        for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
          taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
        }
        nUint24 = 0;
      }
    }
    return taBytes;
  }

  /**
   * Interpret byte buffer as little endian 8 bit integer.
   * Returns converted number.
   * @param {ArrayBuffer} data - Input buffer.
   * @param {number} offset - Start of data.
   * @return Converted number.
   */
  function littleEndianToInt8(data, offset)
  {
    var x = data[offset];
    if (x & 0x80) x = x - 256;
    return x;
  }

  function littleEndianToUint16(data, offset)
  {
    return (data[offset + 1] << 8) + data[offset];
  }

  function littleEndianToUint32(data, offset)
  {
    return (data[offset + 3] << 24) + (data[offset + 2] << 16) + (data[offset + 1] << 8) + data[offset];
  }

  function arrayToUUID(array, offset)
  {
    var uuid = "";
    for (var i = 0; i < 16; i++) {
      uuid += ("00" + array[offset + i].toString(16)).slice(-2);
    }
    return uuid;
  }

  function bufferToDataView(buffer)
  {
    // Buffer to ArrayBuffer
    var arrayBuffer = new Uint8Array(buffer).buffer;
    return new DataView(arrayBuffer);
  }

  /*
  Not used.
  function dataViewToBuffer(dataView)
  {
    // DataView to TypedArray
    var typedArray = new Uint8Array(dataView.buffer);
    return new Buffer(typedArray);
  }*/

  function getPlatform()
  {
    if (root.cordova) {
      return root.cordova.platformId;
    }
    else {
      return null;
    }
  }

  function platformIsIOS()
  {
    return 'ios' === getPlatform();
  }

  function platformIsAndroid()
  {
    return 'android' === getPlatform();
  }
});

module.exports = bleat;
module.exports.getDeviceId = function() { return gateway.getDeviceId(); }
module.exports.getDeviceUri = function() { return gateway.getDeviceUri(); }
module.exports.getDeviceName = function() { return gateway.getDeviceName(); }

