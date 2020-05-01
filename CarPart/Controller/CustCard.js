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
   let statement = `SELECT * FROM Part_Inventory WHERE pnid = ${req.body.pnid}`;
   console.log(statement);
   new Promise ((accept,reject)=>{
       awsConnection.query(statement, (err,results)=>{
           if (err){
               reject(err);
           }
           else{
               accept(results)
           }
       })
   }).then((cnt)=>{
       
        let newinventory = Number(cnt[0].quantity) + Number(req.body.quantity);
        let statement = `UPDATE Part_Inventory SET quantity = ${Number(cnt[0].quantity) + Number(req.body.quantity)} WHERE pnid = ${req.body.pnid} `;
        console.log(statement)
        awsConnection.query(statement, (err,results)=>{
            if (err) { console.log(err.message)}
        })
       res.send(cnt);
   }).catch((message)=>{
       res.send(message);
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
        //res.send(responce.data.authorization + id);
        let status = '\'paid not shipped\'';
        statement = `INSERT INTO Order1(custid, authorization, amt_charged, order_status) VALUES (${id}, ${responce.data.authorization}, ${responce.data.amount}, ${status})`;
        console.log(statement);
        awsConnection.query(statement, (err,results)=>{
            if (err){
                console.log(err.message);
            }
            else{
                console.log('order1 insert worked');
            }
        }) 
        new Promise((res,rec)=>{
            let statement = `SELECT orderid FROM Order1 where authorization = ${responce.data.authorization}`
            awsConnection.query(statement,(err,results)=>{
                if (err){ rec(err.message);}
                else {  res(results);}
            })
        }).then((orderid)=>{
            console.log (orderid);
            let sendBack= [{"authorization": responce.data.authorization},
                            {"orderid": orderid[0].orderid}]
                            console.log(sendBack)
            res.send(sendBack);
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
    order = JSON.parse(order);
    let orderid = req.body.orderid;
    let weight =0;
    console.log(order.length);
    console.log(order);
    for(let i =0; order[i] != null; i++){
        console.log(order[i].weight);
        weight += (order[i].weight * order[i].quanity_ordered);
        let statement = `INSERT INTO Order_Item (orderid, pnid, quanity_ordered, item_weight, item_price) VALUES (${orderid}, ${order[i].number}, ${order[i].quanity_ordered}, ${order[i].weight} ,${order[i].price}) `;
        console.log(statement);
        awsConnection.query(statement,(err,results)=>{
            if (err){ console.log(err.message); return;}
        })
    }
    console.log(weight)
   insertweight(orderid,weight);
    res.send('order insert has been completed');
}

function insertweight(id, weight){
    console.log(weight);
    console.log(id);
    let statement = `UPDATE Order1 set total_weight = ${weight} WHERE orderid = ${id}`;
    awsConnection.query(statement,(err,results)=>{
        if (err) { console.log('fuck at the insert weight'); }
        else {return 'we successful at life and inserting weight';}
    })
}


exports.cart = function (req,res){
   let statement = `INSERT INTO Cart ('description', 'number', 'price', 'weight','url','quanity') VALUES (\'${req.body.description}\',${req.body.number},${req.body.price},${req.body.weight},\'${req.body.url}\',${req.body.quantity})`;
   console.log(statement);
   awsConnection.query(statement,(err,results)=>{
       if(err){
           console.log(err.message);
           res.send(err.message);
           return;
       }
       else{
           res.send(results);
       }
   }) 
}

exports.returncart = function(req,res){
    let statement = `SELECT * FROM Cart`;
    new Promise((resolve,reject)=>{
        awsConnection.query(statement,(err,results)=>{
            if (err){
                reject(err.message)
            }
            else {resolve(results)}
        })
    }).then((cart)=>{
        var Tweight=0;
        var Ttotal=0;
        console.log(cart.length);
        for (let i =0; i< cart.length;i++){
            Tweight += (cart[i].weight * cart[i].quantity)
            Ttotal += (cart[i].price * cart[i].quantity);
            console.log('round 1');
        }
        console.log(Ttotal)
        console.log(Tweight)
        //new Promise ((resolve,reject)=>{
        //    let hey = `SELECT shiphand_price from Misc_Charges WHERE toweight >= ${Tweight} AND fromWeight <= ${Tweight}`;
        //    awsConnection.query(hey,(err,resu)=>{
        //        if (err){
        //            reject(err.message);
        //        }
        //        else {resolve(resu);}
        //    })
        //}).then((weight)=>{
        //    console.log(weight);
        //    Ttotal += weight[0].shiphand_price;
//
        //    cart[cart.length] = {
        //        "TotalWeight": Tweight,
        //        "GrandTotal": Ttotal
        //    };
        //    console.log(cart);
        //    res.send(cart);
        //}).catch((message)=>{
        //    res.send(message);
        //})
        cart[cart.length] = {
            "totalWeight": Tweight,
            "totalCost": Ttotal
        };

        res.send(cart);
    }).catch((message)=>{
        res.send(message);
    })
}