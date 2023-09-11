var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");
var mongoose = require('mongoose');
const datetime = require('date-and-time');
const axios = require('axios');
const { cursorTo } = require('readline');




module.exports = {


    listOrder: async function (req, res) {
        try {

            if (req.session.details.role == "admin") {

                var data = {
                    App: req.session.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    order: 'active',
                };
                // console.log("Datat", data);
                return res.render('backend/order/adminListOrder', data);

            } else {


                var data = {
                    App: req.session.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    order: 'active',
                };
                // console.log("Datat", data);
                return res.render('backend/order/listOrder', data);

            }

        } catch (e) {
            console.log("Error in OrderController in list", e);
        }
    },

    getOrder: async function (req, res) {

        console.log("get product data session  ====> ", req.session.details.role);
        console.log("getOrder req.body   ====> ", req.params.startDate);


        try {
            let dataFinal = [];
            // let orderdata = await Sys.App.Services.PaymentServices.getByData({"product_info.vendorid":req.session.details.id});

            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search.value;

            let query = { is_deleted: "0", status: "success" };
            if (search != '') {

                // query['order_id'] = {
                //     $regex: search,
                //     $options: 'i'
                // }

                query = {
                    "$or": [
                        { "order_id": { "$regex": search, $options: 'i' } },
                        { "order_type": { "$regex": search, $options: 'i' } },
                        // { "order_status" : { "$regex": search} },
                    ],
                    is_deleted: "0", status: "success"
                }
                // let capital = search;
                // query = { product_name: { $regex: '.*' + search + '.*' }, is_deleted: "0" };
                // query = { productCategoryName: { $regex: '.*' + search + '.*' }, is_deleted: "0" };

            } else {
                if (req.session.details.role == "admin") {
                    query;
                } else {
                    query;
                }
            }


            console.log("query === >>", query);

            let productCount = await Sys.App.Services.PaymentServices.getProductCount(query);
            let data = await Sys.App.Services.PaymentServices.getProductDatatable_sort(query, length, start);
            let orderId = [];




            for (let d = 0; d < data.length; d++) {

                for (let mm = 0; mm < data[d].product_id.length; mm++) {

                    // if (req.session.details.role == "admin") {
                    //     if (data[d].product_id[mm].venodor_id == req.params.vendorId) {
                    //         dataFinal.push(data[d])
                    //     }
                    // }else{
                    //     if (data[d].product_id[mm].venodor_id == req.session.details.id) {
                    //         dataFinal.push(data[d])
                    //     }
                    // }


                    if (data[d].product_id[mm].venodor_id == req.session.details.id) {
                        dataFinal.push(data[d])
                    }

                }

            }




            // console.log("dataFinal   -5665666----->>>   ",dataFinal);
            let unique = [];

            dataFinal.map(x => unique.filter(a => a.order_id == x.order_id).length > 0 ? null : unique.push(x));

            // console.log("unique   ------>>>   ", unique);

            let newFinal = [];

            if (req.params.startDate != undefined && req.params.endDate != undefined) {

                for (const item of unique) {

                    let today = item.updatedAt;
                    let year = today.getFullYear();
                    let mes = today.getMonth() + 1;
                    let month;
                    if (mes.toString().length == 1) {
                        month = "0" + mes
                    } else {
                        month = mes;
                    }
                    let dia = today.getDate();

                    let day;
                    if (dia.toString().length == 1) {
                        day = "0" + dia
                    } else {
                        day = dia
                    }
                    let orderDate = year + "-" + month + "-" + day;

                    console.log("orderDate ===>>", orderDate);

                    console.log("item ===>>", item.updatedAt);
                    if (orderDate >= req.params.startDate && orderDate <= req.params.endDate) {
                        newFinal.push(item);

                    }
                }

            }

            console.log("newFinal  65656  ------>>>   ", newFinal);


            if (req.session.details.role == "admin") {
                var obj = {
                    'draw': req.query.draw,
                    'recordsTotal': productCount,
                    'recordsFiltered': productCount,
                    'data': data,
                };
            } else {

                if (req.params.startDate != undefined && req.params.endDate != undefined) {

                    var obj = {
                        'draw': req.query.draw,
                        'recordsTotal': newFinal.length,
                        'recordsFiltered': newFinal.length,
                        'data': newFinal,
                    };
                } else {
                    var obj = {
                        'draw': req.query.draw,
                        'recordsTotal': unique.length,
                        'recordsFiltered': unique.length,
                        'data': unique,
                    };
                }
            }

            // var obj = {
            //     'draw': req.query.draw,
            //     'recordsTotal': productCount,
            //     'recordsFiltered': productCount,
            //     'data': unique,
            // };

            res.send(obj);
        } catch (e) {
            console.log("Error in ProductController in getProduct", e);
        }
    },

    orderDelete: async function (req, res) {
        try {
            let product = await Sys.App.Services.ProductServices.getProductData({ _id: req.body.id, is_deleted: "0" });
            console.log("================");
            console.log("PRODUCTT", product);
            console.log("}}}}}}}}}}{{{{{{{{{");

            if (product || product.length > 0) {
                await Sys.App.Services.ProductServices.updateProductData(
                    { _id: req.body.id },
                    {
                        is_deleted: "1"
                    }
                )
                return res.send("success");
            } else {
                return res.send("error in ProductController in productDelete");
            }
        } catch (e) {
            console.log("Erro in ProductController in productDelete", e);
        }
    },


    editOrder: async function (req, res) {
        try {
            console.log("req.session ----editorder-->>>>", req.params, req.session.details.role);
            let orderData = await Sys.App.Services.PaymentServices.getProductData({ _id: req.params.id, is_deleted: "0" });
            let get_invoice_data = await Sys.App.Services.InvoiceServices.getSingleUserData({ order_id: orderData.order_id });
            let orderSuccessData = await Sys.App.Services.OrderServices.getUserData({ product_status: "success", order_id: orderData.order_id });
            // let productCategory = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
            if (orderData) {
                for (let o = 0; o < orderData.length; o++) {
                    var dateData = orderData[o].updatedAt;
                    orderData[o].orderdate = datetime.format(dateData, 'YYYY/MM/DD HH:mm:ss');
                    // console.log("orderData[o].orderdate",orderData[o].orderdate);
                }
            }

            let today1 = new Date();

            let year1 = today1.getFullYear();
            let mes1 = today1.getMonth() + 1;
            let month1;
            if (mes1.toString().length == 1) {
                month1 = "0" + mes1
            } else {
                month1 = mes1;
            }
            let dia1 = today1.getDate();
    
            let day1;
            if (dia1.toString().length == 1) {
                day1 = "0" + dia1
            } else {
                day1 = dia1
            }
            let today_date = day1 + "/" + month1 + "/" + year1;

            //    let newId = new ObjectId(orderData.customer_id)
            var newId = mongoose.Types.ObjectId(orderData.customer_id);

            let vendor;
            let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: newId });
            if (req.session.details.role == "admin") {
                vendor = await Sys.App.Services.VendorProfileServices.getVendorData({ _id: req.params.vendorId, is_deleted: '0' });

            } else {
                vendor = await Sys.App.Services.VendorProfileServices.getVendorData({ _id: req.session.details.id, is_deleted: '0' });

            }


            // console.log("ordersdssssssss",orderData);

            // console.log("customerAdd ----->",customerAdd);
            let addId;
            let orderTotal = [];

            let newOrderList = [];
            for (let m = 0; m < orderSuccessData.length; m++) {

                for (const item of orderData.product_id) {

                    if (req.session.details.role == "admin") {
                        console.log("============= admin =============");
                        if (item._id == orderSuccessData[m].product_id && item.venodor_id == req.params.vendorId) {

                            addId = orderSuccessData[m].customer_addresId
                            let disValue = 00;
                            if (item.discount_start == "true" && item.is_discount == "1") {
                                disValue = (item.discount_value) * (orderSuccessData[m].product_quantity);
                            }
                            let subTotal = (item.product_price) * (orderSuccessData[m].product_quantity);
                            let rawTotal = parseFloat(orderSuccessData[m].withTax_amount)
                            orderTotal.push({ total: rawTotal })

                            let question_form = orderSuccessData[m].question_form;
                            newOrderList.push({ id: item._id, order_id: orderData.order_id, product_name: item.product_name, question_form: question_form, product_price: item.product_price, product_quantity: orderSuccessData[m].product_quantity, discount_amount: disValue, tax_amount: orderSuccessData[m].tax_amount, cgst: orderSuccessData[m].cgst, sgst: orderSuccessData[m].sgst, igst: orderSuccessData[m].igst, coupon_amount:orderData.coupon_amount, shipping_charge: orderData.shipping_charge, subTotal: subTotal, rawTotal: rawTotal, total_amt: orderData.amount, is_discount: item.is_discount, discount_start: item.discount_start, discount_price: item.discount_price  })
                        }
                    } else {

                        if (item._id == orderSuccessData[m].product_id && item.venodor_id == req.session.details.id) {

                            addId = orderSuccessData[m].customer_addresId
                            let disValue = 00;
                            if (item.discount_start == "true" && item.is_discount == "1") {
                                disValue = (item.discount_value) * (orderSuccessData[m].product_quantity);
                            }
                            let subTotal = (item.product_price) * (orderSuccessData[m].product_quantity);
                            let rawTotal = parseFloat(orderSuccessData[m].withTax_amount)
                            orderTotal.push({ total: rawTotal })

                            let question_form = orderSuccessData[m].question_form;
                            newOrderList.push({ id: item._id, order_id: orderData.order_id, product_name: item.product_name, question_form: question_form, product_price: item.product_price, product_quantity: orderSuccessData[m].product_quantity, discount_amount: disValue, tax_amount: orderSuccessData[m].tax_amount, cgst: orderSuccessData[m].cgst, sgst: orderSuccessData[m].sgst, igst: orderSuccessData[m].igst, coupon_amount:orderData.coupon_amount, shipping_charge: orderData.shipping_charge, subTotal: subTotal, rawTotal: rawTotal, total_amt: orderData.amount, is_discount: item.is_discount, discount_start: item.discount_start, discount_price: item.discount_price  })
                        }
                    }

                }
            }
            var priceFinal = 0;
            if (orderTotal.length > 0) {
                priceFinal = orderTotal.map(el => el.total).reduce((a, b) => a + b);
            }



            let customerAdd = [];

            for (let ad = 0; ad < user.address_arr.length; ad++) {

                // console.log("user.address_arr[ad]",user.address_arr[ad]);

                if (user.address_arr[ad].id == addId) {
                    customerAdd.push(user.address_arr[ad])
                }


            }

            // console.log("orderSuccessData[m].newOrderList --->", vendor);

            // let today = orderData.updatedAt;
            // let year = today.getFullYear();
            // let mes = today.getMonth() + 1;
            // let dia = today.getDate();
            // let orderDate = dia + "-" + mes + "-" + year;


            let today = orderData.updatedAt;

            let year = today.getFullYear();
            let mes = today.getMonth() + 1;
            let month;
            if (mes.toString().length == 1) {
                month = "0" + mes
            } else {
                month = mes;
            }
            let dia = today.getDate();

            let day;
            if (dia.toString().length == 1) {
                day = "0" + dia
            } else {
                day = dia
            }
            let orderDate = day + "-" + month + "-" + year;



            // console.log("orderdate =====>>> ", orderData);
            console.log("newOrderList",newOrderList);

            //shiprocket start
            // if(!orderData.shiprocket_order_label){
            // var token;
            // var token_arr = [];
            // //step 1: Genrate Token
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
            //         console.log("req.session.shiprocket_token.............", req.session.shiprocket_token);
            //         token = response.data.token;
            //         token_arr.push(response.data.token)
            //     }).catch(function (error) {
            //         console.error(error);
            //     });
            // }, 500);

            //  //step 7 Generate Label
            // setTimeout(async() => {
            //     var data = JSON.stringify({
            //         "shipment_id": [parseInt(orderData.shiprocket_shipmentId)],
            //         // "courier_id": "54"
            //         });

            //         var config = {
            //         method: 'post',
            //         url: 'https://apiv2.shiprocket.in/v1/external/courier/generate/label',
            //         headers: { 
            //             'Authorization': `Bearer ${req.session.shiprocket_token}`,
            //             'Content-Type': 'application/json'
            //         },
            //         data : data
            //         };

            //         axios(config)
            //         .then(async function (response) {
            //         console.log("Generate Label",JSON.stringify(response.data));
            //         await Sys.App.Services.PaymentServices.updateSingleUserData(
            //             { _id: orderData._id },
            //             {
            //                 $set: {
            //                     shiprocket_order_label: response.data.label_url
            //                 }
            //             });
            //         await Sys.App.Services.InvoiceServices.updateSingleUserData(
            //             { _id: get_invoice_data._id },
            //             {
            //                 $set: {
            //                     shiprocket_order_label: response.data.label_url
            //                 }
            //             });
            //         })
            //         .catch(function (error) {
            //         console.log("Generate Label erererrrr",error);
            //         });
            // }, 2000);

            // //step 9 Track order
            // setTimeout(async() => {
            // let awb_code_res = orderData.shiprocket_awb_code;

            // // awb_code_res = awb_code_res.slice(4);
            // console.log("awb code :: ",awb_code_res);
            //     // awb_code_res = par
            //     // var data = JSON.stringify({
            //     //     "ids": [parseInt(order_id_res)]
            //     //     // "courier_id": "54"
            //     //     });

            //         var config = {
            //         method: 'get',
            //         url: 'https://apiv2.shiprocket.in/v1/external/courier/track/awb/'+awb_code_res,
            //         headers: { 
            //             'Authorization': `Bearer ${req.session.shiprocket_token}`, 
            //             'Content-Type': 'application/json'
            //         },
            //         // data : data
            //         };

            //         axios(config)
            //         .then(async function (response) {
            //         console.log("Track order",JSON.stringify(response.data));
            //         let track_order_arr = [];
            //         track_order_arr.push({id:orderData.order_id,shipment_status:response.data.tracking_data.shipment_status});
            //         console.log("track_order_arr",track_order_arr);
            //         track_order_data = [].concat.apply([], track_order_arr);
            //         await Sys.App.Services.PaymentServices.updateSingleUserData(
            //             { _id: orderData._id },
            //             {
            //                 $set: {
            //                     track_order_data: track_order_arr 
            //                 }
            //             });

            //         })
            //         .catch(function (error) {
            //         console.log("track_order error",error);
            //         });
            // }, 2500);
            // }
            //shiprocket end
            // console.log("orderData============================",orderData);
            // setTimeout(async() => {
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                order: 'active',
                ordertData: orderData,
                orderDate: orderDate,
                newOrderList: newOrderList,
                priceFinal: priceFinal,
                vendor: vendor,
                customerAdd: customerAdd[0],
                user: user,
                today_date: today_date,
            };

            // console.log("productData test 88888  orderSuccessData ====>>>",order_id,customer_id,_id, orderSuccessData);
            // console.log("orderData.customer_id -- ", newId);
            // console.log("orderSuccessData -- >", user);


            // console.log("productData test 333333333333  orderData ====>>>", orderData.product_id);

            return res.render('backend/order/addOrder', data);
        // }, 3000);
        } catch (e) {
            console.log("Error in ProductController in editProduct", e);
        }

    },

    orderStatus: async function (req, res) {
        // console.log(" orderStatus Data ====", req.body);
        try {

            let paymentData = await Sys.App.Services.PaymentServices.updateManyUserData({ order_id: req.body.order_id, payment_status: "Success" },
                {
                    order_status: req.body.select,
                });



            // let orderData = await Sys.App.Services.OrderServices.getSingleUserData({ order_id: req.body.order_id, payment_status: "success" });

            let updatedata = await Sys.App.Services.OrderServices.updateSingleUserData({ order_id: req.body.order_id, payment_status: "success" },
                {
                    order_status: req.body.select,
                });
            // console.log("updatedata 34555555555555555 ====>>>", paymentData);


            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                order: 'active',
                // orderData: orderData,

            };



            return res.send(data);
        } catch (e) {
            console.log("Error in ProductController in editProduct", e);
        }

    },

    question_Form: async function (req, res) {
        console.log("reeerrf 546456 question_Form ====", req.params);
        try {

            let orderData = await Sys.App.Services.OrderServices.getSingleUserData({ order_id: req.params.orderId, product_id: req.params.id, product_status: "success" });
            console.log("orderData ====>>>", orderData);


            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                order: 'active',
                orderData: orderData,

            };



            return res.render('backend/order/question_form', data);
        } catch (e) {
            console.log("Error in ProductController in editProduct", e);
        }

    },




    getAdminOrder: async function (req, res) {

        console.log("get product data session  ====> ", req.session.details.role);

        try {
            // let orderArr = [];

            // console.log("vendor lenth == > ",vendorData);

            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            var search = req.query.search.value;



            let query = { "is_deleted": "0" };
            if (search != '') {

                query['vendor_company'] = {
                    $regex: search,
                    $options: 'i'
                };
                // let capital = search;
                // query = { vendor_company: { $regex: search ,$options: 'i'}, is_deleted: "0" };
                // query = { productCategoryName: { $regex: '.*' + search + '.*' }, is_deleted: "0" };

            } else {
                if (req.session.details.role == "admin") {
                    query;
                } else {
                    query;
                }
            }
            console.log("search  ===== >>>", query);

            let vendorData = await Sys.App.Services.VendorProfileServices.getByData(query);

            console.log("vendorData 4544  ===== >>>", vendorData.length);


            let orderData = await Sys.App.Services.OrderServices.getUserData({ is_deleted: "0", product_status: "success" });

            let productCount = await Sys.App.Services.PaymentServices.getProductCount(query);
            let data = await Sys.App.Services.PaymentServices.getProductDatatable(query, length, start);
            let dataFinal = [];

            for (let d = 0; d < data.length; d++) {

                for (let mm = 0; mm < data[d].product_id.length; mm++) {


                    if (data[d].product_id[mm].venodor_id == req.session.details.id) {
                        dataFinal.push(data[d])
                    }

                }

            }

            let vendorDAta = [];
            for (let v = 0; v < orderData.length; v++) {
                vendorDAta.push({ id: orderData[v].vendorId })

            }


            let vendorUnique = [];

            vendorDAta.map(x => vendorUnique.filter(a => a.id == x.id).length > 0 ? null : vendorUnique.push(x));

            // console.log("vendorUnique   ------>>>   ", vendorUnique);

            let vendor_Name = [];
            for (let vi = 0; vi < vendorData.length; vi++) {

                for (const item of vendorUnique) {

                    if (vendorData[vi]._id == item.id) {

                        vendor_Name.push({ name: vendorData[vi].vendor_company, id: vendorData[vi]._id })

                    }
                }


            }


            console.log("vendor_Name   vendor_Name------>>>   ", vendor_Name);
            let unique = [];

            dataFinal.map(x => unique.filter(a => a.order_id == x.order_id).length > 0 ? null : unique.push(x));


            let count = vendor_Name.length
            console.log("unique   ------>>>   ", count);




            // if (req.session.details.role == "admin") {
            //     var obj = {
            //         'draw': req.query.draw,
            //         'recordsTotal': productCount,
            //         'recordsFiltered': productCount,
            //         'data': data,
            //     };
            // } else {
            //     var obj = {
            //         'draw': req.query.draw,
            //         'recordsTotal': productCount,
            //         'recordsFiltered': productCount,
            //         'data': unique,
            //     };
            // }

            var obj = {
                'draw': req.query.draw,
                'recordsTotal': count,
                'recordsFiltered': count,
                'data': vendor_Name,
            };

            res.send(obj);
        } catch (e) {
            console.log("Error in ProductController in getProduct", e);
        }
    },

    getAdmindataOrder: async function (req, res) {

        console.log("get product data session  ====> ", req.params.id);
        console.log("get product data session  ====> ", req.session.details.role);

        try {
            let dataFinal = [];

            // let orderdata = await Sys.App.Services.PaymentServices.getByData({"product_info.vendorid":req.session.details.id});

            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search.value;

            let query = {};
            if (search != '') {
                let capital = search;
                query = { product_name: { $regex: '.*' + search + '.*' }, is_deleted: "0" };
                // query = { productCategoryName: { $regex: '.*' + search + '.*' }, is_deleted: "0" };

            } else {
                if (req.session.details.role == "admin") {
                    query = { is_deleted: "0", status: "success" };
                } else {
                    query = { is_deleted: "0", status: "success" };
                }
            }

            let productCount = await Sys.App.Services.PaymentServices.getProductCount(query);
            let data = await Sys.App.Services.PaymentServices.getProductDatatable(query, length, start);
            let orderId = [];

            for (let d = 0; d < data.length; d++) {

                for (let mm = 0; mm < data[d].product_id.length; mm++) {


                    if (data[d].product_id[mm].venodor_id == req.params.id) {
                        dataFinal.push(data[d])
                    }

                }

            }




            // console.log("dataFinal   ------>>>   ",dataFinal[0]);
            let unique = [];

            dataFinal.map(x => unique.filter(a => a.order_id == x.order_id).length > 0 ? null : unique.push(x));

            // console.log("unique   ------>>>   ", unique);

            let finalDAta = []

            for (let or = 0; or < unique.length; or++) {
                let orderDataId = await Sys.App.Services.OrderServices.getSingleUserData({ order_id: unique[or].order_id, is_deleted: "0", status: "success" });

                finalDAta.push({ vendor_id: orderDataId.vendorId, data: unique[or] });

            }

            console.log("finalDAta 5454456456   ------>>>   ", finalDAta);




            if (req.session.details.role == "admin") {
                var obj = {
                    'draw': req.query.draw,
                    'recordsTotal': productCount,
                    'recordsFiltered': productCount,
                    'data': finalDAta,
                };
            } else {
                var obj = {
                    'draw': req.query.draw,
                    'recordsTotal': productCount,
                    'recordsFiltered': productCount,
                    'data': unique,
                };
            }

            // var obj = {
            //     'draw': req.query.draw,
            //     'recordsTotal': productCount,
            //     'recordsFiltered': productCount,
            //     'data': unique,
            // };

            res.send(obj);
        } catch (e) {
            console.log("Error in ProductController in getProduct", e);
        }
    },

    // getAdminOrderDetails: async function (req, res) {
    //     try {

    //         var data = {
    //             App: req.session.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             order: 'active',
    //         };
    //         // console.log("Datat", data);
    //         return res.render('backend/order/vendorOrder', data);



    //     } catch (e) {
    //         console.log("Error in OrderController in list", e);
    //     }
    // },

    getAdminOrderDetails: async function (req, res) {
        try {
            console.log("req.session ----editorder-->>>>", req.params.id, req.session.details.role);
            let orderDataId = await Sys.App.Services.OrderServices.getUserData({ vendorId: req.params.id, is_deleted: "0", product_status: "success" });

            console.log("order data --- >>>", orderDataId);


            let orderId = [];

            for (let i = 0; i < orderDataId.length; i++) {

                orderId.push({ order_id: orderDataId[i].order_id })
            }

            let unique = [];

            orderId.map(x => unique.filter(a => a.order_id == x.order_id).length > 0 ? null : unique.push(x));


            let count = unique.length
            console.log("unique   ------>>>   ", unique);

            // var obj = {
            //     'draw': req.query.draw,
            //     'recordsTotal': count,
            //     'recordsFiltered': count,
            //     'data': unique,
            // };


            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                order: 'active',
                unique: unique,
            };

            // console.log("productData test 88888  orderSuccessData ====>>>",order_id,customer_id,_id, orderSuccessData);
            // console.log("orderData.customer_id -- ", newId);
            // console.log("orderSuccessData -- >", user);


            // console.log("productData test 333333333333  orderData ====>>>", orderData.product_id);

            // res.send(obj);
            return res.render('backend/order/vendorOrder', data);




        } catch (e) {
            console.log("Error in ProductController in editProduct", e);
        }

    },



    adminOrderDetails: async function (req, res) {
        try {
            console.log("req.session ----editorder-->>>>", req.params.id, req.session.details.role);
            let orderDataId = await Sys.App.Services.OrderServices.getUserData({ vendorId: req.params.id, is_deleted: "0", product_status: "success" });

            console.log("order data  adminOrderDetails--- >>>", orderDataId);


            let orderId = [];

            for (let i = 0; i < orderDataId.length; i++) {

                orderId.push({ order_id: orderDataId[i].order_id, Id: orderDataId[i].vendorId })
            }
            console.log("orderId data  adminOrderDetails--- >>>", orderId);

            let unique = [];

            orderId.map(x => unique.filter(a => a.order_id == x.order_id).length > 0 ? null : unique.push(x));


            let count = unique.length
            console.log("unique  adminOrderDetails ------>>>   ", unique);

            // var obj = {
            //     'draw': req.query.draw,
            //     'recordsTotal': count,
            //     'recordsFiltered': count,
            //     'data': unique,
            // };


            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                order: 'active',
                unique: unique,
                vendorId: req.params.id
            };

            // console.log("productData test 88888  orderSuccessData ====>>>",order_id,customer_id,_id, orderSuccessData);
            // console.log("orderData.customer_id -- ", newId);
            // console.log("orderSuccessData -- >", user);


            // console.log("productData test 333333333333  orderData ====>>>", orderData.product_id);

            // res.send(obj);
            return res.render('backend/order/vendorOrder', data);




        } catch (e) {
            console.log("Error in ProductController in editProduct", e);
        }

    },

    genrate_e_invoice : async function (req, res) {
    try {
        console.log("req.params",req.params.id);
        let invoiceId = req.params.id;
        var newId = mongoose.Types.ObjectId(req.params.id);

        let get_order_data = await Sys.App.Services.PaymentServices.getProductData({ _id: newId, is_deleted: "0" });
        
        // console.log("get_order_data",get_order_data);
        let get_invoice_data = await Sys.App.Services.InvoiceServices.getSingleUserData({ order_id: get_order_data.order_id });
        // console.log("get_invoice_data",get_invoice_data);
        let setToken = '';
        let datasend = await createEInvoiceHelper(req, setToken, get_order_data, get_invoice_data);
        let getEInvoiceData;
         
        // console.log("eInvoiceResult",eInvoiceResult);
        // return false;
      
        if (datasend.eInvoiceResult.Status == '0' && datasend.eInvoiceResult.ErrorDetails.length) {

            let errorDetails = datasend.eInvoiceResult.ErrorDetails;
            await Sys.App.Services.PaymentServices.updateSingleUserData(
                { _id: get_order_data._id },
                {
                    $set: {
                        e_invoice_error: errorDetails,
                        e_invoice_success: [],
                        e_invoice_flag: "false",
                        qrCodeImage: ''
                    }
                });
            await Sys.App.Services.InvoiceServices.updateSingleUserData(
                { _id: get_invoice_data._id },
                {
                    $set: {
                        e_invoice_error: errorDetails,
                        e_invoice_success: [],
                        e_invoice_flag: "true",
                        qrCodeImage: ''
                    }
                });
                req.flash('error', errorDetails[0].ErrorMessage);
            console.log("/backend/orderDetails/${newId}",`/backend/orderDetails/${newId}`);

                return res.redirect(`/backend/orderDetails/${newId}`);
            // failedMessage.message = ErrorDetails[0].ErrorMessage;
            // return res.send(failedMessage);
        }

        var getEinvoiceResult = datasend.eInvoiceResult.Data;
        getEinvoiceResult = JSON.parse(getEinvoiceResult)

        // console.log("eInvoiceResult",getEinvoiceResult);
        // console.log("eInvoiceResult",getEinvoiceResult.QrCodeImage);

        let base64Code = getEinvoiceResult.QrCodeImage;

        // console.log("base64Code",base64Code);
        let qrCodeLink = ''
        if (base64Code) {
            let getMime = await detectMimeType(base64Code);
                console.log("getMime",getMime);
            let splitMime = getMime.split('/');
            let extension = splitMime[1];

            let buffer = Buffer.from(base64Code, "base64");
            let fileName = create_Id()

            let path = '/eInvoiceImages/';
            let folderPath = 'public/eInvoiceImages/';

            fs.writeFileSync(`${folderPath}${fileName}.${extension}`, buffer);

            qrCodeLink = `${path}${fileName}.${extension}`;
        console.log("qrCodeImage>>>>>>>>..",qrCodeLink);

        }
        // console.log("qrCodeImage",qrCodeLink);
        await Sys.App.Services.PaymentServices.updateSingleUserData(
            { _id: get_order_data._id },
            {
                $set: {
                    e_invoice_error: [],
                    e_invoice_success: getEinvoiceResult,
                    e_invoice_flag: "true",
                    qrCodeImage: qrCodeLink,
                    'irn': getEinvoiceResult ? getEinvoiceResult.Irn : '',
                    'ackNo': getEinvoiceResult ? getEinvoiceResult.AckNo : '',
                    e_invoiceRequestDetail: datasend.getEInvoiceRequestData
                }
            });
        await Sys.App.Services.InvoiceServices.updateSingleUserData(
            { _id: get_invoice_data._id },
            {
                $set: {
                    e_invoice_error: [],
                    e_invoice_success: getEinvoiceResult,
                    e_invoice_flag: "true",
                    qrCodeImage: qrCodeLink,
                    'irn': getEinvoiceResult ? getEinvoiceResult.Irn : '',
                    'ackNo': getEinvoiceResult ? getEinvoiceResult.AckNo : '',
                    e_invoiceRequestDetail: datasend.getEInvoiceRequestData
                }
            });
            console.log("E-Invoice Genrate successfully");
            // console.log("/backend/orderDetails/${newId}",`/backend/orderDetails/${newId}`);
            // console.log("/backend/orderDetails/${newId}",'/backend/orderDetails/'+{newId});
            req.flash('success', 'E-Invoice Genrate successfully');
            return res.redirect(`/backend/orderDetails/${newId}`);


        } catch (e) {
            console.log("Error in ProductController in editProduct", e);
        }
    },

    genrate_e_way_bill : async function (req, res) {
        try {
            console.log("req.params",req.params.id);
            let invoiceId = req.params.id;
            var newId = mongoose.Types.ObjectId(req.params.id);
    
            let get_order_data = await Sys.App.Services.PaymentServices.getProductData({ _id: newId, is_deleted: "0" });
            // console.log("get_order_data",get_order_data);
            let get_invoice_data = await Sys.App.Services.InvoiceServices.getSingleUserData({ order_id: get_order_data.order_id });
            // console.log("get_invoice_data",get_invoice_data);
            let setToken = '';
            let eWayBillObj;
            let datasend = await createE_Way_Bill_Helper(req, setToken, get_order_data, get_invoice_data);
            
            // console.log("eWayBillResponseResult",eWayBillResponseResult);
            let ewayBillDetail = {
                'TransId': datasend.eWayBillResponseResult ? datasend.eWayBillResponseResult.transporterId : '' ,
                'TransName': datasend.eWayBillResponseResult ? datasend.eWayBillResponseResult.transporterName : '',
                'TransMode': datasend.eWayBillResponseResult ? datasend.eWayBillResponseResult.transMode : '',
                'Distance': datasend.eWayBillResponseResult ? datasend.eWayBillResponseResult.transDistance : '',
                'TransDocNo': datasend.eWayBillResponseResult ? datasend.eWayBillResponseResult.transDocNo : '',
                'TransDocDt': datasend.eWayBillResponseResult ? datasend.eWayBillResponseResult.transDocDate : '',
                'VehNo': datasend.eWayBillResponseResult ? datasend.eWayBillResponseResult.vehicleNo : '',
                'VehType': datasend.eWayBillResponseResult ? datasend.eWayBillResponseResult.vehicleType : ''
            };
            let getEwayBillData = datasend.eWayBillResponseResult ? datasend.eWayBillResponseResult : {};

            getEwayBillData = getEwayBillData //? JSON.parse(getEwayBillData) : {};
            // successMessage.data = getEwayBillData;
            eWayBillObj = JSON.parse(datasend.eWayBillObj)

            // console.log("===============================");
            let createObj = {
                'EwbNo': getEwayBillData ? getEwayBillData.ewayBillNo : '',
                'EwbDate': getEwayBillData ? getEwayBillData.ewayBillDate : '',
                'EwbValidTill': getEwayBillData ? getEwayBillData.validUpto : '',
                'EwbDetails': ewayBillDetail,
                'eWayBillDetail' : eWayBillObj
            }

            await Sys.App.Services.PaymentServices.updateSingleUserData(
                { _id: get_order_data._id },
                {
                    $set: {
                        'ewbNo': getEwayBillData ? getEwayBillData.ewayBillNo : '',
                        'ewbDate': getEwayBillData ? getEwayBillData.ewayBillDate : '',
                        'ewbValidTill': getEwayBillData ? getEwayBillData.validUpto : '',
                        'ewbDetails': ewayBillDetail,
                        'eWayBillRequestDetail' : eWayBillObj,
                        'e_way_bill_flag': "true"
                    }
                });
            await Sys.App.Services.InvoiceServices.updateSingleUserData(
                { _id: get_invoice_data._id },
                {
                    $set: {
                        'ewbNo': getEwayBillData ? getEwayBillData.ewayBillNo : '',
                        'ewbDate': getEwayBillData ? getEwayBillData.ewayBillDate : '',
                        'ewbValidTill': getEwayBillData ? getEwayBillData.validUpto : '',
                        'ewbDetails': ewayBillDetail,
                        'eWayBillRequestDetail' : eWayBillObj,
                        'e_way_bill_flag': "true"
                    }
                });
                console.log("E-Way-Bill Genrate successfully");
                // console.log("/backend/orderDetails/${newId}",`/backend/orderDetails/${newId}`);
                // console.log("/backend/orderDetails/${newId}",'/backend/orderDetails/'+{newId});
                req.flash('success', 'E-Way-Bill Genrate successfully');
                return res.redirect(`/backend/orderDetails/${newId}`);
    
    
            } catch (e) {
                console.log("Error in ProductController in editProduct", e);
            }
    },




}

