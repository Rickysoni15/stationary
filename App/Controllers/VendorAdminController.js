var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");
var mongoose = require('mongoose');
const axios = require("axios");
var bcrypt = require('bcryptjs');
var request = require('request');


const nodemailer = require('nodemailer');
// var defaultTransport = nodemailer.createTransport({
// 	service: 'gmail',
// 	host: 'smtp.gmail.com',
// 	auth: {
// 		user: Sys.Config.App.mailer.auth.user,
// 		pass: Sys.Config.App.mailer.auth.pass
// 	}
// });


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

	list: async function (req, res) {
		try {
			var data = {
				App: req.session.details,
				error: req.flash("error"),
				success: req.flash("success"),
				vendorActive: 'active',
			};
			// console.log("Datat", data);
			return res.render('backend/vendor/listVendor', data);
		} catch (e) {
			console.log("Error in VendorAdminController in list", e);
		}

	},
	vendor_Profile: async function (req, res) {
		console.log("session details id-----------> amar ", req.session);
		try {
			// req.flash('success', 'vendor updated successfully');

			let user = await Sys.App.Services.VendorProfileServices.getVendorData({ _id: req.session.details.id, is_deleted: "0" });
			var data = {
				App: req.session.details,
				Agent: req.session.details,
				error: req.flash("error"),
				success: req.flash("success"),
				user: user
			};

			console.log("vendor id db", user);
			return res.render('vendor_Profile.html', data);
		} catch (e) {
			console.log("Error in profile : ", e);
			return new Error(e);
		}
	},

	vendor_Profile__Admin: async function (req, res) {

		try {
			let user = await Sys.App.Services.VendorProfileServices.getVendorData({ _id: req.params.id, is_deleted: "0" });
			var data = {
				App: req.session.details,
				Agent: req.session.details,
				error: req.flash("error"),
				success: req.flash("success"),
				user: user
			};

			// console.log("vendor id db", user);
			return res.render('vendor_Profile.html', data);
		} catch (e) {
			console.log("Error in profile : ", e);
			return new Error(e);
		}
	},

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

	getVendor: async function (req, res) {

		try {
			let start = parseInt(req.query.start);
			let length = parseInt(req.query.length);
			let search = req.query.search.value;

			let query = {};
			if (search != '') {
				let capital = search;
				query = { vendor_first_name: { $regex: '.*' + search + '.*' }, is_deleted: "0" };
				// query = { productCategoryName: { $regex: '.*' + search + '.*' }, is_deleted: "0" };

			} else {
				query = { is_deleted: "0" };
			}

			let vendorCount = await Sys.App.Services.VendorProfileServices.getVendorCount(query);
			let data = await Sys.App.Services.VendorProfileServices.getByData(query, length, start);

			var obj = {
				'draw': req.query.draw,
				'recordsTotal': vendorCount,
				'recordsFiltered': vendorCount,
				'data': data,
			};
			// console.log('getVendor data', data);
			// console.log("categrrrrrrrydata", categoryname);

			res.send(obj);
		} catch (e) {
			console.log("Error in VendorAdminController in getVendor", e);
		}

	},

	editVendor: async function (req, res) {
		console.log("editvendor data ", req.params);
		try {

			let vendor = await Sys.App.Services.VendorProfileServices.getVendorData({
				_id: req.params.id
			});
			//  console.log(")))))))(((((((UPDATE CALL", vendor);

			return res.render('backend/vendor/addProduct', { vendor: vendor, vendorActive: 'active' });
		} catch (e) {
			console.log("Error in VendorAdminController in editProduct", e);
		}

	},

	editVendorPostData: async function (req, res) {


		console.log(" req.body  editVendorPostData ====>>", req.body);

		// console.log("body data ===============>>>>>>>>>>> ", req.body.pass_confirmation);
		// return false;
		// console.log("Image file", req.files);
		// console.log("dsdhshfsdf", req.params);
		// return false;
		try {


			let vendor = await Sys.App.Services.VendorProfileServices.getVendorData({ _id: req.body.vendorId });
			// console.log(")))))))(((((((UPDATE CALL", vendor);
			let last_VendorImg;
			if (vendor && vendor.vendor_image.length) {

				last_VendorImg = vendor.vendor_image[0].path;
			}


			// console.log("last_VendorImg",last_VendorImg);

			// return false;

			let updateData;
			var vendorImage = [];
			let vendorPassword;
			let userName;

			if (req.files) {

				if (last_VendorImg) {

					let imgUnlinkPath = './public' + last_VendorImg;
					fs.unlink(imgUnlinkPath, (err) => {
						if (err) throw err;

					});

				}

				// console.log("Image file",req.files);

				let singleimage_p = req.files.profileImg;
				console.log("Image vendior", singleimage_p);
				var re = /(?:\.([^.]+))?$/;
				var ext6 = re.exec(singleimage_p.name)[1];
				let singleImage_P = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext6;
				let singleImg = '/vendorImage/' + singleImage_P;
				// Use the mv() method to place the file somewhere on your server
				await singleimage_p.mv('./public/vendorImage/' + singleImage_P, async function (err) {
					if (err) {
						req.flash('Error in OurTeamController in postOurTeam', err);
						return res.redirect('ourTeam/addOurTeam');
					}
				});
				vendorImage.push({ path: '/vendorImage/' + singleImage_P, fileName: req.files.profileImg.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
			} else {
				vendorImage = vendor.vendor_image[0];
				console.log("hdaskjdaskdaskdaskdhaskdashd==========>>>>>>>");

				if (req.body.profile_Img == "1") {
					vendorImage = '';
					if (last_VendorImg) {

						let imgUnlinkPath = './public' + last_VendorImg;
						fs.unlink(imgUnlinkPath, (err) => {
							if (err) throw err;

						});

					}

				}

			}

			var newLable;

			if (req.body.pass == '' || req.body.pass == undefined) {
				vendorPassword = vendor.vendor_password;
				console.log("vendor pass check oooooooooooooooo");

			} else {
				vendorPassword = bcrypt.hashSync(req.body.pass_confirmation, bcrypt.genSaltSync(8), null)
				console.log("vendor pass check", vendorPassword);
			}
			if (req.body.userName == '' || req.body.userName == undefined) {
				userName = vendor.vendor_username;
			} else {
				userName = req.body.userName;


			}
			let newState;
			if (req.body.state) {
				newState = req.body.state;
			} else {
				newState = vendor.vendor_state;
			}

			if (vendor) {
				console.log("mobile number ===>>>", req.body.mobile);
				//shiprocket start
				var token;
				var token_arr = [];
				//step 1: Genrate Token
				// setTimeout(() => {
				// 	const options = {
				// 		method: 'POST',
                //         url: `https://apiv2.shiprocket.in/v1/external/auth/login`,
                //         headers: {
                //             'Content-Type': 'application/json',
                //         },
                //         data: {
                //             "email": "amar@kiraintrilogy.com",
                //             "password": "kira@1234"
                //         }
				// 	};
				// 	// console.log("options", options);
				// 	axios.request(options).then(function (response) {


				// 		console.log("response.data  fjflfi ====>> ", response.data);
				// 		req.session.shiprocket_token = response.data.token;
				// 		console.log("req.session.shiprocket_token............", req.session.shiprocket_token);
				// 		token = response.data.token;
				// 		token_arr.push(response.data.token)
				// 	}).catch(function (error) {
				// 		console.error(error);
				// 	});
				// }, 1000);

				console.log("vendor.pickup_address_lable ==", vendor);
				if (vendor.pickup_address_lable) {
					let pickupLable = vendor.pickup_address_lable;
					pickupLable = pickupLable.slice(-1);
					pickupLable = parseInt(pickupLable);
					// pickupLable = charAt(pickupLable.length -1);
					console.log("pickupLable 333=== >>", pickupLable);

					console.log("pickupLable 85858=== >>", pickupLable);
					console.log("pickupLable 111=== >>", typeof (pickupLable));

					console.log("( pickupLable !==  NaN) = ", (pickupLable !== NaN));

					if(isNaN(pickupLable)) {

						newLable = vendor.pickup_address_lable + 1
						console.log("newLable ===>> else ===", newLable);

						
					} else {
						let str = vendor.pickup_address_lable
						str = str.slice(0, -1);

						let NewpickupLable = parseInt(pickupLable)

						newLable = str + (NewpickupLable + 1);

						console.log("pickupLable ===>> number ===", newLable);
					}

				} else {
					newLable = vendor.vendor_company;
				}

				// setTimeout(() => {
				// 	// console.log("req.session.shiprocket_token....666666666........",req.session.shiprocket_token);
				// 	var bearer = 'Bearer ' + req.session.shiprocket_token;
				// 	console.log("req.session.shiprocket_token....bearer........",bearer);

				// 	console.log("newLable ===>> 0000000 ===", newLable);

				// 	// let phoneNo = parseInt(req.body.mobile);
				// 	var options = {
				// 		'method': 'POST',
				// 		'url': 'https://apiv2.shiprocket.in/v1/external/settings/company/addpickup',
				// 		'headers': {
				// 			'Authorization': bearer,//'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjI4MjAyNzcsImlzcyI6Imh0dHBzOi8vYXBpdjIuc2hpcHJvY2tldC5pbi92MS9leHRlcm5hbC9hdXRoL2xvZ2luIiwiaWF0IjoxNjYwNzM5MzQwLCJleHAiOjE2NjE2MDMzNDAsIm5iZiI6MTY2MDczOTM0MCwianRpIjoiajRCUUtXak04VlJrS1RFTiJ9.wfNkYLWWd63mOMzJn45lWa6ewlCyy71eF5llbc5BH9E',
				// 			'Content-Type': 'application/x-www-form-urlencoded'
				// 		},
				// 		form:{
				// 			'pickup_location': newLable,
				// 			'name': vendor.vendor_company,
				// 			'email': req.body.email,
				// 			'phone': req.body.mobile,
				// 			'address': req.body.addresstext_no + ' ,' + req.body.addresstext_name + ' ,' + req.body.landmark + ' ,' + req.body.city + ' ,' + req.body.pincode + ' ,' + newState,
				// 			'address_2': '',
				// 			'city': req.body.city,
				// 			'state': newState,
				// 			'country': 'India',
				// 			'pin_code': req.body.pincode,
				// 		}
				// 	};
				// 	request(options, function (error, response) {
				// 		if (error) throw new Error(error);
				// 		console.log("hjhhjhjh",response.body);

				// 	});


				// }, 5000);

                var state_code = req.body.vendor_gst_no.substring(0,2);

				updateData = {
					vendor_username: userName ? userName : '',
					vendor_company: vendor.vendor_company,
					vendor_email: (req.body.email) ? req.body.email : '',
					vendor_password: vendorPassword,
					vendor_phone: (req.body.mobile) ? req.body.mobile : '',
					vendor_image: vendorImage,
					vendor_pin: req.body.pincode,
					vendor_flatNo: req.body.addresstext_no,
					vendor_area: req.body.addresstext_name,
					vendor_Landmark: req.body.landmark,
					vendor_town: req.body.city,
					vendor_state: newState,
                    vendor_gst_no:req.body.vendor_gst_no,
					vendor_Gstcode: state_code,
					pickup_address_lable: newLable,
					pickup_address: {
						'name': vendor.vendor_company,
						'email': req.body.email,
						'phone': req.body.mobile,
						'address': req.body.addresstext_no + ' ,' + req.body.addresstext_name + ' ,' + req.body.landmark + ' ,' + req.body.city + ' ,' + req.body.pincode + ' ,' + newState,
						'city': req.body.city,
						'state': newState,
						'country': 'India',
						'pin_code': req.body.pincode
					},

					// error: req.flash("error"),
					// success: req.flash("success"),.
				}

				console.log("update vendor id", req.body.vendorId);
				// await Sys.App.Services.VendorProfileServices.updateVendorData({ _id: req.params.vendorId }, updateData)
				let updateVendorDetails = await Sys.App.Services.VendorProfileServices.updateVendorData(
					{ _id: req.body.vendorId },
					updateData
				)

                let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0", product_visibility: "1", venodor_id: vendor._id });
                // console.log("prodd",productData);
                if (productData) {
                    for (let p = 0; p < productData.length; p++) {
                        let id = mongoose.Types.ObjectId(productData[p]._id);
                        await Sys.App.Services.ProductServices.updateProductData({ _id: id },
                             {vendor_Gstcode: state_code})
                    }
                }
                

				req.flash('success', 'vendor updated successfully');



				// let user = await Sys.App.Services.VendorProfileServices.getVendorData({ _id: req.session.details.id, is_deleted: "0" });
				// var data = {
				// 	App: req.session.details,
				// 	session: req.session.details,
				// 	error: req.flash("error"),
				// 	success: req.flash("success"),
				// 	user: user
				// };
				// req.session.save(function (err) {
				// 	if (!err) {
				// 		req.flash('success', 'vendor updated successfully');
				// 		return res.render('backend/vendor_Profile', data);


				// 	}
				// });


				let totalUsers = await Sys.App.Services.UserServices.getUserCount({ role: 'user' });
				var data = {
					App: req.session.details,
					session: req.session.details,
					error: req.flash("error"),
					success: req.flash("success"),
					classActive: 'active',
					user: req.session.details,
					totalUsers: totalUsers
				};
				return res.render('backend/templates/vendor_dashboard', data);


			} else {
				console.log("eeeeeeeeeeeeeerrr");

				req.flash('error', 'vendor not update successfully');
				return res.redirect('/vendor_dashboard');
			}
		} catch (e) {
			console.log("Error", e);
		}

	},

	vendorDelete: async function (req, res) {
		try {
			let vendor = await Sys.App.Services.VendorProfileServices.getVendorData({ _id: req.body.id });
			// console.log("================");
			// console.log("vendorT", vendor);
			// console.log("}}}}}}}}}}{{{{{{{{{");

			if (vendor || vendor.length > 0) {
				await Sys.App.Services.VendorProfileServices.updateVendorData(
					{ _id: req.body.id },
					{
						is_deleted: "1"
					}
				)
				return res.send("success");
			} else {
				return res.send("error in VendorAdminController in vendorDelete");
			}
		} catch (e) {
			console.log("Erro in VendorAdminController in vendorDelete", e);
		}

	},



	vendor_email_verify: async function (req, res) {
		// console.log("check prams id", req.params);
		var successMessage = { status: 'success', message: "Vendor Email Verified!", data: {} };
		var failedMessage = { status: 'fail', message: "something went wrong", data: {} };
		var vendorAlreadyVerify = { status: 'success', message: "Vendor Alredy Register", data: {} };


		try {
			let vendor = await Sys.App.Services.VendorProfileServices.getVendorData({ _id: req.params.id });
			// if(!vendor) {
			// 	failedMessage.message = 'InvalidUser';
			// 	return res.status(404).send(failedMessage)
			// }

			console.log("email verify vendor", vendor);

			if (!vendor.emailVerified) {
				if (vendor.vendorApproval) {
					// vendor query here



					let updateVendorDetails = await Sys.App.Services.VendorProfileServices.updateVendorData(
						{ _id: req.params.id },
						{
							emailVerified: true,

						}
					)
					// console.log("email verified");
					req.flash(successMessage.message);
					res.redirect("/login_vendor");
					// if (updateVendorDetails) {
					// 	successMessage.message = 'VendorRegisteredSuccess';
					// 	return res.status(200).send(successMessage)
					// } else {
					// 	failedMessage.message = 'InvalidVendor';
					// 	return res.status(400).send(failedMessage)
					// }
				} else {
					failedMessage.message = 'InvalidVendorr'
					// res.redirect("/backend/vendor");
					// return res.status(401).send(failedMessage)
				}
			} else {
				console.log("alredy verify");
				req.flash(vendorAlreadyVerify.message);
				res.redirect("/login_vendor");
				// vendorAlreadyRegistered.message = 'vendorAlreadyRegistered'

				// return res.status(409).send(failedMessage)
			}
		} catch (err) {
			console.log("login_verity ", err)
			return res.status(400).send(failedMessage)
		}
	},

	approvedByAdmin: async function (req, res) {
		// console.log("checkapprove=====>>>", req.body);
		// console.log("prams=====>>>", req.prams);

		// console.log("session=====>>>", req.session.details,);

		// var host = window.location.origin;


		var successMessage = { status: 'success', message: "User Approved Successfully", data: {} };
		var failedMessage = { status: 'fail', message: "Something Went Wrong", data: {} };
		try {
			var v_password;
			// let adminDetail =  await Sys.App.Services.UserServices.getSingleUserData({_id: req.body.adminId});
			// console.log("::adminDetail::",adminDetail)

			let adminDetail = req.session.details;
			if (adminDetail && adminDetail.role == "admin") {
				let vendorDetail = await Sys.App.Services.VendorProfileServices.getVendorData({ _id: req.body.id });

				// console.log(":::vendorDetail:::",vendorDetail)
				// console.log(":::vendorDetail_gmail:::",vendorDetail.vendor_email)


				if (vendorDetail) {

					// console.log(":::vendorDetail_gmail:::",vendorDetail.vendor_email)

					let vendorId = req.body.id
					let emailId = vendorDetail.vendor_email

					// await model.User.findOneAndUpdate({_id:req.body.userId, is_deleted:"0"},{userApproval:true}, {new:true}).lean() // vendor query here
					var length = 6,
						charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$",
						v_password = "";
					for (var i = 0, n = charset.length; i < length; ++i) {
						v_password += charset.charAt(Math.floor(Math.random() * n));
					}


					console.log("retVal", v_password);
					await Sys.App.Services.VendorProfileServices.updateVendorData({ _id: req.body.id }, {
						vendorApproval: true,
						vendor_password: bcrypt.hashSync(v_password, bcrypt.genSaltSync(8), null),
					});


					// let baseUrl = req.headers.host + '/backend' // change url here
					// let uniqueId =create_UUID()
					// code for registration success message send to user email
					let url = `http://192.168.1.45:9001/vendor_email_verify/${vendorId}`

					console.log("email url === >>>", url);

					var mailOptions = {
						from: "intrilogykira@gmail.com",//config.smtp_sender_mail_id,
						// to: 'rahoul@kiraintrilogy.com',
						to: vendorDetail.vendor_email, //emailId, // register user's email
						subject: 'Approved Successfully',
						// text: `${passwordText}  ${env.BASE_URL}forgotpassword/${token}`
						html: '<html><body style="text-align: center; color:#000;background-color: #7f87ab;margin: 0 auto;font-family: Arial, Helvetica, sans-serif"><div style="position: relative;"><div style="position: relative; height: 250px; background-color: #7f87ab;"><div style="padding: 70px 0;font-size: 2vw;color: #fff; text-align: center;">OEMOne &uarr;</div></div><div style="background-color: #fff;width: 500px;margin: 0 auto;top: -75px;margin-bottom: 30px;position: relative;padding: 25px;z-index: 1"><div style="font-size: 24px;margin-bottom: 20px; text-align: center;">Greetings of the day</div><div style="font-size: 14px; text-align: left; line-height: 20px; margin: 20px 0;"><b>Congratulations,</b><br/><br/>You are one step ahead to access the Oemone, please click the link below and confirm your account. <br/><div style ="color:#000; font-weight:600"> Username : ' + vendorDetail.vendor_email + '</div><div  style ="color:#000; font-weight:600">Password :' + v_password + '</div><br/><a style="text-decoration: none;" href="' + url + '"><div style="padding: 10px 20px;background-color: #7f87ab;color: #fff;width: 100px;font-size: 17px;text-align: center;">Confirm</div></a> </div><div style="text-align: left;">Thank you</div><div style="text-align: left;margin-bottom: 10px;">Team OEMOne</div></div><div><div style="font-size: 12px;text-align: center; position: relative; top: -75px;">Email sent from <a href="http://www.oemone.shop/" target="_blank" title="Original Equipement Manufacturer | OEMup">http://www.oemone.shop/</a></div></div></div></body></html>'
					};
					defaultTransport.sendMail(mailOptions, function (err) {
						if (!err) {
							req.flash('success', 'An e-mail has been sent to ' + vendorDetail.vendor_email + ' with further instructions.');
							defaultTransport.close();
							return res.redirect('/forgot-password-organisation');
						} else {
							console.log(err);
							req.flash('error', 'Error sending mail,please try again After some time.');
							return res.redirect('/forgot-password-organisation');
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
					console.log("Email sent successfully");
					successMessage.message = "Email sent successfully";
					return res.send({ vendorDetail })

				} else {
					failedMessage.message = "vendorDetail not found";
					return res.send(failedMessage)
				}
			} else {
				failedMessage.message = "you are not authorized to perform this action";
				return res.send(failedMessage);
			}
		} catch (err) {
			console.log("::::approvedByAdmin::;Error::::", err)
			return res.send(failedMessage)
		}
	},



	approvedDeny: async function (req, res) {
		console.log("checkapprove=====>>>", req.body);
		// console.log("prams=====>>>", req.prams);

		// console.log("session=====>>>", req.session.details,);

		// var host = window.location.origin;


		var successMessage = { status: 'success', message: "vendor deny Successfully", data: {} };
		var failedMessage = { status: 'fail', message: "Something Went Wrong", data: {} };
		try {
			var v_password;
			// let adminDetail =  await Sys.App.Services.UserServices.getSingleUserData({_id: req.body.adminId});
			// console.log("::adminDetail::",adminDetail)

			let adminDetail = req.session.details;
			if (adminDetail && adminDetail.role == "admin") {
				let vendorDetail = await Sys.App.Services.VendorProfileServices.getVendorData({ _id: req.body.id });



				if (vendorDetail) {


					await Sys.App.Services.VendorProfileServices.updateVendorData({ _id: req.body.id }, {
						vendorApproval: false,
						is_deleted: '1',
						// vendor_password: bcrypt.hashSync(v_password, bcrypt.genSaltSync(8), null),
					});
					// console.log("vendorDetail",vendorDetail);
					// console.log("Deny successfully");
					successMessage.message = "Deny successfully";
					return res.send({ vendorDetail })

				} else {
					failedMessage.message = "vendorDetail not found";
					return res.send(failedMessage)
				}
			} else {
				failedMessage.message = "you are not authorized to perform this action";
				return res.send(failedMessage);
			}
		} catch (err) {
			console.log("::::approvedDeny::;Error::::", err)
			return res.send(failedMessage)
		}
	},






	// notApprovedVendorList : async function (req, res) {
	// 	var successMessage = { status: 'success', message: "notApprovedUserList Fetched Successfully",totalRecord:{},  data: {} };
	// 	var failedMessage = { status: 'fail', message: "Something Went Wrong",data: {} };
	// 	try {
	// 		if(!req.body || !req.body.adminId) {
	// 			failedMessage.message = 'Required Parameter Not Found!';
	// 			return res.status(400).send(failedMessage)
	// 		}
	// 		let adminDetail =  await Sys.App.Services.UserServices.getSingleUserData({_id: req.body.adminId});
	// 		if (adminDetail && adminDetail.role == "admin") {
	// 			let query ={
	// 				role : "vendor",
	// 				vendorApproval : false,
	// 				is_deleted: "0"
	// 			}

	// 			let notApprovedVendorList = await Sys.App.Services.VendorProfileServices.getByData({query}); // vendor find query here
	// 			//console.log("::::notApprovedUserList:::", notApprovedUserList.length);
	// 			successMessage.totalRecord = notApprovedUserList.length
	// 			successMessage.data = notApprovedVendorList;
	// 			return res.send(successMessage)
	// 		} else {
	// 			failedMessage.message = "you are not authorized to perform this action";
	// 			return res.send(failedMessage);
	// 		}

	// 	} catch (err) {
	// 		console.log(":::notApprovedVendorList:::Error::::", err);
	// 		return res.send(failedMessage)
	// 	}
	// }




	// verifyEmail : async function (req, res) {
	// 	var successMessage = { status: 'success', message: "Vendor Email Verified!", data: {} };
	// 	var failedMessage = { status: 'fail', message: "something went wrong", data: {} };

	// 	try {
	// 		let vendor = await Sys.App.Services.VendorProfileServices.getVendorData({_id: req.params.id});

	// 		if(!vendor) {
	// 			failedMessage.message = 'InvalidUser';
	// 			return res.status(404).send(failedMessage)
	// 		}

	// 		if(!vendor.emailVerified) {
	// 			if (vendor.vendorApproval) {
	// 				// vendor query here
	// 				let updateVendorDetails=  await Sys.App.Services.VendorProfileServices.updateVendorData(
	//                             { _id: req.body.id},
	//                             {
	//                                 emailVerified : true
	//                             }
	//                         )
	// 				if (updateVendorDetails) {
	// 					successMessage.message = 'VendorRegisteredSuccess';
	// 					return res.status(200).send(successMessage)
	// 				} else {
	// 					failedMessage.message = 'InvalidVendor';
	// 					return res.status(400).send(failedMessage)
	// 				}
	// 			} else {
	// 				failedMessage.message = 'InvalidVendorr'
	// 				return res.status(401).send(failedMessage)
	// 			}
	// 		} else {
	// 			failedMessage.message= 'vendorAlreadyRegistered'
	// 			return res.status(409).send(failedMessage)
	// 		}
	// 	} catch (err) {
	// 		console.log("verifyEmail ", err)
	// 		return res.status(400).send(failedMessage)
	// 	}
	// }

	/*
	module.denyRequest = async function (req, res) {
		var successMessage = { status: 'success', message: "User Request Denied", data: {} };
		var failedMessage = { status: 'fail', message: "something went wrong", data: {} };

		try {
		
			let adminId = req.body.adminId;
			let validateSuperUser = await model.User.findOne({
				'_id' : adminId,
				'is_deleted' : '0',
				'role' : 'admin'
			});

			if (validateSuperUser) {
				// remove deny vendor query below
				let getUserId = req.body.userId
				let removeUser = await model.User.findOneAndRemove({
					'_id' : getUserId
				})
				if (removeUser) {
					successMessage.message = 'User Request Denied!'
					return res.status(200).send(successMessage)
				} else {
					return res.status(400).send(failedMessage)
				}
			} else {
				failedMessage.message = 'You are not authorized to access this operation!';
				return res.status(401).send(failedMessage)
			}
		} catch (err) {
			console.log("denyRequest ", err);
			return res.status(400).send(failedMessage)
		}
	}
	*/

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

