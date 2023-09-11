var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");
var mongoose = require('mongoose');
const axios = require("axios");
var bcrypt = require('bcryptjs');
var request = require('request');
const datetime = require('date-and-time');


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
				commisionActive: 'active',
			};
			// console.log("Datat", data);
			return res.render('backend/commision/listCommision', data);
		} catch (e) {
			console.log("Error in commisionAdminController in list", e);
		}

	},

	getCommision: async function (req, res) {

		try {
			let start = parseInt(req.query.start);
			let length = parseInt(req.query.length);
			let search = req.query.search.value;

            let commision_data = await Sys.App.Services.CommisionServices.getByData({ is_deleted: "0" });    
            // if(commision_data){
            //     for (let d = 0; d < commision_data.length; d++) {
    
            //             let today = new Date();
            //             let year = today.getFullYear();
            //             let mes = today.getMonth() + 1;
            //             let dia = today.getDate();
    
            //             if (mes.toString().length == 2) {
            //                 // if (toString(mes).length == 2) {
            //                 mes = "-" + mes
            //             }else{
            //                 mes = "-0" + mes
            //             }
            //             console.log("sssssssss",dia.toString().length);
            //             if (dia.toString().length == 2) {
            //                 // if (toString(dia).length == 2) {
            //                 dia = "-" + dia 
            //             }else{
            //                 dia = "-0" + dia
            //             }
    
            //             let fecha = year + mes + dia;
            //             console.log("type of ===>>========================================");
            //             console.log("type of ===>>", fecha);
            //             console.log("type of ===>>========================================");
            //             // console.log("type of ===>>", couponcode_data[d].couponcode_startdate,couponcode_data[d].couponcode_enddate);
            //             // console.log("type of ===>>", couponcode_data[d].couponcode_enddate >= fecha);
            //             // console.log("type of ===>>",typeof(couponcode_data[d].couponcode_startdate));
            //             // console.log("vvvend::",new Date(couponcode_data[d].couponcode_enddate) >= new Date(fecha));
            //             // console.log("vvv","end::",couponcode_data[d].couponcode_enddate ,"kkk", fecha);
            //             // console.log("vvv","end::",new Date(couponcode_data[d].couponcode_enddate) ,"kkk", new Date(fecha));
                        
            //             if (couponcode_data[d].couponcode_startdate != undefined && couponcode_data[d].couponcode_enddate != undefined) {
            //                 let x = couponcode_data[d].couponcode_enddate;
            //                 let y = fecha;
            //                 let z = couponcode_data[d].couponcode_startdate;
            //                 if (z <= y && y <= x) {
            //                     await Sys.App.Services.CouponcodeServices.updateVendorData({ _id: couponcode_data[d]._id },
            //                         {
            //                             $set: {
            //                                 is_expire: "true"
            //                             }
            //                         })
            //                 }
            //             }
            //     }}

			let query = {};
			if (search != '') {
				let capital = search;
				query = { commision: { $regex: '.*' + search + '.*' }, is_deleted: "0", is_expire: "false" };
				// query = { productCategoryName: { $regex: '.*' + search + '.*' }, is_deleted: "0" };

			} else {
				query = { is_deleted: "0", is_expire: "false" };
			}

			let vendorCount = await Sys.App.Services.CommisionServices.getVendorCount(query);
			let data = await Sys.App.Services.CommisionServices.getByData(query, length, start);


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
			console.log("Error in commisionAdminController in getVendor", e);
		}

	},

    addCommision: async function (req, res) {
		try {
            var d = new Date();

            var previous_date = datetime.format(d, 'YYYY-MM-DD');

			var data = {
				App: req.session.details,
				error: req.flash("error"),
				success: req.flash("success"),
				commisionActive: 'active',
                previous_date: previous_date
			};
			// console.log("Datat", data);
			return res.render('backend/commision/addCommision', data);
		} catch (e) {
			console.log("Error in couponcodeAdminController in list", e);
		}

	},

    addPostCommision: async function (req, res) {
        try {
            console.log("req.body :: ",req.body);
            let commision_get_data = await Sys.App.Services.CommisionServices.getVendorData({ commision: req.body.commision, is_deleted: "0" });
            console.log("couponcode_get_data :: ",commision_get_data);
            
            if(commision_get_data){
                console.log("commision Name already Exists")
                req.flash('error', "commision is Already Exists!");
                return res.redirect('/backend/commision');
            }
            let commision_data = await Sys.App.Services.CommisionServices.addVendor({
                commision: req.body.commision,
                // discount_amount: req.body.discount_amount,
                // couponcode_text: req.body.couponcode_text,
                // couponcode_type: req.body.couponcode_type,
                // couponcode_startdate : req.body.couponcode_startdate,
                // couponcode_enddate : req.body.couponcode_enddate,
                // is_expire: "false"
            });
            console.log("commision_data create", commision_data);
            // console.log("PRODUCT AFTER INSERT DAta", product);
            req.flash('success','Create Successfully');
            return res.redirect('/backend/commision');
        } catch (error) {
            console.log("Error in commisionController in addPostcommision", error);
        }
    },

    editCommision: async function (req, res) {
		try {
            console.log("req.params :: ",req.params);
            let commisionData = await Sys.App.Services.CommisionServices.getVendorData({ _id: req.params.id });
			console.log("commision data edit :: ",commisionData);
            var d = new Date();
            // d.setDate(d.getDate() - 1);
            var previous_date = datetime.format(d, 'YYYY-MM-DD');
            var data = {
				App: req.session.details,
				error: req.flash("error"),
				success: req.flash("success"),
				commisionActive: 'active',
                commisionData: commisionData,
                previous_date: previous_date
			};
			// console.log("Datat", data);
			return res.render('backend/commision/addCommision', data);
		} catch (e) {
			console.log("Error in commisionAdminController in list", e);
		}

	},

    editPostCommision: async function (req, res) {

        // console.log("productAdmin session ", req.body.relatable_product);

        // return false;

        try {
           
            let commision_get_data = await Sys.App.Services.CommisionServices.getVendorData({ _id: req.body.id });
            if(commision_get_data){
            
                let commision_data = await Sys.App.Services.CommisionServices.updateVendorData(
                    { _id: commision_get_data._id },{
                        commision: req.body.commision,
                    // discount_amount: req.body.discount_amount,
                    // couponcode_text: req.body.couponcode_text,
                    // couponcode_type: req.body.couponcode_type,
                    // couponcode_startdate : req.body.couponcode_startdate,
                    // couponcode_enddate : req.body.couponcode_enddate,
                    // is_expire: "false"
                });
            }
            // console.log("product create", product);
            // console.log("PRODUCT AFTER INSERT DAta", product);
            req.flash('success','Updated Successfully');
            return res.redirect('/backend/commision');
        } catch (error) {
            console.log("Error in commisionController in commision", error);
        }
    },

    deleteCommision: async function (req, res) {
		try {
            console.log("req.body :: ",req.params);
            let commision_data = await Sys.App.Services.CommisionServices.getVendorData({ _id: req.params.id });
			console.log("commision_data delete :: ",commision_data);

            if(commision_data){
            
                await Sys.App.Services.CommisionServices.updateVendorData(
                    { _id: commision_data._id },{
                    is_deleted: "1"
                });
                res.send('success');
            }else{
                res.send('error');
            }
			// console.log("Datat", data);
			// return res.render('backend/couponcode/addCouponcode', data);
		} catch (e) {
			console.log("Error in commisionAdminController in list", e);
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

