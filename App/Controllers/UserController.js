var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var request = require("request");
var jwtcofig = {
  'secret': 'KiraJwtAuth'
};
var mongoose = require('mongoose');

const nodemailer = require('nodemailer');

let defaultTransport = nodemailer.createTransport({
  host: 'smtp-relay.sendinblue.com', // <= your smtp server here
  port: 587, // <= connection port
  // secure: true, // use SSL or not
  auth: {
    user: 'intrilogykira@gmail.com',
    pass: 'WLs8g7yk5GMd0mYV'
  }
});

module.exports = {
  users: async function (req, res) {
    try {
      var data = {
        App: req.session.details,
        error: req.flash("error"),
        success: req.flash("success"),
        customer: 'active'
      };


      console.log("data user ==>", data);



      return res.render('backend/user/user', data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  getUser: async function (req, res) {
    // res.send(req.query.start); return false;
    try {
      let start = parseInt(req.query.start);
      let length = parseInt(req.query.length);
      let search = req.query.search.value;

      let query = {};
      if (search != '') {
        let capital = search;
        // query = {
        // or: [
        // {'username': { 'like': '%'+search+'%' }},
        // {'username': { 'like': '%'+capital+'%' }}
        //  ]
        // };
        query = { email: { $regex: '.*' + search + '.*' }, is_deleted: "0" };
      } else {
        query = { is_deleted: "0" };
      }
      let columns = [
        'id',
        'username',
        'firstname',
        'lastname',
        'email',
        'status',
      ]

      let playersCount = await Sys.App.Services.CustomerServices.getUserCount(query);
      //let playersCount = playersC.length;
      let data = await Sys.App.Services.CustomerServices.getUserDatatable(query, length, start);

      var obj = {
        'draw': req.query.draw,
        'recordsTotal': playersCount,
        'recordsFiltered': playersCount,
        'data': data
      };
      res.send(obj);
    } catch (e) {
      console.log("Error", e);
    }
  },

  addUser: async function (req, res) {
    try {
      var data = {
        App: req.session.details, Agent: req.session.details,
        error: req.flash("error"),
        success: req.flash("success"),
        userActive: 'active'
      };
      return res.render('backend/user/add', data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  register: async function (req, res) {
    try {
      var data = {
        App: req.session.details, Agent: req.session.details,
        error: req.flash("error"),
        success: req.flash("success"),
        userActive: 'active'
      };
      console.log("::req.session.details:::", req.session.details);
      return res.render('frontend/register', data);
    } catch (error) {
      console.log(":::error in register:::", error);
    }
  },

  addUserPostData: async function (req, res) {
    console.log("user body data in usercontroller", req.body);
    try {
      // res.send(req.files.image.name); return;
      let userInfo = await Sys.App.Services.CustomerServices.getUserData({ email: req.body.email });
      console.log(":::userInfo:::",userInfo);
      if (userInfo && userInfo.length > 0) {
        console.log(":::user is already present");
        req.flash('error', 'User Already Present');
        res.redirect('/login');
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


        var obj = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          mobile: req.body.telephone,

          password_string: req.body.password,
          isSignupCompleted: true,
          // status: req.body.status,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
          // image: req.files.image.name
          error: req.flash("error"),
          success: req.flash("success"),
        }

        console.log(":::obj:::", obj);

        let userDetail = await Sys.App.Services.CustomerServices.insertUserData(obj)

        console.log(":::userDetail:::", userDetail);


        // let url = `http://aeroda.store/verify_use_email/${userDetail._id}`

        // console.log("email url === >>>", url);

        // var mailOptions = {
        //     from: "intrilogykira@gmail.com",//config.smtp_sender_mail_id,
        //     // to: 'rahoul@kiraintrilogy.com',
        //     to: req.body.email,//user.email, //emailId, // register user's email
        //     subject: 'Email Varification',
        //     // text: `${passwordText}  ${env.BASE_URL}forgotpassword/${token}`
        //     html: '<html><body style="text-align: center; color:#000;background-color: #7dd857; margin: 0 auto;font-family: Arial, Helvetica, sans-serif"><div style="position: relative;"><div style="position: relative; height: 250px; background-color: #7dd857;"><div style="padding: 70px 0;font-size: 2vw;color: #fff; text-align: center;">Aeroda</div></div><div style="background-color: #fff;width: 500px;margin: 0 auto;top: -75px;margin-bottom: 30px;position: relative;padding: 25px;z-index: 1"><div style="font-size: 24px;margin-bottom: 20px; text-align: center;">Greetings of the day</div><div style="font-size: 14px; text-align: left; line-height: 20px; margin: 20px 0;"><b></b><br/><br/><div style ="color:#000; font-weight:600"> Your Mail Id : ' + req.body.email + '</div><div  style ="color:#000; font-weight:600"></div><br/>Please click the button and verify your email.><br/><a style="text-decoration: none;" href="' + url + '"><div style="padding: 10px 20px;background-color: ##7dd857; color: #fff;width: 100px;font-size: 17px;text-align: center;">Confirm</div></a> </div><div style="text-align: left;">Thank you</div><div style="text-align: left;margin-bottom: 10px;">Team Aeroda</div></div><div><div style="font-size: 12px;text-align: center; position: relative; top: -75px;">Email sent from <a href="http://aeroda.store/" target="_blank" title="Aeroda">http://aeroda.store/</a></div></div></div></body></html>'
        // };
        // // let flag = false;
        // req.flash('success', 'Please Check Your Mail.');
        // defaultTransport.sendMail(mailOptions, function (err) {
        //     if (!err) {
        //         // req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');

        //         defaultTransport.close();
        //         // flag = true;
        //         // req.flash('success', 'Please Check Your Mail.');
        //         // // await req.session.save( async function(err) {
        //         //   // session saved
        //         //   console.log('session saved');
        //           return res.redirect('/user_login');
        //         // // });
        //     } else {
        //         console.log(err);
        //         req.flash('error', 'Error sending mail,please try again After some time.');
        //         return res.redirect('/user_login');
        //     }
        // });

        // req.flash('success', 'Register Successfully');
        await req.session.save(async function (err) {
          // session saved
          console.log('session saved');
          req.flash('success', 'Customer Registered successfully');
          res.redirect('/login');
        });
      }
      // req.flash('success', 'Player Registered successfully');
      // res.redirect('/');
    } catch (e) {
      req.flash('success', 'User create faild');
      console.log("Error", e);
      res.redirect('/user_login');
    }
  },

  login: async function (req, res) {
    // console.log("req.body ###################################-->product===", req.body);
    try {
      let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });

      let subarray = [];
      let setids = [];
      let new_sub_arr = [];
      let subproduct;
      let subof_subproduct = [];

      var finalarr = [];

      if (productCategoryData) {
        for (let p = 0; p < productCategoryData.length; p++) {

          if (productCategoryData[p].main_productId == null) {
            setids.push(productCategoryData[p]._id)
          }
          for (let s = 0; s < setids.length; s++) {
            if (setids[s] == productCategoryData[p].main_productId) {
              subarray.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
            }
          }
          if (productCategoryData[p].main_productId != null && productCategoryData[p].main_sub_productId != null) {
            new_sub_arr.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
          }
        }
        // console.log(new_sub_arr);
        for (let pr = 0; pr < productCategoryData.length; pr++) {
          subproduct = [];

          var subArrId = productCategoryData[pr]._id.toString()
          for (let ss = 0; ss < subarray.length; ss++) {

            if (subarray[ss].main_productId == subArrId) {
              // console.log("");
              let str = subarray[ss].name
              str = str.replace(" ", "_");
              subproduct.push({ idids: subarray[ss].idids, name: subarray[ss].name, itemname: str, main_productId: subarray[ss].main_productId, main_sub_productId: subarray[ss].main_sub_productId, subof_subproduct: subof_subproduct })
              productCategoryData[pr].subproduct = subproduct;

            }
          }

          if (productCategoryData[pr].subproduct) {

            for (let sr = 0; sr < productCategoryData[pr].subproduct.length; sr++) {

              finalarr = [];
              var subArrId = productCategoryData[pr].subproduct[sr].idids;

              for (let n = 0; n < new_sub_arr.length; n++) {
                if (new_sub_arr[n].main_productId == subArrId) {
                  let str = new_sub_arr[n].name
                  str = str.trim();
                  str = str.toLowerCase();
                  // str = str.replace(" ", "_");
                  str = str.split(' ').join('_');
                  let replacementString = '-';
                  str = str.replace(/\//g, replacementString);

                  finalarr.push({ idids: new_sub_arr[n].idids, name: new_sub_arr[n].name, itemname: str, main_productId: new_sub_arr[n].main_productId, main_sub_productId: new_sub_arr[n].main_sub_productId })


                  productCategoryData[pr].subproduct[sr].subof_subproduct = finalarr


                }

              }


            }


          }


          if (subproduct.length) {

            output = [];


            subproduct.forEach(function (item) {
              var existing = output.filter(function (v, i) {
                return v.name == item.name;
              });

              if (existing.length) {
                var existingIndex = output.indexOf(existing[0]);
                output[existingIndex].subof_subproduct = output[existingIndex].subof_subproduct.concat(item.subof_subproduct);
              } else {
                if (typeof item.subof_subproduct == 'string')
                  item.subof_subproduct = [item.subof_subproduct];
                output.push(item);
              }

            });



            productCategoryData[pr].subproduct = output;


          }

        }

      }

      let prjectCategoryData_dup = [];
      let jj = 0
      if (productCategoryData) {
        for (let ii = 0; ii < productCategoryData.length; ii++) {
          if (productCategoryData[ii].main_productId == null &&
            productCategoryData[ii].main_sub_productId == null) {
            jj = jj + 1;
            if (jj < 6) {
              prjectCategoryData_dup.push(productCategoryData[ii])
            }
          }
        }
      }

      var data = {
        App: req.session.details,
        error: req.flash("error"),
        success: req.flash("success"),
        // home: 'active',

        productCategoryData: productCategoryData,

        prjectCategoryData_dup: prjectCategoryData_dup,
        hidefrom_homepage: "true"
      };

      console.log("home session ======>>> ", req.session.role);
      if (req.session.role == 'vendor') {
        return res.render('frontend/login');
        // return res.redirect('/login_vendor')
      } else {
        console.log(":::else condition in login controller::::");
        return res.render('frontend/login');
        // return res.render('frontend/bookclub/login', data);
      }
    } catch (e) {
      console.log("Error in Product", e);
    }
  },

  loginPost_user: async function (req, res) {

    // console.log("user login data", req.body);

    try {
      // console.log("req.body.email->", req.body);
      let user = null;
      user = await Sys.App.Services.CustomerServices.getSingleUserData({ email: req.body.email });

      console.log("::user:login::",user);

      if (user == null || user.length == 0) {
        req.flash('error', 'No Such User Found');
        // console.log("user not found =====>>>");
        await req.session.save(async function (err) {
          // session saved
          console.log('session saved');
          return res.redirect('/user_login');

        });
      }

      if (user) {
        if (user.is_deleted == "1") {
          req.flash('error', 'Invalid Credentials');
          return res.redirect('/user_login');
        }
        // if (user.isSignupCompleted == false) {
        //   req.flash('error', 'Email Not Verified');

        //   // session saved
        //   console.log('session saved');
        //   return res.redirect('/user_login');
        // }
      }


      // console.log("vendor_password home ",vendor_password);
      var passwordTrue;
      // console.log("user success =====>>>", user);
      // console.log("user success pass =====>>>", user.password);

      if (bcrypt.compareSync(req.body.password, user.password)) {
        passwordTrue = true;
      } else {
        passwordTrue = false;
      }
      if (passwordTrue == true) {
        // console.log("Users-=======>", Sys.App.Services.UserServices);
        // let User = await Sys.App.Services.UserServices.getByData({email:req.body.email});

        // set jwt token

        // console.log("user role =====>>>", user.role);

        var token = jwt.sign({ id: user._id }, jwtcofig.secret, {
          expiresIn: 60 * 60 * 24 // expires in 24 hours
        });
        // console.log("user token ==>", token);
        //console.log("Token",token);
        // User Authenticate Success
        req.session.login = true;
        req.session.details = {
          firstname: user.firstname,
          lastname: user.lastname,
          id: user._id,
          // name: user.user_company,
          jwt_token: token,
          // avatar: 'user.png',
          is_admin: 'yes',
          role: user.role,
          avatar: user.avatar_path
          // chips: vendor[0].chips,
        };

        console.log("login session details == >", req.session.details);
        if (user.role == 'custom') {
          req.session.details.access = await Sys.App.Services.CustomerServices.getByData({ userId: vendor[0].id });

        }
        // if (user.avatar) {
        //   req.session.details.avatar = user.avatar;
        // }
        var data = {
          App: req.session.details,
          error: req.flash("error"),
          success: req.flash("success")
        };
        console.log("welcome to Home");

        req.flash('success', 'Login successfully');
        await req.session.save(async function (err) {
          // session saved
          console.log('session saved');
          return res.redirect('/products');
        });
      } else {
        req.flash('error', 'Invalid Credentials');
        await req.session.save(async function (err) {
          // session saved
          console.log('session saved');
          return res.redirect('/user_login');
        });
        // return res.redirect('/user_login');
      }
    } catch (e) {
      console.log("Error in postLogin :", e);
      return new Error(e);
    }
  },

  logout: async function (req, res) {
    console.log("Logout");
    try {
      console.log("logout session admin", req.session);
      // if (req.session.details.role == 'vendor') {
      //   req.session.destroy(function (err) {
      //     req.logout();
      //     console.log("session destroy");
      //     return res.redirect('/login_vendor');
      //   });
      // } else {
        req.session.destroy(function (err) {
          // req.logout();
          console.log("session destroy");
          return res.redirect('/login');
        });
      // }
    } catch (e) {
      console.log("Error in logout :", e);
      return new Error(e);
    }
  },

  verify_use_email: async function (req, res) {
    console.log("user verify_use_email data in usercontroller", req.params);
    try {
      // res.send(req.files.image.name); return;
      let id = mongoose.Types.ObjectId(req.params.id);

      let player = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: id });
      if (player) {
        await Sys.App.Services.CustomerServices.updateUserData({ _id: player._id }, {
          isSignupCompleted: true
        });
        req.flash('success', 'Email Varified Successfully');
        await req.session.save(async function (err) {
          // session saved
          console.log('session saved');
          res.redirect('/user_login');
        });
      }
      // req.flash('success', 'Player Registered successfully');
      // res.redirect('/');
    } catch (e) {
      req.flash('success', 'User create faild');
      console.log("Error", e);
      res.redirect('/user_login');
    }
  },



  // logout: async function(req, res) {
  //   console.log("Logout");
  //   try {
  //       let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });

  //       console.log("logout session admin",req.session);
  //       if(req.session.details.role == 'vendor' && req.session.details.id == user._id){
  //       // req.session.destroy(function(err) {
  //           req.session.details = {};
  //           req.logout();
  //           console.log("session destroy");
  //           return res.redirect('/login_vendor');
  //       // });
  //   }else{
  //       if(req.session.details.id == user._id){
  //           // req.session.destroy(function(err) {
  //               req.session.details = {};
  //               req.logout();
  //               console.log("session destroy");
  //               return res.redirect('/user_login');
  //           // });
  //       }
  //   }
  //   } catch (e) {
  //       console.log("Error in logout :", e);
  //       return new Error(e);
  //   }
  // },
  getUserDelete: async function (req, res) {
    try {
      console.log("req.body.id", req.body.id);
      let id = mongoose.Types.ObjectId(req.body.id);
      let player = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: id });
      if (player) {
        await Sys.App.Services.CustomerServices.updateUserData(
          {
            _id: player._id

          }, {
          is_deleted: "1",
        }
        )
        return res.send("success");
      } else {
        return res.send("error");
      }
    } catch (e) {
      console.log("Error", e);
    }
  },

  setAffiliate: async function (req, res) {
    try {
      let player = await Sys.App.Services.UserServices.getUserData({ _id: req.body.id });
      if (player || player.length > 0) {
      } else {
        return res.send("error");
      }
      if (req.body.action == 'reject') {
        // delete affiliate
        await Sys.App.Services.UserServices.deleteUser(req.body.id)
        return res.send("success");
      } else if (req.body.action == 'accept') {
        // make affilaite active
        let adminData = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
        await Sys.App.Services.UserServices.updateUserData({ _id: req.body.id }, { status: 'active', affiliateCode: adminData.affiliateCode });
        await Sys.App.Services.UserServices.updateUserData({ _id: req.session.details.id }, { affiliateCode: parseInt(parseInt(adminData.affiliateCode) + 1) });
        return res.send("success");
      } else {

      }

    } catch (e) {
      console.log("Error", e);
    }
  },

  editUser: async function (req, res) {
    try {
      let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.params.id });
      var data = {
        App: req.session.details, Agent: req.session.details,
        error: req.flash("error"),
        success: req.flash("success"),
        user: user,
        userActive: 'active'
      };
      return res.render('backend/user/add', data);
      // res.send(player);
    } catch (e) {
      console.log("Error", e);
    }
  },

  editUserPostData: async function (req, res) {
    try {
      console.log("req.params.id", req.params.id);
      let player = await Sys.App.Services.CustomerServices.getUserData({ _id: req.params.id });
      if (player && player.length > 0) {

        if (req.files) {
          let image = req.files.image;

          // Use the mv() method to place the file somewhere on your server
          image.mv('/profile/' + req.files.image.name, function (err) {
            if (err) {
              req.flash('error', 'Customer Already Present');
              return res.redirect('/');
            }

            // res.send('File uploaded!');
          });
        }
        await Sys.App.Services.CustomerServices.updateUserData(
          {
            _id: req.params.id
            // image: req.files.image.name
          }, {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          //   role: req.body.role,
          status: req.body.status,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null)
          // image: req.files.image.name
        }
        )
        req.flash('success', 'Customer update successfully');
        res.redirect('/backend/customer');

      } else {
        req.flash('error', 'No User found');
        res.redirect('/');
        return;
      }
      // req.flash('success', 'Player Registered successfully');
      // res.redirect('/');
    } catch (e) {
      console.log("Error", e);
    }
  },

  pendingInstructorsList: async function (req, res) {
    try {
      if (getAccess(req.session.details, 'instructorRequest') == 'false') {
        req.flash('error', 'You do not have access for this this Page');
        return res.redirect('/dashboard');
      }
      var data = {
        App: req.session.details,
        error: req.flash("error"),
        success: req.flash("success"),
        pendingInstructors: 'active'
      };
      return res.render('backend/user/pending-affiliates', data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  getPendingAffiliates: async function (req, res) {
    // res.send(req.query.start); return false;
    try {
      let start = parseInt(req.query.start);
      let length = parseInt(req.query.length);
      let search = req.query.search.value;

      let query = {};
      if (search != '') {
        let capital = search;
        // query = {
        // or: [
        // {'username': { 'like': '%'+search+'%' }},
        // {'username': { 'like': '%'+capital+'%' }}
        //  ]
        // };
        query = { email: { $regex: '.*' + search + '.*' }, role: 'affiliate', status: 'inactive' };
      } else {
        query = { role: 'affiliate', status: 'inactive' };
      }

      let userCount = await Sys.App.Services.UserServices.getUserCount(query);
      let data = await Sys.App.Services.UserServices.getUserDatatable(query, length, start);

      var obj = {
        'draw': req.query.draw,
        'recordsTotal': userCount,
        'recordsFiltered': userCount,
        'data': data
      };
      res.send(obj);
    } catch (e) {
      console.log("Error", e);
    }
  },

  student: async function (req, res) {
    try {
      if (getAccess(req.session.details, 'studentList') == 'false') {
        req.flash('error', 'You do not have access for this this Page');
        return res.redirect('/dashboard');
      }
      getAccess(req.session.details, 'studentList');
      var data = {
        App: req.session.details,
        error: req.flash("error"),
        success: req.flash("success"),
        studentListing: 'active'
      };
      return res.render('backend/user/student', data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  getStudent: async function (req, res) {
    try {
      let start = parseInt(req.query.start);
      let length = parseInt(req.query.length);
      let search = req.query.search.value;

      let query = {};
      if (search != '') {
        let capital = search;
        // query = {
        // or: [
        // {'username': { 'like': '%'+search+'%' }},
        // {'username': { 'like': '%'+capital+'%' }}
        //  ]
        // };
        query = { email: { $regex: '.*' + search + '.*' }, role: 'user' };
      } else {
        query = { role: 'user' };
      }


      let playersCount = await Sys.App.Services.UserServices.getUserCount(query);
      //let playersCount = playersC.length;
      let data = await Sys.App.Services.UserServices.getUserDatatable(query, length, start);

      var obj = {
        'draw': req.query.draw,
        'recordsTotal': playersCount,
        'recordsFiltered': playersCount,
        'data': data
      };
      res.send(obj);
    } catch (e) {
      console.log("Error", e);
    }
  },

  roleManagement: async function (req, res) {
    try {
      if (req.session.details.role == 'custom') {
        req.flash('error', 'You do not have access for this this Page');
        return res.redirect('/dashboard');
      }
      var data = {
        App: req.session.details,
        error: req.flash("error"),
        success: req.flash("success"),
        roleManagement: 'active'
      };
      return res.render('backend/user/customUser', data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  getCustomUsers: async function (req, res) {
    try {
      let start = parseInt(req.query.start);
      let length = parseInt(req.query.length);
      let search = req.query.search.value;

      let query = {};
      if (search != '') {
        let capital = search;
        // query = {
        // or: [
        // {'username': { 'like': '%'+search+'%' }},
        // {'username': { 'like': '%'+capital+'%' }}
        //  ]
        // };
        query = { email: { $regex: '.*' + search + '.*' }, role: 'custom' };
      } else {
        query = { role: 'custom' };
      }


      let playersCount = await Sys.App.Services.UserServices.getUserCount(query);
      //let playersCount = playersC.length;
      let data = await Sys.App.Services.UserServices.getUserDatatable(query, length, start);

      var obj = {
        'draw': req.query.draw,
        'recordsTotal': playersCount,
        'recordsFiltered': playersCount,
        'data': data
      };
      res.send(obj);
    } catch (e) {
      console.log("Error", e);
    }
  },

  addCustomUser: async function (req, res) {
    try {
      var data = {
        App: req.session.details,
        error: req.flash("error"),
        success: req.flash("success"),
        userActive: 'active'
      };
      return res.render('backend/user/add', data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  addCustomUserPost: async function (req, res) {
    try {
      // res.send(req.files.image.name); return;
      console.log("qqqq", req.body);
      let player = await Sys.App.Services.UserServices.getUserData({ mobile: req.body.mobile });
      if (player && player.length > 0) {
        console.log("User with Mobile Already Present");
        req.flash('error', 'User with Mobile Already Present');
        return res.redirect('/backend/addCustomUser');
      } else {

        let playerEmail = await Sys.App.Services.UserServices.getUserData({ email: req.body.email });
        if (playerEmail && playerEmail.length > 0) {
          console.log("User with Email Already Present");
          req.flash('error', 'User with Email Already Present');
          return res.redirect('/backend/addCustomUser');
        } else {
          let customUser = await Sys.App.Services.UserServices.insertUserData(
            {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              mobile: req.body.mobile,
              role: 'custom',
              status: 'active',
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null)
            }
          )
          await Sys.App.Services.UserServices.createAccess({ userId: customUser._id })
          req.flash('success', 'User create successfully');
          return res.redirect('/backend/roleManagement');
        }
      }
      // req.flash('success', 'Player Registered successfully');
      // res.redirect('/');
    } catch (e) {
      console.log("Error", e);
    }
  },

  setUserAccess: async function (req, res) {
    try {
      let user = await Sys.App.Services.UserServices.getAccess({ userId: req.params.id });
      var data = {
        App: req.session.details,
        error: req.flash("error"),
        success: req.flash("success"),
        roleManagement: 'active',
        user: user
      };
      return res.render('backend/user/customAccess', data);
    } catch (e) {
      console.log("error in setUserAccess", e);
    }
  },

  setUserAccessPost: async function (req, res) {
    try {
      console.log("req.body", req.body);
      await Sys.App.Services.UserServices.updateAccess(
        { userId: req.params.id },
        {
          studentList: (req.body.studentList) ? req.body.studentList : 'false',
          affiliateList: (req.body.affiliateList) ? req.body.affiliateList : 'false',
          courseManagement: (req.body.courseManagement) ? req.body.courseManagement : 'false',
          instructorRequest: (req.body.instructorRequest) ? req.body.instructorRequest : 'false',
          studentApplicationRequest: (req.body.studentApplicationRequest) ? req.body.studentApplicationRequest : 'false',
          coursePaymentRequest: (req.body.coursePaymentRequest) ? req.body.coursePaymentRequest : 'false',
          blog: (req.body.blog) ? req.body.blog : 'false'
        });

      return res.redirect('/backend/setUserAccess/' + req.params.id);
    } catch (e) {
      console.log("Error in setUserAccessPost", e);
    }
  },



  forgotPost_user: async function (req, res) {

    // console.log("user login data", req.body);

    try {

      console.log("forgotPost_user->", req.body);

      var data = {
        App: req.session.details,
        error: req.flash("error"),
        success: req.flash("success")
      };
      let user = null;
      user = await Sys.App.Services.CustomerServices.getSingleUserData({ email: req.body.email });
      if (user == null || user.length == 0) {
        console.log("user not found =====>>>");

        req.flash('error', 'No Such User Found');

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

      if (user) {
        if (user.is_deleted == "1") {
          console.log("Invalid Credentials");
          req.flash('error', 'Invalid Credentials');
          return res.redirect('/user_login');
        }
      }

      if (user) {

        // console.log(":::vendorDetail_gmail:::",vendorDetail.vendor_email)

        let userid = user._id
        let emailId = user.email

        // await model.User.findOneAndUpdate({_id:req.body.userId, is_deleted:"0"},{userApproval:true}, {new:true}).lean() // vendor query here
        var length = 6,
          charset = "012345678901234567890123456789",
          otp = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
          otp += charset.charAt(Math.floor(Math.random() * n));
        }

        await Sys.App.Services.CustomerServices.updateUserData({ _id: user._id }, {
          otp: otp,
        });


        // let baseUrl = req.headers.host + '/backend' // change url here
        // let uniqueId =create_UUID()
        // code for registration success message send to user email
        let url = `http://192.168.1.7:9001/verify_otp/${userid}/${otp}`

        console.log("email url === >>>", url);

        var mailOptions = {
          from: "intrilogykira@gmail.com",//config.smtp_sender_mail_id,
          // to: 'rahoul@kiraintrilogy.com',
          to: req.body.email,//user.email, //emailId, // register user's email
          subject: 'Forgot Password',
          // text: `${passwordText}  ${env.BASE_URL}forgotpassword/${token}`
          html: '<html><body style="text-align: center; color:#000;background-color: #7f87ab;margin: 0 auto;font-family: Arial, Helvetica, sans-serif"><div style="position: relative;"><div style="position: relative; height: 250px; background-color: #7f87ab;"><div style="padding: 70px 0;font-size: 2vw;color: #fff; text-align: center;">OEMOne</div></div><div style="background-color: #fff;width: 500px;margin: 0 auto;top: -75px;margin-bottom: 30px;position: relative;padding: 25px;z-index: 1"><div style="font-size: 24px;margin-bottom: 20px; text-align: center;">Greetings of the day</div><div style="font-size: 14px; text-align: left; line-height: 20px; margin: 20px 0;"><b></b><br/><br/>Please use the verification OTP for forgot password. <br/><div style ="color:#000; font-weight:600"> Your Mail Id : ' + user.email + '</div><div style ="color:#000; font-weight:600"> OTP : ' + otp + '</div><div  style ="color:#000; font-weight:600"></div><br/>Please click the button and verify your OTP.><br/><a style="text-decoration: none;" href="' + url + '"><div style="padding: 10px 20px;background-color: #7f87ab;color: #fff;width: 100px;font-size: 17px;text-align: center;">Confirm</div></a> </div><div style="text-align: left;">Thank you</div><div style="text-align: left;margin-bottom: 10px;">Team OEMOne</div></div><div><div style="font-size: 12px;text-align: center; position: relative; top: -75px;">Email sent from <a href="http://www.oemone.shop/" target="_blank" title="Original Equipement Manufacturer | OEMup">http://www.oemone.shop/</a></div></div></div></body></html>'
        };
        // let flag = false;
        req.flash('success', 'Please Check Your Mail.');
        defaultTransport.sendMail(mailOptions, function (err) {
          if (!err) {
            // req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');

            defaultTransport.close();
            console.log("Please Check Your Mail.----");
            // flag = true;
            // req.flash('success', 'Please Check Your Mail.');
            // // await req.session.save( async function(err) {
            //   // session saved
            //   console.log('session saved');
            // // });
          } else {
            console.log(err);
            req.flash('error', 'Error sending mail,please try again After some time.');
            return res.redirect('/forgot_password');
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
      req.flash('success', 'Please Check Your Mail.');

      //   return res.redirect('/user_login');

      await req.session.save(async function (err) {
        // session saved
        console.log('session saved');
        return res.redirect('/user_login');
      });
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
    try {
      let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
      let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
      let subarray = [];
      let setids = [];
      let new_sub_arr = [];
      let subproduct;
      let subof_subproduct = [];

      var finalarr = [];

      if (productCategoryData) {
        for (let p = 0; p < productCategoryData.length; p++) {

          if (productCategoryData[p].main_productId == null) {
            setids.push(productCategoryData[p]._id)
          }
          for (let s = 0; s < setids.length; s++) {
            if (setids[s] == productCategoryData[p].main_productId) {
              subarray.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
            }
          }
          if (productCategoryData[p].main_productId != null && productCategoryData[p].main_sub_productId != null) {
            new_sub_arr.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
          }
        }
        // console.log(new_sub_arr);
        for (let pr = 0; pr < productCategoryData.length; pr++) {
          subproduct = [];

          var subArrId = productCategoryData[pr]._id.toString()
          for (let ss = 0; ss < subarray.length; ss++) {

            if (subarray[ss].main_productId == subArrId) {
              // console.log("");
              let str = subarray[ss].name
              str = str.replace(" ", "_");
              subproduct.push({ idids: subarray[ss].idids, name: subarray[ss].name, itemname: str, main_productId: subarray[ss].main_productId, main_sub_productId: subarray[ss].main_sub_productId, subof_subproduct: subof_subproduct })
              productCategoryData[pr].subproduct = subproduct;

            }
          }

          if (productCategoryData[pr].subproduct) {

            for (let sr = 0; sr < productCategoryData[pr].subproduct.length; sr++) {

              finalarr = [];
              var subArrId = productCategoryData[pr].subproduct[sr].idids;

              for (let n = 0; n < new_sub_arr.length; n++) {
                if (new_sub_arr[n].main_productId == subArrId) {
                  let str = new_sub_arr[n].name
                  str = str.trim();
                  str = str.toLowerCase();
                  // str = str.replace(" ", "_");
                  str = str.split(' ').join('_');
                  let replacementString = '-';
                  str = str.replace(/\//g, replacementString);

                  finalarr.push({ idids: new_sub_arr[n].idids, name: new_sub_arr[n].name, itemname: str, main_productId: new_sub_arr[n].main_productId, main_sub_productId: new_sub_arr[n].main_sub_productId })

                  productCategoryData[pr].subproduct[sr].subof_subproduct = finalarr

                }

              }


            }

          }


          if (subproduct.length) {

            output = [];


            subproduct.forEach(function (item) {
              var existing = output.filter(function (v, i) {
                return v.name == item.name;
              });

              if (existing.length) {
                var existingIndex = output.indexOf(existing[0]);
                output[existingIndex].subof_subproduct = output[existingIndex].subof_subproduct.concat(item.subof_subproduct);
              } else {
                if (typeof item.subof_subproduct == 'string')
                  item.subof_subproduct = [item.subof_subproduct];
                output.push(item);
              }

            });



            productCategoryData[pr].subproduct = output;


          }

        }

      }

      let prjectCategoryData_dup = [];
      let jj = 0
      if (productCategoryData) {
        for (let ii = 0; ii < productCategoryData.length; ii++) {
          if (productCategoryData[ii].main_productId == null &&
            productCategoryData[ii].main_sub_productId == null) {
            jj = jj + 1;
            if (jj < 6) {
              prjectCategoryData_dup.push(productCategoryData[ii])
            }
          }
        }
      }
      let user = await Sys.App.Services.CustomerServices.getSingleUserData({ email: req.body.email });
      var data = {
        App: req.session.details,
        error: req.flash("error"),
        success: req.flash("success"),
        user: user,
        productCategoryData: productCategoryData,
        prjectCategoryData_dup: prjectCategoryData_dup,
        hidefrom_homepage: "true"

      };
      return res.render('frontend/forgot_password', data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  forgot_otp: async function (req, res) {
    try {
      let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
      let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
      let subarray = [];
      let setids = [];
      let new_sub_arr = [];
      let subproduct;
      let subof_subproduct = [];

      var finalarr = [];

      if (productCategoryData) {
        for (let p = 0; p < productCategoryData.length; p++) {

          if (productCategoryData[p].main_productId == null) {
            setids.push(productCategoryData[p]._id)
          }
          for (let s = 0; s < setids.length; s++) {
            if (setids[s] == productCategoryData[p].main_productId) {
              subarray.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
            }
          }
          if (productCategoryData[p].main_productId != null && productCategoryData[p].main_sub_productId != null) {
            new_sub_arr.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
          }
        }
        // console.log(new_sub_arr);
        for (let pr = 0; pr < productCategoryData.length; pr++) {
          subproduct = [];

          var subArrId = productCategoryData[pr]._id.toString()
          for (let ss = 0; ss < subarray.length; ss++) {

            if (subarray[ss].main_productId == subArrId) {
              // console.log("");
              let str = subarray[ss].name
              str = str.replace(" ", "_");
              subproduct.push({ idids: subarray[ss].idids, name: subarray[ss].name, itemname: str, main_productId: subarray[ss].main_productId, main_sub_productId: subarray[ss].main_sub_productId, subof_subproduct: subof_subproduct })
              productCategoryData[pr].subproduct = subproduct;

            }
          }

          if (productCategoryData[pr].subproduct) {

            for (let sr = 0; sr < productCategoryData[pr].subproduct.length; sr++) {

              finalarr = [];
              var subArrId = productCategoryData[pr].subproduct[sr].idids;

              for (let n = 0; n < new_sub_arr.length; n++) {
                if (new_sub_arr[n].main_productId == subArrId) {
                  let str = new_sub_arr[n].name
                  str = str.trim();
                  str = str.toLowerCase();
                  // str = str.replace(" ", "_");
                  str = str.split(' ').join('_');
                  let replacementString = '-';
                  str = str.replace(/\//g, replacementString);

                  finalarr.push({ idids: new_sub_arr[n].idids, name: new_sub_arr[n].name, itemname: str, main_productId: new_sub_arr[n].main_productId, main_sub_productId: new_sub_arr[n].main_sub_productId })

                  productCategoryData[pr].subproduct[sr].subof_subproduct = finalarr

                }

              }


            }

          }


          if (subproduct.length) {

            output = [];


            subproduct.forEach(function (item) {
              var existing = output.filter(function (v, i) {
                return v.name == item.name;
              });

              if (existing.length) {
                var existingIndex = output.indexOf(existing[0]);
                output[existingIndex].subof_subproduct = output[existingIndex].subof_subproduct.concat(item.subof_subproduct);
              } else {
                if (typeof item.subof_subproduct == 'string')
                  item.subof_subproduct = [item.subof_subproduct];
                output.push(item);
              }

            });



            productCategoryData[pr].subproduct = output;


          }

        }

      }

      let prjectCategoryData_dup = [];
      let jj = 0
      if (productCategoryData) {
        for (let ii = 0; ii < productCategoryData.length; ii++) {
          if (productCategoryData[ii].main_productId == null &&
            productCategoryData[ii].main_sub_productId == null) {
            jj = jj + 1;
            if (jj < 6) {
              prjectCategoryData_dup.push(productCategoryData[ii])
            }
          }
        }
      }
      let user = await Sys.App.Services.CustomerServices.getSingleUserData({ email: req.body.email });
      var data = {
        App: req.session.details,
        error: req.flash("error"),
        success: req.flash("success"),
        user: user,
        productCategoryData: productCategoryData,
        prjectCategoryData_dup: prjectCategoryData_dup,
        hidefrom_homepage: "true"
      };
      return res.render('frontend/forgot_otp', data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  set_password: async function (req, res) {
    try {
      let user = await Sys.App.Services.CustomerServices.getSingleUserData({ email: req.body.email });
      let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
      let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
      let subarray = [];
      let setids = [];
      let new_sub_arr = [];
      let subproduct;
      let subof_subproduct = [];

      var finalarr = [];

      if (productCategoryData) {
        for (let p = 0; p < productCategoryData.length; p++) {

          if (productCategoryData[p].main_productId == null) {
            setids.push(productCategoryData[p]._id)
          }
          for (let s = 0; s < setids.length; s++) {
            if (setids[s] == productCategoryData[p].main_productId) {
              subarray.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
            }
          }
          if (productCategoryData[p].main_productId != null && productCategoryData[p].main_sub_productId != null) {
            new_sub_arr.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
          }
        }
        // console.log(new_sub_arr);
        for (let pr = 0; pr < productCategoryData.length; pr++) {
          subproduct = [];

          var subArrId = productCategoryData[pr]._id.toString()
          for (let ss = 0; ss < subarray.length; ss++) {

            if (subarray[ss].main_productId == subArrId) {
              // console.log("");
              let str = subarray[ss].name
              str = str.replace(" ", "_");
              subproduct.push({ idids: subarray[ss].idids, name: subarray[ss].name, itemname: str, main_productId: subarray[ss].main_productId, main_sub_productId: subarray[ss].main_sub_productId, subof_subproduct: subof_subproduct })
              productCategoryData[pr].subproduct = subproduct;

            }
          }

          if (productCategoryData[pr].subproduct) {

            for (let sr = 0; sr < productCategoryData[pr].subproduct.length; sr++) {

              finalarr = [];
              var subArrId = productCategoryData[pr].subproduct[sr].idids;

              for (let n = 0; n < new_sub_arr.length; n++) {
                if (new_sub_arr[n].main_productId == subArrId) {
                  let str = new_sub_arr[n].name
                  str = str.trim();
                  str = str.toLowerCase();
                  // str = str.replace(" ", "_");
                  str = str.split(' ').join('_');
                  let replacementString = '-';
                  str = str.replace(/\//g, replacementString);

                  finalarr.push({ idids: new_sub_arr[n].idids, name: new_sub_arr[n].name, itemname: str, main_productId: new_sub_arr[n].main_productId, main_sub_productId: new_sub_arr[n].main_sub_productId })

                  productCategoryData[pr].subproduct[sr].subof_subproduct = finalarr

                }

              }


            }

          }


          if (subproduct.length) {

            output = [];


            subproduct.forEach(function (item) {
              var existing = output.filter(function (v, i) {
                return v.name == item.name;
              });

              if (existing.length) {
                var existingIndex = output.indexOf(existing[0]);
                output[existingIndex].subof_subproduct = output[existingIndex].subof_subproduct.concat(item.subof_subproduct);
              } else {
                if (typeof item.subof_subproduct == 'string')
                  item.subof_subproduct = [item.subof_subproduct];
                output.push(item);
              }

            });



            productCategoryData[pr].subproduct = output;


          }

        }

      }

      let prjectCategoryData_dup = [];
      let jj = 0
      if (productCategoryData) {
        for (let ii = 0; ii < productCategoryData.length; ii++) {
          if (productCategoryData[ii].main_productId == null &&
            productCategoryData[ii].main_sub_productId == null) {
            jj = jj + 1;
            if (jj < 6) {
              prjectCategoryData_dup.push(productCategoryData[ii])
            }
          }
        }
      }
      var data = {
        App: req.session.details,
        error: req.flash("error"),
        success: req.flash("success"),
        user: user,
        productCategoryData: productCategoryData,
        prjectCategoryData_dup: prjectCategoryData_dup,
        hidefrom_homepage: "true"
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


      let user = null;
      user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.params.id });
      if (user == null || user.length == 0) {
        req.flash('error', 'No Such User Found');
        console.log("user not found =====>>>");
        await req.session.save(async function (err) {
          // session saved
          console.log('session saved');
          return res.redirect('/user_login');

        });
      }

      if (user) {
        if (user.is_deleted == "1") {
          req.flash('error', 'Invalid Credentials');
          return res.redirect('/user_login');
        }
      }

      await Sys.App.Services.CustomerServices.updateUserData({ otp: req.params.otp });

      let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
      let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
      let subarray = [];
      let setids = [];
      let new_sub_arr = [];
      let subproduct;
      let subof_subproduct = [];

      var finalarr = [];

      if (productCategoryData) {
        for (let p = 0; p < productCategoryData.length; p++) {

          if (productCategoryData[p].main_productId == null) {
            setids.push(productCategoryData[p]._id)
          }
          for (let s = 0; s < setids.length; s++) {
            if (setids[s] == productCategoryData[p].main_productId) {
              subarray.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
            }
          }
          if (productCategoryData[p].main_productId != null && productCategoryData[p].main_sub_productId != null) {
            new_sub_arr.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
          }
        }
        // console.log(new_sub_arr);
        for (let pr = 0; pr < productCategoryData.length; pr++) {
          subproduct = [];

          var subArrId = productCategoryData[pr]._id.toString()
          for (let ss = 0; ss < subarray.length; ss++) {

            if (subarray[ss].main_productId == subArrId) {
              // console.log("");
              let str = subarray[ss].name
              str = str.replace(" ", "_");
              subproduct.push({ idids: subarray[ss].idids, name: subarray[ss].name, itemname: str, main_productId: subarray[ss].main_productId, main_sub_productId: subarray[ss].main_sub_productId, subof_subproduct: subof_subproduct })
              productCategoryData[pr].subproduct = subproduct;

            }
          }

          if (productCategoryData[pr].subproduct) {

            for (let sr = 0; sr < productCategoryData[pr].subproduct.length; sr++) {

              finalarr = [];
              var subArrId = productCategoryData[pr].subproduct[sr].idids;

              for (let n = 0; n < new_sub_arr.length; n++) {
                if (new_sub_arr[n].main_productId == subArrId) {
                  let str = new_sub_arr[n].name
                  str = str.trim();
                  str = str.toLowerCase();
                  // str = str.replace(" ", "_");
                  str = str.split(' ').join('_');
                  let replacementString = '-';
                  str = str.replace(/\//g, replacementString);

                  finalarr.push({ idids: new_sub_arr[n].idids, name: new_sub_arr[n].name, itemname: str, main_productId: new_sub_arr[n].main_productId, main_sub_productId: new_sub_arr[n].main_sub_productId })

                  productCategoryData[pr].subproduct[sr].subof_subproduct = finalarr

                }

              }


            }

          }


          if (subproduct.length) {

            output = [];


            subproduct.forEach(function (item) {
              var existing = output.filter(function (v, i) {
                return v.name == item.name;
              });

              if (existing.length) {
                var existingIndex = output.indexOf(existing[0]);
                output[existingIndex].subof_subproduct = output[existingIndex].subof_subproduct.concat(item.subof_subproduct);
              } else {
                if (typeof item.subof_subproduct == 'string')
                  item.subof_subproduct = [item.subof_subproduct];
                output.push(item);
              }

            });



            productCategoryData[pr].subproduct = output;


          }

        }

      }

      let prjectCategoryData_dup = [];
      let jj = 0
      if (productCategoryData) {
        for (let ii = 0; ii < productCategoryData.length; ii++) {
          if (productCategoryData[ii].main_productId == null &&
            productCategoryData[ii].main_sub_productId == null) {
            jj = jj + 1;
            if (jj < 6) {
              prjectCategoryData_dup.push(productCategoryData[ii])
            }
          }
        }
      }
      req.flash('success', 'Please Enter Your OTP.');

      var data = {
        App: req.session.details,
        error: req.flash("error"),
        success: req.flash("success"),
        user: user,
        productCategoryData: productCategoryData,
        prjectCategoryData_dup: prjectCategoryData_dup,
        hidefrom_homepage: "true"
      };

      return res.render('frontend/forgot_otp', data);
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
      let user = await Sys.App.Services.CustomerServices.getSingleUserData({ email: req.body.email });
      if (user && user.length > 0) {
        req.flash('error', 'User Already Present');
        return res.redirect('/user_login');
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

        console.log("user", user.otp);
        console.log("user.otp == req.body.otp", user.otp, req.body.otp);
        console.log("user.otp == req.body.otp", user.otp == req.body.otp);
        console.log("user.otp == req.body.otp", user.otp.toString() == req.body.otp.toString());
        if (user.otp == req.body.otp) {
          console.log("Password Set Successfully");
          req.flash('success', 'OTP Verified Successfully, Please Set Your Password');
          var data = {
            App: req.session.details,
            error: req.flash("error"),
            success: req.flash("success"),
            user: user
          };
          return res.render('frontend/set_password', data);

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
      let user = await Sys.App.Services.CustomerServices.getSingleUserData({ email: req.body.email });
      if (user && user.length > 0) {
        req.flash('error', 'User Already Present');
        res.redirect('/user_login');
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

        console.log(user._id);
        console.log(user.id);
        let userDetail = await Sys.App.Services.CustomerServices.updateoneUserData({
          _id: user._id
        }, {
          $set: {

            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
          }
        })
        console.log("Password Set Successfully");
        req.flash('success', 'Password Set Successfully');
        await req.session.save(async function (err) {
          // session saved
          console.log('session saved');
          res.redirect('/user_login');
        });
      }
      // req.flash('success', 'Player Registered successfully');
      // res.redirect('/');
    } catch (e) {
      req.flash('success', 'User create faild');
      console.log("Error", e);
      res.redirect('/user_login');
    }
  },

  loginPost_user_otp: async function (req, res) {

    // console.log("user login data", req.body);

    try {

      console.log("req.body.loginPost_user_otploginPost_user_otploginPost_user_otp->", req.body);


      let user = null;
      user = await Sys.App.Services.CustomerServices.getSingleUserData({ mobile: req.body.phone });
      if (user == null || user.length == 0) {
        req.flash('error', 'No Such User Found');
        console.log("user not found =====>>>");
        // await req.session.save(async function (err) {
        // session saved
        //   console.log('session saved');
        return res.redirect('/user_login');

        // });
      }

      if (user) {
        if (user.is_deleted == "1") {
          req.flash('error', 'Invalid Credentials');
          return res.redirect('/user_login');
        }
      }



      if (user) {
        // console.log("Users-=======>", Sys.App.Services.UserServices);
        // let User = await Sys.App.Services.UserServices.getByData({email:req.body.email});

        // set jwt token

        // console.log("user role =====>>>", user.role);


        var length = 6,
          charset = "01234567890123459876543210678901234567890123456789",
          otp = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
          otp += charset.charAt(Math.floor(Math.random() * n));
        }

        await Sys.App.Services.CustomerServices.updateUserData({ _id: user._id }, {
          otp: otp,
        });


        var userrr = 'KiraIntrilogy';
        var password = 'Kira@2014';
        var mobile = req.body.phone;//'919999999999, 919999999998',
        var message = 'Dear user, your OTP number is ' + otp + ', Regards OEMONE, Oemone'
        //var message = 'Your OTP for OEMONE Login is '+otp+'. Please DO NOT share this OTP with anyone.';
        var sender = 'Oemone';
        var type = '3';
        var template_id = '1507162859695317264';

        var urllll = "http://api.bulksmsgateway.in/sendmessage.php?user=" + userrr + "&password=" + password + "&mobile=" + mobile + "&message=" + message + "&sender=" + sender + "&type=3&template_id=" + template_id;
        //   var urltmp = 'http://api.bulksmsgateway.in/sendmessage.php?user=KiraIntrilogy&password=Kira@2014&mobile=7000028984&message=Dear%20user,%20your%20OTP%20number%20is%20276598,%20Regards%20OEMONE,%20oemone.shop&sender=Oemone&type=3&template_id=1507162859695317264'
        // console.log("urrrll", urllll);
        let flagm = false;
        request(urllll, { json: true }, (err, res, body) => {
          if (err) { return console.log(err); }
          console.log(res);
          if (res.status == "failed") {
            flagm = true;
          }
          // console.log(body.explanation);
        });
        if (flagm == true) {
          req.flash('error', 'There may be a problem with the server. Please try again later.');
          await req.session.save(async function (err) {
            // session saved
            console.log('OTP Issue');
            return res.redirect('/user_login');
          });
        }
        var data = {
          App: req.session.details,
          error: req.flash("error"),
          success: req.flash("success")
        };
        console.log("welcome to Home");

        // req.flash('success', 'Your Mobile No is Valid');
        req.flash('success', 'OTP has been successfully sent');
        await req.session.save(async function (err) {
          // session saved
          console.log('session saved');
          return res.redirect(`/otp_verify/${user._id}`)
        });
      } else {
        req.flash('error', 'OTP is Invalid');
        await req.session.save(async function (err) {
          // session saved
          console.log('session saved');
          return res.redirect('/user_login');
        });
        // return res.redirect('/user_login');
      }

    } catch (e) {
      console.log("Error in postLogin :", e);
      return new Error(e);
    }
  },

  userlogin_otp_post: async function (req, res) {
    console.log("user body verify_otp_post in usercontroller", req.body);
    try {
      // res.send(req.files.image.name); return;
      let user = await Sys.App.Services.CustomerServices.getSingleUserData({ mobile: req.body.phone });
      if (user && user.length > 0) {
        req.flash('error', 'User Already Present');
        return res.redirect('/user_login');
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

        console.log("user", user.otp);
        console.log("user.otp == req.body.otp", user.otp, req.body.otp);
        console.log("user.otp == req.body.otp", user.otp == req.body.otp);
        console.log("user.otp == req.body.otp", user.otp.toString() == req.body.otp.toString());
        if (user.otp == req.body.otp) {
          // if (passwordTrue == true) {
          // console.log("Users-=======>", Sys.App.Services.UserServices);
          // let User = await Sys.App.Services.UserServices.getByData({email:req.body.email});

          // set jwt token

          // console.log("user role =====>>>", user.role);

          var token = jwt.sign({ id: user._id }, jwtcofig.secret, {
            expiresIn: 60 * 60 * 24 // expires in 24 hours
          });
          // console.log("user token ==>", token);
          //console.log("Token",token);
          // User Authenticate Success
          req.session.login = true;
          req.session.details = {
            firstname: user.firstname,
            lastname: user.lastname,
            id: user._id,
            // name: user.user_company,
            jwt_token: token,
            // avatar: 'user.png',
            is_admin: 'yes',
            role: user.role,
            avatar: user.avatar_path
            // chips: vendor[0].chips,
          };

          console.log("homecontrolller session details == >", req.session.details);
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
          console.log("welcome to Home");

          req.flash('success', 'Login successfully');
          await req.session.save(async function (err) {
            // session saved
            console.log('session saved');
            return res.redirect('/');
          });
          //   }
          //   console.log("Password Set Successfully");
          //   req.flash('success', 'OTP Verified Successfully, Please Login');
          //   var data = {
          //     App: req.session.details,
          //     error: req.flash("error"),
          //     success: req.flash("success"),
          //     user: user,
          //     ismobile:true

          //   };
          //   return res.render('frontend/user_login', data);

        } else {
          req.flash('error', 'OTP is invalid, Please try again');
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

  otp_verify: async function (req, res) {
    try {
      console.log("req.params.id", req.params.id);
      let id = mongoose.Types.ObjectId(req.params.id);
      let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: id });
      //   console.log("user",user);
      let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
      let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
      let subarray = [];
      let setids = [];
      let new_sub_arr = [];
      let subproduct;
      let subof_subproduct = [];

      var finalarr = [];

      if (productCategoryData) {
        for (let p = 0; p < productCategoryData.length; p++) {

          if (productCategoryData[p].main_productId == null) {
            setids.push(productCategoryData[p]._id)
          }
          for (let s = 0; s < setids.length; s++) {
            if (setids[s] == productCategoryData[p].main_productId) {
              subarray.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
            }
          }
          if (productCategoryData[p].main_productId != null && productCategoryData[p].main_sub_productId != null) {
            new_sub_arr.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
          }
        }
        // console.log(new_sub_arr);
        for (let pr = 0; pr < productCategoryData.length; pr++) {
          subproduct = [];

          var subArrId = productCategoryData[pr]._id.toString()
          for (let ss = 0; ss < subarray.length; ss++) {

            if (subarray[ss].main_productId == subArrId) {
              // console.log("");
              let str = subarray[ss].name
              str = str.replace(" ", "_");
              subproduct.push({ idids: subarray[ss].idids, name: subarray[ss].name, itemname: str, main_productId: subarray[ss].main_productId, main_sub_productId: subarray[ss].main_sub_productId, subof_subproduct: subof_subproduct })
              productCategoryData[pr].subproduct = subproduct;

            }
          }

          if (productCategoryData[pr].subproduct) {

            for (let sr = 0; sr < productCategoryData[pr].subproduct.length; sr++) {

              finalarr = [];
              var subArrId = productCategoryData[pr].subproduct[sr].idids;

              for (let n = 0; n < new_sub_arr.length; n++) {
                if (new_sub_arr[n].main_productId == subArrId) {
                  let str = new_sub_arr[n].name
                  str = str.trim();
                  str = str.toLowerCase();
                  // str = str.replace(" ", "_");
                  str = str.split(' ').join('_');
                  let replacementString = '-';
                  str = str.replace(/\//g, replacementString);

                  finalarr.push({ idids: new_sub_arr[n].idids, name: new_sub_arr[n].name, itemname: str, main_productId: new_sub_arr[n].main_productId, main_sub_productId: new_sub_arr[n].main_sub_productId })

                  productCategoryData[pr].subproduct[sr].subof_subproduct = finalarr

                }

              }


            }

          }


          if (subproduct.length) {

            output = [];


            subproduct.forEach(function (item) {
              var existing = output.filter(function (v, i) {
                return v.name == item.name;
              });

              if (existing.length) {
                var existingIndex = output.indexOf(existing[0]);
                output[existingIndex].subof_subproduct = output[existingIndex].subof_subproduct.concat(item.subof_subproduct);
              } else {
                if (typeof item.subof_subproduct == 'string')
                  item.subof_subproduct = [item.subof_subproduct];
                output.push(item);
              }

            });



            productCategoryData[pr].subproduct = output;


          }

        }

      }

      let prjectCategoryData_dup = [];
      let jj = 0
      if (productCategoryData) {
        for (let ii = 0; ii < productCategoryData.length; ii++) {
          if (productCategoryData[ii].main_productId == null &&
            productCategoryData[ii].main_sub_productId == null) {
            jj = jj + 1;
            if (jj < 6) {
              prjectCategoryData_dup.push(productCategoryData[ii])
            }
          }
        }
      }
      var data = {
        App: req.session.details,
        error: req.flash("error"),
        success: req.flash("success"),
        user: user,
        productCategoryData: productCategoryData,
        prjectCategoryData_dup: prjectCategoryData_dup,
        hidefrom_homepage: "true"
      };
      return res.render('frontend/otp_verify', data);
    } catch (e) {
      console.log("Error", e);
    }
  },
}

function getAccess(session, slug) {
  console.log("req.session.details", session);
  if (session.access) {
    return session.access[slug];
  } else {
    return 'true';
  }
}
