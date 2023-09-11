var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");
// const flash = require('flash');
const { mongo } = require('mongoose');
const { url } = require('inspector');


module.exports = {
    list: async function(req,res){
		try {
			var data = {
				App 					: req.session.details,
				error 				    : req.flash("error"),
				success				    : req.flash("success"),
                categoryActive 	        : 'active'
			};
			return res.render('backend/category/listCategory',data);
		} catch (e) {
			console.log("Error in CategoryController in list",e);
		}
	},

    getCategory: async function(req,res){

		try {
			let start = parseInt(req.query.start);
			let length = parseInt(req.query.length);
			let search = req.query.search.value;

			let query = {};
			if (search != '') {
				let capital = search;
                query = { categoryName: { $regex: '.*' + search + '.*' }, is_deleted: "0" };
            } else {
            	query = { is_deleted: "0" };
            }

            let categoryCount = await Sys.App.Services.CategoryServices.getCategoryCount(query);
            let data = await Sys.App.Services.CategoryServices.getCategoryDatatable(query, length, start);
            var obj = {
            	'draw': req.query.draw,
            	'recordsTotal': categoryCount,
            	'recordsFiltered': categoryCount,
            	'data': data
            };
            res.send(obj);
        } catch (e) {
        	console.log("Error in CategoryController in getCategory",e);
        }
    },

    addCategory: async function(req,res){
        try {
            var data = {
                App 					: req.session.details,
                error 				    : req.flash("error"),
                success				    : req.flash("success"),
                categoryActive 	        : 'active'
            };
            return res.render('backend/category/addCategory',data);
      } catch (e) {
        console.log("Error in CategoryController in addCategory",e);
      }
    },

    postCategory: async function(req, res){

        try {
            let categoryData = await Sys.App.Services.CategoryServices.getCategoryData({
                categoryName: req.body.categoryName,
            });

                if (categoryData) {
                    req.flash('error', "Category already Exists!");
                    return res.redirect('/backend/category');
                } else {
                    await Sys.App.Services.CategoryServices.insertCategoryData({
                        categoryName: req.body.categoryName,
                    })
                    req.flash('success', "Category inserted Successfully!")
                    return res.redirect('/backend/category');
                }

            } catch (error) {
                console.log("Error in CategoryController in postCategory",error);
            }
    },

    categoryDelete: async function(req,res){
        try {
            let category = await Sys.App.Services.CategoryServices.getCategoryData({_id: req.body.id});
            if (category || category.length >0) {
                await Sys.App.Services.CategoryServices.deleteCategory(
                                { _id: req.body.id},
                                {
                                    is_deleted : "1"
                                }
                            )
                return res.send("success");
            }else {
                return res.send("error in CategoryController in categoryDelete");
            }
        } catch (e) {
            console.log("Error in CategoryController in categoryDelete",e);
        }
    },

    editCategory: async function(req,res){
        try {
            let category = await Sys.App.Services.CategoryServices.getCategoryData({_id: req.params.id});
            var data = {
                App 					: req.session.details,
                error 				    : req.flash("error"),
                success				    : req.flash("success"),
                category                : category,
                categoryActive 	        : 'active'

            };
            return res.render('backend/category/addCategory',data);
        } catch (e) {
            console.log("Error in CategoryController in editCategory",e);
        }
 
    },


    editCategoryPostData: async function(req,res){
        try {
          let category = await Sys.App.Services.CategoryServices.getCategoryData({_id: req.params.id});
          if (category.categoryName && category.categoryName.length > 0) {
                await Sys.App.Services.CategoryServices.updateCategoryData(
                    {
                        _id: req.params.id
                    }, {
                        categoryName: req.body.categoryName,
                    }
                )
                req.flash('success', "User update successfully")
                res.redirect('/backend/category')
            } else {
                req.flash('error', 'No User found')
                return res.redirect('/backend/category');
            }
        } catch (e) {
            console.log("Error",e);
        }
    },

    
    // editCategory: async function(req,res){
    //     try {
    //         let category = await Sys.App.Services.CategoryServices.getCategoryData({_id: req.params.id});
    //         return res.render('category/addCategory',{category: category , categoryActive : 'active'});
    //     } catch (e) {
    //         console.log("Error in CategoryController in editCategory",e);
    //     }
 
    // },


    // editCategoryPostData: async function(req,res){
    //     try {
    //       let category = await Sys.App.Services.CategoryServices.getCategoryData({_id: req.params.id});
    //       if (category) {
	// 					let updateData = {
	// 						categoryName						:	req.body.categoryName,
	// 			    	}
    //           await Sys.App.Services.CategoryServices.updateCategoryData({ _id: req.params.id },updateData)
    //           req.flash('success','Category updated successfully');
    //           return res.redirect('/backend/category');

    //         }else {
    //             req.flash('error', 'Category not update successfully');
    //             return res.redirect('/backend/category');
    //         }
    //     } catch (e) {
    //         console.log("Error",e);
    //     }
    // },


}





















































