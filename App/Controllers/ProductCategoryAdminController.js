var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");
// const flash = require('flash');
const { mongo } = require('mongoose');
const { url } = require('inspector');


module.exports = {

    list: async function (req, res) {
        try {
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                productCategory: 'active'
            };
            return res.render('backend/productCategory/listProductCategory', data);
        } catch (e) {
            console.log("Error in ProductCategoryController in list", e);
        }
    },

    getProductCategory: async function (req, res) {

        try {
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search.value;

            let query = {};
            if (search != '') {
                let capital = search;
                query = { productCategoryName: { $regex: '.*' + search + '.*' }, main_productId: req.params.id, is_deleted: "0" };
            } else {
                query = { main_productId: req.params.id, is_deleted: "0" };
            }

            let productCategoryCount = await Sys.App.Services.ProductCategoryServices.getProductCategoryCount(query);
            let data = await Sys.App.Services.ProductCategoryServices.getProductCategoryDatatable(query, length, start);
            var obj = {
                'draw': req.query.draw,
                'recordsTotal': productCategoryCount,
                'recordsFiltered': productCategoryCount,
                'data': data
            };
            res.send(obj);
        } catch (e) {
            console.log("Error in ProductCategoryController in getProductCategory", e);
        }
    },

    addProductCategory: async function (req, res) {
        try {
            let productCategory = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({ _id: req.params.id });

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                productCategory: 'active',
                productCategory: productCategory
            };
            return res.render('backend/productCategory/addProductCategory', data);
        } catch (e) {
            console.log("Error in ProductCategoryController in addProductCategory", e);
        }
    },

    postProductCategory: async function (req, res) {
        console.log(" session on category ===>>>>", req.session.details);

        console.log("postProductCategory body data  main =====>>>>>", req.body.productCategoryName);

        // return false;

        try {

            let subCategory_Name = req.body.productCategoryName;
            subCategory_Name = subCategory_Name.toLowerCase();
            subCategory_Name = subCategory_Name.split(' ').join('_');
            let replacementString = '-';
            subCategory_Name = subCategory_Name.replace(/\//g, replacementString);
            //end of new code
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({
                productCategoryName: req.body.productCategoryName,
            });

            let productCategory_Data = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({
                category_name: subCategory_Name, is_deleted: "0"
            });


            console.log("productCategoryData ==== >>>", productCategory_Data);

            // return false;
            if (productCategory_Data) {

                let productMsg = productCategory_Data.productCategoryName + " " + "Already Exists!";
                req.flash('error', productMsg);

                var data = {
                    App: req.session.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    productCategory: 'active'
                };
                return res.render('backend/productCategory/listProductCategory', data);

                // console.log("Product Category already Exists!");
                // return res.redirect('/backend/productCategory');

            } else {

                if (productCategoryData && productCategoryData.length) {

                    // await Sys.App.Services.ProductCategoryServices.updateProductCategoryData(
                    //     {
                    //         category_name: subCategory_Name,
                    //     }

                    // )
                    let productMsg = productCategory_Data.productCategoryName + " " + "Already Exists!";
                    req.flash('error', productMsg);

                    var data = {
                        App: req.session.details,
                        error: req.flash("error"),
                        success: req.flash("success"),
                        productCategory: 'active'
                    };
                    return res.render('backend/productCategory/listProductCategory', data);
                } else {
                    await Sys.App.Services.ProductCategoryServices.insertProductCategoryData({
                        productCategoryName: req.body.productCategoryName, category_name: subCategory_Name,
                    })
                    console.log(req.body.is_separateCategory, "is_separateCategory>>>>>>>>>");
                    req.flash('success', "Product Category inserted Successfully!")
                    // return res.redirect('/backend/productCategory');
                    var data = {
                        App: req.session.details,
                        error: req.flash("error"),
                        success: req.flash("success"),
                        productCategory: 'active'
                    };
                    return res.render('backend/productCategory/listProductCategory', data);
                }
            }

        } catch (error) {
            console.log("Error in ProductCategoryController in postProductCategory", error);
        }
    },

    productCategoryDelete: async function (req, res) {
        try {
            let productCategory = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({ _id: req.body.id });
            if (productCategory || productCategory.length > 0) {
                await Sys.App.Services.ProductCategoryServices.updateProductCategoryData(
                    { _id: req.body.id },
                    {
                        is_deleted: "1"
                    }
                )
                return res.send("success");
            } else {
                return res.send("error in ProductCategoryController in productCategoryDelete");
            }
        } catch (e) {
            console.log("Error in ProductCategoryController in productCategoryDelete", e);
        }
    },

    pdfDelete: async function (req, res) {
        try {

            let product = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({ _id: req.body.id })
            console.log("{{{{{PDF ID}}}}", req.body._id,);
            console.log("================");
            // console.log("[[[[[[[[[[[PRODUCT]]]]]]", product);

            if (product) {
                for (let index = 0; index < product.product_pdf.length; index++) {
                    var element = product.product_pdf[index];
                    console.log("PDF DATA", element);


                    if (element._id == req.body._id) {
                        console.log("CLICKED ID FOUND");
                        await Sys.App.Services.ProductCategoryServices.deletePdf(
                            { _id: req.body.id },
                            {
                                $pull: { 'product_pdf': { _id: req.body._id } }
                            }
                        )
                        return res.send("success");

                    }
                }

            } else {
                return res.send("error in ProductCategoryController in productDelete");
            }

        } catch (error) {
            console.log("Error in productCategoryController in pdfDelete", error);
        }
    },

    editProductCategory: async function (req, res) {
        try {
            let productCategory = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({ _id: req.params.id });
            console.log("productCategory", productCategory);
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                productCategorydata: productCategory,
                productCategory: 'active'

            };
            return res.render('backend/productCategory/addProductCategory', data);
        } catch (e) {
            console.log("Error in ProductCategoryController in editProductCategory", e);
        }

    },

    editProductCategoryPostData: async function (req, res) {
        try {

            let subCategory_Name = req.body.productCategoryName;
            subCategory_Name = subCategory_Name.toLowerCase();
            subCategory_Name = subCategory_Name.split(' ').join('_');
            let replacementString = '-';
            subCategory_Name = subCategory_Name.replace(/\//g, replacementString);

            let productCategory = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({ _id: req.params.id });

            if (productCategory) {
                let updateData = {
                    productCategoryName: req.body.productCategoryName, category_name: subCategory_Name,
                }

                await Sys.App.Services.ProductCategoryServices.updateProductCategoryData({ _id: req.params.id }, updateData)
                console.log(req.body.is_separateCategory, "is_separateCategory UPdate>>>>>>>>>");

                req.flash('success', "User update successfully")
                res.redirect('/backend/productCategory')


            } else {
                req.flash('error', 'Product Category not update successfully')
                return res.redirect('/backend/productCategory');
            }
        } catch (e) {
            console.log("Error", e);
        }
    },

    list_sub_productCategory: async function (req, res) {

        console.log("list_sub_productCategory ===>>>", req.params);
        try {
            let productCategory;
            console.log("req.params", req.params);
            if (req.params.main_productId) {
                productCategory = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({ _id: req.params.id, main_productId: req.params.main_productId });
            } else {
                productCategory = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({ _id: req.params.id });
            }
            console.log("productCategory_subid----", productCategory);
            // console.log("productCategory_subid----", productCategory.main_productId);

            var productCategoryId = req.params.id;
            var productCategory_subid;
            if (productCategory.main_productId != null) { productCategory_subid = productCategory.main_productId }
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                productCategory: 'active',
                productCategoryId: productCategoryId,
                productCategory_subid: productCategory_subid
            };
            // console.log("productCategoryId",productCategoryId);
            return res.render('backend/productCategory/list_sub_productCategory', data);
        } catch (e) {
            console.log("Error in ProductCategoryController in list", e);
        }
    },

    get_sub_productCategory: async function (req, res) {

        // console.log("req.eseeop ============>>",req.session.details);

        try {
            // console.log("callll",req.query);
            console.log("req.p", req.params);
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search.value;

            let query = {};
            if (search != '') {
                let capital = search;
                query = { productCategoryName: { $regex: '.*' + search + '.*' }, main_productId: req.params.id, account_id: req.session.details.account_id, is_deleted: "0" };
            } else {
                query = { main_productId: req.params.id, account_id: req.session.details.account_id, is_deleted: "0" };
            }

            let productCategoryCount = await Sys.App.Services.ProductCategoryServices.getProductCategoryCount(query);
            let data = await Sys.App.Services.ProductCategoryServices.getProductCategoryDatatable(query, length, start);
            var obj = {
                'draw': req.query.draw,
                'recordsTotal': productCategoryCount,
                'recordsFiltered': productCategoryCount,
                'data': data
            };
            res.send(obj);
        } catch (e) {
            console.log("Error in ProductCategoryController in getProductCategory", e);
        }
    },

    add_sub_productCategory: async function (req, res) {
        // console.log("add sub data ============>>>>>>",req.params);
        try {
            let productCategoryMainId = []
            let productCategory = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({ _id: req.params.id });
            let productCategoryAllData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0", account_id: req.session.details.account_id });

            for (let d = 0; d < productCategoryAllData.length; d++) {
                if (productCategory._id == productCategoryAllData[d].main_productId) {
                    productCategoryMainId.push(productCategoryAllData[d].main_productId)
                }

            }


            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                productCategory: 'active',
                productCategorydata: productCategory,
                productCategoryMainId: productCategoryMainId,
                add_post: 'add_post'
            };



            // console.log("add_sub_productCategory ==>>",productCategoryMainId);
            return res.render('backend/productCategory/add_sub_productCategory', data);
        } catch (e) {
            console.log("Error in ProductCategoryController in addProductCategory", e);
        }
    },

    add_sub_post_productCategory: async function (req, res) {

        // console.log("session on addsubcategory ===>>", req.session.details.account_id);

        // console.log("req.body ===========>>>>>", req.body);


        try {

            let subCategory_Name = req.body.productCategoryName;
            subCategory_Name = subCategory_Name.trim();
            subCategory_Name = subCategory_Name.toLowerCase();
            subCategory_Name = subCategory_Name.split(' ').join('_');
            let replacementString = '-';
            subCategory_Name = subCategory_Name.replace(/\//g, replacementString);

            // console.log("subCategory_Name ====>>>>",subCategory_Name);

        // return false;


            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({
                category_name: subCategory_Name, is_deleted: "0"
            });

            let productCategoryData_name = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({
                category_name: subCategory_Name, is_deleted: "0", account_id: req.session.details.account_id
            });
            // console.log("productCategoryData_name", productCategoryData_name);

            if (productCategoryData_name != null) {

                let mesError = productCategoryData_name.productCategoryName + " " + "Already Exists!";
                let product_categortId = req.body.productCategorydata_id;

                req.flash('error', mesError);
                var data = {
                    App: req.session.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    productCategory: 'active',
                    productCategoryId: product_categortId,
                };


                return res.render('backend/productCategory/list_sub_productCategory', data);
            } else {


                if (productCategoryData) {
                    // console.log("productCategoryData", productCategoryData);


                    if (productCategoryData.category_name == subCategory_Name && productCategoryData.main_productId == null && productCategoryData.main_sub_productId == null) {
                        // console.log("hasdasudwwhweuewurhwer");

                        let mesError = productCategoryData.productCategoryName + " " + "Already Exists!";
                        let product_categortId = req.body.productCategorydata_id;

                        req.flash('error', mesError);
                        var data = {
                            App: req.session.details,
                            error: req.flash("error"),
                            success: req.flash("success"),
                            productCategory: 'active',
                            productCategoryId: product_categortId,
                        };
                        return res.render('backend/productCategory/list_sub_productCategory', data);
                    } else {


                        if (req.body.main_productId) {
                            await Sys.App.Services.ProductCategoryServices.insertProductCategoryData(
                                { productCategoryName: req.body.productCategoryName, main_productId: req.body.productCategorydata_id, main_sub_productId: req.body.main_productId, category_name: subCategory_Name, account_id: req.session.details.account_id })
                        } else {
                            await Sys.App.Services.ProductCategoryServices.insertProductCategoryData(
                                { productCategoryName: req.body.productCategoryName, main_productId: req.body.productCategorydata_id, category_name: subCategory_Name, account_id: req.session.details.account_id, })
                        }
                        req.flash('success', " inserted Successfully!")
                        var productCategoryId = req.body.productCategorydata_id;
                        var data = {
                            App: req.session.details,
                            error: req.flash("error"),
                            success: req.flash("success"),
                            productCategory: 'active',
                            productCategoryId: productCategoryId
                        };
                        return res.render('backend/productCategory/list_sub_productCategory', data);

                    }
                } else {

                    if (req.body.main_productId) {
                        await Sys.App.Services.ProductCategoryServices.insertProductCategoryData(
                            { productCategoryName: req.body.productCategoryName, main_productId: req.body.productCategorydata_id, main_sub_productId: req.body.main_productId, category_name: subCategory_Name, account_id: req.session.details.account_id })
                    } else {
                        await Sys.App.Services.ProductCategoryServices.insertProductCategoryData(
                            { productCategoryName: req.body.productCategoryName, main_productId: req.body.productCategorydata_id, category_name: subCategory_Name, account_id: req.session.details.account_id, })
                    }
                    req.flash('success', " inserted Successfully!")
                    var productCategoryId = req.body.productCategorydata_id;
                    var data = {
                        App: req.session.details,
                        error: req.flash("error"),
                        success: req.flash("success"),
                        productCategory: 'active',
                        productCategoryId: productCategoryId
                    };
                    return res.render('backend/productCategory/list_sub_productCategory', data);
                }

            }

        } catch (error) {
            console.log("Error in ProductCategoryController in postProductCategory", error);
        }
    },

    edit_sub_productCategory: async function (req, res) {
        try {
            let productCategory = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({ _id: req.params.id, main_productId: req.params.main_productId });
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                productCategorydata: productCategory,
                productCategory: 'active',
                add_post: 'edit_post'



            };

            return res.render('backend/productCategory/add_sub_productCategory', data);
        } catch (e) {
            console.log("Error in ProductCategoryController in editProductCategory", e);
        }

    },

    edit_sub_post_productCategory: async function (req, res) {
        try {
            let subCategory_Name = req.body.productCategoryName;
            subCategory_Name = subCategory_Name.trim();
            subCategory_Name = subCategory_Name.toLowerCase();
            subCategory_Name = subCategory_Name.split(' ').join('_');
            let replacementString = '-';
            subCategory_Name = subCategory_Name.replace(/\//g, replacementString);

            let productCategory = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({ _id: req.body.productCategorydata_id, main_productId: req.body.main_productId });

            if (productCategory) {
                let updateData = {
                    productCategoryName: req.body.productCategoryName, category_name: subCategory_Name,
                }

                await Sys.App.Services.ProductCategoryServices.updateProductCategoryData({ _id: req.body.productCategorydata_id, main_productId: req.body.main_productId }, updateData)
                console.log(req.body.is_separateCategory, "is_separateCategory UPdate>>>>>>>>>");

                req.flash('success', "Sub Product Category updated successfully")
                // return res.redirect(`/backend/productCategory/list_sub_productCategory/${req.body.productCategorydata_id}`);
                var productCategoryId = productCategory.main_productId;
                var data = {
                    App: req.session.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    productCategory: 'active',
                    productCategoryId: productCategoryId
                };
                return res.render('backend/productCategory/list_sub_productCategory', data);
            } else {
                req.flash('error', 'Product Category not update successfully')
                var productCategoryId = req.body.main_productId;
                var data = {
                    App: req.session.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    productCategory: 'active',
                    productCategoryId: productCategoryId
                };
                return res.render('backend/productCategory/list_sub_productCategory', data);
                // return res.redirect('/backend/productCategory');
            }
        } catch (e) {
            console.log("Error", e);
        }
    },

    delete_sub_productCategory: async function (req, res) {
        try {
            console.log(">>>>>>>cfjsfklsdjfdsklfjsdklfjkfjs>>>>>", req.params);

            let menudata = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({ _id: req.params.id, main_productId: req.params.main_productId });
            if (menudata) {
                await Sys.App.Services.ProductCategoryServices.updateProductCategoryData(
                    { _id: req.params.id, main_productId: req.params.main_productId },
                    {
                        is_deleted: "1"
                    })
            }
            req.flash('success')
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                product_setting: 'active',
                //   menudata:menudata,
                //   menu_name:req.params._id
            };
            return res.send('success');
            //   console.log("delete");
            //   return false;
            //   return res.redirect('backend/product_setting');
        } catch (e) {
            console.log("Error in ProductController in delete_setting_menu", e);
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




















































