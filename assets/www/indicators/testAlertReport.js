function AlertReport(viewId){
	var self = this;
	this.viewId = viewId;

	this.setData = function(data){
		if(data.airQuality>1000){
			$("#"+this.viewId).html(
					"<p>"+data.airQuality.toFixed(1)+" ppm</p>"
					+"<p>"+data.temperature.toFixed(1)+"ºC</p>"
					+"<p>"+data.luminosity.toFixed(1)+" lux</p>"
					)
		}
	}	
	
};

