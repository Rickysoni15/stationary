'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');

const productModel = mongoose.model('product')

module.exports = {

    getByData: async function(data){
        try {
            return  await productModel.find(data).lean();
        } catch (e) {
            console.log("Error in ProductServices in getByData",e);
        }
    },


    getByDatasort: async function(data){
        try {
            return  await productModel.find(data).lean().sort({createdAt:-1}).limit(8);
            // return  await productCategoryModel.find(data).lean();
        } catch (e) {
            console.log("Error in ProductCategoryServices in getByData",e);
        }
    },

    getByRating: async function(datafind,rating){
        try {
            return  await productModel.find(datafind).sort(rating).exec();
            // return  await productCategoryModel.find(data).lean();
        } catch (e) {
            console.log("Error in ProductCategoryServices in getByData",e);
        }
    },

    getByDatalimit: async function(data){
        try {
            return  await productModel.find(data).lean().limit(6);
            // return  await productCategoryModel.find(data).lean();
        } catch (e) {
            console.log("Error in ProductCategoryServices in getByData",e);
        }
    },

    getProductDatatable: async function(query, length, start){
        try {
            return await productModel.find(query).skip(start).limit(length);
        } catch (e) {
            console.log("Error in ProductServices in getProductDatatable",e);
        }
    },

    getProductPagination: async function(query,start,price){
        try {
            return await productModel.find(query).skip(start).sort(price).exec();
        } catch (e) {
            console.log("Error in ProductServices in getProductDatatable",e);
        }
    },

    getLatestProduct: async function(query,price,length){
        try {
            return await productModel.find(query).sort(price).limit(length).exec();
        } catch (e) {
            console.log("Error in ProductServices in getProductDatatable",e);
        }
    },

    getProductData: async function(data){
        try {
            return await productModel.findOne(data).lean();
        } catch (e) {
            console.log("Error in ProductServices in getProductData",e);
        }
    },

    getProductCount: async function(data){
        try {
            return await productModel.countDocuments(data);
        } catch (e) {
            console.log("Error in ProductServices in getProductCount",e);
        }
    },



    updateProductData: async function(condition, data){
        try {
            console.log("calling services");
            return await productModel.updateOne(condition, data);
        } catch (e) {
            console.log("Error in ProductServices in updateProductData",e);
        }
    },

    insertProductData: async function(data){
        try {
           return await productModel.create(data);
        } catch (e) {
            console.log("Error in ProductServices in insertProductData",e);
        }
    },

    deleteProduct: async function(data){
        try {
           return await productModel.deleteOne({_id: data});
        } catch (e) {
            console.log("Error in ProductServices in deleteProduct",e);
        }
    },
    deletePdf: async function(condition, data){
        try {
           return await productModel.updateMany(condition, data);
        } catch (e) {
            console.log("Error in ProductServices in deletePdf",e);
        }
    },
    deleteProductImg: async function(condition, data){
        try {
           return await productModel.updateOne(condition, data);
        } catch (e) {
            console.log("Error in ProductServices in deleteProductImg",e);
        }
    },


}