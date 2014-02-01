/**
 * Simone Core 0.1
 *
 * define the facade that collect consumers data
 * and the state object that will be delivered through events
 */
var simone = (function() {

    var simoneCore;


    /////////////////////////////////////////////
    // State

    function State(data) {
        this.initialize(data);
    };

    State.prototype.initialize = function(data) {
        this.temperature = data.temperature;
        this.luminosity = data.luminosity;
        this.airQuality = data.airQuality;
    };


    /////////////////////////////////////////////
    // Facade

    function Facade() {
        this.initialize();
    };

    Facade.prototype.initialize = function() {

    };

    Facade.prototype.emitState = function(state) {
        bean.fire(this, 'newState', [state]);
    };


    /////////////////////////////////////////////
    // Simone Core

    function SimoneCore() {
        this.initialize();
    };

    SimoneCore.prototype.initialize = function() {
        this.facade = new Facade();
        bean.on(this.facade, 'newState', this.handleNewState.bind(this));
    };

    SimoneCore.prototype.handleNewState = function(state) {
        bean.fire(this, 'state', [state]);
    };


    // expose properties
    simoneCore = new SimoneCore();

    return simoneCore;
})();


/**
 * Simone API Consumer
 *
 * base class to extend to make an api compatible
 */
(function(simoneCore) {

    /////////////////////////////////////////////
    // APIConsumer

    function APIConsumer() {
        this.initialize();
    };

    APIConsumer.prototype.initialize = function() {

    };

    APIConsumer.prototype.formatData = function(rawData) {
        console.error("You need to implement this method in the subclass");
    };


    // expose the class
    simoneCore.APIConsumer = APIConsumer;

})(simone);


// expose global vars
window.simone = simone;
