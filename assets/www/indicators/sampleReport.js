function SampleReport(viewId){
	this.viewId = viewId;
	var core = d3.select("#"+viewId);
	var piesvg = core
		.append("svg")
		.append("g")
			   .attr("class", "centeredg");
		piesvg.append("g").attr("class", "arc");
	
	this.update = function(model){
		var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) {
			return d.pieArc;
	    });
		
		
		var width = 800;
	    var height = 800;
	    var radius = Math.min(width, height) / 2;
	    var temperatureAngle = Math.PI/3;
	    var airAngle = temperatureAngle + 2*Math.PI/3;
		var luminosityAngle = temperatureAngle + 4*Math.PI/3;
	    
		pie.startAngle(temperatureAngle-2*Math.PI/3);
		pie.endAngle(temperatureAngle-2*Math.PI/3+Math.PI*2);
	    
	    var baseArc = d3.svg.arc();
		var arc = d3.svg.arc()
	    .outerRadius(radius)
//	    .innerRadius(radius/2);
		.innerRadius(0);
		var arcModule = function(i){
			var outerRadius = ((.60*radius-10)*(i)+(.60*radius-30)*(1-i));
			var innerRadius = 30;
			baseArc.outerRadius(outerRadius);
			baseArc.innerRadius(innerRadius);
			return baseArc;
		};
		
		
	    core.select("svg")
	    	.attr("width",width)
	    	.attr("height",height);
	    piesvg
		   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	    var pieGArc = piesvg.selectAll("g.arc");
	    var pieCore = pieGArc.selectAll("path.arc").data(pie(model));
	    
	    var path = pieCore.enter().append("path")
		.attr("class","arc")
		.attr("d", arc)
		.each(function(d) {
			this._current = d; 
			this._currentRadius = d.data.value/d.data.target;
			})
		.style("fill", function(d,i){
			return d.data.color;
		});
	    
	    piesvg.selectAll("path.arc")
			.data(pie(model))
			.attr("id",function(d,i){return "arcPath_"+i;})
			.transition().duration(300)
			.style("fill", function(d,i){
				return d.data.color;
			})
		
		var outerText = pieGArc.selectAll("text.arc.outer").data(pie(model));
		var groupOuterText = outerText.enter();
		groupOuterText.append("defs").append("path")
		    .attr("id", function(d,i){return "text-path_"+i;})
		    .attr("d", arcModule(2.5));

		groupOuterText
			.append("text")
			.attr("class","arc outer")
			.attr("font-size","60px")
			.attr("dy", ".35em")
			.style("text-anchor", "middle")
			.style("fill", "rgba(0,0,0,.1)")
			.style("stroke" ,"rgba(0,0,0,.2)")
			.style("font-family","Oxygen")
			.append("textPath")
				.attr("startOffset","25%")
			    .attr("xlink:href", function(d,i){ return "#text-path_"+i})
			.text(function(d,i) { 
					var pieitem = pie(model)[i];
					if(pieitem.endAngle-pieitem.startAngle < 0.5){
						return "";
					} else {
						return d.data.label; 
					}
				})
		outerText.exit().remove();
		
		
		var d3LollipopLine = d3.svg.line.radial();
		
		
		
		var paint = function(baseAngle, groupClassName, lengthLollipop, dasharray, strokecolor, lineColor, history, scale, critical){
			var radiusLollipop = 20;
			var lineClassName = groupClassName+"Line";
			var lineFunc = d3.svg.line.radial();
			var angleStep = (Math.PI*2/3)/24;
		    var temperatureGroup = piesvg.selectAll("g."+groupClassName).data([[[0,0], [lengthLollipop,baseAngle]]]);
			
		    temperatureGroup.enter()
			.append("g")
				.attr("class",groupClassName);
		    temperatureGroup.exit().remove();
		    
		    var temperatureLine = temperatureGroup.selectAll("path."+lineClassName).data([[[0,0], [lengthLollipop-radiusLollipop,baseAngle]]]);
			temperatureLine
				.enter().append("path").attr("class", lineClassName)
				.style("fill","#000000")
				.style("stroke",lineColor)
				.style("stroke-width",4);
			temperatureLine.exit().remove();
		    temperatureLine
				.transition().duration(600)
				.attr("d",function(d){var t = d3LollipopLine(d);
				return t;})
				;
		    
		    var temperatureLineEnd = temperatureGroup.selectAll("path."+lineClassName+"End").data([[[lengthLollipop+radiusLollipop,baseAngle],[radius,baseAngle]]]);
			temperatureLineEnd
				.enter().append("path").attr("class", lineClassName+"End")
				.style("fill","#000000")
				.style("stroke",lineColor)
				.style("stroke-width",4);
			temperatureLineEnd.exit().remove();
		    temperatureLineEnd
				.transition().duration(600)
				.attr("d",function(d){var t = d3LollipopLine(d);return t;});

		    var cx = Math.cos(baseAngle-Math.PI/2)*lengthLollipop;
			var cy = Math.sin(baseAngle-Math.PI/2)*lengthLollipop;
		    
		    var lollipop = temperatureGroup.selectAll("circle."+groupClassName+"lollipop").data([{r:radiusLollipop, cx:cx,cy:cy}]);
			lollipop.enter().append("circle").attr("class", groupClassName+"lollipop")
								.style("stroke", strokecolor)
								.style("stroke-width",4)
								.style("stroke-dasharray", dasharray)
								.style("fill", "rgba(255,255,255,0)");
			
		    lollipop.exit().remove();
			
			lollipop
				.transition().duration(600)
				.attr("r", function(d){return d.r;})
			    .attr("cx", function(d){return d.cx;})
			    .attr("cy", function(d){return d.cy;});

			
			var clockLineGroupName = groupClassName+"ClockLineGroup";
			var clockLineName = groupClassName+"ClockLine";
			var clockLineGroup = piesvg.selectAll("g."+clockLineGroupName).data([{place:"holder"}]);
			clockLineGroup.enter().append("g").attr("class", clockLineGroupName);
			clockLineGroup.exit().remove();
			var clockLine = clockLineGroup.selectAll("path."+clockLineName).data([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]);
			clockLine.enter().append("path").attr("class", clockLineName)
				.style("stroke","black")
				.style("opacity",0.2)
				.style("stroke-width",1)
				.attr("d", function(d,i){
					if(i>0)
						return lineFunc([[radius*0.9,baseAngle-i*angleStep],[radius,baseAngle-i*angleStep]]);
					else
						return lineFunc([[0,baseAngle-i*angleStep],[0,baseAngle-i*angleStep]]);
				});
			clockLine.exit().remove();
			
			
			var historyLineGroupName = groupClassName+"HistoryLineGroup";
			var historyLineName = groupClassName+"HistoryLine";
			var historyLineGroup = piesvg.selectAll("g."+historyLineGroupName).data([{place:"holder"}]);
			historyLineGroup.enter().append("g").attr("class", historyLineGroupName);
			historyLineGroup.exit().remove();
			var historyLine = historyLineGroup.selectAll("path."+historyLineName).data(history);
			historyLine.enter().append("path").attr("class", historyLineName)
				.style("stroke",lineColor)
				.style("stroke-width",4)
				.attr("d", function(d,i){
					if(i==0){
						return lineFunc([[lengthLollipop,baseAngle],[lengthLollipop,baseAngle]]);
					} else {
						return lineFunc([[scale(d),baseAngle-(i-1)*angleStep],[scale(d),baseAngle-(i-1)*angleStep]]);
					}
				});
			historyLine.exit().remove();
			historyLine.transition().duration(600)
			//.delay(function(d,i){if(i<history.length-1){return 0} else return 600;})
				.style("stroke",lineColor)
				.attr("d", function(d,i){
					if(i==0){
						return lineFunc([[lengthLollipop,baseAngle],[lengthLollipop,baseAngle]]);
					} else {
						return lineFunc([[scale(history[i-1]),baseAngle-(i-1)*angleStep],[scale(d),baseAngle-(i)*angleStep]]);
					}
				});
		}
		
		var temperatureScale = d3.scale.linear();
		temperatureScale.domain([Math.min(model[0].min,model[0].target),Math.max(model[0].max,model[0].target)]);
		temperatureScale.range([150,250]);
		var airScale = d3.scale.linear();
		airScale.domain([Math.min(model[1].min,model[1].target),Math.max(model[1].max,model[1].target)]);
		airScale.range([150,250]);
		var luminosityScale = d3.scale.linear();
		console.debug("model luminosity", model[2]);
		luminosityScale.domain([Math.min(model[2].min,model[2].target),Math.max(model[2].max,model[2].target)]);
		luminosityScale.range([150,250]);
		console.debug("temp length",temperatureScale(model[0].value));
		
		var temperatureCritical = Penality.forTemperature(model[0].value);
		var airQualityCritical = Penality.forAirQuality(model[1].value);
		var luminosityCritical = Penality.forLuminosity(model[2].value);
		
