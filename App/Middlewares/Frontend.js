var Sys = require('../../Boot/Sys');
var jwt = require('jsonwebtoken');

const flatCache = require('flat-cache');
let cache = flatCache.load('dashboardCache');

var jwtcofig = {
  'secret': 'KiraJwtAuth'
};




module.exports = {
  frontRequestCheck: function (req, res, next) {
    console.log('Time:', Date.now())
    next();
  },

  isLoggedIn: async function (req, res, next) {
    console.log("isLoggin check Vendor", req.session);
    if (req.session.login) {
      // res.redirect('/dashboard');
      console.log(" vendor login check");
      jwt.verify(req.session.details.jwt_token, jwtcofig.secret, async function (err, decoded) {
        if (err) {
          req.session.destroy(function (err) {
            req.logout();
            console.log("/1");
            return res.redirect('/');
          })
        } else {
          console.log("/2");
          res.locals.session = req.session.details;
          next();
        }
      });
    } else {
      console.log("/3");
      res.redirect('/');
    }
  },

  // isLoggedIn: function (req, res, next) {
  //   console.log("req", req.session);
  //   if (req.session.login && req.session.details.role == 'admin') {
  //     console.log("0000000");

  //     res.redirect('/dashboard');
  //   } else {
  //     console.log("11111111");
  //     next();
  //   }
  // },

}
