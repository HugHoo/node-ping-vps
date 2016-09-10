'use strict'

let ping = require("ping");
let iconv = require("iconv-lite");
let util = require('util');

let hosts = [
    "hk01.ftq.pw",
    "hk02.ftq.pw",
    "hk03.ftq.pw",
    "hk04.ftq.pw",
];

let promiseList = [];
let resList = [];

hosts.forEach(function(host){
    promiseList.push(ping.promise.probe(host)
        .then(function(res){
            let buf = new Buffer(res.output, "hex");
            let tmp_out = iconv.decode(buf, "gbk");
            // console.log(tmp_out);

            let obj = {
                host: host,
                alive: res.alive,
                ip: tmp_out.match(/\[(\d{0,3}\.\d{0,3}\.\d{0,3}\.\d{0,3})\]/i)[1],
                time_min: tmp_out.match(/最短\s{0,}=\s{0,}(\d{0,4})ms/i)[1],
                time_max: tmp_out.match(/最长\s{0,}=\s{0,}(\d{0,4})ms/i)[1],
                time_avg: tmp_out.match(/平均\s{0,}=\s{0,}(\d{0,4})ms/i)[1]
            }

            // console.log(obj);
            resList.push(obj);
        })
    );

});

Promise.all(promiseList).then(function(){
    // console.log("finally done.");
    console.log(util.inspect(resList, true, null, true));
})