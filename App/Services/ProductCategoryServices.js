'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');

const productCategoryModel = mongoose.model('productCategory')

module.exports = {

    getByData: async function(data){
        try {
            return  await productCategoryModel.find(data).lean();
            // return  await productCategoryModel.find(data).lean();
        } catch (e) {
            console.log("Error in ProductCategoryServices in getByData",e);
        }
    },

    getProductCategoryDatatable: async function(query, length, start){
        try {
            return  await productCategoryModel.find(query).skip(start).limit(length);
        } catch (e) {
            console.log("Error in ProductCategoryServices in getProductCategoryDatatable",e);
        }
    },

    getProductCategoryData: async function(data){
        try {
            return  await productCategoryModel.findOne(data).lean();
            // return  await productCategoryModel.findOne(data).lean();
        } catch (e) {
            console.log("Error in ProductCategoryServices in getProductCategoryData",e);
        }
    },

    getProductCategoryCount: async function(data){
        try {
            return  await productCategoryModel.countDocuments(data);
        } catch (e) {
            console.log("Error in ProductCategoryServices in getProductCategoryCount",e);
        }
    },



    updateProductCategoryData: async function(condition, data){
        try {
            await productCategoryModel.updateOne(condition, data);
        } catch (e) {
            console.log("Error in ProductCategoryServices in updateProductCategoryData",e);
        }
    },

    insertProductCategoryData: async function(data){
        try {
            return await productCategoryModel.create(data)
            // await productCategoryModel.create(data);
        } catch (e) {
            console.log("Error in ProductCategoryServices in insertProductCategoryData",e);
        }
    },

    deleteProductCategory: async function(data){
        try {
            await productCategoryModel.deleteOne({_id: data});
        } catch (e) {
            console.log("Error in ProductCategoryServices in deleteProductCategory",e);
        }
    },
    deletePdf: async function(condition, data){
        try {
            await productCategoryModel.updateMany(condition, data);
        } catch (e) {
            console.log("Error in ProductCategoryServices in deletePdf",e);
        }
    },

}