//		paint(temperatureAngle, "temperatureTarget", temperatureScale(model[0].target), "10,10", "black", model[0].lineColor);
		paint(temperatureAngle, "temperature", temperatureScale(model[0].value), false, model[0].ringColor, model[0].lineColor, model[0].history, temperatureScale, temperatureCritical<0.75);
		paint(airAngle, "air", airScale(model[1].value), false, model[1].ringColor,model[1].lineColor, model[1].history, airScale,airQualityCritical<0.75);
		paint(luminosityAngle, "luminosity", luminosityScale(model[2].value), false, model[2].ringColor, model[2].lineColor, model[2].history, luminosityScale, luminosityCritical<0.75);
		
		
		var comfortScale = d3.scale.linear();
		comfortScale.domain([0,100]);
		comfortScale.range([150,50]);
		
		var comfortFontScale = d3.scale.linear();
		comfortFontScale.domain([0,100]);
		comfortFontScale.range([150,50]);
		
		
		var comfortColor = d3.scale.linear();
		comfortColor.domain([50,80]);
		comfortColor.range(["red","green"]);
		var comfortValue = (Penality.forState({
			temperature:model[0].value,
			airQuality:model[1].value,
			luminosity: model[2].value
			})*100).toFixed(0); //call utils.comfort(model[0].value, model[1].value, model[2].value);
		
		var comfortCircleRadius = comfortScale(comfortValue); //100
		
		
		var comfortData = [{r:comfortCircleRadius, cx:0,cy:0,value:comfortValue}];
		var comfortGroup = piesvg.selectAll("g.comfort").data(comfortData);
			comfortGroup.enter()
			.append("g")
				.attr("class","comfort");
			comfortGroup.exit().remove();
			
		var comfortCircle = comfortGroup.selectAll("circle.comfortCircle").data(comfortData);
		comfortCircle.enter().append("circle").attr("class", "comfortCircle")
