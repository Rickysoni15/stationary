'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');

const vendorModel = mongoose.model('couponcode');

module.exports = {

    // getVendorCount: async function(data){
    //     try {
    //         return  await vendorModel.countDocuments(data);
    //     } catch (e) {
    //         console.log("Error in getVendorCount",e);
    //     }
    // },
    addVendor: async function(data){
        try {
            return await vendorModel.create(data)
            // await regionModel.create(data);
        } catch (e) {
            console.log("Error in addVendor",e);
        }
    },
    
    getByData: async function(data){
        try {
            return  await vendorModel.find(data).lean();
            // return  await vendorModel.find(data).lean();
        } catch (e) {
            console.log("Error in VendorServices in getByData",e);
        }
    },

    getVendorDatatable: async function(query, length, start){
        try {
            return  await vendorModel.find(query).skip(start).limit(length);
        } catch (e) {
            console.log("Error in VendorServices in getVendorDatatable",e);
        }
    },

    getVendorData: async function(data){
        try {
            return  await vendorModel.findOne(data).lean();
            // return  await vendorModel.findOne(data).lean();
        } catch (e) {
            console.log("Error in VendorServices in getVendorData",e);
        }
    },

    getVendorCount: async function(data){
        try {
            return  await vendorModel.countDocuments(data);
        } catch (e) {
            console.log("Error in VendorServices in getVendorCount",e);
        }
    },

    getSingleVendorData: async function(data){
        try {
          return  await vendorModel.findOne(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

    updateVendorData: async function(condition, data){
        try {
            await vendorModel.updateOne(condition, data);
        } catch (e) {
            console.log("Error in VendorServices in updateVendorData",e);
        }
    },

    insertVendorData: async function(data){
        try {
            return await vendorModel.create(data)
            // await vendorModel.create(data);
        } catch (e) {
            console.log("Error in VendorServices in insertVendorData",e);
        }
    },

    deleteVendor: async function(data){
        try {
            await vendorModel.deleteOne({_id: data});
        } catch (e) {
            console.log("Error in VendorServices in deleteVendor",e);
        }
    },

    deletePdf: async function(condition, data){
        try {
            await vendorModel.updateMany(condition, data);
        } catch (e) {
            console.log("Error in VendorServices in deletePdf",e);
        }
    },


}