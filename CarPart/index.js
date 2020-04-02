const express = require('express')
const app = express();
const port= 8081

var cors = require('cors')
var bodyParser = require ('body-parser')
var connection = require ("./connection.js")

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var route = require("./routes");

route(app);

app.listen(port, (err) =>{
    if(err){
    return console.log('shitttttttttt something wrong');}
    console.log("we live from from port:"+port);
});