//			.style("stroke", "deepskyblue")
			.style("stroke", "white")
			.style("stroke-width",4)
//			.style("fill", "rgba(255,255,255,255)")
			.style("fill", comfortColor(comfortValue));
			
	    comfortCircle.exit().remove();
		
		comfortCircle
			.transition().duration(600)
			.attr("r", function(d){return d.r;})
		    .attr("cx", function(d){return d.cx;})
		    .attr("cy", function(d){return d.cy;})
		    .style("fill", comfortColor(comfortValue));
		var comfortText = comfortGroup.selectAll("text.comfortText").data(comfortData);
		comfortText.enter().append("text").attr("class","comfortText")
			.style("font-size",comfortFontScale(comfortValue)+"px")
			.style("font-family","Oxygen")
			.style("font-weight","bold")
			.style("text-anchor","middle")
			.style("stroke", "black")
			.style("fill", "white")
			.style("alignment-baseline","central")
			
			;
		comfortText.exit().remove();
		comfortText.transition().duration(600)
			.style("font-size",comfortFontScale(comfortValue)+"px")
			.text(function(d,i) {return d.value;});
			
			
			
			
			
	}
	this.model = null;
	
	this.setData = function(data){
		console.debug("received data ",data);
		var newTemperature = data.temperature;
		var newLuminosity = data.luminosity;
		var newAir = data.airQuality;
		var historyTemperature = this.model?this.model[0].history:[];
		var historyAir = this.model?this.model[1].history:[];
		var historyLuminosity = this.model?this.model[2].history:[];
		historyTemperature.unshift(newTemperature);
		historyAir.unshift(newAir);
		historyLuminosity.unshift(newLuminosity);
		var cutoff= 24;
		if(historyTemperature.length>cutoff){
			historyTemperature.pop();
		}
		if(historyAir.length>cutoff){
			historyAir.pop();
		}
		if(historyLuminosity.length>cutoff){
			historyLuminosity.pop();
		}
		var tMax = d3.max(historyTemperature);
		var tMin = d3.min(historyTemperature);
		
		var airMax = d3.max(historyAir);
		var airMin = d3.min(historyAir);
		var luxMax = d3.max(historyLuminosity);
		var luxMin = d3.min(historyLuminosity);
		var model = [{
			label:"Température",
			value:newTemperature,
			target:19,
			max:tMax,
			min:tMin,
			unit:"ºC",
			color:"#f0e6d8",
			ringColor:"#9e6b56",
			lineColor:"#dd7a55",
			pieArc:10,
			history:historyTemperature,
		},{
			label:"Air",
			value:newAir,
			target:32,
			max:airMax,
			min:airMin,
			color:"#d9e1dc",
			ringColor:"#063968",
			lineColor:"#18004d",
			pieArc:10,
			history:historyAir,
		},{
			label:"Lumière",
			value:newLuminosity,
			target:120,
			max:luxMax,
			min:luxMin,
			unit:"Lux",
			color:"#e7ebdb",
			ringColor:"#7a675b",
			lineColor:"#468c24",
			pieArc:10,
			history:historyLuminosity
		}
	];
		this.model = model;
		this.update(model);
		
	}
	
		
