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
                product: 'active',

            };
            // console.log("Datat", data);
            return res.render('backend/product/listProduct', data);
        } catch (e) {
            console.log("Error in ProductController in list", e);
        }
    },

    getProduct: async function (req, res) {

        console.log("get product data session  ====> ", req.session.details.account_id);

        try {
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search.value;

            let query = {};
            if (search != '') {
                let capital = search;
                query = { product_name: { $regex: '.*' + search + '.*' }, is_deleted: "0" };
                // query = { productCategoryName: { $regex: '.*' + search + '.*' }, is_deleted: "0" };

            } else {
                query = { is_deleted: "0", account_id: req.session.details.account_id };
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

    addProduct: async function (req, res) {
        console.log(" product session  === >> ", req.session.details.account_id);

        try {

            // let query = {};
            // query = {is_separateCategory: "false" };
            // let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
            // let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
            let menudata = await Sys.App.Services.MenuServices.getByData({ is_deleted: "0" });

            console.log("product data ===>", menudata);

            let attributeData = await Sys.App.Services.AttributeServices.getByData({ vendor_id: req.session.details.id, menu_name:"attribute_set", is_deleted: "0" });



            let attribute_set, tax_class, color, size, brand, series_Type, seal_Type, shaft_Sleeve, model_Number;
            if (menudata) {
                for (let m = 0; m < menudata.length; m++) {
                    if (menudata[m].menu_name == "attribute_set") {
                        attribute_set = menudata[m].set_array;
                    }
                    if (menudata[m].menu_name == "tax_class") {
                        tax_class = menudata[m].set_array;
                    }
                    if (menudata[m].menu_name == "color") {
                        color = menudata[m].set_array;
                    }
                    if (menudata[m].menu_name == "size") {
                        size = menudata[m].set_array;
                    }
                    if (menudata[m].menu_name == "brand") {
                        brand = menudata[m].set_array;
                    }
                    if (menudata[m].menu_name == "series_type") {
                        series_Type = menudata[m].set_array;
                    }
                    if (menudata[m].menu_name == "seal_type") {
                        seal_Type = menudata[m].set_array;
                    }
                    if (menudata[m].menu_name == "shaft_sleeve") {
                        shaft_Sleeve = menudata[m].set_array;
                    }
                    if (menudata[m].menu_name == "model_number") {
                        model_Number = menudata[m].set_array;
                    }
                }
            }
            console.log("colllllllllllllllloooooooooooorrrr :: ", tax_class);
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
            let relateProduct = await Sys.App.Services.ProductServices.getByData({
                is_deleted: "0", product_visibility: "1"
            });


            let subarray = [];
            let setids = [];
            let new_sub_arr = [];
            let subproduct;
            let subof_subproduct = [];
            let finalarr = [];



            let subarray1 = [];

            for (let i = 0; i < relateProduct.length; i++) {
                subarray1.push(relateProduct[i])

            }


            //  console.log("subarray1 =====>>>",subarray1);

            // if (productCategoryData) {
            //     for (let p = 0; p < productCategoryData.length; p++) {

            //         if (productCategoryData[p].category_name == "accessories") {
            //             setids1.push({ prid: productCategoryData[p]._id, prname: productCategoryData[p].category_name })
            //         }
            //         for (let s = 0; s < setids1.length; s++) {

            //             if ((setids1[s].prid.toString() == productCategoryData[p].main_productId || setids1[s].prid.toString() == productCategoryData[p].main_sub_productId) && productCategoryData[p].account_id == req.session.details.account_id) {
            //                 subarray1.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, account_id: productCategoryData[p].account_id, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
            //             }
            //         }

            //     }

            // }

            // console.log(":::setids1:::",setids1);
            // console.log(":::subarray1:::",subarray1);


            if (productCategoryData) {
                for (let p = 0; p < productCategoryData.length; p++) {

                    if (productCategoryData[p].main_productId == null) {
                        setids.push(productCategoryData[p]._id)
                    }
                    for (let s = 0; s < setids.length; s++) {
                        if (setids[s] == productCategoryData[p].main_productId) {
                            subarray.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, account_id: productCategoryData[p].account_id, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
                        }
                    }
                    if (productCategoryData[p].main_productId != null && productCategoryData[p].main_sub_productId != null) {
                        new_sub_arr.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, account_id: productCategoryData[p].account_id, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
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
                            subproduct.push({ idids: subarray[ss].idids, name: subarray[ss].id, name: subarray[ss].name, itemname: str, account_id: subarray[ss].account_id, main_productId: subarray[ss].main_productId, main_sub_productId: subarray[ss].main_sub_productId, subof_subproduct: subof_subproduct })
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
                                    str = str.replace(" ", "_");
                                    finalarr.push({ idids: new_sub_arr[n].idids, name: new_sub_arr[n].id, name: new_sub_arr[n].name, itemname: str, account_id: new_sub_arr[n].account_id, main_productId: new_sub_arr[n].main_productId, main_sub_productId: new_sub_arr[n].main_sub_productId })
                                    // console.log(finalarr);
                                    productCategoryData[pr].subproduct[sr].subof_subproduct = finalarr

                                }


                            }
                        }
                    }
                    // console.log("productCategoryData[pr].subproduct", productCategoryData[pr].subproduct);
                }

            }

            // console.log("subarray subarray subarray =====>",subarray);
            var d = new Date();
            // d.setDate(d.getDate() - 1);
            var previous_date = datetime.format(d, 'YYYY-MM-DD');

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                product: 'active',
                menudata: menudata,
                attribute_set: attribute_set,
                tax_class: tax_class,
                color: color,
                size: size,
                brand: brand,
                series_Type: series_Type,
                seal_Type: seal_Type,
                shaft_Sleeve: shaft_Sleeve,
                model_Number: model_Number,
                subarray1: subarray1,
                // product_category: productCategory,
                productCategoryData: productCategoryData,
                attribute_set: attribute_set,
                attributeData: attributeData,
                previous_date: previous_date

                // productData:productData,
                // productCategoryData: productCategoryData
            };
            // console.log("productCategoryData",productCategoryData);
            return res.render('backend/product/addProduct', data);
        } catch (e) {
            console.log("Error in ProductController in addProduct", e);
        }
    },

    postProduct: async function (req, res) {

        // console.log("productAdmin session ", req.body.relatable_product);

        // return false;

        try {
            let productVisibility;
            // console.log("filesss>>>>>>>>>>>>", req.files);
            // console.log("productImage>>>>>>>>>>>", req.files.productImage);
            // console.log("product add body data >>>>>>>>>>>", req.body);

            let attributeData = await Sys.App.Services.AttributeServices.getByData({ vendor_id: req.session.details.id });
            //getProductData// let attribute_data = await Sys.App.Services.AttributeServices.getByData({ vendor_id: req.session.details.id });
            let attribute = [];
            if (attributeData) {
                for (let a = 0; a < attributeData.length; a++) {
                    console.log("attributeData[a].name--", attributeData[a].name);
                    let name = attributeData[a].name
                    console.log("req.body.attributeData[a].name", req.body[name]);
                    if (req.body[name]) {
                        let val = req.body[name];
                        attribute.push({ [name]: val, "group_id": req.body.attribute_set_id });
                    }
                }
            }
            // return false;
            var productfile = [];
            var defaultImg = [];
            let productData = [];
            var pdfs = [];


            //   console.log("Image", product_image);

            if (req.files) {

                if (req.files.productImage) {
                    let product_image = req.files.productImage;

                    if (Array.isArray(req.files.productImage) != false) {
                        for (let i = 0; i < product_image.length; i++) {
                            var re = /(?:\.([^.]+))?$/;
                            var extimg = re.exec(product_image[i].name)[1];
                            let productImage = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + extimg;
                            let productImg = '/productImage/' + productImage;
                            // Use the mv() method to place the file somewhere on your server
                            await product_image[i].mv('./public/productImage/' + productImage, async function (err) {
                                if (err) {
                                    req.flash('Error in ProductController in postProduct', err);
                                    return res.redirect('/backend/product/addProduct');
                                }
                            });
                            console.log("extension product img ====>>>", extimg);

                            let type = 'video'
                            if (extimg != 'mp4') {

                                // if (extimg != 'mp4' || extimg != 'mov' || extimg != 'wmv' || extimg != 'avi' || extimg != 'mkv' || extimg != 'webm') {
                                type = 'image'
                            }
                            productfile.push({ path: '/productImage/' + productImage, fileName: req.files.productImage[i].name, _id: new mongoose.Types.ObjectId(), type: type, is_deleted: "0" })
                        }
                    }
                    else {

                        let singleimage_p = req.files.productImage;
                        console.log("Image", singleimage_p);
                        var re = /(?:\.([^.]+))?$/;
                        var ext6 = re.exec(singleimage_p.name)[1];
                        let singleImage_P = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext6;
                        let singleImg = '/productImage/' + singleImage_P;
                        // Use the mv() method to place the file somewhere on your server
                        await singleimage_p.mv('./public/productImage/' + singleImage_P, async function (err) {
                            if (err) {
                                req.flash('Error in OurTeamController in postOurTeam', err);
                                return res.redirect('ourTeam/addOurTeam');
                            }
                        });




                        let type = 'video'
                        if (ext6 != 'mp4' || ext6 != 'mov' || ext6 != 'wmv' || ext6 != 'avi' || ext6 != 'mkv' || ext6 != 'webm') {

                            // if (ext6 != 'mp4') {

                            type = 'image'
                        }
                        productfile.push({ path: '/productImage/' + singleImage_P, fileName: req.files.productImage.name, _id: new mongoose.Types.ObjectId(), type: type, is_deleted: "0" })

                    }
                }


                if (req.files.productAtt) {

                    let product_pdf = req.files.productAtt;

                    // pdfs.push({heading : req.body.productPdf})
                    // console.log("product_pdf =======>>", product_pdf);

                    if (Array.isArray(req.files.productAtt) != false) {

                        console.log("product_pdf =======>> iffff ===", product_pdf);

                        for (let i = 0; i < product_pdf.length; i++) {


                            var re = /(?:\.([^.]+))?$/;
                            var ext3 = re.exec(product_pdf[i].name)[1];

                            var productPdf = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext3;
                            // console.log("productPdf[[]]", productPdf);

                            var productFile = '/productPdf/' + productPdf;
                            console.log("PRODUCT FILE inside for loop ", productFile);
                            console.log();

                            await product_pdf[i].mv('./public/productPdf/' + productPdf, async function (err) {

                                if (err) {
                                    req.flash('Error in ProductController in postProduct', err);
                                    return res.redirect('/backend/product/addProduct');
                                }
                            });
                            pdfs.push({ path: '/productPdf/' + productPdf, heading: req.body.productPdfName[i], fileName: req.files.productAtt[i].name, _id: create_Id(), is_deleted: "0" })

                            console.log("Mutiple file");
                        }
                    } else {
                        console.log("product_pdf =======>> else 1111 ===", product_pdf);

                        // if (Array.isArray(req.files.productAtt) != false) {
                        console.log("product_pdf =======>> else ===", product_pdf);

                        var re = /(?:\.([^.]+))?$/;
                        var ext3 = re.exec(product_pdf.name)[1];

                        var productPdf = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext3;
                        console.log("productPdf[[]]", productPdf);

                        var productFile = '/productPdf/' + productPdf;
                        console.log("PRODUCT FILE inside for loop ", productFile);


                        await product_pdf.mv('./public/productPdf/' + productPdf, async function (err) {

                            if (err) {
                                req.flash('Error in ProductController in postProduct', err);
                                return res.redirect('/backend/product/addProduct');
                            }
                        });
                        pdfs.push({ path: '/productPdf/' + productPdf, heading: req.body.productPdfName, fileName: req.files.productAtt.name, _id: create_Id(), is_deleted: "0" })
                        console.log("Single file>>>>", req.files.productAtt.name);

                        console.log("pdsfsdfsdfs", pdfs);

                    }
                }


                if (req.files.productImageDef) {
                    let singleimage_p = req.files.productImageDef;
                    console.log("Image", singleimage_p);
                    var re = /(?:\.([^.]+))?$/;
                    var ext6 = re.exec(singleimage_p.name)[1];
                    let singleImage_P = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext6;
                    let singleImg = '/defaultImage/' + singleImage_P;
                    // Use the mv() method to place the file somewhere on your server
                    await singleimage_p.mv('./public/defaultImage/' + singleImage_P, async function (err) {
                        if (err) {
                            req.flash('Error in OurTeamController in postOurTeam', err);
                            return res.redirect('ourTeam/addOurTeam');
                        }
                    });




                    defaultImg.push({ path: '/defaultImage/' + singleImage_P, fileName: req.files.productImageDef.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })

                }



            }

            let heading = req.body.heading
            let description = req.body.description
            if (Array.isArray(req.body.heading) == false) {
                productData.push({ heading: req.body.heading, description: req.body.description, _id: new mongoose.Types.ObjectId() })
            }
            else {
                console.log("wrokprocess else");
                for (let i = 0; i < req.body.heading.length; i++) {
                    productData.push({ heading: req.body.heading[i], description: req.body.description[i], _id: new mongoose.Types.ObjectId() });

                }

            }
            let duty = [];
            let duties = req.body.duties
            console.log(" Duty{{{{{{{{{}}}}}}}}}}", duty);
            if (Array.isArray(req.body.duties) == false) {
                console.log("iffffff");
                duty.push({ duties: req.body.duties, _id: new mongoose.Types.ObjectId() })
            }
            else {
                console.log("else is here ");
                for (let i = 0; i < req.body.duties.length; i++) {
                    duty.push({ duties: req.body.duties[i], _id: new mongoose.Types.ObjectId() });

                }

            }

           

            // let finaValue = (product.product_price * req.body.discount_percentage) / 100

            // let newFinalValue = (Math.round(finaValue * 100) / 100).toFixed(2);

            // let disocunt_price = Math.ceil(product.product_price - finaValue);

            // let apply_discount = "0";

            // if (req.body.apply_discount1) {
            //     apply_discount = req.body.apply_discount1;
            // }


            let product = await Sys.App.Services.ProductServices.insertProductData({
                product_visibility: req.body.product_Visibility,
                product_name: req.body.product_name,
                product_image: productfile,
                product_defaultImg: defaultImg,
                product_pdf: pdfs,
                discount_startDate : req.body.discount_startDate,
                discount_endDate : req.body.discount_endDate,
                product_description: req.body.product_description,
                // product_category:req.body.product_category,
                // product_id: product_id,
                discount_percentage: req.body.discount_percentage,
                is_discount: req.body.apply_discount1,
                discount_value: req.body.discount_value,
                hsn_code: req.body.hsn_code,
                discount_price: req.body.discount_price, //toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(","),
                GST_rate: req.body.gst_percentage,
                venodor_id: req.session.details.id,
                vendor_Gstcode: req.session.details.vendor_Gstcode,
                venodor_name: req.session.details.name,
                attribute_set: req.body.attribute_set,
                product_sku: req.body.product_sku,
                product_price: req.body.product_price,//.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(","),
                tax_class: req.body.tax_class,
                product_stock_quantity: req.body.product_quantity,
                product_stock_status: req.body.stock_status,
                product_weight: req.body.product_weight,
                weight_type: req.body.weight_type,
                product_category: req.body.product_category,
                product_featured: req.body.product_featured,
                product_color: req.body.product_color,
                product_size: req.body.product_size,
                relatable_product: req.body.relatable_product,
                spares_product: req.body.spares_product,
                product_startdate: req.body.product_startDate,
                product_enddate: req.body.product_endDate,
                product_country_manufacture: req.body.product_country,
                product_brand: req.body.brand,
                product_model_arr: req.body.model_arr,
                series_Type: req.body.series_Type,
                pump_Moc: req.body.pump_Moc,
                impeller_Moc: req.body.impeller_Moc,
                flange_Conn: req.body.flange_Conn,
                inlet_Flange: req.body.inlet_Flange,
                model_Number: req.body.model_Number,
                outlet_flange: req.body.outlet_flange,
                impeller_Type: req.body.impeller_Type,
                impeller_Size: req.body.impeller_Size,
                seal_Type: req.body.seal_Type,
                seal_Size: req.body.seal_Size,
                shaft_Sleeve: req.body.shaft_Sleeve,
                shaft_Moc: req.body.shaft_Moc,
                product_mawp: req.body.mawp,
                product_mawt: req.body.mawt,
                product_mcsf: req.body.mcsf,
                product_bep: req.body.bep,
                rated_Rpm: req.body.rated_Rpm,
                driver_Range: req.body.driver_Range,
                bearting_Ib: req.body.bearting_Ib,
                bearting_Ob: req.body.bearting_Ob,
                lubrication: req.body.lubrication,
                packing_Size: req.body.packing_Size,
                weight_Kg: req.body.weight_Kg,
                pump_Tech: req.body.pump_Tech,
                product_url_Key: req.body.url_Key,
                meta_Title: req.body.meta_Title,
                meta_Keywords: req.body.meta_Keywords,
                meta_Decription: req.body.meta_Decription,
                account_id: req.session.details.account_id,
                attribute_set_id: req.body.attribute_set_id,
                attribute: attribute,

                // product_country_manufacture:req.body.product_country_manufacture,
                // hsn_code:req.body.hsn_code,
                // product_visibility:req.body.product_visibility,

            });
            // console.log("product create", product);
            // console.log("PRODUCT AFTER INSERT DAta", product);
            req.flash('success')
            return res.redirect('/backend/product');
        } catch (error) {
            console.log("Error in ProductController in postApplication", error);
        }
    },

    pdfDelete: async function (req, res) {
        try {

            console.log("{{{{{PDF ID}}}}", req.params.id,);
            console.log("{{{{{PDF Delete}}}}", req.params.deleteid,);


            let product = await Sys.App.Services.ProductServices.getProductData({ _id: req.params.id, is_deleted: "0" })

            console.log("================ pdf Delete ================");
            // console.log("[[[[[[[[[[[PRODUCT]]]]]]", product);

            if (product) {
                for (let index = 0; index < product.product_pdf.length; index++) {
                    var element = product.product_pdf[index];
                    // console.log("PDF DATA", element);


                    if (element._id == req.params.deleteid) {

                        let imgUnlinkPath = './public' + element.path;

                        if (imgUnlinkPath) {

                            fs.unlink(imgUnlinkPath, (err) => {
                                if (err) throw err;
                            });
                        }

                        var idimg = mongoose.Types.ObjectId(req.params.deleteid);

                        let dataget = await Sys.App.Services.ProductServices.deletePdf(
                            { _id: req.params.id, "product_pdf._id": idimg },
                            {
                                $set: { "product_pdf.$.is_deleted": "1" }
                            }
                        )
                        // console.log("pdf delete data ==== > ",dataget);
                        return res.send("success");

                    }




                    // let result = await Sys.App.Services.ProductServices.updateProductData(
                    //     { _id: req.params.id, "product_image.is_deleted": "0" },
                    //     {
                    //         $set: { "product_image.$.is_deleted": "1" }
                    //     },
                    //     // {
                    //     //     $pull:{'product_image':{_id: req.params.deleteid}},
                    //     //     is_deleted : "1"
                    //     // }
                    // )

                    // console.log("result", result);
                    // return res.send("success");
                }

            } else {
                return res.send("error in ProductController in productDelete");
            }

        } catch (error) {
            console.log("Error in productController in pdfDelete", error);
        }
    },

    productImageDelete: async function (req, res) {
        console.log("idrr in product image delete  ==== >>", req.params.deleteid);
        try {
            //    let product =  await Sys.App.Services.ProductServices.getProductData({id:req.params.id})
            let product = await Sys.App.Services.ProductServices.getProductData({ _id: req.params.id, is_deleted: "0" })

            if (product || product.length) {
                for (let index = 0; index < product.product_image.length; index++) {
                    var element = product.product_image[index];

                    // console.log("path product delete ==>>",element);
                    // return false;
                    if (element._id == req.params.deleteid) {

                        // await Sys.App.Services.ProductServices.deletePdf(
                        //     { _id: req.params.id, "product_image.is_deleted": "0" },
                        //     {
                        //         $set: { "product_image.$.is_deleted": "1" }
                        //     },

                        // )

                        var idimg = mongoose.Types.ObjectId(req.params.deleteid);


                        // console.log("id === >>>",id);
                        let deleteimg = await Sys.App.Services.ProductServices.deletePdf(

                            // console.log("id === >>>",id);

                            { _id: req.params.id, "product_image._id": idimg },
                            {
                                $set: { "product_image.$.is_deleted": "1" }
                            },

                        )





                        // console.log("element=== path ==== >>>",deleteimg);

                        let imgUnlinkPath = './public' + element.path;

                        fs.unlink(imgUnlinkPath, (err) => {
                            if (err) throw err;
                        });

                        // console.log("result", result);
                        return res.send("success");
                    }
                }

            } else {
                return res.send("error in ProductController in productDelete");
            }

        } catch (error) {
            console.log("Error in productController in productImageDelete", error);
        }
    },
    defaultImageDelete: async function (req, res) {
        console.log("idrr in defaultImageDelete image delete  ==== >>", req.params);
        try {
            //    let product =  await Sys.App.Services.ProductServices.getProductData({id:req.params.id})
            let product = await Sys.App.Services.ProductServices.getProductData({ _id: req.params.id, is_deleted: "0" })

            if (product || product.length) {
                for (let index = 0; index < product.product_defaultImg.length; index++) {
                    var element = product.product_defaultImg[index];

                    console.log("path product delete ==>>", element._id);
                    // return false;
                    if (element._id == req.params.deleteid) {

                        await Sys.App.Services.ProductServices.deletePdf(
                            { _id: req.params.id, "product_image.is_deleted": "0" },
                            {
                                $set: { "product_defaultImg.$.is_deleted": "1" }
                            },

                        )

                        let imgUnlinkPath = './public' + element.path;

                        fs.unlink(imgUnlinkPath, (err) => {
                            if (err) throw err;
                        });

                        // console.log("result", result);
                        return res.send("success");
                    }
                }

            } else {
                return res.send("error in ProductController in productDelete");
            }

        } catch (error) {
            console.log("Error in productController in productImageDelete", error);
        }
    },

    productDelete: async function (req, res) {
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
                let addtocart = await Sys.App.Services.OrderServices.getSingleUserData({ "product_id": req.body.id, product_status: "pending", is_deleted: "0" });
                if (addtocart) {
                    await Sys.App.Services.OrderServices.updateSingleUserData(
                        { _id: addtocart._id },
                        {
                            is_deleted: "1"
                        }
                    )
                }
                return res.send("success");
            } else {
                return res.send("error in ProductController in productDelete");
            }
        } catch (e) {
            console.log("Erro in ProductController in productDelete", e);
        }
    },

    // editProduct: async function (req, res) {
    //     try {
    //         let productData = await Sys.App.Services.ProductServices.getProductData({ _id: req.params.id, is_deleted: "0" });
    //         let menudata = await Sys.App.Services.MenuServices.getByData();
    //         let productCategory = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
    //         let attribute_set, tax_class, color, size, brand, series_Type, seal_Type, shaft_Sleeve, model_Number;
    //         if (menudata) {
    //             for (let m = 0; m < menudata.length; m++) {
    //                 if (menudata[m].menu_name == "attribute_set") {
    //                     attribute_set = menudata[m].set_array;
    //                 }
    //                 if (menudata[m].menu_name == "tax_class") {
    //                     tax_class = menudata[m].set_array;
    //                 }
    //                 if (menudata[m].menu_name == "color") {
    //                     color = menudata[m].set_array;
    //                 }
    //                 if (menudata[m].menu_name == "size") {
    //                     size = menudata[m].set_array;
    //                 }
    //                 if (menudata[m].menu_name == "brand") {
    //                     brand = menudata[m].set_array;
    //                 }
    //                 if (menudata[m].menu_name == "series_type") {
    //                     series_Type = menudata[m].set_array;
    //                 }
    //                 if (menudata[m].menu_name == "seal_type") {
    //                     seal_Type = menudata[m].set_array;
    //                 }
    //                 if (menudata[m].menu_name == "shaft_sleeve") {
    //                     shaft_Sleeve = menudata[m].set_array;
    //                 }
    //                 if (menudata[m].menu_name == "model_number") {
    //                     model_Number = menudata[m].set_array;
    //                 }
    //             }
    //         }
    //         let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });

    //         let subarray = [];
    //         let setids = [];
    //         let subproduct;
    //         let subof_subproduct =[];


    //         if (productCategoryData) {
    //             for (let p = 0; p < productCategoryData.length; p++) {

    //                 if (productCategoryData[p].main_productId == null) {
    //                     setids.push(productCategoryData[p]._id)
    //                 }
    //                 for (let s = 0; s < setids.length; s++) {
    //                     if (setids[s] == productCategoryData[p].main_productId) {
    //                         subarray.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, account_id: productCategoryData[p].account_id, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
    //                     }
    //                 }
    //             }
    //             for (let pr = 0; pr < productCategoryData.length; pr++) {
    //                 subproduct = [];

    //                 for (let ss = 0; ss < subarray.length; ss++) {

    //                     var subArrId = productCategoryData[pr]._id.toString()


    //                     if (subarray[ss].main_productId == subArrId) {

    //                         let str = subarray[ss].name
    //                         str = str.replace(" ", "_");
    //                         subproduct.push({ idids: subarray[ss].idids, name: subarray[ss].id, name: subarray[ss].name, itemname: str, account_id: subarray[ss].account_id, main_productId: subarray[ss].main_productId, main_sub_productId: subarray[ss].main_sub_productId })
    //                         productCategoryData[pr].subproduct = subproduct;

    //                     }
    //                 }
    //             }

    //             let subofsub_arr = [];
    //             for (let pr = 0; pr < productCategoryData.length; pr++) {
    //                 if(productCategoryData[pr].main_productId != null && productCategoryData[pr].main_sub_productId != null){
    //                     subofsub_arr.push(productCategoryData[pr])
    //                 }
    //             }
    //             // console.log("subofsub_arr",subofsub_arr);
    //             for (let pr = 0; pr < productCategoryData.length; pr++) {
    //                 // subof_subproduct =[];
    //             if (productCategoryData[pr].subproduct) {
    //                     for (let index = 0; index < productCategoryData[pr].subproduct.length; index++) {
    //                         // console.log("productCategoryData[pr].subproduct",productCategoryData[pr].subproduct[index]);
    //                         for (let s = 0; s < subofsub_arr.length; s++) {


    //                         if(productCategoryData[pr].subproduct[index].idids == subofsub_arr[s].main_productId){
    //                             let str = productCategoryData[pr].productCategoryName;
    //                             str = str.replace(" ", "_");
    //                             subof_subproduct.push({ idids: subofsub_arr[s].idids, name: subofsub_arr[s].name, itemname: str, account_id: subarray[pr].account_id, main_productId: productCategoryData[pr].main_productId, main_sub_productId: productCategoryData[pr].main_sub_productId })
    //                             console.log("subof_subproduct",subof_subproduct);
    //                             productCategoryData[pr].subproduct[index].subof_subproduct = subof_subproduct;
    //                             break;
    //                         }
    //                     }
    //                         //   console.log("productCategoryData[pr].subproduct",productCategoryData[pr].subproduct[index].subof_subproduct);
    //                     }
    //             }
    //                 // for (let ss = 0; ss < subofsub_arr.length; ss++) {
    //                 //    if(productCategoryData[pr].subproduct){
    //                 //     if(productCategoryData[pr].subproduct[ss].idids == subofsub_arr[ss].main_productId){}
    //                 //    }
    //             //         if (productCategoryData[pr].main_productId != null && productCategoryData[pr].main_sub_productId != null) {

    //             //             if (merged[ss].idids == productCategoryData[pr].main_productId ) {
    //             //                 // console.log("subof_subproduct===================",productCategoryData[pr]);

    //             //                 let str = productCategoryData[pr].productCategoryName;
    //             //                 str = str.replace(" ", "_");
    //             //                 subof_subproduct.push({ idids: merged[ss].idids, name: productCategoryData[pr].productCategoryName, itemname: str, account_id: subarray[ss].account_id, main_productId: productCategoryData[pr].main_productId, main_sub_productId: productCategoryData[pr].main_sub_productId })

    //             //                 // console.log("merged[ss].subof_subproduct",merged[ss].subof_subproduct);
    //             //             }
    //             //         }

    //                 // }


    //             }


    //         }
    //         // console.log(" product =======>>>>>>>", productCategoryData[0].subproduct[0]);

    //         var data = {
    //             App: req.session.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             product: 'active',
    //             productData: productData,
    //             menudata: menudata,
    //             attribute_set: attribute_set,
    //             tax_class: tax_class,
    //             color: color,
    //             size: size,
    //             brand: brand,
    //             series_Type: series_Type,
    //             seal_Type: seal_Type,
    //             shaft_Sleeve,
    //             model_Number: model_Number,
    //             product_category: productCategory,
    //             productCategoryData: productCategoryData
    //         };



    //         return res.render('backend/product/addProduct', data);
    //     } catch (e) {
    //         console.log("Error in ProductController in editProduct", e);
    //     }

    // },

    editProduct: async function (req, res) {

        // console.log("req.seeee ooo ----->>", req.session.details);

        try {
         
            let productData = await Sys.App.Services.ProductServices.getProductData({ _id: req.params.id, is_deleted: "0" });
            let attributeData = await Sys.App.Services.AttributeServices.getByData({ vendor_id: req.session.details.id, menu_name:"attribute_set", is_deleted: "0" });
 
           
            let menudata = await Sys.App.Services.MenuServices.getByData();
            let productCategory = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
            let attribute_set, tax_class, color, size, brand, series_Type, seal_Type, shaft_Sleeve, model_Number;
            if (menudata) {
                for (let m = 0; m < menudata.length; m++) {
                    if (menudata[m].menu_name == "attribute_set") {
                        attribute_set = menudata[m].set_array;
                    }
                    if (menudata[m].menu_name == "tax_class") {
                        tax_class = menudata[m].set_array;
                    }
                    if (menudata[m].menu_name == "color") {
                        color = menudata[m].set_array;
                    }
                    if (menudata[m].menu_name == "size") {
                        size = menudata[m].set_array;
                    }
                    if (menudata[m].menu_name == "brand") {
                        brand = menudata[m].set_array;
                    }
                    if (menudata[m].menu_name == "series_type") {
                        series_Type = menudata[m].set_array;
                    }
                    if (menudata[m].menu_name == "seal_type") {
                        seal_Type = menudata[m].set_array;
                    }
                    if (menudata[m].menu_name == "shaft_sleeve") {
                        shaft_Sleeve = menudata[m].set_array;
                    }
                    if (menudata[m].menu_name == "model_number") {
                        model_Number = menudata[m].set_array;
                    }
                }
            }
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
            let relateProduct = await Sys.App.Services.ProductServices.getByData({
                is_deleted: "0",
            });
            let subarray = [];
            let setids = [];
            let new_sub_arr = [];
            let subproduct;
            let subof_subproduct = [];

            let finalarr = [];

            let subarray1 = [];

            for (let i = 0; i < relateProduct.length; i++) {

                if (relateProduct[i]._id.toString() != productData._id.toString()) {

                    subarray1.push(relateProduct[i])
                }
            }


            if (productCategoryData) {
                for (let p = 0; p < productCategoryData.length; p++) {

                    if (productCategoryData[p].main_productId == null) {
                        setids.push(productCategoryData[p]._id)
                    }
                    for (let s = 0; s < setids.length; s++) {
                        if (setids[s] == productCategoryData[p].main_productId) {
                            subarray.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, account_id: productCategoryData[p].account_id, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
                        }
                    }
                    if (productCategoryData[p].main_productId != null && productCategoryData[p].main_sub_productId != null) {
                        new_sub_arr.push({ id: productCategoryData[p].main_productId, idids: productCategoryData[p]._id, name: productCategoryData[p].productCategoryName, account_id: productCategoryData[p].account_id, main_productId: productCategoryData[p].main_productId, main_sub_productId: productCategoryData[p].main_sub_productId })
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
                            subproduct.push({ idids: subarray[ss].idids, name: subarray[ss].id, name: subarray[ss].name, itemname: str, account_id: subarray[ss].account_id, main_productId: subarray[ss].main_productId, main_sub_productId: subarray[ss].main_sub_productId, subof_subproduct: subof_subproduct })
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
                                    str = str.replace(" ", "_");
                                    finalarr.push({ idids: new_sub_arr[n].idids, name: new_sub_arr[n].id, name: new_sub_arr[n].name, itemname: str, account_id: new_sub_arr[n].account_id, main_productId: new_sub_arr[n].main_productId, main_sub_productId: new_sub_arr[n].main_sub_productId })
                                    // console.log(finalarr);
                                    productCategoryData[pr].subproduct[sr].subof_subproduct = finalarr

                                }


                            }
                        }
                    }
                    // console.log("productCategoryData[pr].subproduct", productCategoryData[pr].subproduct);
                }

            }

            let finalCategory = []

            if (productData.product_category) {
                for (let x = 0; x < productData.product_category.length; x++) {
                    finalCategory.push(productData.product_category[x]);

                }
            }
            if(productData.attribute){
                for (let a = 0; a < productData.attribute.length; a++) {
                    for (let aa = 0; aa < attributeData.length; aa++) {
                        if(attributeData[aa].group_id == productData.attribute[a].group_id){
                            if(attributeData[aa].name == productData.attribute[a].name){
                            attributeData[aa].value = productData.attribute[a].val;
                            console.log("attributeData[aa].value -->",attributeData[aa].value);
                            }
                        }
                    }   
                }
            }

            var d = new Date();
            // d.setDate(d.getDate() - 1);
            var previous_date = datetime.format(d, 'YYYY-MM-DD');


            console.log(" product attributeData =======>>>>>>>", attributeData);

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                product: 'active',
                productData: productData,
                menudata: menudata,
                attribute_set: attribute_set,
                tax_class: tax_class,
                color: color,
                size: size,
                finalCategory: finalCategory,
                brand: brand,
                series_Type: series_Type,
                seal_Type: seal_Type,
                shaft_Sleeve,
                model_Number: model_Number,
                product_category: productCategory,
                productCategoryData: productCategoryData,
                subarray1: subarray1,
                attributeData: attributeData,
                previous_date: previous_date,
            };

            // console.log("productData test  ====>>>", productData);

            return res.render('backend/product/addProduct', data);
        } catch (e) {
            console.log("Error in ProductController in editProduct", e);
        }

    },

    editProductPostData: async function (req, res) {

        // console.log("req.seeee ooo ----->>",req.session.details);

        // relatable_product :req.body.relatable_product,

        console.log("update data body ========>>>>>>>>", req.body);
        // console.log("update files ========>>>>>>>>", req.files);

        // return false;
        try {

            let attribute = [];
            var attributeData = await Sys.App.Services.AttributeServices.getByData({ vendor_id: req.session.details.id ,is_deleted : '0'});
            if (attributeData) {
                for (let a = 0; a < attributeData.length; a++) {
                    let name = attributeData[a].name
                    let val;
                    if (req.body[name]) {
                        val = req.body[name];
                        let nm = [name]
                        attribute.push({ name: attributeData[a].name, val: val, "group_id": req.body.attribute_set_id });
                    }
                    await Sys.App.Services.AttributeServices.updateProductData(
                        { _id: attributeData[a]._id }, { value: val }
                    );
                }
            }
            let product = await Sys.App.Services.ProductServices.getProductData({ _id: req.params.id, is_deleted: "0" });

            if (product) {


            // console.log("edit product =====>>>>>", product);


            // return false;
            var updated_img = product.product_image;



            var defaultImg1 = product.product_defaultImg;



            var pdfsFile = product.product_pdf ? product.product_pdf : [];

            var defaultImg = product.product_defaultImg ? product.product_defaultImg : [];


            let productVisibility = req.body.product_Visibility;

            if (req.body.product_Visibility == undefined || req.body.product_Visibility == null) {
                productVisibility = "0";
            }

            // let apply_discount = "0";

            // if (req.body.apply_discount1) {
            //     apply_discount = req.body.apply_discount1;
            // }
            // let id = mongoose.Types.ObjectId(product_select);
                        
            // let product = await Sys.App.Services.ProductServices.getProductData({ _id: id, is_deleted: "0" });
           

            let finaValue = (product.product_price * req.body.discount_percentage) / 100

            let newFinalValue = (Math.round(finaValue * 100) / 100).toFixed(2);

            let disocunt_price = Math.ceil(product.product_price - finaValue);

            let apply_discount = "0";

            if (req.body.apply_discount1) {
                apply_discount = req.body.apply_discount1;
            }

            let productData = [];
            var productfile = [];
            let updateData = {

                product_visibility: productVisibility,
                product_name: req.body.product_name,
                relatable_product: req.body.relatable_product,
                spares_product: req.body.spares_product,
                // product_image: productfile,
                product_description: req.body.product_description,
                // product_category:req.body.product_category,
                // product_id: product_id,
                // discount_startDate : req.body.discount_startDate,
                // discount_endDate : req.body.discount_endDate,
                // discount_start: "false",
                hsn_code: req.body.hsn_code,
                GST_rate: req.body.gst_percentage,
                attribute_set: req.body.attribute_set,

                venodor_id: req.session.details.id,
                vendor_Gstcode: req.session.details.vendor_Gstcode,
                venodor_name: req.session.details.name,
                product_sku: req.body.product_sku,
                product_price: req.body.product_price,//.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(","),
                tax_class: req.body.tax_class,
                // discount_price: req.body.discount_price,//.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(","),
                product_stock_quantity: req.body.product_quantity,
                product_stock_status: req.body.stock_status,
                product_weight: req.body.product_weight,
                weight_type: req.body.weight_type,
                product_category: req.body.product_category,
                product_featured: req.body.product_featured,
                product_color: req.body.product_color,
                product_size: req.body.product_size,
                // discount_percentage: req.body.discount_percentage,
                // is_discount: apply_discount,
                discount_startDate : req.body.discount_startDate,
                discount_endDate : req.body.discount_endDate,
                // product_price: req.body.product_price,//.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(","),
                discount_price: disocunt_price,//.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(","),
                // product_category: req.body.product_category,
                discount_percentage: req.body.discount_percentage,
                is_discount: apply_discount,
                discount_value: newFinalValue,
                // discount_value: req.body.discount_value,
                product_startdate: req.body.product_startDate,
                product_enddate: req.body.product_endDate,
                product_country_manufacture: req.body.product_country,
                product_brand: req.body.brand,
                product_model_arr: req.body.model_arr,
                series_Type: req.body.series_Type,
                pump_Moc: req.body.pump_Moc,
                impeller_Moc: req.body.impeller_Moc,
                flange_Conn: req.body.flange_Conn,
                inlet_Flange: req.body.inlet_Flange,
                model_Number: req.body.model_Number,
                outlet_flange: req.body.outlet_flange,
                impeller_Type: req.body.impeller_Type,
                impeller_Size: req.body.impeller_Size,
                seal_Type: req.body.seal_Type,
                seal_Size: req.body.seal_Size,
                shaft_Sleeve: req.body.shaft_Sleeve,
                shaft_Moc: req.body.shaft_Moc,
                product_mawp: req.body.mawp,
                product_mawt: req.body.mawt,
                product_mcsf: req.body.mcsf,
                product_bep: req.body.bep,
                rated_Rpm: req.body.rated_Rpm,
                driver_Range: req.body.driver_Range,
                bearting_Ib: req.body.bearting_Ib,
                bearting_Ob: req.body.bearting_Ob,
                lubrication: req.body.lubrication,
                packing_Size: req.body.packing_Size,
                weight_Kg: req.body.weight_Kg,
                pump_Tech: req.body.pump_Tech,
                product_url_Key: req.body.url_Key,
                meta_Title: req.body.meta_Title,
                meta_Keywords: req.body.meta_Keywords,
                meta_Decription: req.body.meta_Decription,
                attribute: attribute,
                attribute_set_id: req.body.attribute_set_id,
            }


                if (req.files) {

                    // console.log("req.files.productImage ====>>>", req.files.productImage);

                    if (req.files.productImage) {
                        let image1 = req.files.productImage;
                        updateData.product_image = updated_img;
                        if (Array.isArray(req.files.productImage) != false) {
                            console.log("ifffff");
                            for (let i = 0; i < image1.length; i++) {
                                var re = /(?:\.([^.]+))?$/;
                                var ext1 = re.exec(image1[i].name)[1];
                                let name = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext1;
                                let productImg = '/productImage/' + name;
                                // Use the mv() method to place the file somewhere on your server
                                await image1[i].mv('./public/productImage/' + name, async function (err) {
                                    if (err) {
                                        req.flash('Error in ProductController in postProduct', err);
                                        return res.redirect('/backend/product/addProduct');
                                    }
                                });
                                let type = 'video'
                                if (ext1 != 'mp4') {
                                    type = 'image'
                                }
                                updated_img.push({ path: '/productImage/' + name, fileName: req.files.productImage[i].name, _id: new mongoose.Types.ObjectId(), is_deleted: "0", type: type })
                                //   productfile.push({ path: '/productImage/' + name, fileName: req.files.productImage[i].name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
                                // console.log("productfileupdate>>", productfile);
                            }
                        }
                        else {
                            console.log("single image is here");
                            let singleimage_p = req.files.productImage;
                            console.log("Image", singleimage_p);
                            var re = /(?:\.([^.]+))?$/;
                            var ext6 = re.exec(singleimage_p.name)[1];
                            let singleImage_P = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext6;
                            let singleImg = '/productImage/' + singleImage_P;
                            // Use the mv() method to place the file somewhere on your server
                            await singleimage_p.mv('./public/productImage/' + singleImage_P, async function (err) {
                                if (err) {
                                    req.flash('Error in OurTeamController in postOurTeam', err);
                                    return res.redirect('ourTeam/addOurTeam');
                                }
                            });
                            let type = 'video'
                            if (ext6 != 'mp4') {
                                type = 'image'
                            }


                            updated_img.push({ path: '/productImage/' + singleImage_P, fileName: req.files.productImage.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0", type: type })
                        }

                    }

                    if (req.files.productAtt) {

                        let product_pdf = req.files.productAtt;

                        updateData.product_pdf = pdfsFile;


                        let headingName = req.body.productPdfName;


                        if (Array.isArray(req.files.productAtt) != false) {

                            for (let i = 0; i < product_pdf.length; i++) {

                                var re = /(?:\.([^.]+))?$/;
                                var ext3 = re.exec(product_pdf[i].name)[1];

                                var productPdf = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext3;
                                // console.log("productPdf[[]]", productPdf);

                                var productFile = '/productPdf/' + productPdf;
                                console.log("PRODUCT FILE inside for loop ", productFile);


                                await product_pdf[i].mv('./public/productPdf/' + productPdf, async function (err) {

                                    if (err) {
                                        req.flash('Error in ProductController in postProduct', err);
                                        return res.redirect('/backend/product/addProduct');
                                    }
                                });

                                // if(req.body.pdf__FileId == )
                                pdfsFile.push({ path: '/productPdf/' + productPdf, heading: headingName[i], fileName: req.files.productAtt[i].name, _id: create_Id(), is_deleted: "0" })

                                console.log("Mutiple file");


                                if (req.body.productPdfNameEdit) {

                                    for (let i = 0; i < product.product_pdf.length; i++) {

                                        if (product.product_pdf[i].is_deleted == "0") {



                                            for (let j = 0; j < req.body.pdf__FileId.length; j++) {

                                                if (product.product_pdf[i]._id == req.body.pdf__FileId[j]) {

                                                    product.product_pdf[i].heading = req.body.productPdfNameEdit[j];

                                                }

                                            }
                                        }

                                        updateData.product_pdf = product.product_pdf;
                                    }

                                }

                            }
                        } else {
                            console.log("product_pdf =======>> else 1111 ===", product_pdf);

                            // if (Array.isArray(req.files.productAtt) != false) {
                            // console.log("product_pdf =======>> else ===", product_pdf);

                            var re = /(?:\.([^.]+))?$/;
                            var ext3 = re.exec(product_pdf.name)[1];

                            var productPdf = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext3;
                            console.log("productPdf[[]]", productPdf);

                            var productFile = '/productPdf/' + productPdf;
                            console.log("PRODUCT FILE inside for loop ", productFile);


                            await product_pdf.mv('./public/productPdf/' + productPdf, async function (err) {

                                if (err) {
                                    req.flash('Error in ProductController in postProduct', err);
                                    return res.redirect('/backend/product/addProduct');
                                }
                            });


                            pdfsFile.push({ path: '/productPdf/' + productPdf, heading: req.body.productPdfName, fileName: req.files.productAtt.name, _id: create_Id(), is_deleted: "0" })


                            if (req.body.productPdfNameEdit) {

                                for (let i = 0; i < product.product_pdf.length; i++) {
                                    if (product.product_pdf[i].is_deleted == "0") {


                                        if (typeof req.body.productPdfNameEdit === "object") {

                                            for (let j = 0; j < req.body.pdf__FileId.length; j++) {

                                                if (product.product_pdf[i]._id == req.body.pdf__FileId[j]) {

                                                    product.product_pdf[i].heading = req.body.productPdfNameEdit[j];

                                                }

                                            }

                                        } else {
                                            product.product_pdf[i].heading = req.body.productPdfNameEdit;
                                        }

                                    }
                                    updateData.product_pdf = product.product_pdf;

                                }


                            }


                        }

                    }


                    if (req.files.productAttEdit) {
                        let productAttEdit1 = req.files.productAttEdit;

                        if (Array.isArray(req.files.productAttEdit) != false) {


                            for (let i = 0; i < product.product_pdf.length; i++) {

                                if (product.product_pdf[i].is_deleted == "0") {


                                    for (let kk = 0; kk < req.body.pdfadd.length; kk++) {

                                        console.log("if ====== >>>>>", req.body.pdfadd[kk], product.product_pdf[i]._id);

                                        if (product.product_pdf[i]._id == req.body.pdfadd[kk]) {


                                            var re = /(?:\.([^.]+))?$/;
                                            var ext3 = re.exec(productAttEdit1[kk].name)[1];

                                            var productPdf = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext3;

                                            var productFile = '/productPdf/' + productPdf;

                                            await productAttEdit1[kk].mv('./public/productPdf/' + productPdf, async function (err) {

                                                if (err) {
                                                    req.flash('Error in ProductController in postProduct', err);
                                                    return res.redirect('/backend/product/addProduct');
                                                }
                                            });

                                            product.product_pdf[i].path = '/productPdf/' + productPdf;
                                            product.product_pdf[i].fileName = req.files.productAttEdit[kk].name;

                                        }

                                        for (let j = 0; j < req.body.pdf__FileId.length; j++) {

                                            if (product.product_pdf[i]._id == req.body.pdf__FileId[j]) {

                                                product.product_pdf[i].heading = req.body.productPdfNameEdit[j];

                                            }

                                        }

                                    }
                                }
                                updateData.product_pdf = product.product_pdf;

                            }


                        } else {


                            for (let i = 0; i < product.product_pdf.length; i++) {


                                if (product.product_pdf[i].is_deleted == "0") {


                                    if (product.product_pdf[i]._id == req.body.pdfadd) {



                                        console.log("hdidiwdwedwedweidwede", product.product_pdf[i].heading, req.body.productPdfNameEdit);

                                        var re = /(?:\.([^.]+))?$/;
                                        var ext3 = re.exec(productAttEdit1.name)[1];

                                        var productPdf = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext3;
                                        console.log("productPdf[[]]", productPdf);

                                        var productFile = '/productPdf/' + productPdf;
                                        console.log("PRODUCT FILE inside for loop ", productFile);


                                        await productAttEdit1.mv('./public/productPdf/' + productPdf, async function (err) {

                                            if (err) {
                                                req.flash('Error in ProductController in postProduct', err);
                                                return res.redirect('/backend/product/addProduct');
                                            }
                                        });

                                        product.product_pdf[i].path = '/productPdf/' + productPdf;

                                        product.product_pdf[i].fileName = req.files.productAttEdit.name;

                                    }



                                    if (typeof req.body.productPdfNameEdit === "object") {

                                        for (let j = 0; j < req.body.pdf__FileId.length; j++) {

                                            if (product.product_pdf[i]._id == req.body.pdf__FileId[j]) {

                                                product.product_pdf[i].heading = req.body.productPdfNameEdit[j];

                                            }

                                        }

                                    } else {
                                        product.product_pdf[i].heading = req.body.productPdfNameEdit;
                                    }

                                }
                                updateData.product_pdf = product.product_pdf;
                            }
                        }
                    }

                    if (req.files.productImageDef) {

                        updateData.product_defaultImg = defaultImg;
                        let singleimage_p = req.files.productImageDef;

                        if (product.product_defaultImg) {



                            for (let i = 0; i < product.product_defaultImg.length; i++) {

                                if (product.product_defaultImg[i].is_deleted == "0") {

                                    console.log("asjdasjdasjdjas ===== >>>", product.product_defaultImg[i]);


                                    if (product.product_defaultImg[i]._id.toString() == req.body.productImgIdd) {


                                        console.log("Image", singleimage_p);
                                        var re = /(?:\.([^.]+))?$/;
                                        var ext6 = re.exec(singleimage_p.name)[1];
                                        let singleImage_P = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext6;
                                        let singleImg = '/defaultImage/' + singleImage_P;
                                        // Use the mv() method to place the file somewhere on your server
                                        await singleimage_p.mv('./public/defaultImage/' + singleImage_P, async function (err) {
                                            if (err) {
                                                req.flash('Error in OurTeamController in postOurTeam', err);
                                                return res.redirect('ourTeam/addOurTeam');
                                            }
                                        });

                                        product.product_defaultImg[i].path = '/defaultImage/' + singleImage_P;

                                        product.product_defaultImg[i].fileName = req.files.productImageDef.name;

                                    }


                                    // defaultImg.push({ path: '/defaultImage/' + singleImage_P, fileName: req.files.productImageDef.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
                                }

                                updateData.product_defaultImg = product.product_defaultImg;


                            }

                        } else {


                            updateData.product_defaultImg = defaultImg1;

                            // let defaultImg1 = [];


                            let singleimage_p = req.files.productImageDef;
                            console.log("Image", singleimage_p);
                            var re = /(?:\.([^.]+))?$/;
                            var ext6 = re.exec(singleimage_p.name)[1];
                            let singleImage_P = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext6;
                            let singleImg = '/defaultImage/' + singleImage_P;
                            // Use the mv() method to place the file somewhere on your server
                            await singleimage_p.mv('./public/defaultImage/' + singleImage_P, async function (err) {
                                if (err) {
                                    req.flash('Error in OurTeamController in postOurTeam', err);
                                    return res.redirect('ourTeam/addOurTeam');
                                }
                            });

                            defaultImg1.push({ path: '/defaultImage/' + singleImage_P, fileName: req.files.productImageDef.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })

                        }
                    }

                } else {



                    if (req.body.productPdfNameEdit) {
                        // let productAttEdit1 = req.files.productAttEdit;

                        let headingNew = req.body.productPdfNameEdit;

                        // let object;

                        let typeHeadingNew = typeof headingNew;

                        // console.log("dsdasdas", typeHeadingNew);

                        if (typeHeadingNew === "object") {


                            // console.log("objectobjectobjectobjectobject22222");


                            if (headingNew.length > 1) {

                                for (let i = 0; i < product.product_pdf.length; i++) {

                                    // console.log("33333333333333333333333333",product.product_pdf[i].is_deleted );

                                    if (product.product_pdf[i].is_deleted == "0") {
                                        // console.log("4444444444444444444444444444444444444444444",product.product_pdf[i]);

                                        for (let j = 0; j < req.body.pdf__FileId.length; j++) {


                                            // if(eq.body.pdf__FileId[i] )
                                            // console.log("array heding ======>>>>>>", product.product_pdf[i]._id, req.body.pdf__FileId[j]);

                                            if (product.product_pdf[i]._id == req.body.pdf__FileId[j]) {

                                                product.product_pdf[i].heading = req.body.productPdfNameEdit[j];
                                                // product.product_pdf[i].path = '/productPdf/' + productPdf;
                                                // product.product_pdf[i]._id = product.product_pdf[i]._id;
                                                // product.product_pdf[i].fileName = req.files.productAttEdit[i].name;
                                                // // product.product_pdf[i].is_deleted = "0";

                                            }

                                        }

                                    }
                                    updateData.product_pdf = product.product_pdf;

                                }
                            }
                        } else {
                            // console.log("stribg222222222222222");

                            for (let i = 0; i < product.product_pdf.length; i++) {


                                if (product.product_pdf[i].is_deleted == "0") {


                                    if (product.product_pdf[i]._id == req.body.pdf__FileId) {


                                        product.product_pdf[i].heading = req.body.productPdfNameEdit;
                                        // product.product_pdf[i].path = '/productPdf/' + productPdf;
                                        // product.product_pdf[i]._id = product.product_pdf[i]._id;
                                        // product.product_pdf[i].fileName = req.files.productAttEdit.name;
                                        // product.product_pdf[i].is_deleted = "0";
                                    }
                                }

                            }
                            updateData.product_pdf = product.product_pdf;

                        }
                    }
                }


                await Sys.App.Services.ProductServices.updateProductData({ _id: req.params.id }, updateData)

                req.flash('success', 'product updated successfully');
                return res.redirect('/backend/product');

            } else {
                req.flash('error', 'product not update successfully');
                return res.redirect('/backend/product');
            }
        } catch (e) {
            console.log("Error", e);
        }
    },

    list_attribute: async function (req, res) {
        try {

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                set_attribute: 'active',
                attributemodel: 'active',
                modelopen:"menu-open"


            };
            
            console.log("Datat", data);
          
            return res.render('backend/product/list_attribute', data);
        } catch (e) {
            console.log("Error in ProductController in list", e);
        }
    },

    get_attribute: async function (req, res) {

        console.log("get product data session  ====> ", req.session.details.account_id);

        try {
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search.value;

            let query = {};
            if (search != '') {
                let capital = search;
                query = { product_name: { $regex: '.*' + search + '.*' }, is_deleted: "0" };
                // query = { productCategoryName: { $regex: '.*' + search + '.*' }, is_deleted: "0" };

            } else {
                query = { is_deleted: "0", vendor_id: req.session.details.id };
            }

            let productCount = await Sys.App.Services.AttributeServices.getProductCount(query);
            let data = await Sys.App.Services.AttributeServices.getProductDatatable(query, length, start);
     
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

    add_attribute: async function (req, res) {
        try {
            let menudata = await Sys.App.Services.AttributeServices.getProductData({ _id: req.params.id });
            let attribute_data = await Sys.App.Services.MenuServices.getByData({ is_deleted: "0" });

            // console.log("product data ===>", menudata);

            let attributeData = await Sys.App.Services.AttributeServices.getByData({ vendor_id: req.session.details.id });


            let attribute_set;
            if (attribute_data) {
                for (let m = 0; m < attribute_data.length; m++) {
                    if (attribute_data[m].menu_name == "attribute_set") {
                        attribute_set = attribute_data[m].set_array;
                    }
                }
            }
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                set_attribute: 'active',
                menudata: menudata,
                attribute_set: attribute_set,
                attributemodel: 'active',
                modelopen:"menu-open"
            };


            // console.log("product setting add data ", menudata);

            return res.render('backend/product/add_attribute', data);

        } catch (e) {
            console.log("Error in ProductController in product_setting_addpost", e);
        }
    },

    add_post_attribute: async function (req, res) {


        console.log("product_setting_addpost session =====>>>>>", req.session.details);

        // return false;
        try {
            console.log("reqqqqqqqqqqqqqqq>>>>post>>>>>>>>", req.body);
            let flagg = false;
            // attribute_set
            if (req.body.id) {
                console.log("chhhhhhhhhhgggggggggg");

                let menudata = await Sys.App.Services.AttributeServices.getProductData({ _id: req.body.id });
                if (menudata) {
                    var attributedata_name = '';
                    var attributedata = await Sys.App.Services.MenuServices.getMenuData({ "menu_name":"attribute_set",'set_array': { $elemMatch: { id: req.body.attribute_set }}});
                    if(attributedata){
                    if(attributedata.set_array){
                        for (let a = 0; a < attributedata.set_array.length; a++) {
                            if(attributedata.set_array[a].id == req.body.attribute_set){
                                attributedata_name = attributedata.set_array[a].name;
                            }
                        }
                    }}
                    let subMenu_Name = req.body.name;
                    subMenu_Name = subMenu_Name.trim();
                    subMenu_Name = subMenu_Name.toLowerCase();
                    subMenu_Name = subMenu_Name.split(' ').join('_');
                    let replacementString = '-';
                    subMenu_Name = subMenu_Name.replace(/\//g, replacementString);
                    var subname = subMenu_Name;
                    console.log("subb",typeof(subMenu_Name),subMenu_Name,"lll",req.session.details.id,req.body.attribute_set);
                    let getall_menudata = await Sys.App.Services.AttributeServices.getProductData({vendor_id: req.session.details.id,group_id:req.body.attribute_set,"subname":subname}); 
                    console.log("getall_menudata=============",getall_menudata);
                    if(getall_menudata){
                        if(getall_menudata.name == req.body.name){
                           flagg = true;
                           console.log("f",flagg);
                        }
                    }
                    if(flagg == false){
                    let product = await Sys.App.Services.AttributeServices.updateProductData(
                        { _id: menudata._id },
                        {
                            $set: {
                                group_id: req.body.attribute_set,
                                groupname: attributedata_name,
                                name: req.body.name,
                                subname: subMenu_Name,
                                is_deleted: "0"
                                // attribute_arr: objj,
                            }
                        });    
                    }    
                }
            } else {
                console.log("lklllll");
                var attributedata_name = '';
                var attributedata = await Sys.App.Services.MenuServices.getMenuData({ "menu_name":"attribute_set",'set_array': { $elemMatch: { id: req.body.attribute_set }}});
                if(attributedata){
                if(attributedata.set_array){
                    for (let a = 0; a < attributedata.set_array.length; a++) {
                        if(attributedata.set_array[a].id == req.body.attribute_set){
                            attributedata_name = attributedata.set_array[a].name;
                        }
                    }
                }}
                let subMenu_Name = req.body.name;
                subMenu_Name = subMenu_Name.trim();
                subMenu_Name = subMenu_Name.toLowerCase();
                subMenu_Name = subMenu_Name.split(' ').join('_');
                let replacementString = '-';
                subMenu_Name = subMenu_Name.replace(/\//g, replacementString);
                var subname = subMenu_Name;
                console.log("subb",typeof(subMenu_Name),subMenu_Name,"lll",req.session.details.id,req.body.attribute_set);
                let getall_menudata = await Sys.App.Services.AttributeServices.getProductData({vendor_id: req.session.details.id,group_id:req.body.attribute_set,"subname":subname}); 
                console.log("getall_menudata=============",getall_menudata);
                if(getall_menudata){
                    if(getall_menudata.name == req.body.name){
                       flagg = true;
                       console.log("f",flagg);
                    }
                }
                if(flagg == false){
                let product = await Sys.App.Services.AttributeServices.insertProductData({
                    // attribute_arr: objj,
                    // product_id:req.body.product_id,
                    group_id: req.body.attribute_set,
                    groupname: attributedata_name,
                    name: req.body.name,
                    subname: subMenu_Name,
                    vendor_id: req.body.vendor_id,
                    is_deleted: "0",
                });
             }
            }
            //   req.flash('success')
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                product: 'active',
            };
            console.log("data flash ===================================>>>>>>>>>>>", data,flagg);
            if(flagg == true){
                console.log("trueee");
                req.session.save(function (err) {
                    console.log("This Name Is Already Exists");
                   
                    req.flash('error', "This Name Is Already Exists");
                    return res.redirect('/backend/list_attribute');
                });    
            }else{
                return res.redirect('/backend/list_attribute');

            }

            // return res.redirect(`/backend/product_setting_add/${req.body.menu_name}/${req.body.set_arrayid}`);
        } catch (error) {
            console.log("Error in ProductController in postApplication", error);
        }
    },

    // attribute.........................

    delete_attribute: async function (req, res) {
        try {

            // let query = {};
            // query = {is_separateCategory: "false" };
            console.log(">>>>>>>delete>>>>>", req.params);

            let menudata = await Sys.App.Services.AttributeServices.getProductData({ _id: req.params.id });
            if (menudata) {
                let product = await Sys.App.Services.AttributeServices.updateProductData(
                    { _id: menudata._id },
                    {
                        $set: {
                            is_deleted: "1"
                        }
                    });
            }
            req.flash('success')
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                product: 'active',
            };
            console.log("delete");
            return res.send('success');
            //   return false;
            //   return res.redirect(`/backend/product_setting/list/${req.params.menu_name}`);
        } catch (e) {
            console.log("Error in ProductController in product_setting_addpost", e);
        }
    },

    //question

    question_form: async function (req, res) {
        try {

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                question: 'active',

            };
            // console.log("Datat", data);
            return res.render('backend/product/list_question', data);
        } catch (e) {
            console.log("Error in ProductController in list", e);
        }
    },

    get_question: async function (req, res) {

        console.log("get product data session  ====> ", req.session.details.account_id);

        try {
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search.value;

            let query = {};
            if (search != '') {
                let capital = search;
                query = { product_name: { $regex: '.*' + search + '.*' }, is_deleted: "0" };
                // query = { productCategoryName: { $regex: '.*' + search + '.*' }, is_deleted: "0" };

            } else {
                query = { is_deleted: "0", vendor_id: req.session.details.id };
            }

            let productCount = await Sys.App.Services.QuestionServices.getProductCount(query);
            let data = await Sys.App.Services.QuestionServices.getProductDatatable(query, length, start);

            var obj = {
                'draw': req.query.draw,
                'recordsTotal': productCount,
                'recordsFiltered': productCount,
                'data': data,
            };
            console.log('getProduct data', data);
            // console.log("categrrrrrrrydata", categoryname);
            res.send(obj);
        } catch (e) {
            console.log("Error in ProductController in getProduct", e);
        }
    },

    add_question: async function (req, res) {
        try {
            let menudata = await Sys.App.Services.QuestionServices.getProductData({ _id: req.params.id });

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                question: 'active',
                menudata: menudata
            };


            // console.log("product setting add data ", menudata);

            return res.render('backend/product/add_question', data);

        } catch (e) {
            console.log("Error in ProductController in product_setting_addpost", e);
        }
    },

    add_post_question: async function (req, res) {


        console.log("product_setting_addpost session =====>>>>>", req.session.details);

        // return false;
        try {
            console.log("filesss>>>>post>>>>>>>>", req.body);
            var obj = [];
            let option;
            for (let index = 0; index < 100; index++) {
                option = 'option' + index;
                console.log("opop", option);
                if (req.body[option]) {
                    obj.push({ name: 'option' + index, value: req.body[option] });
                }
            }
            if (req.body.id) {
                let menudata = await Sys.App.Services.QuestionServices.getProductData({ _id: req.body.id });

                if (menudata) {
                    let product = await Sys.App.Services.QuestionServices.updateProductData(
                        { _id: menudata._id },
                        {
                            $set: {
                                // postbody
                                name: req.body.name,
                                type: req.body.type,
                                checkbox_name_one: req.body.checkbox_name_one,
                                checkbox_name_two: req.body.checkbox_name_two,
                                option: obj,
                                vendor_id: req.body.vendor_id,
                                is_deleted: "0",

                                // attribute_arr: objj,
                            }
                        });
                }
            } else {
console.log(obj,"kkkkkkkkkkkkkkk");

                let product = await Sys.App.Services.QuestionServices.insertProductData({
                    name: req.body.name,
                    type: req.body.type,
                    checkbox_name_one: req.body.checkbox_name_one,
                    checkbox_name_two: req.body.checkbox_name_two,
                    option: obj,
                    vendor_id: req.body.vendor_id,
                    is_deleted: "0",
                    // postbody
                    // attribute_arr: objj,
                    // product_id:req.body.product_id,
                    // name:req.body.name,
                    // type:req.body.type,
                    // checkbox_name_one:req.body.checkbox_name_one,
                    // checkbox_name_two:req.body.checkbox_name_two,
                    // vendor_id: req.body.vendor_id,
                    // is_deleted:"0",
                });
            }
            //   req.flash('success')
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                product: 'active',
            };
            console.log("data flash ===================================>>>>>>>>>>>", data);
            return res.redirect('/backend/question_form');

            // return res.redirect(`/backend/product_setting_add/${req.body.menu_name}/${req.body.set_arrayid}`);
        } catch (error) {
            console.log("Error in ProductController in postApplication", error);
        }
    },

    delete_question: async function (req, res) {
        try {

            // let query = {};
            // query = {is_separateCategory: "false" };
            console.log(">>>>>>>delete>>>>>", req.params);

            let menudata = await Sys.App.Services.QuestionServices.getProductData({ _id: req.params.id });
            if (menudata) {
                let product = await Sys.App.Services.QuestionServices.updateProductData(
                    { _id: menudata._id },
                    {
                        $set: {
                            is_deleted: "1"
                        }
                    });
            }
            req.flash('success')
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                product: 'active',
            };
            console.log("delete");
            return res.send('success');
            //   return false;
            //   return res.redirect(`/backend/product_setting/list/${req.params.menu_name}`);
        } catch (e) {
            console.log("Error in ProductController in product_setting_addpost", e);
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

