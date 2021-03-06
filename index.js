/**
 * Node.js driver for Adafruit I2C RGB sensor TCS34725
 */
 
var i2c = require('i2c');
var async = require('async');
var util = require('util');

var _address, _bus, _wire, _sensor_ver;

exports.init = function( address, bus, callback ) {
    _address = address || 0x29;
    _bus = bus || '/dev/i2c-1';
    
    _wire = new i2c(_address, {device: _bus });
    
    async.waterfall([
       
        /* check device version */
        function(cb) {
            _wire.writeByte(0x80|0x12, function(err) { cb && cb(err) });
        },
        function(cb) {
            _wire.readByte(function(err, res) { 
                if (err) {
                    cb && cb(err);
                } else {
                    if (res != 0x44) {
                        cb && cb('TCS34725 reported a wrong version number: expected 0x44, got 0x' + res.toString(16) );
                    } else {
                        _sensor_ver = res;
                    }
                }
            });
        },
        
        /* 0x00 = ENABLE register */
        function(cb) { 
            _wire.writeByte(0x80|0x00, function(err) { cb && cb(err) });
        },
        
        /* 0x01 = Power on, 0x02 RGB sensors enabled */
        function(cb) {
            _wire.writeByte(0x01|0x02, function(err) { cb && cb(err) });
        }
        
    ], 
    function(err) { 
        if (err) callback && callback(err); 
    });
    
    return true;
}

exports.readRaw = function (callback) {
    _wire.readBytes(0x80|0x14, 8, function(err, data) {
        callback && callback(err, data);
    });
}

exports.readCRGB = function (callback) {
    exports.readRaw( function(err, data) {
        if (err) {
            callback && callback(err, null);
        } else {
            var clear = clear = data[1] << 8 | data[0];
            var red = data[3] << 8 | data[2];
            var green = data[5] << 8 | data[4];
            var blue = data[7] << 8 | data[6];

            var arr = [clear, red, green, blue];
            callback && callback(err, arr);
        }
    });
}

exports.read2string = function (callback) {
    exports.readCRGB( function(err, crgb) {
        if (err) {
            callback && callback(err, null);
        } else {
            var crgbstr = util.format("C: %d, R: %d, G: %d, B: %d", 
                                    crgb[0], crgb[1], crgb[2], crgb[3]);
            callback && callback( err, crgbstr );
        }       
    });
}


exports.read2json = function (callback) {
    exports.readCRGB( function(err, crgb) {
        if (err) {
            callback && callback(err, null);
            return null;
        } else {
            var crgbstr = {
                "clear" : crgb[0],
                "red"   : crgb[1],
                "green" : crgb[2],
                "blue"  : crgb[3]
            };
            callback && callback( err, crgbstr );
            return crgbstr;
        }       
    });
}
