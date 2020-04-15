let connection = require('../connection.js');
//let aws = require("../awsConnection");

exports.getallparts = function(req , res) {
    let statment = 'SELECT * FROM parts';
    connection.query(statment, (err, results, fields)=> {
            if(err){
                return console.error(err.message);
            }
            res.send(results)
    });
    
};


