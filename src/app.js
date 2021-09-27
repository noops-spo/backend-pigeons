// Server Requirement
const express = require('express');
const bodyParser = require("body-parser");

// Server Parameters
var hostname = '0.0.0.0';
var port = 80;

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Creare myRouter router
var myRouter = express.Router();

myRouter.route('/v1/pigeons')
.get(function(req,res){
    res.json({message : "List all Pigeons", methode : req.method});
})
// .post(function(req,res){
//     res.json({message : "Add Pigeon", methode : req.method});
// })

myRouter.route('/v1/pigeons/:pigeons_id')
.get(function(req,res){
    res.json({message : "Get Pigeon n°" + req.params.pigeons_id});
})
.post(function(req,res){
    console.debug(req.body);
    res.json({message : "Update Pigeon n°" + req.params.pigeons_id + " with status " + req.body.status});
})

// Use myRouter
app.use(myRouter);

// Start server
app.listen(port, hostname, function(){
    console.log("My server start on http://"+ hostname +":"+port+"\n");
});
