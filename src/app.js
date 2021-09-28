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

myRouter.route('/v1/pigeons/:pigeons_name')
.get(function(req,res){
    res.json(pigeons.getPigeonByName(pigeonsList, req.params.pigeons_name));
    // res.json({message : "Get Pigeon n°" + req.params.pigeons_name});
})
.post(function(req,res){
    // console.debug(req.body);
    res.json({message : "Update Pigeon n°" + req.params.pigeons_name + " with status " + req.body.status});
})

// Use myRouter
app.use(myRouter);

// Start server
app.listen(port, hostname, function(){
    console.log("My server start on http://"+ hostname +":"+port+"\n");
});
