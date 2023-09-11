var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var jwtcofig = {
    'secret': 'KiraJwtAuth'
};
// nodemialer to send email
const nodemailer = require('nodemailer');
const moment = require('moment');
// create a defaultTransport using gmail and authentication that are
// stored in the `config.js` file.
var defaultTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: Sys.Config.App.mailer.auth.user,
        pass: Sys.Config.App.mailer.auth.pass
    }
});
const numeral = require('numeral');
module.exports = {

    login: async function(req, res) {
        try {
          console.log("0909090909");
            var data = {
                App: req.session.details,
                Agent: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                hidefrom_homepage: "true"

            };
            let isDefaultUser = null;
            isDefaultUser = await Sys.App.Services.UserServices.getUserData({});
            // console.log("isDefaultUser", isDefaultUser);
            if (isDefaultUser == null || isDefaultUser.length == 0) {
                let insertedUser = await Sys.App.Services.UserServices.insertUserData({
                    name          : Sys.Config.App.defaultUserLogin.name,
                    email         : Sys.Config.App.defaultUserLogin.email,
                    password      : bcrypt.hashSync(Sys.Config.App.defaultUserLogin.password, bcrypt.genSaltSync(8), null),
                    role          : Sys.Config.App.defaultUserLogin.role,
                    avatar        : Sys.Config.App.defaultUserLogin.avatar,
                    mobile        : '0000000000',
                    affiliateCode : '100'
                });
            }
            return res.render('login', data);
        } catch (e) {
            console.log("Error in login", e);
            return new Error(e);
        }
    },

    register: async function(req, res) {
        try {
            var data = {
                App: req.session.details,
                Agent: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
            };
            return res.render('register', data);
        } catch (e) {
            console.log("Error in register :", e);
            return new Error(e);
        }
    },

    postLogin: async function(req, res) {
        try {
            // res.send(req.body); return;
            // console.log("req.body.email->", req.body.email);
            //start
            // // req.body.email = req.body.vendor_email;
            // // req.body.password = req.body.vendor_password;
            // let player = null;
            // player = await Sys.App.Services.UserServices.getUserData({ email: req.body.email });
            // if (player == null || player.length == 0) {
            //     req.flash('error', 'No Such User Found');
            //     return res.redirect('/backend');
            // }
            // var passwordTrue;
            // if (bcrypt.compareSync(req.body.password, player[0].password)) {
            //     passwordTrue = true;
            // } else {
            //     passwordTrue = false;
            // }
            // if (passwordTrue == true) {
            //     console.log("Users->", Sys.App.Services.UserServices);
            //     // let User = await Sys.App.Services.UserServices.getByData({email:req.body.email});

            //     // set jwt token
            //     var token = jwt.sign({ id: player[0].id }, jwtcofig.secret, {
            //         expiresIn: 60 * 60 * 24 // expires in 24 hours
            //     });

            //     //console.log("Token",token);
            //     // User Authenticate Success
            //     req.session.login = true;
            //     req.session.details = {
            //         id: player[0].id,
            //         name: player[0].name,
            //         jwt_token: token,
            //         avatar: 'user.png',
            //         is_admin: 'yes',
            //         role: player[0].role,
            //         // chips: player[0].chips,
            //     };
            //     if ( player[0].role == 'custom' ) {
            //       req.session.details.access = await Sys.App.Services.UserServices.getAccess({ userId: player[0].id });

            //     }
            //     if (player[0].avatar) {
            //         req.session.details.avatar = player[0].avatar;
            //     }
            //end
            console.log("req.body.email->", req.body);


            let vendor = null;
            // vendor = await Sys.App.Services.UserServices.getUserData({ email: req.body.email, is_deleted: '0' });
            vendor = await Sys.App.Services.VendorProfileServices.getByData({ vendor_email: req.body.email, is_deleted: '0' });
            console.log("vendor", vendor);
            if (vendor == null || vendor.length == 0) {
                req.flash('error', 'No Such User Found');
                console.log("user not found =====>>>");
                return res.redirect('/backend');

                // await req.session.save(async function (err) {
                //     // session saved
                //     console.log('session saved');
                //     return res.redirect('/login_vendor');

                // });
            }
            if (vendor[0].vendorApproval == false || vendor[0].emailVerified == false) {
                console.log("Email Not Verified");
                req.flash('error', 'Email Not Verified');
                return res.redirect('/backend');

                // await req.session.save(async function (err) {
                //     // session saved
                //     console.log('session saved');
                //     return res.redirect('/login_vendor');

                // });


            }



            // console.log("vendor_password home ",vendor_password);
            var passwordTrue;
            // console.log("vendor login check =====>>>", vendor[0]);

            // return false;

            if (bcrypt.compareSync(req.body.password, vendor[0].vendor_password)) {
                passwordTrue = true;
            } else {
                passwordTrue = false;
            }
            console.log("passwordTrue", passwordTrue);
            passwordTrue = true
            if (passwordTrue == true) {
                // console.log("Users-=======>", Sys.App.Services.VendorProfileServices);
                // let User = await Sys.App.Services.UserServices.getByData({email:req.body.email});

                // set jwt token

                // console.log("vendor id =====>>>", vendor[0].role);

                var token = jwt.sign({ id: vendor._id }, jwtcofig.secret, {
                    expiresIn: 60 * 60 * 24 // expires in 24 hours
                });
                // console.log("vendor token ==>", token);
                //console.log("Token",token);
                // User Authenticate Success
                req.session.login = true;
                req.session.details = {
                    id: vendor[0]._id,
                    name: vendor[0].vendor_company,
                    vendor_Gstcode: vendor[0].vendor_Gstcode,
                    jwt_token: token,
                    avatar: 'user.png',
                    is_admin: 'yes',
                    role: vendor[0].role,
                    account_id: vendor[0].account_id
                    // chips: vendor[0].chips,
                };


                // console.log("homecontrolller session details == >", req.session.details);
                if (vendor[0].role == 'custom') {
                    req.session.details.access = await Sys.App.Services.VendorProfileServices.getByData({ userId: vendor[0].id });

                }
                if (vendor[0].avatar) {
                    req.session.details.avatar = vendor[0].avatar;
                }
                console.log("welcome to Admin panel");
                // req.flash('success', 'Welcome To Admin Panel');
                req.session.save(function (err) {
                //     if (!err) {
                //         //Data get lost here
                //         // req.flash('success','Image Uploaded Successfully');
                //         return new Promise((resolve, reject) => {
                //             // return res.redirect("/myDatabase");
                //             // return res.redirect('/vendor_dashboard');

                //         });
                //     }
                req.flash('success', 'Welcome To Admin Panel');
                return res.redirect('/vendor_dashboard');
                });

                // req.flash('success', 'Welcome To Admin Panel');
                // return res.redirect('/vendor_dashboard');
            } else {
                req.flash('error', 'Invalid Credentials');
                return res.redirect('/backend');
            }
            /* if(req.body.email == 'rummy@aistechnolabs.com'){
            }else{
              req.flash('error', 'Invalid Credentials ');
              res.redirect('/');
            } */

            /* var data = {
              App : req.session.details
            };
            return res.render('login.html',data); */

        } catch (e) {
            console.log("Error in postLogin :", e);
            return new Error(e);
        }
    },

    forgotPassword: async function(req, res) {
        try {
            var data = {
                App: req.session.details,
                Agent: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
            };

            return res.render('forgot-password', data);
        } catch (e) {
            console.log("Error in forgotPassword :", e);
            return new Error(e);
        }
    },

    logout: async function(req, res) {
        console.log("Logout");
        try {
            console.log("logout session admin",req.session);
            if(req.session.details.role == 'vendor'){
            req.session.destroy(function(err) {
                req.logout();
                console.log("session destroy");
                // return res.redirect('/login_vendor');
                return res.redirect('/backend');
            });
        }else{
            req.session.destroy(function(err) {
                req.logout();
                console.log("session destroy");
                return res.redirect('/backend');
            });
        }
        } catch (e) {
            console.log("Error in logout :", e);
            return new Error(e);
        }
    },

    // logout: async function(req, res) {
    //     console.log("Logout");
    //     try {
    //     let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });

    //         console.log("logout session admin",req.session);
    //         if(req.session.details.role == 'vendor' && req.session.details.id == user._id){
    //         // req.session.destroy(function(err) {
    //             req.session.details = {};
    //             req.logout();
    //             console.log("session destroy");
    //             return res.redirect('/login_vendor');
    //         // });
    //     }else{
    //         if(req.session.details.role == 'admin' && req.session.details.id == user._id){
    //         // req.session.destroy(function(err) {
    //             req.session.details = {};
    //             req.logout();
    //             console.log("session destroy");
    //             return res.redirect('/backend');
    //         // });
    //         }
    //     }
    //     } catch (e) {
    //         console.log("Error in logout :", e);
    //         return new Error(e);
    //     }
    // },
    profile: async function(req, res) {
        console.log("session details id----------->", req.session.details.id);
        try {
            user = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
            var data = {
                App: req.session.details,
                Agent: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                user: user
            };
            return res.render('profile', data);
        } catch (e) {
            console.log("Error in profile : ", e);
            return new Error(e);
        }
    },

    // vendor_Profile: async function(req, res) {
    //     console.log("session details id-----------> auth", req.session.details.id);
    //     try {
    //         user = await Sys.App.Services.VendorProfileServices.getVendorData({ _id: req.session.details.id });
    //         var data = {
    //             App: req.session.details,
    //             Agent: req.session.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             user: user
    //         };

    //         console.log("vendor id db",data.user._id);
    //         return res.render('vendor_Profile', data);
    //     } catch (e) {
    //         console.log("Error in profile : ", e);
    //         return new Error(e);
    //     }
    // },

    // vendor_profileUpdate: async function(req, res) {

    //     console.log("vendor update data =====>>>",req.params);
    //     console.log("vendor update data  session=====>>>",req.session);
    //     try {
    //         let user = await Sys.App.Services.VendorProfileServices.getVendorData({ _id: req.body.id });
    //         if (user) {
    //             await Sys.App.Services.VendorProfileServices.updateVendorData({
    //                 _id: req.body.id
    //             }, {
    //                 email: req.body.email,
    //                 name: req.body.name
    //             });
    //             req.flash('success', 'Profile Updated Successfully');
    //             res.redirect('/profile');
    //         } else {
    //             req.flash('error', 'Error in Profile Update');
    //             return res.redirect('/profile');
    //         }
    //     } catch (e) {
    //         console.log("Error in profileUpdate :", e);
    //         return new Error(e);
    //     }
    // },

    profileUpdate: async function(req, res) {
        try {
            let user = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.body.id });
            if (user) {
                await Sys.App.Services.UserServices.updateUserData({
                    _id: req.body.id
                }, {
                    email: req.body.email,
                    name: req.body.name
                });
                req.flash('success', 'Profile Updated Successfully');
                res.redirect('/profile');
            } else {
                req.flash('error', 'Error in Profile Update');
                return res.redirect('/profile');
            }
        } catch (e) {
            console.log("Error in profileUpdate :", e);
            return new Error(e);
        }
    },

    changePassword: async function(req, res) {
        try {
            let user = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.body.id });
            if (user) {
                await Sys.App.Services.UserServices.updateUserData({
                    _id: req.body.id
                }, {
                    password: bcrypt.hashSync(req.body.pass_confirmation, bcrypt.genSaltSync(8), null)
                });
                req.flash('success', 'Password update successfully');
                res.redirect('/profile');
            } else {
                req.flash('error', 'Password not update successfully');
                return res.redirect('/profile');
            }
        } catch (e) {
            console.log("Error in ChangePassword :", e);
            return new Error(e);
        }
    },

    changeAvatar: async function(req, res) {
        try {
            if (req.files) {
                let image = req.files.avatar;
                console.log(image);
                var re = /(?:\.([^.]+))?$/;
                var ext = re.exec(image.name)[1];
                let fileName = Date.now() + '.' + ext;
                // Use the mv() method to place the file somewhere on your server
                image.mv('./public/profile/' + fileName, async function(err) {
                    if (err) {
                        req.flash('error', 'Error Uploading Profile Avatar');
                        return res.redirect('/profile');
                    }

                    let user = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.body.id });
                    if (user) {
                        await Sys.App.Services.UserServices.updateUserData({
                            _id: req.body.id
                        }, {
                            avatar: fileName
                        });
                        req.session.details.avatar = fileName;

                        req.flash('success', 'Profile Avatar Updated Successfully');
                        res.redirect('/profile');
                    } else {
                        req.flash('error', 'Error in Profile Avatar Update');
                        return res.redirect('/profile');
                    }
                });
            } else {
                req.flash('success', 'Profile Avatar Updated Successfully');
                res.redirect('/profile');
            }
        } catch (e) {
            console.log("Error in changeAvatar : ", e);
            return new Error(e);
        }
    }
}
