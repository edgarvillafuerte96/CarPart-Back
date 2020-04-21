module.exports = function(app) {
  var legacy = require ('./Controller/legacy');
  var Custinfo = require('./Controller/CustCard');
  var email = require('./Controller/email');
    
    app.route('/parts')
       .get(legacy.getallparts)
    app.route('/searchPart')
       .get(legacy.onepart)

    app.route('/checkout')
        .post(Custinfo.checkout)
    
    app.route('/charge')
        .post(Custinfo.charge)
        .get(Custinfo.getcharge)

    app.route('/inventory')
        .post(Custinfo.newinventory) //will post new items pnid and quantity
        .get(Custinfo.getinventory) //returns all the items in eventory no body
        .put(Custinfo.updateinventory)  //update the quanity PNID quantity as params
    app.route('/shiplabel')
        .get(email.updateorder) //will return shipping needed info.. pass orderid body
    app.route('/allorders')
        .get(email.allorder)

    //route for inserting items when the time comes
   // app.route('/insertorder')
   //     .post(Custinfo.orderitems)
   app.route('/ordersearch')
        .get(Custinfo.searchorder)
};