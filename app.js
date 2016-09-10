let ping = require("ping");

let hosts = ['baidu.com'];

hosts.forEach(function(host){
    ping.promise.probe(host)
        .then(function(res){
            console.log(res.output);
        });
});