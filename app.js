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
    console.log(req.query);

    let serverList = JSON.parse(fs.readFileSync("./config/servers.json"));

    site.pings(serverList).then(function(sres){
        res.send(JSON.stringify(sres));
    });    
});

app.listen(3000);
console.log("Listening at http://*:3000.");