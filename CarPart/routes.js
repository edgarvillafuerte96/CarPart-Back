module.exports = function(app) {
    var legacy = require ('./Controller/legacy');
    //var autozone = require('./Controller/autozone');

    app.route('/parts')
        .get(legacy.getallparts)

    //app.route('/autozone')
      //  .get(autozone.insertings)
};

