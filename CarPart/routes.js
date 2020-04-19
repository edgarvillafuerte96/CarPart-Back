module.exports = function(app) {
  var legacy = require ('./Controller/legacy');
  var Custinfo = require('./Controller/CustCard');
  var ship = require('./Controller/email');
    
    app.route('/parts')
       .get(legacy.getallparts)

    app.route('/checkout')
        .post(Custinfo.checkout)
    
    app.route('/charge')
        .post(Custinfo.charge)

    app.route('/inventory')
        .post(Custinfo.inventory)

    app.route('/orders')
        .get(ship.orders)
       
};