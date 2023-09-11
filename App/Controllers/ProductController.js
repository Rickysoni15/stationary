var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");
var mongoose = require('mongoose');
const datetime = require('date-and-time');
const crypto = require("crypto");
const Razorpay = require("razorpay");
const request = require('request');
const f = require('session-file-store');
const { json } = require('express');
var axios = require('axios');
const instance = new Razorpay({
    key_id: 'rzp_test_TuIsuSCYym3sTj',
    key_secret: '9tfjzG39QmCizLo5xSOiFj2V',
});

let url = Sys.Config.Socket.url

// console.log("::url:::",url);

const nodemailer = require('nodemailer');

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

module.exports = {

    products: async function (req, res) {

        // console.log("req.body ###################################-->product===", req.body);

        try {
            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });

            for (let i = 0; i < productData.length; i++) {


                productData[i].product_price = parseFloat(productData[i].product_price)

                // productData[i].product_description = productData[i].product_description.replace(/(<([^>]+)>)/ig, '');
                productData[i].product_description = productData[i].product_description.replace(/<[^>]+>|&nbsp;/ig, '');

                let gstRate = (productData[i].GST_rate) / 100
                // console.log(":::gstRate:::", gstRate);
                productData[i].taxValue = (parseFloat(productData[i].product_price) * gstRate).toFixed(2)
                // console.log("::productData.taxValue:::",productData[i].taxValue);
                productData[i].imageSrc = ""
                productData[i].imageSrc = `${url}${productData[i].product_defaultImg[0].path}`
                // productData[i].otherImage = productData[i].product_image

                productData[i].otherImage = [{ image: productData[i].imageSrc }]


                if (productData[i].product_image.length) {
                    for (let j = 0; j < productData[i].product_image.length; j++) {
                        // console.log(":productData[i].product_image::",productData[i].product_image[j]);
                        let imagePath = `${url}${productData[i].product_image[j].path}`

                        // console.log(":::imagepath::::", imagePath);
                        productData[i].otherImage.push({ image: imagePath })
                        // productData.otherImage.push(`${url}${productData[i].product_image[j].path}`)

                    }
                }
            }

            // return console.log(":::productData:::",productData);

            let productCategory = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0", main_productId: null })

            // console.log(":::productCategory:::", productCategory);

            let dataObj = {
                productData: productData,
                productCategoryData: productCategory,
                productCount: productData.length
            }

            //   let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });


            //   if (req.session.details) {
            //     addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });

            //   }

            return res.render('frontend/product', dataObj);

        } catch (e) {
            console.log("Error in Product", e);
        }

        // try {
        //
        //     let productData;
        //     let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
        //     let addtocart;
        //     if (req.session.details) {
        //         addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });
        //
        //     }
        //
        //     let productfilterData = [];
        //     let newArrayData = [];
        //
        //     let start;
        //     if (req.body.start) {
        //         start = req.body.start
        //     } else {
        //         start = 0;
        //     }
        //
        //     let query = {};
        //     query = { "is_deleted": "0", "product_visibility": "1" };
        //
        //     let price = {};
        //
        //
        //     // console.log("req.body.sortValue ---->>", req.body.sortValue);
        //     let priceSort;
        //
        //
        //     // if (req.body.sortValue != 3 && req.body.sortValue != undefined) {
        //
        //     //     if (req.body.sortValue) {
        //     //         priceSort = parseInt(req.body.sortValue)
        //     //     }
        //
        //     // } else {
        //     //     priceSort = 1;
        //
        //     // }
        //
        //
        //
        //
        //
        //     if (req.body.searchVal == 'null') {
        //         return res.send('error')
        //
        //
        //     } else {
        //
        //         if (req.body.searchVal) {
        //
        //             query['product_name'] = {
        //                 $regex: req.body.searchVal,
        //                 $options: 'i'
        //             };
        //         }
        //     }
        //
        //     // console.log("req.body.finalName ---->>", req.body.finalName != 'null');
        //
        //     if (req.body.finalName != 'null') {
        //
        //         // console.log("1111111111");
        //
        //         if (req.params.name != undefined || req.params.name) {
        //
        //             query['product_category'] = {
        //                 $regex: req.params.name,
        //                 $options: 'i'
        //             };
        //         }
        //
        //     } else {
        //
        //         // console.log("2222222222222");
        //
        //         if (req.body.categoryData == 0) {
        //             return res.send('error')
        //
        //         } else {
        //
        //             if (req.body.categoryData != undefined || req.body.categoryData) {
        //
        //                 let catData = req.body.categoryData;
        //                 catData = catData.toLowerCase()
        //                 // console.log("ccccc",catData);
        //
        //                 let newCt = [];
        //                 let ctName = [];
        //                 let ptName = [];
        //                 // console.log("ccccc");
        //                 // console.log("productCategoryDataproductCategoryDataproductCategoryData",productCategoryData);
        //                 if (productCategoryData) {
        //
        //                     for (let ct = 0; ct < productCategoryData.length; ct++) {
        //
        //                         if (productCategoryData[ct].main_productId == null && productCategoryData[ct].main_sub_productId == null && productCategoryData[ct].category_name == catData) {
        //
        //                             newCt.push(productCategoryData[ct]._id)
        //
        //                         }
        //                         console.log("newCt",newCt);
        //                         for (const item of newCt) {
        //
        //                             if (item == productCategoryData[ct].main_productId || item == productCategoryData[ct].main_sub_productId) {
        //                                 ptName.push(productCategoryData[ct].productCategoryName)
        //                             }
        //
        //                         }
        //                     }
        //
        //                 }
        //                 console.log("ptName",ptName);
        //
        //                 for (const pt of ptName) {
        //
        //                     ctName.push(pt.replace(" ", "_"))
        //
        //                 }
        //
        //
        //                 query['product_category'] = {
        //                     $in: ctName,
        //                 };
        //             }
        //         }
        //
        //     }
        //
        //     console.log("categoryData",query);
        //
        //     if (req.body.sortValue == 3 && req.body.sortValue != undefined) {
        //         query['product_rating'] = {
        //             $lt: "4",
        //             $gt: "2",
        //         };
        //
        //     } else {
        //
        //         // console.log("sortvalue new" ,req.body);
        //
        //         if (req.body.sortValue) {
        //             priceSort = parseInt(req.body.sortValue)
        //         } else {
        //             priceSort = 1;
        //
        //         }
        //
        //     }
        //
        //     price = { product_price: priceSort }
        //
        //
        //
        //
        //
        //
        //     // if (req.params.name != undefined || req.params.name) {
        //     //
        //     //     query['product_category'] = {
        //     //         $regex: req.params.name,
        //     //         $options: 'i'
        //     //     };
        //
        //     // }
        //
        //     if (req.body.name != undefined || req.body.name) {
        //         let name = req.body.name
        //         if (typeof name === "string") {
        //
        //             if (req.body.name) {
        //                 query['product_category'] = {
        //                     $regex: req.body.name,
        //                     $options: 'i'
        //                 };
        //             }
        //         } else {
        //             if (name.product_category) {
        //                 query['product_category'] = {
        //                     $in: name.product_category
        //                 };
        //             }
        //
        //             if (name.product_brand) {
        //                 query['product_brand'] = {
        //                     $in: name.product_brand
        //                 };
        //             }
        //
        //             if (name.model_Number) {
        //                 query['model_Number'] = {
        //                     $in: name.model_Number
        //                 };
        //             }
        //
        //             if (name.seal_Type) {
        //                 query['seal_Type'] = {
        //                     $in: name.seal_Type
        //                 };
        //             }
        //             if (name.series_Type) {
        //                 query['series_Type'] = {
        //                     $in: name.series_Type
        //                 };
        //             }
        //             if (name.shaft_Sleeve) {
        //                 query['shaft_Sleeve'] = {
        //                     $in: name.shaft_Sleeve
        //                 };
        //             }
        //         }
        //     }
        //
        //     // console.log("|| req.body.filterName !='null'", req.body.filterName);
        //
        //
        //
        //     if (req.body.filterName != undefined && req.body.filterName != 'null') {
        //
        //         query['product_category'] = {
        //             $regex: req.body.filterName,
        //             $options: 'i'
        //         };
        //     }
        //
        //
        //     if (req.body.filter_brand != undefined || req.body.filter_brand) {
        //
        //         query['product_category'] = {
        //             $regex: req.body.filter_brand,
        //             $options: 'i'
        //         };
        //
        //     }
        //
        //     if (req.body.filter_model != undefined || req.body.filter_model) {
        //
        //         query['product_category'] = {
        //             $regex: req.body.filter_model,
        //             $options: 'i'
        //         };
        //     }
        //     if (req.body.filter_seal != undefined || req.body.filter_seal) {
        //
        //         query['product_category'] = {
        //             $regex: req.body.filter_seal,
        //             $options: 'i'
        //         };
        //     }
        //
        //     if (req.body.filter_series != undefined || req.body.filter_series) {
        //
        //         query['product_category'] = {
        //             $regex: req.body.filter_series,
        //             $options: 'i'
        //         };
        //
        //     }
        //     if (req.body.filter_shaft != undefined || req.body.filter_shaft) {
        //
        //         query['product_category'] = {
        //             $regex: req.body.filter_shaft,
        //             $options: 'i'
        //         };
        //
        //     }
        //
        //
        //
        //
        //
        //     if (req.body.filterObj != undefined || req.body.filterObj) {
        //         let filter_Data = req.body.filterObj;
        //         // console.log("filter_Data --- >>", filter_Data);
        //
        //         // var newArr = filter_Data.product_category.flat();
        //
        //         // console.log("new array --- category  ->",newArr);
        //
        //
        //         if (filter_Data.product_category) {
        //
        //             // console.log('kirans', filter_Data.product_category);
        //
        //             query['product_category'] = {
        //                 $in: filter_Data.product_category
        //             };
        //
        //         }
        //
        //         // console.log("q 1",query);
        //
        //
        //         if (filter_Data.product_brand) {
        //
        //             query['product_brand'] = {
        //                 $in: filter_Data.product_brand
        //             };
        //         }
        //
        //
        //         // console.log("q 2", query);
        //
        //         if (filter_Data.model_Number) {
        //
        //             query['model_Number'] = {
        //                 $in: filter_Data.model_Number
        //             };
        //         }
        //
        //         // console.log("q 3",query);
        //
        //
        //         if (filter_Data.seal_Type) {
        //
        //             query['seal_Type'] = {
        //                 $in: filter_Data.seal_Type
        //             };
        //         }
        //
        //         // console.log("q 4",query);
        //
        //
        //         if (filter_Data.series_Type) {
        //
        //             query['series_Type'] = {
        //                 $in: filter_Data.series_Type
        //             };
        //         }
        //
        //         // console.log("q 5",query);
        //
        //
        //         if (filter_Data.shaft_Sleeve) {
        //
        //             query['shaft_Sleeve'] = {
        //                 $in: filter_Data.shaft_Sleeve
        //             };
        //         }
        //
        //         // console.log("q 6",query);
        //
        //
        //         if (filter_Data.max_price && filter_Data.min_price) {
        //
        //             console.log("filter_Data.max_price ===>>", filter_Data.max_price.toString());
        //             console.log("filter_Data.min_price ===>>", filter_Data.min_price.toString());
        //
        //             let max_price = filter_Data.max_price.toString();
        //
        //             let min_price = filter_Data.min_price.toString();
        //
        //             let maxPrice;
        //
        //
        //             if (max_price == "100000") {
        //                 maxPrice = '99999';
        //             } else {
        //                 maxPrice = max_price;
        //             }
        //             query['product_price'] = {
        //                 $gte: min_price,
        //                 $lte: maxPrice,
        //             };
        //         }
        //
        //         // console.log("q 7",query);
        //
        //
        //     }
        //     console.log("q 8 ", query);
        //     console.log("price =====>>>", price);
        //     // console.log("querry --->>", query, start);
        //
        //     // if (req.body.categoryData == 0) {
        //     //     return res.send('error')
        //
        //     // } else {
        //     //     if (req.body.categoryData != undefined || req.body.categoryData) {
        //
        //     //
        //     //         query['product_category'] = {
        //     //             $regex: req.body.categoryData,
        //     //             $options: 'i'
        //     //         };
        //
        //     //     }
        //     // }
        //
        //
        //
        //     let menuCount = await Sys.App.Services.ProductServices.getProductPagination(query, start, price);
        //     for (let d = 0; d < menuCount.length; d++) {
        //
        //         if (menuCount[d].is_discount == 1) {
        //
        //             let today = new Date();
        //             let year = today.getFullYear();
        //             let mes = today.getMonth() + 1;
        //
        //             let dia = today.getDate();
        //
        //             if (mes.toString().length == 2) {
        //
        //                 mes = "-" + mes
        //
        //             }else{
        //                 mes = "-0" + mes
        //
        //             }
        //
        //             if (dia.toString().length == 2) {
        //
        //                 dia = "-" + dia
        //
        //             }else{
        //                 dia = "-0" + dia
        //
        //             }
        //
        //
        //             let fecha = year + mes + dia;
        //
        //             console.log("type of ===>>", fecha);
        //
        //
        //             // let d = new Date(),
        //             //     month = '' + (d.getMonth() + 1),
        //             //     day = '' + d.getDate(),
        //             //     year = d.getFullYear();
        //
        //             // if (month.length < 2)
        //             //     month = '0' + month;
        //             // if (day.length < 2)
        //             //     day = '0' + day;
        //
        //             // let fecha = [year, month, day].join('-');
        //
        //
        //             if (menuCount[d].discount_startDate != undefined && menuCount[d].discount_endDate != undefined) {
        //
        //
        //                 // if (menuCount[d].discount_startDate <= fecha && menuCount[d].discount_endDate >= fecha) {
        //                     let x = menuCount[d].discount_endDate;
        //                     let y = fecha;
        //                     let z = menuCount[d].discount_startDate;
        //                     if (z <= y && y <= x) {
        //                 // if (x >= y) {
        //                     console.log("1111111111111");
        //                     await Sys.App.Services.ProductServices.updateProductData({ _id: menuCount[d]._id },
        //                         {
        //                             $set: {
        //                                 discount_start: "true"
        //                             }
        //                         })
        //                 } else {
        //
        //                     console.log("2222222222222222");
        //                     await Sys.App.Services.ProductServices.updateProductData({ _id: menuCount[d]._id },
        //                         {
        //                             $set: {
        //                                 discount_start: "false"
        //                             }
        //                         })
        //                 }
        //             }
        //
        //         }
        //
        //     }
        //
        //
        //     productData = menuCount;
        //
        //     // console.log("menuCount --------->>>>", menuCount);
        //
        //
        //     // for (let d = 0; d < menuCount.length; d++) {
        //
        //     //     if (menuCount[d].is_discount == 1) {
        //
        //     //         // let today = new Date();
        //     //         // let year = today.getFullYear();
        //     //         // let mes = today.getMonth() + 1;
        //     //         // let dia = today.getDate();
        //     //         // let fecha = year + "-0" + mes + "-0" + dia;
        //
        //     //         var d = new Date(),
        //     //             month = '' + (d.getMonth() + 1),
        //     //             day = '' + d.getDate(),
        //     //             year = d.getFullYear();
        //
        //     //         if (month.length < 2)
        //     //             month = '0' + month;
        //     //         if (day.length < 2)
        //     //             day = '0' + day;
        //
        //     //         let fecha = [year, month, day].join('-');
        //
        //
        //     //         if (menuCount[d].discount_startDate != undefined && menuCount[d].discount_endDate != undefined) {
        //
        //
        //     //             if (menuCount[d].discount_startDate <= fecha && menuCount[d].discount_endDate >= fecha) {
        //
        //     //                 console.log("1111111111111");
        //     //                 await Sys.App.Services.ProductServices.updateProductData({ _id: menuCount[d]._id },
        //     //                     {
        //     //                         $set: {
        //     //                             discount_start: "true"
        //     //                         }
        //     //                     })
        //     //             } else {
        //
        //     //                 console.log("2222222222222222");
        //     //                 await Sys.App.Services.ProductServices.updateProductData({ _id: menuCount[d]._id },
        //     //                     {
        //     //                         $set: {
        //     //                             discount_start: "false"
        //     //                         }
        //     //                     })
        //     //             }
        //     //         }
        //
        //     //     }
        //
        //     // }
        //
        //     let reviewData = await Sys.App.Services.ReviewServices.getUserData()
        //     let wishlist = null;
        //     if (req.session.details) {
        //         wishlist = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });
        //     }
        //     let wishlist_id;
        //     for (let i = 0; i < menuCount.length; i++) {
        //         if (wishlist) {
        //             for (const element of wishlist.wishlist_arr) {
        //                 if (element == menuCount[i]._id.toString()) {
        //                     wishlist_id = element;
        //                 }
        //             }
        //         }
        //         menuCount[i].wishlist_arr = wishlist_id;
        //         if (reviewData.length > 0) {
        //             rating_nosum = reviewData.length;
        //             for (let r = 0; r < reviewData.length; r++) {
        //                 var dateData = reviewData[r].updatedAt;
        //                 reviewData[r].review_date = datetime.format(dateData, 'MMMM DD, YYYY');
        //                 // console.log("dadad", reviewData[r].review_date);
        //             }
        //         } else {
        //             menuCount[i].rating_avg = 0; menuCount[i].rating_avg_num = 0;
        //         }
        //     }
        //     var obj = {
        //         'recordsTotal': menuCount.length,
        //         'data': menuCount,
        //     };
        //     let totalRecord = menuCount.length;
        //     console.log("totalRecord --->>", totalRecord);
        //     if (req.params.value) {
        //         var obj = {
        //             'recordsTotal': menuCount.length,
        //             'data': menuCount,
        //         };
        //         return res.send(menuCount);
        //     }
        //     if (req.body.name != undefined || req.body.name) {
        //         return res.send(menuCount);
        //     }
        //
        //     if (req.body.searchVal != undefined || req.body.searchVal) {
        //         return res.send(menuCount);
        //     }
        //     if (req.body.categoryData != undefined || req.body.categoryData) {
        //         return res.send(menuCount);
        //     }
        //     if (req.body.filterObj != undefined || req.body.filterObj) {
        //         return res.send(menuCount);
        //     }
        //
        //
        //
        //     let subarray = [];
        //     let setids = [];
        //     let new_sub_arr = [];
        //     let subproduct;
        //     let subof_subproduct = [];
        //
        //     let filterOutput = [];
        //
        //     var finalarr = [];
        //
        //     if (productCategoryData) {
        //         for (let p = 0; p < productCategoryData.length; p++) {
        //
        //             if (productCategoryData[p].main_productId == null) {
        //                 setids.push(productCategoryData[p]._id)
        //             }
        //             for (let s = 0; s < setids.length; s++) {
        //                 if (setids[s] == productCategoryData[p].main_productId) {
        //                     subarray.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
        //                 }
        //             }
        //             if (productCategoryData[p].main_productId != null && productCategoryData[p].main_sub_productId != null) {
        //                 new_sub_arr.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
        //             }
        //         }
        //         // console.log("new ARRAy=========",subarray,subarray.length);
        //         for (let pr = 0; pr < productCategoryData.length; pr++) {
        //             subproduct = [];
        //             var subArrId = productCategoryData[pr]._id.toString()
        //             for (let ss = 0; ss < subarray.length; ss++) {
        //                 if (subarray[ss].main_productId == subArrId) {
        //                     // console.log("");
        //                     let str = subarray[ss].name
        //                     str = str.replace(" ", "_");
        //                     subproduct.push({ idids: subarray[ss].idids, name: subarray[ss].name, itemname: str, main_productId: subarray[ss].main_productId, main_sub_productId: subarray[ss].main_sub_productId, subof_subproduct: subof_subproduct })
        //                     productCategoryData[pr].subproduct = subproduct;
        //                 }
        //             }
        //             if (productCategoryData[pr].subproduct) {
        //                 for (let sr = 0; sr < productCategoryData[pr].subproduct.length; sr++) {
        //
        //                     // console.log("productCategoryData[pr].subproduct===",productCategoryData[pr].subproduct[sr].name);
        //                     finalarr = [];
        //                     var subArrId = productCategoryData[pr].subproduct[sr].idids;
        //
        //                     for (let n = 0; n < new_sub_arr.length; n++) {
        //                         if (new_sub_arr[n].main_productId == subArrId) {
        //                             let str = new_sub_arr[n].name
        //                             str = str.trim();
        //                             str = str.toLowerCase();
        //                             // str = str.replace(" ", "_");
        //                             str = str.split(' ').join('_');
        //                             let replacementString = '-';
        //                             str = str.replace(/\//g, replacementString);
        //                             finalarr.push({ idids: new_sub_arr[n].idids, name: new_sub_arr[n].name, itemname: str, main_productId: new_sub_arr[n].main_productId, main_sub_productId: new_sub_arr[n].main_sub_productId })
        //                             productCategoryData[pr].subproduct[sr].subof_subproduct = finalarr
        //                         }
        //                     }
        //                 }
        //             }
        //
        //
        //
        //
        //             if (subproduct.length) {
        //
        //                 let output = [];
        //                 let suboutput = [];
        //
        //
        //                 subproduct.forEach(function (item) {
        //                     var existing = output.filter(function (v, i) {
        //                         return v.name == item.name;
        //                     });
        //
        //                     if (existing.length) {
        //                         var existingIndex = output.indexOf(existing[0]);
        //                         output[existingIndex].subof_subproduct = output[existingIndex].subof_subproduct.concat(item.subof_subproduct);
        //                     } else {
        //                         if (typeof item.subof_subproduct == 'string')
        //                             item.subof_subproduct = [item.subof_subproduct];
        //                         output.push(item);
        //                     }
        //
        //
        //                 });
        //
        //                 productCategoryData[pr].subproduct = output;
        //
        //
        //                 for (let oo = 0; oo < output.length; oo++) {
        //
        //                     if (output[oo].itemname == req.params.name) {
        //
        //
        //                         filterOutput.push(output[oo])
        //
        //                     }
        //                 }
        //
        //             }
        //
        //         }
        //
        //     }
        //
        //
        //
        //
        //     let prjectCategoryData_dup = [];
        //     let jj = 0
        //     if (productCategoryData) {
        //         for (let ii = 0; ii < productCategoryData.length; ii++) {
        //             if (productCategoryData[ii].main_productId == null &&
        //                 productCategoryData[ii].main_sub_productId == null) {
        //                 jj = jj + 1;
        //                 if (jj < 6) {
        //                     prjectCategoryData_dup.push(productCategoryData[ii])
        //                 }
        //             }
        //         }
        //     }
        //     console.log("object ==== normal  ===== >>", menuCount);
        //
        //     var data = {
        //         App: req.session.details,
        //         error: req.flash("error"),
        //         success: req.flash("success"),
        //         product: 'active',
        //         // product_sub_Category: product_sub_Category,
        //         productfilterData: menuCount,
        //         productCategoryData: productCategoryData,
        //         prjectCategoryData_dup: prjectCategoryData_dup,
        //         totalRecord: totalRecord,
        //         productid: req.params.id,
        //         productname: req.params.name,
        //         addtocart: addtocart,
        //         filterOutput: filterOutput,
        //
        //     };
        //
        //
        //     // console.log("totalRecord ===>",menuCount);
        //
        //     return res.render('frontend/product', data);
        // } catch (e) {
        //     console.log("Error in about", e);
        // }

    },

    mainProduct: async function (req, res) {
        try {
            console.log("::mainProduct:::: controller:::", req.params.id);

            let mainProductId = req.params.id

            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ main_productId: mainProductId });

            // console.log(":::productData:::", productData.length);

            let productCategoryName = []

            for (let i = 0; i < productCategoryData.length; i++) {
                productCategoryName.push(productCategoryData[i].category_name)
            }

            // console.log(":::productCategoryName:::", productCategoryName);

            // let finalArray = []

            // for (let j = 0; j < productCategoryName.length; j++) {

            //     console.log(":::productCategoryName:::",productCategoryName[j]);

            //     let productDetail = await Sys.App.Services.ProductServices.getByData({  product_category: {
            //         $regex: productCategoryName[j],
            //         $options: "i"
            //       }});

            //     console.log(":::productDetail:::",productDetail.length);

            //     if (productDetail.length) {
            //         for (let k = 0; k < productDetail.length; k++) {
            //             finalArray.push(productDetail[k])
            //         }
            //     }


            // }

            // console.log(":::finalArray:::", finalArray.length);

            let productDetail = await Sys.App.Services.ProductServices.getByData({
                $or: productCategoryName.map(name => ({
                    product_category: {
                        $regex: name,
                        $options: "i"
                    }
                }))
            });

            // console.log(":::productDetail:::", productDetail);

            for (let i = 0; i < productDetail.length; i++) {

                productDetail[i].product_price = parseFloat(productDetail[i].product_price)

                // productDetail[i].product_description = productDetail[i].product_description.replace(/(<([^>]+)>)/ig, '');
                productDetail[i].product_description = productDetail[i].product_description.replace(/<[^>]+>|&nbsp;/ig, '');

                let gstRate = (productDetail[i].GST_rate) / 100
                // console.log(":::gstRate:::", gstRate);
                productDetail[i].taxValue = (parseFloat(productDetail[i].product_price) * gstRate).toFixed(2)
                // console.log("::productDetail.taxValue:::",productDetail[i].taxValue);
                productDetail[i].imageSrc = ""
                productDetail[i].imageSrc = `${url}${productDetail[i].product_defaultImg[0].path}`
            }

            let productCategory = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0", main_productId: mainProductId })

            // console.log(":::productCategory:::", productCategory);

            let mainProductCategory = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0", _id: mainProductId })

            // console.log("::mainProductCategory::",mainProductCategory);

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                userActive: 'active',
                productDetail: productDetail,
                productCategory: productCategory,
                mainProductCategory: mainProductCategory
            };
            return res.render('frontend/productDetail', data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    subProductDetail: async function (req, res) {
        try {
            console.log("::sub product::::: controller:::", req.params.id);

            let mainProductId = req.params.id

            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ _id: mainProductId });

            let mainProductCategoryId = productCategoryData[0].main_productId

            // console.log("::mainProductCategoryId:::",mainProductCategoryId);

            let mainProductDetail = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({ _id: mainProductCategoryId });

            // console.log(":::productCategoryData:::", productCategoryData.length);

            let productCategoryName = [productCategoryData[0].category_name]

            // for (let i = 0; i < productCategoryData.length; i++) {
            //     productCategoryName.push(productCategoryData[i].category_name)
            // }

            // console.log(":::productCategoryName:::", productCategoryName);

            // let finalArray = []

            // for (let j = 0; j < productCategoryName.length; j++) {

            //     console.log(":::productCategoryName:::",productCategoryName[j]);

            //     let productDetail = await Sys.App.Services.ProductServices.getByData({  product_category: {
            //         $regex: productCategoryName[j],
            //         $options: "i"
            //       }});

            //     console.log(":::productDetail:::",productDetail.length);

            //     if (productDetail.length) {
            //         for (let k = 0; k < productDetail.length; k++) {
            //             finalArray.push(productDetail[k])
            //         }
            //     }


            // }

            // console.log(":::finalArray:::", finalArray.length);

            let productDetail = await Sys.App.Services.ProductServices.getByData({
                $or: productCategoryName.map(name => ({
                    product_category: {
                        $regex: name,
                        $options: "i"
                    }
                }))
            });

            // console.log(":::productDetail:::", productDetail);

            for (let i = 0; i < productDetail.length; i++) {

                productDetail[i].product_price = parseFloat(productDetail[i].product_price)

                // productDetail[i].product_description = productDetail[i].product_description.replace(/(<([^>]+)>)/ig, '');
                productDetail[i].product_description = productDetail[i].product_description.replace(/<[^>]+>|&nbsp;/ig, '');

                let gstRate = (productDetail[i].GST_rate) / 100
                // console.log(":::gstRate:::", gstRate);
                productDetail[i].taxValue = (parseFloat(productDetail[i].product_price) * gstRate).toFixed(2)
                // console.log("::productDetail.taxValue:::",productDetail[i].taxValue);
                productDetail[i].imageSrc = ""
                productDetail[i].imageSrc = `${url}${productDetail[i].product_defaultImg[0].path}`
            }

            let productCategory = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0", main_productId: mainProductId })

            // console.log(":::productCategory:::", productCategory);

            let mainProductCategory = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0", _id: mainProductId })

            // console.log("::mainProductCategory::",mainProductCategory);

            // console.log("::mainProductDetail:::",mainProductDetail);

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                userActive: 'active',
                productDetail: productDetail,
                productCategory: productCategory,
                mainProductCategory: mainProductCategory,
                mainProductCategoryName: mainProductDetail.productCategoryName
            };
            return res.render('frontend/subProductDetail', data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    // confirmOrder : async function (req, res){
    //     try {
    //     console.log("::confirmOrder::function:",req.body);
    //     // return res.send("success")
            
    //     } catch (error) {
    //         console.log(":::Error in confrim order:::", error);
    //     }
    // },


    addtocart_call: async function (req, res) {
        try {
            console.log("req.session.details.id::add to cart:::", req.session.details);

            // return console.log(":::req.body:::", req.body);
            /* code with check login session
            let userDetail
            if (req.session.details && req.session.details.id && req.session.details.jwt_token) {
                console.log("::here::");
                userDetail = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id, jwt_token: req.session.details.jwt_token })
            }
            console.log(":::userDetail:::wishlist:::", userDetail);

            if (!userDetail) {
                console.log(":::user is not logged in");
                req.flash('error', 'No Such User Found');
                console.log("user not found =====>>>");
                await req.session.save(async function (err) {
                    // session saved
                    console.log('session saved');
                });
                return res.redirect('/frontend/product');
            } else {
                console.log("req.body-->addtocart_call===", req.body.productId);
                let addtocart = await Sys.App.Services.OrderServices.getSingleUserData({ "product_id": req.body.productId, customer_id: "64e33fa174ffcb15a419a2a6", is_deleted: "0", product_status: { $ne: "success" } });
                console.log("addtocart====", addtocart);

                let prId = mongoose.Types.ObjectId(req.body.productId);

                let productData = await Sys.App.Services.ProductServices.getByData({ _id: prId, is_deleted: "0" });

                // console.log("::productData:::",productData);

                let actual_price;

                if (productData[0].is_discount == 1) {
                    actual_price = productData[0].discount_price;

                    // actual_price = actual_price.replace(/,/g, "");

                } else {
                    actual_price = productData[0].product_price;
                    // actual_price = actual_price.replace(/,/g, "");
                }
                req.session.details.id = "64e33fa174ffcb15a419a2a6"

                if (!addtocart || addtocart == null) {
                    // console.log("add to cart");
                    let updatedata = await Sys.App.Services.OrderServices.insertUserData({
                        product_id: req.body.productId,
                        customer_id: req.session.details.id,
                        product_quantity: "1",
                        product_price: actual_price,
                        product_basic_price: actual_price,
                        product_weight: productData[0].product_weight,
                        is_discount: productData[0].is_discount,
                        discount_start: productData[0].discount_start,
                        discount_value: productData[0].discount_value,
                        product_name: productData[0].product_name,
                        product_price: productData[0].product_price

                    });
                    console.log("insert data whishlist to shopping cart", updatedata);
                    let wishlist = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
                    console.log("wishlist::", wishlist);
                    let custid = mongoose.Types.ObjectId(req.session.details.id);
                    if (wishlist) {
                        // console.log("remove to cart");
                        let updatedata = await Sys.App.Services.UserServices.updateUserData(
                            {
                                _id: custid
                            }, {
                            "$pull": { "wishlist_arr": req.body.productId }
                        });
                    }
                    return res.send("success");
                } else {
                    // console.log("addtocart====", addtocart);

                    // console.log(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;",addtocart._id);
                    let product_quantity = 0;
                    product_quantity = parseInt(addtocart.product_quantity) + 1;
                    let product_price = 0;

                    product_price = parseInt(addtocart.product_price) + parseInt(addtocart.product_basic_price);
                    console.log(product_quantity, "product_quantity909090", addtocart.product_quantity);
                    var flagt = false;
                    if (parseInt(addtocart.product_quantity) != parseInt(productData[0].product_stock_quantity)) {

                        let updatedata = await Sys.App.Services.OrderServices.updateUserData(
                            {
                                _id: addtocart._id,
                            }, {
                            "$set": { product_quantity: product_quantity, product_price: product_price }
                        });
                        flagt = true;
                    }
                    // console.log(updatedata,"updatedata");

                    let wishlist = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
                    let custid = mongoose.Types.ObjectId(req.session.details.id);
                    if (wishlist) {
                        console.log("remove to cart");
                        let updatedata = await Sys.App.Services.UserServices.updateUserData(
                            {
                                _id: custid
                            }, {
                            "$pull": { "wishlist_arr": req.body.productId }
                        });
                    }
                    if (flagt == true) {
                        return res.send("success");

                    } else {
                        return res.send("error");

                    }
                }
            }
            */

            if (req.session.details == undefined) {
                return res.redirect('/home')
            }
            /* code without checking login session*/

            console.log("req.body-->addtocart_call===", req.body.productId);
            let addtocart = await Sys.App.Services.OrderServices.getSingleUserData({ "product_id": req.body.productId, customer_id: req.session.details.id, is_deleted: "0", product_status: { $ne: "confirmed" } });
            console.log("addtocart====", addtocart);

            let prId = mongoose.Types.ObjectId(req.body.productId);

            let productData = await Sys.App.Services.ProductServices.getByData({ _id: prId, is_deleted: "0" });

            // console.log("::productData:::",productData);

            let actual_price;

            if (productData[0].is_discount == 1) {
                actual_price = productData[0].discount_price;
                // actual_price = actual_price.replace(/,/g, "");
            } else {
                actual_price = productData[0].product_price;
                // actual_price = actual_price.replace(/,/g, "");
            }
            // req.session.details.id = "64e33fa174ffcb15a419a2a6"

            if (!addtocart || addtocart == null) {
                // console.log("add to cart");
                let updatedata = await Sys.App.Services.OrderServices.insertUserData({
                    product_id: req.body.productId,
                    customer_id: req.session.details.id,
                    product_quantity: "1",
                    product_price: actual_price,
                    product_basic_price: actual_price,
                    product_weight: productData[0].product_weight,
                    is_discount: productData[0].is_discount,
                    discount_start: productData[0].discount_start,
                    discount_value: productData[0].discount_value,
                    product_name: productData[0].product_name,
                    product_price: productData[0].product_price

                });
                console.log("insert data whishlist to shopping cart", updatedata);
                let wishlist = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });
                console.log("wishlist::", wishlist);
                let custid = mongoose.Types.ObjectId(req.session.details.id);
                if (wishlist) {
                    // console.log("remove to cart");
                    let updatedata = await Sys.App.Services.CustomerServices.updateUserData(
                        {
                            _id: custid
                        }, {
                        "$pull": { "wishlist_arr": req.body.productId }
                    });
                }
                return res.send("success");
            } else {
                // console.log("addtocart====", addtocart);

                // console.log(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;",addtocart._id);
                let product_quantity = 0;
                product_quantity = parseInt(addtocart.product_quantity) + 1;
                let product_price = 0;

                product_price = parseInt(addtocart.product_price) + parseInt(addtocart.product_basic_price);
                console.log(product_quantity, "product_quantity909090", addtocart.product_quantity);
                var flagt = false;
                if (parseInt(addtocart.product_quantity) != parseInt(productData[0].product_stock_quantity)) {

                    let updatedata = await Sys.App.Services.OrderServices.updateUserData(
                        {
                            _id: addtocart._id,
                        }, {
                        "$set": { product_quantity: product_quantity, product_price: product_price }
                    });
                    flagt = true;
                }
                // console.log(updatedata,"updatedata");

                let wishlist = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });
                let custid = mongoose.Types.ObjectId(req.session.details.id);
                if (wishlist) {
                    console.log("remove to cart");
                    let updatedata = await Sys.App.Services.CustomerServices.updateUserData(
                        {
                            _id: custid
                        }, {
                        "$pull": { "wishlist_arr": req.body.productId }
                    });
                }
                if (flagt == true) {
                    return res.send("success");

                } else {
                    return res.send("error");

                }
            }
        } catch (e) {
            console.log("Error in gridproducts", e);
        }
    },

    addtocart_remove: async function (req, res) {
        try {
            console.log("::req.session.details::addtocart_remove:", req.session.details);

            console.log("req.body-->addtocart_remove===", req.body.productId);
            let addtocart = await Sys.App.Services.OrderServices.getSingleUserData
                ({ "product_id": req.body.productId, is_deleted: "0", product_status: "pending" });
            console.log("addtocart====", addtocart);
            let id = mongoose.Types.ObjectId(addtocart._id);
            if (addtocart) { //|| addtocart != null
                let updatedata = await Sys.App.Services.OrderServices.updateUserData(
                    {
                        _id: id
                    }, {
                    "$set": { is_deleted: "1" }
                });
                console.log("||updatedata addtocart != null", updatedata);
                return res.send("success");
            }
        } catch (e) {
            console.log("Error in addtocart_remove", e);
        }
    },

    shoppingcart: async function (req, res) {
        try {
            console.log("::req.session.details::shoppingcart:", req.session.details);

            if (req.session.details == undefined) {
                return res.redirect('/home')
            }
            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0", product_visibility: "1" });

            let query = { is_deleted: "0" }
            let price = { _id: -1 }
            let length = 3

            let latestProduct = await Sys.App.Services.ProductServices.getLatestProduct(query, price, length)

            // console.log(":::latestProduct:::",latestProduct);

            let finalLatestProduct = []

            if (latestProduct.length) {
                for (let k = 0; k < latestProduct.length; k++) {
                    let latestProdObj = {}
                    latestProdObj.productId = latestProduct[k]._id
                    latestProdObj.productName = latestProduct[k].product_name
                    latestProdObj.price = parseFloat(latestProduct[k].product_price)
                    latestProdObj.imageSrc = `${url}${latestProduct[k].product_defaultImg[0].path}`

                    finalLatestProduct.push(latestProdObj)
                }
            }

            // console.log(":::finalLatestProduct:::",finalLatestProduct);

            // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0", main_productId: null });

            // let addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": "64e33fa174ffcb15a419a2a6", is_deleted: "0", product_status: "pending" });
            let addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });


            // console.log(":::addtocart:::", addtocart.length);

            let addtocartdata = [];

            let dataObj = {
                productCategoryData: productCategoryData,
                finalLatestProduct: finalLatestProduct
            }

            if (!addtocart.length) {
                // return res.redirect('/products')
                return res.render('frontend/checkoutcart', dataObj);

            }

            let finalSubTotal = 0
            let finalTax = 0
            let finalTotal = 0

            for (let i = 0; i < addtocart.length; i++) {
                let productId = addtocart[i].product_id

                let productDetail = await Sys.App.Services.ProductServices.getProductData({ _id: productId, is_deleted: "0" })
                // console.log(":::productDetail:::", productDetail, i);

                let productTax = productDetail ? parseFloat(productDetail.GST_rate) : 0
                // console.log("::productTax:::", productTax);
                let finalObj = {}
                finalObj.productId = productId
                finalObj.imageSrc = `${url}${productDetail.product_defaultImg[0].path}`
                finalObj.product_name = productDetail ? productDetail.product_name : ""
                finalObj.quantity = parseFloat(addtocart[i].product_quantity)
                finalObj.unitPrice = parseFloat(addtocart[i].product_basic_price)
                finalObj.total = parseFloat(addtocart[i].product_quantity) * parseFloat(addtocart[i].product_basic_price)

                finalSubTotal += finalObj.total

                finalObj.tax = (((parseFloat(addtocart[i].product_quantity) * parseFloat(addtocart[i].product_basic_price)) * productTax) / 100)

                finalTax += finalObj.tax

                finalObj.grandTotal = finalObj.total + finalObj.tax

                finalTotal += finalObj.grandTotal

                addtocartdata.push(finalObj)
            }

            // console.log("::finalSubTotal:::", finalSubTotal);

            // for (let i = 0; i < productData.length; i++) {
            //     if (addtocart) {
            //         for (let a = 0; a < addtocart.length; a++) {
            //             if (addtocart[a].product_id.toString() == productData[i]._id.toString()) {
            //                 if (addtocart[a].product_quantity != "0") {
            //                     productData[i].product_quantity = addtocart[a].product_quantity;
            //                     if (productData[i].is_discount == "1" && productData[i].discount_start == "true") {
            //                         // productData[i].product_price = productData[i].discount_price;
            //                         if (productData[i].product_quantity != "1") {
            //                             addtocart[a].product_price = productData[i].discount_price * parseFloat(addtocart[i].product_quantity);
            //                         } else {
            //                             addtocart[a].product_price = productData[i].discount_price;
            //                         }
            //                     }
            //                 } else {
            //                     // console.log("<<<<=====productData[i].is_discount,productData[i].discount_start====>>>",productData[i].is_discount,productData[i].discount_start,productData[i].discount_price);
            //                     productData[i].product_quantity = "1";
            //                     if (productData[i].product_quantity == "1") {
            //                         if (productData[i].is_discount == "1" && productData[i].discount_start == "true") {
            //                             // productData[i].product_price = productData[i].discount_price;
            //                             addtocart[a].product_price = productData[i].discount_price;
            //                         }
            //                     }
            //                 }

            //                 console.log("ppppppppppppp---", productData[i].product_quantity);
            //                 console.log("ppppppppppppp--product_quantity_price-", productData[i].product_stock_quantity);
            //                 productData[i].product_quantity_price = addtocart[a].product_price;
            //                 if (parseInt(productData[i].product_stock_quantity) < parseInt(productData[i].product_quantity)) {
            //                     productData[i].product_stock_status = "Out Of Stock";
            //                 }
            //                 addtocartdata.push(productData[i])
            //             }
            //         }
            //     }
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

            console.log("addtocartdata =====>>>>", addtocartdata);
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                addtocartdata: addtocartdata,
                productData: productData,
                finalLatestProduct: finalLatestProduct,
                productCategoryData: productCategoryData,
                finalSubTotal: (finalSubTotal).toFixed(2),
                finalTax: (finalTax).toFixed(2),
                finalTotal: (finalTotal).toFixed(2),
                // prjectCategoryData_dup: prjectCategoryData_dup,
                addtocart: addtocart
            };

            // console.log("hhhhhhhhhdhdhdhdhdhdhdhdh================>>>>>>>>>>>>>>>>>>>>>>",homeData);

            // console.log(projectData, "homeprojectDatacontroller");
            return res.render('frontend/checkoutcart', data);
        } catch (e) {
            console.log("Error shoppingcart", e);
        }
    },



    wishlist_call: async function (req, res) {
        try {
            // find login user here
            console.log("req.session.details.::wishlist_call:::", req.session.details);

            if (req.session.details == undefined) {
                console.log(":::session detail not found in wishlist_call:::");
                return res.redirect('/home')
            }

            console.log("req.body-->wishlist===", req.body.productId);
            // req.session.details.id = "64e33fa174ffcb15a419a2a6"
            // let wishlist = await Sys.App.Services.CustomerServices.getSingleUserData
            //     ({ _id: req.session.details.id, "wishlist_arr": req.body.productId });

            let wishlist = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id, wishlist_arr: req.body.productId })

            console.log("wishlist====", wishlist);

            // let id = mongoose.Types.ObjectId(req.session.details.id);
            if (!wishlist || wishlist == null) {
                console.log("::add new data:::");
                let updatedata = await Sys.App.Services.CustomerServices.updateUserData(
                    {
                        _id: req.session.details.id
                    }, {
                    $push: {
                        wishlist_arr: req.body.productId
                    }
                });
                return res.send("success");
            } else {
                console.log("::remove existing data:::");

                let updatedata = await Sys.App.Services.CustomerServices.updateUserData(
                    {
                        _id: req.session.details.id
                    }, {
                    "$pull": { "wishlist_arr": req.body.productId }
                });
                return res.send("error");
            }




        } catch (e) {
            console.log("Error in gridproducts", e);
        }
    },

    wishlist_get: async function (req, res) {
        try {
            // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0", product_visibility: "1" });
            // // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
            // let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });

            // let addtocart;
            // if (req.session.details) {
            //     addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });
            // }

            // let wishlist = await Sys.App.Services.CustomerServices.getSingleUserData
            //     ({ _id: req.session.details.id });
            // // console.log("wishlist====", wishlist);

            // for (let d = 0; d < productData.length; d++) {

            //     if (productData[d].is_discount == 1) {

            //         let today = new Date();
            //         let year = today.getFullYear();
            //         let mes = today.getMonth() + 1;
            //         let dia = today.getDate();
            //         // let fecha = year + "-0" + mes + "-" + dia;
            //         if (mes.toString().length == 2) {

            //             mes = "-" + mes

            //         } else {
            //             mes = "-0" + mes

            //         }

            //         if (dia.toString().length == 2) {

            //             dia = "-" + dia

            //         } else {
            //             dia = "-0" + dia

            //         }


            //         let fecha = year + mes + dia;

            //         console.log("type of ===>>", fecha);

            //         // if (productData[d].discount_startDate <= fecha && productData[d].discount_endDate >= fecha) {
            //         let x = productData[d].discount_endDate;
            //         let y = fecha;
            //         let z = productData[d].discount_startDate;
            //         if (z <= y && y <= x) {
            //             // if (x >= y) {
            //             await Sys.App.Services.ProductServices.updateProductData({ _id: productData[d]._id },
            //                 {
            //                     $set: {
            //                         discount_start: "true"
            //                     }
            //                 })
            //         } else {
            //             await Sys.App.Services.ProductServices.updateProductData({ _id: productData[d]._id },
            //                 {
            //                     $set: {
            //                         discount_start: "false"
            //                     }
            //                 })
            //         }

            //     }

            // }

            // let wishlistdata = [];
            // // for (let i = 0; i < productData.length; i++) {
            // //     for (const element of wishlist.wishlist_arr) {
            // //         if (element == productData[i]._id.toString()) {
            // //             wishlistdata.push(productData[i])
            // //         }
            // //     }
            // // }
            // // console.log("wishlist====", wishlistdata);

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
            console.log(":::req.session.details:::wishlist_get:::", req.session.details);

            let dataObj = {}
            if (req.session.details == undefined) {
                return res.redirect('/home')
                // return res.render('frontend/watchlist', dataObj);
            }

            let wishlistdata = []
            let customerId = req.session.details.id

            // console.log(":::customerId:::", customerId);

            let customerInfo = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: customerId })

            // console.log(":::customerInfo:::", customerInfo);

            let wishListInfo = customerInfo.wishlist_arr ? customerInfo.wishlist_arr : []

            // console.log("::wishListInfo:::", wishListInfo);
            // wishListInfo= []

            if (!wishListInfo.length) {
                console.log(":::no wishlist item");
                // return res.redirect('/products')
                return res.render('frontend/watchlist', dataObj);
            }

            for (let i = 0; i < wishListInfo.length; i++) {
                let productObj = {}
                let productId = wishListInfo[i]
                // console.log(":::productId:::", productId);

                let productInfo = await Sys.App.Services.ProductServices.getProductData({ _id: productId, is_deleted: "0" })

                // console.log(":::productInfo:::", productInfo);
                if (productInfo) {
                    productObj.productId = productInfo._id
                    productObj.imageSrc = `${url}${productInfo.product_defaultImg[0].path}`
                    productObj.product_name = productInfo.product_name
                    productObj.stock = productInfo.product_stock_status
                    productObj.unitPrice = productInfo.product_price

                    wishlistdata.push(productObj)
                }
            }
            // console.log(":::wishListData:::", wishlistdata);

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                wishlistdata: wishlistdata,
                // productData: productData,
                // productCategoryData: productCategoryData,
                // prjectCategoryData_dup: prjectCategoryData_dup,
                // addtocart: addtocart,
            };

            return res.render('frontend/watchlist', data);
        } catch (e) {
            console.log("Error in gridproducts", e);
        }
    },

    wishlist_remove: async function (req, res) {
        try {
            console.log(":::req.session,details ::in wishlist_remove:::", req.session.details);

            console.log(":::req.body::in wishlist_remove:::", req.body);

            let updatedata = await Sys.App.Services.CustomerServices.updateUserData(
                {
                    _id: req.session.details.id
                }, {
                "$pull": { "wishlist_arr": req.body.productId }
            });

            return res.send("success");
        } catch (error) {
            console.log(":Error in::wishlist_remove:::", error);
        }
    },



    // checkout: async function (req, res) {
    //     try {
    //         // return res.render('frontend/checkout');
    //         if (req.session.details == undefined) {
    //             return res.redirect('/home')
    //         }
    //         let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });
    //         console.log("userrrrr", user);
    //         let defaultAddress = ""

    //         let addressInfo = user.address_arr

    //         if (addressInfo.length) {
    //             const filteredArray = addressInfo.filter(object => object.default == "1");

    //             console.log(":::filteredArray::checkout::",filteredArray[0]);
    
    //             if (filteredArray[0].address_2=="" || !filteredArray[0].address_2) {
    //                 defaultAddress = `${filteredArray[0].address_1}, ${filteredArray[0].city}, ${filteredArray[0].stateName},${filteredArray[0].postcode}, ${filteredArray[0].countryName}`
    //             } else {
    //                 defaultAddress = `${filteredArray[0].address_1} ${filteredArray[0].address_2}, ${filteredArray[0].city}, ${filteredArray[0].stateName},${filteredArray[0].postcode},${filteredArray[0].countryName}`
    //             }
                
    
    //         }

           
    //         console.log(":::defaultAddress:::",defaultAddress);

    //         // let couponcode_data;
    //         // let coupon_id;
    //         // console.log("usssss", user);
    //         // var address_arr = [];
    //         // if (user) {
    //         //     if (user.coupon_arr.length > 0) {
    //         //         for (let uu = 0; uu < user.coupon_arr.length; uu++) {
    //         //             console.log("user.coupon_arr[uu].coupon_id", user.coupon_arr[uu]);
    //         //             coupon_id = mongoose.Types.ObjectId(user.coupon_arr[uu].coupon_id);
    //         //             console.log("coupon_id", coupon_id);
    //         //             couponcode_data = await Sys.App.Services.CouponcodeServices.getByData({ is_deleted: "0", _id: { $ne: coupon_id } });
    //         //         }
    //         //     } else {
    //         //         couponcode_data = await Sys.App.Services.CouponcodeServices.getByData({ is_deleted: "0" });
    //         //     }
    //         //     if (user.address_arr.length > 0) {
    //         //         for (let ar = 0; ar < user.address_arr.length; ar++) {
    //         //             if (user.address_arr[ar].is_default == "0") {
    //         //                 address_arr.push(user.address_arr[ar]);
    //         //             }
    //         //         }
    //         //     } else {

    //         //         req.flash('success', 'Please Add Your Address');
    //         //         // await req.session.save(async function (err) {
    //         //         //   session saved
    //         //         //   console.log('session saved');
    //         //         return res.redirect('/customer_address');
    //         //         // });
    //         //     }
    //         // }
    //         // console.log("couponcode_data-cc----", couponcode_data);


    //         // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0", product_visibility: "1" });
    //         // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });

    //         let query = { is_deleted: "0" }
    //         let price = { _id: -1 }
    //         let length = 3

    //         let latestProduct = await Sys.App.Services.ProductServices.getLatestProduct(query, price, length)

    //         // console.log(":::latestProduct:::",latestProduct);

    //         let finalLatestProduct = []

    //         if (latestProduct.length) {
    //             for (let k = 0; k < latestProduct.length; k++) {
    //                 let latestProdObj = {}
    //                 latestProdObj.productId = latestProduct[k]._id
    //                 latestProdObj.productName = latestProduct[k].product_name
    //                 latestProdObj.price = parseFloat(latestProduct[k].product_price)
    //                 latestProdObj.imageSrc = `${url}${latestProduct[k].product_defaultImg[0].path}`

    //                 finalLatestProduct.push(latestProdObj)
    //             }
    //         }

    //         let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0", main_productId: null });

    //         // let addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });

    //         let addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });

    //         // console.log(":::addtocart:::", addtocart.length);

    //         let addtocartdata = [];

    //         var dataObj = {
    //             App: req.session.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             // addtocartdata: addtocartdata,
    //             // productData: productData,
    //             productCategoryData: productCategoryData,
    //             finalLatestProduct: finalLatestProduct,
    //             // address: "416, Shilp Zaveri, NKP Group of Industries, Swinagar Society, Nehru Nagar, Shyamal, Ahmedabad, Gujarat 380015",
    //             address: defaultAddress
    //             // prjectCategoryData_dup: prjectCategoryData_dup,
    //             // addtocart: addtocart,
    //             // user: user,
    //             // couponcode_data: couponcode_data,
    //             // shipping_charge: shipping_charge
    //         };

    //         if (!addtocart.length) {
    //             // return res.redirect('/products')
    //             return res.render('frontend/checkoutcart', dataObj);
    //         }

    //         let finalSubTotal = 0
    //         let finalTax = 0
    //         let finalTotal = 0

    //         for (let i = 0; i < addtocart.length; i++) {
    //             let productId = addtocart[i].product_id

    //             let productDetail = await Sys.App.Services.ProductServices.getProductData({ _id: productId, is_deleted: "0" })
    //             // console.log(":::productDetail:::", productDetail, i);

    //             let productTax = productDetail ? parseFloat(productDetail.GST_rate) : 0
    //             // console.log("::productTax:::", productTax);
    //             let finalObj = {}
    //             finalObj.productId = productId
    //             finalObj.imageSrc = `${url}${productDetail.product_defaultImg[0].path}`
    //             finalObj.product_name = productDetail ? productDetail.product_name : ""
    //             finalObj.quantity = parseFloat(addtocart[i].product_quantity)
    //             finalObj.unitPrice = parseFloat(addtocart[i].product_basic_price)
    //             finalObj.total = parseFloat(addtocart[i].product_quantity) * parseFloat(addtocart[i].product_basic_price)

    //             finalSubTotal += finalObj.total

    //             finalObj.tax = (((parseFloat(addtocart[i].product_quantity) * parseFloat(addtocart[i].product_basic_price)) * productTax) / 100)

    //             finalTax += finalObj.tax

    //             finalObj.grandTotal = finalObj.total + finalObj.tax

    //             finalTotal += finalObj.grandTotal

    //             addtocartdata.push(finalObj)
    //         }

    //         console.log("addtocartdata =====>>>>", addtocartdata);

    //         // let addtocartdata = [];
    //         // let shipping_charge;
    //         // for (let i = 0; i < productData.length; i++) {
    //         //     if (addtocart) {
    //         //         for (let a = 0; a < addtocart.length; a++) {
    //         //             if (addtocart[a].product_id.toString() == productData[i]._id.toString()) {
    //         //                 if (addtocart[a].product_quantity != "0") {
    //         //                     productData[i].product_quantity = addtocart[a].product_quantity;
    //         //                 } else {
    //         //                     productData[i].product_quantity = "1";
    //         //                 }
    //         //                 let vendor = await Sys.App.Services.VendorProfileServices.getVendorData({ _id: productData[i].venodor_id });
    //         //                 if (vendor) {
    //         //                     if (address_arr.length > 0) {
    //         //                         if (address_arr[0].state == vendor.pickup_address[0].state) {
    //         //                             if (address_arr[0].city == vendor.pickup_address[0].city) {
    //         //                                 if (productData[a].product_weight == "0.5" || productData[a].product_weight == "1") {
    //         //                                     shipping_charge = "81";
    //         //                                 } else if (productData[a].product_weight == "2") {
    //         //                                     shipping_charge = "162";
    //         //                                 } else if (productData[a].product_weight == "3") {
    //         //                                     shipping_charge = "242";
    //         //                                 } else if (productData[a].product_weight == "4") {
    //         //                                     shipping_charge = "323";
    //         //                                 } else if (productData[a].product_weight == "5") {
    //         //                                     shipping_charge = "404";
    //         //                                 } else {
    //         //                                     shipping_charge = "0";
    //         //                                 }
    //         //                             } else {
    //         //                                 if (productData[a].product_weight == "0.5" || productData[a].product_weight == "1") {
    //         //                                     shipping_charge = "91";
    //         //                                 } else if (productData[a].product_weight == "2") {
    //         //                                     shipping_charge = "182";
    //         //                                 } else if (productData[a].product_weight == "3") {
    //         //                                     shipping_charge = "273";
    //         //                                 } else if (productData[a].product_weight == "4") {
    //         //                                     shipping_charge = "364";
    //         //                                 } else if (productData[a].product_weight == "5") {
    //         //                                     shipping_charge = "455";
    //         //                                 } else {
    //         //                                     shipping_charge = "0";
    //         //                                 }
    //         //                             }
    //         //                         } else {
    //         //                             if (productData[a].product_weight == "0.5" || productData[a].product_weight == "1") {
    //         //                                 shipping_charge = "125";
    //         //                             } else if (productData[a].product_weight == "2") {
    //         //                                 shipping_charge = "250";
    //         //                             } else if (productData[a].product_weight == "3") {
    //         //                                 shipping_charge = "375";
    //         //                             } else if (productData[a].product_weight == "4") {
    //         //                                 shipping_charge = "500";
    //         //                             } else if (productData[a].product_weight == "5") {
    //         //                                 shipping_charge = "625";
    //         //                             } else {
    //         //                                 shipping_charge = "0";
    //         //                             }

    //         //                         }
    //         //                     }
    //         //                 }
    //         //                 productData[i].product_quantity_price = addtocart[a].product_price;

    //         //                 if (parseInt(productData[i].product_stock_quantity) < parseInt(productData[i].product_quantity)) {
    //         //                     productData[i].product_stock_status = "Out Of Stock";
    //         //                 } else {
    //         //                     addtocartdata.push(productData[i])
    //         //                 }

    //         //             }
    //         //         }
    //         //     }
    //         // }

    //         // let subarray = [];
    //         // let setids = [];
    //         // let new_sub_arr = [];
    //         // let subproduct;
    //         // let subof_subproduct = [];

    //         // var finalarr = [];

    //         // if (productCategoryData) {
    //         //     for (let p = 0; p < productCategoryData.length; p++) {

    //         //         if (productCategoryData[p].main_productId == null) {
    //         //             setids.push(productCategoryData[p]._id)
    //         //         }
    //         //         for (let s = 0; s < setids.length; s++) {
    //         //             if (setids[s] == productCategoryData[p].main_productId) {
    //         //                 subarray.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
    //         //             }
    //         //         }
    //         //         if (productCategoryData[p].main_productId != null && productCategoryData[p].main_sub_productId != null) {
    //         //             new_sub_arr.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
    //         //         }
    //         //     }
    //         //     // console.log("new ARRAy=========",subarray,subarray.length);
    //         //     for (let pr = 0; pr < productCategoryData.length; pr++) {
    //         //         subproduct = [];

    //         //         var subArrId = productCategoryData[pr]._id.toString()
    //         //         for (let ss = 0; ss < subarray.length; ss++) {

    //         //             if (subarray[ss].main_productId == subArrId) {
    //         //                 // console.log("");
    //         //                 let str = subarray[ss].name
    //         //                 str = str.replace(" ", "_");
    //         //                 subproduct.push({ idids: subarray[ss].idids, name: subarray[ss].name, itemname: str, main_productId: subarray[ss].main_productId, main_sub_productId: subarray[ss].main_sub_productId, subof_subproduct: subof_subproduct })
    //         //                 productCategoryData[pr].subproduct = subproduct;

    //         //             }
    //         //         }
    //         //         if (productCategoryData[pr].subproduct) {



    //         //             for (let sr = 0; sr < productCategoryData[pr].subproduct.length; sr++) {

    //         //                 // console.log("productCategoryData[pr].subproduct===",productCategoryData[pr].subproduct[sr].name);
    //         //                 finalarr = [];
    //         //                 var subArrId = productCategoryData[pr].subproduct[sr].idids;

    //         //                 for (let n = 0; n < new_sub_arr.length; n++) {
    //         //                     if (new_sub_arr[n].main_productId == subArrId) {
    //         //                         let str = new_sub_arr[n].name
    //         //                         str = str.trim();
    //         //                         str = str.toLowerCase();
    //         //                         // str = str.replace(" ", "_");
    //         //                         str = str.split(' ').join('_');
    //         //                         let replacementString = '-';
    //         //                         str = str.replace(/\//g, replacementString);

    //         //                         finalarr.push({ idids: new_sub_arr[n].idids, name: new_sub_arr[n].name, itemname: str, main_productId: new_sub_arr[n].main_productId, main_sub_productId: new_sub_arr[n].main_sub_productId })


    //         //                         productCategoryData[pr].subproduct[sr].subof_subproduct = finalarr


    //         //                     }

    //         //                 }


    //         //             }


    //         //         }




    //         //         if (subproduct.length) {

    //         //             let output = [];
    //         //             let suboutput = [];


    //         //             subproduct.forEach(function (item) {
    //         //                 var existing = output.filter(function (v, i) {
    //         //                     return v.name == item.name;
    //         //                 });

    //         //                 if (existing.length) {
    //         //                     var existingIndex = output.indexOf(existing[0]);
    //         //                     output[existingIndex].subof_subproduct = output[existingIndex].subof_subproduct.concat(item.subof_subproduct);
    //         //                 } else {
    //         //                     if (typeof item.subof_subproduct == 'string')
    //         //                         item.subof_subproduct = [item.subof_subproduct];
    //         //                     output.push(item);
    //         //                 }


    //         //             });


    //         //             productCategoryData[pr].subproduct = output;


    //         //         }

    //         //     }

    //         // }



    //         // let prjectCategoryData_dup = [];
    //         // let jj = 0
    //         // if (productCategoryData) {
    //         //     for (let ii = 0; ii < productCategoryData.length; ii++) {
    //         //         if (productCategoryData[ii].main_productId == null &&
    //         //             productCategoryData[ii].main_sub_productId == null) {
    //         //             jj = jj + 1;
    //         //             if (jj < 6) {
    //         //                 prjectCategoryData_dup.push(productCategoryData[ii])
    //         //             }
    //         //         }
    //         //     }
    //         // }
    //         // console.log("addtocartdata",addtocartdata);
    //         var data = {
    //             App: req.session.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             addtocartdata: addtocartdata,
    //             // productData: productData,
    //             productCategoryData: productCategoryData,
    //             finalLatestProduct: finalLatestProduct,
    //             address: defaultAddress,
    //             finalSubTotal: (finalSubTotal).toFixed(2),
    //             finalTax: (finalTax).toFixed(2),
    //             finalTotal: (finalTotal + 99).toFixed(2),
    //             // prjectCategoryData_dup: prjectCategoryData_dup,
    //             // addtocart: addtocart,
    //             // user: user,
    //             // couponcode_data: couponcode_data,
    //             // shipping_charge: shipping_charge
    //         };

    //         // console.log("addtocartdata --> checkout -->>", addtocart);
    //         // if(req.body.product_id){
    //         //     res.send('success');
    //         // }else{
    //         return res.render('frontend/checkout', data);
    //         // }
    //         // console.log("ffff");
    //     } catch (e) {
    //         console.log("Error checkout", e);
    //     }
    // },

    checkout: async function (req, res) {
        try {
            // return res.render('frontend/checkout');
            if (req.session.details == undefined) {
                return res.redirect('/home')
            }

            let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });
            console.log("userrrrr", user);
            let defaultAddress = user.address_arr
            // let addressInfo = user.address_arr

            console.log("AWER", defaultAddress);


            // if (addressInfo.length) {
            //     const filteredArray = addressInfo.filter(object => object.default == "1");

            //     console.log(":::filteredArray::checkout::",filteredArray[0]);
    
            //     if (filteredArray[0].address_2=="" || !filteredArray[0].address_2) {
            //         defaultAddress = `${filteredArray[0].address_1}, ${filteredArray[0].city}, ${filteredArray[0].stateName},${filteredArray[0].postcode}, ${filteredArray[0].countryName}`
            //     } else {
            //         defaultAddress = `${filteredArray[0].address_1} ${filteredArray[0].address_2}, ${filteredArray[0].city}, ${filteredArray[0].stateName},${filteredArray[0].postcode},${filteredArray[0].countryName}`
            //     }
                
    
            // }


            // console.log(":::defaultAddress:::",defaultAddress);

            // let couponcode_data;
            // let coupon_id;
            // console.log("usssss", user);
            // var address_arr = [];
            // if (user) {
            //     if (user.coupon_arr.length > 0) {
            //         for (let uu = 0; uu < user.coupon_arr.length; uu++) {
            //             console.log("user.coupon_arr[uu].coupon_id", user.coupon_arr[uu]);
            //             coupon_id = mongoose.Types.ObjectId(user.coupon_arr[uu].coupon_id);
            //             console.log("coupon_id", coupon_id);
            //             couponcode_data = await Sys.App.Services.CouponcodeServices.getByData({ is_deleted: "0", _id: { $ne: coupon_id } });
            //         }
            //     } else {
            //         couponcode_data = await Sys.App.Services.CouponcodeServices.getByData({ is_deleted: "0" });
            //     }
            //     if (user.address_arr.length > 0) {
            //         for (let ar = 0; ar < user.address_arr.length; ar++) {
            //             if (user.address_arr[ar].is_default == "0") {
            //                 address_arr.push(user.address_arr[ar]);
            //             }
            //         }
            //     } else {

            //         req.flash('success', 'Please Add Your Address');
            //         // await req.session.save(async function (err) {
            //         //   session saved
            //         //   console.log('session saved');
            //         return res.redirect('/customer_address');
            //         // });
            //     }
            // }
            // console.log("couponcode_data-cc----", couponcode_data);


            // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0", product_visibility: "1" });
            // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });

            let query = { is_deleted: "0" }
            let price = { _id: -1 }
            let length = 3

            let latestProduct = await Sys.App.Services.ProductServices.getLatestProduct(query, price, length)

            // console.log(":::latestProduct:::",latestProduct);

            let finalLatestProduct = []

            if (latestProduct.length) {
                for (let k = 0; k < latestProduct.length; k++) {
                    let latestProdObj = {}
                    latestProdObj.productId = latestProduct[k]._id
                    latestProdObj.productName = latestProduct[k].product_name
                    latestProdObj.price = parseFloat(latestProduct[k].product_price)
                    latestProdObj.imageSrc = `${url}${latestProduct[k].product_defaultImg[0].path}`

                    finalLatestProduct.push(latestProdObj)
                }
            }

            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0", main_productId: null });

            // let addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });

            let addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });

            // console.log(":::addtocart:::", addtocart.length);

            let addtocartdata = [];

            var dataObj = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                // addtocartdata: addtocartdata,
                // productData: productData,
                productCategoryData: productCategoryData,
                finalLatestProduct: finalLatestProduct,
                // address: "416, Shilp Zaveri, NKP Group of Industries, Swinagar Society, Nehru Nagar, Shyamal, Ahmedabad, Gujarat 380015",
                address: defaultAddress
                // prjectCategoryData_dup: prjectCategoryData_dup,
                // addtocart: addtocart,
                // user: user,
                // couponcode_data: couponcode_data,
                // shipping_charge: shipping_charge
            };

            if (!addtocart.length) {
                // return res.redirect('/products')
                return res.render('frontend/checkoutcart', dataObj);
            }

            let finalSubTotal = 0
            let finalTax = 0
            let finalTotal = 0

            for (let i = 0; i < addtocart.length; i++) {
                let productId = addtocart[i].product_id

                let productDetail = await Sys.App.Services.ProductServices.getProductData({ _id: productId, is_deleted: "0" })
                // console.log(":::productDetail:::", productDetail, i);

                let productTax = productDetail ? parseFloat(productDetail.GST_rate) : 0
                // console.log("::productTax:::", productTax);
                let finalObj = {}
                finalObj.productId = productId
                finalObj.imageSrc = `${url}${productDetail.product_defaultImg[0].path}`
                finalObj.product_name = productDetail ? productDetail.product_name : ""
                // finalObj.product_name = productDetail ? `${productId}_${productDetail.product_name}` : ""
                finalObj.quantity = parseFloat(addtocart[i].product_quantity)
                finalObj.unitPrice = parseFloat(addtocart[i].product_basic_price)
                finalObj.total = parseFloat(addtocart[i].product_quantity) * parseFloat(addtocart[i].product_basic_price)

                finalSubTotal += finalObj.total

                finalObj.tax = (((parseFloat(addtocart[i].product_quantity) * parseFloat(addtocart[i].product_basic_price)) * productTax) / 100)

                finalTax += finalObj.tax

                finalObj.grandTotal = finalObj.total + finalObj.tax

                finalTotal += finalObj.grandTotal

                addtocartdata.push(finalObj)
            }

            console.log("addtocartdata =====>>>>", addtocartdata);

            // let addtocartdata = [];
            // let shipping_charge;
            // for (let i = 0; i < productData.length; i++) {
            //     if (addtocart) {
            //         for (let a = 0; a < addtocart.length; a++) {
            //             if (addtocart[a].product_id.toString() == productData[i]._id.toString()) {
            //                 if (addtocart[a].product_quantity != "0") {
            //                     productData[i].product_quantity = addtocart[a].product_quantity;
            //                 } else {
            //                     productData[i].product_quantity = "1";
            //                 }
            //                 let vendor = await Sys.App.Services.VendorProfileServices.getVendorData({ _id: productData[i].venodor_id });
            //                 if (vendor) {
            //                     if (address_arr.length > 0) {
            //                         if (address_arr[0].state == vendor.pickup_address[0].state) {
            //                             if (address_arr[0].city == vendor.pickup_address[0].city) {
            //                                 if (productData[a].product_weight == "0.5" || productData[a].product_weight == "1") {
            //                                     shipping_charge = "81";
            //                                 } else if (productData[a].product_weight == "2") {
            //                                     shipping_charge = "162";
            //                                 } else if (productData[a].product_weight == "3") {
            //                                     shipping_charge = "242";
            //                                 } else if (productData[a].product_weight == "4") {
            //                                     shipping_charge = "323";
            //                                 } else if (productData[a].product_weight == "5") {
            //                                     shipping_charge = "404";
            //                                 } else {
            //                                     shipping_charge = "0";
            //                                 }
            //                             } else {
            //                                 if (productData[a].product_weight == "0.5" || productData[a].product_weight == "1") {
            //                                     shipping_charge = "91";
            //                                 } else if (productData[a].product_weight == "2") {
            //                                     shipping_charge = "182";
            //                                 } else if (productData[a].product_weight == "3") {
            //                                     shipping_charge = "273";
            //                                 } else if (productData[a].product_weight == "4") {
            //                                     shipping_charge = "364";
            //                                 } else if (productData[a].product_weight == "5") {
            //                                     shipping_charge = "455";
            //                                 } else {
            //                                     shipping_charge = "0";
            //                                 }
            //                             }
            //                         } else {
            //                             if (productData[a].product_weight == "0.5" || productData[a].product_weight == "1") {
            //                                 shipping_charge = "125";
            //                             } else if (productData[a].product_weight == "2") {
            //                                 shipping_charge = "250";
            //                             } else if (productData[a].product_weight == "3") {
            //                                 shipping_charge = "375";
            //                             } else if (productData[a].product_weight == "4") {
            //                                 shipping_charge = "500";
            //                             } else if (productData[a].product_weight == "5") {
            //                                 shipping_charge = "625";
            //                             } else {
            //                                 shipping_charge = "0";
            //                             }

            //                         }
            //                     }
            //                 }
            //                 productData[i].product_quantity_price = addtocart[a].product_price;

            //                 if (parseInt(productData[i].product_stock_quantity) < parseInt(productData[i].product_quantity)) {
            //                     productData[i].product_stock_status = "Out Of Stock";
            //                 } else {
            //                     addtocartdata.push(productData[i])
            //                 }

            //             }
            //         }
            //     }
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
            // console.log("addtocartdata",addtocartdata);
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                addtocartdata: addtocartdata,
                // productData: productData,
                productCategoryData: productCategoryData,
                finalLatestProduct: finalLatestProduct,
                address: defaultAddress,
                finalSubTotal: (finalSubTotal).toFixed(2),
                finalTax: (finalTax).toFixed(2),
                finalTotal: (finalTotal + 99).toFixed(2),
                // prjectCategoryData_dup: prjectCategoryData_dup,
                // addtocart: addtocart,
                // user: user,
                // couponcode_data: couponcode_data,
                // shipping_charge: shipping_charge
            };

            // console.log("addtocartdata --> checkout -->>", addtocart);
            // if(req.body.product_id){
            //     res.send('success');
            // }else{
            return res.render('frontend/checkout', data);
            // }
            // console.log("ffff");
        } catch (e) {
            console.log("Error checkout", e);
        }
    },
















    // getProducts: async function (req, res) {
    //     try {

    //         let product = await Sys.App.Services.ProductServices.getByData({is_deleted:"0"});

    //         for (let i = 0; i < product.length; i++) {
    //             product[i].imageSrc = ""
    //             product[i].imageSrc =   `http://localhost:4002${product[i].product_defaultImg[0].path}`
    //         }
    //         console.log(":::product:::",product);
    //         var obj = {
    //           'draw': req.query.draw,
    //         //   'recordsTotal': product.length,
    //           'data': product,
    //         };
    //         res.send(obj);
    //       } catch (e) {
    //         console.log("Error", e);
    //       }
    // },

    productsModel: async function (req, res) {

        try {

            let productDataModel = await Sys.App.Services.ProductServices.getByData({ _id: req.params.id });

            console.log(":::productDataModel:::", productDataModel);

            let wishlist = null;
            if (req.session.details) {
                wishlist = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });
            }
            let wishlist_id;
            for (let i = 0; i < productDataModel.length; i++) {
                if (wishlist) {
                    for (const element of wishlist.wishlist_arr) {
                        if (element == productDataModel[i]._id.toString()) {
                            wishlist_id = element;
                            console.log("wgggg", wishlist_id, element);
                        }
                    }
                }
                productDataModel[i].wishlist_arr = wishlist_id;

            }

            for (let d = 0; d < productDataModel.length; d++) {

                if (productDataModel[d].is_discount == 1) {

                    let today = new Date();
                    let year = today.getFullYear();
                    let mes = today.getMonth() + 1;
                    let dia = today.getDate();
                    // let fecha = year + "-0" + mes + "-0" + dia;
                    if (mes.toString().length == 2) {

                        mes = "-" + mes

                    } else {
                        mes = "-0" + mes

                    }

                    if (dia.toString().length == 2) {

                        dia = "-" + dia

                    } else {
                        dia = "-0" + dia

                    }


                    let fecha = year + mes + dia;

                    console.log("type of ===>>", fecha);

                    // if (productDataModel[d].discount_startDate <= fecha && productDataModel[d].discount_endDate >= fecha) {
                    let x = productDataModel[d].discount_endDate;
                    let y = fecha;
                    let z = productDataModel[d].discount_startDate;
                    if (z <= y && y <= x) {
                        // if (x >= y) {
                        await Sys.App.Services.ProductServices.updateProductData({ _id: productDataModel[d]._id },
                            {
                                $set: {
                                    discount_start: "true"
                                }
                            })
                    } else {
                        await Sys.App.Services.ProductServices.updateProductData({ _id: productDataModel[d]._id },
                            {
                                $set: {
                                    discount_start: "false"
                                }
                            })
                    }

                }

            }


            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                product: 'active',
                productDataModel: productDataModel,
                // productCategoryData: productCategoryData,
                // prjectCategoryData_dup : prjectCategoryData_dup,
            };


            return res.send(data);
        } catch (e) {
            console.log("Error in productDetails", e);
        }
    },

    productDetails: async function (req, res) {

        try {
            // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
            // let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
            // let singleProductData = await Sys.App.Services.ProductServices.getProductData({_id: req.params.id})
            let productData = await Sys.App.Services.ProductServices.getByData({ _id: req.params.id });
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
            let relateProduct = await Sys.App.Services.ProductServices.getByData({
                is_deleted: "0", product_visibility: "1"
            });


            let vendor_id = productData[0].venodor_id;
            let questionData = await Sys.App.Services.QuestionServices.getByData({ vendor_id: productData[0].venodor_id, is_deleted: "0" });

            for (let d = 0; d < productData.length; d++) {

                if (productData[d].is_discount == 1) {

                    let today = new Date();
                    let year = today.getFullYear();
                    let mes = today.getMonth() + 1;
                    let dia = today.getDate();
                    // let fecha = year + "-0" + mes + "-0" + dia;
                    if (mes.toString().length == 2) {

                        mes = "-" + mes

                    } else {
                        mes = "-0" + mes

                    }

                    if (dia.toString().length == 2) {

                        dia = "-" + dia

                    } else {
                        dia = "-0" + dia

                    }


                    let fecha = year + mes + dia;

                    console.log("type of ===>>", fecha);

                    // if (productData[d].discount_startDate <= fecha && productData[d].discount_endDate >= fecha) {
                    let x = productData[d].discount_endDate;
                    let y = fecha;
                    let z = productData[d].discount_startDate;
                    console.log("x,,z", x, z);
                    console.log("y", y);
                    console.log("cond88888", z <= y && y <= x);
                    console.log("cond88888", z <= y, y <= x);
                    if (z <= y && y <= x) {
                        // if (x >= y) {
                        await Sys.App.Services.ProductServices.updateProductData({ _id: productData[d]._id },
                            {
                                $set: {
                                    discount_start: "true"
                                }
                            })
                    } else {
                        await Sys.App.Services.ProductServices.updateProductData({ _id: productData[d]._id },
                            {
                                $set: {
                                    discount_start: "false"
                                }
                            })
                    }

                }

            }




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


            let reviewData = await Sys.App.Services.ReviewServices.getUserData({ product_id: req.params.id, is_deleted: 0 })

            if (reviewData) {
                rating_nosum = reviewData.length;
                for (let r = 0; r < reviewData.length; r++) {
                    var dateData = reviewData[r].updatedAt;
                    reviewData[r].review_date = datetime.format(dateData, 'MMMM DD, YYYY');

                }
            }


            let wishlist = null;
            if (req.session.details) {
                wishlist = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });
            }

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

            let wishlist_id1;
            for (let i = 0; i < relateProduct.length; i++) {

                if (wishlist) {

                    for (const element of wishlist.wishlist_arr) {
                        if (element == relateProduct[i]._id.toString()) {
                            wishlist_id1 = element;
                        }
                    }

                }
                relateProduct[i].wishlist_arr = wishlist_id1
            }
            let categoryRelatedData = [];

            for (let h = 0; h < relateProduct.length; h++) {

                if (relateProduct[h]._id.toString() != productData[0]._id.toString()) {

                    if (relateProduct[h].product_category != null) {

                        let arr
                        if (relateProduct[h].product_category != null && typeof relateProduct[h].product_category === "string") {

                            arr = relateProduct[h].product_category.split(',');

                        }

                        if (typeof productData[0].product_category === "string") {

                            if (arr != undefined) {

                                if (arr == productData[0].product_category) {
                                    categoryRelatedData.push(relateProduct[h])
                                }
                            }

                        } else {

                            if (productData[0].product_category) {

                                for (let o = 0; o < productData[0].product_category.length; o++) {

                                    if (relateProduct[h].product_category == productData[0].product_category[o]) {
                                        categoryRelatedData.push(relateProduct[h])
                                    }
                                }

                            }
                        }
                    }
                }
            }

            for (let d = 0; d < categoryRelatedData.length; d++) {

                if (categoryRelatedData[d].is_discount == 1) {

                    let today = new Date();
                    let year = today.getFullYear();
                    let mes = today.getMonth() + 1;
                    let dia = today.getDate();
                    // let fecha = year + "-0" + mes + "-" + dia;
                    if (mes.toString().length == 2) {

                        mes = "-" + mes

                    } else {
                        mes = "-0" + mes

                    }

                    if (dia.toString().length == 2) {

                        dia = "-" + dia

                    } else {
                        dia = "-0" + dia

                    }


                    let fecha = year + mes + dia;

                    console.log("type of ===>>", fecha);

                    // if (categoryRelatedData[d].discount_startDate <= fecha && categoryRelatedData[d].discount_endDate >= fecha) {
                    let x = categoryRelatedData[d].discount_endDate;
                    let y = fecha;
                    let z = categoryRelatedData[d].discount_startDate;
                    console.log("x,,z", x, z);
                    console.log("y", y);
                    console.log("cond88888", z <= y && y <= x);
                    console.log("cond8888#####8", z <= y, y <= x);
                    if (z <= y && y <= x) {
                        // if (x >= y) {
                        await Sys.App.Services.ProductServices.updateProductData({ _id: categoryRelatedData[d]._id },
                            {
                                $set: {
                                    discount_start: "true"
                                }
                            })
                    } else {
                        await Sys.App.Services.ProductServices.updateProductData({ _id: categoryRelatedData[d]._id },
                            {
                                $set: {
                                    discount_start: "false"
                                }
                            })
                    }

                }

            }



            let wishlist_id;
            for (let i = 0; i < productData.length; i++) {

                if (wishlist) {

                    for (const element of wishlist.wishlist_arr) {
                        if (element == productData[i]._id.toString()) {
                            wishlist_id = element;
                        }
                    }

                }
                productData[i].wishlist_arr = wishlist_id


            }






            let newAccessories = []
            let new_Result;

            new_Result = productData[0].relatable_product;
            for (let i = 0; i < relateProduct.length; i++) {

                if (new_Result) {
                    for (const element of new_Result) {
                        if (element.toString() != productData[0]._id.toString()) {
                            if (element.toString() == relateProduct[i]._id.toString()) {
                                newAccessories.push(relateProduct[i])
                            }
                        }
                    }

                }

            }


            for (let d = 0; d < newAccessories.length; d++) {

                if (newAccessories[d].is_discount == 1) {

                    let today = new Date();
                    let year = today.getFullYear();
                    let mes = today.getMonth() + 1;
                    let dia = today.getDate();
                    // let fecha = year + "-0" + mes + "-" + dia;
                    if (mes.toString().length == 2) {

                        mes = "-" + mes

                    } else {
                        mes = "-0" + mes

                    }

                    if (dia.toString().length == 2) {

                        dia = "-" + dia

                    } else {
                        dia = "-0" + dia

                    }


                    let fecha = year + mes + dia;

                    console.log("type of ===>>", fecha);

                    // if (newAccessories[d].discount_startDate <= fecha && newAccessories[d].discount_endDate >= fecha) {
                    let x = newAccessories[d].discount_endDate;
                    let y = fecha;
                    let z = newAccessories[d].discount_startDate;
                    console.log("x,,z", x, z);
                    console.log("y", y);
                    console.log("cond88888", z <= y && y <= x);
                    console.log("cond88888@@@", z <= y, y <= x);
                    if (z <= y && y <= x) {
                        // if (x >= y) {
                        await Sys.App.Services.ProductServices.updateProductData({ _id: newAccessories[d]._id },
                            {
                                $set: {
                                    discount_start: "true"
                                }
                            })
                    } else {
                        await Sys.App.Services.ProductServices.updateProductData({ _id: newAccessories[d]._id },
                            {
                                $set: {
                                    discount_start: "false"
                                }
                            })
                    }

                }

            }


            let newSapares = []
            let new_Sapare;

            new_Sapare = productData[0].spares_product;
            for (let i = 0; i < relateProduct.length; i++) {

                if (new_Sapare) {
                    for (const element of new_Sapare) {
                        if (element.toString() != productData[0]._id.toString()) {
                            if (element.toString() == relateProduct[i]._id.toString()) {
                                newSapares.push(relateProduct[i])
                            }
                        }
                    }

                }
            }

            for (let d = 0; d < newSapares.length; d++) {

                if (newSapares[d].is_discount == 1) {

                    let today = new Date();
                    let year = today.getFullYear();
                    let mes = today.getMonth() + 1;
                    let dia = today.getDate();
                    // let fecha = year + "-0" + mes + "-" + dia;
                    if (mes.toString().length == 2) {

                        mes = "-" + mes

                    } else {
                        mes = "-0" + mes

                    }

                    if (dia.toString().length == 2) {

                        dia = "-" + dia

                    } else {
                        dia = "-0" + dia

                    }


                    let fecha = year + mes + dia;

                    console.log("type of ===>>", fecha);

                    // if (newSapares[d].discount_startDate <= fecha && newSapares[d].discount_endDate >= fecha) {
                    let x = newSapares[d].discount_endDate;
                    let y = fecha;
                    let z = newSapares[d].discount_startDate;
                    console.log("x,,z", x, z);
                    console.log("y", y);
                    console.log("cond88888", z <= y && y <= x);
                    console.log("cond88888$$$$$", z <= y, y <= x);
                    if (z <= y && y <= x) {
                        // if (x >= y) {
                        await Sys.App.Services.ProductServices.updateProductData({ _id: newSapares[d]._id },
                            {
                                $set: {
                                    discount_start: "true"
                                }
                            })
                    } else {
                        await Sys.App.Services.ProductServices.updateProductData({ _id: newSapares[d]._id },
                            {
                                $set: {
                                    discount_start: "false"
                                }
                            })
                    }

                }

            }

            console.log("-------------newSapares --------", newSapares.length);


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
                product: 'active',
                productData: productData,
                productCategoryData: productCategoryData,
                prjectCategoryData_dup: prjectCategoryData_dup,
                newAccessories: newAccessories,
                newSapares: newSapares,
                reviewData: reviewData,
                categoryRelatedData: categoryRelatedData,
                relateProduct: relateProduct,
                productid: req.params.id,
                addtocart: addtocart,
                // productid: req.params.id,
                vendor_id: vendor_id,
                questionData: questionData
            };

            return res.render('frontend/productDetails', data);
        } catch (e) {
            console.log("Error in productDetails", e);
        }
    },

    gridproducts: async function (req, res) {
        try {
            // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
            // let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
            // let singleProductData = await Sys.App.Services.ProductServices.getProductData({_id: req.params.id})
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
                        var itemarray = []
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


                                    // productCategoryData[pr].subproduct[sr].subof_subproduct = finalarr




                                    for (let ii = 0; ii < finalarr.length; ii++) {

                                        itemarray.push(finalarr[ii])
                                    }


                                }

                            }


                        }
                        const key = "itemname";

                        let arrayUniqueByKey = [...new Map(itemarray.map(item =>
                            [item[key], item])).values()];

                        if (productCategoryData[pr].subproduct[pr]) {

                            productCategoryData[pr].subproduct[pr].subof_subproduct = arrayUniqueByKey
                            //   console.log("dsdssdfwwee  fjewefwefewf====>",arrayUniqueByKey);
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

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                // products: 'active',
                // productData: productData,
                productCategoryData: productCategoryData,
            };

            // console.log("productData", productData);
            // console.log("productCategoryData", productCategoryData);

            return res.render('frontend/gridproducts', data);
        } catch (e) {
            console.log("Error in gridproducts", e);
        }
    },

    listproducts: async function (req, res) {
        try {
            // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
            // let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
            // let singleProductData = await Sys.App.Services.ProductServices.getProductData({_id: req.params.id})
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
                        var itemarray = []
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


                                    // productCategoryData[pr].subproduct[sr].subof_subproduct = finalarr




                                    for (let ii = 0; ii < finalarr.length; ii++) {

                                        itemarray.push(finalarr[ii])
                                    }


                                }

                            }


                        }
                        const key = "itemname";

                        let arrayUniqueByKey = [...new Map(itemarray.map(item =>
                            [item[key], item])).values()];

                        if (productCategoryData[pr].subproduct[pr]) {

                            productCategoryData[pr].subproduct[pr].subof_subproduct = arrayUniqueByKey
                            //   console.log("dsdssdfwwee  fjewefwefewf====>",arrayUniqueByKey);
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

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                // products: 'active',
                // productData: productData,
                productCategoryData: productCategoryData,
            };

            // console.log("productData", productData);
            // console.log("productCategoryData", productCategoryData);

            return res.render('frontend/listproducts', data);
        } catch (e) {
            console.log("Error in listproducts", e);
        }
    },

    // productDetails: async function (req, res) {
    //     try {
    //         // let singleProductData = await Sys.App.Services.ProductServices.getProductData({ _id: req.params.id });
    //         //  console.log("SINGLE PRODUCT DATA =========", singleProductData);
    //         // let productData = await Sys.App.Services.ProductServices.getByData({is_deleted: "0"});
    //         // let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
    //         // let singleProductCategoryData = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({  _id: singleProductData.product_id });
    //         var data = {
    //             App: req.session.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             // productdetails: 'active',
    //             // singleProductData: singleProductData,
    //             // productCategoryData: productCategoryData,
    //             // productData: productData,
    //             // singleProductCategoryData: singleProductCategoryData.productCategoryName,
    //             // categoryData :'active'
    //         };
    //         // console.log(productData,"productData>>>>>");
    //         return res.render('frontend/product', data);
    //     } catch (error) {
    //         console.log("error in productDetails", error);
    //     }
    // },

    productCategoryDetails: async function (req, res) {
        try {
            let singleProductData = await Sys.App.Services.ProductServices.getProductData({ _id: req.params.id });
            // console.log("SINGLE PRODUCT DATA =========", singleProductData);
            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
            let singleProductCategoryData = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({ singleProductCategoryData: req.body.productCategoryName });
            console.log("SINGLE PRODUCTCATEGORY DATA?????", singleProductCategoryData);



            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                productCategoryDetails: 'active',
                singleProductData: singleProductData,
                productCategoryData: productCategoryData,
                productData: productData,
                singleProductCategoryData: singleProductCategoryData,
            };
            // console.log(is_separateCategory,"is_separateCategory>>>>>");
            return res.render('frontend/product-category', data);
        } catch (error) {
            console.log("error in productDetails", error);
        }
    },

    separateproductcategory: async function (req, res) {
        try {
            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
            let singleProductCategoryDetails = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({ _id: req.params.id });
            // console.log("SINGLE PRODUCTCATEGORY DATA separate?????", singleProductCategoryDetails.productCategoryName);
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                productData: productData,
                productCategoryDetails: 'active',
                productCategoryData: productCategoryData,
                singleProductCategoryDetails: singleProductCategoryDetails,
            };
            // console.log(is_separateCategory,"is_separateCategory>>>>>");
            return res.render('frontend/separateproductcategory', data);
        } catch (error) {
            console.log("error in separateproductcategory", error);
        }
    },



    // wishlist_get: async function (req, res) {
    //     try {
    //         let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0", product_visibility: "1" });

    //         let wishlist = await Sys.App.Services.CustomerServices.getSingleUserData
    //             ({ _id: req.session.details.id });
    //         console.log("wishlist====", wishlist);
    //         let wishlistdata = [];
    //         for (let i = 0; i < productData.length; i++) {
    //             for (const element of wishlist.wishlist_arr) {
    //                 if (element == productData[i]._id.toString()) {
    //                     wishlistdata.push(productData[i])
    //                 }
    //             }
    //         }
    //         console.log("wishlist====", wishlistdata);

    //         var data = {
    //             App: req.session.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             wishlistdata: wishlistdata
    //         };

    //         return res.render('frontend/wishlist', data);

    //     } catch (e) {
    //         console.log("Error in gridproducts", e);
    //     }
    // },







    quickView: async function (req, res) {
        try {
            console.log(":::req.body:::", req.body);

            return res.redirect('/frontend/quickView');
        } catch (error) {
            console.log("Error in quickView", error);
        }
    },

    addtocart_get: async function (req, res) {
        try {
            console.log("req.body-->addtocart_get===", req.body);


            if (!req.body.question_form) {
                req.body.question_form = null;
            }
            // let addtocart = await Sys.App.Services.OrderServices.getSingleUserData({ product_id: req.body.id, customer_id: req.session.details.id, is_deleted: "0" });
            // console.log("addtocart==== check ", addtocart);

            let addtocart = await Sys.App.Services.OrderServices.getSingleUserData({ product_id: req.body.id, customer_id: req.session.details.id, is_deleted: "0", product_status: { $ne: "success" } });

            let prId = mongoose.Types.ObjectId(req.body.id);


            let productData = await Sys.App.Services.ProductServices.getByData({ _id: prId, is_deleted: "0" });

            // console.log("productData ==>>", productData[0].is_discount);

            let actual_price;

            if (productData[0].is_discount == 1 && productData[0].discount_start == "true") {
                actual_price = productData[0].discount_price;

                // actual_price = actual_price.replace(/,/g, "");

            } else {
                actual_price = req.body.product_price;
                // actual_price = actual_price.replace(/,/g, "");

            }


            // console.log("actual price -- >>", actual_price);

            let id = mongoose.Types.ObjectId(req.session.details.id);
            if (!addtocart || addtocart == null) {
                // console.log("add to cart");
                let updatedata = await Sys.App.Services.OrderServices.insertUserData({
                    product_id: req.body.id,
                    customer_id: req.session.details.id,
                    product_quantity: "1",
                    product_price: actual_price,
                    product_basic_price: actual_price,
                    question_form: req.body.question_form,
                    product_weight: productData[0].product_weight,
                    is_discount: productData[0].is_discount,
                    discount_start: productData[0].discount_start,
                    discount_value: productData[0].discount_value,
                    product_name: productData[0].product_name,
                    product_price: productData[0].product_price
                });
                return res.send("success");
            } else {
                let product_quantity = parseInt(addtocart.product_quantity) + 1;
                let product_price = parseFloat(addtocart.product_price) + parseFloat(addtocart.product_basic_price);
                // console.log(product_price, "product_price");
                // console.log(addtocart.product_price, "a");
                // console.log(addtocart.product_basic_price, "b");

                console.log(" addtocart.product_quantity  13444 ====>", addtocart.product_quantity, product_quantity);

                if (parseInt(addtocart.product_quantity) != parseInt(productData[0].product_stock_quantity)) {


                    let updatedata = await Sys.App.Services.OrderServices.updateUserData(
                        {
                            _id: addtocart._id
                        }, {
                        "$set": { product_quantity: product_quantity, product_price: product_price, question_form: req.body.question_form }
                    });
                    return res.send("success");

                } else {
                    return res.send("error");

                }
                // console.log("updatedataupdatedata", updatedata);
            }
            // return res.send("error");
        } catch (e) {
            console.log("Error in gridproducts", e);
        }
    },



    // shoppingcart: async function (req, res) {
    //     try {

    //         let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0", product_visibility: "1" });
    //         // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
    //         let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });

    //         let addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0" });

    //         let addtocartdata = [];
    //         for (let i = 0; i < productData.length; i++) {
    //             if (addtocart) {
    //                 for (let a = 0; a < addtocart.length; a++) {
    //                     if (addtocart[a].product_id.toString() == productData[i]._id.toString()) {
    //                         if (addtocart[a].product_quantity != "0") {
    //                             productData[i].product_quantity = addtocart[a].product_quantity;
    //                         } else {
    //                             productData[i].product_quantity = "1";
    //                         }
    //                         productData[i].product_quantity_price = addtocart[a].product_price;
    //                         addtocartdata.push(productData[i])
    //                     }
    //                 }
    //             }
    //         }

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
    //             // console.log("new ARRAy=========",subarray,subarray.length);
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

    //                         // console.log("productCategoryData[pr].subproduct===",productCategoryData[pr].subproduct[sr].name);
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

    //                     let output = [];
    //                     let suboutput = [];


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

    //         // console.log("addtocartdata",addtocartdata);
    //         var data = {
    //             App: req.session.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             addtocartdata: addtocartdata,
    //             productData: productData,
    //             productCategoryData: productCategoryData,
    //             prjectCategoryData_dup: prjectCategoryData_dup,
    //             addtocart: addtocart
    //         };

    //         // console.log("hhhhhhhhhdhdhdhdhdhdhdhdh================>>>>>>>>>>>>>>>>>>>>>>",homeData);

    //         // console.log(projectData, "homeprojectDatacontroller");
    //         return res.render('frontend/shoppingcart', data);
    //     } catch (e) {
    //         console.log("Error shoppingcart", e);
    //     }
    // },
    // checkout: async function (req, res) {
    //     try {
    //         let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });

    //         let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0", product_visibility: "1" });
    //         // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
    //         let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });

    //         let addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0" });

    //         let addtocartdata = [];
    //         for (let i = 0; i < productData.length; i++) {
    //             if (addtocart) {
    //                 for (let a = 0; a < addtocart.length; a++) {
    //                     if (addtocart[a].product_id.toString() == productData[i]._id.toString()) {
    //                         if (addtocart[a].product_quantity != "0") {
    //                             productData[i].product_quantity = addtocart[a].product_quantity;
    //                         } else {
    //                             productData[i].product_quantity = "1";
    //                         }
    //                         // productData[i].product_quantity_price = addtocart[a].product_price;
    //                         if (productData[i].is_discount == "1") {
    //                             var gstprice = calculateTax(parseFloat(productData[i].discount_price), 18, "add");
    //                             console.log("gstprice d", gstprice);
    //                             productData[i].discount_price = gstprice.with_tax;
    //                             addtocartdata.push(productData[i])
    //                         } else {


    //                             if (productData[i].product_quantity_price == "0") {
    //                                 var gstprice = calculateTax(parseFloat(productData[i].product_price), 18, "add");

    //                                 productData[i].product_price = gstprice.with_tax;
    //                             } else {
    //                                 var gstprice = calculateTax(parseFloat(productData[i].product_quantity_price), 18, "add");

    //                                 productData[i].product_quantity_price = gstprice.with_tax;
    //                             }
    //                             addtocartdata.push(productData[i])
    //                         }
    //                         // addtocartdata.push(productData[i])
    //                     }
    //                 }
    //             }
    //         }

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
    //             // console.log("new ARRAy=========",subarray,subarray.length);
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

    //                         // console.log("productCategoryData[pr].subproduct===",productCategoryData[pr].subproduct[sr].name);
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

    //                     let output = [];
    //                     let suboutput = [];


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
    //             addtocartdata: addtocartdata,
    //             productData: productData,
    //             productCategoryData: productCategoryData,
    //             prjectCategoryData_dup: prjectCategoryData_dup,
    //             addtocart: addtocart,
    //             user: user
    //         };

    //         return res.render('frontend/checkout', data);
    //     } catch (e) {
    //         console.log("Error checkout", e);
    //     }
    // },

    /* checkout original function
    checkout: async function (req, res) {
        try {
            return res.render('frontend/checkout');

            let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });
            // console.log("userrrrr",user);

            let couponcode_data;
            let coupon_id;
            console.log("usssss", user);
            var address_arr = [];
            if (user) {
                if (user.coupon_arr.length > 0) {
                    for (let uu = 0; uu < user.coupon_arr.length; uu++) {
                        console.log("user.coupon_arr[uu].coupon_id", user.coupon_arr[uu]);
                        coupon_id = mongoose.Types.ObjectId(user.coupon_arr[uu].coupon_id);
                        console.log("coupon_id", coupon_id);
                        couponcode_data = await Sys.App.Services.CouponcodeServices.getByData({ is_deleted: "0", _id: { $ne: coupon_id } });
                    }
                } else {
                    couponcode_data = await Sys.App.Services.CouponcodeServices.getByData({ is_deleted: "0" });
                }
                if (user.address_arr.length > 0) {
                    for (let ar = 0; ar < user.address_arr.length; ar++) {
                        if (user.address_arr[ar].is_default == "0") {
                            address_arr.push(user.address_arr[ar]);
                        }
                    }
                } else {

                    req.flash('success', 'Please Add Your Address');
                    // await req.session.save(async function (err) {
                    //   session saved
                    //   console.log('session saved');
                    return res.redirect('/customer_address');
                    // });
                }
            }
            console.log("couponcode_data-cc----", couponcode_data);

            if (couponcode_data) {
                for (let d = 0; d < couponcode_data.length; d++) {

                    let today = new Date();
                    let year = today.getFullYear();
                    let mes = today.getMonth() + 1;
                    let dia = today.getDate();

                    if (mes.toString().length == 2) {
                        // if (toString(mes).length == 2) {
                        mes = "-" + mes
                    } else {
                        mes = "-0" + mes
                    }
                    console.log("sssssssss", dia.toString().length);
                    if (dia.toString().length == 2) {
                        // if (toString(dia).length == 2) {
                        dia = "-" + dia
                    } else {
                        dia = "-0" + dia
                    }

                    let fecha = year + mes + dia;
                    // console.log("type of ===>>========================================");
                    // console.log("type of ===>>", fecha);
                    // console.log("type of ===>>========================================");
                    // console.log("type of ===>>", couponcode_data[d].couponcode_startdate);
                    // console.log("type of ===>>", couponcode_data[d].couponcode_enddate >= fecha);
                    // console.log("type of ===>>", couponcode_data[d].couponcode_startdate <= fecha);

                    // if (couponcode_data[d].couponcode_startdate != undefined && couponcode_data[d].couponcode_enddate != undefined) {
                    //     if (couponcode_data[d].couponcode_startdate <= fecha && couponcode_data[d].couponcode_enddate >= fecha) {
                    //         await Sys.App.Services.CouponcodeServices.updateVendorData({ _id: couponcode_data[d]._id },
                    //             {
                    //                 $set: {
                    //                     is_expire: "true"
                    //                 }
                    //             })
                    //     }
                    // }
                    if (couponcode_data[d].couponcode_startdate != undefined && couponcode_data[d].couponcode_enddate != undefined) {
                        let x = couponcode_data[d].couponcode_enddate;
                        let y = fecha;
                        let z = couponcode_data[d].couponcode_startdate;
                        if (z <= y && y <= x) {
                            // if (x <= y) {
                            await Sys.App.Services.CouponcodeServices.updateVendorData({ _id: couponcode_data[d]._id },
                                {
                                    $set: {
                                        is_expire: "true"
                                    }
                                })
                        }
                    }
                }
            }
            console.log("couponcode_data-----", couponcode_data);
            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0", product_visibility: "1" });
            // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });

            let addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });

            let addtocartdata = [];
            let shipping_charge;
            for (let i = 0; i < productData.length; i++) {
                if (addtocart) {
                    for (let a = 0; a < addtocart.length; a++) {
                        if (addtocart[a].product_id.toString() == productData[i]._id.toString()) {
                            if (addtocart[a].product_quantity != "0") {
                                productData[i].product_quantity = addtocart[a].product_quantity;
                            } else {
                                productData[i].product_quantity = "1";
                            }
                            let vendor = await Sys.App.Services.VendorProfileServices.getVendorData({ _id: productData[i].venodor_id });
                            if (vendor) {
                                if (address_arr.length > 0) {
                                    if (address_arr[0].state == vendor.pickup_address[0].state) {
                                        if (address_arr[0].city == vendor.pickup_address[0].city) {
                                            if (productData[a].product_weight == "0.5" || productData[a].product_weight == "1") {
                                                shipping_charge = "81";
                                            } else if (productData[a].product_weight == "2") {
                                                shipping_charge = "162";
                                            } else if (productData[a].product_weight == "3") {
                                                shipping_charge = "242";
                                            } else if (productData[a].product_weight == "4") {
                                                shipping_charge = "323";
                                            } else if (productData[a].product_weight == "5") {
                                                shipping_charge = "404";
                                            } else {
                                                shipping_charge = "0";
                                            }
                                        } else {
                                            if (productData[a].product_weight == "0.5" || productData[a].product_weight == "1") {
                                                shipping_charge = "91";
                                            } else if (productData[a].product_weight == "2") {
                                                shipping_charge = "182";
                                            } else if (productData[a].product_weight == "3") {
                                                shipping_charge = "273";
                                            } else if (productData[a].product_weight == "4") {
                                                shipping_charge = "364";
                                            } else if (productData[a].product_weight == "5") {
                                                shipping_charge = "455";
                                            } else {
                                                shipping_charge = "0";
                                            }
                                        }
                                    } else {
                                        if (productData[a].product_weight == "0.5" || productData[a].product_weight == "1") {
                                            shipping_charge = "125";
                                        } else if (productData[a].product_weight == "2") {
                                            shipping_charge = "250";
                                        } else if (productData[a].product_weight == "3") {
                                            shipping_charge = "375";
                                        } else if (productData[a].product_weight == "4") {
                                            shipping_charge = "500";
                                        } else if (productData[a].product_weight == "5") {
                                            shipping_charge = "625";
                                        } else {
                                            shipping_charge = "0";
                                        }

                                    }
                                }
                            }
                            productData[i].product_quantity_price = addtocart[a].product_price;

                            if (parseInt(productData[i].product_stock_quantity) < parseInt(productData[i].product_quantity)) {
                                productData[i].product_stock_status = "Out Of Stock";
                            } else {
                                addtocartdata.push(productData[i])
                            }

                        }
                    }
                }
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
            // console.log("addtocartdata",addtocartdata);
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                addtocartdata: addtocartdata,
                productData: productData,
                productCategoryData: productCategoryData,
                prjectCategoryData_dup: prjectCategoryData_dup,
                addtocart: addtocart,
                user: user,
                couponcode_data: couponcode_data,
                shipping_charge: shipping_charge
            };

            // console.log("addtocartdata --> checkout -->>", addtocart);
            // if(req.body.product_id){
            //     res.send('success');
            // }else{
            return res.render('frontend/checkout', data);
            // }
            // console.log("ffff");
        } catch (e) {
            console.log("Error checkout", e);
        }
    },
    */


    produtQuantity: async function (req, res) {

        console.log("req.body ====>>>", req.body);
        try {
            // let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });

            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0", product_visibility: "1" });
            // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });

            // let addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });
            let id = req.body.id;
            let addtocartdata = [];
            for (let i = 0; i < productData.length; i++) {
                if (id) {
                    for (let a = 0; a < id.length; a++) {
                        if (id[a].id.toString() == productData[i]._id.toString()) {
                            // if (addtocart[a].product_quantity != "0") {
                            //     productData[i].product_quantity = addtocart[a].product_quantity;
                            // } else {
                            //     productData[i].product_quantity = "1";
                            // }
                            // productData[i].product_quantity_price = addtocart[a].product_price;

                            console.log("productData ===>> ", productData[i]);

                            console.log("parseInt(productData[i].product_stock_quantity) >= parseInt(id[a].quantity) ===>> ", parseInt(productData[i].product_stock_quantity) >= parseInt(id[a].quantity));


                            if (parseInt(productData[i].product_stock_quantity) >= parseInt(id[a].quantity)) {
                                // productData[i].product_stock_status = "Out Of Stock";
                                return res.send('success');


                            } else {
                                // return res.redirect('/shoppingcart');
                                return res.send('error');

                            }
                        }
                    }
                }
            }



        } catch (e) {
            console.log("Error checkout", e);
        }
    },
    product_quantity: async function (req, res) {
        try {
            console.log("req.body-->addtocart_call===", req.body.id, req.body.quantity, req.body.product_price, req.body);
            let product_order = await Sys.App.Services.OrderServices.getSingleUserData
                ({ "product_id": req.body.id, customer_id: req.session.details.id, is_deleted: "0", product_status: "pending" });
            // console.log("addtocart====", product_order);
            let id = mongoose.Types.ObjectId(product_order._id);
            if (product_order || product_order != null) {
                let updatedata = await Sys.App.Services.OrderServices.updateUserData(
                    {
                        _id: id
                    }, {
                    "$set": { product_quantity: req.body.quantity, product_price: req.body.product_price, product_basic_price: req.body.product_basic_price }
                });
                return res.send("success");
            }
        } catch (e) {
            console.log("Error in gridproducts", e);
        }
    },


    payments: async function (req, res) {
        res.render("payment", { key: instance.key_id });
    },
    payments_order: async function (req, res) {
        let headerData = getheadercontent();
        let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0", product_visibility: "1" });
        let addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });

        let addtocartdata = [];
        for (let i = 0; i < productData.length; i++) {
            if (addtocart) {
                for (let a = 0; a < addtocart.length; a++) {
                    if (addtocart[a].product_id.toString() == productData[i]._id.toString()) {
                        if (addtocart[a].product_quantity != "0") {
                            productData[i].product_quantity = addtocart[a].product_quantity;
                        } else {
                            productData[i].product_quantity = "1";
                        }
                        productData[i].product_quantity_price = addtocart[a].product_price;
                        if (parseInt(productData[i].product_stock_quantity) < parseInt(productData[i].product_quantity)) {
                            productData[i].product_stock_status = "Out Of Stock";
                        } else {

                            addtocartdata.push(productData[i])
                        }
                    }
                }
            }
        }
        // console.log("payments_order----", addtocartdata);

        // create orderid for shiprocket start
        var length = 7,
            charset = "012345678901234567890123456789",
            orderid_first = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            orderid_first += charset.charAt(Math.floor(Math.random() * n));
        }
        let x = orderid_first.substring(4);
        let y = orderid_first.slice(0, 4);
        shiprocket_orderid = y + '-' + x;
        // create orderid for shiprocket end

        params = req.body;
        instance.orders
            .create(params)
            .then(async (data) => {
                console.log("response payments_order success ===>>", data);

                // let getpaymentdata = await Sys.App.Services.PaymentServices.getUserData({});

                // var lengthNop;
                // var invoice_str1 = '';
                // if (getpaymentdata) {
                //     lengthNop = getpaymentdata.length + 1
                //     invoice_str1 = "oemone_inv" + new Date().getFullYear() + "_" + lengthNop

                // } else {
                //     lengthNop = 1;
                //     invoice_str1 = "oemone_inv" + new Date().getFullYear() + "_" + lengthNop

                // }

                let createdata = await Sys.App.Services.PaymentServices.insertUserData({
                    // product_id: req.body.product_id,
                    product_id: addtocartdata,
                    customer_id: req.session.details.id,
                    amount: req.body.amount,
                    currency: req.body.currency,
                    receipt: req.body.receipt,
                    payment_capture: req.body.payment_capture,
                    order_id: data.id,
                    entity: data.entity,
                    amount: data.amount,
                    amount_paid: data.amount_paid,
                    amount_due: data.amount_due,
                    currency: data.currency,
                    receipt: data.receipt,
                    offer_id: data.offer_id,
                    status: data.status,
                    attempts: data.attempts,
                    headerData  : headerData,
                    // customer_Address: findaddr,
                    shiprocket_orderid: shiprocket_orderid,
                    // invoice_id: invoice_str1,
                });

                // let getInvoicedata = await Sys.App.Services.InvoiceServices.getUserData({});

                // var lengthNo;
                // var invoice_str = '';
                // if (getInvoicedata) {
                //     lengthNo = getInvoicedata.length + 1
                //     invoice_str = "oemone_inv" + new Date().getFullYear() + "_" + lengthNo

                // } else {
                //     lengthNo = 1;
                //     invoice_str = "oemone_inv" + new Date().getFullYear() + "_" + lengthNo

                // }
                for (let aa = 0; aa < addtocartdata.length; aa++) {
                    let invoicData = await Sys.App.Services.InvoiceServices.getSingleUserData({ order_id: data.id, vendor_id: addtocartdata[aa].venodor_id })
                    console.log("invoicData", invoicData);
                    if (invoicData) {
                        let updateinvoicedata = await Sys.App.Services.InvoiceServices.updateSingleUserData(
                            { _id: invoicData._id },
                            {
                                $push: {

                                    product_id: addtocartdata[aa],

                                }
                            });
                    } else {
                        let invoicdata = await Sys.App.Services.InvoiceServices.insertUserData({
                            // product_id: req.body.product_id,
                            vendor_id: addtocartdata[aa].venodor_id,
                            product_id: addtocartdata[aa],
                            customer_id: req.session.details.id,
                            amount: req.body.amount,
                            currency: req.body.currency,
                            receipt: req.body.receipt,
                            payment_capture: req.body.payment_capture,
                            order_id: data.id,
                            entity: data.entity,
                            amount: data.amount,
                            amount_paid: data.amount_paid,
                            amount_due: data.amount_due,
                            currency: data.currency,
                            receipt: data.receipt,
                            offer_id: data.offer_id,
                            status: data.status,
                            attempts: data.attempts,
                            // customer_Address: findaddr,
                            shiprocket_orderid: shiprocket_orderid,
                            // invoice_id: invoice_str,
                        });
                    }
                }
                // console.log("createdata",createdata);
                res.send({ sub: data, status: "success" });
            })
            .catch((error) => {
                console.log("response payments_order error ===>>", error);
                res.send({ sub: error, status: "failed" });
            });
    },

    review_post: async function (req, res) {
        try {
            let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });

            console.log("req.body-->review post===", req.body);
            let rating_num;
            let rating_no;
            if (req.body.rating) {
                if (req.body.rating == "1") { rating_num = "25" }
                if (req.body.rating == "2") { rating_num = "15" }
                if (req.body.rating == "3") { rating_num = "30" }
                if (req.body.rating == "4") { rating_num = "10" }
                if (req.body.rating == "5") { rating_num = "18" }

                if (req.body.rating == "1") { rating_no = "25" }
                if (req.body.rating == "2") { rating_no = "30" }
                if (req.body.rating == "3") { rating_no = "90" }
                if (req.body.rating == "4") { rating_no = "40" }
                if (req.body.rating == "5") { rating_no = "90" }

            }
            console.log("req.session.details.avatarreq.session.details.avatar", req.session.details.avatar);
            let updatedata = await Sys.App.Services.ReviewServices.insertUserData({
                product_id: req.body.product_id,
                customer_id: req.session.details.id,
                customer_img: user.avatar,
                customer_name: req.session.details.firstname,
                customer_email: user.email,
                comment: req.body.comment,
                rating: req.body.rating,
                rating_num: rating_num,
                rating_no: rating_no,
            });
            let rating_avg = 0;
            let rating_sum = 0;
            let rating_nosum = 0;
            let rating_avg_num = 0;
            let rating_arr = [];
            let pid = req.body.product_id;
            pid = mongoose.Types.ObjectId(pid);

            let productData = await Sys.App.Services.ProductServices.getProductData({ _id: pid, is_deleted: "0" });
            let reviewData = await Sys.App.Services.ReviewServices.getUserData({ product_id: pid, customer_id: req.session.details.id, is_deleted: "0" });
            if (productData) {

                if (reviewData.length > 0) {
                    rating_nosum = reviewData.length;
                    for (let r = 0; r < reviewData.length; r++) {
                        if (reviewData[r].product_id == productData._id) {

                            rating_arr.push(parseInt(reviewData[r].rating))
                            rating_sum = parseFloat(reviewData[r].rating) + parseFloat(reviewData[r].rating);
                            // rating_nosum = parseFloat(rating_nosum) + parseFloat(reviewData[r].rating_no);
                            rating_sum = rating_arr.reduce((a, b) => a + b, 0)
                            rating_avg = parseFloat(rating_sum) / parseFloat(rating_nosum);
                            rating_avg = parseFloat(rating_avg).toFixed(1);
                            console.log("rrr", productData._id, rating_avg, rating_nosum, rating_sum);
                        }
                    }
                } else {
                    rating_avg = req.body.rating,
                        rating_avg_num = req.body.rating
                }
                if (rating_avg == 1.1) { rating_avg_num = 11; }
                if (rating_avg == 1.2) { rating_avg_num = 12; }
                if (rating_avg == 1.3) { rating_avg_num = 13; }
                if (rating_avg == 1.4) { rating_avg_num = 14; }
                if (rating_avg == 1.5) { rating_avg_num = 15; }
                if (rating_avg == 1.6) { rating_avg_num = 16; }
                if (rating_avg == 1.7) { rating_avg_num = 17; }
                if (rating_avg == 1.8) { rating_avg_num = 18; }
                if (rating_avg == 1.9) { rating_avg_num = 19; }
                if (rating_avg == 2.0) { rating_avg_num = 2; }

                if (rating_avg == 2.1) { rating_avg_num = 21; }
                if (rating_avg == 2.2) { rating_avg_num = 22; }
                if (rating_avg == 2.3) { rating_avg_num = 23; }
                if (rating_avg == 2.4) { rating_avg_num = 24; }
                if (rating_avg == 2.5) { rating_avg_num = 25; }
                if (rating_avg == 2.6) { rating_avg_num = 26; }
                if (rating_avg == 2.7) { rating_avg_num = 27; }
                if (rating_avg == 2.8) { rating_avg_num = 28; }
                if (rating_avg == 2.9) { rating_avg_num = 29; }
                if (rating_avg == 3.0) { rating_avg_num = 3; }

                if (rating_avg == 3.1) { rating_avg_num = 31; }
                if (rating_avg == 3.2) { rating_avg_num = 32; }
                if (rating_avg == 3.3) { rating_avg_num = 33; }
                if (rating_avg == 3.4) { rating_avg_num = 34; }
                if (rating_avg == 3.5) { rating_avg_num = 35; }
                if (rating_avg == 3.6) { rating_avg_num = 36; }
                if (rating_avg == 3.7) { rating_avg_num = 37; }
                if (rating_avg == 3.8) { rating_avg_num = 38; }
                if (rating_avg == 3.9) { rating_avg_num = 39; }
                if (rating_avg == 4.0) { rating_avg_num = 4; }

                if (rating_avg == 4.1) { rating_avg_num = 41; }
                if (rating_avg == 4.2) { rating_avg_num = 42; }
                if (rating_avg == 4.3) { rating_avg_num = 43; }
                if (rating_avg == 4.4) { rating_avg_num = 44; }
                if (rating_avg == 4.5) { rating_avg_num = 45; }
                if (rating_avg == 4.6) { rating_avg_num = 46; }
                if (rating_avg == 4.7) { rating_avg_num = 47; }
                if (rating_avg == 4.8) { rating_avg_num = 48; }
                if (rating_avg == 4.9) { rating_avg_num = 49; }
                if (rating_avg == 5.0) { rating_avg_num = 5; }
                await Sys.App.Services.ProductServices.updateProductData(
                    { _id: productData._id },
                    {
                        product_rating: rating_avg,
                        product_rating_num: rating_avg_num
                    });
            }
            return res.send("success");


        } catch (e) {
            console.log("Error in gridproducts", e);
        }
    },

    payments_verify: async function (req, res) {
        // console.log("payments_verify----",req.params);
        console.log("payments_verify----", req.body);
        let product_idss = [];
        let diff_vendor_id = [];
        let product_iddata = req.body.product_id;
        for (let oo = 0; oo < product_iddata.length; oo++) {
            product_idss.push(product_iddata[oo].id);
        }
        let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0", product_visibility: "1" });
        let addtocart = product_iddata;


        for (let i = 0; i < productData.length; i++) {
            if (product_iddata) {
                for (let a = 0; a < product_iddata.length; a++) {
                    if (product_iddata[a].id.toString() == productData[i]._id.toString()) {


                        console.log("payments_verify  234347364534  ===>> ", productData[i]);

                        // console.log("parseInt(productData[i].product_stock_quantity) >= parseInt(id[a].quantity) ===>> ", parseInt(productData[i].product_stock_quantity) >= parseInt(id[a].quantity));


                        if (parseInt(productData[i].product_stock_quantity) < parseInt(product_iddata[a].quantity)) {

                            return res.redirect('/paymentfail');

                        }
                    }
                }
            }
        }

        let addtocartdata = [];
        for (let i = 0; i < productData.length; i++) {
            if (addtocart) {
                for (let a = 0; a < addtocart.length; a++) {
                    if (addtocart[a].id.toString() == productData[i]._id.toString()) {
                        diff_vendor_id.push(productData[i].venodor_id)
                        addtocartdata.push(productData[i])
                    }
                }
            }
        }
        // let len_flag = false;
        // if(addtocartdata){
        //     console.log("difff=======",diff_vendor_id);
        //     var duplicates_data = [];
        //     diff_vendor_id.forEach(function(str) {
        //         if (alreadySeen[str]){                  console.log(str);
        //           duplicates_data.push(str);
        //         }
        //         else{
        //           alreadySeen[str] = true;
        //         }
        //       });
        //    // diff_vendor_id.filter((item, index) => index !== diff_vendor_id.indexOf(item));
        //     console.log("duplicates---------------------------------------==",duplicates_data);
        //     console.log("duplicates---------------------------------------==",duplicates_data.length);
        //     if(duplicates_data.length > 1){
        //         len_flag = true;
        //         let getpaymentdata = await Sys.App.Services.PaymentServices.getUserData({});

        //         var ll= getpaymentdata.length;
        //         if(ll == 1){
        //             ll = 0;
        //         }
        //         console.log("llll",getpaymentdata.length);
        //         for (let aa = 0; aa < addtocartdata.length; aa++) {
        //             console.log("lllllllllllllllllll",ll);
        //             if (getpaymentdata) {
        //                ll = ll + 1;
        //             } else {
        //                 ll = 1;
        //             }
        //             addtocartdata[aa].invoice_id = "oemone_inv" + new Date().getFullYear() + "_"+ ll;
        //         }
        //     }
        // }

        // console.log("len_flagvvvvv",len_flag);
        // var invoice_str = '';


        // if(len_flag == false){
        //     let getInvoicedata = await Sys.App.Services.PaymentServices.getUserData({});

        //     var lengthNo;
        //     if (getInvoicedata) {
        //         if(getInvoicedata.length == 1){
        //             getInvoicedata.length = 0 ;
        //         }
        //         lengthNo = getInvoicedata.length + 1
        //         invoice_str = "oemone_inv" + new Date().getFullYear() + "_" + lengthNo

        //     } else {
        //         lengthNo = 1;
        //         invoice_str = "oemone_inv" + new Date().getFullYear() + "_" + lengthNo

        //     }

        // }
        // console.log("invoice_strinvoice_strinvoice_str",invoice_str);
        // let mix = req.params.razorpay_order_id + "|" + req.params.razorpay_payment_id;
        let mix = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

        var expectedSignature = crypto
            .createHmac("sha256", instance.key_secret)
            .update(mix.toString())
            .digest("hex");
        // console.log("sig---" , req.params.razorpay_signature);
        console.log("sig---", req.body.razorpay_signature);
        console.log("sig---", expectedSignature);
        var response = { status: "failure" };

        // cancle payment start

        // var instance = new Razorpay({ key_id: req.body.razorpay_order_id, key_secret: instance.key_secret })
        // instance.paymentLink.cancel(paymentLinkId);

        // cancle payment end


        if (expectedSignature === req.body.razorpay_signature) {
            // if (expectedSignature === req.params.razorpay_signature){
            response = { status: "success" };
            console.log("response payments_verify ===>>", response);
            let user_data = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id });
            var coupon_already_used = "false";
            if (req.body.coupon_type == "true") { //one time used
                coupon_already_used = "true"
            }
            if (coupon_already_used == "true") {
                let coupon_arr = {
                    coupon_id: req.body.coupon_id,
                    coupon_already_used: coupon_already_used
                };
                await Sys.App.Services.CustomerServices.updateoneUserData(
                    { _id: user_data._id },
                    {
                        $set: {
                            coupon_arr: coupon_arr
                        }
                    });
            }

            console.log(response);
            // res.send(response);
            instance.payments.fetch(req.body.razorpay_payment_id).then(async (paymentDocument) => {
                // instance.payments.fetch(req.params.razorpay_payment_id).then(async(paymentDocument)=>{
                console.log("paymentDocument.status : ", paymentDocument);

                let str = paymentDocument.amount;
                str = str.toString();
                console.log("str of amount ", str);
                let amount = str.slice(0, -2);
                let getdata = await Sys.App.Services.PaymentServices.getSingleUserData({ order_id: paymentDocument.order_id })
                let updatedata = await Sys.App.Services.PaymentServices.updateSingleUserData(
                    { _id: getdata._id },
                    {
                        $set: {
                            transaction_id: paymentDocument.id,
                            entity: paymentDocument.entity,
                            amount: amount,
                            payment_details: paymentDocument,
                            // product_id: product_idss,
                            product_id: addtocartdata,
                            product_info: req.body.product_id,
                            status: 'success',
                            coupon_id: req.body.coupon_id,
                            is_coupon: req.body.is_coupon,
                            coupon_amount: req.body.coupon_amount,
                            coupon_name: req.body.coupon_name,
                            coupon_type: req.body.coupon_type,
                            shipping_charge: req.body.shipping_charge,
                            // invoice_id: invoice_str,


                        }
                    });

                for (let aa = 0; aa < addtocartdata.length; aa++) {
                    console.log("addtocartdataaddtocartdata-----", addtocartdata[aa].venodor_id);
                    let total_invoice_vendor = await Sys.App.Services.InvoiceServices.getUserData({ vendor_id: addtocartdata[aa].venodor_id })
                    console.log("lll", total_invoice_vendor.length);

                    let invoicData = await Sys.App.Services.InvoiceServices.getSingleUserData({ order_id: paymentDocument.order_id, vendor_id: addtocartdata[aa].venodor_id })
                    if (invoicData.vendor_id == addtocartdata[aa].venodor_id) {
                        let updateinvoicedata = await Sys.App.Services.InvoiceServices.updateSingleUserData(
                            { _id: invoicData._id },
                            {
                                $set: {
                                    transaction_id: paymentDocument.id,
                                    entity: paymentDocument.entity,
                                    amount: amount,
                                    payment_details: paymentDocument,
                                    // product_id: product_idss,
                                    // product_id: addtocartdata[aa],
                                    product_info: req.body.product_id,
                                    status: 'success',
                                    invoice_id: "oemone_inv-" + total_invoice_vendor.length,
                                    coupon_id: req.body.coupon_id,
                                    is_coupon: req.body.is_coupon,
                                    coupon_amount: req.body.coupon_amount,
                                    coupon_name: req.body.coupon_name,
                                    coupon_type: req.body.coupon_type,
                                    shipping_charge: req.body.shipping_charge,
                                }
                            });
                    }
                }
                let product_id = req.body.product_id;
                for (let p = 0; p < product_id.length; p++) {
                    let id = mongoose.Types.ObjectId(product_id[p].id);
                    let addtocart = await Sys.App.Services.OrderServices.getSingleUserData({ "customer_id": req.session.details.id, product_id: id, is_deleted: "0", product_status: "pending" });
                    console.log("addtocart", addtocart._id);

                    let updatedata = await Sys.App.Services.OrderServices.updateSingleUserData(
                        { _id: addtocart._id }, { product_status: "success", order_id: paymentDocument.order_id, payment_status: "success", order_status: "Processing", });
                    console.log("updatedata- verfiy ", updatedata);

                    let getorderdata = addtocart;//await Sys.App.Services.OrderServices.getSingleUserData({ "customer_id": req.session.details.id, product_id: addtocart.product_id, order_id:addtocart.order_id, is_deleted: "0", product_status: "success" });


                    console.log("getorderdata", getorderdata);
                    let create_obj = {
                        product_id: getorderdata.product_id,
                        base_amount: getorderdata.base_amount,
                        withTax_amount: Math.round(getorderdata.withTax_amount),
                        withoutTax_amount: Math.round(getorderdata.withoutTax_amount),
                        tax_amount: Math.round(getorderdata.tax_amount),
                        tax_percentage: getorderdata.tax_percentage,
                        tax_type: getorderdata.tax_type,
                        cgst: Math.round(getorderdata.cgst),
                        cgst_percentage: getorderdata.cgst_percentage,
                        sgst: Math.round(getorderdata.sgst),
                        sgst_percentage: getorderdata.sgst_percentage,
                        igst: Math.round(getorderdata.igst),
                        igst_percentage: getorderdata.igst_percentage,
                        customer_addresId: getorderdata.customer_addresId,
                        payment_status: "Success",
                        order_status: "Processing",
                        order_type: getorderdata.order_type,
                        shipping_charge: req.body.shipping_charge,
                        coupon_amount: req.body.coupon_amount,
                        coupon_name: req.body.coupon_name,
                        product_quantity: product_id[p].quantity,
                        is_discount: getorderdata.is_discount,
                        discount_start: getorderdata.discount_start,
                        discount_value: getorderdata.discount_value,
                        product_name: getorderdata.product_name,
                        product_price: getorderdata.product_price,

                    }

                    let getdata = await Sys.App.Services.PaymentServices.getSingleUserData({ order_id: paymentDocument.order_id })
                    console.log("ggg", getdata._id);
                    let updatepaymentdata = await Sys.App.Services.PaymentServices.updateSingleUserData(
                        { _id: getdata._id },
                        {
                            payment_status: "Success",
                            order_status: "Processing",
                            order_type: getorderdata.order_type,
                            $push: {

                                product_invoice: create_obj
                            }
                        });
                    //  invoice_id
                    console.log("pppp", product_id);
                    console.log("ppkoi", product_id[p].vendorid);
                    let invoicData = await Sys.App.Services.InvoiceServices.getSingleUserData({ order_id: paymentDocument.order_id, vendor_id: product_id[p].vendorid })
                    console.log("ii", invoicData._id);

                    let updateinvoicedata = await Sys.App.Services.InvoiceServices.updateSingleUserData(
                        { _id: invoicData._id },
                        {
                            payment_status: "Success",
                            order_status: "Processing",
                            order_type: getorderdata.order_type,
                            $push: {

                                product_invoice: create_obj
                            }
                        });

                    let getproductdata = await Sys.App.Services.ProductServices.getProductData({ _id: id });
                    // console.log("getproductdata",getproductdata);
                    let product_stock_quantity = parseInt(getproductdata.product_stock_quantity) - parseInt(product_id[p].quantity);
                    console.log("minus", parseInt(getproductdata.product_stock_quantity), parseInt(product_id[p].quantity));
                    console.log("getproductdata._id", getproductdata._id, product_stock_quantity);
                    let updateproduct = await Sys.App.Services.ProductServices.updateProductData(
                        { _id: getproductdata._id }, { product_stock_quantity: product_stock_quantity });
                    console.log("updateproduct 3333333333  updateproduct", updateproduct);

                }

                // return res.redirect('/paymentmsg');
                console.log("llllllllllll");
                res.send({ status: "success" });
            });
            // return res.redirect('/paymentmsg');

        } else {

            let getdata = await Sys.App.Services.PaymentServices.getSingleUserData({ order_id: req.body.razorpay_order_id })

            let updatedata = await Sys.App.Services.PaymentServices.updateSingleUserData(
                { _id: getdata._id },
                {
                    $set: {
                        status: 'failed'
                    }
                });
            return res.redirect('/paymentfail');

            // return res.send({ status: "failure" });


        }
        // if(response.status == "success"){
        //     return res.redirect('/paymentmsg');
        // }else{
        //     return res.redirect('/paymentfail');
        // }
    },

    paymentmsg: async function (req, res) {
        try {
            console.log("req.params.orderid", req.params.orderid);
            let get_order_data = await Sys.App.Services.PaymentServices.getSingleUserData({ order_id: req.params.orderid });
            let get_invoice_data = await Sys.App.Services.InvoiceServices.getSingleUserData({ order_id: req.params.orderid });
            var newId = mongoose.Types.ObjectId(req.session.details.id);
            let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: newId }, { 'address_arr': { elemMatch: { id: get_order_data.customer_addresId } } });
            console.log("userrrrr", user);
            var address_arr = [];
            if (user) {
                if (user.address_arr) {
                    for (let ar = 0; ar < user.address_arr.length; ar++) {
                        if (user.address_arr[ar].is_default == "0") {
                            address_arr.push(user.address_arr[ar]);
                        }
                    }
                }
            }
            console.log("add", address_arr);
            // let findaddr = {
            // "billing_customer_name": user.firstname,//"Alpha",
            // "billing_last_name": user.lastname,
            // "billing_address": user.address_arr[0].addresstext_no +','+ user.address_arr[0].addresstext_name +','+ user.address_arr[0].landmark +','+ user.address_arr[0].city,
            // "billing_address_2": "",//"Near Hokage House",
            // "billing_city": user.address_arr[0].city,//"New Delhi",
            // "billing_pincode": user.address_arr[0].pin_code,//"110002",
            // "billing_state": user.address_arr[0].state,//"Delhi",
            // "billing_country":"India",// get_order_data.customer_Address[0].country,//"India",
            // "billing_email": user.email,//"Pumps@alfa.com",
            // "billing_phone":user.mobile,//"9988776655",
            // }
            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0", product_visibility: "1" });
            // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
            // let addtocart;
            if (req.session.details) {
                addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });

            }

            let wishlist = await Sys.App.Services.CustomerServices.getSingleUserData
                ({ _id: req.session.details.id });
            // console.log("wishlist====", wishlist);
            let wishlistdata = [];
            for (let i = 0; i < productData.length; i++) {
                for (const element of wishlist.wishlist_arr) {
                    if (element == productData[i]._id.toString()) {
                        wishlistdata.push(productData[i])
                    }
                }
            }
            // console.log("wishlist====", wishlistdata);

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

            var vendor;

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
            var order_date = datetime.format(get_order_data.createdAt, 'YYYY-MM-DD HH:MM');
            console.log("order_date==>>", order_date);
            var order_items = [];
            if (get_order_data.product_id) {
                let product_id = get_order_data.product_id;
                for (let pr = 0; pr < product_id.length; pr++) {
                    order_items.push({
                        "name": product_id[pr].product_name,//"umbrella",
                        "sku": product_id[pr].product_sku,//"chakra123",
                        "units": 1,//product_id[pr].product_name,//10,
                        "selling_price": product_id[pr].product_price,//"900",
                        // "discount": product_id[pr].product_name,//"",
                        "tax": "",//product_id[pr].product_name,//"",
                        "hsn": parseInt(product_id[pr].hsn_code),//441122
                    });
                    vendor = await Sys.App.Services.VendorProfileServices.getVendorData({ _id: product_id[pr].venodor_id });

                }
                var payment_method;
                if (get_order_data.payment_details[0].method == "COD") {
                    payment_method = "COD"
                } else {
                    payment_method = "Prepaid";
                }
            }
            //shiprocket start
            let token;
            let shipment_id_res;
            let awb_code_res;
            ///* comment start
            //step 1: Genrate Token
            // setTimeout(() => {

            // const options = {
            //     method: 'POST',
            //     url: `https://apiv2.shiprocket.in/v1/external/auth/login`,
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     data: {
            //         "email": "binita@kiraintrilogy.com",
            //         "password": "kira@1234"
            //     }
            // };
            // // console.log("options", options);
            // axios.request(options).then(function (response) {
            //     console.log("response.data  Genrate Token ====>> ",response.data);
            //     token = response.data.token;
            // }).catch(function (error) {
            //     console.error("Genrate Token errrrr",error);
            // });
            // }, 1000);

            //step 2 Create order
            // setTimeout(async() => {
            //     console.log(":address_arr[0].mobileno",address_arr[0].mobileno);
            //     // var user_firstname = user.firstname.replace(/ /g,"_");
            //     // var user_lastname = user.lastname.replace(/ /g,"_");
            //     var data = JSON.stringify({
            //         "order_id": get_order_data.shiprocket_orderid, //"5398-447",
            //         "order_date": order_date,//"2022-07-14 11:11",
            //         "pickup_location": vendor.pickup_address_lable,
            //         "channel_id": "",
            //         "comment": "",
            //         "billing_customer_name": user.firstname,//"Alpha",
            //         "billing_last_name": user.lastname,
            //         "billing_address": address_arr[0].addresstext_no +','+ address_arr[0].addresstext_name +','+ address_arr[0].landmark,
            //         "billing_address_2": address_arr[0].city,//"Near Hokage House",
            //         "billing_city": address_arr[0].city,//"New Delhi",
            //         "billing_pincode": address_arr[0].pincode,//"110002",
            //         "billing_state": address_arr[0].state,//"Delhi",
            //         "billing_country":"India",// get_order_data.customer_Address[0].country,//"India",
            //         "billing_email": user.email,//"Pumps@alfa.com",
            //         "billing_phone":address_arr[0].mobileno,//"9988776655",
            //         "shipping_is_billing": true,
            //         "shipping_customer_name": "",//"",
            //         "shipping_last_name": "",
            //         "shipping_address": "",//"B-1604, WestGate",
            //         "shipping_address_2": "",//"S G Highway, Near Divya bhaskar",
            //         "shipping_city": "",//"Ahmedabad",
            //         "shipping_pincode": "",//"380015",
            //         "shipping_country": "",//"India",
            //         "shipping_state": "",//"Gujarat",
            //         "shipping_email": "",//"info@kiraintrilogy.com",
            //         "shipping_phone": "",//"7000028984",
            //         "order_items":order_items,
            //         //  [
            //         //   {
            //         //     "name": "umbrella",
            //         //     "sku": "chakra123",
            //         //     "units": 10,
            //         //     "selling_price": "900",
            //         //     "discount": "",
            //         //     "tax": "",
            //         //     "hsn": 441122
            //         //   }
            //         // ],
            //         "payment_method": payment_method,//"Prepaid",
            //         "shipping_charges": 0,
            //         "giftwrap_charges": 0,
            //         "transaction_charges": 0,
            //         "total_discount": 0,
            //         "sub_total": parseInt(get_order_data.amount),//9000,
            //         "length": 10,
            //         "breadth": 15,
            //         "height": 20,
            //         "weight": 0.5
            //       });
            // //     "order_id": "9178-147",
            // //     "order_date": "2022-07-14 11:11",
            // //     "pickup_location": "test",
            // //     "channel_id": "",
            // //     "comment": "Reseller: M/s Goku",
            // //     "billing_customer_name": "Alpha",
            // //     "billing_last_name": "Pumps",
            // //     "billing_address": "House 221B, Leaf Village",
            // //     "billing_address_2": "Near Hokage House",
            // //     "billing_city": "New Delhi",
            // //     "billing_pincode": "110002",
            // //     "billing_state": "Delhi",
            // //     "billing_country": "India",
            // //     "billing_email": "Pumps@alfa.com",
            // //     "billing_phone": "9988776655",
            // //     "shipping_is_billing": true,
            // //     "shipping_customer_name": "",
            // //     "shipping_last_name": "",
            // //     "shipping_address": "B-1604, WestGate",
            // //     "shipping_address_2": "S G Highway, Near Divya bhaskar",
            // //     "shipping_city": "Ahmedabad",
            // //     "shipping_pincode": "380015",
            // //     "shipping_country": "India",
            // //     "shipping_state": "Gujarat",
            // //     "shipping_email": "info@kiraintrilogy.com",
            // //     "shipping_phone": "7000028984",
            // //     "order_items": [
            // //     {
            // //         "name": "Alpha CT120",
            // //         "sku": "alfa120",
            // //         "units": 10,
            // //         "selling_price": "500",
            // //         "discount": "",
            // //         "tax": "",
            // //         "hsn": 211122
            // //     }
            // //     ],
            // //     "payment_method": "Card",
            // //     "shipping_charges": 0,
            // //     "giftwrap_charges": 0,
            // //     "transaction_charges": 0,
            // //     "total_discount": 0,
            // //     "sub_total": 5000,
            // //     "length": 10,
            // //     "breadth": 15,
            // //     "height": 20,
            // //     "weight": 2.5
            // // })
            //       console.log("data creater order on ship rocket",data);
            //       var config = {
            //         method: 'post',
            //         url: 'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
            //         headers: {
            //           'Authorization': `Bearer ${token}`,
            //           'Content-Type': 'application/json'
            //         },
            //         data : data
            //       };

            //       axios(config)
            //       .then(async function (response) {
            //         console.log("create order on ship rocket",JSON.stringify(response.data));
            //         shipment_id_res = response.data.shipment_id;
            //         order_id_res = response.data.order_id;
            //         await Sys.App.Services.PaymentServices.updateSingleUserData(
            //             { _id: get_order_data._id },
            //             {
            //                 $set: {
            //                     shiprocket_shipmentId: shipment_id_res,
            //                     shiprocket_orderId: response.data.order_id,
            //                     shiprocket_order_create: response.data
            //                 }
            //             });
            //         await Sys.App.Services.InvoiceServices.updateSingleUserData(
            //             { _id: get_invoice_data._id },
            //             {
            //                 $set: {
            //                     shiprocket_shipmentId: shipment_id_res,
            //                     shiprocket_orderId: response.data.order_id,
            //                     shiprocket_order_create: response.data
            //                 }
            //             });
            //       })
            //       .catch(function (error) {
            //         console.log("Create order errrrr",error);
            //       });


            // }, 3000);

            //step 3 assing courier type

            // setTimeout(async() => {
            //     let get_ship_data = await Sys.App.Services.PaymentServices.getSingleUserData({ _id: get_order_data._id });
            //     shipment_id_res = parseInt(get_ship_data.shiprocket_shipmentId);
            //     console.log("shipment_id_res",shipment_id_res);
            //         var data = JSON.stringify({
            //             "shipment_id": shipment_id_res,
            //             "courier_id": 54
            //             });

            //             var config = {
            //             method: 'post',
            //             url: 'https://apiv2.shiprocket.in/v1/external/courier/assign/awb',
            //             headers: {
            //                 'Authorization': `Bearer ${token}`,
            //                 'Content-Type': 'application/json'
            //             },
            //             data : data
            //             };

            //             axios(config)
            //             .then(async function (response) {
            //             console.log("assign courrier type",JSON.stringify(response.data));
            //             // console.log("assign courrier type",JSON.stringify(response.data.data));
            //             // awb_code_res = response.data.awb_code;
            //             await Sys.App.Services.PaymentServices.updateSingleUserData(
            //                 { _id: get_order_data._id },
            //                 {
            //                     $set: {
            //                         shiprocket_courier_assign: response.data,
            //                         shiprocket_awb_code: response.data.response.data.awb_code
            //                     }
            //                 });
            //             await Sys.App.Services.InvoiceServices.updateSingleUserData(
            //                 { _id: get_invoice_data._id },
            //                 {
            //                     $set: {
            //                         shiprocket_courier_assign: response.data,
            //                         shiprocket_awb_code: response.data.response.data.awb_code
            //                     }
            //                 });
            //             })
            //             .catch(function (error) {
            //             console.log("assing courier type errr",error);
            //             });

            //     }, 4000);

            //step 4 generate pickup
            // setTimeout(async() => {
            //     console.log("gggg pp",shipment_id_res);
            //     var data = JSON.stringify({
            //         "shipment_id": [parseInt(shipment_id_res)],
            //         // "courier_id": "54"
            //         });

            //         var config = {
            //         method: 'post',
            //         url: 'https://apiv2.shiprocket.in/v1/external/courier/generate/pickup',
            //         headers: {
            //             'Authorization': `Bearer ${token}`,
            //             'Content-Type': 'application/json'
            //         },
            //         data : data
            //         };

            //         axios(config)
            //         .then(async function (response) {
            //         console.log("generate pickup",JSON.stringify(response.data));
            //         await Sys.App.Services.PaymentServices.updateSingleUserData(
            //             { _id: get_order_data._id },
            //             {
            //                 $set: {
            //                     shiprocket_generate_pickup: response.data
            //                 }
            //             });
            //         await Sys.App.Services.InvoiceServices.updateSingleUserData(
            //             { _id: get_invoice_data._id },
            //             {
            //                 $set: {
            //                     shiprocket_generate_pickup: response.data
            //                 }
            //             });
            //         })
            //         .catch(function (error) {
            //         console.log("generate pickup errr",error);
            //         });

            // }, 6000);


            // //step 5 Generate Manifest
            // setTimeout(() => {
            //     var data = JSON.stringify({
            //         "shipment_id": [shipment_id_res],
            //         // "courier_id": "54"
            //         });

            //         var config = {
            //         method: 'post',
            //         url: 'https://apiv2.shiprocket.in/v1/external/manifests/generate',
            //         headers: {
            //             'Authorization': `Bearer ${token}`,
            //             'Content-Type': 'application/json'
            //         },
            //         data : data
            //         };

            //         axios(config)
            //         .then(function (response) {
            //         console.log("Generate Manifest",JSON.stringify(response.data));
            //         })
            //         .catch(function (error) {
            //         console.log(error);
            //         });
            // }, 6000);

            // //step 6 Print Manifest
            // setTimeout(() => {
            //     var data = JSON.stringify({
            //         "order_ids": [order_id_res],
            //         // "courier_id": "54"
            //         });

            //         var config = {
            //         method: 'post',
            //         url: 'https://apiv2.shiprocket.in/v1/external/manifests/print',
            //         headers: {
            //             'Authorization': `Bearer ${token}`,
            //             'Content-Type': 'application/json'
            //         },
            //         data : data
            //         };

            //         axios(config)
            //         .then(function (response) {
            //         console.log("Print Manifest",JSON.stringify(response.data));
            //         })
            //         .catch(function (error) {
            //         console.log(error);
            //         });
            // }, 7000);

            // //step 7 Generate Label
            // setTimeout(() => {
            //     var data = JSON.stringify({
            //         "shipment_id": [shipment_id_res],
            //         // "courier_id": "54"
            //         });

            //         var config = {
            //         method: 'post',
            //         url: 'https://apiv2.shiprocket.in/v1/external/courier/generate/label',
            //         headers: {
            //             'Authorization': `Bearer ${token}`,
            //             'Content-Type': 'application/json'
            //         },
            //         data : data
            //         };

            //         axios(config)
            //         .then(function (response) {
            //         console.log("Generate Label",JSON.stringify(response.data));
            //         })
            //         .catch(function (error) {
            //         console.log(error);
            //         });
            // }, 8000);

            // //step 8 Generate Invoice
            // setTimeout(() => {
            //     var data = JSON.stringify({
            //         "ids": [order_id_res]
            //         // "courier_id": "54"
            //         });

            //         var config = {
            //         method: 'post',
            //         url: 'https://apiv2.shiprocket.in/v1/external/orders/print/invoice',
            //         headers: {
            //             'Authorization': `Bearer ${token}`,
            //             'Content-Type': 'application/json'
            //         },
            //         data : data
            //         };

            //         axios(config)
            //         .then(function (response) {
            //         console.log("Generate Invoice",JSON.stringify(response.data));
            //         })
            //         .catch(function (error) {
            //         console.log(error);
            //         });
            // }, 8000);

            // //step 9 Track order
            // setTimeout(() => {
            //     var data = JSON.stringify({
            //         "ids": [order_id_res]
            //         // "courier_id": "54"
            //         });

            //         var config = {
            //         method: 'get',
            //         url: 'https://apiv2.shiprocket.in/v1/external/courier/track/awb/'+awb_code_res,
            //         headers: {
            //             'Authorization': `Bearer ${token}`,
            //             'Content-Type': 'application/json'
            //         },
            //         data : data
            //         };

            //         axios(config)
            //         .then(function (response) {
            //         console.log("Track order",JSON.stringify(response.data));
            //         })
            //         .catch(function (error) {
            //         console.log(error);
            //         });
            // }, 8000);
            //shiprocket end
            // */ comment end

            //order confirmation mail sent data start
            if (get_order_data) {
                var mailOptions = {
                    from: "intrilogykira@gmail.com",//config.smtp_sender_mail_id,
                    // to: 'rahoul@kiraintrilogy.com',
                    to: user.email,//user.email, //emailId, // register user's email
                    subject: 'Order Confirmation',
                    // text: `${passwordText}  ${env.BASE_URL}forgotpassword/${token}`
                    html: '<html><body style="text-align: center; color:#000;background-color: #7f87ab;margin: 0 auto;font-family: Arial, Helvetica, sans-serif"><div style="position: relative;"><div style="position: relative; height: 250px; background-color: #7f87ab;"><div style="padding: 70px 0;font-size: 2vw;color: #fff; text-align: center;">OEMOne</div></div><div style="background-color: #fff;width: 500px;margin: 0 auto;top: -75px;margin-bottom: 30px;position: relative;padding: 25px;z-index: 1"><div style="font-size: 24px;margin-bottom: 20px; text-align: center;">Greetings of the day</div><div style="font-size: 14px; text-align: left; line-height: 20px; margin: 20px 0;"><b></b><br/><br/>OrderId:' + get_order_data.order_id + '</br> Hello, &nbsp;&nbsp;' + user.username + '</br></br> We’re happy to let you know that we’ve received your order.</br>Once your package ships, we will send you an email with a tracking number and link so you can see the movement of your package. </br>If you have any questions, contact us here or call us on [contact number]! </br>We are here to help!<br/><br/><div style="text-align: left;">Thank you</div><div style="text-align: left;margin-bottom: 10px;">Team OEMOne</div></div><div><div style="font-size: 12px;text-align: center; position: relative; top: -75px;">Email sent from <a href="http://www.oemone.shop/" target="_blank" title="Original Equipement Manufacturer | OEMup">http://www.oemone.shop/</a></div></div></div></body></html>'
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
                        console.log("mail sent error", err);
                        // req.flash('error', 'Error sending mail,please try again After some time.');
                        // return res.redirect('/forgot_password');
                    }
                });
            }
            //order confirmation mail sent data end

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                wishlistdata: wishlistdata,
                productData: productData,
                productCategoryData: productCategoryData,
                prjectCategoryData_dup: prjectCategoryData_dup,
                addtocart: addtocart,
            };

            return res.render('frontend/paymentmsg', data);

        } catch (e) {
            console.log("Error in gridproducts", e);
        }
    },

    paymentfail: async function (req, res) {
        try {
            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0", product_visibility: "1" });
            // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });

            let addtocart;
            if (req.session.details) {
                addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });

            }

            let wishlist = await Sys.App.Services.CustomerServices.getSingleUserData
                ({ _id: req.session.details.id });
            // console.log("wishlist====", wishlist);
            let wishlistdata = [];
            for (let i = 0; i < productData.length; i++) {
                for (const element of wishlist.wishlist_arr) {
                    if (element == productData[i]._id.toString()) {
                        wishlistdata.push(productData[i])
                    }
                }
            }
            // console.log("wishlist====", wishlistdata);

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
                wishlistdata: wishlistdata,
                productData: productData,
                productCategoryData: productCategoryData,
                prjectCategoryData_dup: prjectCategoryData_dup,
                addtocart: addtocart,
            };

            return res.render('frontend/paymentfail', data);

        } catch (e) {
            console.log("Error in gridproducts", e);
        }
    },




    productGst: async function (req, res) {


        console.log("req -------product gst", req.body.userId);

        try {
            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0", product_visibility: "1" });
            let addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });

            // console.log("addtocart ---->>>>", addtocart[0]);
            // let addtocart1
            // for (let ii = 0; ii < addtocart.length; ii++) {

            // console.log("addtocart ---->>>>",addtocart[ii].product_id);

            //  let  addtocart1 = await Sys.App.Services.OrderServices.updateSingleUserData({ "product_id": addtocart[ii].product_id },
            //  {
            //     $set: {
            //         status: 'failed'
            //     }
            //   }
            //  );


            // }




            let addtocartdata = [];
            for (let i = 0; i < productData.length; i++) {
                if (addtocart) {
                    for (let a = 0; a < addtocart.length; a++) {
                        if (addtocart[a].product_id.toString() == productData[i]._id.toString()) {
                            if (addtocart[a].product_quantity != "0") {
                                productData[i].product_quantity = addtocart[a].product_quantity;
                            } else {
                                productData[i].product_quantity = "1";
                            }
                            productData[i].product_quantity_price = addtocart[a].product_price;
                            if (parseInt(productData[i].product_stock_quantity) < parseInt(productData[i].product_quantity)) {
                                productData[i].product_stock_status = "Out Of Stock";
                            } else {
                                addtocartdata.push(productData[i])
                            }
                        }
                    }
                }
            }


            // vendor_Gstcode
            var finalPrice = [];
            var subTotalnew = [];
            var taxtTotal = [];

            var cgstPrice = [];
            var sgstPrice = [];
            var igstPrice = [];


            let totalPrice;
            for (var i = 0; i < addtocartdata.length; i++) {

                // console.log("addtocartdata ===> ",addtocartdata[i]);
                let igst;
                let itmePrice;
                if (addtocartdata[i].is_discount == '1' && addtocartdata[i].discount_start == "true") {
                    itmePrice = addtocartdata[i].discount_price
                } else {
                    itmePrice = addtocartdata[i].product_price;
                }
                let gstrate = addtocartdata[i].GST_rate;

                let cgst = 0;
                let sgst = 0;

                let amount = (parseFloat(itmePrice) * (parseFloat(addtocartdata[i].product_quantity)))
                subTotalnew.push({ subvalue: amount })
                totalPrice = (parseFloat(amount) * (parseFloat(gstrate)) / 100)
                totalPrice = parseFloat(totalPrice) + parseFloat(amount)
                finalPrice.push({ price: totalPrice });


                var Total = finalPrice.map(el => el.price).reduce((a, b) => a + b);
                var subTotal = subTotalnew.map(el => el.subvalue).reduce((a, b) => a + b);
                var subTotal = subTotalnew.map(el => el.subvalue).reduce((a, b) => a + b);


                let taxamaount = (parseFloat(amount) * (parseFloat(gstrate)) / 100)

                taxtTotal.push({ gst: taxamaount })

                var taxtFinal = taxtTotal.map(el => el.gst).reduce((a, b) => a + b);




                // console.log("igst sgst cgst --", cgstPrice, sgstPrice, igstPrice);






                console.log("addtocartdata[i].vendor_Gstcode ", addtocartdata[i].vendor_Gstcode, req.body.userGst);
                if (addtocartdata[i].vendor_Gstcode == req.body.userGst) {

                    // console.log("userGst 11111111111----->>>", req.body.userGst);

                    cgst = parseFloat(gstrate) / 2
                    let cgstpr = cgst
                    sgst = parseFloat(gstrate) / 2
                    let sgstpr = sgst
                    let amount = (parseFloat(itmePrice) * (parseFloat(addtocartdata[i].product_quantity)))

                    cgst = (parseFloat(amount) * parseFloat(cgst)) / 100

                    cgst = parseFloat(cgst)

                    cgstPrice.push({ cgst: cgst })

                    sgst = (parseFloat(amount) * parseFloat(sgst)) / 100

                    sgst = parseFloat(sgst)
                    sgstPrice.push({ sgst: sgst })

                    let withTax_amount = (parseFloat(amount) * (parseFloat(gstrate)) / 100)
                    let tax_amount = withTax_amount;

                    withTax_amount = parseFloat(withTax_amount) + parseFloat(amount)

                    let getdata = await Sys.App.Services.OrderServices.getSingleUserData({ "customer_id": req.session.details.id, product_id: addtocartdata[i]._id, is_deleted: "0", product_status: "pending" })
                    console.log("elseeeeeeeeee checkout", getdata._id);
                    let addtocart1 = await Sys.App.Services.OrderServices.updateSingleUserData({ _id: getdata._id, product_id: addtocartdata[i]._id },
                        {
                            $set: {
                                vendorId: addtocartdata[i].venodor_id,
                                base_amount: itmePrice,
                                withTax_amount: Math.round(withTax_amount),
                                withoutTax_amount: Math.round(amount),
                                tax_amount: Math.round(tax_amount),
                                tax_percentage: gstrate,
                                tax_type: "CGST ,SGST",
                                cgst: Math.round(sgst),
                                cgst_percentage: cgstpr,
                                sgst: Math.round(sgst),
                                sgst_percentage: sgstpr,
                                igst: 0,
                                igst_percentage: 0,
                                customer_addresId: req.body.userId,
                            }
                        }


                    );

                    // console.log("updateData   ---->>", updateData);
                } else {

                    // console.log("userGst 222222222222----->>>", req.body.userGst, addtocartdata[i].vendor_Gstcode);


                    let prId = addtocartdata[i]._id;
                    prId = prId.toString();

                    console.log("userGst 2222222----->>>", req.body.userGst);


                    let amount = (parseFloat(itmePrice) * (parseFloat(addtocartdata[i].product_quantity)))

                    igst = (parseFloat(amount) * (parseFloat(gstrate)) / 100)
                    let tax_amount = igst



                    igstPrice.push({ igst: igst })


                    igst = parseFloat(igst) + parseFloat(amount)

                    // console.log("updateData  idddddddddd ---->>", addtocartdata[i]._id);
                    let getdata = await Sys.App.Services.OrderServices.getSingleUserData({ "customer_id": req.session.details.id, product_id: addtocartdata[i]._id, is_deleted: "0", product_status: "pending" })
                    console.log("elseeeeeeeeee checkout", getdata._id);
                    let addtocart1 = await Sys.App.Services.OrderServices.updateSingleUserData({ _id: getdata._id, product_id: addtocartdata[i]._id },
                        {
                            $set: {
                                vendorId: addtocartdata[i].venodor_id,
                                base_amount: itmePrice,
                                withTax_amount: Math.round(igst),
                                withoutTax_amount: Math.round(amount),
                                tax_amount: Math.round(tax_amount),
                                tax_percentage: gstrate,
                                tax_type: "IGSt",
                                cgst: 0,
                                cgst_percentage: 0,
                                sgst: 0,
                                sgst_percentage: 0,
                                igst: Math.round(tax_amount),
                                igst_percentage: gstrate,
                                customer_addresId: req.body.userId,
                            }
                        }


                    );

                    // console.log("33333333333333--------", addtocart1);

                }


            }


            var igstFinal = 0;
            if (igstPrice.length > 0) {
                igstFinal = igstPrice.map(el => el.igst).reduce((a, b) => a + b);
            }
            var cgstFinal = 0;
            if (cgstPrice.length > 0) {
                cgstFinal = cgstPrice.map(el => el.cgst).reduce((a, b) => a + b);
            }
            var sgstFinal = 0;
            if (sgstPrice.length > 0) {
                sgstFinal = sgstPrice.map(el => el.sgst).reduce((a, b) => a + b);
            }

            console.log("igst cgst ---->>", igstFinal, cgstFinal, sgstFinal);


            var fnalTotal = {
                total_Price: Math.ceil(Total),
                totalTax: Math.ceil(taxtFinal),
                subTotal: Math.ceil(subTotal),
                igstFinal: Math.ceil(igstFinal),
                cgstFinal: Math.ceil(cgstFinal),
                sgstFinal: Math.ceil(sgstFinal),
            }
            // console.log("ffff",fnalTotal);
            // for (let ii = 0; ii < addtocart.length; ii++) {

            //     console.log("addtocart ---->>>>", addtocart[ii].product_id);

            //     let addtocart1 = await Sys.App.Services.OrderServices.updateSingleUserData({ "product_id": addtocart[ii].product_id },
            //         {
            //             $set: {
            //                 base_amount: 00,
            //                 withTax_amount: 00,
            //                 withoutTax_amount: 00,
            //                 tax_amount: 00,
            //                 tax_percentage: 00,
            //                 tax_type: 00,
            //                 cgst: 00,
            //                 sgst: 00,
            //                 igst: 00,
            //             }
            //         }
            //     );


            // }


            // console.log(" checkout caluation -->>", Total);
            // console.log("fff",fnalTotal);
            if (Total !== null) {
                return res.send(200, fnalTotal);
            }

        } catch (e) {
            console.log("Error in checkout", e);
        }
    },

    order_data: async function (req, res) {

        try {
            let orderData = await Sys.App.Services.OrderServices.getUserData({ is_deleted: "0" });
            console.log("is_deleted--->>");

            return res.send(200, orderData);

        } catch (e) {
            console.log("Error in checkout", e);

        }

    },
    orders_list: async function (req, res) {

        // console.log("req.sesson ====", req.session.details.id);
        try {

            let dataNo = await Sys.App.Services.PaymentServices.getProductDatatable({ is_deleted: "0", status: "success", customer_id: req.session.details.id });
            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0", product_visibility: "1" });
            // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });

            let addtocart1 = await Sys.App.Services.PaymentServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", status: "success" });

            let invoiceData = await Sys.App.Services.InvoiceServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", status: "success" });
            // console.log("invoiceData ====>>", invoiceData);
            let addtocart;
            if (req.session.details) {
                addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });

            }
            let orderNo = [];
            let coustomerId = [];
            for (const element of dataNo) {
                orderNo.push(element.order_id)
                coustomerId.push(element.customer_id)


            }

            // console.log("dataNo dataNo ===>",orderNo);





            let finalSuccessData = [];

            for (let c = 0; c < addtocart1.length; c++) {
                for (const item of orderNo) {
                    if (item == addtocart1[c].order_id) {
                        finalSuccessData.push(addtocart1[c]);
                    }
                }

            }


            let finalInvoiceData = [];

            for (let c = 0; c < invoiceData.length; c++) {
                for (const item of orderNo) {
                    if (item == invoiceData[c].order_id) {
                        finalInvoiceData.push(invoiceData[c]);
                    }
                }

            }

            for (const vendorAd of finalInvoiceData) {
                let vendor = await Sys.App.Services.VendorProfileServices.getSingleVendorData({ _id: vendorAd.vendor_id });

                let vendor_add = {
                    name: vendor.vendor_company,
                    flatNo: vendor.vendor_flatNo,
                    area: vendor.vendor_area,
                    town: vendor.vendor_town,
                    landmark: vendor.vendor_Landmark,
                    pinCode: vendor.vendor_pin,
                    phNo: vendor.vendor_phone,
                    state: vendor.vendor_state,


                }
                await Sys.App.Services.InvoiceServices.updateSingleUserData(
                    { _id: vendorAd._id, vendor_id: vendorAd.vendor_id },
                    {
                        $set: {
                            shipping_details: vendor_add
                        }
                    });



            }


            let invoiceDatafinal = await Sys.App.Services.InvoiceServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", status: "success" });



            // console.log("finalSuccessData ====>",finalSuccessData);
            // console.log("finalInvoiceData  = == > ", finalInvoiceData[0]);
            // console.log("invoiceDatafinal  = == > ", invoiceDatafinal[0].product_invoice);


            var newId = mongoose.Types.ObjectId(req.session.details.id);

            let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: newId });



            let findaddr = user.address_arr



            let addressId = [];


            if (finalSuccessData) {
                for (let fi = 0; fi < finalSuccessData.length; fi++) {
                    if (finalSuccessData[fi].product_invoice[0]) {
                        addressId.push(finalSuccessData[fi].product_invoice[0].customer_addresId)
                        if (finalSuccessData[fi].product_invoice[0].customer_addresId) {

                        }
                        let addrId = finalSuccessData[fi].product_invoice[0].customer_addresId

                        let objId = findaddr.findIndex((obj => obj.id == addrId));



                        let updatepaymentdata = await Sys.App.Services.PaymentServices.updateSingleUserData(
                            { _id: finalSuccessData[fi]._id },
                            {
                                $set: {
                                    customer_Address: findaddr[objId]
                                }
                            });



                    }
                }
            }



            let start;
            if (req.body.start) {
                start = req.body.start
            } else {
                start = 0;
            }
            let query;

            query = { "customer_id": req.session.details.id, is_deleted: "0", status: "success" };

            let addtocartaddress = await Sys.App.Services.PaymentServices.getUserDataSort(query, start);

            // let addtocartaddress = await Sys.App.Services.PaymentServices.getUserDataSort({ "customer_id": req.session.details.id, is_deleted: "0", status: "success" });


            // console.log(" addtocartaddress =====>>>",addtocartaddress);
            // for (let fi = 0; fi < finalSuccessData.length; fi++) {

            //     addressId.push(finalSuccessData[fi].product_invoice[0].customer_addresId)
            //     if (finalSuccessData[fi].product_invoice[0].customer_addresId) {

            //     }
            //     let addrId = finalSuccessData[fi].product_invoice[0].customer_addresId

            //     let objId = findaddr.findIndex((obj => obj.id == addrId));



            //     let updatepaymentdata = await Sys.App.Services.PaymentServices.updateSingleUserData(
            //         { _id: finalSuccessData[fi]._id },
            //         {
            //             $set: {
            //                 customer_Address: findaddr[objId]
            //             }
            //         });



            // }






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

            //shiprocket start
            let token;
            let shipment_id_res;
            let awb_code_res;
            ///* comment start
            //step 1: Genrate Token
            //  setTimeout(() => {

            //  const options = {
            //      method: 'POST',
            //      url: `https://apiv2.shiprocket.in/v1/external/auth/login`,
            //      headers: {
            //          'Content-Type': 'application/json',
            //      },
            //      data: {
            //          "email": "binita@kiraintrilogy.com",
            //          "password": "kira@1234"
            //      }
            //  };
            //  // console.log("options", options);
            //  axios.request(options).then(function (response) {
            //      console.log("response.data  Genrate Token ====>> ",response.data);
            //      token = response.data.token;
            //  }).catch(function (error) {
            //      console.error("Genrate Token errrrr",error);
            //  });
            //  }, 500);

            var track_order_data;
            if (addtocart1) {
                for (let tr = 0; tr < addtocart1.length; tr++) {
                    // let order_id_res = addtocart1[tr].order_id;
                    //step 9 Track order
                    // setTimeout(async() => {
                    let awb_code_res = addtocart1[tr].shiprocket_awb_code;

                    // awb_code_res = awb_code_res.slice(4);
                    console.log("awb code :: ", awb_code_res);
                    // awb_code_res = par
                    // var data = JSON.stringify({
                    //     "ids": [parseInt(order_id_res)]
                    //     // "courier_id": "54"
                    //     });

                    // var config = {
                    // method: 'get',
                    // url: 'https://apiv2.shiprocket.in/v1/external/courier/track/awb/'+awb_code_res,
                    // headers: {
                    //     'Authorization': `Bearer ${token}`,
                    //     'Content-Type': 'application/json'
                    // },
                    // // data : data
                    // };

                    // axios(config)
                    // .then(async function (response) {
                    // console.log("Track order",JSON.stringify(response.data));
                    let track_order_arr = [];
                    // track_order_arr.push({id:addtocart1[tr].order_id,shipment_status:response.data.tracking_data.shipment_status});
                    track_order_arr.push({ id: addtocart1[tr].order_id, shipment_status: undefined });
                    console.log("track_order_arr", track_order_arr);
                    track_order_data = [].concat.apply([], track_order_arr);
                    await Sys.App.Services.PaymentServices.updateSingleUserData(
                        { _id: addtocart1[tr]._id },
                        {
                            $set: {
                                track_order_data: track_order_arr
                            }
                        });

                    // })
                    //         .catch(function (error) {
                    //         console.log(error);
                    //         });
                    // }, 1000);
                }
            }
            //shiprocket end

            // console.log("addtocartdata",addtocartdata);
            // console.log("track_order_arr",track_order_arr);
            // setTimeout(() => {
            console.log("track_order_data", track_order_data);
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                productData: productData,
                productCategoryData: productCategoryData,
                prjectCategoryData_dup: prjectCategoryData_dup,
                addtocart: addtocart,
                finalSuccessData: addtocartaddress,
                finalInvoiceData: invoiceDatafinal,
                totalRecord: addtocartaddress.length,
                track_order_arr: track_order_data
            };

            // console.log("hhhhhhhhhdhdhdhdhdhdhdhdh================>>>>>>>>>>>>>>>>>>>>>>",homeData);

            // console.log(projectData, "homeprojectDatacontroller");
            return res.render('frontend/orders_list', data);
            // }, 2800);


        } catch (e) {
            console.log("Error orders_list", e);
        }
    },


    ordersFilter: async function (req, res) {

        // console.log("req.sesson ====", req.session.details.id);

        console.log("dhshweu dsusd ordersFilter ===>>>", req.body);
        try {

            let dataNo = await Sys.App.Services.PaymentServices.getProductDatatable({ is_deleted: "0", status: "success", customer_id: req.session.details.id });
            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0", product_visibility: "1" });
            // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });

            let addtocart1 = await Sys.App.Services.PaymentServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", status: "success" });

            let invoiceData = await Sys.App.Services.InvoiceServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", status: "success" });
            // console.log("invoiceData ====>>", invoiceData);
            let addtocart;
            if (req.session.details) {
                addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });

            }
            let orderNo = [];
            let coustomerId = [];
            for (const element of dataNo) {
                orderNo.push(element.order_id)
                coustomerId.push(element.customer_id)


            }

            // console.log("dataNo dataNo ===>",orderNo);





            let finalSuccessData = [];

            for (let c = 0; c < addtocart1.length; c++) {
                for (const item of orderNo) {
                    if (item == addtocart1[c].order_id) {
                        finalSuccessData.push(addtocart1[c]);
                    }
                }

            }


            let finalInvoiceData = [];

            for (let c = 0; c < invoiceData.length; c++) {
                for (const item of orderNo) {
                    if (item == invoiceData[c].order_id) {
                        finalInvoiceData.push(invoiceData[c]);
                    }
                }

            }

            for (const vendorAd of finalInvoiceData) {
                let vendor = await Sys.App.Services.VendorProfileServices.getSingleVendorData({ _id: vendorAd.vendor_id });

                let vendor_add = {
                    name: vendor.vendor_company,
                    flatNo: vendor.vendor_flatNo,
                    area: vendor.vendor_area,
                    town: vendor.vendor_town,
                    landmark: vendor.vendor_Landmark,
                    pinCode: vendor.vendor_pin,
                    phNo: vendor.vendor_phone,
                    state: vendor.vendor_state,


                }
                await Sys.App.Services.InvoiceServices.updateSingleUserData(
                    { _id: vendorAd._id, vendor_id: vendorAd.vendor_id },
                    {
                        $set: {
                            shipping_details: vendor_add
                        }
                    });



            }


            let invoiceDatafinal = await Sys.App.Services.InvoiceServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", status: "success" });



            // console.log("finalSuccessData ====>",finalSuccessData);
            // console.log("finalInvoiceData  = == > ", finalInvoiceData[0]);


            var newId = mongoose.Types.ObjectId(req.session.details.id);

            let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: newId });



            let findaddr = user.address_arr



            let addressId = [];


            if (finalSuccessData) {
                for (let fi = 0; fi < finalSuccessData.length; fi++) {
                    if (finalSuccessData[fi].product_invoice[0]) {
                        addressId.push(finalSuccessData[fi].product_invoice[0].customer_addresId)
                        if (finalSuccessData[fi].product_invoice[0].customer_addresId) {

                        }
                        let addrId = finalSuccessData[fi].product_invoice[0].customer_addresId

                        let objId = findaddr.findIndex((obj => obj.id == addrId));



                        let updatepaymentdata = await Sys.App.Services.PaymentServices.updateSingleUserData(
                            { _id: finalSuccessData[fi]._id },
                            {
                                $set: {
                                    customer_Address: findaddr[objId]
                                }
                            });

                    }
                }
            }

            console.log("req.body.statr ===", req.body.start);

            let start;
            if (req.body.start) {
                start = req.body.start
            } else {
                start = 0;
            }
            let query;

            query = { "customer_id": req.session.details.id, is_deleted: "0", status: "success" };

            let addtocartaddress = await Sys.App.Services.PaymentServices.getUserDataSort(query, start);

            // let newFinalData = [];

            // for (let ii = 0; ii < addtocartaddress.length; ii++) {

            //     console.log("addtocartaddress ===>",addtocartaddress[ii].updatedAt);

            //     let newDate = addtocartaddress[ii].updatedAt;

            //     var d = new Date(newDate),
            //         month = '' + (d.getMonth() + 1),
            //         day = '' + d.getDate(),
            //         year = d.getFullYear();

            //     if (month.length < 2)
            //         month = '0' + month;
            //     if (day.length < 2)
            //         day = '0' + day;

            //     let dateorderN = [year, month,day ].join('-');



            //     if (dateorderN <= req.body.statDate &&  dateorderN >= req.body.endDate) {
            //         newFinalData.push(addtocartaddress[ii]);
            //     }


            // }


            // if (req.body.statDate != undefined && req.body.endDate != undefined) {

            //     let data = {
            //         finalSuccessData : newFinalData,
            //     }

            //     return res.send(data);

            // }

            let newFinalData = [];

            for (let ii = 0; ii < addtocartaddress.length; ii++) {

                // console.log("addtocartaddress ===>",addtocartaddress[ii].updatedAt);

                let newDate = addtocartaddress[ii].updatedAt;

                var d = new Date(newDate),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;

                let dateorderN = [year, month, day].join('-');

                console.log("date ====>44>>>,", dateorderN);

                if (dateorderN >= req.body.statDate && dateorderN <= req.body.endDate) {
                    newFinalData.push(addtocartaddress[ii]);
                }


            }

            console.log("newFinalData :::::>>>>", newFinalData);


            if ((req.body.statDate != undefined && req.body.statDate != '') && (req.body.endDate != undefined && req.body.endDate != '')) {

                let data = {
                    finalInvoiceData: invoiceDatafinal,
                    finalSuccessData: newFinalData,
                    totalRecord: newFinalData.length,
                }

                return res.send(data);

            }

            // let addtocartaddress = await Sys.App.Services.PaymentServices.getUserDataSort({ "customer_id": req.session.details.id, is_deleted: "0", status: "success" });


            // console.log(" addtocartaddress =====>>>",addtocartaddress);
            // for (let fi = 0; fi < finalSuccessData.length; fi++) {

            //     addressId.push(finalSuccessData[fi].product_invoice[0].customer_addresId)
            //     if (finalSuccessData[fi].product_invoice[0].customer_addresId) {

            //     }
            //     let addrId = finalSuccessData[fi].product_invoice[0].customer_addresId

            //     let objId = findaddr.findIndex((obj => obj.id == addrId));



            //     let updatepaymentdata = await Sys.App.Services.PaymentServices.updateSingleUserData(
            //         { _id: finalSuccessData[fi]._id },
            //         {
            //             $set: {
            //                 customer_Address: findaddr[objId]
            //             }
            //         });



            // }






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

            console.log("addtocartaddress =======>>", addtocartaddress.length);
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                productData: productData,
                productCategoryData: productCategoryData,
                prjectCategoryData_dup: prjectCategoryData_dup,
                addtocart: addtocart,
                finalSuccessData: addtocartaddress,
                finalInvoiceData: invoiceDatafinal,
                totalRecord: addtocartaddress.length,
            };

            // console.log("hhhhhhhhhdhdhdhdhdhdhdhdh================>>>>>>>>>>>>>>>>>>>>>>", data);

            // console.log(projectData, "homeprojectDatacontroller");
            return res.send(data);

        } catch (e) {
            console.log("Error orders_list", e);
        }
    },


    updateOrder: async function (req, res) {

        console.log("ashdsjdsjh req.body ===>>", req.body);
        try {

            let addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });

            console.log("addtocart =435345===>", addtocart[0]._id);
            let orderType;
            if (req.body.newId == "true") {
                orderType = "Pickup Order"
            } else {
                orderType = "Online";
            }

            if (addtocart) {

                for (let i = 0; i < addtocart.length; i++) {
                    await Sys.App.Services.OrderServices.updateSingleUserData(
                        { _id: addtocart[i]._id }, { pickup_order: req.body.newId, order_type: orderType });

                }



            }

            let updateOrderData = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0", product_status: "pending" });
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                updateOrderData: updateOrderData,
                successData: "success",

            };

            // console.log("addtocartdata --> checkout -->>", user);
            // if(req.body.product_id){
            //     res.send('success');
            // }else{
            return res.send(data);
            // }
            // console.log("ffff");
        } catch (e) {
            console.log("Error checkout", e);
        }
    },

    // payments: async function (req, res) {
    //     res.render("payment", { key: instance.key_id });
    // },

    // payments_order: async function (req, res) {
    //     console.log("payments_order----", req.body);
    //     params = req.body;
    //     instance.orders
    //         .create(params)
    //         .then(async (data) => {
    //             console.log("response payments_order success ===>>", data);
    //             let createdata = await Sys.App.Services.PaymentServices.insertUserData({
    //                 product_id: req.body.product_id,
    //                 customer_id: req.session.details.id,
    //                 amount: req.body.amount,
    //                 currency: req.body.currency,
    //                 receipt: req.body.receipt,
    //                 payment_capture: req.body.payment_capture,
    //                 order_id: data.id,
    //                 entity: data.entity,
    //                 amount: data.amount,
    //                 amount_paid: data.amount_paid,
    //                 amount_due: data.amount_due,
    //                 currency: data.currency,
    //                 receipt: data.receipt,
    //                 offer_id: data.offer_id,
    //                 status: data.status,
    //                 attempts: data.attempts,
    //             });
    //             // console.log("createdata",createdata);
    //             res.send({ sub: data, status: "success" });
    //         })
    //         .catch((error) => {
    //             console.log("response payments_order error ===>>", error);
    //             res.send({ sub: error, status: "failed" });
    //         });
    // },

    // payments_verify: async function (req, res) {
    //     // console.log("payments_verify----",req.params);
    //     console.log("payments_verify----", req.body);
    //     // let mix = req.params.razorpay_order_id + "|" + req.params.razorpay_payment_id;
    //     let mix = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

    //     var expectedSignature = crypto
    //         .createHmac("sha256", instance.key_secret)
    //         .update(mix.toString())
    //         .digest("hex");
    //     // console.log("sig---" , req.params.razorpay_signature);
    //     console.log("sig---", req.body.razorpay_signature);
    //     console.log("sig---", expectedSignature);
    //     var response = { status: "failure" };
    //     if (expectedSignature === req.body.razorpay_signature) {
    //         // if (expectedSignature === req.params.razorpay_signature){
    //         response = { status: "success" };
    //         console.log("response payments_verify ===>>", response);

    //         console.log(response);
    //         // res.send(response);
    //         instance.payments.fetch(req.body.razorpay_payment_id).then(async (paymentDocument) => {
    //             // instance.payments.fetch(req.params.razorpay_payment_id).then(async(paymentDocument)=>{
    //             console.log("paymentDocument.status : ", paymentDocument);
    //             let getdata = await Sys.App.Services.PaymentServices.getSingleUserData({ order_id: paymentDocument.order_id })
    //             let updatedata = await Sys.App.Services.PaymentServices.updateSingleUserData(
    //                 { _id: getdata._id },
    //                 {
    //                     $set: {
    //                         transaction_id: paymentDocument.id,
    //                         entity: paymentDocument.entity,
    //                         amount: paymentDocument.amount,
    //                         payment_details: paymentDocument,
    //                         product_id: req.body.product_id,
    //                         status: 'success'
    //                     }
    //                 });
    //             // return res.redirect('/paymentmsg');
    //             console.log("llllllllllll");
    //             res.send({ status: "success" });
    //         });
    //         // return res.redirect('/paymentmsg');

    //     } else {

    //         let getdata = await Sys.App.Services.PaymentServices.getSingleUserData({ order_id: req.body.razorpay_order_id })

    //         let updatedata = await Sys.App.Services.PaymentServices.updateSingleUserData(
    //             { _id: getdata._id },
    //             {
    //                 $set: {
    //                     status: 'failed'
    //                 }
    //             });
    //         return res.redirect('/paymentfail');

    //         // return res.send({ status: "failure" });


    //     }
    //     // if(response.status == "success"){
    //     //     return res.redirect('/paymentmsg');
    //     // }else{
    //     //     return res.redirect('/paymentfail');
    //     // }
    // },

    // paymentmsg: async function (req, res) {
    //     try {
    //         let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0", product_visibility: "1" });
    //         // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
    //         let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });

    //         let addtocart;
    //         if (req.session.details) {
    //             addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0" });

    //         }

    //         let wishlist = await Sys.App.Services.CustomerServices.getSingleUserData
    //             ({ _id: req.session.details.id });
    //         // console.log("wishlist====", wishlist);
    //         let wishlistdata = [];
    //         for (let i = 0; i < productData.length; i++) {
    //             for (const element of wishlist.wishlist_arr) {
    //                 if (element == productData[i]._id.toString()) {
    //                     wishlistdata.push(productData[i])
    //                 }
    //             }
    //         }
    //         // console.log("wishlist====", wishlistdata);

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
    //             // console.log("new ARRAy=========",subarray,subarray.length);
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

    //                         // console.log("productCategoryData[pr].subproduct===",productCategoryData[pr].subproduct[sr].name);
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

    //                     let output = [];
    //                     let suboutput = [];


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
    //             wishlistdata: wishlistdata,
    //             productData: productData,
    //             productCategoryData: productCategoryData,
    //             prjectCategoryData_dup: prjectCategoryData_dup,
    //             addtocart: addtocart,
    //         };

    //         return res.render('frontend/paymentmsg', data);

    //     } catch (e) {
    //         console.log("Error in gridproducts", e);
    //     }
    // },

    // paymentfail: async function (req, res) {
    //     try {
    //         let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0", product_visibility: "1" });
    //         // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
    //         let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });

    //         let addtocart;
    //         if (req.session.details) {
    //             addtocart = await Sys.App.Services.OrderServices.getUserData({ "customer_id": req.session.details.id, is_deleted: "0" });

    //         }

    //         let wishlist = await Sys.App.Services.CustomerServices.getSingleUserData
    //             ({ _id: req.session.details.id });
    //         // console.log("wishlist====", wishlist);
    //         let wishlistdata = [];
    //         for (let i = 0; i < productData.length; i++) {
    //             for (const element of wishlist.wishlist_arr) {
    //                 if (element == productData[i]._id.toString()) {
    //                     wishlistdata.push(productData[i])
    //                 }
    //             }
    //         }
    //         // console.log("wishlist====", wishlistdata);

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
    //             // console.log("new ARRAy=========",subarray,subarray.length);
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

    //                         // console.log("productCategoryData[pr].subproduct===",productCategoryData[pr].subproduct[sr].name);
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

    //                     let output = [];
    //                     let suboutput = [];


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
    //             wishlistdata: wishlistdata,
    //             productData: productData,
    //             productCategoryData: productCategoryData,
    //             prjectCategoryData_dup: prjectCategoryData_dup,
    //             addtocart: addtocart,
    //         };

    //         return res.render('frontend/paymentfail', data);

    //     } catch (e) {
    //         console.log("Error in gridproducts", e);
    //     }
    // },


    // review_post: async function (req, res) {
    //     try {

    //         console.log("req.body-->wishlist===", req.body);
    //         let rating_num;
    //         let rating_no;
    //         if (req.body.rating) {
    //             if (req.body.rating == "1") { rating_num = "25" }
    //             if (req.body.rating == "2") { rating_num = "15" }
    //             if (req.body.rating == "3") { rating_num = "30" }
    //             if (req.body.rating == "4") { rating_num = "10" }
    //             if (req.body.rating == "5") { rating_num = "18" }

    //             if (req.body.rating == "1") { rating_no = "25" }
    //             if (req.body.rating == "2") { rating_no = "30" }
    //             if (req.body.rating == "3") { rating_no = "90" }
    //             if (req.body.rating == "4") { rating_no = "40" }
    //             if (req.body.rating == "5") { rating_no = "90" }

    //         }
    //         let updatedata = await Sys.App.Services.ReviewServices.insertUserData({
    //             product_id: req.body.product_id,
    //             customer_id: req.session.details.id,
    //             customer_pic: req.session.details.avatar_path,
    //             customer_name: req.session.details.firstname,
    //             comment: req.body.comment,
    //             rating: req.body.rating,
    //             rating_num: rating_num,
    //             rating_no: rating_no,
    //         });
    //         return res.send("success");


    //     } catch (e) {
    //         console.log("Error in gridproducts", e);
    //     }
    // },




}

function calculateTax(amount, tax_per, type) {
    let base_amount = amount,
        with_tax = amount,
        without_tax = amount,
        tax_amount
    if (type == "add") {
        tax_amount = (amount * tax_per) / 100
        with_tax += tax_amount
    } else if (type == "remove") {
        with_tax = amount
        tax_amount = amount - (amount * (100 / (100 + tax_per)))
        without_tax -= tax_amount
    }
    return { 'base_amount': base_amount, "with_tax": parseFloat(with_tax).toFixed(2), "without_tax": without_tax, "tax_per": tax_per, "tax_amount": tax_amount, "type": type }
}
