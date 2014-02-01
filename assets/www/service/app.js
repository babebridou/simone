/**
 * Application main file
 */


////
// EnergyPassAPIConsumer subclass

var EnergyPassAPIConsumer = function() {
    simone.APIConsumer.call(this);
};
EnergyPassAPIConsumer.prototype = new simone.APIConsumer();

EnergyPassAPIConsumer.prototype.formatData = function(rawData) {
    var results = rawData['result'][0]['chs'][0]['vals'],
        states = [];

    var row = null;
    for (var idx=0; idx < results.length; idx++) {
        row = results[idx];
        states.push(new simone.State({
            temperature: row.val,
            timestamp: row.date
        }));
    }

    return states;
};

EnergyPassAPIConsumer.prototype.consume = function() {
    var that = this;
    this.load(function(data){
        var states = that.formatData(data);

        var stateIndex = 0,
            timer = setInterval(function(){
                if (stateIndex >= states.length) {
                    clearInterval(timer);
                    return;
                }

                that.emitData(states[stateIndex++]);
            }, 2000);
    });
};

EnergyPassAPIConsumer.prototype.load = function(callback) {
    // DEBUG
    var mockResponse = {"jsonrpc":"2.0","id":"energyhack007","result":[{"prog":"CERGY01","build":"BatimentB","lot":"B123","chs":[{"type":"TEMPER","ctx":"GLOBAL","ind":0,"vals":[{"date":1391180400000,"val":21.935000000000002},{"date":1391184000000,"val":21.905},{"date":1391187600000,"val":21.985},{"date":1391191200000,"val":22.119999999999997},{"date":1391194800000,"val":22.13},{"date":1391198400000,"val":22.025},{"date":1391202000000,"val":21.925},{"date":1391205600000,"val":21.814999999999998},{"date":1391209200000,"val":21.815},{"date":1391212800000,"val":21.81},{"date":1391216400000,"val":21.815},{"date":1391220000000,"val":21.785},{"date":1391223600000,"val":21.85},{"date":1391227200000,"val":22.11},{"date":1391230800000,"val":22.119999999999997},{"date":1391234400000,"val":22.089999999999996},{"date":1391238000000,"val":22.13},{"date":1391241600000,"val":22.209999999999997},{"date":1391245200000,"val":22.22},{"date":1391248800000,"val":22.1},{"date":1391252400000,"val":22.049999999999997},{"date":1391256000000,"val":22.3},{"date":1391259600000,"val":22.185000000000002},{"date":1391263200000,"val":21.899999999999995}]}]}]};
    callback(mockResponse);
    return;
    // END DEBUG

    var that = this,
        params = {
            "jsonrpc": "2.0",
            "method": "energy",
            "params": [{
                  "prog": "CERGY01",
                  "build": "BatimentB",
                  "lots": ["B123"],
                  "ctx": "GLOBAL",
                  "types": ["TEMPER"],
                  "ind": 0,
                  "gran": "HOUR", //"LAST","DAY","MONTH","HOUR"
                  "begin": new Date().getTime()-24*60*60*1000,
                  "end": new Date().getTime(),
            }],
            "id": "energyhack007"
        },
        data = JSON.stringify(params);

    request = new XMLHttpRequest;
    request.open('POST', 'https://energypass.fr/CamelProxy/energy.ashx', true);
    request.setRequestHeader("Content-type", "application/json-rpc");
    request.setRequestHeader("Accept", "application/json-rpc");

    request.onload = function() {
        resp = this.response;
        var data = JSON.parse(resp);
      callback(data);
    }

    request.onerror = function() {
        console.log("!!! ERROR");
    }

    request.send(data);
};


////
// LUXConsumer subclass

var LUXConsumer = function() {
    simone.APIConsumer.call(this);
};
LUXConsumer.prototype = new simone.APIConsumer();

LUXConsumer.prototype.consume = function() {
    var that = this,
        length = 24,
        stateIndex = 0,
        minValue = 0,
        maxValue = 240,
        deviation = 3,
        scale = Proba.norm(length/2, length/2, deviation);

    var timer = setInterval(function(){
        if (stateIndex >= length) {
            clearInterval(timer);
            return;
        }

        var x = Proba.norm(stateIndex, length/2, deviation),
            luxValue = x/scale*(maxValue-minValue) + minValue;

        that.emitData(new simone.State({luminosity: luxValue}));
        stateIndex++;
    }, 2000);
};


////
// CO2Consumer subclass

var CO2Consumer = function() {
    simone.APIConsumer.call(this);
};
CO2Consumer.prototype = new simone.APIConsumer();

CO2Consumer.prototype.consume = function() {
    var that = this,
        stateIndex = 0,
        values = [2534,2575,2552,2519,2502,2513,2517,2532,2530,2504,2416,2010,1800,1677,1622,1629,1898,1993,2011,1446,846,655,573,508,496,480,461,489,503,491,468,461,459,449,455,478,711,870,981,807,764,754,831,1240,1552,1789,2018,2129];

    var timer = setInterval(function(){
        if (stateIndex >= values.length) {
            clearInterval(timer);
            return;
        }

        var co2Value = values[stateIndex];

        that.emitData(new simone.State({airQuality: co2Value}));
        stateIndex++;
    }, 2000);
};


////
// Bind events

bean.on(simone, 'state', function(s) {
    // do what you want :)
    console.log(s);
});


////
// Run the consumers

// simone.configure({limit:3});

var energyPassConsumer = new EnergyPassAPIConsumer();
simone.facade.addConsumer(energyPassConsumer);
energyPassConsumer.consume();

var luxConsumer = new LUXConsumer();
simone.facade.addConsumer(luxConsumer);
luxConsumer.consume();

var co2Consumer = new CO2Consumer();
simone.facade.addConsumer(co2Consumer);
co2Consumer.consume();
