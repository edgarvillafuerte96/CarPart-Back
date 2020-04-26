var mysql = require('mysql')


var aws = mysql.createConnection({
     host: "parts.cee6xqmpdhz0.us-east-2.rds.amazonaws.com",
     user: "admin",
     password: "12345678",
     port: "3306",
     database: 	"parts",
     multiStatement: true
 });

aws.connect(function(err){
    if (err){
        conn=false;
        console.log("failled to connect to db");
        return;
    }
    conn=true;
    console.log('connected to db parts on AWS');
});

module.exports = aws;

