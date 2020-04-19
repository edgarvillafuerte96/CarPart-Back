let awsConnection = require ('../awsConnection');

exports.orders = function (req,res){
    let statement = 'SELECT * FROM Order1';
    awsConnection.query(statement, (err,result)=>{
        if(err){console.log(err.message);}
        else {res.send(result); }
    })
}

exports.label = function (req,res){
    let statement = 'SELECT * FROM FROM Order1 WHERE orderid = ?';
    let value = [req.body.orderid];
    let promise = new Promise((resolve, reject )=>{
        awsConnection.query(statement, value, (err, result)=>{
            if (err) {
                reject(console.log(err.message));
            }
            else {
                resolve(statement);
            }
        });
    })
    .then()=> (
        email(req.body.orderid);
    )

}

function email (orderid)
{

    
}