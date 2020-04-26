let awsConnection = require ('../awsConnection');
const axios = require('axios');

exports.newinventory = function(req,res){
    let statement = 'INSERT INTO Part_Inventory(pnid, quantity) VALUES(?,?)';
    let values = [req.body.pnid, req.body.quantity];
    awsConnection.query(statement, values, (err,results)=>{
        if(err){ console.log(err.message); }
        else {res.send(results);}
    });
}

exports.getinventory = function (req,res){
    let statement = `SELECT * FROM Part_Inventory`
    awsConnection.query(statement, (err,results)=>{
        if (err) {console.log(err.message);
            res.send();}
        else {res.send(results);}

    })
}

exports.updateinventory = function (req,res){
    let statement = `UPDATE Part_Inventory SET quantity = ${req.body.quantity} WHERE pnid = ${req.body.pnid}`;
    awsConnection.query(statement,(err,results)=>{
        if (err) {console.log(err.message);
        res.send(err.message);}
        else {res.send(results);}
    })

}



exports.charge = function(req,res){
    let statement = 'INSERT INTO Misc_Charges(shiphand_price, toweight, fromweight) VALUES (?,?,?)';
    let values = [req.body.shiphand_price, req.body.toweight, req.body.fromweight]
        awsConnection.query(statement, values, (err,results)=>{
            if(err){ console.log(err.message); }
            else {res.send(results);}
        });
}

exports.getcharge = function (req, res){
    let statement = 'SELECT * FROM Misc_Charges';
    awsConnection.query(statement, (err,results)=>{
        if (err) {console.log(err.message);   }
        else {res.send(results);}
    })
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
        res.send(error);
        console.log(error);
    })   
    }).catch((message)=>{
        res.send(message);
    })
}


exports.searchorder = function(req,res){
    if (req.body.mindate != null) {
        let statement = `SELECT * FROM Order1 WHERE order_date >= \'${req.body.mindate}%\' AND order_date <= \'${req.body.maxdate}%\'`;
        console.log(statement);
        awsConnection.query(statement, (err,responce)=>{
            if (err) { console.log(err.message);}
            else {res.send(responce);}
        });
    }

    else if (req.body.minmoney != null) {
        let statement = `SELECT * FROM Order1 WHERE amt_charged >= ${req.body.minmoney} AND amt_charged <= ${req.body.maxmoney}`;
        awsConnection.query(statement, (err,responce)=>{
            if (err) { console.log(err.message);}
            else {res.send(responce);}
        });
    }
    else if (req.body.status != null) 
    {
        let statement = `SELECT * FROM Order1 WHERE order_status =\'${req.body.status}\'`;
        console.log(statement);
        awsConnection.query(statement, (err,responce)=>{
            if (err) { console.log(err.message);}
            else {res.send(responce);}
        });
    }


}


exports.insertitem = function (req,res){
    let order = req.body.order;
    let orderid = req.body.orderid;
    for(let i =0; i <= order.length; i++){
        let statement = `INSERT INTO Order_Item (corderid, pnid, quantity_order) VALUES (${orderid}, ${order[i].pnid}, ${order[i].quanity_ordered}) `;
        console.log(statement);
        awsConnection.query(statement,(err,results)=>{
            if (err){ console.log(err.message); return;}
        })
    }
   
    res.send('order insert has been completed');
}