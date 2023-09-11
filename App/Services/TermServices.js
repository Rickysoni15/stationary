'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');

const termModel      = mongoose.model('term');

module.exports = {


// TERM & CONDITION
getAboutData: async function(data){
    try {
    return  await termModel.find(data);
    } catch (e) {
    console.log("Error",e);
    }
},

getByDataAbout: async function(data){
            try {
                return  await termModel.findOne(data).lean();
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
      return  await termModel.countDocuments(data);
    } catch (e) {
      console.log("Error",e);
}
},

getAboutDatatable: async function(query, length, start){
    try {
      return  await termModel.find(query).skip(start).limit(length);
    } catch (e) {
      console.log("Error",e);
    }
},

updateAboutData: async function(condition, data){
    try {
        await termModel.updateOne(condition, data);
    } catch (e) {
        console.log("Error",e);
    }
},

insertAboutData: async function(data){
    try {
        await termModel.create(data);
    } catch (e) {
        console.log("Error",e);
    }
},

deleteAbout: async function(data){
    try {
      await termModel.deleteOne({_id: data});
    } catch (e) {
      console.log("Error",e);
    }
},

// End of TERM & CONDITION


}
