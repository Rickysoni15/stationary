var Sys = require('../../Boot/Sys');
var jwt = require('jsonwebtoken');

const flatCache = require('flat-cache');
let cache = flatCache.load('dashboardCache');

var jwtcofig = {
  'secret': 'KiraJwtAuth'
};

module.exports = {
    loginCheck:  function(req, res, next){
        console.log("req",req.session);
        if(req.session.login && req.session.details.role == 'admin'){
          console.log("0000000");

            res.redirect('/dashboard');
        }else{
          console.log("11111111");
            next();
        }
    },
    // auth
    Authenticate: async function(req, res, next){

    console.log("authenticate Admin session check",req.session);        
        if(req.session.login){
            jwt.verify(req.session.details.jwt_token, jwtcofig.secret, async function(err, decoded) {
                if (err){
                  //return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
                  req.session.destroy(function(err) {
                      req.logout();
                      return res.redirect('/backend');
                  })
                }else{
                    console.log("next");
                  res.locals.session = req.session.details;
                  next();
                }

            });
        }else{
            res.redirect('/backend');
        }
    },

    HasRole: function(...allowed){
        const isAllowed = role => allowed.indexOf(role) > -1;




        return function(req, res, next) {
            //console.log(req.session.details.role);
            if (!isAllowed(req.session.details.role)){
                req.flash('error', 'You are Not allowed to access that page.');
                return res.redirect('/backend');
            }
            else next();
        }
    },

}
