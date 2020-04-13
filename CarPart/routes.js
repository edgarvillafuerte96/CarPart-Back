module.exports = function(app) {
  var legacy = require ('./Controller/legacy');
  var Custinfo = require('./Controller/CustCard');
    
    app.route('/parts')
       .get(legacy.getallparts)

    app.route('/customer')
        .post(Custinfo.addcustomer)

    app.route('/CC')
        .post(Custinfo.insertPayment)

    //app.route('/order')
    //    .post(Custinfo.orders)

       
       
};