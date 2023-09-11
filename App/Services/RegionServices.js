'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');

const regionModel = mongoose.model('region')
// const regionAddressModel = mongoose.model('regionAddress')

module.exports = {

    //Start of Region

    getByData: async function(data){
        try {
            return  await regionModel.find(data);
            // return  await regionModel.find(data).lean();
        } catch (e) {
            console.log("Error in RegionServices in getByData",e);
        }
    },



    getRegionDatatable: async function(query, length, start){
        try {
            return  await regionModel.find(query).skip(start).limit(length);
        } catch (e) {
            console.log("Error in RegionServices in getRegionDatatable",e);
        }
    },

    getRegionData: async function(data){
        try {
            return  await regionModel.findOne(data);
            // return  await regionModel.findOne(data).lean();
        } catch (e) {
            console.log("Error in RegionServices in getRegionData",e);
        }
    },

    

    getRegionCount: async function(data){
        try {
            return  await regionModel.countDocuments(data);
        } catch (e) {
            console.log("Error in RegionServices in getRegionCount",e);
        }
    },



    updateRegionData: async function(condition, data){
        try {
            console.log("Region update is called");
            await regionModel.updateOne(condition, data);
        } catch (e) {
            console.log("Error in RegionServices in updateRegionData",e);
        }
    },





    insertRegionData: async function(data){
        try {
            return await regionModel.create(data)
            // await regionModel.create(data);
        } catch (e) {
            console.log("Error in RegionServices in insertRegionData",e);
        }
    },



    deleteRegion: async function(data){
        try {
            await regionModel.deleteOne({_id: data});
        } catch (e) {
            console.log("Error in RegionServices in deleteApplication",e);
        }
    },


    // End of Region


}