let awsConnection = require ('../awsConnection');
let nodemailer = require('nodemailer');
//let login = require ('../')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:'DoNotReplyTeam3A@gmail.com',
        pass: 'cs467rocks'
    }
});


exports.updateorder = function(req,res){
    let statement = 'SELECT * FROM Order1 WHERE orderid = ?';
    let values = [req.body.orderid];
    let promise = new Promise ((resolve,reject)=>{
        awsConnection.query(statement,values,(err,results)=>{
            console.log(statement+ values);
            if (err) {
            reject(err.message);
            console.log(err.message);
            }
            else {
            resolve(results);
            //console.log(results);
            }
        });
    }).then((results)=>{
        console.log(results);
        let statment = 'SELECT * FROM Customer WHERE custid = ?';
        let values = results[0].custid;
        console.log(statement + values);
        ////////////new promise
        let k = new Promise ((resolve,reject)=>{
            awsConnection.query(statment,values,(err,res)=>{
              if (err) {
              reject(err.message);
              }//for reject on if
              else{
              resolve(res);
              }
            });
        }).then((data)=>{ 
         //email query
        console.log ('this is the data avilable for email')
        console.log(data);
        console.log(results);
        var mailOptions = {
            from: 'DoNotReply@team3A.com',
            to:  data[0].email,
            subject: 'Order Has Shipped',
            text: `Hey ${data[0].name},
            Thanks for shopping with Team-3A we appreciate it. 

            Your Order# ${results[0].orderid}
            Order Date: ${results[0].order_date}
            Order Total: ${results[0].amt_charged}
            Has shipped to Address:
            ${data[0].shipping_address} 


            Thank you, 
            Team-3A `
        };
        console.log(mailOptions);
        transporter.sendMail(mailOptions, function(error,info){
            if (error) { console.log(error); }
            else { console.log('email was sent');  }
        }); //end of email query
            new Promise((resolve,reject)=>{
            let statem = `SELECT * FROM Order_Item WHERE orderid = ${results[0].orderid}`
                awsConnection.query(statem,(err,results)=>{
                    if (err) { reject(err);}
                    else {resolve(results)}
                })


            }).then((back)=>{
                console.log('here is the return from new promise');
                console.log(back); //modify the return
                back[back.length] = {
                    name: data[0].name,
                    orderid: results[0].orderid,
                    ammount: results[0].amt_charged,
                    shipping_address: data[0].shipping_address
                };
                res.send(back)
            }).catch((errs)=>{
                res.send(back);
            })
        //end of the email query
        }) //end of getting db email promise then 

        //update the table to shipped 
        statement = `UPDATE Order1 SET order_status = \'shipped\' WHERE orderid = ${results[0].custid}`
        console.log(statement);
        awsConnection.query(statement, (err,results)=>{
            if (err) { console.log(err.message); }
            else { console.log('changed the table name to successfule ship')}
        })


        //this is inside the original promise
        //res.send(results);
    }).catch((message)=>{
        res.send(message);
        console.log(message);
    })
   
}


exports.allorder = function (req,res){
    let statement = 'SELECT * FROM Order1'

    awsConnection.query(statement, (err,results)=>{
        if (err) {console.log(err.message);}
        else {console.log(results)
        res.send(results);
        }
    })
}