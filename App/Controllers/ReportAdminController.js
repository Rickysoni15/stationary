var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");
var mongoose = require('mongoose');
const datetime = require('date-and-time');




module.exports = {


    listReport: async function (req, res) {
        try {

            if (req.session.details.role == "admin") {
                var data = {
                    App: req.session.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    report: 'active',
                };
                // console.log("Datat", data);
                return res.render('backend/report/listVendorReport', data);
            } else {
                var data = {
                    App: req.session.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    report: 'active',
                };
                // console.log("Datat", data);
                return res.render('backend/report/listReport', data);
            }


        } catch (e) {
            console.log("Error in OrderController in list", e);
        }
    },

    getReport: async function (req, res) {

        // console.log("get product data session  ====> ", req.session.details.id);

        console.log("req.prams getReport === >>>", req.params.startDate, req.params.endDate);

        try {
            // let orderArr = [];
            // let orderdata = await Sys.App.Services.PaymentServices.getByData({"product_info.vendorid":req.session.details.id});

            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search;

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

            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });


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


            // console.log("data 2342342343   ------>>>   ", dataFinal);
            let unique = [];

            dataFinal.map(x => unique.filter(a => a.order_id == x.order_id).length > 0 ? null : unique.push(x));


            let orderData = await Sys.App.Services.OrderServices.getUserData({ product_status: "success" });

            // console.log("unique  ---->",unique);

            let finalData = [];
            for (let i = 0; i < orderData.length; i++) {
                for (const item of unique) {
                    if (orderData[i].order_id == item.order_id) {
                        finalData.push(orderData[i])
                    }
                }

            }


            // console.log(" finalDatafinalData === >>>",finalData);


            // let grouped = _.groupBy(finalData, product => product.product_id);

            // console.log("grouped ====>>>",grouped);



            let product_Data = [];

            for (let j = 0; j < productData.length; j++) {

                for (const data of finalData) {

                    // console.log("dataa ==== >>",data);

                    if (productData[j]._id == data.product_id && data.vendorId == req.session.details.id) {

                        let product_quantity = data.product_quantity;
                        product_quantity = parseInt(product_quantity)

                        let withTax_amount = data.withTax_amount;
                        withTax_amount = parseInt(withTax_amount)

                        let withoutTax_amount = data.withoutTax_amount;
                        withoutTax_amount = parseInt(withoutTax_amount)

                        let tax_amount = data.tax_amount;
                        tax_amount = parseInt(tax_amount)

                        let tax_percentage = data.tax_percentage;
                        tax_percentage = parseInt(tax_percentage)

                        let cgst = data.cgst;
                        cgst = parseInt(cgst)

                        let sgst = data.sgst;
                        sgst = parseInt(sgst)

                        let igst = data.igst;
                        igst = parseInt(igst)

                        let updatedAt = data.updatedAt;
                        // let year = updatedAt.getFullYear();
                        // let mes = updatedAt.getMonth() + 1;
                        // let dia = updatedAt.getDate();
                        // let orderDate = year + "-0" + mes + "-" + dia;


                        let year = updatedAt.getFullYear();
                        let mes = updatedAt.getMonth() + 1;
    
                        let dia = updatedAt.getDate();
    
                        // if (toString(mes).length == 2) {
                        if (mes.toString().length == 2) {
    
                            mes = "-" + mes
                            
                        }else{
                            mes = "-0" + mes
    
                        }
    
                        // if (toString(dia).length == 2) {
                        if (dia.toString().length == 2) {
    
                            dia = "-" + dia
                            
                        }else{
                            dia = "-0" + dia
    
                        }
    
    
                        let orderDate = year + mes + dia;



                        product_Data.push({ productName: productData[j].product_name, id: productData[j]._id, product_quantity: product_quantity, withTax_amount: withTax_amount, withoutTax_amount: withoutTax_amount, tax_amount: tax_amount, tax_percentage: tax_percentage, tax_type: data.tax_type, cgst: cgst, sgst: sgst, igst: igst, orderDate: orderDate })
                    }

                }

            }
            // console.log("orderData   ------>>>   ", product_Data);

            var finalArr = product_Data.reduce((m, o) => {
                var found = m.find(p => p.productName === o.productName && p.orderDate === o.orderDate);
                if (found) {
                    found.product_quantity += o.product_quantity;
                    found.withTax_amount += o.withTax_amount;
                    found.withoutTax_amount += o.withoutTax_amount;
                    found.tax_amount += o.tax_amount;
                    found.tax_percentage;
                    found.cgst += o.cgst;
                    found.sgst += o.sgst;
                    found.igst += o.igst;

                } else {
                    m.push(o);
                }
                return m;
            }, []);

            let count = finalArr.length

            if ((req.params.startDate != undefined || req.params.startDate) && (req.params.endDate != undefined || req.params.endDate)) {
                console.log("lllllllllll");
                let newProduct_Data = [];

                for (let d = 0; d < finalArr.length; d++) {
                    if (finalArr[d].orderDate >= req.params.startDate && finalArr[d].orderDate <= req.params.endDate) {
                        newProduct_Data.push(finalArr[d])
                    }

                }

                let count = newProduct_Data.length
                console.log("orderData datewise  ------>>>   ", newProduct_Data);


                var obj = {
                    'draw': req.query.draw,
                    'recordsTotal': count,
                    'recordsFiltered': count,
                    'data': newProduct_Data,
                };

                res.send(obj);

            } else {

                var obj = {
                    'draw': req.query.draw,
                    'recordsTotal': count,
                    'recordsFiltered': count,
                    'data': finalArr,
                };
                console.log("orderData datewise  --oooooo---->>>   ", product_Data);

                res.send(obj);

            }



        } catch (e) {
            console.log("Error in ProductController in getProduct", e);
        }
    },

    getReportByDate: async function (req, res) {

        console.log("get product data session  ====> ", req.body);

        try {
            // let orderArr = [];
            // let orderdata = await Sys.App.Services.PaymentServices.getByData({"product_info.vendorid":req.session.details.id});


            let search;
            let length;
            let start;
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

            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });


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


            // console.log("data 2342342343   ------>>>   ", productData);
            let unique = [];

            dataFinal.map(x => unique.filter(a => a.order_id == x.order_id).length > 0 ? null : unique.push(x));


            let orderData = await Sys.App.Services.OrderServices.getUserData({ product_status: "success", });

            // console.log("unique  ---->",unique);

            let finalData = [];
            for (let i = 0; i < orderData.length; i++) {
                for (const item of unique) {
                    if (orderData[i].order_id == item.order_id) {
                        finalData.push(orderData[i])
                    }
                }

            }


            // console.log(" finalDatafinalData === >>>",finalData);


            // let grouped = _.groupBy(finalData, product => product.product_id);

            // console.log("grouped ====>>>",grouped);



            let product_Data = [];

            for (let j = 0; j < productData.length; j++) {

                for (const data of finalData) {

                    // console.log("dataa ==== >>",data);

                    if (productData[j]._id == data.product_id && data.vendorId == req.session.details.id) {

                        let product_quantity = data.product_quantity;
                        product_quantity = parseInt(product_quantity)

                        let withTax_amount = data.withTax_amount;
                        withTax_amount = parseInt(withTax_amount)

                        let withoutTax_amount = data.withoutTax_amount;
                        withoutTax_amount = parseInt(withoutTax_amount)

                        let tax_amount = data.tax_amount;
                        tax_amount = parseInt(tax_amount)

                        let tax_percentage = data.tax_percentage;
                        tax_percentage = parseInt(tax_percentage)

                        let cgst = data.cgst;
                        cgst = parseInt(cgst)

                        let sgst = data.sgst;
                        sgst = parseInt(sgst)

                        let igst = data.igst;
                        igst = parseInt(igst)

                        let updatedAt = data.updatedAt;
                        let year = updatedAt.getFullYear();
                        let mes = updatedAt.getMonth() + 1;
                        let dia = updatedAt.getDate();
                        let orderDate = year + "-0" + mes + "-" + dia;



                        product_Data.push({ productName: productData[j].product_name, id: productData[j]._id, product_quantity: product_quantity, withTax_amount: withTax_amount, withoutTax_amount: withoutTax_amount, tax_amount: tax_amount, tax_percentage: tax_percentage, tax_type: data.tax_type, cgst: cgst, sgst: sgst, igst: igst, orderDate: orderDate })
                    }

                }

            }

            console.log("product_Data ----> ", product_Data);
            let newProduct_Data = [];
            for (let pr = 0; pr < product_Data.length; pr++) {

                console.log("product_Data ===>", product_Data[pr].orderDate);
                if (product_Data[pr].orderDate >= req.body.startDate && product_Data[pr].orderDate <= req.body.endDate) {
                    newProduct_Data.push(product_Data[pr])
                }

            }
            console.log("newProduct_Data   ------>>>   ", newProduct_Data);

            let count = product_Data.length
            // var finalArr = product_Data.reduce((m, o) => {
            //     var found = m.find(p => p.productName === o.productName);
            //     if (found) {
            //         found.product_quantity += o.product_quantity;
            //         found.withTax_amount += o.withTax_amount;
            //         found.withoutTax_amount += o.withoutTax_amount;
            //         found.tax_amount += o.tax_amount;
            //         found.tax_percentage ;
            //         found.cgst += o.cgst;
            //         found.sgst += o.sgst;
            //         found.igst += o.igst;

            //     } else {
            //         m.push(o);
            //     }
            //     return m;
            // }, []);


            var obj = {
                'draw': req.query.draw,
                'recordsTotal': count,
                'recordsFiltered': count,
                'data': product_Data,
            };

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
            console.log("req.session ----editorder-->>>>", req.params.id);
            let orderData = await Sys.App.Services.PaymentServices.getProductData({ _id: req.params.id, is_deleted: "0" });
            let orderSuccessData = await Sys.App.Services.OrderServices.getUserData({ product_status: "success", order_id: orderData.order_id });
            // let productCategory = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
            if (orderData) {
                for (let o = 0; o < orderData.length; o++) {
                    var dateData = orderData[o].updatedAt;
                    orderData[o].orderdate = datetime.format(dateData, 'YYYY/MM/DD HH:mm:ss');
                    // console.log("orderData[o].orderdate",orderData[o].orderdate);
                }
            }

            //    let newId = new ObjectId(orderData.customer_id)

            var newId = mongoose.Types.ObjectId(orderData.customer_id);

            let vendor = await Sys.App.Services.VendorProfileServices.getVendorData({ _id: req.session.details.id, is_deleted: '0' });
            let user = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: newId });


            // console.log("customerAdd ----->",customerAdd);
            let addId;
            let orderTotal = [];

            let newOrderList = [];
            for (let m = 0; m < orderSuccessData.length; m++) {

                for (const item of orderData.product_id) {

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
                        newOrderList.push({ id: item._id, order_id: orderData.order_id, product_name: item.product_name, question_form: question_form, product_price: item.product_price, product_quantity: orderSuccessData[m].product_quantity, discount_amount: disValue, tax_amount: orderSuccessData[m].tax_amount, cgst: orderSuccessData[m].cgst, sgst: orderSuccessData[m].sgst, igst: orderSuccessData[m].igst, subTotal: subTotal, rawTotal: rawTotal })
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

            // console.log("orderSuccessData[m].newOrderList --->",newOrderList);

            // let today = orderData.updatedAt;
            // let year = today.getFullYear();
            // let mes = today.getMonth() + 1;
            // let dia = today.getDate();
            // let orderDate = dia + "-0" + mes + "-" + year;


            var d = new Date(today),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            let orderDate = [day, month, year].join('-');


            console.log("orderdate =====>>> ", orderDate);




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
            };

            // console.log("productData test 88888  orderSuccessData ====>>>",order_id,customer_id,_id, orderSuccessData);
            // console.log("orderData.customer_id -- ", newId);
            // console.log("orderSuccessData -- >", user);


            // console.log("productData test 333333333333  orderData ====>>>", orderData.product_id);

            return res.render('backend/order/addOrder', data);
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


    getReportvendor: async function (req, res) {

        // console.log("get product data session  ====> ", req.session.details.id);



        try {
            // let orderArr = [];
            // let orderdata = await Sys.App.Services.PaymentServices.getByData({"product_info.vendorid":req.session.details.id});

            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search;

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

            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });


            let productCount = await Sys.App.Services.PaymentServices.getProductCount(query);
            let data = await Sys.App.Services.PaymentServices.getProductDatatable(query, length, start);
            let dataFinal = [];

            for (let d = 0; d < data.length; d++) {

                dataFinal.push(data[d].order_id)

            }

            let vendor_Id = [];

            for (let ii = 0; ii < dataFinal.length; ii++) {

                let orderData = await Sys.App.Services.OrderServices.getSingleUserData({ order_id: dataFinal[ii], is_deleted: "0", product_status: "success" });

                if (orderData != null) {

                    vendor_Id.push({ id: orderData.vendorId })

                }
            }

            let unique = [];
            vendor_Id.map(x => unique.filter(a => a.id == x.id).length > 0 ? null : unique.push(x));

            let vendorDAta = [];

            for (let v = 0; v < unique.length; v++) {

                let vendor = await Sys.App.Services.VendorProfileServices.getSingleVendorData({ _id: unique[v].id, is_deleted: "0" });

                vendorDAta.push({ id: vendor._id, name: vendor.vendor_company })

            }


            let count = vendorDAta.length;

            var obj = {
                'draw': req.query.draw,
                'recordsTotal': count,
                'recordsFiltered': count,
                'data': vendorDAta,
            };


            res.send(obj);


        } catch (e) {
            console.log("Error in ProductController in getProduct", e);
        }
    },

    reportOrderDetails: async function (req, res) {
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
                report: 'active',
                unique: unique,
                vendorId: req.params.id
            };

            // console.log("productData test 88888  orderSuccessData ====>>>",order_id,customer_id,_id, orderSuccessData);
            // console.log("orderData.customer_id -- ", newId);
            // console.log("orderSuccessData -- >", user);


            // console.log("productData test 333333333333  orderData ====>>>", orderData.product_id);

            // res.send(obj);
            return res.render('backend/report/vendorListReport', data);




        } catch (e) {
            console.log("Error in ProductController in editProduct", e);
        }

    },

    getReportList: async function (req, res) {

        console.log("get product data session  ====> ", req.params.id);



        try {
            // let orderArr = [];
            // let orderdata = await Sys.App.Services.PaymentServices.getByData({"product_info.vendorid":req.session.details.id});

            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search;

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

            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });


            let productCount = await Sys.App.Services.PaymentServices.getProductCount(query);
            let data = await Sys.App.Services.PaymentServices.getProductDatatable(query, length, start);
            let dataFinal = [];

            for (let d = 0; d < data.length; d++) {

                for (let mm = 0; mm < data[d].product_id.length; mm++) {


                    if (data[d].product_id[mm].venodor_id == req.params.id) {
                        dataFinal.push(data[d])
                    }

                }

            }

            // console.log("dataFinal ====>>> getReportList ====>>",dataFinal);



            let unique = [];

            dataFinal.map(x => unique.filter(a => a.order_id == x.order_id).length > 0 ? null : unique.push(x));


            let orderData = await Sys.App.Services.OrderServices.getUserData({ product_status: "success", is_deleted: "0" });

            // console.log("unique  ---->" ,orderData );

            let finalData = [];
            for (let i = 0; i < orderData.length; i++) {
                for (const item of unique) {
                    if (orderData[i].order_id == item.order_id) {
                        finalData.push(orderData[i])
                    }
                }

            }


            // console.log(" finalDatafinalData === >>>",finalData);


            // let grouped = _.groupBy(finalData, product => product.product_id);

            // console.log("grouped ====>>>",grouped);



            let product_Data = [];

            for (let j = 0; j < productData.length; j++) {

                for (const data of finalData) {

                    // console.log("dataa ==== >>",data);

                    if (productData[j]._id == data.product_id && data.vendorId == req.params.id) {

                        let product_quantity = data.product_quantity;
                        product_quantity = parseInt(product_quantity)

                        let withTax_amount = data.withTax_amount;
                        withTax_amount = parseInt(withTax_amount)

                        let withoutTax_amount = data.withoutTax_amount;
                        withoutTax_amount = parseInt(withoutTax_amount)

                        let tax_amount = data.tax_amount;
                        tax_amount = parseInt(tax_amount)

                        let tax_percentage = data.tax_percentage;
                        tax_percentage = parseInt(tax_percentage)

                        let cgst = data.cgst;
                        cgst = parseInt(cgst)

                        let sgst = data.sgst;
                        sgst = parseInt(sgst)

                        let igst = data.igst;
                        igst = parseInt(igst)

                        let updatedAt = data.updatedAt;
                        let year = updatedAt.getFullYear();
                        let mes = updatedAt.getMonth() + 1;
                        let dia = updatedAt.getDate();
                        let orderDate = year + "-0" + mes + "-" + dia;



                        product_Data.push({ productName: productData[j].product_name, id: productData[j]._id, product_quantity: product_quantity, withTax_amount: withTax_amount, withoutTax_amount: withoutTax_amount, tax_amount: tax_amount, tax_percentage: tax_percentage, tax_type: data.tax_type, cgst: cgst, sgst: sgst, igst: igst, orderDate: orderDate })
                    }

                }

            }
            // console.log("orderData   ------>>>   ", product_Data);

            var finalArr = product_Data.reduce((m, o) => {
                var found = m.find(p => p.productName === o.productName && p.orderDate === o.orderDate);
                if (found) {
                    found.product_quantity += o.product_quantity;
                    found.withTax_amount += o.withTax_amount;
                    found.withoutTax_amount += o.withoutTax_amount;
                    found.tax_amount += o.tax_amount;
                    found.tax_percentage;
                    found.cgst += o.cgst;
                    found.sgst += o.sgst;
                    found.igst += o.igst;

                } else {
                    m.push(o);
                }
                return m;
            }, []);



            let count = finalArr.length

            if ((req.params.startDate != undefined || req.params.startDate) && (req.params.endDate != undefined || req.params.endDate)) {
                console.log("lllllllllll");
                let newProduct_Data = [];

                for (let d = 0; d < finalArr.length; d++) {
                    if (finalArr[d].orderDate >= req.params.startDate && finalArr[d].orderDate <= req.params.endDate) {
                        newProduct_Data.push(finalArr[d])
                    }

                }

                let count = newProduct_Data.length
                // console.log("orderData datewise  ------>>>   ", newProduct_Data);



                var obj = {
                    'draw': req.query.draw,
                    'recordsTotal': count,
                    'recordsFiltered': count,
                    'data': newProduct_Data,

                };

                res.send(obj);

            } else {

                var obj = {
                    'draw': req.query.draw,
                    'recordsTotal': count,
                    'recordsFiltered': count,
                    'data': finalArr,

                };
                // console.log("orderData datewise  --oooooo---->>>   ", product_Data);

                res.send(obj);

            }



        } catch (e) {
            console.log("Error in ProductController in getProduct", e);
        }
    },

