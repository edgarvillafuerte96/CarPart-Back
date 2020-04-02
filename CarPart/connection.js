var mysql = require('mysql')


var connection = mysql.createConnection({
     host: "er7lx9km02rjyf3n.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
     user: "rs0czd6o8w8e8r3j",
     password: "w1ffboir25orrcs4",
     port: "3306",
     database: 	"b25oudnru9u3blk4",
     multiStatement: true
 });

var conn = false;

connection.connect(function(err){
    if (err){
        conn=false;
        console.log("failled to connect to db");
        return;
    }
    conn=true;
    console.log('connected to db');
});

module.exports = connection;