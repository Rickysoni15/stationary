'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const userModel  			= mongoose.model('user');
const aboutModel      = mongoose.model('about');

module.exports = {

  getUserData: async function(data){
        try {
          return  await userModel.find(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

  getUserCount: async function(data){
    try {
          return  await userModel.countDocuments(data);
        } catch (e) {
          console.log("Error",e);
    }
  },

	getSingleUserData: async function(data){
        try {
          return  await userModel.findOne(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

  getUserDatatable: async function(query, length, start){
        try {
          return  await userModel.find(query).skip(start).limit(length);
        } catch (e) {
          console.log("Error",e);
        }
	},

  insertUserData: async function(data){
        try {
          return await userModel.create(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

  deleteUser: async function(data){
        try {
          await userModel.deleteOne({_id: data});
        } catch (e) {
          console.log("Error",e);
        }
  },

	updateUserData: async function(condition, data){
        try {
          return await userModel.findOneAndUpdate(condition, data);
        } catch (e) {
          console.log("Error",e);
          throw e;
        }
	},

// ABOUT US
    getAboutData: async function(data){
        try {
        return  await aboutModel.find(data);
        } catch (e) {
        console.log("Error",e);
        }
    },

	getByDataAbout: async function(data){
				try {
					return  await aboutModel.findOne(data).lean();
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
          return  await aboutModel.countDocuments(data);
        } catch (e) {
          console.log("Error",e);
    }
  },

	getAboutDatatable: async function(query, length, start){
        try {
          return  await aboutModel.find(query).skip(start).limit(length);
        } catch (e) {
          console.log("Error",e);
        }
	},

	updateAboutData: async function(condition, data){
		try {
			await aboutModel.updateOne(condition, data);
		} catch (e) {
			console.log("Error",e);
		}
	},

	insertAboutData: async function(data){
		try {
			await aboutModel.create(data);
		} catch (e) {
			console.log("Error",e);
		}
	},

	deleteAbout: async function(data){
        try {
          await aboutModel.deleteOne({_id: data});
        } catch (e) {
          console.log("Error",e);
        }
  },

// End of ABOUT US


}
