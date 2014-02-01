// Simone
console.log(simone);
bean.on(simone, 'state', function(s) {
    console.log(s)
});

simone.facade.emitState({'a':"coucou"});