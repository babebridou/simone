/**
 * Some useful utils
 */

(function() {

    ////////////////////////////////////////////
    // Proba

    var Proba = {
        norm: function(x, mean, deviation) {
            var factor = 1.0 / (deviation*Math.sqrt(2*Math.PI)),
                expon = Math.exp(-0.5*Math.pow((x-mean)/deviation, 2));
            return factor*expon;
        }
    };



    /////////////////////////////////////////////
    // Penality

    var Penality = {
        idealTemperature: 19.0,

        forTemperature: function(temperature) {
            var deviation = 1.6,
                mean = this.idealTemperature;

            return 1 - Math.abs(Proba.norm(19, mean , deviation) - Proba.norm(temperature, mean, deviation));
        }
    };

    
    // expose the class
    window.Proba = Proba;
    window.Penality = Penality;

})();


// test
// console.log(Penality.forTemperature(15));
// console.log(Penality.forTemperature(19));
// console.log(Penality.forTemperature(20));
// console.log(Penality.forTemperature(21));
// console.log(Penality.forTemperature(25));
