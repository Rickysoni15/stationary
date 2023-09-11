'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const userModel = mongoose.model('order');
const OrderHistoryModel = mongoose.model('orderHistory')

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

  updateManyUserData: async function (condition, data) {
    try {
      return await userModel.updateMany(condition, data);
    } catch (e) {
      console.log("Error", e);
      throw e;
    }
  },

  updateSingleUserData: async function (condition, data) {
    try {
      return await userModel.findOneAndUpdate(condition, data);
    } catch (e) {
      console.log("Error", e);
      throw e;
    }
  },

  // route for OrderHistory DB


  getOrderHistoryData: async function (data) {
    try {
      return await OrderHistoryModel.find(data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  getOrderHistoryCount: async function (data) {
    try {
      return await OrderHistoryModel.countDocuments(data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  getSingleOrderHistoryData: async function (data) {
    try {
      return await OrderHistoryModel.findOne(data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  getOrderHistoryDatatable: async function (query, length, start) {
    try {
      return await OrderHistoryModel.find(query).skip(start).limit(length);
    } catch (e) {
      console.log("Error", e);
    }
  },

  insertOrderHistoryData: async function (data) {
    try {
      return await OrderHistoryModel.create(data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  deleteOrderHistory: async function (data) {
    try {
      await OrderHistoryModel.deleteOne({ _id: data });
    } catch (e) {
      console.log("Error", e);
    }
  },

  updateOrderHistoryData: async function (condition, data) {
    try {
      return await OrderHistoryModel.update(condition, data);
    } catch (e) {
      console.log("Error", e);
      throw e;
    }
  },

  updateManyOrderHistoryData: async function (condition, data) {
    try {
      return await OrderHistoryModel.updateMany(condition, data);
    } catch (e) {
      console.log("Error", e);
      throw e;
    }
  },

  updateSingleOrderHistoryData: async function (condition, data) {
    try {
      return await OrderHistoryModel.findOneAndUpdate(condition, data);
    } catch (e) {
      console.log("Error", e);
      throw e;
    }
  },


}
