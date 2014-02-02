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
        data = data || {};
        this.temperature = data.temperature || 0;
        this.luminosity = data.luminosity || 0;
        this.airQuality = data.airQuality || 0;
    };

    State.prototype.update = function(state) {
        this.temperature = state.temperature || this.temperature;
        this.luminosity = state.luminosity || this.luminosity;
        this.airQuality = state.airQuality || this.airQuality;
    };


    /////////////////////////////////////////////
    // Facade

    function Facade() {
        this.initialize();
    };

    Facade.prototype.initialize = function() {
        this.refreshFrequency = 60;  // herz unit
        this.lastRefresh = 0;
        this.currentState = new State();
        this.consumers = [];
    };

    Facade.prototype.emitState = function(state) {
        bean.fire(this, 'newState', [state]);
    };

    /**
     * Add an API consumer instance
     */
    Facade.prototype.addConsumer = function(consumer) {
        bean.on(consumer, 'data', this.handleNewData.bind(this));
        this.consumers.push(consumer);
    };

    Facade.prototype.handleNewData = function(state) {
        this.currentState.update(state);

        // check for the refresh frequency to avoid too much refresh
        // NB: the timestamps are in milliseconds
        var t = new Date().getTime();
        if (t - this.lastRefresh < 1000.0/this.refreshFrequency) {
            return;
        }

        this.lastRefresh = t;
        this.emitState(this.currentState);
    };

    Facade.prototype.updateConsumersWithRate = function(rate) {
        for (var idx=0; idx<this.consumers.length; idx++) {
            this.consumers[idx].changeRate(rate);
        }
    };


    /////////////////////////////////////////////
    // Simone Core

    function SimoneCore(options) {
        options = options || {};
        this.initialize(options);
    };

    SimoneCore.prototype.configure = function(options) {
        this.eventStateLimit = options.limit || -1;
        this.eventStateCount = 0;
    };

    SimoneCore.prototype.initialize = function(options) {
        this.facade = new Facade();
        bean.on(this.facade, 'newState', this.handleNewState.bind(this));

        this.configure(options);
    };

    SimoneCore.prototype.handleNewState = function(state) {
        if (this.eventStateLimit != -1 && this.eventStateCount >= this.eventStateLimit) {
            return;
        }

        this.eventStateCount++;
        bean.fire(this, 'state', [state]);
    };

    SimoneCore.prototype.changeRate = function(delay) {
        console.log("delay", delay);
        this.facade.updateConsumersWithRate(delay);
    };


    // expose classes
    simoneCore = new SimoneCore();
    simoneCore.State = State;

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

    APIConsumer.prototype.emitData = function(data) {
        // console.log(data)
        bean.fire(this, 'data', [data]);
    };

    APIConsumer.prototype.changeRate = function(rate) {
        this.rate = rate;
        this.consume();
    };


    // expose the class
    simoneCore.APIConsumer = APIConsumer;

})(simone);


// expose global vars
window.simone = simone;
