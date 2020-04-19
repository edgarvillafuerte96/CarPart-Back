let awsConnection = require ('../awsConnection');
const axios = require('axios');

exports.charge = function(req,res){
    let statement = 'INSERT INTO Misc_Charges(shiphand_price, toweight, fromweight) VALUES (?,?,?)';
    let values = [req.body.shiphand_price, req.body.toweight, req.body.fromweight]
        awsConnection.query(statement, values, (err,results)=>{
            if(err){ console.log(err.message); }
            else {res.send(results);}
        });
}

exports.checkout = function(req,res){

    let statement = 'INSERT INTO Customer (name, email, billing_address, shipping_address) VALUES (?, ?, ?, ?)';
    let values = [req.body.name, req.body.email, req.body.billing_address, req.body.shipping_address]
    let custid = new Promise((resolve,reject) => {
        awsConnection.query(statement, values, (err, results)=> {
            if (err) {
                reject(err.message);
            }
            resolve(results.insertId);
        });

    })
    .then((id)=>{
    
        statement = 'INSERT INTO Credit_Info(cardnum, credit_name, exp, cvc,custid) VALUES(?,?,?,?,?)';
        values = [req.body.cardnum, req.body.credit_name, req.body.exp, req.body.cvc, id]
        awsConnection.query(statement, values, (err,results, fields)=>{
            if(err){
                return console.error(err.message);
            }
            console.log(results);
        })
        
        
       axios.post('http://blitz.cs.niu.edu/CreditCard/', {
        vendor: 'Team-3A',
        trans: id,
        cc: req.body.cardnum,
        name: req.body.credit_name,
        exp: req.body.exp,
        amount: req.body.amt_charged
    }).then((responce)=>{
        console.log(responce.data);
        res.send(responce.data.authorization);
        let status = '\'paid not shipped\'';
        statement = `INSERT INTO Order1(custid, authorization, amt_charged, order_status) VALUES (${id}, ${responce.data.authorization}, ${responce.data.amount}, ${status})`;
        console.log(statement);
        awsConnection.query(statement, (err,results)=>{
            if (err){
                console.log(err.message);
            }
            else{
                console.log('order1 insert worked' + results);
            }
        }) 

    })
    .catch((error)=>{
        console.log(error);
    })
    
        
    }).catch((message)=>{
        res.send(message);
    })
    

    

}
