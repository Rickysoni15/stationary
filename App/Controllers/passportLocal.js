// const user = require('../Models/customer');
const bcryptjs = require('bcryptjs');
var localStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
    passport.use(new localStrategy({ usernameField: 'email' }, async (email, password, done) => {
        await Sys.App.Services.CustomerServices.getSingleUserData({ email: email }, (err, data) => {
            if (err) throw err;
            if (!data) {
                console.log("User Doesn't Exist !");

                return done(null, false, { message: "User Doesn't Exist !" });
            }
            bcryptjs.compare(password, data.password, (err, match) => {
                if (err) {
                    console.log("google already user err !",err);
                    return done(null, false);
                }
                if (!match) {
                    console.log("Password Doesn't match !");
                    return done(null, false, { message: "Password Doesn't match !" });
                }
                if (match) {
                    console.log("Password  match !");
                    return done(null, data);
                }
            })
            console.log("data call passportlocal",data);
        })
    }));

    passport.serializeUser(function (user, done) {
        console.log("searialize passportlocal");
        done(null, user.id);
    });

    passport.deserializeUser(async function (id, done) {
        console.log("de-searialize passportlocal",id);

        await Sys.App.Services.CustomerServices.getSingleUserData(id, function (err, user) {
            console.log("dessss",user);
            done(err, user);
        });
    });

}