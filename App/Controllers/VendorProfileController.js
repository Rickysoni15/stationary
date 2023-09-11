var Sys = require('../../Boot/Sys');
const moment = require('moment');
var bcrypt = require('bcryptjs');
var fs = require("fs");
var mongoose = require('mongoose');
const axios = require("axios");
var jwt = require('jsonwebtoken');
var request = require('request');

const nodemailer = require('nodemailer');
const { review_post } = require('./ProductController');

let defaultTransport = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com', // <= your smtp server here
    port: 587, // <= connection port
    // secure: true, // use SSL or not
    auth: {
        user: 'intrilogykira@gmail.com',
        pass: 'WLs8g7yk5GMd0mYV'
        // user: 'info@kiraintrilogy.com',
        // pass: 'TgpKcOMXkdUVYZjb'
    }
});

var jwtcofig = {
    'secret': 'KiraJwtAuth'
};

function create_Id() {
    var dt = new Date().getTime();
    var uuid = 'xxyxyxxyx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

module.exports = {

    // for front view
    registerVendor: async function (req, res) {
        // console.log("vendor register session ===>>>", req.session);
        console.log("vendor register===>>>", req.body);
        var successMessage = { status: 'success', message: "Vendor Registered Successfully", data: {} };
        var failedMessage = { status: 'fail', message: "Something went wrong", data: {} };
        try {
            let vendor = await Sys.App.Services.VendorProfileServices.getByData({ vendor_email: req.body.email, is_deleted: '0' });
            console.log("dhasdasd vendor", vendor);
            if (!vendor.length && !vendor.vendor_email) {
                if (!req.files) {
                    // failedMessage.message = 'Files Not Found!';
                    req.flash('error', 'Files Not Found!');
                    await req.session.save(async function (err) {
                        // session saved
                        console.log('session saved');
                        return res.redirect('/login_vendor');

                    });
                }

                // console.log("files ---->>>",req.files.panImage);
                var kycDocFile = [];

                let singleimage_p = req.files.kycImage;
                // console.log("Image", singleimage_p);
                var re = /(?:\.([^.]+))?$/;
                var ext6 = re.exec(singleimage_p.name)[1];
                let singleImage_P = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext6;
                let singleImg = '/kycDocs/' + singleImage_P;
                // Use the mv() method to place the file somewhere on your server
                await singleimage_p.mv('./public/kycDocs/' + singleImage_P, async function (err) {
                    if (err) {
                        req.flash('Error in vendor register', err);
                        await req.session.save(async function (err) {
                            // session saved
                            return res.redirect('/login_vendor');

                        });
                    }
                });
                kycDocFile.push({ path: '/kycDocs/' + singleImage_P, fileName: req.files.kycImage.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })

                var panFile = [];

                let singleimage = req.files.panImage;
                // console.log("Image", singleimage_p);
                var re = /(?:\.([^.]+))?$/;
                var ext6 = re.exec(singleimage.name)[1];
                let singleImage = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext6;
                let singleImgpan = '/panFile/' + singleImage;
                // Use the mv() method to place the file somewhere on your server
                await singleimage.mv('./public/panFile/' + singleImage, async function (err) {
                    if (err) {
                        req.flash('Error in vendor register', err);
                        await req.session.save(async function (err) {
                            // session saved
                            return res.redirect('/login_vendor');

                        });
                    }
                });
                panFile.push({ path: '/panFile/' + singleImage, fileName: req.files.panImage.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
                // let allowedType = [
                //     "image/png",
                //     "image/jpg",
                //     "image/jpeg"
                // ];


                // if (req.files.kycImage) {
                //     if (!allowedType.includes(req.files.kycImage.mimetype)) {
                //         failedMessage.message = "Only png, jpg and jpeg files are allowed."
                //         return res.send(failedMessage);
                //     }
                // }

                // let newPath1 = '';

                // if (req.files.kycImage) {
                //     let kycImage = req.files.kycImage;
                //     // console.log("kycImage ", kycImage)
                //     let fileName = create_Id();
                //     let path = './public/kycDocs/'
                //     let baseUrl = 'https://api.oemup.app/'
                //     newPath1 = 'public/kycDocs/'
                //     let extentionName = kycImage.mimetype.split('/')[1]

                //     //console.log("::::extentionName:::", extentionName);
                //     let tempNum = `${fileName}.${extentionName}`;
                //     //console.log("tempNum ", tempNum)

                //     await kycImage.mv(path + tempNum, function (err) {
                //         if (err) {
                //             failedMessage.message = 'FILE UPLOADED FAILED'
                //             return res.status(400).send(failedMessage)
                //         }
                //     });
                //     newPath1 = baseUrl + newPath1 + tempNum
                // }
                // console.log("vendor_company_gst",vendor_company_gst);
                // let obj = {
                //     // vendor_first_name: (req.body.firstName) ? req.body.firstName : '',
                //     // vendor_last_name: (req.body.lastName) ? req.body.lastName : '',
                //     vendor: req.session.details,
                //     vendor_company: req.body.companyName,
                //     vendor_email: (req.body.email) ? req.body.email : '',
                //     vendor_phone: (req.body.phone) ? req.body.phone : '',
                //     vendor_gst_no: (req.body.gst_No) ? req.body.gst_No : '',
                //     vendor_id: create_Id(),
                //     kyc_image: kycDocFile,
                //     is_gst: req.body.gstSwitch,
                //     success  : req.flash("success"),
                //     alredyEmail :req.flash('Email is alredy register.')
                //     // vendor_password: bcrypt.hashSync("123456", bcrypt.genSaltSync(8), null),
                // }
                req.flash('success', 'Vendor register success');


                //shiprocket start
                var token;
                var token_arr = [];
                //step 1: Genrate Token
                // setTimeout(() => {
                //     const options = {
                //         method: 'POST',
                //         url: `https://apiv2.shiprocket.in/v1/external/auth/login`,
                //         headers: {
                //             'Content-Type': 'application/json',
                //         },
                //         data: {
                //             "email": "amar@kiraintrilogy.com",
                //             "password": "kira@1234"
                //         }
                //     };
                //     // console.log("options", options);
                //     axios.request(options).then(function (response) {


                //         console.log("response.data  fjflfi ====>> ", response.data);
                //         req.session.shiprocket_token = response.data.token;
                //         console.log("req.session.shiprocket_token............", req.session.shiprocket_token);
                //         token = response.data.token;
                //         token_arr.push(response.data.token)
                //     }).catch(function (error) {
                //         console.error(error);
                //     });
                // }, 1000);

                // setTimeout(() => {

                //     let phNumber = req.body.phone;

                //     phNumber = parseInt(phNumber);

                //     // console.log("token ====>>>", token, token_arr);
                //     // console.log("req.session.shiprocket_token....666666666........", req.session.shiprocket_token);
                //     var bearer = 'Bearer ' + req.session.shiprocket_token;
                //     // console.log("req.session.shiprocket_token....bearer........", bearer);
                //     var options = {
                //         'method': 'POST',
                //         'url': 'https://apiv2.shiprocket.in/v1/external/settings/company/addpickup',
                //         'headers': {
                //             'Authorization': bearer,//'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjI4MjAyNzcsImlzcyI6Imh0dHBzOi8vYXBpdjIuc2hpcHJvY2tldC5pbi92MS9leHRlcm5hbC9hdXRoL2xvZ2luIiwiaWF0IjoxNjYwNzM5MzQwLCJleHAiOjE2NjE2MDMzNDAsIm5iZiI6MTY2MDczOTM0MCwianRpIjoiajRCUUtXak04VlJrS1RFTiJ9.wfNkYLWWd63mOMzJn45lWa6ewlCyy71eF5llbc5BH9E',
                //             'Content-Type': 'application/x-www-form-urlencoded'
                //         },
                //         // body:JSON.stringify({
                //         //     'pickup_location': req.body.district,
                //         //     'name': req.body.companyName,
                //         //     'email': req.body.email,
                //         //     'phone': '9777777779',
                //         //     'address': req.body.district + req.body.vendor_state + req.body.vendor_country + req.body.vendor_pin,
                //         //     'address_2': '',
                //         //     'city': req.body.district,
                //         //     'state': req.body.vendor_state,
                //         //     'country': req.body.vendor_country,
                //         //     'pin_code': req.body.vendor_pin
                //         // })

                //         form:{
                //             'pickup_location': req.body.companyName,
                //             'name': req.body.companyName,
                //             'email': req.body.email,
                //             'phone': phNumber,
                //             'address': req.body.vendor_address +' ,'+ req.body.district +' ,'+ req.body.vendor_pin +' ,'+ req.body.vendor_state +' ,'+ req.body.vendor_country,//req.body.district +' ,'+ req.body.vendor_state +' ,'+ req.body.vendor_country +' ,'+ req.body.vendor_pin,
                //             'address_2': '',
                //             'city': req.body.district,
                //             'state': req.body.vendor_state,
                //             'country': req.body.vendor_country,
                //             'pin_code': req.body.vendor_pin
                //         }
                //     };
                //     request(options, function (error, response) {
                //         if (error) throw new Error(error);
                //         console.log("shipaddress ===>>",response.body);
                //     });

                   
                // }, 3000);

                var state_code = req.body.gst_No.substring(0,2);

                var obj = {
                    App: req.session.details,
                    vendor: req.session.details,
                    vendor_company: req.body.companyName,
                    vendor_email: (req.body.email) ? req.body.email : '',
                    vendor_phone: (req.body.phone) ? req.body.phone : '',
                    vendor_gst_no: (req.body.gst_No) ? req.body.gst_No : '',
                    vendor_pan_no: req.body.vendor_pan,
                    vendor_Gstcode: state_code,
                    vendor_address: req.body.vendor_address,
                    pickup_address_lable : req.body.companyName,
                    pickup_address :{
                        'name': req.body.companyName,
                        'email': req.body.email,
                        'phone': req.body.phone,
                        'address': req.body.vendor_address +' ,'+ req.body.district +' ,'+ req.body.vendor_pin +' ,'+ req.body.vendor_state +' ,'+ req.body.vendor_country,//req.body.district +' ,'+ req.body.vendor_state +' ,'+ req.body.vendor_country +' ,'+ req.body.vendor_pin,
                        'city': req.body.district,
                        'state': req.body.vendor_state,
                        'country': req.body.vendor_country,
                        'pin_code': req.body.vendor_pin
                    },
                    vendor_id: create_Id(),
                    kyc_image: kycDocFile,
                    pan_image: panFile,
                    is_gst: req.body.gstSwitch,
                    account_id: create_UUID(),
                    vendor_password_string: req.body.password,

                };
        

                let vendorDetail = await Sys.App.Services.VendorProfileServices.addVendor(obj)
                successMessage.data = vendorDetail;

                // req.flash('error', 'Files Not Found!');
                await req.session.save(async function (err) {
                    // session saved
                    // console.log('session saved');
                    return res.redirect('/login_vendor');

                });
                // return res.redirect("/login_vendor")
            } else {
                // req.flash('success',"emali is alredy register")
                req.flash('success', 'Emali is alredy register');

                await req.session.save(async function (err) {
                    // session saved
                    // console.log('session saved');
                    return res.redirect('/login_vendor');

                });
                // return res.redirect("/login_vendor")


            }
        } catch (err) {
            console.log("registerVendor ", err)
            return res.status(400).send(failedMessage)
        }
    },

    loginPost_vendor: async function (req, res) {

        try {

            console.log("req.body.email->", req.body);


            let vendor = null;
            vendor = await Sys.App.Services.VendorProfileServices.getByData({ vendor_email: req.body.vendor_email, is_deleted: '0' });
            if (vendor == null || vendor.length == 0) {
                req.flash('error', 'No Such User Found');
                console.log("user not found =====>>> v2");
                await req.session.save(async function (err) {
                    // session saved
                    console.log('session saved');
                    return res.redirect('/login_vendor');

                });
            }
            if (vendor[0].vendorApproval == false || vendor[0].emailVerified == false) {
                req.flash('error', 'Email Not Verified');
                await req.session.save(async function (err) {
                    // session saved
                    console.log('session saved');
                    return res.redirect('/login_vendor');

                });


            }



            // console.log("vendor_password home ",vendor_password);
            var passwordTrue;
            console.log("vendor login check =====>>>", vendor[0]);

            // return false;

            if (bcrypt.compareSync(req.body.vendor_password, vendor[0].vendor_password)) {
                passwordTrue = true;
            } else {
                passwordTrue = false;
            }
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
                // if (vendor[0].role == 'custom') {
                //     req.session.details.access = await Sys.App.Services.VendorProfileServices.getByData({ userId: vendor[0].id });

                // }
                if (vendor[0].avatar) {
                    req.session.details.avatar = vendor[0].avatar;
                }
                console.log("welcome to Admin panel vvvvvv");
                req.flash('success', 'Welcome To Admin Panel');
                // req.session.save(function (err) {
                    // if (!err) {
                        //Data get lost here
                        // req.flash('success','Image Uploaded Successfully');
                        // return new Promise((resolve, reject) => {
                            // return res.redirect("/myDatabase");
                            return res.redirect('/vendor_dashboard');

                        // });
                    // }
                // });
            } else {
                req.flash('error', 'Invalid Credentials');
                await req.session.save(async function (err) {
                    // session saved
                    console.log('session saved');
                    return res.redirect('/login_vendor');

                });
            }

        } catch (e) {
            console.log("Error in postLogin :", e);
            return new Error(e);
        }
    },

    gstValidation: async function (req, res) {
        // console.log("dshdhsdhsd====>>", req.body);
        var successMessage = { status: 'success', message: "Valid GST No", data: {} };
        var failedMessage = { status: 'fail', message: "Something went wrong", data: {} };

        try {
            let gstNo = req.body.gstValue
            // console.log("gst",gstNo);
            // let gstDetail = await model.GstDetail.findOne({ account_id: req.body.account_id, gstNumber: gstNo, is_deleted: "0" }).lean()



            // if (gstDetail) {
            //     // console.log(":::if:::");
            //     let obj = {
            //         legalname: gstDetail.companyName,
            //         tradename: gstDetail.companyName,
            //         address: gstDetail.address,
            //         gstin: req.body.gstnumber,
            //     }
            //     successMessage.data = obj
            //     return res.send(successMessage)
            // } else {
            // console.log(":::else:::");
            const options = {
                method: 'GET',
                url: `https://gst-return-status.p.rapidapi.com/gstininfo/${gstNo}`,
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Host': 'gst-return-status.p.rapidapi.com',
                    'X-RapidAPI-Key': '25004ba9damsh70488a065d90d54p16dc0fjsn06d44043fc02'
                }
            };
            // console.log("options", options);
            axios.request(options).then(function (response) {
                // console.log("response.data ===========", response.data);
                if (response.data.data && response.data.data.details) {
                    let obj = {

                        legalname: response.data.data.details.legalname,
                        tradename: response.data.data.details.tradename,
                        address: response.data.data.details.principalplace,
                        gstin: req.body.gstValue,
                        pincode: response.data.data.details.pincode,
                        panNumber: response.data.data.details.pan,
                    }
                    // console.log("object",obj);
                    successMessage.data = obj
                } else {
                    failedMessage.message = "Please enter valid Gst number."
                    failedMessage.data = failedMessage.message

                    //    console.log("response.data.errorname",failedMessage.data);
                    return res.send(failedMessage)
                }

                return res.send(successMessage)
            }).catch(function (error) {
                console.error(error);
                // console.log("successMessage",failedMessage);

                return res.send(failedMessage)

            });
            // }

        } catch (error) {
            console.log(":::getGstDetails:::", error);
            return res.send(failedMessage)
        }
    },

    forgotPost_user: async function (req, res) {

        // console.log("user login data", req.body);

        try {

            console.log("forgotPost_user- vendor>", req.body);

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success")
            };
            let vendor = null;
            vendor = await Sys.App.Services.VendorProfileServices.getSingleVendorData({ vendor_email: req.body.email, is_deleted: '0' });
            if (vendor == null || vendor.length == 0) {
                console.log("vendor not found =====>>>");

                req.flash('error', 'No Such vendor Found');

                // await req.session.save( async function(err) {
                //   // session saved
                //   console.log('session saved');
                return res.redirect('/forgot_password');

                // });

                // await req.session.save( async function(err) {
                //   // session saved
                //   console.log('session saved');

                // });
            }

            if (vendor) {
                if (vendor.is_deleted == "1") {
                    req.flash('error', 'Invalid Credentials');
                    return res.redirect('/login_vendor');
                }
            }

            if (vendor) {

                // console.log(":::vendorDetail_gmail:::",vendorDetail.vendor_email)

                let vendorid = vendor._id
                let emailId = vendor.vendor_email


                console.log("email id --->>", vendorid);

                // await model.User.findOneAndUpdate({_id:req.body.userId, is_deleted:"0"},{userApproval:true}, {new:true}).lean() // vendor query here
                var length = 6,
                    charset = "012345678901234567890123456789",
                    otp = "";
                for (var i = 0, n = charset.length; i < length; ++i) {
                    otp += charset.charAt(Math.floor(Math.random() * n));
                }

                await Sys.App.Services.VendorProfileServices.updateVendorData({ _id: vendorid }, {
                    otp: otp,
                });

                // console.log("checkvendor --- >>", checkvendor);


                // let baseUrl = req.headers.host + '/backend' // change url here
                // let uniqueId =create_UUID()
                // code for registration success message send to user email
                let url = `http://192.168.1.45:9001/vendor_verify_otp/${vendorid}/${otp}`

                console.log("email url === >>>", url);

                var mailOptions = {
                    from: "intrilogykira@gmail.com",//config.smtp_sender_mail_id,
                    // to: 'rahoul@kiraintrilogy.com',
                    to: req.body.email,//user.email, //emailId, // register user's email
                    subject: 'Approved Successfully',
                    // text: `${passwordText}  ${env.BASE_URL}forgotpassword/${token}`
                    html: '<html><body style="text-align: center; color:#000;background-color: #7f87ab;margin: 0 auto;font-family: Arial, Helvetica, sans-serif"><div style="position: relative;"><div style="position: relative; height: 250px; background-color: #7f87ab;"><div style="padding: 70px 0;font-size: 2vw;color: #fff; text-align: center;">OEMOne</div></div><div style="background-color: #fff;width: 500px;margin: 0 auto;top: -75px;margin-bottom: 30px;position: relative;padding: 25px;z-index: 1"><div style="font-size: 24px;margin-bottom: 20px; text-align: center;">Greetings of the day</div><div style="font-size: 14px; text-align: left; line-height: 20px; margin: 20px 0;"><b></b><br/><br/>Please use the verification OTP. <br/><div style ="color:#000; font-weight:600"> Your Mail Id : ' + emailId + '</div><div style ="color:#000; font-weight:600"> OTP : ' + otp + '</div><div  style ="color:#000; font-weight:600"></div><br/>Please click the button and verify your OTP.><br/><a style="text-decoration: none;" href="' + url + '"><div style="padding: 10px 20px;background-color: #7f87ab;color: #fff;width: 100px;font-size: 17px;text-align: center;">Confirm</div></a> </div><div style="text-align: left;">Thank you</div><div style="text-align: left;margin-bottom: 10px;">Team OEMOne</div></div><div><div style="font-size: 12px;text-align: center; position: relative; top: -75px;">Email sent from <a href="http://www.oemone.shop/" target="_blank" title="Original Equipement Manufacturer | OEMup">http://www.oemone.shop/</a></div></div></div></body></html>'
                };
                // let flag = false;
                req.flash('success', 'Please Check Your Mail.');
                // defaultTransport.sendMail(mailOptions, function (err) {
                //     if (!err) {
                //         // req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                //         console.log("senddd mail",err);
                //         // defaultTransport.close();
                //         // flag = true;
                //         // req.flash('success', 'Please Check Your Mail.');
                //         // // await req.session.save( async function(err) {
                //         //   // session saved
                //         //   console.log('session saved');
                //         return res.redirect('/login_vendor');
                //         // // });
                //     } else {
                //         console.log(err);
                //         req.flash('error', 'Error sending mail,please try again After some time.');
                //         return res.redirect('/forgot_password');
                //     }
                // });

                defaultTransport.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        defaultTransport.close();                   
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });     


                // var mailOptions = {
                // 	from: "intrilogykira@gmail.com" ,//config.smtp_sender_mail_id,
                // 	// to: 'rahoul@kiraintrilogy.com',
                // 	to:'rickysoni27@gmail.com', //emailId, // register user's email
                // 	subject: 'Approved Successfully',
                // 	// text: `${passwordText}  ${env.BASE_URL}forgotpassword/${token}`
                // 	html: '<html><body style="text-align: center;background-color: #f5f5f5;margin: 0 auto;font-family: Arial, Helvetica, sans-serif"><div style="position: relative;"><div style="position: relative; height: 250px; background-color: #9b6e41;"><div style="padding: 70px 0;font-size: 2vw;color: #fff; text-align: center;">OEMup &uarr;</div></div><div style="background-color: #fff;width: 500px;margin: 0 auto;top: -75px;margin-bottom: 30px;position: relative;padding: 25px;z-index: 1"><div style="font-size: 24px;margin-bottom: 20px; text-align: center;">Greetings of the day</div><div style="font-size: 14px; text-align: left; line-height: 20px; margin: 20px 0;"><b>Congratulations,</b><br/><br/>You are one step ahead to access the OEMup software, please click the link below and confirm your account. <br/><br/> <a style="text-decoration: none;" href="' + url +  '"><div style="padding: 10px 20px;background-color: #9b6e41;color: #fff;width: 100px;font-size: 17px;text-align: center;">Confirm</div></a> </div><div style="text-align: left;">Thank you</div><div style="text-align: left;margin-bottom: 10px;">Team OEMup</div></div><div><div style="font-size: 12px;text-align: center; position: relative; top: -75px;">Email sent from <a href="http://www.oemup.app/" target="_blank" title="Original Equipement Manufacturer | OEMup">http://www.oemup.app/</a></div></div></div></body></html>'
                // };

                // transporter.sendMail(mailOptions, function (error, info) {
                // 	if (error) {
                // 		console.log("===================");
                // 		console.log("User Email Error", error);
                // 		console.log("===================");
                // 		failedMessage.message = "Error in sending email";
                // 		//  res.send(failedMessage);
                // 		console.log(error,"error");
                // 	}
                // 	else {
                // 		successMessage.message = "Email sent successfully";
                // 		//  res.send(successMessage);
                // 		console.log('Email sent: ' );
                // 	}
                // });
                // console.log("vendorApprovaldata======>>>>",vendorApprovaldata);
                // return res.send(vendorApprovaldata)
                // console.log("Email sent successfully");
                // successMessage.message = "Email sent successfully";
                // return res.send({ vendorDetail })

            }


            // console.log("vendor_password home ",vendor_password);
            //   var passwordTrue;
            // console.log("user success =====>>>", user);
            // console.log("user success pass =====>>>", user.password);

            //   if (bcrypt.compareSync(req.body.user_password, user.password)) {
            //     passwordTrue = true;
            //   } else {
            //     passwordTrue = false;
            //   }
            //   if (passwordTrue == true) {
            // console.log("Users-=======>", Sys.App.Services.UserServices);
            // let User = await Sys.App.Services.UserServices.getByData({email:req.body.email});

            // set jwt token

            // console.log("user role =====>>>", user.role);

            // var token = jwt.sign({ id: user._id }, jwtcofig.secret, {
            //   expiresIn: 60  60  24 // expires in 24 hours
            // });
            // console.log("user token ==>", token);
            //console.log("Token",token);
            // User Authenticate Success
            // req.session.login = true;
            // req.session.details = {
            //   firstname: user.firstname,
            //   lastname:user.lastname,
            //   id: user._id,
            //   // name: user.user_company,
            //   jwt_token: token,
            //   // avatar: 'user.png',
            //   is_admin: 'yes',
            //   role: user.role,
            //   avatar: user.avatar_path
            //   // chips: vendor[0].chips,
            // };

            // console.log("homecontrolller session details == >", req.session.details);
            // if (user.role == 'custom') {
            //   req.session.details.access = await Sys.App.Services.CustomerServices.getByData({ userId: vendor[0].id });

            // }
            // if (user.avatar) {
            //   req.session.details.avatar = user.avatar;
            // }
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success")
            };
            // console.log("welcome to Home");

            // req.flash('success', 'Please Check Your Mail.');
            // await req.session.save( async function(err) {
            //   // session saved
            //   console.log('session saved');
            //   return res.redirect('/forgot');
            // });
            //   } else {
            //     req.flash('error', 'Invalid Credentials');

            // var obj = {
            //   App: req.session.details,
            //   // Agent: req.session.details,
            //   error: req.flash("error"),
            //   success: req.flash("success"),
            //   role: 'user',
            //   // email_Alredy: req.flash("email_Alredy"),

            // };

            // console.log("Invalid login");
            // req.flash('error', 'Invalid Credential');
            // return res.redirect('/user_login');
            //   }

        } catch (e) {
            console.log("Error in postLogin :", e);
            return new Error(e);
        }
    },

    forgot_password: async function (req, res) {

        console.log("req.body ---------->>>>", req.body);
        try {
            let user = await Sys.App.Services.VendorProfileServices.getSingleVendorData({ vendor_email: req.body.vendor_email, is_deleted: '0' });
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                user: user
            };
            return res.render('frontend/vendor_forgot_password', data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    forgot_otp: async function (req, res) {
        try {
            let vendor = await Sys.App.Services.VendorProfileServices.getSingleVendorData({ vendor_email: req.body.email, is_deleted: '0' });

            console.log("vendor frogot otp --->>", vendor);
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                vendor: vendor
            };
            return res.render('frontend/vendor_forgot_otp', data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    set_password: async function (req, res) {
        try {
            let user = await Sys.App.Services.VendorProfileServices.getSingleVendorData({ vendor_email: req.body.email, is_deleted: '0' });
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                user: user
            };
            return res.render('frontend/set_password', data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    verify_otp: async function (req, res) {

        // console.log("user login data", req.body);

        try {

            console.log("req.body.email->", req.params);


            let vendor = null;
            vendor = await Sys.App.Services.VendorProfileServices.getSingleVendorData({ _id: req.params.id, is_deleted: '0' });
            if (vendor == null || vendor.length == 0) {
                req.flash('error', 'No Such vendor Found');
                console.log("vendor not found =====>>>");
                await req.session.save(async function (err) {
                    // session saved
                    console.log('session saved');
                    return res.redirect('/login_vendor');

                });
            }

            if (vendor) {
                if (vendor.is_deleted == "1") {
                    req.flash('error', 'Invalid Credentials');
                    return res.redirect('/login_vendor');
                }
            }

            await Sys.App.Services.VendorProfileServices.updateVendorData({ otp: req.params.otp });


            req.flash('success', 'Please Enter Your OTP.');

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                vendor: vendor,
            };

            return res.render('frontend/vendor_forgot_otp', data);
            //   } else {
            //     req.flash('error', 'Invalid Credentials');

            // var obj = {
            //   App: req.session.details,
            //   // Agent: req.session.details,
            //   error: req.flash("error"),
            //   success: req.flash("success"),
            //   role: 'user',
            //   // email_Alredy: req.flash("email_Alredy"),

            // };

            // console.log("Invalid login");
            // req.flash('error', 'Invalid Credential');
            // return res.redirect('/user_login');
            //   }

        } catch (e) {
            console.log("Error in postLogin :", e);
            return new Error(e);
        }
    },

    verify_otp_post: async function (req, res) {
        console.log("user body verify_otp_post in usercontroller", req.body);
        try {
            // res.send(req.files.image.name); return;
            let vendor = await Sys.App.Services.VendorProfileServices.getSingleVendorData({ vendor_email: req.body.email, is_deleted: '0' });
            if (vendor && vendor.length > 0) {
                req.flash('error', 'vendor Already Present');
                return res.redirect('/login_vendor');
            } else {
                // if (req.files) {
                //   let image = req.files.image;
                //
                //   // Use the mv() method to place the file somewhere on your server
                //   image.mv('/profile/'+req.files.image.name, function(err) {
                //     if (err){
                //       req.flash('error', 'User Already Present');
                //       return res.redirect('/');
                //     }
                //
                //     // res.send('File uploaded!');
                //   });
                // }

                // var obj = {
                //   firstname: req.body.firstname,
                //   lastname: req.body.lastname,
                //   email: req.body.email,
                //   mobile: req.body.phone,
                //   role: req.body.role,
                //   user_gst_no: req.body.gst_No,
                //   // status: req.body.status,
                //   password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
                //   // image: req.files.image.name
                //   error: req.flash("error"),
                //   success: req.flash("success"),
                // }

                console.log("user", vendor.otp);
                console.log("user.otp == req.body.otp", vendor.otp, req.body.otp);
                console.log("user.otp == req.body.otp", vendor.otp == req.body.otp);

                if (vendor.otp == req.body.otp) {
                    console.log("Password Set Successfully");
                    req.flash('success', 'OTP Verified Successfully, Please Set Your Password');
                    var data = {
                        App: req.session.details,
                        error: req.flash("error"),
                        success: req.flash("success"),
                        vendor: vendor
                    };
                    return res.render('frontend/vendor_set_password', data);

                } else {
                    req.flash('error', 'OTP is invalid, Please try again later');
                    await req.session.save(async function (err) {
                        // session saved
                        //   console.log('session saved');
                        return res.redirect('/user_login');
                    });
                }
            }
            // req.flash('success', 'Player Registered successfully');
            // res.redirect('/');
        } catch (e) {
            req.flash('success', 'Invalid Credential !');
            console.log("Error", e);
            res.redirect('/user_login');
        }
    },

    set_password_post: async function (req, res) {
        console.log("user body data in usercontroller", req.body);
        try {
            // res.send(req.files.image.name); return;
            let vendor = await Sys.App.Services.VendorProfileServices.getSingleVendorData({ vendor_email: req.body.email, is_deleted: '0' });
            if (vendor && vendor.length > 0) {
                req.flash('error', 'vendor Already Present');
                res.redirect('/login_vendor');
                return;
            } else {
                // if (req.files) {
                //   let image = req.files.image;
                //
                //   // Use the mv() method to place the file somewhere on your server
                //   image.mv('/profile/'+req.files.image.name, function(err) {
                //     if (err){
                //       req.flash('error', 'User Already Present');
                //       return res.redirect('/');
                //     }
                //
                //     // res.send('File uploaded!');
                //   });
                // }

                // var obj = {
                //   firstname: req.body.firstname,
                //   lastname: req.body.lastname,
                //   email: req.body.email,
                //   mobile: req.body.phone,
                //   role: req.body.role,
                //   user_gst_no: req.body.gst_No,
                //   // status: req.body.status,
                //   password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
                //   // image: req.files.image.name
                //   error: req.flash("error"),
                //   success: req.flash("success"),
                // }

                console.log(vendor._id);
                // console.log(user.id);
                let userDetail = await Sys.App.Services.VendorProfileServices.updateVendorData({
                    _id: vendor._id
                }, {
                    $set: {
                        vendor_password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
                    }
                })
                console.log("Password Set Successfully");
                req.flash('success', 'Password Set Successfully');
                await req.session.save(async function (err) {
                    // session saved
                    console.log('session saved');
                    res.redirect('/login_vendor');
                });
            }
            // req.flash('success', 'Player Registered successfully');
            // res.redirect('/');
        } catch (e) {
            req.flash('success', 'User create faild');
            console.log("Error", e);
            res.redirect('/login_vendor');
        }
    },

}

function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function objectKeysToLowerCase(input) {
    if (typeof input !== 'object') return input;
    if (Array.isArray(input)) return input.map(objectKeysToLowerCase);
    return Object.keys(input).reduce(function (newObj, key) {
        let val = input[key];
        let newVal = (typeof val === 'object') && val !== null ? objectKeysToLowerCase(val) : val;
        newObj[key.toLowerCase()] = newVal;
        return newObj;
    }, {});
}