// Server Requirement
const express = require('express');
const bodyParser = require("body-parser");

const pigeons = require('./pigeons')

// Server Parameters
var hostname = '0.0.0.0';
var port = 80;

// Init Pigeon
var pigeonsList = pigeons.initPigeon()
var cardanoCLI = pigeons.initCardanoCLI()

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Creare myRouter router
var myRouter = express.Router();

myRouter.route('/v1/pigeons')
.get(function(req,res){
    res.status(200).json(pigeonsList);
})
// .post(function(req,res){
//     res.json({message : "Add Pigeon", methode : req.method});
// })

myRouter.route('/v1/pigeons/:pigeons_id')
.get(function(req,res){
    var pigeon = pigeons.getPigeonByID(pigeonsList, req.params.pigeons_id);
    if (pigeon !== null) {
        res.status(200).json(pigeon);
    } else {
        res.sendStatus(404);
    }
})
.post(function(req,res){
    if (req.body.sold == "reserved" || req.body.sold == 0) {
        var pigeon = pigeons.updatePigeonStatusByID(pigeonsList, req.params.pigeons_id, req.body.sold, cardanoCLI);
        if (pigeon !== null) {
            res.status(200).json(pigeon);
        } else {
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(401);
    }
})

// Use myRouter
app.use(myRouter);

// Start server
app.listen(port, hostname, function(){
    console.log("My server start on http://"+ hostname +":"+port+"\n");
});
