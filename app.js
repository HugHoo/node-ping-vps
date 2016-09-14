'use strict'

let fs = require("fs");
let site = require("./routes/site");
let express = require("express");
let app = express();

app.use(express.static("public"));
app.set("views", __dirname + "/views");
app.set("public", __dirname + "/public");

app.get("/", function(req, res){
    res.sendFile("index.html", { root: app.get("views") });
});

app.get("/sls", function(req, res){
    console.log("ajax query : server list.");
    console.log(req.query.fileName);

    let serverList = JSON.parse(fs.readFileSync(app.get("public") + "/fls/" + req.query.fileName));

    // site.pings(serverList).then(function(sres){
    //     res.send(JSON.stringify(sres));
    // }); 
    res.send(JSON.stringify(serverList));   
});

// single server : sgls
app.get("/sgls", function(req, res){
    console.log("ajax query : single server.");
    console.log("query params" + JSON.stringify(req.query));
    site.ping(req.query.host)
        .then(function(sres){
            console.log(sres);
            res.send(sres);
        });
});

// server file list : fls
app.get("/fls", function(req, res){
    console.log("ajax query : server file list.");
    fs.readdir(app.get("public") + "/fls", function(err, files){
        if(err){
            console.log(err.stack);
        }else{
            console.log(files);
            res.send(files);
        }
    });

});

app.listen(3000);
console.log("Listening at http://*:3000.");