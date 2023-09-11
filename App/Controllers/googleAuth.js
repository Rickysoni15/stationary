var Sys = require('../../Boot/Sys');

var GoogleStrategy = require('passport-google-oauth20').Strategy;
// const user = require('../Models/customer');
const clientId = "605389685445-8ukin34p6sjn2s47f62b2lesehbl88ql.apps.googleusercontent.com";
const clientSecreT = "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";
const redirect_URL = "http://localhost:9009/auth/google/callback";

module.exports = async function (passport) {
    passport.use(new GoogleStrategy({
        clientID: clientId,
        clientSecret: clientSecreT,
        callbackURL: redirect_URL
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile.emails[0].value);
            console.log("profile",profile);
        // find if a user exist with this email or not
        await Sys.App.Services.CustomerServices.getSingleUserData({ email: profile.emails[0].value }).then(async(data) => {
            if (data) {
                // user exists
                // update data
                // I am skipping that part here, may Update Later
                console.log("already google user");

                return done(null, data);
            } else {
                // create a user
                var obj = {
                    firstname: profile.displayName,
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    password: null,
                    provider: 'google',
                    status: "active",
                  }
                 await Sys.App.Services.CustomerServices.insertUserData(obj).then(async(data) => {
                    if(data){
                        console.log("crewsate user google");
                        return done(null, data);
                    }
                });

            }
        });
    }
    ));
    passport.serializeUser(function (user, done) {
        console.log("searialize googleauth");
        done(null, user.id);
    });

    passport.deserializeUser(async function (id, done) {
        console.log("de-searialize googleauth");
        await Sys.App.Services.CustomerServices.getSingleUserData(id, function (err, user) {
            console.log("dessss",user);
            done(err, user);
        });
    });

}