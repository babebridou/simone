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
// Bind events
//
//var sampleReport = new SampleReport("report");
//
//bean.on(simone, 'state', function(s) {
//    // do what you want :)
//    console.log(s);
//    sampleReport.setData(s);
//});


////
// Run the consumers

var energyPassConsumer = new EnergyPassAPIConsumer();
simone.facade.addConsumer(energyPassConsumer);
energyPassConsumer.consume();
