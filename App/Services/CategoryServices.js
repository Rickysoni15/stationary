'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');

const categoryModel = mongoose.model('category')

module.exports = {

    getByData: async function(data){
        try {
            return  await categoryModel.find(data).lean();
            // return  await categoryModel.find(data).lean();
        } catch (e) {
            console.log("Error in CategoryServices in getByData",e);
        }
    },

    getCategoryDatatable: async function(query, length, start){
        try {
            return  await categoryModel.find(query).skip(start).limit(length);
        } catch (e) {
            console.log("Error in CategoryServices in getCategoryDatatable",e);
        }
    },

    getCategoryData: async function(data){
        try {
            return  await categoryModel.findOne(data);
            // return  await categoryModel.findOne(data).lean();
        } catch (e) {
            console.log("Error in CategoryServices in getCategoryData",e);
        }
    },

    getCategoryCount: async function(data){
        try {
            return  await categoryModel.countDocuments(data);
        } catch (e) {
            console.log("Error in CategoryServices in getCategoryCount",e);
        }
    },



    updateCategoryData: async function(condition, data){
        try {
            await categoryModel.updateOne(condition, data);
        } catch (e) {
            console.log("Error in CategoryServices in updateCategoryData",e);
        }
    },

    insertCategoryData: async function(data){
        try {
            return await categoryModel.create(data)
            // await categoryModel.create(data);
        } catch (e) {
            console.log("Error in CategoryServices in insertCategoryData",e);
        }
    },

    deleteCategory: async function(data){
        try {
            await categoryModel.deleteOne({_id: data});
        } catch (e) {
            console.log("Error in CategoryServices in deleteApplication",e);
        }
    },

}