'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');

const homeModel = mongoose.model('profileType')

module.exports = {

    getByData: async function(data){
        try {
            return  await homeModel.find(data).lean();
        } catch (e) {
            console.log("Error in ProfileType in getByData",e);
        }
    },

    getHomeDatatable: async function(query, length, start){
        try {
            return  await homeModel.find(query).skip(start).limit(length);
        } catch (e) {
            console.log("Error in ProfileType in getApplicationDatatable",e);
        }
    },

    getHomeData: async function(data){
        try {
            return  await homeModel.findOne(data).lean();
        } catch (e) {
            console.log("Error in ProfileType in getApplicationData",e);
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
            console.log("Error in ProfileType in getApplicationCount",e);
        }
    },



    updateHomeData: async function(condition, data){
        try {
            await homeModel.updateOne(condition, data);
        } catch (e) {
            console.log("Error in ProfileType in updateApplicationData",e);
        }
    },

    insertHomeData: async function(data){
        try {
            await homeModel.create(data);
        } catch (e) {
            console.log("Error in ProfileType in insertApplicationData",e);
        }
    },

    deleteHome: async function(data){
        try {
            await homeModel.deleteOne({_id: data });
        } catch (e) {
            console.log("Error in ProfileType in deleteApplication",e);
        }
    },

}