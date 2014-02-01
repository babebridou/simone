function SampleReport(viewId){
	this.viewId = viewId;
	var core = d3.select("#"+viewId);
	var piesvg = core
		.append("svg")
		.append("g")
			   .attr("class", "centeredg");
		piesvg.append("g").attr("class", "arc");
		piesvg.append("g").attr("class", "arctext");
		
	this.setData = function(data){
		var model = [{
				label:"Temperature",
				value:19,
				unit:"ºC"
			},{
				label:"Lumière",
				value:30,
				unit:"Lux"
			},{
				label:"Air",
				value:100
			}
		];
		console.debug("setData");
	 	
		var width = 400;
	    var height = 300;
	    var radius = Math.min(width, height) / 2;
		
	}
};