// commision report 

    listCommisionReport: async function (req, res) {
        try {

            if (req.session.details.role == "admin") {
                var data = {
                    App: req.session.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    report: 'active',
                };
                // console.log("Datat", data);
                return res.render('backend/commision_report/listVendorReport', data);
            } else {
                var data = {
                    App: req.session.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    commisionReport: 'active',
                };
                // console.log("Datat", data);
                return res.render('backend/commision_report/listReport', data);
            }


        } catch (e) {
            console.log("Error in OrderController in list", e);
        }
    },

    getCommisionReport: async function (req, res) {

        // console.log("get product data session  ====> ", req.session.details.id);

        console.log("req.prams getReport === >>>", req.params.startDate, req.params.endDate);

        try {
            // let orderArr = [];
            // let orderdata = await Sys.App.Services.PaymentServices.getByData({"product_info.vendorid":req.session.details.id});
            let commision_data = await Sys.App.Services.CommisionServices.getVendorData({ is_deleted: "0" });

            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search;

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

            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });


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


            // console.log("data 2342342343   ------>>>   ", dataFinal);
            let unique = [];

            dataFinal.map(x => unique.filter(a => a.order_id == x.order_id).length > 0 ? null : unique.push(x));


            let orderData = await Sys.App.Services.OrderServices.getUserData({ product_status: "success" });

            // console.log("unique  ---->",unique);

            let finalData = [];
            for (let i = 0; i < orderData.length; i++) {
                for (const item of unique) {
                    if (orderData[i].order_id == item.order_id) {
                        finalData.push(orderData[i])
                    }
                }

            }


            // console.log(" finalDatafinalData === >>>",finalData);


            // let grouped = _.groupBy(finalData, product => product.product_id);

            // console.log("grouped ====>>>",grouped);



            let product_Data = [];

            for (let j = 0; j < productData.length; j++) {

                for (const data of finalData) {

                    // console.log("dataa ==== >>",data);

                    if (productData[j]._id == data.product_id && data.vendorId == req.session.details.id) {

                        let product_quantity = data.product_quantity;
                        product_quantity = parseInt(product_quantity)

                        let withTax_amount = data.withTax_amount;
                        withTax_amount = parseInt(withTax_amount)

                        let withoutTax_amount = data.withoutTax_amount;
                        withoutTax_amount = parseInt(withoutTax_amount)

                        let tax_amount = data.tax_amount;
                        tax_amount = parseInt(tax_amount)

                        let tax_percentage = data.tax_percentage;
                        tax_percentage = parseInt(tax_percentage)

                        let cgst = data.cgst;
                        cgst = parseInt(cgst)

                        let sgst = data.sgst;
                        sgst = parseInt(sgst)

                        let igst = data.igst;
                        igst = parseInt(igst)

                        let updatedAt = data.updatedAt;
                        // let year = updatedAt.getFullYear();
                        // let mes = updatedAt.getMonth() + 1;
                        // let dia = updatedAt.getDate();
                        // let orderDate = year + "-0" + mes + "-" + dia;

                        let dia1;
                        let year = updatedAt.getFullYear();
                        let mes = updatedAt.getMonth() + 1;

                        let dia = updatedAt.getDate();

                        if (mes.toString().length == 2) {

                            mes = "-" + mes
                            
                        }else{
                            mes = "-0" + mes

                        }
                        if (dia.toString().length == 2) {
                            // console.log("dddddd>>>",dia,dia1);
                            dia1 = dia
                            dia = "-" + dia
                            
                        }else{
                        // console.log("dddddd",dia,dia1);
                            dia1 = "0" + dia
                            dia = "-0" + dia

                        }


                        let orderDate = year + mes + dia;
                        let orderDated_show = dia1 + mes + "-" +year;
                       
                        let withcommision_amount = parseFloat(withTax_amount) * parseFloat(commision_data.commision) / 100;

                        product_Data.push({ productName: productData[j].product_name, id: productData[j]._id, product_quantity: product_quantity, withTax_amount: withTax_amount, withoutTax_amount: withoutTax_amount, tax_amount: tax_amount, tax_percentage: tax_percentage, tax_type: data.tax_type, cgst: cgst, sgst: sgst, igst: igst, orderDate: orderDate, commision: commision_data.commision, withcommision_amount: withcommision_amount,orderDated_show: orderDated_show })
                    }

                }

            }
            // console.log("orderData   ------>>>   ", product_Data);

            // var finalArr = product_Data.reduce((m, o) => {
            //     var found = m.find(p => p.productName === o.productName && p.orderDate === o.orderDate);
            //     if (found) {
            //         found.product_quantity += o.product_quantity;
            //         found.withTax_amount += o.withTax_amount;
            //         found.withoutTax_amount += o.withoutTax_amount;
            //         found.tax_amount += o.tax_amount;
            //         found.tax_percentage;
            //         found.cgst += o.cgst;
            //         found.sgst += o.sgst;
            //         found.igst += o.igst;

            //     } else {
            //         m.push(o);
            //     }
            //     return m;
            // }, []);

            // let count = finalArr.length

            if ((req.params.startDate != undefined || req.params.startDate) && (req.params.endDate != undefined || req.params.endDate)) {
                console.log("lllllllllll");
                let newProduct_Data = [];

                // for (let d = 0; d < finalArr.length; d++) {
                //     if (finalArr[d].orderDate >= req.params.startDate && finalArr[d].orderDate <= req.params.endDate) {
                //         newProduct_Data.push(finalArr[d])
                //     }

                // }
                for (let d = 0; d < product_Data.length; d++) {
                    if (product_Data[d].orderDate >= req.params.startDate && product_Data[d].orderDate <= req.params.endDate) {
                        newProduct_Data.push(product_Data[d])
                    }

                }

                let count = newProduct_Data.length
                console.log("orderData datewise  ------>>>   ", newProduct_Data);


                var obj = {
                    'draw': req.query.draw,
                    'recordsTotal': count,
                    'recordsFiltered': count,
                    'data': newProduct_Data,
                };

                res.send(obj);

            } else {

                var obj = {
                    'draw': req.query.draw,
                    'recordsTotal': product_Data.length,//count
                    'recordsFiltered': product_Data.length,//count,
                    'data': product_Data,//finalArr,
                };
                console.log("orderData datewise  --oooooo---->>>   ", product_Data);

                res.send(obj);

            }



        } catch (e) {
            console.log("Error in ProductController in getProduct", e);
        }
    },

    getCommisionReportByDate: async function (req, res) {

        console.log("get product data session  ====> ", req.body);

        try {
            // let orderArr = [];
            // let orderdata = await Sys.App.Services.PaymentServices.getByData({"product_info.vendorid":req.session.details.id});


            let search;
            let length;
            let start;
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

            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });


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


            // console.log("data 2342342343   ------>>>   ", productData);
            let unique = [];

            dataFinal.map(x => unique.filter(a => a.order_id == x.order_id).length > 0 ? null : unique.push(x));


            let orderData = await Sys.App.Services.OrderServices.getUserData({ product_status: "success", });

            // console.log("unique  ---->",unique);

            let finalData = [];
            for (let i = 0; i < orderData.length; i++) {
                for (const item of unique) {
                    if (orderData[i].order_id == item.order_id) {
                        finalData.push(orderData[i])
                    }
                }

            }


            // console.log(" finalDatafinalData === >>>",finalData);


            // let grouped = _.groupBy(finalData, product => product.product_id);

            // console.log("grouped ====>>>",grouped);



            let product_Data = [];

            for (let j = 0; j < productData.length; j++) {

                for (const data of finalData) {

                    // console.log("dataa ==== >>",data);

                    if (productData[j]._id == data.product_id && data.vendorId == req.session.details.id) {

                        let product_quantity = data.product_quantity;
                        product_quantity = parseInt(product_quantity)

                        let withTax_amount = data.withTax_amount;
                        withTax_amount = parseInt(withTax_amount)

                        let withoutTax_amount = data.withoutTax_amount;
                        withoutTax_amount = parseInt(withoutTax_amount)

                        let tax_amount = data.tax_amount;
                        tax_amount = parseInt(tax_amount)

                        let tax_percentage = data.tax_percentage;
                        tax_percentage = parseInt(tax_percentage)

                        let cgst = data.cgst;
                        cgst = parseInt(cgst)

                        let sgst = data.sgst;
                        sgst = parseInt(sgst)

                        let igst = data.igst;
                        igst = parseInt(igst)

                        let updatedAt = data.updatedAt;
                        let year = updatedAt.getFullYear();
                        let mes = updatedAt.getMonth() + 1;
                        let dia = updatedAt.getDate();
                        let orderDate = year + "-0" + mes + "-" + dia;
                        let orderDated_show = dia + "-0" + mes + "-" + year;


                        product_Data.push({ productName: productData[j].product_name, id: productData[j]._id, product_quantity: product_quantity, withTax_amount: withTax_amount, withoutTax_amount: withoutTax_amount, tax_amount: tax_amount, tax_percentage: tax_percentage, tax_type: data.tax_type, cgst: cgst, sgst: sgst, igst: igst, orderDate: orderDate,orderDated_show: orderDated_show })
                    }

                }

            }

            console.log("product_Data ----> ", product_Data);
            let newProduct_Data = [];
            for (let pr = 0; pr < product_Data.length; pr++) {

                console.log("product_Data ===>", product_Data[pr].orderDate);
                if (product_Data[pr].orderDate >= req.body.startDate && product_Data[pr].orderDate <= req.body.endDate) {
                    newProduct_Data.push(product_Data[pr])
                }

            }
            console.log("newProduct_Data   ------>>>   ", newProduct_Data);

            let count = product_Data.length
            // var finalArr = product_Data.reduce((m, o) => {
            //     var found = m.find(p => p.productName === o.productName);
            //     if (found) {
            //         found.product_quantity += o.product_quantity;
            //         found.withTax_amount += o.withTax_amount;
            //         found.withoutTax_amount += o.withoutTax_amount;
            //         found.tax_amount += o.tax_amount;
            //         found.tax_percentage ;
            //         found.cgst += o.cgst;
            //         found.sgst += o.sgst;
            //         found.igst += o.igst;

            //     } else {
            //         m.push(o);
            //     }
            //     return m;
            // }, []);


            var obj = {
                'draw': req.query.draw,
                'recordsTotal': count,
                'recordsFiltered': count,
                'data': product_Data,
            };

            res.send(obj);
        } catch (e) {
            console.log("Error in ProductController in getProduct", e);
        }
    },

    getCommisionReportvendor: async function (req, res) {

        // console.log("get product data session  ====> ", req.session.details.id);



        try {
            // let orderArr = [];
            // let orderdata = await Sys.App.Services.PaymentServices.getByData({"product_info.vendorid":req.session.details.id});

            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search;

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

            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });


            let productCount = await Sys.App.Services.PaymentServices.getProductCount(query);
            let data = await Sys.App.Services.PaymentServices.getProductDatatable(query, length, start);
            let dataFinal = [];

            for (let d = 0; d < data.length; d++) {

                dataFinal.push(data[d].order_id)

            }

            let vendor_Id = [];

            for (let ii = 0; ii < dataFinal.length; ii++) {

                let orderData = await Sys.App.Services.OrderServices.getSingleUserData({ order_id: dataFinal[ii], is_deleted: "0", product_status: "success" });

                if (orderData != null) {

                    vendor_Id.push({ id: orderData.vendorId })

                }
            }

            let unique = [];
            vendor_Id.map(x => unique.filter(a => a.id == x.id).length > 0 ? null : unique.push(x));

            let vendorDAta = [];

            for (let v = 0; v < unique.length; v++) {

                let vendor = await Sys.App.Services.VendorProfileServices.getSingleVendorData({ _id: unique[v].id, is_deleted: "0" });

                vendorDAta.push({ id: vendor._id, name: vendor.vendor_company })

            }


            let count = vendorDAta.length;

            var obj = {
                'draw': req.query.draw,
                'recordsTotal': count,
                'recordsFiltered': count,
                'data': vendorDAta,
            };


            res.send(obj);


        } catch (e) {
            console.log("Error in ProductController in getProduct", e);
        }
    },

    commisionReportOrderDetails: async function (req, res) {
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
                report: 'active',
                unique: unique,
                vendorId: req.params.id
            };

            // console.log("productData test 88888  orderSuccessData ====>>>",order_id,customer_id,_id, orderSuccessData);
            // console.log("orderData.customer_id -- ", newId);
            // console.log("orderSuccessData -- >", user);


            // console.log("productData test 333333333333  orderData ====>>>", orderData.product_id);

            // res.send(obj);
            return res.render('backend/commision_report/vendorListReport', data);




        } catch (e) {
            console.log("Error in ProductController in editProduct", e);
        }

    },

    getCommisionReportList: async function (req, res) {

        console.log("get product data session  ====> ", req.params.id);



        try {
            // let orderArr = [];
            // let orderdata = await Sys.App.Services.PaymentServices.getByData({"product_info.vendorid":req.session.details.id});

            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search;

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

            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });


            let productCount = await Sys.App.Services.PaymentServices.getProductCount(query);
            let data = await Sys.App.Services.PaymentServices.getProductDatatable(query, length, start);
            let dataFinal = [];

            for (let d = 0; d < data.length; d++) {

                for (let mm = 0; mm < data[d].product_id.length; mm++) {


                    if (data[d].product_id[mm].venodor_id == req.params.id) {
                        dataFinal.push(data[d])
                    }

                }

            }

            // console.log("dataFinal ====>>> getReportList ====>>",dataFinal);



            let unique = [];

            dataFinal.map(x => unique.filter(a => a.order_id == x.order_id).length > 0 ? null : unique.push(x));


            let orderData = await Sys.App.Services.OrderServices.getUserData({ product_status: "success", is_deleted: "0" });

            // console.log("unique  ---->" ,orderData );

            let finalData = [];
            for (let i = 0; i < orderData.length; i++) {
                for (const item of unique) {
                    if (orderData[i].order_id == item.order_id) {
                        finalData.push(orderData[i])
                    }
                }

            }


            // console.log(" finalDatafinalData === >>>",finalData);


            // let grouped = _.groupBy(finalData, product => product.product_id);

            // console.log("grouped ====>>>",grouped);



            let product_Data = [];

            for (let j = 0; j < productData.length; j++) {

                for (const data of finalData) {

                    // console.log("dataa ==== >>",data);

                    if (productData[j]._id == data.product_id && data.vendorId == req.params.id) {

                        let product_quantity = data.product_quantity;
                        product_quantity = parseInt(product_quantity)

                        let withTax_amount = data.withTax_amount;
                        withTax_amount = parseInt(withTax_amount)

                        let withoutTax_amount = data.withoutTax_amount;
                        withoutTax_amount = parseInt(withoutTax_amount)

                        let tax_amount = data.tax_amount;
                        tax_amount = parseInt(tax_amount)

                        let tax_percentage = data.tax_percentage;
                        tax_percentage = parseInt(tax_percentage)

                        let cgst = data.cgst;
                        cgst = parseInt(cgst)

                        let sgst = data.sgst;
                        sgst = parseInt(sgst)

                        let igst = data.igst;
                        igst = parseInt(igst)

                        let updatedAt = data.updatedAt;
                        let year = updatedAt.getFullYear();
                        let mes = updatedAt.getMonth() + 1;
                        let dia = updatedAt.getDate();
                        let orderDate = year + "-0" + mes + "-" + dia;
                        // console.log("ttttttttt",dia,mes,year);
                        let orderDated_show = dia + "-0" + mes + "-" + year;



                        product_Data.push({ productName: productData[j].product_name, id: productData[j]._id, product_quantity: product_quantity, withTax_amount: withTax_amount, withoutTax_amount: withoutTax_amount, tax_amount: tax_amount, tax_percentage: tax_percentage, tax_type: data.tax_type, cgst: cgst, sgst: sgst, igst: igst, orderDate: orderDate,orderDated_show: orderDated_show })
                    }

                }

            }
            // console.log("orderData   ------>>>   ", product_Data);

            var finalArr = product_Data.reduce((m, o) => {
                var found = m.find(p => p.productName === o.productName && p.orderDate === o.orderDate);
                if (found) {
                    found.product_quantity += o.product_quantity;
                    found.withTax_amount += o.withTax_amount;
                    found.withoutTax_amount += o.withoutTax_amount;
                    found.tax_amount += o.tax_amount;
                    found.tax_percentage;
                    found.cgst += o.cgst;
                    found.sgst += o.sgst;
                    found.igst += o.igst;

                } else {
                    m.push(o);
                }
                return m;
            }, []);



            let count = finalArr.length

            if ((req.params.startDate != undefined || req.params.startDate) && (req.params.endDate != undefined || req.params.endDate)) {
                console.log("lllllllllll");
                let newProduct_Data = [];

                for (let d = 0; d < finalArr.length; d++) {
                    if (finalArr[d].orderDate >= req.params.startDate && finalArr[d].orderDate <= req.params.endDate) {
                        newProduct_Data.push(finalArr[d])
                    }

                }

                let count = newProduct_Data.length
                // console.log("orderData datewise  ------>>>   ", newProduct_Data);



                var obj = {
                    'draw': req.query.draw,
                    'recordsTotal': count,
                    'recordsFiltered': count,
                    'data': newProduct_Data,

                };

                res.send(obj);

            } else {

                var obj = {
                    'draw': req.query.draw,
                    'recordsTotal': count,
                    'recordsFiltered': count,
                    'data': finalArr,

                };
                // console.log("orderData datewise  --oooooo---->>>   ", product_Data);

                res.send(obj);

            }



        } catch (e) {
            console.log("Error in ProductController in getProduct", e);
        }
    },

    // editOrderPostData: async function (req, res) {



    //     // relatable_product :req.body.relatable_product,

    //     console.log("update data body ========>>>>>>>>", req.body);
    //     // console.log("update files ========>>>>>>>>", req.files);

    //     // return false;
    //     try {
    //         let product = await Sys.App.Services.ProductServices.getProductData({ _id: req.params.id, is_deleted: "0" });



    //         // console.log("edit product =====>>>>>", product);


    //         // return false;
    //         var updated_img = product.product_image;



    //         var defaultImg1 = product.product_defaultImg;



    //         var pdfsFile = product.product_pdf ? product.product_pdf : [];

    //         var defaultImg = product.product_defaultImg ? product.product_defaultImg : [];


    //         let productVisibility = req.body.product_Visibility;

    //         if (req.body.product_Visibility == undefined || req.body.product_Visibility == null) {
    //             productVisibility = "0";
    //         }

    //         let apply_discount = "0";

    //         if (req.body.apply_discount1) {
    //             apply_discount = req.body.apply_discount1;
    //         }

    //         let productData = [];
    //         var productfile = [];
    //         let updateData = {


    //             product_visibility: productVisibility,
    //             product_name: req.body.product_name,
    //             relatable_product: req.body.relatable_product,
    //             // product_image: productfile,
    //             product_description: req.body.product_description,
    //             // product_category:req.body.product_category,
    //             // product_id: product_id,
    //             hsn_code: req.body.hsn_code,
    //             GST_rate: req.body.gst_percentage,
    //             attribute_set: req.body.attribute_set,
    //             venodor_id: req.session.details.id,
    //             venodor_name: req.session.details.name,
    //             attribute_set: req.body.attribute_set,
    //             product_sku: req.body.product_sku,
    //             product_price: req.body.product_price,//.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(","),
    //             tax_class: req.body.tax_class,
    //             discount_price :req.body.discount_price,//.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(","),
    //             product_stock_quantity: req.body.product_quantity,
    //             product_stock_status: req.body.stock_status,
    //             product_weight: req.body.product_weight,
    //             weight_type: req.body.weight_type,
    //             product_category: req.body.product_category,
    //             product_featured: req.body.product_featured,
    //             product_color: req.body.product_color,
    //             product_size: req.body.product_size,
    //             discount_percentage :req.body.discount_percentage,
    //             is_discount:apply_discount,
    //             discount_value :req.body.discount_value,


    //             product_startdate: req.body.product_startDate,
    //             product_enddate: req.body.product_endDate,
    //             product_country_manufacture: req.body.product_country,
    //             product_brand: req.body.brand,
    //             product_model_arr: req.body.model_arr,
    //             series_Type: req.body.series_Type,
    //             pump_Moc: req.body.pump_Moc,
    //             impeller_Moc: req.body.impeller_Moc,
    //             flange_Conn: req.body.flange_Conn,
    //             inlet_Flange: req.body.inlet_Flange,
    //             model_Number: req.body.model_Number,
    //             outlet_flange: req.body.outlet_flange,
    //             impeller_Type: req.body.impeller_Type,
    //             impeller_Size: req.body.impeller_Size,
    //             seal_Type: req.body.seal_Type,
    //             seal_Size: req.body.seal_Size,
    //             shaft_Sleeve: req.body.shaft_Sleeve,
    //             shaft_Moc: req.body.shaft_Moc,
    //             product_mawp: req.body.mawp,
    //             product_mawt: req.body.mawt,
    //             product_mcsf: req.body.mcsf,
    //             product_bep: req.body.bep,
    //             rated_Rpm: req.body.rated_Rpm,
    //             driver_Range: req.body.driver_Range,
    //             bearting_Ib: req.body.bearting_Ib,
    //             bearting_Ob: req.body.bearting_Ob,
    //             lubrication: req.body.lubrication,
    //             packing_Size: req.body.packing_Size,
    //             weight_Kg: req.body.weight_Kg,
    //             pump_Tech: req.body.pump_Tech,
    //             product_url_Key: req.body.url_Key,
    //             meta_Title: req.body.meta_Title,
    //             meta_Keywords: req.body.meta_Keywords,
    //             meta_Decription: req.body.meta_Decription,
    //         }
    //         if (product) {


    //             if (req.files) {

    //                 // console.log("req.files.productImage ====>>>", req.files.productImage);

    //                 if (req.files.productImage) {
    //                     let image1 = req.files.productImage;
    //                     updateData.product_image = updated_img;
    //                     if (Array.isArray(req.files.productImage) != false) {
    //                         console.log("ifffff");
    //                         for (let i = 0; i < image1.length; i++) {
    //                             var re = /(?:\.([^.]+))?$/;
    //                             var ext1 = re.exec(image1[i].name)[1];
    //                             let name = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext1;
    //                             let productImg = '/productImage/' + name;
    //                             // Use the mv() method to place the file somewhere on your server
    //                             await image1[i].mv('./public/productImage/' + name, async function (err) {
    //                                 if (err) {
    //                                     req.flash('Error in ProductController in postProduct', err);
    //                                     return res.redirect('/backend/product/addProduct');
    //                                 }
    //                             });
    //                             let type = 'video'
    //                             if (ext1 != 'mp4') {
    //                                 type = 'image'
    //                             }
    //                             updated_img.push({ path: '/productImage/' + name, fileName: req.files.productImage[i].name, _id: new mongoose.Types.ObjectId(), is_deleted: "0", type: type })
    //                             //   productfile.push({ path: '/productImage/' + name, fileName: req.files.productImage[i].name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
    //                             // console.log("productfileupdate>>", productfile);
    //                         }
    //                     }
    //                     else {
    //                         console.log("single image is here");
    //                         let singleimage_p = req.files.productImage;
    //                         console.log("Image", singleimage_p);
    //                         var re = /(?:\.([^.]+))?$/;
    //                         var ext6 = re.exec(singleimage_p.name)[1];
    //                         let singleImage_P = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext6;
    //                         let singleImg = '/productImage/' + singleImage_P;
    //                         // Use the mv() method to place the file somewhere on your server
    //                         await singleimage_p.mv('./public/productImage/' + singleImage_P, async function (err) {
    //                             if (err) {
    //                                 req.flash('Error in OurTeamController in postOurTeam', err);
    //                                 return res.redirect('ourTeam/addOurTeam');
    //                             }
    //                         });
    //                         let type = 'video'
    //                         if (ext6 != 'mp4') {
    //                             type = 'image'
    //                         }


    //                         updated_img.push({ path: '/productImage/' + singleImage_P, fileName: req.files.productImage.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0", type: type })
    //                     }

    //                 }

    //                 if (req.files.productAtt) {

    //                     let product_pdf = req.files.productAtt;

    //                     updateData.product_pdf = pdfsFile;


    //                     let headingName = req.body.productPdfName;


    //                     if (Array.isArray(req.files.productAtt) != false) {

    //                         for (let i = 0; i < product_pdf.length; i++) {

    //                             var re = /(?:\.([^.]+))?$/;
    //                             var ext3 = re.exec(product_pdf[i].name)[1];

    //                             var productPdf = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext3;
    //                             // console.log("productPdf[[]]", productPdf);

    //                             var productFile = '/productPdf/' + productPdf;
    //                             console.log("PRODUCT FILE inside for loop ", productFile);


    //                             await product_pdf[i].mv('./public/productPdf/' + productPdf, async function (err) {

    //                                 if (err) {
    //                                     req.flash('Error in ProductController in postProduct', err);
    //                                     return res.redirect('/backend/product/addProduct');
    //                                 }
    //                             });

    //                             // if(req.body.pdf__FileId == )
    //                             pdfsFile.push({ path: '/productPdf/' + productPdf, heading: headingName[i], fileName: req.files.productAtt[i].name, _id: create_Id(), is_deleted: "0" })

    //                             console.log("Mutiple file");


    //                             if (req.body.productPdfNameEdit) {

    //                                 for (let i = 0; i < product.product_pdf.length; i++) {

    //                                     if (product.product_pdf[i].is_deleted == "0") {



    //                                         for (let j = 0; j < req.body.pdf__FileId.length; j++) {

    //                                             if (product.product_pdf[i]._id == req.body.pdf__FileId[j]) {

    //                                                 product.product_pdf[i].heading = req.body.productPdfNameEdit[j];

    //                                             }

    //                                         }
    //                                     }

    //                                     updateData.product_pdf = product.product_pdf;
    //                                 }

    //                             }

    //                         }
    //                     } else {
    //                         console.log("product_pdf =======>> else 1111 ===", product_pdf);

    //                         // if (Array.isArray(req.files.productAtt) != false) {
    //                         // console.log("product_pdf =======>> else ===", product_pdf);

    //                         var re = /(?:\.([^.]+))?$/;
    //                         var ext3 = re.exec(product_pdf.name)[1];

    //                         var productPdf = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext3;
    //                         console.log("productPdf[[]]", productPdf);

    //                         var productFile = '/productPdf/' + productPdf;
    //                         console.log("PRODUCT FILE inside for loop ", productFile);


    //                         await product_pdf.mv('./public/productPdf/' + productPdf, async function (err) {

    //                             if (err) {
    //                                 req.flash('Error in ProductController in postProduct', err);
    //                                 return res.redirect('/backend/product/addProduct');
    //                             }
    //                         });


    //                         pdfsFile.push({ path: '/productPdf/' + productPdf, heading: req.body.productPdfName, fileName: req.files.productAtt.name, _id: create_Id(), is_deleted: "0" })


    //                         if (req.body.productPdfNameEdit) {

    //                             for (let i = 0; i < product.product_pdf.length; i++) {
    //                                 if (product.product_pdf[i].is_deleted == "0") {


    //                                     if (typeof req.body.productPdfNameEdit === "object") {

    //                                         for (let j = 0; j < req.body.pdf__FileId.length; j++) {

    //                                             if (product.product_pdf[i]._id == req.body.pdf__FileId[j]) {

    //                                                 product.product_pdf[i].heading = req.body.productPdfNameEdit[j];

    //                                             }

    //                                         }

    //                                     } else {
    //                                         product.product_pdf[i].heading = req.body.productPdfNameEdit;
    //                                     }

    //                                 }
    //                                 updateData.product_pdf = product.product_pdf;

    //                             }


    //                         }


    //                     }

    //                 }


    //                 if (req.files.productAttEdit) {
    //                     let productAttEdit1 = req.files.productAttEdit;

    //                     if (Array.isArray(req.files.productAttEdit) != false) {


    //                         for (let i = 0; i < product.product_pdf.length; i++) {

    //                             if (product.product_pdf[i].is_deleted == "0") {


    //                                 for (let kk = 0; kk < req.body.pdfadd.length; kk++) {

    //                                     console.log("if ====== >>>>>", req.body.pdfadd[kk], product.product_pdf[i]._id);

    //                                     if (product.product_pdf[i]._id == req.body.pdfadd[kk]) {


    //                                         var re = /(?:\.([^.]+))?$/;
    //                                         var ext3 = re.exec(productAttEdit1[kk].name)[1];

    //                                         var productPdf = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext3;

    //                                         var productFile = '/productPdf/' + productPdf;

    //                                         await productAttEdit1[kk].mv('./public/productPdf/' + productPdf, async function (err) {

    //                                             if (err) {
    //                                                 req.flash('Error in ProductController in postProduct', err);
    //                                                 return res.redirect('/backend/product/addProduct');
    //                                             }
    //                                         });

    //                                         product.product_pdf[i].path = '/productPdf/' + productPdf;
    //                                         product.product_pdf[i].fileName = req.files.productAttEdit[kk].name;

    //                                     }

    //                                     for (let j = 0; j < req.body.pdf__FileId.length; j++) {

    //                                         if (product.product_pdf[i]._id == req.body.pdf__FileId[j]) {

    //                                             product.product_pdf[i].heading = req.body.productPdfNameEdit[j];

    //                                         }

    //                                     }

    //                                 }
    //                             }
    //                             updateData.product_pdf = product.product_pdf;

    //                         }


    //                     } else {


    //                         for (let i = 0; i < product.product_pdf.length; i++) {


    //                             if (product.product_pdf[i].is_deleted == "0") {


    //                                 if (product.product_pdf[i]._id == req.body.pdfadd) {



    //                                     console.log("hdidiwdwedwedweidwede", product.product_pdf[i].heading, req.body.productPdfNameEdit);

    //                                     var re = /(?:\.([^.]+))?$/;
    //                                     var ext3 = re.exec(productAttEdit1.name)[1];

    //                                     var productPdf = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext3;
    //                                     console.log("productPdf[[]]", productPdf);

    //                                     var productFile = '/productPdf/' + productPdf;
    //                                     console.log("PRODUCT FILE inside for loop ", productFile);


    //                                     await productAttEdit1.mv('./public/productPdf/' + productPdf, async function (err) {

    //                                         if (err) {
    //                                             req.flash('Error in ProductController in postProduct', err);
    //                                             return res.redirect('/backend/product/addProduct');
    //                                         }
    //                                     });

    //                                     product.product_pdf[i].path = '/productPdf/' + productPdf;

    //                                     product.product_pdf[i].fileName = req.files.productAttEdit.name;

    //                                 }



    //                                 if (typeof req.body.productPdfNameEdit === "object") {

    //                                     for (let j = 0; j < req.body.pdf__FileId.length; j++) {

    //                                         if (product.product_pdf[i]._id == req.body.pdf__FileId[j]) {

    //                                             product.product_pdf[i].heading = req.body.productPdfNameEdit[j];

    //                                         }

    //                                     }

    //                                 } else {
    //                                     product.product_pdf[i].heading = req.body.productPdfNameEdit;
    //                                 }

    //                             }
    //                             updateData.product_pdf = product.product_pdf;
    //                         }
    //                     }
    //                 }


    //                 if (req.files.productImageDef) {

    //                     updateData.product_defaultImg = defaultImg;
    //                     let singleimage_p = req.files.productImageDef;

    //                     if (product.product_defaultImg) {



    //                         for (let i = 0; i < product.product_defaultImg.length; i++) {

    //                             if (product.product_defaultImg[i].is_deleted == "0") {

    //                                 console.log("asjdasjdasjdjas ===== >>>", product.product_defaultImg[i]);


    //                                 if (product.product_defaultImg[i]._id.toString() == req.body.productImgIdd) {


    //                                     console.log("Image", singleimage_p);
    //                                     var re = /(?:\.([^.]+))?$/;
    //                                     var ext6 = re.exec(singleimage_p.name)[1];
    //                                     let singleImage_P = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext6;
    //                                     let singleImg = '/defaultImage/' + singleImage_P;
    //                                     // Use the mv() method to place the file somewhere on your server
    //                                     await singleimage_p.mv('./public/defaultImage/' + singleImage_P, async function (err) {
    //                                         if (err) {
    //                                             req.flash('Error in OurTeamController in postOurTeam', err);
    //                                             return res.redirect('ourTeam/addOurTeam');
    //                                         }
    //                                     });

    //                                     product.product_defaultImg[i].path = '/defaultImage/' + singleImage_P;

    //                                     product.product_defaultImg[i].fileName = req.files.productImageDef.name;

    //                                 }


    //                                 // defaultImg.push({ path: '/defaultImage/' + singleImage_P, fileName: req.files.productImageDef.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
    //                             }

    //                             updateData.product_defaultImg = product.product_defaultImg;


    //                         }

    //                     } else {


    //                         updateData.product_defaultImg = defaultImg1;

    //                         // let defaultImg1 = [];


    //                         let singleimage_p = req.files.productImageDef;
    //                         console.log("Image", singleimage_p);
    //                         var re = /(?:\.([^.]+))?$/;
    //                         var ext6 = re.exec(singleimage_p.name)[1];
    //                         let singleImage_P = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext6;
    //                         let singleImg = '/defaultImage/' + singleImage_P;
    //                         // Use the mv() method to place the file somewhere on your server
    //                         await singleimage_p.mv('./public/defaultImage/' + singleImage_P, async function (err) {
    //                             if (err) {
    //                                 req.flash('Error in OurTeamController in postOurTeam', err);
    //                                 return res.redirect('ourTeam/addOurTeam');
    //                             }
    //                         });

    //                         defaultImg1.push({ path: '/defaultImage/' + singleImage_P, fileName: req.files.productImageDef.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })

    //                     }
    //                 }

    //             } else {



    //                 if (req.body.productPdfNameEdit) {
    //                     // let productAttEdit1 = req.files.productAttEdit;

    //                     let headingNew = req.body.productPdfNameEdit;

    //                     // let object;

    //                     let typeHeadingNew = typeof headingNew;

    //                     // console.log("dsdasdas", typeHeadingNew);

    //                     if (typeHeadingNew === "object") {


    //                         // console.log("objectobjectobjectobjectobject22222");


    //                         if (headingNew.length > 1) {

    //                             for (let i = 0; i < product.product_pdf.length; i++) {

    //                                 // console.log("33333333333333333333333333",product.product_pdf[i].is_deleted );

    //                                 if (product.product_pdf[i].is_deleted == "0") {
    //                                     // console.log("4444444444444444444444444444444444444444444",product.product_pdf[i]);

    //                                     for (let j = 0; j < req.body.pdf__FileId.length; j++) {


    //                                         // if(eq.body.pdf__FileId[i] )
    //                                         // console.log("array heding ======>>>>>>", product.product_pdf[i]._id, req.body.pdf__FileId[j]);

    //                                         if (product.product_pdf[i]._id == req.body.pdf__FileId[j]) {

    //                                             product.product_pdf[i].heading = req.body.productPdfNameEdit[j];
    //                                             // product.product_pdf[i].path = '/productPdf/' + productPdf;
    //                                             // product.product_pdf[i]._id = product.product_pdf[i]._id;
    //                                             // product.product_pdf[i].fileName = req.files.productAttEdit[i].name;
    //                                             // // product.product_pdf[i].is_deleted = "0";

    //                                         }

    //                                     }

    //                                 }
    //                                 updateData.product_pdf = product.product_pdf;

    //                             }
    //                         }
    //                     } else {
    //                         // console.log("stribg222222222222222");

    //                         for (let i = 0; i < product.product_pdf.length; i++) {


    //                             if (product.product_pdf[i].is_deleted == "0") {


    //                                 if (product.product_pdf[i]._id == req.body.pdf__FileId) {


    //                                     product.product_pdf[i].heading = req.body.productPdfNameEdit;
    //                                     // product.product_pdf[i].path = '/productPdf/' + productPdf;
    //                                     // product.product_pdf[i]._id = product.product_pdf[i]._id;
    //                                     // product.product_pdf[i].fileName = req.files.productAttEdit.name;
    //                                     // product.product_pdf[i].is_deleted = "0";
    //                                 }
    //                             }

    //                         }
    //                         updateData.product_pdf = product.product_pdf;

    //                     }
    //                 }
    //             }


    //             await Sys.App.Services.ProductServices.updateProductData({ _id: req.params.id }, updateData)

    //             req.flash('success', 'product updated successfully');
    //             return res.redirect('/backend/product');

    //         } else {
    //             req.flash('error', 'product not update successfully');
    //             return res.redirect('/backend/product');
    //         }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },

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

