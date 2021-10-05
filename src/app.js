// Server Requirement
const express = require('express');
const bodyParser = require("body-parser");

const pigeons = require('./pigeons')

// Server Parameters
var hostname = '0.0.0.0';
var port = 80;

// Init Pigeon
var pigeonsList = pigeons.init()

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Creare myRouter router
var myRouter = express.Router();

myRouter.route('/v1/pigeons')
.get(function(req,res){
    res.json(pigeonsList);
})
// .post(function(req,res){
//     res.json({message : "Add Pigeon", methode : req.method});
// })

myRouter.route('/v1/pigeons/:pigeons_id')
.get(function(req,res){
    var pigeon = pigeons.getPigeonByID(pigeonsList, req.params.pigeons_id);
    // console.debug("Pigeon: "+pigeon);
    // #TODO if error != null
    res.json(pigeon);
})
.post(function(req,res){
    var pigeon = pigeons.updatePigeonStatusByID(pigeonsList, req.params.pigeons_id, req.body.sold);
    res.json(pigeon);
})

// Use myRouter
app.use(myRouter);

// Start server
app.listen(port, hostname, function(){
    console.log("My server start on http://"+ hostname +":"+port+"\n");
});