async function createEInvoiceHelper (req, AuthToken, get_order_data, get_invoice_data) {

    try {
        // console.log("config ", config)
        let order_data = get_order_data;
        var vvId = mongoose.Types.ObjectId(get_invoice_data.vendor_id);
        var ccId = mongoose.Types.ObjectId(get_order_data.customer_id);

        let vendor = await Sys.App.Services.VendorProfileServices.getVendorData({
            _id: vvId
        });
       let customer = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: ccId });

        // console.log("vendor",vendor);
        // console.log("customer", customer);
        var length = 6,
         charset = "012345678901234567890123459876543210678901234567890123456789",
         otp = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            otp += charset.charAt(Math.floor(Math.random() * n));
        }
        console.log("otppp",otp,"DOC/"+otp);
        otp = "DOC/"+otp.toString();
        let customer_Address;
        // console.log("get_order_data",get_order_data);
        if(get_order_data.customer_Address.length > 0){
            for (let a = 0; a < get_order_data.customer_Address.length; a++) {
                if(get_order_data.customer_Address[a].is_default == "0"){
                    customer_Address = get_order_data.customer_Address[a];
                }
                
            }
        }else{
            for (let a = 0; a < customer.address_arr.length; a++) {
                if(customer.address_arr[a].is_default == "0"){
                    customer_Address = customer.address_arr[a];
                }
                
            }
        }
        // console.log("customer_Address",customer_Address);
        var order_items = [];
        let assVal=[], cgstVal=[], sgstVal=[], igstVal=[],totalVal=[];
        if(get_order_data){
            if(get_order_data.product_id){
                let product_id = get_order_data.product_invoice;
                console.log("product_id",product_id);
                for (let pr = 0; pr < product_id.length; pr++) {   
                    var product = await Sys.App.Services.ProductServices.getProductData({ is_deleted: "0", product_visibility: "1" });
                    let slno = 1 + pr;  
                console.log("product++",product);

                    assVal.push(parseInt(parseInt(product_id[pr].base_amount) * parseInt(product_id[pr].product_quantity)))         
                    cgstVal.push(parseInt(product_id[pr].cgst))          
                    sgstVal.push(parseInt(product_id[pr].sgst))          
                    igstVal.push(parseInt(product_id[pr].igst))  
                    totalVal.push(parseInt(product_id[pr].withTax_amount)) 

                    order_items.push({
                 
                        "SlNo": slno.toString(),//"1",
                        "PrdDesc": product.product_name, //"Rice",
                        "IsServc": "N",
                        "HsnCd": product.hsn_code, //"1001",
                        "Qty": parseInt(product_id[pr].product_quantity), //20,
                        "FreeQty": 0, //10,
                        "Unit": "PCS",//BAG
                        "UnitPrice": parseInt(product_id[pr].base_amount), //5
                        "TotAmt": parseInt(product_id[pr].base_amount) * parseInt(product_id[pr].product_quantity), //100,
                        "Discount": 0,
                        "PreTaxVal": null,
                        "AssAmt": parseInt(product_id[pr].base_amount) * parseInt(product_id[pr].product_quantity), //100,
                        "GstRt": parseInt(product_id[pr].tax_percentage), //0,
                        "IgstAmt": parseInt(product_id[pr].igst), //0,
                        "CgstAmt": parseInt(product_id[pr].cgst), //0,
                        "SgstAmt": parseInt(product_id[pr].sgst), //0,
                        "CesRt": 0,
                        "CesAmt": 0,
                        "CesNonAdvlAmt": 0,
                        "StateCesRt": 0,
                        "StateCesAmt": 0,
                        "StateCesNonAdvlAmt": 0,
                        "OthChrg": 0,
                        "TotItemVal": parseInt(product_id[pr].withTax_amount), //100,
                        "OrgCntry": null
                    });
                }
            }
        }
        console.log("assVal=[], cgstVal=[], sgstVal=[], igstVal=[],totalVal=[]",assVal, cgstVal, sgstVal, igstVal,totalVal);
        console.log("order_items",order_items);

        let today = new Date();

        let year = today.getFullYear();
        let mes = today.getMonth() + 1;
        let month;
        if (mes.toString().length == 1) {
            month = "0" + mes
        } else {
            month = mes;
        }
        let dia = today.getDate();

        let day;
        if (dia.toString().length == 1) {
            day = "0" + dia
        } else {
            day = dia
        }
        let today_date = day + "/" + month + "/" + year;
        console.log("today_date :: ",today_date);
        console.log("today_date :: ",typeof(today_date));

        let getEInvoiceData; //= req.body.invoiceObj ? JSON.parse(req.body.invoiceObj) : {};
        getEInvoiceData = {
            "Version": "1.1",
            "TranDtls": {
                "TaxSch": "GST",
                "SupTyp": "B2B",
                "RegRev": "N",
                "EcmGstin": null, //vendor.vendor_gst_no
                "IgstOnIntra": "N"
            },
            "DocDtls": {
                "Typ": "INV",
                "No": otp,
                "Dt":  today_date  //"19/12/2022"
            },
            "SellerDtls": {
                "Gstin": vendor.vendor_gst_no, //"34AACCC1596Q002",
                "LglNm": vendor.vendor_company, //"NIC company pvt ltd",
                "TrdNm": vendor.vendor_company, //"NIC Industries",
                "Addr1": vendor.vendor_flatNo, //"5th block, kuvempu layout",
                "Addr2": vendor.vendor_Landmark + vendor.vendor_area, //"kuvempu layout",
                "Loc": vendor.vendor_town, //"GANDHINAGAR",
                "Pin": parseInt(vendor.vendor_pin), //605001,
                "Stcd": vendor.vendor_Gstcode, //"34",
                "Ph": vendor.vendor_phone, //"9000000000",
                "Em": vendor.vendor_email, //"abc@gmail.com"
            },
            "BuyerDtls": {
                "Gstin": '24AAFFG8339R1ZQ',//customer.user_gst_no, //"URP",
                "LglNm": customer.user_gst_companyName, //"XYZ company pvt ltd",
                "TrdNm": customer.user_gst_companyName, //"XYZ Industries",
                "Pos": customer_Address.state_code,//"96", //
                "Addr1": customer_Address.addresstext_no, //"7th block, kuvempu layout",
                "Addr2": customer_Address.landmark + customer_Address.addresstext_name, //"kuvempu layout",
                "Loc": customer_Address.city, //"GANDHINAGAR",
                "Pin": parseInt(customer_Address.pincode), //999999,
                "Stcd": customer_Address.state_code,
                "Ph": customer.mobile, //"91111111111",
                "Em": customer.email, //"xyz@yahoo.com"
            },
            "DispDtls": {
                "Nm": vendor.vendor_company, //"ABC company pvt ltd",
                "Addr1": vendor.vendor_flatNo, //"7th block, kuvempu layout",
                "Addr2": vendor.vendor_Landmark + vendor.vendor_area, //"kuvempu layout",
                "Loc": vendor.vendor_town, //"Banagalore",
                "Pin": parseInt(vendor.vendor_pin), //562160,
                "Stcd": vendor.vendor_Gstcode, //"29"
            },
            "ShipDtls": {
                "Gstin": '24AAFFG8339R1ZQ',//customer.user_gst_no, //"URP"
                "LglNm": customer.user_gst_companyName, //"CBE company pvt ltd",
                "TrdNm": customer.user_gst_companyName, //"kuvempu layout",
                "Addr1": customer_Address.addresstext_no, //"7th block, kuvempu layout",
                "Addr2": customer_Address.landmark + customer_Address.addresstext_name, //"kuvempu layout",
                "Loc": customer_Address.city, //"Banagalore",
                "Pin": parseInt(customer_Address.pincode), //999999,
                "Stcd": customer_Address.state_code
            },
            "ItemList": order_items, /*[
                {
                "SlNo": "1",
                "PrdDesc": "Rice",
                "IsServc": "N",
                "HsnCd": "1001",
                "Qty": 20,
                "FreeQty": 10,
                "Unit": "BAG",
                "UnitPrice": 5,
                "TotAmt": 100,
                "Discount": 0,
                "PreTaxVal": null,
                "AssAmt": 100,
                "GstRt": 0,
                "IgstAmt": 0,
                "CgstAmt": 0,
                "SgstAmt": 0,
                "CesRt": 0,
                "CesAmt": 0,
                "CesNonAdvlAmt": 0,
                "StateCesRt": 0,
                "StateCesAmt": 0,
                "StateCesNonAdvlAmt": 0,
                "OthChrg": 0,
                "TotItemVal": 100,
                "OrgCntry": null
                },
                {
                "SlNo": "2",
                "PrdDesc": "Rice",
                "IsServc": "N",
                "HsnCd": "1001",
                "Qty": 50,
                "FreeQty": 10,
                "Unit": "BAG",
                "UnitPrice": 5,
                "TotAmt": 250,
                "Discount": 0,
                "PreTaxVal": null,
                "AssAmt": 250,
                "GstRt": 0,
                "IgstAmt": 0,
                "CgstAmt": 0,
                "SgstAmt": 0,
                "CesRt": 0,
                "CesAmt": 0,
                "CesNonAdvlAmt": 0,
                "StateCesRt": 0,
                "StateCesAmt": 0,
                "StateCesNonAdvlAmt": 0,
                "OthChrg": 0,
                "TotItemVal": 250,
                "OrgCntry": null
                }
            ],*/
            "ValDtls": {
                "AssVal": assVal.reduce((a, b) => a + b, 0), //350,
                "CgstVal": cgstVal.reduce((a, b) => a + b, 0), //0,
                "SgstVal": sgstVal.reduce((a, b) => a + b, 0), //0,
                "IgstVal": igstVal.reduce((a, b) => a + b, 0), //0,
                "CesVal": 0,
                "StCesVal": 0,
                "Discount": 0,
                "OthChrg": 0,
                "RndOffAmt": 0,
                "TotInvVal": totalVal.reduce((a, b) => a + b, 0),// 350,
                "TotInvValFc": parseFloat(totalVal.reduce((a, b) => a + b, 0)), //350
            },
            "RefDtls": {
                "InvRm": "TEST",
                "DocPerdDtls": {
                "InvStDt": "01/08/2020",
                "InvEndDt": "01/09/2020"
                },
                "PrecDocDtls": [
                {
                    "InvNo": "DOC/002",
                    "InvDt": "01/08/2020",
                    "OthRefNo": "123456"
                }
                ],
                "ContrDtls": [
                {
                    "RecAdvRefr": "Doc/003",
                    "RecAdvDt": "01/08/2020",
                    "Tendrefr": "Abc001",
                    "Contrrefr": "Co123",
                    "Extrefr": "Yo456",
                    "Projrefr": "Doc-456",
                    "Porefr": "Doc-789",
                    "PoRefDt": "01/08/2020"
                }
                ]
            },
            "AddlDocDtls": [
                {
                "Url": "https://einv-apisandbox.nic.in",
                "Docs": "Test Doc",
                "Info": "Document Test"
                }
            ],
            "ExpDtls": {
                "ShipBNo": "A-248",
                "ShipBDt": "01/08/2020",
                "Port": "INABG1",
                "RefClm": "N",
                "ForCur": "INR",
                "CntCode": "IN"
            }
            }
        // getEInvoiceData = {
        //     "Version": "1.1",
        //     "TranDtls": {
        //         "TaxSch": "GST",
        //         "SupTyp": "EXPWOP",
        //         "RegRev": "N",
        //         "EcmGstin": null,
        //         "IgstOnIntra": "N"
        //     },
        //     "DocDtls": {
        //         "Typ": "INV",
        //         "No": "DOC/423149",
        //         "Dt": "19/12/2022"
        //     },
        //     "SellerDtls": {
        //         "Gstin": "34AACCC1596Q002",
        //         "LglNm": "NIC company pvt ltd",
        //         "TrdNm": "NIC Industries",
        //         "Addr1": "5th block, kuvempu layout",
        //         "Addr2": "kuvempu layout",
        //         "Loc": "GANDHINAGAR",
        //         "Pin": 605001,
        //         "Stcd": "34",
        //         "Ph": "9000000000",
        //         "Em": "abc@gmail.com"
        //     },
        //     "BuyerDtls": {
        //         "Gstin": "URP",
        //         "LglNm": "XYZ company pvt ltd",
        //         "TrdNm": "XYZ Industries",
        //         "Pos": "96",
        //         "Addr1": "7th block, kuvempu layout",
        //         "Addr2": "kuvempu layout",
        //         "Loc": "GANDHINAGAR",
        //         "Pin": 999999,
        //         "Stcd": "96",
        //         "Ph": "91111111111",
        //         "Em": "xyz@yahoo.com"
        //     },
        //     "DispDtls": {
        //         "Nm": "ABC company pvt ltd",
        //         "Addr1": "7th block, kuvempu layout",
        //         "Addr2": "kuvempu layout",
        //         "Loc": "Banagalore",
        //         "Pin": 562160,
        //         "Stcd": "29"
        //     },
        //     "ShipDtls": {
        //         "Gstin": "URP",
        //         "LglNm": "CBE company pvt ltd",
        //         "TrdNm": "kuvempu layout",
        //         "Addr1": "7th block, kuvempu layout",
        //         "Addr2": "kuvempu layout",
        //         "Loc": "Banagalore",
        //         "Pin": 999999,
        //         "Stcd": "96"
        //     },
        //     "ItemList": [
        //         {
        //         "SlNo": "1",
        //         "PrdDesc": "Rice",
        //         "IsServc": "N",
        //         "HsnCd": "1001",
        //         "Qty": 20,
        //         "FreeQty": 10,
        //         "Unit": "BAG",
        //         "UnitPrice": 5,
        //         "TotAmt": 100,
        //         "Discount": 0,
        //         "PreTaxVal": null,
        //         "AssAmt": 100,
        //         "GstRt": 0,
        //         "IgstAmt": 0,
        //         "CgstAmt": 0,
        //         "SgstAmt": 0,
        //         "CesRt": 0,
        //         "CesAmt": 0,
        //         "CesNonAdvlAmt": 0,
        //         "StateCesRt": 0,
        //         "StateCesAmt": 0,
        //         "StateCesNonAdvlAmt": 0,
        //         "OthChrg": 0,
        //         "TotItemVal": 100,
        //         "OrgCntry": null
        //         },
        //         {
        //         "SlNo": "2",
        //         "PrdDesc": "Rice",
        //         "IsServc": "N",
        //         "HsnCd": "1001",
        //         "Qty": 50,
        //         "FreeQty": 10,
        //         "Unit": "BAG",
        //         "UnitPrice": 5,
        //         "TotAmt": 250,
        //         "Discount": 0,
        //         "PreTaxVal": null,
        //         "AssAmt": 250,
        //         "GstRt": 0,
        //         "IgstAmt": 0,
        //         "CgstAmt": 0,
        //         "SgstAmt": 0,
        //         "CesRt": 0,
        //         "CesAmt": 0,
        //         "CesNonAdvlAmt": 0,
        //         "StateCesRt": 0,
        //         "StateCesAmt": 0,
        //         "StateCesNonAdvlAmt": 0,
        //         "OthChrg": 0,
        //         "TotItemVal": 250,
        //         "OrgCntry": null
        //         }
        //     ],
        //     "ValDtls": {
        //         "AssVal": 350,
        //         "CgstVal": 0,
        //         "SgstVal": 0,
        //         "IgstVal": 0,
        //         "CesVal": 0,
        //         "StCesVal": 0,
        //         "Discount": 0,
        //         "OthChrg": 0,
        //         "RndOffAmt": 0,
        //         "TotInvVal": 350,
        //         "TotInvValFc": 350
        //     },
        //     "RefDtls": {
        //         "InvRm": "TEST",
        //         "DocPerdDtls": {
        //         "InvStDt": "01/08/2020",
        //         "InvEndDt": "01/09/2020"
        //         },
        //         "PrecDocDtls": [
        //         {
        //             "InvNo": "DOC/002",
        //             "InvDt": "01/08/2020",
        //             "OthRefNo": "123456"
        //         }
        //         ],
        //         "ContrDtls": [
        //         {
        //             "RecAdvRefr": "Doc/003",
        //             "RecAdvDt": "01/08/2020",
        //             "Tendrefr": "Abc001",
        //             "Contrrefr": "Co123",
        //             "Extrefr": "Yo456",
        //             "Projrefr": "Doc-456",
        //             "Porefr": "Doc-789",
        //             "PoRefDt": "01/08/2020"
        //         }
        //         ]
        //     },
        //     "AddlDocDtls": [
        //         {
        //         "Url": "https://einv-apisandbox.nic.in",
        //         "Docs": "Test Doc",
        //         "Info": "Document Test"
        //         }
        //     ],
        //     "ExpDtls": {
        //         "ShipBNo": "A-248",
        //         "ShipBDt": "01/08/2020",
        //         "Port": "INABG1",
        //         "RefClm": "N",
        //         "ForCur": "INR",
        //         "CntCode": "IN"
        //     }
        //     }
        console.log("getEInvoiceData --->>>", getEInvoiceData)
        var config = {
            "aspid": "1709832422",
            "password": "Kira@1234",
            "Gstin": "34AACCC1596Q002",
            "user_name": "TaxProEnvPON",
            "eInvPwd": "abc34*"
        };
  

        let url2 //= 'https://einvapi.charteredinfo.com/eivital/dec/v1.04/auth';
        url2 = 'https://gstsandbox.charteredinfo.com/eivital/dec/v1.04/auth';
        var configToken = {
            method: 'get',
            url: url2,
            headers: {
                'aspid': config.aspid,
                'password': config.password,
                'Gstin': config.Gstin,
                'user_name': config.user_name,
                'eInvPwd': config.eInvPwd
            }
        };

        let tokenResponse = await axios(configToken)
        let myToken = tokenResponse.data.Data.AuthToken;
        console.log("myToken ", myToken)

        // GENARATE IRN
        let url //= `https://einvapi.charteredinfo.com/eicore/dec/v1.03/Invoice?aspid=${config.aspid}&password=${config.password}&Gstin=${config.Gstin}&AuthToken=${myToken}&user_name=API_Alfa2104&QrCodeSize=250`;
        //  url = `https://gstsandbox.charteredinfo.com/eicore/dec/v1.03/Invoice?aspid=${config.aspid}&password=${config.password}&Gstin=${config.Gstin}&AuthToken=uibvFzxm1VGOJ408LvLfPSpyq&user_name=TaxProEnvPON&QrCodeSize=250`;
         
         url=`https://gstsandbox.charteredinfo.com/eicore/dec/v1.03/Invoice?aspid=1709832422&password=Kira@1234&Gstin=34AACCC1596Q002&AuthToken=${myToken}&user_name=TaxProEnvPON&QrCodeSize=250`
         let configMain = {
            method: 'post',
            url: url,
            'content-type': 'application/json',
            data: getEInvoiceData
        };
        console.log("url ", url)
        console.log(JSON.stringify(configMain))
        console.log("===============================")
        console.log(configMain.data.ItemList)
        console.log("===============================")

        let eInvoiceResponse = await axios(configMain)
        console.log("eInvoiceResponse *************", eInvoiceResponse.data)
        let datasend = {
            eInvoiceResult : eInvoiceResponse.data,
            getEInvoiceRequestData: getEInvoiceData
        }
        //eInvoiceResponse.data
        return datasend

    } catch (error) {
        console.log(":::::::::::::: From catch :::::::::::::::::::::: ", JSON.stringify(error));
        
        console.log("eInvoiceResponse ", error.response.data)
        return (error.response && error.response.data && error.response.data.message) ? error.response.data.message : error
    }
}

