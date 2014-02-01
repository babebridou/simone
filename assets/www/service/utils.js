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

            return Math.abs(Proba.norm(19, mean , deviation) - Proba.norm(temperature, mean, deviation));
        },

        forLuminosity: function(luminosity) {
            if (luminosity < 50 || (luminosity > 120 && luminosity < 200)) {
                return 0;
            }

            var maxPenality = 0.3;

            if (luminosity >= 50 && luminosity <= 120) {
                var delta = luminosity - 50;
                return (maxPenality*(1 - delta/(120-50)));
            }

            if (luminosity >= 200 && luminosity <= 240) {
                var delta = luminosity - 200;
                return (maxPenality*(delta/(240-200)));
            }

            return maxPenality;
        },

        forAirQuality: function(airQuality) {
            var maxPenality = 1.0,
                factor = 1/1500;

            // airQuality is linked to the CO2 concentration
            if (airQuality < 1000) {
                return 0;
            }

            return 1 - Math.exp(-factor*(airQuality - 1000))
        },

        forState: function(state) {
            var temperaturePenality = this.forTemperature(state.temperature),
                luminosityPenality = this.forLuminosity(state.luminosity),
                airQualityPenality = this.forAirQuality(state.airQuality);

            var temperatureWeight = 1.0,
                luminosityWeight = 0.6,
                airQualityWeight = 0.5;

            var base = 1.0;

            base *= (1 - temperatureWeight * temperaturePenality);
            base *= (1 - luminosityWeight * luminosityPenality);
            base *= (1 - airQualityWeight * airQualityPenality);

            return (base);
        }
    };


    // expose the class
    window.Proba = Proba;
    window.Penality = Penality;

})();


// test temperature
// console.log(Penality.forTemperature(15));
// console.log(Penality.forTemperature(19));
// console.log(Penality.forTemperature(20));
// console.log(Penality.forTemperature(21));
// console.log(Penality.forTemperature(25));

// test luminosity
// console.log(Penality.forLuminosity(10));
// console.log(Penality.forLuminosity(50));
// console.log(Penality.forLuminosity(60));
// console.log(Penality.forLuminosity(130));
// console.log(Penality.forLuminosity(220));

// test exponential
// console.log(Penality.forAirQuality(800));
// console.log(Penality.forAirQuality(1000));
// console.log(Penality.forAirQuality(1200));
// console.log(Penality.forAirQuality(2000));
// console.log(Penality.forAirQuality(2500));

// test state
// console.log(Penality.forState(new simone.State({temperature:18, luminosity:100, airQuality:1200})));
// console.log(Penality.forState(new simone.State({temperature:19, luminosity:150, airQuality:900})));
// console.log(Penality.forState(new simone.State({temperature:16, luminosity:100, airQuality:1800})));
