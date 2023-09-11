'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const privacyModel      = mongoose.model('policy');

module.exports = {

// PRIVACY POLICY
getAboutData: async function(data){
    try {
    return  await privacyModel.find(data);
    } catch (e) {
    console.log("Error",e);
    }
},

getByDataAbout: async function(data){
            try {
                return  await privacyModel.findOne(data).lean();
            } catch (e) {
                console.log("Error",e);
            }
},

// getMultipleAbout: async function(data){
// 			try {
// 				return  await aboutModel.find(data).lean();
// 			} catch (e) {
// 				console.log("Error",e);
// 			}
// },

getAboutCount: async function(data){
try {
      return  await privacyModel.countDocuments(data);
    } catch (e) {
      console.log("Error",e);
}
},

getAboutDatatable: async function(query, length, start){
    try {
      return  await privacyModel.find(query).skip(start).limit(length);
    } catch (e) {
      console.log("Error",e);
    }
},

updateAboutData: async function(condition, data){
    try {
        await privacyModel.updateOne(condition, data);
    } catch (e) {
        console.log("Error",e);
    }
},

insertAboutData: async function(data){
    try {
        await privacyModel.create(data);
    } catch (e) {
        console.log("Error",e);
    }
},

deleteAbout: async function(data){
    try {
      await privacyModel.deleteOne({_id: data});
    } catch (e) {
      console.log("Error",e);
    }
},

// End of PRIVACY POLICY


}
