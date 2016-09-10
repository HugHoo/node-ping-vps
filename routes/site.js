'use strict'

let ping = require("ping");
let iconv = require("iconv-lite");
let util = require('util');

function pings(hosts){
    let promiseList = [];
    let resList = [];

    hosts.forEach(function(host){
        promiseList.push(ping.promise.probe(host, { timeout : 5 })
            .then(function(res){
                let buf = new Buffer(res.output, "hex");
                let tmp_out = iconv.decode(buf, "gbk");
                // console.log(tmp_out);

                let obj = {
                    host: host,
                    alive: res.alive,
                    ip: res.alive ? tmp_out.match(/\[(\d{0,3}\.\d{0,3}\.\d{0,3}\.\d{0,3})\]/i)[1] : "unknow",
                    time_min: res.alive ? tmp_out.match(/最短\s{0,}=\s{0,}(\d{0,4})ms/i)[1] : Number.MAX_SAFE_INTEGER,
                    time_max: res.alive ? tmp_out.match(/最长\s{0,}=\s{0,}(\d{0,4})ms/i)[1] : Number.MAX_SAFE_INTEGER,
                    time_avg: res.alive ? tmp_out.match(/平均\s{0,}=\s{0,}(\d{0,4})ms/i)[1] : Number.MAX_SAFE_INTEGER
                }

                console.log(obj.host + " ping finished.");
                resList.push(obj);
            })
        );

    });

    return Promise.all(promiseList).then(function(){
        // console.log("finally done.");
        // console.log(util.inspect(resList, true, null, true));
        return resList;
    });
}

// pings(hosts).then(function(res){
//     console.log(util.inspect(res, true, null, true));
// })

exports.pings = pings;