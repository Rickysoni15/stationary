'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');

const homeModel = mongoose.model('contactus')

module.exports = {

    getByData: async function(data){
        try {
            return  await homeModel.find({data,is_deleted:0}).lean();
        } catch (e) {
            console.log("Error in ApplicationServices in getByData",e);
        }
    },

    getHomeDatatable: async function(query, length, start){
        try {
            return  await homeModel.find(query).skip(start).limit(length);
        } catch (e) {
            console.log("Error in ApplicationServices in getApplicationDatatable",e);
        }
    },

    getHomeData: async function(data){
        try {
            return  await homeModel.findOne(data).lean();
        } catch (e) {
            console.log("Error in ApplicationServices in getApplicationData",e);
        }
    },
    // getApplicationsData: async function(data){
    //     try {
    //         return  await homeModel.find(data).lean();
    //     } catch (e) {
    //         console.log("Error in ApplicationServices in getApplicationData",e);
    //     }
    // },

    getHomeCount: async function(data){
        try {
            return  await homeModel.countDocuments(data);
        } catch (e) {
            console.log("Error in ApplicationServices in getApplicationCount",e);
        }
    },



    updateHomeData: async function(condition, data){
        try {
            await homeModel.updateOne(condition, data);
        } catch (e) {
            console.log("Error in ApplicationServices in updateApplicationData",e);
        }
    },

    insertHomeData: async function(data){
        try {
            await homeModel.create(data);
        } catch (e) {
            console.log("Error in ApplicationServices in insertApplicationData",e);
        }
    },

    deleteHome: async function(data){
        try {
            await homeModel.updateOne({_id: data ,is_deleted : 1});
        } catch (e) {
            console.log("Error in ApplicationServices in deleteApplication",e);
        }
    },

}