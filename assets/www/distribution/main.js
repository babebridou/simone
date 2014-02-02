

var temp_indice = function (opt) {

	opt = opt || {};
	_.defaults(opt, {
		mean: 19,
		deviation: 20
	});

	this.mean = opt.mean;
	this.deviation = opt.deviation;

};


temp_indice.prototype.getValue = function(x) {
	var diff = Math.abs(x - this.mean); // valeur absolue
	var val = 100;
	for (var i = 0 ; i < diff ; i++) { // pour chaque écart -deviation% a la valeur actuelle
		val = val - (this.deviation / 100) * val;
	}

	return val;
};


var t = new temp_indice({
	mean: 19,
	deviation: 20
});

console.log(t.getValue(17));