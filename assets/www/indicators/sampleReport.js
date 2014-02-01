function SampleReport(viewId){
	this.viewId = viewId;
	var core = d3.select("#"+viewId);
	
	this.setData = function(data){
		var model = data.result;
		console.debug("setData");
	 	var sel = core.selectAll('.test').data(model);
	 	sel.enter().append('p').attr('class','test');
	 	sel.exit().remove();
	 	sel.transition().duration().text(function(d){return d;});
		
	}
};

