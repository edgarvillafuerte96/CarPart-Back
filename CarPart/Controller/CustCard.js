let awsConnection = require ('../awsConnection');
const axios = require('axios');

exports.checkout = function(req,res){
    //var name = req.body.name ;
    //var email = req.body.email;
    //var billing_address = req.body.billing_address;
    //var shipping_address = req.body.shipping_address;
    //var cardnum = req.body.cardnum;
    //var exp = req.body.exp;
    //var cvc = req.body.cvc;
    //var credit_name= req.body.credit_name;
    //var pnid = req.body.number;
    //add quanity

    let statement = 'INSERT INTO Customer (name, email, billing_address, shipping_address) VALUES (?, ?, ?, ?)';
    let values = [req.body.name, req.body.email, req.body.billing_address, req.body.shipping_address]
    let custid =  newcustomer(statement, values);
    
   // statement = 'INSERT INTO Credit_Info(cardnum, credit_name, exp, cvc,custid) VALUES(?,?,?,?,?)';
   // values = [req.body.cardnum, req.body.credit_name, req.body.exp, req.body.cvc, req.body.custid]
   // awsConnection.query(statement, values, (err,results, fields)=>{
   //     if(err){
   //         return console.error(err.message);
   //     }
   // });
    console.log(custid);

}


//       const url = 'http://blitz.cs.niu.edu/CreditCard/';
function newcustomer (statement, values){
    awsConnection.query(statement, values, (err, results)=> {
        if (err) {
            return console.error(err.message);
        }
        console.log(results.insertId);
        callback(results.insertId);
    });

}
