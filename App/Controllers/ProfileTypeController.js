var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");


module.exports = {


    list: async function (req, res) {
        try {

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                applicationActive: 'active',

            };
            // console.log("Datat", data);
            return res.render('backend/profileType/listProfileType', data);
        } catch (e) {
            console.log("Error in profileTypeController in list", e);
        }
    },
    //For Frontend
    getSingleApplicationData: async function (req, res) {

        try {
            let data = await Sys.App.Services.ProfileTypeServices.getByData({});
            var sobj = {
                'data': data
            };
            console.log("obj??????", sobj);
            return res.send(sobj);
        } catch (e) {
            console.log("Error  in profileType", e);
        }
    },



    //End of Frontend

    getApplication: async function (req, res) {

        try {
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search.value;

            let query = {};
            if (search != '') {
                let capital = search;
                query = { name: { $regex: '.*' + search + '.*' }, is_deleted: "0" };
            } else {
                query = { is_deleted: "0" };
            }

            let applicationCount = await Sys.App.Services.ProfileTypeServices.getHomeCount(query);
            let data = await Sys.App.Services.ProfileTypeServices.getHomeDatatable(query, length, start);
            // let categoryname = await Sys.App.Services.CategoryServices.getCategoryDatatable();
            var obj = {
                'draw': req.query.draw,
                'recordsTotal': applicationCount,
                'recordsFiltered': applicationCount,
                'data': data,
                // 'categoryname': categoryname
            };
            console.log('data', obj);
            // console.log("categrrrrrrrydata", categoryname);
            res.send(obj);
        } catch (e) {
            console.log("Error in profileTypeController in getApplication", e);
        }
    },

    addApplication: async function (req, res) {
        try {
            let categoryData = await Sys.App.Services.ProfileTypeServices.getByData({});

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                applicationActive: 'active',
                categoryData: categoryData
            };
            return res.render('backend/profileType/addProfileType', data);
        } catch (e) {
            console.log("Error  in profileType", e);
        }
    },

    postApplication: async function (req, res) {

        try {
            //start of new code
            //   let image = req.files.applicationImage;
            //   console.log("Image", image);
            //   var re = /(?:\.([^.]+))?$/;
            //   var ext3 = re.exec(image.name)[1];
            //   let applicationImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
            //   console.log("ext3",ext3);
            //   let applicationImg = '/homeImage/'+applicationImage;
            // Use the mv() method to place the file somewhere on your server
            //   await image.mv('./public/homeImage/' + applicationImage, async function(err) {
            //       if (err) {
            //           req.flash('Error in ApplicationController in postApplication', err);
            //           return res.redirect('home/addHome');
            //         }
            //   });
            //   let type='video'
            //   if (ext3 != 'mp4'){
            //       type= 'image'
            //   }
            //end of newcode
            // let category = await Sys.App.Services.CategoryServices.getCategoryData({_id: req.body.categoryName});
            console.log("categoy", req.body);
            let application = await Sys.App.Services.ProfileTypeServices.insertHomeData({
                profileType: req.body.title,
                // description: req.body.description,
            });
            req.flash('success')
            return res.redirect('/backend/profileType');
        } catch (error) {
            console.log("Error in  profileType", error);
        }
    },

    applicationDelete: async function (req, res) {
        try {
            let application = await Sys.App.Services.ProfileTypeServices.getHomeData({ _id: req.body.id });
            if (application || application.length > 0) {
                await Sys.App.Services.ProfileTypeServices.updateHome(
                    { _id: req.body.id },
                    {
                        is_deleted: "1"
                    }
                )
                return res.send("success");
            } else {
                return res.send("error in  profileType");
            }
        } catch (e) {
            console.log("Erro in  in profileType", e);
        }
    },

    editApplication: async function (req, res) {
        try {
            // let categoryData = await Sys.App.Services.CategoryServices.getByData({  }); 
            let application = await Sys.App.Services.ProfileTypeServices.getHomeData({
                _id: req.params.id
            });
            return res.render('backend/profileType/addProfileType', { application: application, applicationActive: 'active' });
        } catch (e) {
            console.log("Error  in profileType", e);
        }

    },

    editApplicationPostData: async function (req, res) {
        try {

            // let category = await Sys.App.Services.CategoryServices.getCategoryData({_id: req.body.categoryName})
            let application = await Sys.App.Services.ProfileTypeServices.getHomeData({ _id: req.params.id });
            if (application) {

                updateData = {
                    profileType: req.body.title,
                    // description: req.body.description,
                }


                await Sys.App.Services.ProfileTypeServices.updateHomeData({ _id: req.params.id }, updateData)
                req.flash('success', 'Home updated successfully');
                return res.redirect('/backend/profileType');

            } else {
                req.flash('error', 'Home not update successfully');
                return res.redirect('/backend/profileType');
            }
        } catch (e) {
            console.log("Error", e);
        }
    },


}





















































