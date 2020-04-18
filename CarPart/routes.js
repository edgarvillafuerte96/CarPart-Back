module.exports = function(app) {
  var legacy = require ('./Controller/legacy');
  var Custinfo = require('./Controller/CustCard');
    
    app.route('/parts')
       .get(legacy.getallparts)

    app.route('/checkout')
        .post(Custinfo.checkout)
       
       
};