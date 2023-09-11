var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");
var mongoose = require('mongoose');
const datetime = require('date-and-time');



module.exports = {


    list: async function (req, res) {
        try {

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                discountActive: 'active',

            };
            // console.log("Datat", data);
            return res.render('backend/discount/list_discount', data);
        } catch (e) {
            console.log("Error in ProductController in list", e);
        }
    },

    getDiscount: async function (req, res) {

        console.log("get product data session  ====> ", req.session.details.account_id);

        try {
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search.value;

            let query = {};
            if (search != '') {
                let capital = search;
                query = { product_name: { $regex: '.*' + search + '.*' }, is_deleted: "0", is_discount: "1" };
                // query = { productCategoryName: { $regex: '.*' + search + '.*' }, is_deleted: "0" };

            } else {
                query = { is_deleted: "0", account_id: req.session.details.account_id, is_discount: "1" };
            }

            let productCount = await Sys.App.Services.ProductServices.getProductCount(query);
            let data = await Sys.App.Services.ProductServices.getProductDatatable(query, length, start);
            var obj = {
                'draw': req.query.draw,
                'recordsTotal': productCount,
                'recordsFiltered': productCount,
                'data': data,
            };
            // console.log('getProduct data', data);
            // console.log("categrrrrrrrydata", categoryname);
            res.send(obj);
        } catch (e) {
            console.log("Error in ProductController in getProduct", e);
        }
    },

    discountAdd: async function (req, res) {
        console.log(" product session  === >> ", req.session.details.account_id);

        try {

            let productData = await Sys.App.Services.ProductServices.getByData({
                is_deleted: "0", product_visibility: "1"
            });
            var d = new Date();
            // d.setDate(d.getDate() - 1);
            var previous_date = datetime.format(d, 'YYYY-MM-DD');
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                discountActive: 'active',
                productDatass: productData,
                previous_date: previous_date
            };
            // console.log("productCategoryData",productCategoryData);
            return res.render('backend/discount/discountAdd', data);
        } catch (e) {
            console.log("Error in ProductController in addProduct", e);
        }
    },

    discountAddPost: async function (req, res) {
        try {
            console.log("req.body, discount add:: ",req.body);
            if(req.body.product_select == "selectAll"){
                let product_select = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0", product_visibility: "1" });

                for (let ps = 0; ps < product_select.length; ps++) {

                    let product = await Sys.App.Services.ProductServices.getProductData({ _id: product_select[ps]._id, is_deleted: "0" });
                

                    let finaValue = (product.product_price * req.body.discount_percentage) / 100

                    let newFinalValue = (Math.round(finaValue * 100) / 100).toFixed(2);
        
                    let disocunt_price = Math.ceil(product.product_price - finaValue);

                    let apply_discount = "0";

                    if (req.body.apply_discount1) {
                        apply_discount = req.body.apply_discount1;
                    }
        
                    let updateData = {
                        
                        discount_startDate : req.body.discount_startDate,
                        discount_endDate : req.body.discount_endDate,
                        // product_price: req.body.product_price,//.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(","),
                        discount_price: disocunt_price,//.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(","),
                        // product_category: req.body.product_category,
                        discount_percentage: req.body.discount_percentage,
                        is_discount: apply_discount,
                        discount_value: newFinalValue,
                      
                    }
                   
                    await Sys.App.Services.ProductServices.updateProductData({ _id: product._id }, updateData)
                } 
            } else {
                var product_select = req.body.product_select;

                if(typeof(req.body.product_select) == 'string'){
                    // for (let ps = 0; ps < product_select.length; ps++) {

                        let id = mongoose.Types.ObjectId(product_select);
                        
                        let product = await Sys.App.Services.ProductServices.getProductData({ _id: id, is_deleted: "0" });
                       
    
                        let finaValue = (product.product_price * req.body.discount_percentage) / 100
    
                        let newFinalValue = (Math.round(finaValue * 100) / 100).toFixed(2);
            
                        let disocunt_price = Math.ceil(product.product_price - finaValue);
    
                        let apply_discount = "0";
    
                        if (req.body.apply_discount1) {
                            apply_discount = req.body.apply_discount1;
                        }
            
                        let updateData = {
                            
                            discount_startDate : req.body.discount_startDate,
                            discount_endDate : req.body.discount_endDate,
                            // product_price: req.body.product_price,//.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(","),
                            discount_price: disocunt_price,//.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(","),
                            // product_category: req.body.product_category,
                            discount_percentage: req.body.discount_percentage,
                            is_discount: apply_discount,
                            discount_value: newFinalValue,
                          
                        }
                       
                        await Sys.App.Services.ProductServices.updateProductData({ _id: product._id }, updateData)
                    // } 

                }else{
                    for (let ps = 0; ps < product_select.length; ps++) {

                        let id = mongoose.Types.ObjectId(product_select[ps]);
                        
                        let product = await Sys.App.Services.ProductServices.getProductData({ _id: id, is_deleted: "0" });
                       
    
                        let finaValue = (product.product_price * req.body.discount_percentage) / 100
    
                        let newFinalValue = (Math.round(finaValue * 100) / 100).toFixed(2);
            
                        let disocunt_price = Math.ceil(product.product_price - finaValue);
    
                        let apply_discount = "0";
    
                        if (req.body.apply_discount1) {
                            apply_discount = req.body.apply_discount1;
                        }
            
                        let updateData = {
                            
                            discount_startDate : req.body.discount_startDate,
                            discount_endDate : req.body.discount_endDate,
                            // product_price: req.body.product_price,//.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(","),
                            discount_price: disocunt_price,//.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(","),
                            // product_category: req.body.product_category,
                            discount_percentage: req.body.discount_percentage,
                            is_discount: apply_discount,
                            discount_value: newFinalValue,
                          
                        }
                       
                        await Sys.App.Services.ProductServices.updateProductData({ _id: product._id }, updateData)
                    } 
                }
               
            }
            req.flash('success', 'Discount Apply Successfully');
            return res.redirect('/backend/discount');

        } catch (error) {
            console.log("Error in ProductController in postApplication", error);
        }
    },

    discountDelete: async function (req, res) {
        try {
            let product = await Sys.App.Services.ProductServices.getProductData({ _id: req.body.id, is_deleted: "0" });
            console.log("================");
            console.log("PRODUCTT", product);
            console.log("}}}}}}}}}}{{{{{{{{{");

            if (product || product.length > 0) {
                await Sys.App.Services.ProductServices.updateProductData(
                    { _id: req.body.id },
                    {
                        // discount_startDate : req.body.discount_startDate,
                        // discount_endDate : req.body.discount_endDate,
                        // product_price: req.body.product_price,//.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(","),
                        discount_price: "",//.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(","),
                        // product_category: req.body.product_category,
                        discount_percentage: "0",
                        is_discount: "0",
                        discount_value: "0",
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

    discountEdit: async function (req, res) {

        // console.log("req.seeee ooo ----->>", req.session.details);

        try {
         
            let productData = await Sys.App.Services.ProductServices.getProductData({ _id: req.params.id, is_deleted: "0" });
            let productDatass = await Sys.App.Services.ProductServices.getByData({
                is_deleted: "0", product_visibility: "1"
            });
            var d = new Date();
            // d.setDate(d.getDate() - 1);
            var previous_date = datetime.format(d, 'YYYY-MM-DD');
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                discountActive: 'active',
                productData: productData,
                productDatass: productDatass,
                previous_date: previous_date
            };

            // console.log("productData test  ====>>>", productData);

            return res.render('backend/discount/discountAdd', data);
        } catch (e) {
            console.log("Error in ProductController in editProduct", e);
        }

    },

    discountEditPost: async function (req, res) {

        console.log("update data body ========>>>>>>>>", req.body);
        try {

            let product = await Sys.App.Services.ProductServices.getProductData({ _id: req.params.id, is_deleted: "0" });

            let finaValue = (product.product_price * req.body.discount_percentage) / 100

            let newFinalValue = (Math.round(finaValue * 100) / 100).toFixed(2);

            let disocunt_price = Math.ceil(product.product_price - finaValue);

            let apply_discount = "0";

            if (req.body.apply_discount1) {
                apply_discount = req.body.apply_discount1;
            }

            let updateData = {
                
                discount_startDate : req.body.discount_startDate,
                discount_endDate : req.body.discount_endDate,
                // product_price: req.body.product_price,//.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(","),
                discount_price: req.body.discount_price,//.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(","),
                // product_category: req.body.product_category,
                discount_percentage: disocunt_price,
                is_discount: apply_discount,
                discount_value: newFinalValue,
              
            }
            if (product) {

                await Sys.App.Services.ProductServices.updateProductData({ _id: req.params.id }, updateData)

                req.flash('success', 'Discount Apply Successfully');
                return res.redirect('/backend/discount');

            } else {
                req.flash('error', 'Discount not apply successfully');
                return res.redirect('/backend/discount');
            }
        } catch (e) {
            console.log("Error", e);
        }
    },

 



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

