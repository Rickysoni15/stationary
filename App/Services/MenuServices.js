'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');

const menuModel = mongoose.model('menu')

module.exports = {

    getByData: async function(data){
        try {
            return  await menuModel.find(data).lean();
        } catch (e) {
            console.log("Error in MenuServices in getByData",e);
        }
    },

    getMenuDatatable: async function(query, length, start){
        try {
            return  await menuModel.find(query).skip(start).limit(length);
        } catch (e) {
            console.log("Error in MenuServices in getMenuDatatable",e);
        }
    },

    getMenuData: async function(data){
        try {
            return  await menuModel.findOne(data).lean();
        } catch (e) {
            console.log("Error in MenuServices in getMenuData",e);
        }
    },

    getMenuCount: async function(data){
        try {
            return  await menuModel.countDocuments(data);
        } catch (e) {
            console.log("Error in MenuServices in getMenuCount",e);
        }
    },



    updateMenuData: async function(condition, data){
        try {
            console.log("calling services");
            await menuModel.updateOne(condition, data);
        } catch (e) {
            console.log("Error in MenuServices in updateMenuData",e);
        }
    },

    insertMenuData: async function(data){
        try {
            await menuModel.create(data);
        } catch (e) {
            console.log("Error in MenuServices in insertMenuData",e);
        }
    },

    deleteMenu: async function(data){
        try {
            await menuModel.deleteOne({_id: data});
        } catch (e) {
            console.log("Error in MenuServices in deleteMenu",e);
        }
    },
    deletePdf: async function(condition, data){
        try {
            await menuModel.updateMany(condition, data);
        } catch (e) {
            console.log("Error in MenuServices in deletePdf",e);
        }
    },
    deleteMenuImg: async function(condition, data){
        try {
            await menuModel.updateOne(condition, data);
        } catch (e) {
            console.log("Error in MenuServices in deleteMenuImg",e);
        }
    },


}