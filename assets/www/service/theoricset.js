
Window.theoric = function(){
	var lumLow = 120;
	var lumHigh = 200;
	var tempLow = 16;
	var tempHigh = 19;
	var stdAir = 1000;
	var res = [];
	for(var i = 0;i<24;i++){
		if(i<7){
			res.push({
				lumLow : lumLow,
				lumHigh : lumHigh,
				temperature:tempLow,
				airQuality:stdAir
			 });
		} else if (i<10){
			res.push({
				lumLow : lumLow,
				lumHigh : lumHigh,
				temperature:tempHigh,
				airQuality:stdAir
			 });
		} else if (i<19){
			res.push({
				lumLow : lumLow,
				lumHigh : lumHigh,
				temperature:tempLow,
				airQuality:stdAir
			 });
		} else if (i<22){
			res.push({
				lumLow : lumLow,
				lumHigh : lumHigh,
				temperature:tempHigh,
				airQuality:stdAir
			 });
		} else {
			res.push({
				lumLow : lumLow,
				lumHigh : lumHigh,
				temperature:tempLow,
				airQuality:stdAir
			 });
		}
	}
	return res;
}