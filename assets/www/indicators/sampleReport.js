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
		
		
		var width = 600;
	    var height = 600;
	    var radius = Math.min(width, height) / 2;
	    var temperatureAngle = Math.PI/3;
		var luminosityAngle = temperatureAngle + 2*Math.PI/3;
		var airAngle = temperatureAngle + 4*Math.PI/3;
	    
		pie.startAngle(temperatureAngle-2*Math.PI/3);
		pie.endAngle(temperatureAngle-2*Math.PI/3+Math.PI*2);
	    
	    var baseArc = d3.svg.arc();
		var arc = d3.svg.arc()
	    .outerRadius(radius)
	    .innerRadius(radius/2);
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
		.transition().duration(300)
		.style("fill", function(d,i){
			return d.data.color;
		})
		//changes radius of circle and length of arc
//		.attrTween("d", function (d) {
//			console.debug("tweening ",d);
//			var isDeployed = 0;
//			var j = d3.interpolate(0, this._currentRadius);
//			var i = d3.interpolate(this._current, d);
//            this._currentRadius = j(1);
//            this._current = i(1);
//            return function (t) {
//                return arcModule(j(t))(i(t));
//            };
//		});
//	    var lengthLollipop = 200;
	    var radiusLollipop = 20;
		
		var d3LollipopLine = d3.svg.line.radial();
		
		
		var paint = function(baseAngle, groupClassName, lineClassName, lengthLollipop, dasharray, strokecolor){
		    var temperatureGroup = piesvg.selectAll("g."+groupClassName).data([[[0,0], [lengthLollipop,baseAngle]]]);
		    temperatureGroup.enter()
			.append("g")
				.attr("class",groupClassName);
		    temperatureGroup.exit().remove();
		    
		    var temperatureLine = temperatureGroup.selectAll("path."+lineClassName).data([[[0,0], [lengthLollipop-radiusLollipop,baseAngle]]]);
			temperatureLine
				.enter().append("path").attr("class", lineClassName)
				.style("fill","#000000")
				.style("stroke","#000000")
				.style("stroke-width",4);
			temperatureLine.exit().remove();
		    temperatureLine
				.transition().duration(600)
				.attr("d",function(d){var t = d3LollipopLine(d);
				return t;})
				;

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
		    
		}
		var temperatureScale = d3.scale.linear();
		temperatureScale.domain([Math.min(model[0].min,model[0].target),Math.max(model[0].max,model[0].target)]);
		temperatureScale.range([150,250]);
		var luminosityScale = d3.scale.linear();
		luminosityScale.domain([5,25]);
		luminosityScale.range([100,200]);
		var airScale = d3.scale.linear();
		airScale.domain([5,25]);
		airScale.range([100,200]);
		console.debug("temp length",temperatureScale(model[0].value));
		paint(temperatureAngle, "temperatureTarget", "temperatureTargetLine", temperatureScale(model[0].target), "10,10", "black");
		paint(temperatureAngle, "temperature", "temperatureLine", temperatureScale(model[0].value), false, "deepskyblue");
		paint(luminosityAngle, "luminosity", "luminosityLine", luminosityScale(model[0].value), false, "deepskyblue");
		paint(airAngle, "air", "airLine", airScale(model[0].value), false, "deepskyblue");
		
		var comfortCircleRadius = 100;
		var comfortValue = 96;
		var comfortData = [{r:comfortCircleRadius, cx:0,cy:0,value:comfortValue}];
		var comfortGroup = piesvg.selectAll("g.comfort").data(comfortData);
			comfortGroup.enter()
			.append("g")
				.attr("class","comfort");
			comfortGroup.exit().remove();
			
		var comfortCircle = comfortGroup.selectAll("circle.comfortCircle").data(comfortData);
		comfortCircle.enter().append("circle").attr("class", "comfortCircle")
			.style("stroke", "deepskyblue")
			.style("stroke-width",4)
			.style("fill", "rgba(255,255,255,255)")
	    comfortCircle.exit().remove();
		
		comfortCircle
			.transition().duration(600)
			.attr("r", function(d){return d.r;})
		    .attr("cx", function(d){return d.cx;})
		    .attr("cy", function(d){return d.cy;});
		var comfortText = comfortGroup.selectAll("text.comfortText").data(comfortData);
		comfortText.enter().append("text").attr("class","comfortText")
			.style("font-size","100px")
			.style("font-family","Oxygen")
			.style("font-weight","bold")
			.style("text-anchor","middle")
			.style("alignment-baseline","central")
			;
		comfortText.exit().remove();
		comfortText.transition().duration(600)
			.text(function(d,i) {return d.value;})
	}
		
		
	this.setData = function(data){
		var tMax = d3.max(data.result[0].chs[0].vals, function(d){return d.val;})
		var tMin = d3.min(data.result[0].chs[0].vals, function(d){return d.val;})
		
//		var model = [{
//				label:"Temperature",
//				value:data.result[0].chs[0].vals[0].val,
//				target:19,
//				max:tMax,
//				min:tMin,
//				unit:"¼C",
//				color:"#7f7f00",
//			},{
//				label:"Lumire",
//				value:30,
//				target:18,
//				max:30,
//				min:12,
//				unit:"Lux",
//				color:"#333",
//			},{
//				label:"Air",
//				value:100,
//				target:100,
//				max:120,
//				min:80,
//				color:"#700",
//			}
//		];
		console.debug("setData");
	 	
//		this.update(model);
		var self = this;
		var index = 0;
		
		setInterval(function(){
			console.debug("boucling", data.result[0].chs[0].vals[index].val);
			var model = [{
				label:"Temperature",
				value:data.result[0].chs[0].vals[index].val,
				target:19,
				max:tMax,
				min:tMin,
				unit:"¼C",
				color:"#f0e6d8",
				pieArc:10,
			},{
				label:"Lumire",
				value:30,
				target:18,
				max:30,
				min:12,
				unit:"Lux",
				color:"#e7ebdb",
				pieArc:10,
			},{
				label:"Air",
				value:100,
				target:100,
				max:120,
				min:80,
				color:"#d9e1dc",
				pieArc:10,
			}
		];
			self.update(model);
			index++;
			if(index>=data.result[0].chs[0].vals.length){
				index = 0;
			}
		}, 1000);
	}
};

