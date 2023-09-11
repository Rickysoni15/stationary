var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");
var mongoose = require('mongoose');
const datetime = require('date-and-time');
const crypto = require("crypto");
const Razorpay = require("razorpay");
const request = require('request');
const f = require('session-file-store');
const { json } = require('express');
var axios = require('axios');
const instance = new Razorpay({
    key_id: 'rzp_test_TuIsuSCYym3sTj',
    key_secret: '9tfjzG39QmCizLo5xSOiFj2V',
});

let url = Sys.Config.Socket.url

// console.log("::url:::",url);

const nodemailer = require('nodemailer');

let defaultTransport = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com', // <= your smtp server here
    port: 587, // <= connection port
    // secure: true, // use SSL or not
    auth: {
        user: 'intrilogykira@gmail.com',
        pass: 'WLs8g7yk5GMd0mYV'
        // user: 'info@kiraintrilogy.com',
        // pass: 'TgpKcOMXkdUVYZjb'
    }
});

module.exports = {

    confirmOrder: async function (req, res) {
        try {
            console.log("::confirmOrder::function:", req.body);
            let date = new Date();
            let day = String(date.getDate()).padStart(2, '0');
            let month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so we add 1
            let year = date.getFullYear();
          
            let dateCreate =  `${day}/${month}/${year}`;

            let deliveryMethod = req.body.deliveryMethod
            let deliveryArray = []
            deliveryArray.push({
                shippingMethod: deliveryMethod.shippingMethod,
                comment: deliveryMethod.comment
            })

            let paymentMethod = req.body.paymentMethod
            let paymentArray = []
            paymentArray.push({
                paymentMethod: paymentMethod.paymentMethod,
                comment: paymentMethod.comment,
                agree: paymentMethod.agree
            })

            // console.log("::deliveryArray:::", deliveryArray, ":::paymentArray:::", paymentArray);

            let deliveryDetails = req.body.deliveryDetails
            let billingDetails = req.body.billingDetails
            let confirmOrder = req.body.confirmOrder

            let products = confirmOrder.products

            // console.log(":::req.session.details.id:::", req.session.details.id);

            // count order number based on customer
            let orderCount = await Sys.App.Services.OrderServices.getOrderHistoryCount({ customer_id: req.session.details.id, is_deleted: "0" })

            // console.log(":::orderCount:::", orderCount);

            let orderNumber = orderCount + 1
            // console.log(":::orderNumber:::", orderNumber);
            // let orderStatus = "confirmed"
            let subTotal = req.body.confirmOrder.subTotal
            let taxTotal = req.body.confirmOrder.taxTotal
            let flatShippingRate = req.body.confirmOrder.flatShippingRate
            let grandTotal = req.body.confirmOrder.grandTotal

            // console.log(":::subTotal:::", subTotal, ":::taxTotal:::", taxTotal, ":::flatShippingRate:::", flatShippingRate, ":::grandTotal:::", grandTotal);

            let deliveryAddressType = deliveryDetails.shippingAddress

            let delivery_address = []

            if (deliveryAddressType == "existing") {
                console.log(":::fetch existing address and save in db:::");

                let addressId = deliveryDetails.addressId

                //  console.log(":::addressId:::", addressId);

                //  addressId = "a6bebf7818ff" 

                // find address from customer db based on addressId
                let customerInfo = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id, is_deleted: "0" })

                // console.log(":::customerInfo:::", customerInfo);

                let addressDetail = customerInfo.address_arr

                let findAddress = addressDetail.find(obj => obj.id === addressId);

                // console.log(":::findAddress:", findAddress);

                let deliver_address_obj = {
                    firstname: findAddress.firstname,
                    lastname: findAddress.lastname,
                    company: findAddress.company,
                    address_1: findAddress.address_1,
                    address_2: findAddress.address_2,
                    city: findAddress.city,
                    postcode: findAddress.postcode,
                    countryName: findAddress.countryName,
                    stateName: findAddress.stateName,
                }

                delivery_address.push(deliver_address_obj)
            } else {
                console.log(":::get new address and save in db:::");

                let countryName = deliveryDetails.countryId.split('_')
                countryName = countryName[1]

                let stateName = deliveryDetails.zoneId.split('_')
                stateName = stateName[1]

                let deliver_address_obj = {
                    firstname: deliveryDetails.firstname,
                    lastname: deliveryDetails.lastname,
                    company: deliveryDetails.company,
                    address_1: deliveryDetails.address1,
                    address_2: deliveryDetails.address2,
                    city: deliveryDetails.city,
                    postcode: deliveryDetails.postcode,
                    countryName: countryName,
                    stateName: stateName,
                }

                delivery_address.push(deliver_address_obj)
            }

            // console.log("::delivery_address::",delivery_address);

            let billingAddressType = billingDetails.shippingAddress

            let billing_address = []

            if (billingAddressType == "existing") {
                console.log(":::fetch existing address and save in db:::");

                let addressId = billingDetails.addressId

                //  console.log(":::addressId:::", addressId);

                //  addressId = "a6bebf7818ff" 

                // find address from customer db based on addressId
                let customerInfo = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: req.session.details.id, is_deleted: "0" })

                // console.log(":::customerInfo:::", customerInfo);

                let addressDetail = customerInfo.address_arr

                let findAddress = addressDetail.find(obj => obj.id === addressId);

                // console.log(":::findAddress:", findAddress);

                let billing_address_obj = {
                    firstname: findAddress.firstname,
                    lastname: findAddress.lastname,
                    company: findAddress.company,
                    address_1: findAddress.address_1,
                    address_2: findAddress.address_2,
                    city: findAddress.city,
                    postcode: findAddress.postcode,
                    countryName: findAddress.countryName,
                    stateName: findAddress.stateName,
                }

                billing_address.push(billing_address_obj)
            } else {
                console.log(":::get new address and save in db:::");

                let countryName = billingDetails.countryId.split('_')
                countryName = countryName[1]

                let stateName = billingDetails.zoneId.split('_')
                stateName = stateName[1]

                let billing_address_obj = {
                    firstname: billingDetails.firstname,
                    lastname: billingDetails.lastname,
                    company: billingDetails.company,
                    address_1: billingDetails.address1,
                    address_2: billingDetails.address2,
                    city: billingDetails.city,
                    postcode: billingDetails.postcode,
                    countryName: countryName,
                    stateName: stateName,
                }

                billing_address.push(billing_address_obj)

            }

            // console.log("::billing_address::", billing_address);

            let obj = {
                customer_id: req.session.details.id,
                orderNumber: orderNumber,
                products: products,
                billing_address: billing_address,
                delivery_address: delivery_address,
                delivery_method: deliveryMethod,
                payment_method: paymentMethod,
                subTotal: subTotal,
                shipping_charge: flatShippingRate,
                taxTotal: taxTotal,
                grandTotal: grandTotal,
                createdDate:dateCreate
            }

            // console.log("::obj::", obj);

            let createOrder = await Sys.App.Services.OrderServices.insertOrderHistoryData(obj)

            // console.log(":::createOrder:::", createOrder);

            // code for remove product from cart
            if (createOrder) {
                // based on product change in order db
                let customerId = req.session.details.id
                let productDetail = createOrder.products

                if (productDetail.length) {
                    for (let i = 0; i < productDetail.length; i++) {
                        // console.log("::productDetail:::",productDetail[i].productId);
                        let product = await Sys.App.Services.OrderServices.updateSingleUserData({ customer_id: customerId, product_id: productDetail[i].productId, is_deleted: "0", product_status: "pending" }, { product_status: "confirmed", order_id: createOrder.orderNumber })
                    }
                }
            }

            return res.send("success");
        } catch (error) {
            console.log(":::Error in confrim order:::", error);
        }
    },

    orderHistory: async function (req, res) {
        console.log(":::orderHistory:::function:::");
        if (req.session.details == undefined) {
            return res.redirect('/home')
        }

        let orderHistoryDetail = await Sys.App.Services.OrderServices.getOrderHistoryData({ customer_id: req.session.details.id, is_deleted: "0" })

        let orderHistoryArray = []

        if (orderHistoryDetail.length) {
            for (let i = 0; i < orderHistoryDetail.length; i++) {
                let obj = {}
                obj.id = orderHistoryDetail[i]._id
                obj.orderId = orderHistoryDetail[i].orderNumber

                let customerId = orderHistoryDetail[i].customer_id

                let customerInfo = await Sys.App.Services.CustomerServices.getSingleUserData({ _id: customerId })

                let deliveryAddress = orderHistoryDetail[i].delivery_address[0]

                let customerName = ""
                if (deliveryAddress) {
                    customerName = `${deliveryAddress.firstname} ${deliveryAddress.lastname}`
                }

                obj.customerName = customerName
                let productArray = orderHistoryDetail[i].products
                let totalQuantity = productArray.reduce((accumulator, currentValue) => {
                    return accumulator + parseFloat(currentValue.quantity);
                }, 0);
                // console.log(":::totalQuantity:::", totalQuantity);

                obj.quantity = totalQuantity
                obj.status = orderHistoryDetail[i].order_status
                obj.total = orderHistoryDetail[i].grandTotal
                obj.dateAdded = orderHistoryDetail[i].createdDate

                orderHistoryArray.push(obj)
            }   
        }
        console.log("::orderHistoryArray:::", orderHistoryArray);
        var data = {
            App: req.session.details,
            orderHistory: orderHistoryArray,
            error: req.flash("error"),
            success: req.flash("success"),
            userActive: 'active'
        };
        return res.render('frontend/orderHistory', data);
    },

    orderInformation: async function (req, res) {
        try {
            console.log("::req.params::", req.params);

            let orderNumber = parseInt(req.params.id)

            let findOrderDetail = await Sys.App.Services.OrderServices.getSingleOrderHistoryData({customer_id:req.session.details.id,orderNumber:orderNumber,is_deleted:"0"})

            console.log(":::findOrderDetail::::", findOrderDetail);

            let paymentAddress = findOrderDetail.billing_address[0]
            paymentAddress.name = `${paymentAddress.firstname} ${paymentAddress.lastname}`

            paymentAddress.cityPincode = `${paymentAddress.city}  ${paymentAddress.postcode}`
            // console.log("::paymentAddress:::", paymentAddress);

            let shippingAddress = findOrderDetail.delivery_address[0]
            shippingAddress.name = `${shippingAddress.firstname} ${shippingAddress.lastname}`

            shippingAddress.cityPincode = `${shippingAddress.city}  ${shippingAddress.postcode}`
            // console.log("::shippingAddress:::", shippingAddress);

            var data = {
                App: req.session.details,
                orderId: findOrderDetail.orderNumber,
                orderStatus: findOrderDetail.order_status,
                dateAdded: findOrderDetail.createdDate,
                paymentAddress:paymentAddress,
                shippingAddress,shippingAddress,
                products: findOrderDetail.products,
                subTotal: findOrderDetail.subTotal,
                shipping_charge: findOrderDetail.shipping_charge,
                taxTotal:findOrderDetail.taxTotal,
                grandTotal: findOrderDetail.grandTotal,
                // orderHistory: orderHistoryArray,
                error: req.flash("error"),
                success: req.flash("success"),
                userActive: 'active'
            };
            return res.render('frontend/orderInformation', data);
        } catch (error) {
            console.log(":::Error in order information:::", error);
        }
       
    }

}