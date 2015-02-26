var should = require('chai').should(),
    tcs = require('../index');
    
describe('#init', function() {
   it('initializes the sensor and check it version', function() {
       tcs.init().should.equal(true);
   });
});

describe('#readRaw', function() {
   it('performs a measurement and returns RAW result', function() {
      tcs.readRaw(function(err, data) {
          should.not.exist(err);
          should.exist(data);
      });
   });
});

describe('#readCRGB', function() {
   it('performs a measurement and returns CRGB array', function() {
      tcs.readCRGB(function(err, data) {
        should.not.exist(err);
        data.should.have.length(4);
      });
   });
});


describe('#read2string', function() {
   it('performs a measurement and returns a string', function() {
      tcs.read2string(function(err, str) {
        should.not.exist(err);
        str.should.be.a('string');
        console.log(str);
        should.equal( /^C: \d+, R: \d+, G: \d+, B: \d+/.test(str), true );
      });
   });
});


describe('#read2json', function() {
   it('performs a measurement and returns json', function() {
      tcs.read2json(function(err, json) {
        should.not.exist(err);
        json.should.be.an('object');
        json.should.have.property('clear');
        json.should.have.property('red');
        json.should.have.property('green');
        json.should.have.property('blue');
      });
   });
});
