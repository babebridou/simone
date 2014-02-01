window.EnergyHack = {};

EnergyHack.init = function(){
	var _ = window.EnergyHack;
	_.sample = function(callback){
		var post = {
				"jsonrpc":"2.0",
				"method":"energy",
				"params":[
				          {
				        	  "prog":"CERGY01",
				        	  "ctx":"GLOBAL",
				        	  "ind":0,
				        	  "gran":"LAST",
				        	  
				        }],
				"id":"energyhack007"
		};
		
		$.ajax({
			//use fallback url just so it works
	// 		url:"https://camel.steria.fr:4043/CamelWebService/energy",
			url:"https://energypass.fr/CamelProxy/energy.ashx",
			type:'POST',
			data:JSON.stringify(post),
	        success:callback,
	        beforeSend: function (request){
	//         	request.setRequestHeader("Authorization", authorizationToken);
	        	request.setRequestHeader("Content-type", "application/json-rpc");
	        	request.setRequestHeader("Accept", "application/json-rpc");
	        	}
		});
	};
	
	
	
};
EnergyHack.init();
