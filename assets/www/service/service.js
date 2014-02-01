window.EnergyHack = {};

var eh = window.EnergyHack;

eh.sample = function(callback){
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
}