async function detectMimeType(b64) {

    var signatures = {
        JVBERi0: "application/pdf",
        R0lGODdh: "image/gif",
        R0lGODlh: "image/gif",
        iVBORw0KGgo: "image/png",
        "/9j/": "image/jpg"
    };
    for (var s in signatures) {
        if (b64.indexOf(s) === 0) {
            return signatures[s];
        }
    };
}

async function createE_Way_Bill_Helper (req, AuthToken, get_order_data, get_invoice_data) {

    try {
        // console.log("config ", config)
        let order_data = get_order_data;
        var vvId = mongoose.Types.ObjectId(get_invoice_data.vendor_id);
        var ccId = mongoose.Types.ObjectId(get_order_data.customer_id);

        let vendor = await Sys.App.Services.VendorProfileServices.getVendorData({
            _id: vvId
        });
       let customer = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: ccId });

        // console.log("vendor",vendor);
        // console.log("customer", customer);
        var length = 7,
         charset = "012345678901234567890123459876543210678901234567890123456789",
         otp = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            otp += charset.charAt(Math.floor(Math.random() * n));
        }
        console.log("otppp",otp,"DOC/"+otp);
        otp = "DOC-"+otp.toString();
        let customer_Address;
        // console.log("get_order_data",get_order_data);
        if(get_order_data.customer_Address.length > 0){
            for (let a = 0; a < get_order_data.customer_Address.length; a++) {
                if(get_order_data.customer_Address[a].is_default == "0"){
                    customer_Address = get_order_data.customer_Address[a];
                }
                
            }
        }else{
            for (let a = 0; a < customer.address_arr.length; a++) {
                if(customer.address_arr[a].is_default == "0"){
                    customer_Address = customer.address_arr[a];
                }
                
            }
        }
        // console.log("customer_Address",customer_Address);
        var order_items = [];
        let assVal=[], cgstVal=[], sgstVal=[], igstVal=[],totalVal=[],totalVal_without_tax=[];
        if(get_order_data){
            if(get_order_data.product_id){
                let product_id = get_order_data.product_invoice;
                // console.log("product_id",product_id);
                for (let pr = 0; pr < product_id.length; pr++) {   
                    var product = await Sys.App.Services.ProductServices.getProductData({ is_deleted: "0", product_visibility: "1" });
                    let slno = 1 + pr;  
                // console.log("product++",product);

                    assVal.push(parseInt(parseInt(product_id[pr].base_amount) * parseInt(product_id[pr].product_quantity)))         
                    cgstVal.push(parseInt(product_id[pr].cgst))          
                    sgstVal.push(parseInt(product_id[pr].sgst))          
                    igstVal.push(parseInt(product_id[pr].igst))  
                    totalVal.push(parseInt(product_id[pr].withTax_amount)) 
                    totalVal_without_tax.push(parseInt(product_id[pr].withoutTax_amount)) 

            

                    order_items.push({

                        // "productName":"BLAZER-1",
                        // "productDesc":"BLAZER-1",
                        // "hsnCode":4421,
                        // "quantity":25,
                        // "qtyUnit":"NOS",
                        // "cgstRate":0,
                        // "sgstRate":0,
                        // "igstRate":3,
                        // "cessRate":3,
                        // "cessNonadvol":0,
                        // "taxableAmount":5609889,
                 
                        "productName": product.product_name, //"Rice",
                        "productDesc": product.product_name, //"Rice",
                        "hsnCode": parseInt(product.hsn_code), //"1001",
                        "quantity": parseInt(product_id[pr].product_quantity), //20,
                        "qtyUnit": "PCS", //"NOS",
                        "igstRate": parseInt(product_id[pr].igst_percentage), //0,
                        "cgstRate": parseInt(product_id[pr].cgst_percentage), //0,
                        "sgstRate": parseInt(product_id[pr].sgst_percentage), //0,
                        "cessRate":0,
                        "cessNonadvol":0,
                        "taxableAmount":parseInt(product_id[pr].withTax_amount), //5609889,
                    
                    });
                }
            }
        }
        console.log("assVal=[], cgstVal=[], sgstVal=[], igstVal=[],totalVal=[]",assVal, cgstVal, sgstVal, igstVal,totalVal);
        // console.log("order_items",order_items);

        // let eWayBillObj = {
        //     "supplyType":"O", //outward,inward
        //     "subSupplyType":"1", //1]supply,2]export,3]job work,4]skd/ckd/Lots,5]Recipient Not known,6]for own use,7]exhibition or Fairs,8]Line sales,9]others
        //     "subSupplyDesc":"Supply", //"Transaction",
        //     "docType":"INV",
        //     "docNo": otp, //"DOC-2025",
        //     "docDate":"02/11/2020",
        //     "fromGstin":vendor.vendor_gst_no, //"34AACCC1596Q002",
        //     "fromTrdName":vendor.vendor_company, //"welton",
        //     "fromAddr1": vendor.vendor_flatNo, //"4-9-35, GROUND,1ST, 2ND FLOOR, AURANGPURA",
        //     "fromAddr2":vendor.vendor_Landmark + vendor.vendor_area, //"GROUND FLOOR OSBORNE ROAD",
        //     "fromPlace":vendor.vendor_town, //"FRAZER TOWN",
        //     "fromPincode":parseInt(vendor.vendor_pin), //605001,
        //     "actFromStateCode":vendor.vendor_Gstcode, //34,
        //     "fromStateCode":vendor.vendor_Gstcode, //34,
        //     "toGstin": customer.user_gst_no,//"29AACCC1596Q000",
        //     "toTrdName":customer.user_gst_companyName, //"sthuthya",
        //     "toAddr1": customer_Address.addresstext_no, //"Shree Nilaya",
        //     "toAddr2": customer_Address.landmark + customer_Address.addresstext_name, //"GODOWN NO 5 GAT NO 1214/1230 ",
        //     "toPlace": customer_Address.city, //"Beml Nagar",
        //     "toPincode":parseInt(customer_Address.pincode), //562160,
        //     "actToStateCode":customer_Address.state_code, //29,
        //     "toStateCode":customer_Address.state_code, //29,
        //     "transactionType":null,//4, //1]regular,2]bill to -ship to,3] bill from - dispatch from,4]combination of 2 end 3
        //     "otherValue":"0", //"-100"
        //     "totalValue": totalVal_without_tax.reduce((a, b) => a + b, 0), //0,
        //     "cgstValue": cgstVal.reduce((a, b) => a + b, 0), //0,
        //     "sgstValue": sgstVal.reduce((a, b) => a + b, 0), //0,
        //     "igstValue": igstVal.reduce((a, b) => a + b, 0), //0,
        //     "cessValue":0,
        //     "cessNonAdvolValue":0, //400,
        //     "totInvValue": totalVal.reduce((a, b) => a + b, 0), //0,
        //     "transporterId":"",
        //     "transporterName":"",
        //     "transDocNo":"DOC/123",
        //     "transMode":null,//"1", //1]road,2]rail,3]air,4]ship or ship cum road/rail, if select road then vehicle type is compulsary
        //     "transDistance":"0",
        //     "transDocDate":"06/05/2022",
        //     "vehicleNo":null,//"PVC1234",//if select road then vehicle type is compulsary
        //     "vehicleType":null,//"R","ODC" r-regular,odc-over dimensional cargo
        //     "itemList":order_items
        //     }


        var config = {
            "aspid": "1709832422",
            "password": "Kira@1234",
            "Gstin": "34AACCC1596Q002",
            "user_name": "TaxProEnvPON",
            "eInvPwd": "abc34*"
        };
  
        // console.log("eWayBillObj --->>>", eWayBillObj)

        let url2 = 'https://gstsandbox.charteredinfo.com/eivital/dec/v1.04/auth';
        var configToken = {
            method: 'get',
            url: url2,
            headers: {
                'aspid': config.aspid,
                'password': config.password,
                'Gstin': config.Gstin,
                'user_name': config.user_name,
                'eInvPwd': config.eInvPwd
            }
        };

        let tokenResponse = await axios(configToken)
        let myToken = tokenResponse.data.Data.AuthToken;
        console.log("myToken ", myToken)

        let today = new Date();

        let year = today.getFullYear();
        let mes = today.getMonth() + 1;
        let month;
        if (mes.toString().length == 1) {
            month = "0" + mes
        } else {
            month = mes;
        }
        let dia = today.getDate();

        let day;
        if (dia.toString().length == 1) {
            day = "0" + dia
        } else {
            day = dia
        }
        let today_date = day + "/" + month + "/" + year;
        console.log("today_date :: ",today_date);
        console.log("today_date :: ",typeof(today_date));

        var data = JSON.stringify({
            "supplyType":"O", //outward,inward
            "subSupplyType":"1", //1]supply,2]export,3]job work,4]skd/ckd/Lots,5]Recipient Not known,6]for own use,7]exhibition or Fairs,8]Line sales,9]others
            "subSupplyDesc":"Supply", //"Transaction",
            "docType":"INV",
            "docNo": otp, //"DOC-2025",
            "docDate": "02/11/2020",
            "fromGstin":vendor.vendor_gst_no, //"34AACCC1596Q002",
            "fromTrdName":vendor.vendor_company, //"welton",
            "fromAddr1": vendor.vendor_flatNo, //"4-9-35, GROUND,1ST, 2ND FLOOR, AURANGPURA",
            "fromAddr2":vendor.vendor_Landmark + vendor.vendor_area, //"GROUND FLOOR OSBORNE ROAD",
            "fromPlace":vendor.vendor_town, //"FRAZER TOWN",
            "fromPincode":parseInt(vendor.vendor_pin), //605001,
            "actFromStateCode":parseInt(vendor.vendor_Gstcode), //34,
            "fromStateCode":parseInt(vendor.vendor_Gstcode), //34,
            "toGstin": customer.user_gst_no,//"29AACCC1596Q000",
            "toTrdName":customer.user_gst_companyName, //"sthuthya",
            "toAddr1": customer_Address.addresstext_no, //"Shree Nilaya",
            "toAddr2": customer_Address.landmark + customer_Address.addresstext_name, //"GODOWN NO 5 GAT NO 1214/1230 ",
            "toPlace": customer_Address.city, //"Beml Nagar",
            "toPincode":parseInt(customer_Address.pincode), //562160,
            "actToStateCode":parseInt(customer_Address.state_code), //29,
            "toStateCode":parseInt(customer_Address.state_code), //29,
            "transactionType":1,//4, //1]regular,2]bill to -ship to,3] bill from - dispatch from,4]combination of 2 end 3
            "otherValue":"0", //"-100"
            "totalValue": totalVal_without_tax.reduce((a, b) => a + b, 0), //0,
            "cgstValue": cgstVal.reduce((a, b) => a + b, 0), //0,
            "sgstValue": sgstVal.reduce((a, b) => a + b, 0), //0,
            "igstValue": igstVal.reduce((a, b) => a + b, 0), //0,
            "cessValue":0,
            "cessNonAdvolValue":0, //400,
            "totInvValue": totalVal.reduce((a, b) => a + b, 0), //0,
            "transporterId":"",
            "transporterName":"",
            "transDocNo":"DOC/123",
            "transMode":"1",//"1", //1]road,2]rail,3]air,4]ship or ship cum road/rail, if select road then vehicle type is compulsary
            "transDistance":"0",
            "transDocDate":"06/05/2022",
            "vehicleNo":"PVC1234",//"PVC1234",//if select road then vehicle type is compulsary
            "vehicleType":"R",//"R","ODC" r-regular,odc-over dimensional cargo
            "itemList":order_items
        // "supplyType": "O",
        // "subSupplyType": "1",
        // "subSupplyDesc": "Transaction",
        // "docType": "INV",
        // "docNo": "DOC-2045746",
        // "docDate": "02/11/2020",
        // "fromGstin": "34AACCC1596Q002",
        // "fromTrdName": "welton",
        // "fromAddr1": "4-9-35, GROUND,1ST, 2ND FLOOR, AURANGPURA",
        // "fromAddr2": "GROUND FLOOR OSBORNE ROAD",
        // "fromPlace": "FRAZER TOWN",
        // "fromPincode": 605001,
        // "actFromStateCode": 34,
        // "fromStateCode": 34,
        // "toGstin": "29AACCC1596Q000",
        // "toTrdName": "sthuthya",
        // "toAddr1": "Shree Nilaya",
        // "toAddr2": "GODOWN NO 5 GAT NO 1214/1230 ",
        // "toPlace": "Beml Nagar",
        // "toPincode": 562160,
        // "actToStateCode": 29,
        // "toStateCode": 29,
        // "transactionType": 4,
        // "otherValue": "-100",
        // "totalValue": 0,
        // "cgstValue": 0,
        // "sgstValue": 0,
        // "igstValue": 0,
        // "cessValue": 0,
        // "cessNonAdvolValue": 400,
        // "totInvValue": 0,
        // "transporterId": "",
        // "transporterName": "",
        // "transDocNo": "DOC/123",
        // "transMode": "1",
        // "transDistance": "0",
        // "transDocDate": "06/05/2022",
        // "vehicleNo": "PVC1234",
        // "vehicleType": "R",
        // "itemList": [
        //     {
        //     "productName": "BLAZER-1",
        //     "productDesc": "BLAZER-1",
        //     "hsnCode": 4421,
        //     "quantity": 25,
        //     "qtyUnit": "NOS",
        //     "cgstRate": 0,
        //     "sgstRate": 0,
        //     "igstRate": 3,
        //     "cessRate": 3,
        //     "cessNonadvol": 0,
        //     "taxableAmount": 5609889
        //     }
        // ]
        });
        // console.log("dddddddddddddddd",data);
        let datasend;
        var configdata = {
        method: 'post',
        url: `https://gstsandbox.charteredinfo.com/ewaybillapi/dec/v1.03/ewayapi?username=TaxProEnvPON&password=Kira@1234&aspid=1709832422&Gstin=34AACCC1596Q002&Authtoken=${myToken}&Action=GENEWAYBILL`,
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
        };

       await axios(configdata)
        .then(async function (response) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",JSON.stringify(response.data));
         datasend = {
            eWayBillResponseResult : response.data,
            eWayBillObj: data
         }
        })
        .catch(function (error) {
        console.log(error);
        });

        console.log("eWayBillResponse ::::::::::::::; ", datasend);

        return datasend;

    } catch (error) {
        console.log(":::::::::::::: From catch :::::::::::::::::::::: ", JSON.stringify(error));
        
        console.log("eInvoiceResponse ", error.response.data)
        return (error.response && error.response.data && error.response.data.message) ? error.response.data.message : error
    }
}

function create_Id() {
    var dt = new Date().getTime();
    var uuid = 'xxyxyxxyx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