//	this.setData = function(data){
//		var tMax = d3.max(data.result[0].chs[0].vals, function(d){return d.val;})
//		var tMin = d3.min(data.result[0].chs[0].vals, function(d){return d.val;})
//		
//		var airMax = d3.max(data.result[0].chs[0].vals, function(d){return d.val;})
//		var airMin = d3.min(data.result[0].chs[0].vals, function(d){return d.val;})
//		var luxMax = d3.max(data.result[0].chs[0].vals, function(d){return d.val;})
//		var luxMin = d3.min(data.result[0].chs[0].vals, function(d){return d.val;})
//		var self = this;
//		var index = 0;
//		
////		setTimeout(function(){
//		setInterval(function(){
//			var model = [{
//				label:"Température",
//				value:data.result[0].chs[0].vals[index].val,
//				target:19,
//				max:tMax,
//				min:tMin,
//				unit:"ºC",
//				color:"#f0e6d8",
//				ringColor:"#9e6b56",
//				lineColor:"#dd7a55",
//				pieArc:10,
//
//			},{
//				label:"Air",
//				value:data.result[0].chs[0].vals[index].val,
//				target:32,
//				max:airMax,
//				min:airMin,
//				color:"#d9e1dc",
//				ringColor:"#063968",
//				lineColor:"#18004d",
//				pieArc:10,
//			},{
//				label:"Lumière",
//				value:data.result[0].chs[0].vals[index].val,
//				target:14,
//				max:luxMax,
//				min:luxMin,
//				unit:"Lux",
//				color:"#e7ebdb",
//				ringColor:"#7a675b",
//				lineColor:"#468c24",
//				pieArc:10,
//			}
//		];
//			self.update(model);
//			index++;
//			if(index>=data.result[0].chs[0].vals.length){
//				index = 0;
//			}
//		}, 1000);
//	}
};

