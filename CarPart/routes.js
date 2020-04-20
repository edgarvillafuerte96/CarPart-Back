module.exports = function(app) {
  var legacy = require ('./Controller/legacy');
  var Custinfo = require('./Controller/CustCard');
  var email = require('./Controller/email');
    
    app.route('/parts')
       .get(legacy.getallparts)

    app.route('/checkout')
        .post(Custinfo.checkout)
    
    app.route('/charge')
        .post(Custinfo.charge)
        .get(Custinfo.getcharge)

    app.route('/inventory')
        .post(Custinfo.newinventory) //will post new items 
        .get(Custinfo.getinventory) //returns all the items in eventory 
        .put(Custinfo.updateinventory)
    app.route('/update')
        .get(email.updateorder)
       
};