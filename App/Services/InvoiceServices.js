'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const userModel = mongoose.model('invoice');
const productModel = mongoose.model('invoice');
module.exports = {

  getUserData: async function (data) {
    try {
      return await userModel.find(data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  getUserCount: async function (data) {
    try {
      return await userModel.countDocuments(data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  getSingleUserData: async function (data) {
    try {
      return await userModel.findOne(data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  getUserDatatable: async function (query, length, start) {
    try {
      return await userModel.find(query).skip(start).limit(length);
    } catch (e) {
      console.log("Error", e);
    }
  },

  insertUserData: async function (data) {
    try {
      return await userModel.create(data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  deleteUser: async function (data) {
    try {
      await userModel.deleteOne({ _id: data });
    } catch (e) {
      console.log("Error", e);
    }
  },

  updateUserData: async function (condition, data) {
    try {
      return await userModel.update(condition, data);
    } catch (e) {
      console.log("Error", e);
      throw e;
    }
  },

  updateSingleUserData: async function (condition, data) {
    try {
      return await userModel.updateOne(condition, data);
    } catch (e) {
      console.log("Error", e);
      throw e;
    }
  },

  updateManyUserData: async function (condition, data) {
    try {
      return await userModel.updateMany(condition, data);
    } catch (e) {
      console.log("Error", e);
      throw e;
    }
  },

  // admin service

  getByData: async function(data){
    try {
        return  await productModel.find(data).lean();
    } catch (e) {
        console.log("Error in ProductServices in getByData",e);
    }
},


getByDatasort: async function(data){
    try {
        return  await productModel.find(data).lean().sort({createdAt:-1}).limit(6);
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
