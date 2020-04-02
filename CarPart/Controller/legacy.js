let connection = require('../connection.js');

exports.getallparts = function(req , res) {
    let statment = 'select * from parts';
    connection.query(statment, (err, results, fields)=> {
            if(err){
                return console.error(err.message);
            }
            res.send(results)
    });
};


