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

exports.onepart = function (req,res){
    let statment = `SELECT * FROM parts WHERE number = ${req.body.number}`
    connection.query(statment, (err,results)=>{
        if (err) {console.log(err.message); res.send(err.message); }
        else { res.send(results);}
    })
}
