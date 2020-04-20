module.exports = function(app) {
  var legacy = require ('./Controller/legacy');
  var Custinfo = require('./Controller/CustCard');
  var email = require('./Controller/email');
    app.route('/parts')
       .get(legacy.getallparts)

    app.route('/customer')
        .post(Custinfo.addcustomer)

    app.route('/CC')
        .post(Custinfo.insertPayment)

    app.route('/order')
        .post(Custinfo.orders)

     app.route('/update')
        .get(email.updateorder)  
    app.route('/search')
        .get(email.ordersearch)
       
};