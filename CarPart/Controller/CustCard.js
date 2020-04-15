let awsConnection = require ('../awsConnection');

exports.addcustomer = function (req, res) {
    let statement = 'INSERT INTO Customer (name, email, billing_address, shipping_address) VALUES (?, ?, ?, ?)';
    let values = [req.body.name, req.body.email, req.body.billing_address, req.body.shipping_address]
    console.log(req.body.name, req.body.email, req.body.billing_address, req.body.shipping_address)
    awsConnection.query(statement, values, (err, results, fields)=> {
        console.log('we in the route');
        if (err) {
            return console.error(err.message);
        }
        res.send(results)
    });
}

exports.insertPayment = function (req,res) {
    let statement = 'INSERT INTO Credit_Info(cardnum, credit_name, exp, cvc,custid) VALUES(?,?,?,?,?)';
    let values = [req.body.cardnum, req.body.credit_name, req.body.exp, req.body.cvc, req.body.custid]
    awsConnection.query(statement, values, (err,results, fields)=>{
        if(err){
            return console.error(err.message);
        }
        res.send(results)
    });
}

exports.orders = function (req , res) {
    //let statement ='INSERT INTO Order1(custid, authorization,amt_charged) VALUES(?,?,?)'
    //let values= [req.body.custid, req.body.authorization, req.body.amt_charged]
    let url = 'http://blitz.cs.niu.edu/CreditCard/';
    let statement ='SELECT * FROM Credit_Info WHERE custid = 1';
    let values = [req.body.custid]
    console.log(statement);
    var mysql_res;
    awsConnection.query(statement, (err,results,fields)=>{
        if(err){
            return console.error(err.message);
        }
        mysql_res = results;
        res.send(mysql_res);
    });
  //  console.log(mysql_res);
    //let params = {'vendor': 'vendor-3a', 'tran': req.body.custid, 'cc': mysql_res.cardnum, 'name': mysql_res.credit_name , 'exp': mysql_res.exp ,'amount': req.body.amt_charged};

    //onsole.log(params);
   //res.send(mysql_res);
}