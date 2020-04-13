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

//exports.orders = function (req,res) {
    //let statement ='INSERT INTO Order1(custid, authorization,amt_charged) VALUES(?,?,?)'
    //let values= [req.body.custid, req.body.authorization, req.body.amt_charged]
//    let url = 'http://blitz.cs.niu.edu/CreditCard/';
//    let msql ='SELECT ' + req.body.custid+' FROM Credit_Info';
//    var res;
//    awsConnection.query(msql, (err,results, fields)=>{
//        if(err){
//            return console.error(err.message);
//        }
//        res = results;
//    });
//
//    let params = {'vendor': 'vendor-3a', 'tran':'1', 'cc': res.cardnum, 'name': res.credit_name , 'exp': res.exp ,'amount': req.body.amt_charged}
//    console.log(params);
   // awsConnection.query(statement, values, (err,results, fields)=>{
   //     if(err){
   //         return console.error(err.message);
   //     }
   //     res.send(results)
   // });