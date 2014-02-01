/**
 * Some useful utils
 */

(function() {

    /////////////////////////////////////////////
    // Penality

    var Penality = {
        idealTemperature: 19.0,

        forTemperature: function(temperature) {
            var deviation = 1.6,
                mean = this.idealTemperature,
                norm = function(val) {
                    var factor = 1.0 / (deviation*Math.sqrt(2*Math.PI)),
                        expon = Math.exp(-0.5*Math.pow((val-mean)/deviation, 2));
                    return factor*expon;
                };

            return 1 - Math.abs(norm(19) - norm(temperature));
        }
    };

    // expose the class
    window.Penality = Penality;

})();


// test
// console.log(Penality.forTemperature(15));
// console.log(Penality.forTemperature(19));
// console.log(Penality.forTemperature(20));
// console.log(Penality.forTemperature(21));
// console.log(Penality.forTemperature(25));
