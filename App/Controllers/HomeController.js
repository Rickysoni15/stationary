var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');
var fs = require("fs"); //Load the filesystem module
var jwt = require('jsonwebtoken');

var jwtcofig = {
    'secret': 'KiraJwtAuth'
};
const date = require('date-and-time');

const datetime = require('date-and-time');

const Razorpay = require('razorpay')
var instance = new Razorpay({
    // key_id: 'rzp_test_U3FPfrQYtumZc4',
    // key_secret: 'ohCUnvgcMwQJ41BkYrk23kY8'

    key_id: 'rzp_live_N9edmzFq0ljDrz',
    key_secret: 'tHsVxh6vmTzXIeXCJdyUJwzh'
})

// nodemialer to send email
const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: Sys.Config.App.mailer.auth.user,
        pass: Sys.Config.App.mailer.auth.pass
    }
});


// var smtpTransport = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     auth: {
//         user: "amazonpricetracker0@gmail.com",
//         pass: "Kfbe75yXwUgfb"
//     }
// });

const moment = require('moment');
var mongoose = require('mongoose');
const { get } = require('http');
const f = require('session-file-store');

module.exports = {

    home: async function (req, res) {

        console.log("home controller session ===>>", req.session.details);
        try {

            // let project = await Sys.App.Services.HomeServices.getByData({});
            // if(project){
            //     project = project[0];
            // }

            // let homeData = await Sys.App.Services.HomeServices.getByData({ is_deleted: "0" });
            // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0", product_visibility: "1" });
            // let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });

            // let rating = { product_rating: -1 }
            // let datafind = { is_deleted: "0", product_visibility: "1" }

            // let topRated = await Sys.App.Services.ProductServices.getByRating(datafind, rating);

            // for (let d = 0; d < topRated.length; d++) {

            //     if (topRated[d].is_discount == 1) {


            //         let today = new Date();
            //         let year = today.getFullYear();
            //         let mes = today.getMonth() + 1;

            //         let dia = today.getDate();

            //         if (mes.toString().length == 2) {

            //             mes = "-" + mes

            //         }else{
            //             mes = "-0" + mes

            //         }

            //         if (dia.toString().length == 2) {

            //             dia = "-" + dia

            //         }else{
            //             dia = "-0" + dia

            //         }


            //         let fecha = year + mes + dia;

            //         // if (topRated[d].discount_startDate <= fecha && topRated[d].discount_endDate >= fecha) {
            //             let x = topRated[d].discount_endDate;
            //             let y = fecha;
            //             let z = topRated[d].discount_startDate;

            //             console.log("x,,z",x,z);
            //             console.log("y",y);
            //             console.log("cond",z <= y && x <= y);
            //             if (z <= y && y <= x) {
            //         // if (x >= y) {
            //             await Sys.App.Services.ProductServices.updateProductData({ _id: topRated[d]._id },
            //                 {
            //                     $set: {
            //                         discount_start: "true"
            //                     }
            //                 })
            //         } else {
            //             await Sys.App.Services.ProductServices.updateProductData({ _id: topRated[d]._id },
            //                 {
            //                     $set: {
            //                         discount_start: "false"
            //                     }
            //                 })
            //         }

            //     }

            // }

            // let topRatedFinal = await Sys.App.Services.ProductServices.getByRating(datafind, rating);

            // let bestSeller = await Sys.App.Services.ProductServices.getProductDatatable({ is_deleted: "0", product_visibility: "1" });
            // for (let d = 0; d < bestSeller.length; d++) {

            //     if (bestSeller[d].is_discount == 1) {

            //         let today = new Date();
            //         let year = today.getFullYear();
            //         let mes = today.getMonth() + 1;

            //         let dia = today.getDate();

            //         if (mes.toString().length == 2) {

            //             mes = "-" + mes

            //         }else{
            //             mes = "-0" + mes

            //         }

            //         if (dia.toString().length == 2) {

            //             dia = "-" + dia

            //         }else{
            //             dia = "-0" + dia

            //         }


            //         let fecha = year + mes + dia;

            //         // if (bestSeller[d].discount_startDate <= fecha && bestSeller[d].discount_endDate >= fecha) {
            //             // let x = new Date(bestSeller[d].discount_endDate);
            //             // let y = new Date(fecha);
            //             // let z = new Date(bestSeller[d].discount_startDate);
            //             let x = bestSeller[d].discount_endDate;
            //             let y = fecha;
            //             let z = bestSeller[d].discount_startDate;

            //             // console.log("x",x,"y",y);
            //             // console.log("============",x <= y);
            //             // console.log("x,,z",x,z);
            //             // console.log("y",y);
            //             // console.log("cond88888",z <= y && y <= x);
            //             // console.log("cond88888",z <= y , y <= x);
            //             if (z <= y && y <= x) {
            //         // if (x >= y) {
            //             await Sys.App.Services.ProductServices.updateProductData({ _id: bestSeller[d]._id },
            //                 {
            //                     $set: {
            //                         discount_start: "true"
            //                     }
            //                 })
            //         } else {
            //             await Sys.App.Services.ProductServices.updateProductData({ _id: bestSeller[d]._id },
            //                 {
            //                     $set: {
            //                         discount_start: "false"
            //                     }
            //                 })
            //         }

            //     }

            // }
            // let bestSellerFinal = await Sys.App.Services.ProductServices.getProductDatatable({ is_deleted: "0", product_visibility: "1" });

            // let new_arrival_productdata = await Sys.App.Services.ProductServices.getByDatasort({ is_deleted: "0", product_visibility: "1" });

            // for (let d = 0; d < new_arrival_productdata.length; d++) {

            //     if (new_arrival_productdata[d].is_discount == 1) {

            //         let today = new Date();
            //         let year = today.getFullYear();
            //         let mes = today.getMonth() + 1;

            //         let dia = today.getDate();

            //         if (mes.toString().length == 2) {

            //             mes = "-" + mes

            //         }else{
            //             mes = "-0" + mes

            //         }

            //         if (dia.toString().length == 2) {

            //             dia = "-" + dia

            //         }else{
            //             dia = "-0" + dia

            //         }


            //         let fecha = year + mes + dia;

            //         // if (new_arrival_productdata[d].discount_startDate <= fecha && new_arrival_productdata[d].discount_endDate >= fecha) {
            //             let x = new_arrival_productdata[d].discount_endDate;
            //             let y = fecha;
            //             let z = new_arrival_productdata[d].discount_startDate;
            //             console.log("x,,z",x,z);
            //             console.log("y",y);
            //             console.log("cond999",z <= y && x <= y);
            //             if (z <= y && y <= x) {
            //         // if (x >= y) {
            //             await Sys.App.Services.ProductServices.updateProductData({ _id: new_arrival_productdata[d]._id },
            //                 {
            //                     $set: {
            //                         discount_start: "true"
            //                     }
            //                 })
            //         } else {
            //             await Sys.App.Services.ProductServices.updateProductData({ _id: new_arrival_productdata[d]._id },
            //                 {
            //                     $set: {
            //                         discount_start: "false"
            //                     }
            //                 })
            //         }

            //     }

            // }

            // let new_arrival_productdataFinal = await Sys.App.Services.ProductServices.getByDatasort({ is_deleted: "0", product_visibility: "1" });


            // let feature_productdata = await Sys.App.Services.ProductServices.getByDatalimit({ is_deleted: "0", product_visibility: "1" });

            // for (let d = 0; d < feature_productdata.length; d++) {

            //     if (feature_productdata[d].is_discount == 1) {

            //         let today = new Date();
            //         let year = today.getFullYear();
            //         let mes = today.getMonth() + 1;

            //         let dia = today.getDate();

            //         if (mes.toString().length == 2) {

            //             mes = "-" + mes

            //         }else{
            //             mes = "-0" + mes

            //         }

            //         if (dia.toString().length == 2) {

            //             dia = "-" + dia

            //         }else{
            //             dia = "-0" + dia

            //         }


            //         let fecha = year + mes + dia;
            //         // if (feature_productdata[d].discount_startDate <= fecha && feature_productdata[d].discount_endDate >= fecha) {
            //             let x = feature_productdata[d].discount_endDate;
            //             let y = fecha;
            //             let z = feature_productdata[d].discount_startDate;
            //             console.log("x,,z",x,z);
            //             console.log("y",y);
            //             console.log("con9999d",z <= y && x <= y);
            //             if (z <= y && y <= x) {
            //         // if (x >= y) {
            //             await Sys.App.Services.ProductServices.updateProductData({ _id: feature_productdata[d]._id },
            //                 {
            //                     $set: {
            //                         discount_start: "true"
            //                     }
            //                 })
            //         } else {
            //             await Sys.App.Services.ProductServices.updateProductData({ _id: feature_productdata[d]._id },
            //                 {
            //                     $set: {
            //                         discount_start: "false"
            //                     }
            //                 })
            //         }

            //     }

            // }


            // let feature_productdataFinal = await Sys.App.Services.ProductServices.getByDatalimit({ is_deleted: "0", product_visibility: "1" });


            // let addtocart;
            // if (req.session.details) {
            //     addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });

            // }

            // let wishlist = null;
            // if (req.session.details) {
            //     wishlist = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });
            // }

            // let wishlist_id1;
            // for (let i = 0; i < topRated.length; i++) {

            //     if (wishlist) {

            //         for (const element of wishlist.wishlist_arr) {
            //             if (element == topRated[i]._id.toString()) {
            //                 wishlist_id1 = element;
            //             }
            //         }

            //     }
            //     topRated[i].wishlist_arr = wishlist_id1
            // }

            // let subarray = [];
            // let setids = [];
            // let new_sub_arr = [];
            // let subproduct;
            // let subof_subproduct = [];

            // var finalarr = [];

            // if (productCategoryData) {
            //     for (let p = 0; p < productCategoryData.length; p++) {

            //         if (productCategoryData[p].main_productId == null) {
            //             setids.push(productCategoryData[p]._id)
            //         }
            //         for (let s = 0; s < setids.length; s++) {
            //             if (setids[s] == productCategoryData[p].main_productId) {
            //                 subarray.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
            //             }
            //         }
            //         if (productCategoryData[p].main_productId != null && productCategoryData[p].main_sub_productId != null) {
            //             new_sub_arr.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
            //         }
            //     }
            //     // console.log("new ARRAy=========",subarray,subarray.length);
            //     for (let pr = 0; pr < productCategoryData.length; pr++) {
            //         subproduct = [];

            //         var subArrId = productCategoryData[pr]._id.toString()
            //         for (let ss = 0; ss < subarray.length; ss++) {

            //             if (subarray[ss].main_productId == subArrId) {
            //                 // console.log("");
            //                 let str = subarray[ss].name
            //                 str = str.replace(" ", "_");
            //                 subproduct.push({ idids: subarray[ss].idids, name: subarray[ss].name, itemname: str, main_productId: subarray[ss].main_productId, main_sub_productId: subarray[ss].main_sub_productId, subof_subproduct: subof_subproduct })
            //                 productCategoryData[pr].subproduct = subproduct;

            //             }
            //         }
            //         if (productCategoryData[pr].subproduct) {



            //             for (let sr = 0; sr < productCategoryData[pr].subproduct.length; sr++) {

            //                 // console.log("productCategoryData[pr].subproduct===",productCategoryData[pr].subproduct[sr].name);
            //                 finalarr = [];
            //                 var subArrId = productCategoryData[pr].subproduct[sr].idids;

            //                 for (let n = 0; n < new_sub_arr.length; n++) {
            //                     if (new_sub_arr[n].main_productId == subArrId) {
            //                         let str = new_sub_arr[n].name
            //                         str = str.trim();
            //                         str = str.toLowerCase();
            //                         // str = str.replace(" ", "_");
            //                         str = str.split(' ').join('_');
            //                         let replacementString = '-';
            //                         str = str.replace(/\//g, replacementString);

            //                         finalarr.push({ idids: new_sub_arr[n].idids, name: new_sub_arr[n].name, itemname: str, main_productId: new_sub_arr[n].main_productId, main_sub_productId: new_sub_arr[n].main_sub_productId })


            //                         productCategoryData[pr].subproduct[sr].subof_subproduct = finalarr


            //                     }

            //                 }


            //             }


            //         }




            //         if (subproduct.length) {

            //             let output = [];
            //             let suboutput = [];


            //             subproduct.forEach(function (item) {
            //                 var existing = output.filter(function (v, i) {
            //                     return v.name == item.name;
            //                 });

            //                 if (existing.length) {
            //                     var existingIndex = output.indexOf(existing[0]);
            //                     output[existingIndex].subof_subproduct = output[existingIndex].subof_subproduct.concat(item.subof_subproduct);
            //                 } else {
            //                     if (typeof item.subof_subproduct == 'string')
            //                         item.subof_subproduct = [item.subof_subproduct];
            //                     output.push(item);
            //                 }


            //             });


            //             productCategoryData[pr].subproduct = output;


            //         }

            //     }

            // }

            // let prjectCategoryData_dup = [];
            // let jj = 0
            // if (productCategoryData) {
            //     for (let ii = 0; ii < productCategoryData.length; ii++) {
            //         if (productCategoryData[ii].main_productId == null &&
            //             productCategoryData[ii].main_sub_productId == null) {
            //             jj = jj + 1;
            //             if (jj < 6) {
            //                 prjectCategoryData_dup.push(productCategoryData[ii])
            //             }
            //         }
            //     }
            // }

            // var data = {
            //     App: req.session.details,
            //     error: req.flash("error"),
            //     success: req.flash("success"),
            //     home: 'active',
            //     productCategoryData: productCategoryData,
            //     prjectCategoryData_dup: prjectCategoryData_dup,
            //     homeData: homeData,
            //     productData: productData,
            //     new_arrival_data: new_arrival_productdataFinal,
            //     feature_productdata: feature_productdataFinal,
            //     addtocart: addtocart,
            //     topRated: topRatedFinal,
            //     bestSeller: bestSellerFinal,
            //     project :project,
            //     hidefrom_homepage:"true",
            //     // productName : productName,
            // };
            // console.log("hhhhhhhhhdhdhdhdhdhdhdhdh================>>>>>>>>>>>>>>>>>>>>>>",homeData);

            // console.log(data, "homeprojectDatacontroller");
            // return res.render('frontend/bookclub/index', data);

            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });

            for (let i = 0; i < productData.length; i++) {

                productData[i].product_price = parseFloat(productData[i].product_price)

                productData[i].product_description = productData[i].product_description.replace(/(<([^>]+)>)/ig, '');
                let gstRate = (productData[i].GST_rate) / 100
                // console.log(":::gstRate:::", gstRate);
                productData[i].taxValue = (parseFloat(productData[i].product_price) * gstRate).toFixed(2)
                // console.log("::productData.taxValue:::",productData[i].taxValue);
                productData[i].imageSrc = ""
                productData[i].imageSrc = `http://localhost:4002${productData[i].product_defaultImg[0].path}`
            }

            // console.log(":::productData:::",productData);

            let productCategory = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0", main_productId: null })

            // console.log(":::productCategory:::", productCategory);

            // let findAddtoCartDetail = await Sys.App.Services.OrderServices.getUserData({customer_id:"64e33fa174ffcb15a419a2a6"})
            // console.log(":::findAddtoCartDetail::::",findAddtoCartDetail);

            let dataObj = {
                productData: productData,
                productCategoryData: productCategory,
                productCount: productData.length
            }

            //   let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });


            //   if (req.session.details) {
            //     addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });

            //   }

            // return res.render('frontend/product', dataObj);

            return res.render('frontend/index', dataObj);

        } catch (e) {
            console.log("Error home", e);
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




    // login: async function (req, res) {
    //     try {
    //         // let homeData = await Sys.App.Services.HomeServices.getByData({is_deleted:"0"});
    //         // let productData = await Sys.App.Services.ProductServices.getByData({is_deleted:"0"});
    //         // // let prjectCategoryData = await Sys.App.Services.ProjectCategoryServices.getByData({});
    //         // let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0"});
    //         let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
    //         let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });


    //         let subarray = [];
    //         let setids = [];
    //         let new_sub_arr = [];
    //         let subproduct;
    //         let subof_subproduct = [];

    //         var finalarr = [];

    //         if (productCategoryData) {
    //             for (let p = 0; p < productCategoryData.length; p++) {

    //                 if (productCategoryData[p].main_productId == null) {
    //                     setids.push(productCategoryData[p]._id)
    //                 }
    //                 for (let s = 0; s < setids.length; s++) {
    //                     if (setids[s] == productCategoryData[p].main_productId) {
    //                         subarray.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
    //                     }
    //                 }
    //                 if (productCategoryData[p].main_productId != null && productCategoryData[p].main_sub_productId != null) {
    //                     new_sub_arr.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
    //                 }
    //             }
    //             // console.log(new_sub_arr);
    //             for (let pr = 0; pr < productCategoryData.length; pr++) {
    //                 subproduct = [];

    //                 var subArrId = productCategoryData[pr]._id.toString()
    //                 for (let ss = 0; ss < subarray.length; ss++) {

    //                     if (subarray[ss].main_productId == subArrId) {
    //                         // console.log("");
    //                         let str = subarray[ss].name
    //                         str = str.replace(" ", "_");
    //                         subproduct.push({ idids: subarray[ss].idids, name: subarray[ss].name, itemname: str, main_productId: subarray[ss].main_productId, main_sub_productId: subarray[ss].main_sub_productId, subof_subproduct: subof_subproduct })
    //                         productCategoryData[pr].subproduct = subproduct;

    //                     }
    //                 }

    //                 if (productCategoryData[pr].subproduct) {

    //                     for (let sr = 0; sr < productCategoryData[pr].subproduct.length; sr++) {

    //                         finalarr = [];
    //                         var subArrId = productCategoryData[pr].subproduct[sr].idids;

    //                         for (let n = 0; n < new_sub_arr.length; n++) {
    //                             if (new_sub_arr[n].main_productId == subArrId) {
    //                                 let str = new_sub_arr[n].name
    //                                 str = str.trim();
    //                                 str = str.toLowerCase();
    //                                 // str = str.replace(" ", "_");
    //                                 str = str.split(' ').join('_');
    //                                 let replacementString = '-';
    //                                 str = str.replace(/\//g, replacementString);

    //                                 finalarr.push({ idids: new_sub_arr[n].idids, name: new_sub_arr[n].name, itemname: str, main_productId: new_sub_arr[n].main_productId, main_sub_productId: new_sub_arr[n].main_sub_productId })


    //                                 productCategoryData[pr].subproduct[sr].subof_subproduct = finalarr


    //                             }

    //                         }


    //                     }


    //                 }


    //                 if (subproduct.length) {

    //                     output = [];


    //                     subproduct.forEach(function (item) {
    //                         var existing = output.filter(function (v, i) {
    //                             return v.name == item.name;
    //                         });

    //                         if (existing.length) {
    //                             var existingIndex = output.indexOf(existing[0]);
    //                             output[existingIndex].subof_subproduct = output[existingIndex].subof_subproduct.concat(item.subof_subproduct);
    //                         } else {
    //                             if (typeof item.subof_subproduct == 'string')
    //                                 item.subof_subproduct = [item.subof_subproduct];
    //                             output.push(item);
    //                         }

    //                     });



    //                     productCategoryData[pr].subproduct = output;


    //                 }

    //             }

    //         }


    //         let prjectCategoryData_dup = [];
    //         let jj = 0
    //         if (productCategoryData) {
    //             for (let ii = 0; ii < productCategoryData.length; ii++) {
    //                 if (productCategoryData[ii].main_productId == null &&
    //                     productCategoryData[ii].main_sub_productId == null) {
    //                     jj = jj + 1;
    //                     if (jj < 6) {
    //                         prjectCategoryData_dup.push(productCategoryData[ii])
    //                     }
    //                 }
    //             }
    //         }



    //         var data = {
    //             App: req.session.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             // home: 'active',

    //             productCategoryData: productCategoryData,

    //             prjectCategoryData_dup: prjectCategoryData_dup,
    //             hidefrom_homepage: "true"

    //             // homeData: homeData,
    //             // productData: productData,
    //         };
    //         // console.log("hhhhhhhhhdhdhdhdhdhdhdhdh================>>>>>>>>>>>>>>>>>>>>>>",homeData);

    //         // console.log(projectData, "homeprojectDatacontroller");
    //         console.log("home session ======>>> ", req.session.role);
    //         if (req.session.role == 'vendor') {
    //             return res.redirect('/login_vendor')
    //         } else {
    //             console.log(":::else condition in login controller::::");
    //             return res.render('frontend/login', data);
    //         }
    //     } catch (e) {
    //         console.log("Error login", e);
    //     }
    // },

    vendor_Login: async function (req, res) {
        try {
            // let homeData = await Sys.App.Services.HomeServices.getByData({is_deleted:"0"});
            // let productData = await Sys.App.Services.ProductServices.getByData({is_deleted:"0"});
            // // let prjectCategoryData = await Sys.App.Services.ProjectCategoryServices.getByData({});
            // let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0"});
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
                productCategoryData: productCategoryData,

                prjectCategoryData_dup: prjectCategoryData_dup,
                hidefrom_homepage: "true"
                // home: 'active',

                // productCategoryData: productCategoryData,
                // homeData: homeData,
                // productData: productData,
            };

            return res.render('frontend/user_login', data);
            // console.log("hhhhhhhhhdhdhdhdhdhdhdhdh================>>>>>>>>>>>>>>>>>>>>>>",homeData);

            // console.log(projectData, "homeprojectDatacontroller");
            // console.log("home session ======>>> ",req.session.role);
            // if (req.session.role == 'vendor') {
            //     return res.render('frontend/user_login', data);
            // } else {
            //     return res.render('frontend/user_login', data);
            // }
        } catch (e) {
            console.log("Error login", e);
            return res.render('frontend/user_login', data);

        }
    },

    // loginPost_vendor: async function (req, res) {
    //
    //     try {
    //
    //         console.log("req.body.email->", req.body);
    //
    //
    //         let vendor = null;
    //         vendor = await Sys.App.Services.VendorProfileServices.getByData({ vendor_email: req.body.vendor_email });
    //         if (vendor == null || vendor.length == 0) {
    //             req.flash('error', 'No Such User Found');
    //
    //             var obj = {
    //                 App: req.session.details,
    //                 // Agent: req.session.details,
    //                 error: req.flash("error"),
    //                 success: req.flash("success"),
    //                 role: 'vendor',
    //                 // email_Alredy: req.flash("email_Alredy"),
    //
    //             };
    //
    //             console.log("vendor not found =====>>>");
    //
    //             return res.render('frontend/register_vendor', obj);
    //             // return res.redirect('/login_vendor');
    //         }
    //
    //         if (vendor[0].vendorApproval == false ||  vendor[0].emailVerified == false){
    //             req.flash('error', 'Email Not Verified');
    //
    //
    //             var obj = {
    //                 App: req.session.details,
    //                 // Agent: req.session.details,
    //                 error: req.flash("error"),
    //                 success: req.flash("success"),
    //                 role: 'vendor',
    //                 // email_Alredy: req.flash("email_Alredy"),
    //
    //             };
    //
    //             console.log("Email Not Verified");
    //
    //
    //             return res.render('frontend/register_vendor', obj);
    //             // return res.redirect('/login_vendor');
    //         }
    //
    //
    //
    //         // console.log("vendor_password home ",vendor_password);
    //         var passwordTrue;
    //         console.log("vendor login check =====>>>", vendor[0]);
    //
    //         // return false;
    //
    //         if (bcrypt.compareSync(req.body.vendor_password, vendor[0].vendor_password)) {
    //             passwordTrue = true;
    //         } else {
    //             passwordTrue = false;
    //         }
    //         if (passwordTrue == true) {
    //             // console.log("Users-=======>", Sys.App.Services.VendorProfileServices);
    //             // let User = await Sys.App.Services.UserServices.getByData({email:req.body.email});
    //
    //             // set jwt token
    //
    //             // console.log("vendor id =====>>>", vendor[0].role);
    //
    //             var token = jwt.sign({ id: vendor._id }, jwtcofig.secret, {
    //                 expiresIn: 60 * 60 * 24 // expires in 24 hours
    //             });
    //             // console.log("vendor token ==>", token);
    //             //console.log("Token",token);
    //             // User Authenticate Success
    //             req.session.login = true;
    //             req.session.details = {
    //                 id: vendor[0]._id,
    //                 name: vendor[0].vendor_company,
    //                 jwt_token: token,
    //                 avatar: 'user.png',
    //                 is_admin: 'yes',
    //                 role: vendor[0].role,
    //                 account_id:vendor[0].account_id
    //                 // chips: vendor[0].chips,
    //             };
    //
    //
    //             // console.log("homecontrolller session details == >", req.session.details);
    //             if (vendor[0].role == 'custom') {
    //                 req.session.details.access = await Sys.App.Services.VendorProfileServices.getByData({ userId: vendor[0].id });
    //
    //             }
    //             if (vendor[0].avatar) {
    //                 req.session.details.avatar = vendor[0].avatar;
    //             }
    //             console.log("welcome to Admin panel");
    //             req.flash('success', 'Welcome To Admin Panel');
    //             req.session.save(function(err) {
    //                 if(!err) {
    //                     //Data get lost here
    //                     // req.flash('success','Image Uploaded Successfully');
    //                     return new Promise((resolve, reject) => {
    //                         // return res.redirect("/myDatabase");
    //                         return res.redirect('/vendor_dashboard');
    //
    //                     });
    //                 }
    //              });
    //         } else {
    //             req.flash('error', 'Invalid Credentials');
    //
    //             var obj = {
    //                 App: req.session.details,
    //                 // Agent: req.session.details,
    //                 error: req.flash("error"),
    //                 success: req.flash("success"),
    //                 role: 'vendor',
    //                 // email_Alredy: req.flash("email_Alredy"),
    //
    //             };
    //
    //             console.log("Invalid login");
    //             return res.render('frontend/register_vendor', obj);
    //
    //             // return res.redirect('/backend');
    //         }
    //         /* if(req.body.email == 'rummy@aistechnolabs.com'){
    //         }else{
    //           req.flash('error', 'Invalid Credentials ');
    //           res.redirect('/');
    //         } */
    //
    //         /* var data = {
    //           App : req.session.details
    //         };
    //         return res.render('login.html',data); */
    //
    //     } catch (e) {
    //         console.log("Error in postLogin :", e);
    //         return new Error(e);
    //     }
    // },

    login_vendor: async function (req, res) {
        try {
            // let homeData = await Sys.App.Services.HomeServices.getByData({is_deleted:"0"});
            // let productData = await Sys.App.Services.ProductServices.getByData({is_deleted:"0"});
            // // let prjectCategoryData = await Sys.App.Services.ProjectCategoryServices.getByData({});
            // let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0"});
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

                            // console.log("productCategoryData[pr].subproduct===",productCategoryData[pr].subproduct[sr].name);
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
                role: 'vendor',
                // home: 'active',

                productCategoryData: productCategoryData,
                prjectCategoryData_dup: prjectCategoryData_dup,
                hidefrom_homepage: "true"
                // homeData: homeData,
                // productData: productData,
            };
            // console.log("hhhhhhhhhdhdhdhdhdhdhdhdh================>>>>>>>>>>>>>>>>>>>>>>",homeData);

            // console.log(projectData, "homeprojectDatacontroller");
            // console.log("login vendor data", data);
            return res.render('frontend/login', data);
        } catch (e) {
            console.log("Error login", e);
        }
    },

    customer_profile: async function (req, res) {

        // console.log("session customer ---->",req.session.details);
        try {
            let addtocart;
            if (req.session.details) {
                addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });

            }
            let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });
            let homeData = await Sys.App.Services.HomeServices.getByData({ is_deleted: "0" });
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

                            // console.log("productCategoryData[pr].subproduct===",productCategoryData[pr].subproduct[sr].name);
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
                // customer: 'active',
                user: user,
                productCategoryData: productCategoryData,
                prjectCategoryData_dup: prjectCategoryData_dup,
                homeData: homeData,
                productData: productData,
                addtocart: addtocart,
            };
            // console.log("data cus", {
            //     App: req.session.details,
            //     error: req.flash("error"),
            //     success: req.flash("success")
            // });
            return res.render('frontend/customer_profile', data);
        } catch (e) {
            console.log("Error", e);
        }
    },
    customer_profile_post: async function (req, res) {
        try {
            console.log("req.body-ccc->", req.body);
            console.log("req.customer_profile_post-->", req.files);
            let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });
            let fileName = '';
            let filepath = '';
            if (req.body.imagesave && !req.files) {
                fileName = user.avatar;
                filepath = user.avatar_path;
            }
            if (req.files) {
                if (fs.existsSync('./public/customer_profile/' + user.avatar) && user.avatar != '') {
                    fs.unlink('./public/customer_profile/' + user.image, function (err) {
                        if (err) {
                            console.log('Error in HomeController in customer_profile_post', err);
                        }
                    });
                }
                let image = req.files.avatar;
                console.log(image);
                var re = /(?:\.([^.]+))?$/;
                var ext = re.exec(image.name)[1];
                fileName = +Date.now() + '.' + ext;
                filepath = '/customer_profile/' + Date.now() + '.' + ext;
                // Use the mv() method to place the file somewhere on your server
                image.mv('./public/customer_profile/' + fileName, async function (err) {
                    if (err) {
                        req.flash('error', 'Error Uploading Profile Image');
                        return res.redirect('/customer_profile');
                    }
                });
            }

            var state_code = req.body.gst_No.substring(0, 2);


            let id = mongoose.Types.ObjectId(req.session.details.id);
            let updatedata = await Sys.App.Services.CustomerServices.updateUserData(
                {
                    _id: id
                    // image: req.files.image.name
                }, {
                userName: req.body.user_name,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                mobile: req.body.phone,
                password_string: req.body.password,

                // role: req.body.role,
                user_gst_no: req.body.gst_No,
                state_code: state_code,
                stateGstCode: state_code,
                user_gst_companyName: req.body.companyName,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
                avatar: fileName,
                avatar_path: filepath
            }
            )
            //   console.log("updatedata",updatedata);

            //   var data = {
            //     App: req.session.details,
            //     error: req.flash("error"),
            //     success: req.flash('success')
            //     // customer: 'active'
            //   };

            let reviewData = await Sys.App.Services.ReviewServices.getUserData({ customer_id: id });
            if (reviewData) {
                let updatedata = await Sys.App.Services.ReviewServices.updateManyUserData(
                    { customer_id: id }, { $set: { customer_img: fileName } }, { multi: true });
            }

            if (req.body.firstname) {
                req.session.details.firstname = req.body.firstname
            }

            req.flash('success', 'Profile Updated successfully');
            req.session.save(function (err) {
                // session saved
                console.log('session saved');
                return res.redirect('/customer_profile');
            });
        } catch (e) {
            console.log("Error", e);
        }
    },


    aboutus: async function (req, res) {
        try {
            // // let aboutData = await Sys.App.Services.UserServices.getByDataAbout({is_deleted: "0"});
            // // let productData = await Sys.App.Services.ProductServices.getByData({is_deleted: "0"});
            // // let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0"});
            // let aboutData = await Sys.App.Services.UserServices.getByDataAbout({ is_deleted: "0" });
            // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
            // let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
            // let addtocart;
            // if (req.session.details) {
            //     addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });

            // }

            // let subarray = [];
            // let setids = [];
            // let new_sub_arr = [];
            // let subproduct;
            // let subof_subproduct = [];

            // var finalarr = [];

            // if (productCategoryData) {
            //     for (let p = 0; p < productCategoryData.length; p++) {

            //         if (productCategoryData[p].main_productId == null) {
            //             setids.push(productCategoryData[p]._id)
            //         }
            //         for (let s = 0; s < setids.length; s++) {
            //             if (setids[s] == productCategoryData[p].main_productId) {
            //                 subarray.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
            //             }
            //         }
            //         if (productCategoryData[p].main_productId != null && productCategoryData[p].main_sub_productId != null) {
            //             new_sub_arr.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
            //         }
            //     }
            //     // console.log(new_sub_arr);
            //     for (let pr = 0; pr < productCategoryData.length; pr++) {
            //         subproduct = [];

            //         var subArrId = productCategoryData[pr]._id.toString()
            //         for (let ss = 0; ss < subarray.length; ss++) {

            //             if (subarray[ss].main_productId == subArrId) {
            //                 // console.log("");
            //                 let str = subarray[ss].name
            //                 str = str.replace(" ", "_");
            //                 subproduct.push({ idids: subarray[ss].idids, name: subarray[ss].name, itemname: str, main_productId: subarray[ss].main_productId, main_sub_productId: subarray[ss].main_sub_productId, subof_subproduct: subof_subproduct })
            //                 productCategoryData[pr].subproduct = subproduct;

            //             }
            //         }
            //         if (productCategoryData[pr].subproduct) {

            //             for (let sr = 0; sr < productCategoryData[pr].subproduct.length; sr++) {


            //                 finalarr = [];
            //                 var subArrId = productCategoryData[pr].subproduct[sr].idids;

            //                 for (let n = 0; n < new_sub_arr.length; n++) {
            //                     if (new_sub_arr[n].main_productId == subArrId) {
            //                         let str = new_sub_arr[n].name
            //                         str = str.trim();
            //                         str = str.toLowerCase();
            //                         // str = str.replace(" ", "_");
            //                         str = str.split(' ').join('_');
            //                         let replacementString = '-';
            //                         str = str.replace(/\//g, replacementString);

            //                         finalarr.push({ idids: new_sub_arr[n].idids, name: new_sub_arr[n].name, itemname: str, main_productId: new_sub_arr[n].main_productId, main_sub_productId: new_sub_arr[n].main_sub_productId })


            //                         productCategoryData[pr].subproduct[sr].subof_subproduct = finalarr


            //                     }

            //                 }


            //             }


            //         }



            //         if (subproduct.length) {

            //             var output = [];


            //             subproduct.forEach(function (item) {
            //                 var existing = output.filter(function (v, i) {
            //                     return v.name == item.name;
            //                 });

            //                 if (existing.length) {
            //                     var existingIndex = output.indexOf(existing[0]);
            //                     output[existingIndex].subof_subproduct = output[existingIndex].subof_subproduct.concat(item.subof_subproduct);
            //                 } else {
            //                     if (typeof item.subof_subproduct == 'string')
            //                         item.subof_subproduct = [item.subof_subproduct];
            //                     output.push(item);
            //                 }

            //             });

            //             productCategoryData[pr].subproduct = output;


            //         }

            //     }

            // }

            // let prjectCategoryData_dup = [];
            // let jj = 0
            // if (productCategoryData) {
            //     for (let ii = 0; ii < productCategoryData.length; ii++) {
            //         if (productCategoryData[ii].main_productId == null &&
            //             productCategoryData[ii].main_sub_productId == null) {
            //             jj = jj + 1;
            //             if (jj < 6) {
            //                 prjectCategoryData_dup.push(productCategoryData[ii])
            //             }
            //         }
            //     }
            // }




            // var data = {
            //     App: req.session.details,
            //     error: req.flash("error"),
            //     success: req.flash("success"),
            //     aboutus: 'active',
            //     productCategoryData: productCategoryData,
            //     prjectCategoryData_dup: prjectCategoryData_dup,
            //     aboutData: aboutData,
            //     addtocart: addtocart,
            //     hidefrom_homepage: "true"
            //     // productData: productData,
            //     // productCategoryData: productCategoryData


            // };

            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0", main_productId: null });

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                privacypolicy: 'active',
                productCategoryData: productCategoryData,
            };
            // console.log("hhhhhhhhhdhdhdhdhdhdhdhdh================>>>>>>>>>>>>>>>>>>>>>>",homeData);

            // console.log(projectData, "homeprojectDatacontroller");
            return res.render('frontend/about', data);
        } catch (e) {
            console.log("Error in aboutus", e);
        }
    },

    contact: async function (req, res) {
        try {
            // let profileTypeData = await Sys.App.Services.ProfileTypeServices.getByData({is_deleted: "0"});
            // let regionData = await Sys.App.Services.RegionServices.getByData({is_deleted: "0"});
            // let regionsingleData = await Sys.App.Services.RegionServices.getRegionData({is_deleted: "0"});
            // let productData = await Sys.App.Services.ProductServices.getByData({is_deleted: "0"});
            // let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0"});

            // let singleRegionData = await Sys.App.Services.RegionServices.getRegionData({ });
            // let addtocart;
            // if (req.session.details) {
            //     addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });

            // }
            // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
            // let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
            // let subarray = [];
            // let setids = [];
            // let new_sub_arr = [];
            // let subproduct;
            // let subof_subproduct = [];

            // var finalarr = [];

            // if (productCategoryData) {
            //     for (let p = 0; p < productCategoryData.length; p++) {

            //         if (productCategoryData[p].main_productId == null) {
            //             setids.push(productCategoryData[p]._id)
            //         }
            //         for (let s = 0; s < setids.length; s++) {
            //             if (setids[s] == productCategoryData[p].main_productId) {
            //                 subarray.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
            //             }
            //         }
            //         if (productCategoryData[p].main_productId != null && productCategoryData[p].main_sub_productId != null) {
            //             new_sub_arr.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
            //         }
            //     }
            //     // console.log(new_sub_arr);
            //     for (let pr = 0; pr < productCategoryData.length; pr++) {
            //         subproduct = [];

            //         var subArrId = productCategoryData[pr]._id.toString()
            //         for (let ss = 0; ss < subarray.length; ss++) {

            //             if (subarray[ss].main_productId == subArrId) {
            //                 // console.log("");
            //                 let str = subarray[ss].name
            //                 str = str.replace(" ", "_");
            //                 subproduct.push({ idids: subarray[ss].idids, name: subarray[ss].name, itemname: str, main_productId: subarray[ss].main_productId, main_sub_productId: subarray[ss].main_sub_productId, subof_subproduct: subof_subproduct })
            //                 productCategoryData[pr].subproduct = subproduct;

            //             }
            //         }
            //         if (productCategoryData[pr].subproduct) {
            //             var itemarray = []
            //             for (let sr = 0; sr < productCategoryData[pr].subproduct.length; sr++) {

            //                 // console.log("productCategoryData[pr].subproduct===",productCategoryData[pr].subproduct[sr].name);
            //                 finalarr = [];
            //                 var subArrId = productCategoryData[pr].subproduct[sr].idids;

            //                 for (let n = 0; n < new_sub_arr.length; n++) {
            //                     if (new_sub_arr[n].main_productId == subArrId) {
            //                         let str = new_sub_arr[n].name
            //                         str = str.trim();
            //                         str = str.toLowerCase();
            //                         // str = str.replace(" ", "_");
            //                         str = str.split(' ').join('_');
            //                         let replacementString = '-';
            //                         str = str.replace(/\//g, replacementString);

            //                         finalarr.push({ idids: new_sub_arr[n].idids, name: new_sub_arr[n].name, itemname: str, main_productId: new_sub_arr[n].main_productId, main_sub_productId: new_sub_arr[n].main_sub_productId })


            //                         // productCategoryData[pr].subproduct[sr].subof_subproduct = finalarr




            //                         for (let ii = 0; ii < finalarr.length; ii++) {

            //                             itemarray.push(finalarr[ii])
            //                         }


            //                     }

            //                 }


            //             }
            //             const key = "itemname";

            //             let arrayUniqueByKey = [...new Map(itemarray.map(item =>
            //                 [item[key], item])).values()];

            //             if (productCategoryData[pr].subproduct[pr]) {
            //                 productCategoryData[pr].subproduct[pr].subof_subproduct = arrayUniqueByKey
            //                 //   console.log("dsdssdfwwee  fjewefwefewf====>",arrayUniqueByKey);
            //             }

            //         }


            //         if (subproduct.length) {

            //             var output = [];


            //             subproduct.forEach(function (item) {
            //                 var existing = output.filter(function (v, i) {
            //                     return v.name == item.name;
            //                 });

            //                 if (existing.length) {
            //                     var existingIndex = output.indexOf(existing[0]);
            //                     output[existingIndex].subof_subproduct = output[existingIndex].subof_subproduct.concat(item.subof_subproduct);
            //                 } else {
            //                     if (typeof item.subof_subproduct == 'string')
            //                         item.subof_subproduct = [item.subof_subproduct];
            //                     output.push(item);
            //                 }

            //             });
            //             // console.log("output ====>>>>",output[0].subof_subproduct);
            //             productCategoryData[pr].subproduct = output;


            //         }

            //     }

            // }

            // let prjectCategoryData_dup = [];
            // let jj = 0
            // if (productCategoryData) {
            //     for (let ii = 0; ii < productCategoryData.length; ii++) {
            //         if (productCategoryData[ii].main_productId == null &&
            //             productCategoryData[ii].main_sub_productId == null) {
            //             jj = jj + 1;
            //             if (jj < 6) {
            //                 prjectCategoryData_dup.push(productCategoryData[ii])
            //             }
            //         }
            //     }
            // }

            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0", main_productId: null });

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                contact: 'active',
                productCategoryData: productCategoryData,
                // prjectCategoryData_dup: prjectCategoryData_dup,

                // addtocart: addtocart,
                hidefrom_homepage: "true"

                // regionData: regionData,
                // regionsingleData: regionsingleData,
                // productCategoryData: productCategoryData,
                // productData: productData,
                // profileTypeData: profileTypeData,
                // singleRegionData: singleRegionData

            };
            // console.log("profileTypeData is here>>>>>>>>>>>>>>>>>>>>>>>>>>", profileTypeData);
            return res.render('frontend/contact', data);
        } catch (e) {
            console.log("Error in about", e);
        }
    },

    // privacypolicy: async function (req, res) {
    //     let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0", main_productId: null });

    //     var data = {
    //         App: req.session.details,
    //         error: req.flash("error"),
    //         success: req.flash("success"),
    //         contact: 'active',
    //         productCategoryData: productCategoryData,
    //         hidefrom_homepage: "true"
    //     };
    //     // console.log("profileTypeData is here>>>>>>>>>>>>>>>>>>>>>>>>>>", profileTypeData);
    //     return res.render('/frontend/privacyPolicy', data);
    // },

    deliveryInformation: async function (req, res) {
        try {

            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0", main_productId: null });

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                privacypolicy: 'active',
                productCategoryData: productCategoryData,
            };
            // console.log("hhhhhhhhhdhdhdhdhdhdhdhdh================>>>>>>>>>>>>>>>>>>>>>>",homeData);

            // console.log(projectData, "homeprojectDatacontroller");
            // console.log("profileTypeData is here>>>>>>>>>>>>>>>>>>>>>>>>>>", profileTypeData);
            return res.render('frontend/deliveryInformation', data);
        } catch (e) {
            console.log("Error in about", e);
        }
    },

    addressBook: async function (req, res) {
        try {
            console.log(":::addressBook:::Controller:::");
            if (req.session.details == undefined) {
                return res.redirect('/getAddressBook')
            }
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0", main_productId: null });

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                privacypolicy: 'active',
                productCategoryData: productCategoryData,
            };
            // console.log("hhhhhhhhhdhdhdhdhdhdhdhdh================>>>>>>>>>>>>>>>>>>>>>>",homeData);

            // console.log(projectData, "homeprojectDatacontroller");
            // console.log("profileTypeData is here>>>>>>>>>>>>>>>>>>>>>>>>>>", profileTypeData);
            return res.render('frontend/addressBook', data);
        } catch (e) {
            console.log("Error in addressBook", e);
        }
    },

    addAddressBook: async function (req, res) {
        if (req.session.details == undefined) {
            return res.redirect('/getAddressBook')
        }
        // add address in customer db under address_arr
        console.log(":::addAddressBook:::CONTROLLER:::");
        console.log(":::req.session.details:::", req.session.details);
        console.log(":::req.body::::", req.body);

        let splitString = req.body.zone_id.split('_');

        let countrySplit = req.body.country_id.split('_');

        // add address in db here
        let obj = {
            id: create_Id(),
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            company: req.body.company,
            address_1: req.body.address_1,
            address_2: req.body.address_2,
            city: req.body.city,
            postcode: req.body.postcode,
            country_id: countrySplit[0],
            countryName: countrySplit[1],
            zone_id: splitString[0],
            stateName: splitString[1],
            default: req.body.default
        }

        // let customerInfo = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id, is_deleted: "0" })

        // // console.log(":::customerInfo:::", customerInfo);

        // let addressArray = customerInfo.address_arr
        // console.log(":::before poush:: addresssArray:::", addressArray);
        // if obj.default is 1 then update default to 0 in exisitng address of db
        // db.yourCollection.updateMany(
        //     {},
        //     { $set: { "arrayField.$[].fieldToUpdate": "newValue" } }
        // );

        if (obj.default === "1") {
            console.log(":::update default address to 0");
            let updatedDefaultInAddress = await Sys.App.Services.CustomerServices.updateUserData({ _id: req.session.details.id }, { $set: { "address_arr.$[].default": "0" } })
        }

        let customerInfo1 = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id, is_deleted: "0" })

        // console.log(":::customerInfo1:::", customerInfo1);

        let addressArray1 = customerInfo1.address_arr

        addressArray1.push(obj)

        // console.log(":::after poush:: addresssArray:::", addressArray);

        let updatedCustomerDetail = await Sys.App.Services.CustomerServices.updateUserData({ _id: req.session.details.id }, { address_arr: addressArray1 })

        req.flash('success', 'Address created successfully');
        return res.redirect('/getAddressBook'); // Redirect only here
    },

    getAddressBook: async function (req, res) {
        try {
            if (req.session.details == undefined) {
                return res.redirect('/home')
            }
            console.log(":::addressBook:::Controller:::");
            // let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0", main_productId: null });

            let customerInfo = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id, is_deleted: "0" })

            console.log(":::customerInfo::getAddressBook:", customerInfo);

            let addressDetail = customerInfo.address_arr

            let finalAddressInfo = []
            if (addressDetail.length) {
                for (let i = 0; i < addressDetail.length; i++) {
                    let obj = {}
                    let firstName = addressDetail[i].firstname ? addressDetail[i].firstname : ""
                    let lastName = addressDetail[i].lastname ? addressDetail[i].lastname : ""

                    obj.id = addressDetail[i].id
                    obj.name = `${firstName} ${lastName}`
                    obj.company = addressDetail[i].company
                    obj.address_1 = addressDetail[i].address_1
                    obj.address_2 = addressDetail[i].address_2
                    obj.city = addressDetail[i].city
                    obj.postcode = addressDetail[i].postcode
                    obj.stateName = addressDetail[i].stateName
                    obj.country_id = addressDetail[i].country_id
                    obj.countryName = addressDetail[i].countryName

                    finalAddressInfo.push(obj)
                }
            }


            console.log(":::finalAddressInfo:::", finalAddressInfo);
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                privacypolicy: 'active',
                addressDetail: finalAddressInfo
                // productCategoryData: productCategoryData,
            };
            // console.log("hhhhhhhhhdhdhdhdhdhdhdhdh================>>>>>>>>>>>>>>>>>>>>>>",homeData);

            // console.log(projectData, "homeprojectDatacontroller");
            // console.log("profileTypeData is here>>>>>>>>>>>>>>>>>>>>>>>>>>", profileTypeData);
            return res.render('frontend/listAddressBook', data);
        } catch (e) {
            console.log("Error in addressBook", e);
        }
    },

    editAddress: async function (req, res) {
        console.log("::req.params::editAddress:", req.params.id);
        // console.log(":::Rreq.body:::",req.body.addressId);
        try {
            console.log(":::req.session.details::editAddress", req.session.details);

            if (req.session.details == undefined) {
                return res.redirect('/getAddressBook')
            }

            let addressId = (req.params.id).toString()

            // console.log(":::addressId:::", typeof addressId);

            let findExisitngAddress = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id })

            // console.log(":::findExisitngAddress:::", findExisitngAddress);

            let addressInfo = findExisitngAddress.address_arr

            // console.log(":::addresssinfo:::", addressInfo);

            const index = addressInfo.findIndex(element => element.id === addressId);
            // console.log(":::findExisitngAddress[index]:::", addressInfo[index]);
            let finalObj

            if (index !== -1) {
                console.log(":::findExisitngAddress[index]:::", addressInfo[index]);
                finalObj = addressInfo[index]
            } else {
                console.log(":::address not found:::");
                return res.render('/getAddressBook');
            }

            var data = {
                App: Sys.Config.App.details, Agent: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                addressDetail: finalObj,
                // liveStreaming: liveStreaming,
                userActive: 'active'
            };
            return res.render('frontend/editAddress', data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    savetEditAddress: async function (req, res) {
        console.log(":::req.body::savetEditAddress:", req.body);
        // console.log(":::req.params::savetEditAddress:", req.params.id);

        let addressId = (req.params.id).toString()

        // console.log(":::addressId:::", typeof addressId);

        // let findExisitngAddress = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id })

        // // console.log(":::findExisitngAddress:::", findExisitngAddress);

        // let addressInfo = findExisitngAddress.address_arr

        // // console.log(":::addresssinfo:::", addressInfo);

        // const index = addressInfo.findIndex(element => element.id === addressId);
        // // console.log(":::findExisitngAddress[index]:::", addressInfo[index]);
        // let finalObj

        // if (index !== -1) {
        //     // console.log(":::findExisitngAddress[index]:::", addressInfo[index]);
        //     finalObj = addressInfo[index]
        // } else {
        //     console.log(":::address not found:::");
        //     return res.render('/getAddressBook');
        // }

        // let splitString = req.body.zone_id.split('_');

        // let countrySplit = req.body.country_id.split('_');
        // // console.log(":::finalObj:::", finalObj);

        // finalObj.id = finalObj.id,
        //     finalObj.firstname = req.body.firstname,
        //     finalObj.lastname = req.body.lastname,
        //     finalObj.company = req.body.company,
        //     finalObj.address_1 = req.body.address_1,
        //     finalObj.address_2 = req.body.address_2,
        //     finalObj.city = req.body.city,
        //     finalObj.postcode = req.body.postcode,
        //     finalObj.country_id = countrySplit[0],
        //     finalObj.countryName = countrySplit[1],
        //     finalObj.zone_id = splitString[0],
        //     finalObj.stateName = splitString[1],
        //     finalObj.default = req.body.default

        // console.log("::addressInfo[index]:::", addressInfo[index]);

        // console.log(":::addressInfo::::", addressInfo);
        if (req.body.default === "1") {
            // console.log(":::update default address to 0");
            // let updatedDefaultInAddress = await Sys.App.Services.CustomerServices.updateAddressOfUser({"address_arr.id": { $ne: addressId } },
            // { $set: { "address_arr.$[elem].default": "0" } },
            // { arrayFilters: [{ "elem.id": { $ne: addressId } }] })
            let findExisitngAddress1 = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id })

            // console.log(":::findExisitngAddress:::", findExisitngAddress);

            let addressInfo1 = findExisitngAddress1.address_arr

            let addressArr = []
            const filteredArray1 = addressInfo1.filter(object => object.id == addressId);
            // console.log(":::filteredArray1::11:", filteredArray1);

            if (filteredArray1.length) {
                addressArr.push(filteredArray1[0])
            }

            console.log(":::before::addressArr:", addressArr);


            const filteredArray = addressInfo1.filter(object => object.id !== addressId);

            // console.log(":::filteredArray:::", filteredArray);

            if (filteredArray.length) {
                for (let z = 0; z < filteredArray.length; z++) {
                    filteredArray[z].id = filteredArray[z].id
                    filteredArray[z].firstname = filteredArray[z].firstname
                    filteredArray[z].lastname = filteredArray[z].lastname
                    filteredArray[z].company = filteredArray[z].company
                    filteredArray[z].address_1 = filteredArray[z].address_1
                    filteredArray[z].address_2 = filteredArray[z].address_2
                    filteredArray[z].city = filteredArray[z].city
                    filteredArray[z].postcode = filteredArray[z].postcode
                    filteredArray[z].country_id = filteredArray[z].country_id
                    filteredArray[z].company = filteredArray[z].company
                    filteredArray[z].zone_id = filteredArray[z].zone_id
                    filteredArray[z].stateName = filteredArray[z].stateName
                    filteredArray[z].default = "0"

                    addressArr.push(filteredArray[z])
                }
            }

            console.log(":::addressArr::addressArr:after::::", addressArr);
            let updatedCustomerDetail = await Sys.App.Services.CustomerServices.updateUserData({ _id: req.session.details.id }, { address_arr: addressArr })


        }

        let findExisitngAddress = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id })

        // console.log(":::findExisitngAddress:::", findExisitngAddress);

        let addressInfo = findExisitngAddress.address_arr

        console.log(":::addresssinfo::check:::before update:::", addressInfo);

        const index = addressInfo.findIndex(element => element.id === addressId);
        // console.log(":::findExisitngAddress[index]:::", addressInfo[index]);
        let finalObj

        if (index !== -1) {
            // console.log(":::findExisitngAddress[index]:::", addressInfo[index]);
            finalObj = addressInfo[index]
        } else {
            console.log(":::address not found:::");
            return res.render('/getAddressBook');
        }

        let splitString = req.body.zone_id.split('_');

        let countrySplit = req.body.country_id.split('_');
        // console.log(":::finalObj:::", finalObj);

        finalObj.id = finalObj.id,
            finalObj.firstname = req.body.firstname,
            finalObj.lastname = req.body.lastname,
            finalObj.company = req.body.company,
            finalObj.address_1 = req.body.address_1,
            finalObj.address_2 = req.body.address_2,
            finalObj.city = req.body.city,
            finalObj.postcode = req.body.postcode,
            finalObj.country_id = countrySplit[0],
            finalObj.countryName = countrySplit[1],
            finalObj.zone_id = splitString[0],
            finalObj.stateName = splitString[1],
            finalObj.default = req.body.default


        console.log(":::addressInfo::FInal:::", addressInfo);
        let updatedCustomerDetail = await Sys.App.Services.CustomerServices.updateUserData({ _id: req.session.details.id }, { address_arr: addressInfo })

        req.flash('success', 'Address updated successfully');
        return res.redirect('/getAddressBook'); // Redirect only here
    },

    deleteAddress: async function (req, res) {
        // console.log(":::req.body::deleteAddress:", req.body);
        console.log(":::req.params::deleteAddress:", req.params.id);

        let addressId = (req.params.id).toString()

        let findExisitngAddress = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id })

        // console.log(":::findExisitngAddress:::", findExisitngAddress);

        let addressInfo = findExisitngAddress.address_arr

        // console.log(":::addresssinfo::before:", addressInfo);

        const index = addressInfo.findIndex(element => element.id === addressId);

        if (index !== -1) {
            // console.log(":::findExisitngAddress[index]:::", addressInfo[index]);
            let removedAddressInfo = addressInfo.splice(index, 1);
        } else {
            // console.log(":::address not found:::");
            return res.render('/getAddressBook');
        }

        // console.log(":::addresssinfo::after:", addressInfo);
        let updatedCustomerDetail = await Sys.App.Services.CustomerServices.updateUserData({ _id: req.session.details.id }, { address_arr: addressInfo })

        req.flash('success', 'Address Deleted successfully');
        return res.redirect('/getAddressBook'); // Redirect only here

        // console.log(":::addressId:::",  addressId);
        // return res.redirect('/getAddressBook'); // Redirect only here

    },

    privacypolicy: async function (req, res) {
        try {
            console.log("::here:::privacy policy controller");
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0", main_productId: null });

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                privacypolicy: 'active',
                productCategoryData: productCategoryData,
            };
            // console.log("hhhhhhhhhdhdhdhdhdhdhdhdh================>>>>>>>>>>>>>>>>>>>>>>",homeData);

            // console.log(projectData, "homeprojectDatacontroller");
            return res.render('frontend/privacyPolicy', data);
        } catch (e) {
            console.log("Error privacyPolicy", e);
        }
    },

    termsconditions: async function (req, res) {
        try {
            console.log("::here:::termscondition controller");
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0", main_productId: null });

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                privacypolicy: 'active',
                productCategoryData: productCategoryData,
            };
            // console.log("hhhhhhhhhdhdhdhdhdhdhdhdh================>>>>>>>>>>>>>>>>>>>>>>",homeData);

            // console.log(projectData, "homeprojectDatacontroller");
            return res.render('frontend/terms&conditions', data);
        } catch (e) {
            console.log("Error termsconditions", e);
        }
    },

    myAccount: async function (req, res) {
        try {
            console.log(":::myAccount:::Controller:::");
            if (req.session.details == undefined) {
                return res.redirect('/frontend/myAccount')
            }
            // let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0", main_productId: null });

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                privacypolicy: 'active',
                // productCategoryData: productCategoryData,
            };
            // console.log("hhhhhhhhhdhdhdhdhdhdhdhdh================>>>>>>>>>>>>>>>>>>>>>>",homeData);

            // console.log(projectData, "homeprojectDatacontroller");
            // console.log("profileTypeData is here>>>>>>>>>>>>>>>>>>>>>>>>>>", profileTypeData);
            return res.render('frontend/myAccount', data);
        } catch (e) {
            console.log("Error in myAccount", e);
        }
    },

    customer_address: async function (req, res) {
        try {
            let addtocart;
            if (req.session.details) {
                addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });

            }
            let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });
            let homeData = await Sys.App.Services.HomeServices.getByData({ is_deleted: "0" });
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

                            // console.log("productCategoryData[pr].subproduct===",productCategoryData[pr].subproduct[sr].name);
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
                // customer: 'active',
                user: user,
                productCategoryData: productCategoryData,
                prjectCategoryData_dup: prjectCategoryData_dup,
                homeData: homeData,
                productData: productData,
                addtocart: addtocart,
            };
            console.log("data cus", {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success")
            });
            return res.render('frontend/customer_address', data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    customer_address_post: async function (req, res) {
        try {
            console.log("req.body-->", req.body);
            let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });

            let is_default = "1";
            if (user.address_arr.length == 0) {
                is_default = "0";
            }

            let address_arr = {
                id: create_Id(),
                fullname: req.body.fullname,
                mobileno: req.body.mobileno,
                pincode: req.body.pincode,
                addresstext_no: req.body.addresstext_no,
                addresstext_name: req.body.addresstext_name,
                landmark: req.body.landmark,
                city: req.body.city,
                state: req.body.state,
                state_code: user.state_code,
                stateGstCode: user.state_code,
                addresstype: req.body.addresstype,
                is_default: is_default,
                is_deleted: "0"
            }
            let id = mongoose.Types.ObjectId(req.session.details.id);
            let updatedata = await Sys.App.Services.CustomerServices.updateUserData(
                {
                    _id: id
                    // image: req.files.image.name
                }, {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                $push: {
                    address_arr: address_arr
                }
            }
            )
            if (req.body.firstname) {
                req.session.details.firstname = req.body.firstname
            }
            //   console.log("updatedata",updatedata);

            //   var data = {
            //     App: req.session.details,
            //     error: req.flash("error"),
            //     success: req.flash('success')
            //     // customer: 'active'
            //   };
            if (req.body.default_add) {
                req.flash('success', 'Address Updated successfully');
                req.session.save(function (err) {
                    // session saved
                    console.log('session saved');
                    return res.redirect('/checkout');
                });
            } else {
                req.flash('success', 'Address Updated successfully');
                req.session.save(function (err) {
                    // session saved
                    console.log('session saved');
                    return res.redirect('/customer_address');
                });

            }
        } catch (e) {
            console.log("Error", e);
        }
    },

    customer_edit_address: async function (req, res) {
        try {

            let addtocart;
            if (req.session.details) {
                addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });

            }
            let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });
            let homeData = await Sys.App.Services.HomeServices.getByData({ is_deleted: "0" });
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

                            // console.log("productCategoryData[pr].subproduct===",productCategoryData[pr].subproduct[sr].name);
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
                // customer: 'active',
                user: user,
                productCategoryData: productCategoryData,
                prjectCategoryData_dup: prjectCategoryData_dup,
                homeData: homeData,
                productData: productData,
                address_id: req.params.id,
                addtocart: addtocart,
            };
            console.log("data cus", {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success")
            });
            return res.render('frontend/customer_edit_address', data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    customer_edit_address_post: async function (req, res) {
        try {
            console.log("req.body-->", req.body);
            let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id, });



            let id = mongoose.Types.ObjectId(req.session.details.id);

            let updatedata = await Sys.App.Services.CustomerServices.updateUserData(
                {
                    _id: id, "address_arr.id": req.body.add_id
                    // image: req.files.image.name
                }, {
                $set: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    "address_arr.$.fullname": req.body.fullname,
                    "address_arr.$.mobileno": req.body.mobileno,
                    "address_arr.$.pincode": req.body.pincode,
                    "address_arr.$.addresstext_no": req.body.addresstext_no,
                    "address_arr.$.addresstext_name": req.body.addresstext_name,
                    "address_arr.$.landmark": req.body.landmark,
                    "address_arr.$.city": req.body.city,
                    "address_arr.$.state": req.body.state,
                    "address_arr.$.stateGstCode": req.body.stateGstCode,
                    "address_arr.$.addresstype": req.body.addresstype,
                }
            }
            )

            if (req.body.firstname) {
                req.session.details.firstname = req.body.firstname
            }
            //   console.log("updatedata",updatedata);

            //   var data = {
            //     App: req.session.details,
            //     error: req.flash("error"),
            //     success: req.flash('success')
            //     // customer: 'active'
            //   };
            req.flash('success', 'Address Updated successfully');
            req.session.save(function (err) {
                // session saved
                console.log('session saved');
                return res.redirect('/customer_address');
            });
        } catch (e) {
            console.log("Error", e);
        }
    },

    default_address: async function (req, res) {
        try {
            console.log("req.body-->", req.body);
            let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });

            let id = mongoose.Types.ObjectId(req.session.details.id);
            if (user) {
                if (user.address_arr) {
                    for (let a = 0; a < user.address_arr.length; a++) {
                        console.log("user.address_arr[a].id,req.body.id", user.address_arr[a].id, req.body.id);
                        console.log("user.address_arr[a].id == req.body.id", user.address_arr[a].id == req.body.id);
                        if (user.address_arr[a].id == req.body.id) {
                            await Sys.App.Services.CustomerServices.updateoneUserData(
                                {
                                    _id: id, "address_arr.id": user.address_arr[a].id
                                    // image: req.files.image.name
                                }, {
                                $set: {
                                    "address_arr.$.is_default": "0",
                                }
                            })
                        } else {
                            await Sys.App.Services.CustomerServices.updateoneUserData(
                                {
                                    _id: id, "address_arr.id": user.address_arr[a].id
                                    // image: req.files.image.name
                                }, {
                                $set: {
                                    "address_arr.$.is_default": "1",
                                }
                            })

                        }
                    }
                }
            }
            // let update = await Sys.App.Services.CustomerServices.updateUserData(
            //     {
            //         _id: id, "address_arr.is_default": "0"
            //     },
            //     {
            //         $set: {
            //             "address_arr.$[].is_default": "1",
            //         }
            //     });
            // console.log("updateupdateupdate", update);
            // let updatedata = await Sys.App.Services.CustomerServices.updateoneUserData(
            //     {
            //         _id: id, "address_arr": { "$elemMatch": { "id": req.body.id } }
            //         // image: req.files.image.name
            //     }, {
            //     $set: {
            //         "address_arr.$.is_default": "0",
            //     }
            // }
            // )
            // console.log("updatedataupdatedataupdatedata", updatedata);

            //   console.log("updatedata",updatedata);

            //   var data = {
            //     App: req.session.details,
            //     error: req.flash("error"),
            //     success: req.flash('success')
            //     // customer: 'active'
            //   };
            res.send('success');
        } catch (e) {
            console.log("Error", e);
        }
    },

    customer_remove_address: async function (req, res) {
        try {
            console.log("req.body-->delete", req.body.id);
            let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });

            let id = mongoose.Types.ObjectId(req.session.details.id);
            let updatedata = await Sys.App.Services.CustomerServices.updateUserData(
                {
                    _id: id, "address_arr.id": req.body.id
                    // image: req.files.image.name
                }, {
                $set: {
                    "address_arr.$.is_deleted": "1"
                }
            }
            )
            console.log("");
            return res.send("success");

            //   console.log("updatedata",updatedata);

            //   var data = {
            //     App: req.session.details,
            //     error: req.flash("error"),
            //     success: req.flash('success')
            //     // customer: 'active'
            //   };
            // req.flash('success', 'Address Delete successfully');
            //   req.session.save(function(err) {
            //     // session saved
            //     console.log('session saved');
            //     return res.redirect('/customer_address');
            //   });
        } catch (e) {
            console.log("Error", e);
        }
    },

    close_account: async function (req, res) {
        try {
            let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });
            let homeData = await Sys.App.Services.HomeServices.getByData({ is_deleted: "0" });
            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
            let addtocart;
            if (req.session.details) {
                addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });

            }
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
                // console.log("new ARRAy=========",subarray,subarray.length);
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

                            // console.log("productCategoryData[pr].subproduct===",productCategoryData[pr].subproduct[sr].name);
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

                        let output = [];
                        let suboutput = [];


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
                // customer: 'active',
                user: user,
                productCategoryData: productCategoryData,
                homeData: homeData,
                productData: productData,
                prjectCategoryData_dup: prjectCategoryData_dup,
                addtocart: addtocart,
            };
            console.log("data cus", {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success")
            });
            return res.render('frontend/close_account', data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    close_account_post: async function (req, res) {
        try {
            console.log("req.body-->", req.body);
            let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });

            let id = mongoose.Types.ObjectId(req.session.details.id);
            let updatedata = await Sys.App.Services.CustomerServices.updateUserData(
                {
                    _id: id
                    // image: req.files.image.name
                }, {
                close_reason: req.body.close_reason,
                is_deleted: "1"
            }
            )
            //   req.session.destroy(function(err) {

            console.log("session destroy");
            req.session.details = {};

            req.flash('success', 'You Account is close successfully');
            req.session.save(function (err) {
                // session saved

                console.log('session saved');
                return res.redirect('/user_login');

            });
            // });

        } catch (e) {
            console.log("Error", e);
        }
    },

    formData: async function (req, res) {
        try {
            // res.sendfile(__dirname)
            res.sendfile('C:/Users/admin/Desktop/Alfa Pumps/Alfa Pumps/App/Views/frontend/contact.html')
        } catch (error) {
            console.log("Error in HomeController in fromData", error);
        }
    },

    postFormData: async function (req, res) {
        try {
            console.log(req.body);
            const mailOptions = {
                from: req.body.customerEmail,
                to: 'amazonpricetracker0@gmail.com',
                subject: req.body.customerSubject,
                text: `You've got new Enquiry for ${req.body.customerSubject} \nFrom: ${req.body.customerName} \nCustomer's Email: ${req.body.customerEmail} \nCustomer's Phone: ${req.body.customerPhone} \nDescription: ${req.body.customerMessage}`
            }

            defaultTransport.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Error in Homecontroller in postFormData", error);
                } else {
                    console.log("EMail sent: " + info.response);
                    if (info.response) {
                        return res.redirect('frontend/contact')
                    }
                }
            })


        } catch (error) {
            console.log("Error in HomeController in getForm Data", error);
        }
    },

    getAccountInformation: async function (req, res) {
        try {
            console.log(":::getAccountInformation:::Controller:::");
            if (req.session.details == undefined) {
                return res.redirect('/frontend/myAccount')
            }

            let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });

            let obj = {
                firstName: user.firstname ? user.firstname : "",
                lastName: user.lastname ? user.lastname : "",
                email: user.email ? user.email : "",
                telephone: user.mobile ? user.mobile : ""
            }

            return res.render('frontend/editAccountInformation', obj);

        } catch (error) {
            console.log(":::Error in getAccountInformation::::", error);
            return res.redirect('/frontend/myAccount')
        }
    },

    editAccountInfromation: async function (req, res) {
        try {
            console.log(":::editAccountInformation::controller:");
            console.log("::req.body:::", req.body)

            let updatedata = await Sys.App.Services.CustomerServices.updateUserData(
                {
                    _id: req.session.details.id
                }, {
                    firstname:req.body.firstname,
                    lastname: req.body.lastname,
                    email:req.body.email,
                    mobile: req.body.telephone
                }
            )

            req.flash('success', 'Account Information updated successfully');
            return res.redirect('/myAccount'); // Redirect only here
        } catch (error) {
            console.log("::Error in editAccountInformation:::::", error);
            return res.redirect('/myAccount')
        }
    },

    changePassword: async function (req, res){
        try {
            console.log(":::changePassword::function:::");
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                userActive: 'active'
            };
            return res.render('frontend/changePassword', data);
        } catch (error) {
            console.log("::Error in changePassword::::", error);
            return res.redirect('/myAccount')
        }
    },

    saveChangePassword: async function (req, res) {
        try {
            console.log(":::saveCHangePassword:::Controller:::");
            console.log("::req.body:::",bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null));

            console.log("::req.session:::", req.session.details.id);

            let updatedata = await Sys.App.Services.CustomerServices.updateUserData(
                {
                    _id: req.session.details.id
                }, {
                    password_string: req.body.password,
                    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
                }
            )

            req.flash('success', 'Password changed successfully');
            return res.redirect('/myAccount'); // Redirect only here
        } catch (error) {
            console.log(":::Error in saveChangePassword:::", error);
            return res.redirect('/myAccount')
        }
    }

}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function create_Id() {
    var dt = new Date().getTime();
    var uuid = 'xxyxyxxyxyxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}
