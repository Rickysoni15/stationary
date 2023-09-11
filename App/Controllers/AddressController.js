

// var Sys = require('../../Boot/Sys');

// module.exports = {
//     addAddress: async function(req,res){
//         try {
//             var data = {
//                 App 					: req.session.details,
//                 error 				    : req.flash("error"),
//                 success				    : req.flash("success"),
//                 regionActive 	        : 'active'
//             };
//             return res.render('region/addRegion',data);
//         } catch (e) {
//             console.log("Error in RegionController in addRegion",e);
//         }
//     },

//     postAddress: async function(req, res){
//         console.log(req.body);
//         try {
//             // let regionData = await Sys.App.Services.RegionServices.getRegionData({
//             //     regionName: req.body.regionName,
//             // });
//             // if (regionData) {
//             //     console.log("region already Exists")
//             //     req.flash('error', "Region already Exists!");
//             //     return res.redirect('/backend/region');
//             // } else {
//                 await Sys.App.Services.RegionServices.insertRegionAddressData({
//                     address: req.body.address,
//                 })
//                 req.flash("success", "Address inserted Successfully!")
//                 return res.redirect('/backend/region');
//             // }

//         } catch (error) {
//             console.log("Error in RegionController in postRegion",error);
//         }
//     },

// }