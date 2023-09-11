var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");

module.exports = {

    about: async function(req, res) {
        try {
            console.log("==");
            
            let aboutCount = await Sys.App.Services.UserServices.getAboutCount({}); //gets the no of docs
            console.log("count", aboutCount);

            let updateButtonShow = 'false';
            if (aboutCount > 0) {
              updateButtonShow = 'true';
            }
            var data = {
                App : req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                aboutActive : 'active',
                updateButtonShow: updateButtonShow,
                // showData   : showData
            };
            // if(aboutCount > 0){
            //   return res.render('about/addAbout',showData);
            // } else {
            //   return res.render('about/addAbout', data);
            // }
          
        } catch (error) {
            console.log("Error in about ", error);
        }
    },

    getAbout: async function(req,res){
          try {
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search.value;
    
            let query = {};
            if (search != '') {
              query = { heading: { $regex: '.*' + search + '.*' } };
            } else {
              query = { };
            }
    
            let aboutCount = await Sys.App.Services.UserServices.getAboutCount(query);
    
    
            let data = await Sys.App.Services.UserServices.getAboutDatatable(query, length, start);
            // console.log("data", data);
            var obj = {
              'draw': req.query.draw,
              'recordsTotal': aboutCount,
              'recordsFiltered': aboutCount,
              'data': data
            };
              res.send(obj);
          } catch (e) {
              console.log("Error",e);
          }
    },

    aboutAdd: async function(req, res){
        try {
          let about = await Sys.App.Services.UserServices.getByDataAbout({ });
          console.log('about', about);
              var data = {
                App         : req.session.details,
                error       : req.flash("error"),
                success     : req.flash("success"),
                aboutUs : 'active',
                about       :  about,
            };
            return res.render('backend/about/addAbout',data);
        }catch (error) {
          console.log("Error in CmsController investorsAdd",error);
        }
    },

    aboutAddPost: async function(req, res){

      try {
        // console.log(req.files,"image");
        // //start of new code
        // let image = req.files.aboutImage;
        // console.log("Image", image);
        // var re = /(?:\.([^.]+))?$/;
        // var ext3 = re.exec(image.name)[1];
        // let aboutImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
        // let aboutImg = '/aboutImage/'+aboutImage;
        // // Use the mv() method to place the file somewhere on your server
        // await image.mv('./public/aboutImage/' + aboutImage, async function(err) {
        //     if (err) {
        //         req.flash('error', 'Error Uploading Image');
        //         return res.redirect('about/addAbout');
        //       }
        // });
        //end of newcode
        console.log("req.body",req.body);
        let about = await Sys.App.Services.UserServices.insertAboutData({
        //   heading:              req.body.heading,
          introduction:         req.body.introduction,
        //   ourFacts:             req.body.ourFacts,
        //   yearsExperience:      req.body.yearsExperience,
        //   yearlyProduction:     req.body.yearlyProduction,
        //   clients:              req.body.clients,
        //   ourValues:            req.body.ourValues,
        //   ourMission:           req.body.ourMission,
          // about_image :         aboutImg,

          // image:                aboutImg,
          // name_1:               req.body.name_1,
          // role_1:               req.body.role_1,
          // description_1:        req.body.description_1,

        });
        req.flash('success')
        return res.redirect('/backend/addAboutData');
      } catch (error) {
          console.log("Error in AboutController aboutAddPost",error);
      }
    },

    aboutUpdate: async function(req, res){
        try {
            let about = await Sys.App.Services.UserServices.getByDataAbout({ _id: req.params.id});
            let showData = await Sys.App.Services.UserServices.getByDataAbout({});
            console.log("data", showData);
            var data = {
                    App        : req.session.details,
                    error      : req.flash("error"),
                    success    : req.flash("success"),
                    about       :  about,
                    aboutUs : 'active',
                    // showData   : showData
                };
              // console.log("show data", showData);
            return res.render('backend/about/addAbout',data);
        } catch (error) {
            console.log("Error in CmsController investorsAdd",error);
        }
    },
  
    aboutUpdatePost: async function(req, res){
        try {
        // console.log(req.files,"kkkkkkkkkkkkimage");
        // let image = req.files.aboutImage;
        // console.log("Image", image);
        // var re = /(?:\.([^.]+))?$/;
        // console.log(image,"kjhgfdx");
        // var ext3 = re.exec(image.name)[1];
        // let aboutImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
        // let aboutImg = '/aboutImage/'+aboutImage;
        // // Use the mv() method to place the file somewhere on your server
        // await image.mv('./public/aboutImage/' + aboutImage, async function(err) {
        //     if (err) {
        //         req.flash('error', 'Error Uploading Image');
        //         return res.redirect('about/addAbout');
        //       }
        // });
          let about = await Sys.App.Services.UserServices.getByDataAbout({ _id: req.params.id });
          if(about){
                    let updateData = {
                        // heading:              req.body.heading,
                        introduction:         req.body.introduction,
                        // ourFacts:             req.body.ourFacts,
                        // yearsExperience:      req.body.yearsExperience,
                        // yearlyProduction:     req.body.yearlyProduction,
                        // clients:              req.body.clients,
                        // ourValues:            req.body.ourValues,
                        // ourMission:           req.body.ourMission,
                        // about_image :         aboutImg,
                        // name_1:               req.body.name_1,
                        // role_1:               req.body.role_1,
                        // description_1:        req.body.description_1,
                        // image:              req.body.image1,
                    } 
                    // if(req.files){
							      //   var re = /(?:\.([^.]+))?$/;
                    //   if(req.files.image){
								    //     let image1 = req.files.image;
								    //     var ext1 = re.exec(image1.name)[1];
								    //     let name = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext1;
								    //     updateData.image = '/aboutImage/'+name;
                    //     if (fs.existsSync('./public/'+about.image) && about.image !='' && req.files && req.files.image) {
									  //         fs.unlink('./public/'+about.image, function (err) {
										//           if (err) {
										// 	          console.log('admin >> aboutImage--1---->>>File not deleted!',err);
										//           }
									  //         });
								    //     }
                    //     await image1.mv('./public/aboutImage/' + name, async function(err) {
									  //       if (err) {
										//           req.flash('error', 'Error Uploading',err);
                    //           return res.redirect('/backend/addAboutData');

									  //       }
								    //     });

                  //   }
                  // }
            await Sys.App.Services.UserServices.updateAboutData({ _id: req.params.id }, updateData)
            req.flash('success','About update successfully');
            res.redirect('/backend/addAboutData');
            } else {
              req.flash('error', 'about not update successfully');
              res.redirect('/backend/addAboutData');
              return; 
            }
          // await Sys.App.Services.UserServices.updateAboutData({ _id: req.params.id },req.body);
          // res.redirect('/backend/addAboutData')
        } catch (error) {
            console.log("Error in AboutController aboutUpdatePost",error);
        }
    },

    getAboutDelete: async function(req,res){
        try {
          let about = await Sys.App.Services.UserServices.getByDataAbout({ _id: req.body.id });
          if ( about != null ) {
            await Sys.App.Services.UserServices.deleteAbout(req.body.id)
            return res.send("success");
          }else {
            return res.send("error");
          }
        } catch (e) {
            console.log("Error in getAboutDelete",e);
        }
    },

    //term & condition

    term: async function(req, res) {
        try {
            console.log("==");
            
            let aboutCount = await Sys.App.Services.TermServices.getAboutCount({}); //gets the no of docs
            console.log("count", aboutCount);

            let updateButtonShow = 'false';
            if (aboutCount > 0) {
              updateButtonShow = 'true';
            }
            var data = {
                App : req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                term : 'active',
                updateButtonShow: updateButtonShow,
                // showData   : showData
            };
            // if(aboutCount > 0){
            //   return res.render('about/addAbout',showData);
            // } else {
            //   return res.render('about/addAbout', data);
            // }
          
        } catch (error) {
            console.log("Error in about ", error);
        }
    },

    getTerm: async function(req,res){
          try {
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search.value;
    
            let query = {};
            if (search != '') {
              query = { heading: { $regex: '.*' + search + '.*' } };
            } else {
              query = { };
            }
    
            let aboutCount = await Sys.App.Services.TermServices.getAboutCount(query);
    
    
            let data = await Sys.App.Services.TermServices.getAboutDatatable(query, length, start);
            // console.log("data", data);
            var obj = {
              'draw': req.query.draw,
              'recordsTotal': aboutCount,
              'recordsFiltered': aboutCount,
              'data': data
            };
              res.send(obj);
          } catch (e) {
              console.log("Error",e);
          }
    },

    termAdd: async function(req, res){
        try {
          let about = await Sys.App.Services.TermServices.getByDataAbout({ });
          console.log('about', about);
              var data = {
                App         : req.session.details,
                error       : req.flash("error"),
                success     : req.flash("success"),
                term : 'active',
                about       :  about,
            };
            return res.render('backend/term/addTerm',data);
        }catch (error) {
          console.log("Error in CmsController investorsAdd",error);
        }
    },

    termAddPost: async function(req, res){

      try {
        // console.log(req.files,"image");
        // //start of new code
        // let image = req.files.aboutImage;
        // console.log("Image", image);
        // var re = /(?:\.([^.]+))?$/;
        // var ext3 = re.exec(image.name)[1];
        // let aboutImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
        // let aboutImg = '/aboutImage/'+aboutImage;
        // // Use the mv() method to place the file somewhere on your server
        // await image.mv('./public/aboutImage/' + aboutImage, async function(err) {
        //     if (err) {
        //         req.flash('error', 'Error Uploading Image');
        //         return res.redirect('about/addAbout');
        //       }
        // });
        //end of newcode
        console.log("req.body",req.body);
        let about = await Sys.App.Services.TermServices.insertAboutData({
        //   heading:              req.body.heading,
          introduction:         req.body.introduction,
        //   ourFacts:             req.body.ourFacts,
        //   yearsExperience:      req.body.yearsExperience,
        //   yearlyProduction:     req.body.yearlyProduction,
        //   clients:              req.body.clients,
        //   ourValues:            req.body.ourValues,
        //   ourMission:           req.body.ourMission,
          // about_image :         aboutImg,

          // image:                aboutImg,
          // name_1:               req.body.name_1,
          // role_1:               req.body.role_1,
          // description_1:        req.body.description_1,

        });
        req.flash('success')
        return res.redirect('/backend/addTermData');
      } catch (error) {
          console.log("Error in AboutController aboutAddPost",error);
      }
    },

    termUpdate: async function(req, res){
        try {
            let about = await Sys.App.Services.TermServices.getByDataAbout({ _id: req.params.id});
            let showData = await Sys.App.Services.TermServices.getByDataAbout({});
            console.log("data", showData);
            var data = {
                    App        : req.session.details,
                    error      : req.flash("error"),
                    success    : req.flash("success"),
                    about       :  about,
                    term : 'active',
                    // showData   : showData
                };
              // console.log("show data", showData);
            return res.render('backend/term/addTerm',data);
        } catch (error) {
            console.log("Error in CmsController investorsAdd",error);
        }
    },
  
    termUpdatePost: async function(req, res){
        try {
        // console.log(req.files,"kkkkkkkkkkkkimage");
        // let image = req.files.aboutImage;
        // console.log("Image", image);
        // var re = /(?:\.([^.]+))?$/;
        // console.log(image,"kjhgfdx");
        // var ext3 = re.exec(image.name)[1];
        // let aboutImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
        // let aboutImg = '/aboutImage/'+aboutImage;
        // // Use the mv() method to place the file somewhere on your server
        // await image.mv('./public/aboutImage/' + aboutImage, async function(err) {
        //     if (err) {
        //         req.flash('error', 'Error Uploading Image');
        //         return res.redirect('about/addAbout');
        //       }
        // });
          let about = await Sys.App.Services.TermServices.getByDataAbout({ _id: req.params.id });
          if(about){
                    let updateData = {
                        // heading:              req.body.heading,
                        introduction:         req.body.introduction,
                        // ourFacts:             req.body.ourFacts,
                        // yearsExperience:      req.body.yearsExperience,
                        // yearlyProduction:     req.body.yearlyProduction,
                        // clients:              req.body.clients,
                        // ourValues:            req.body.ourValues,
                        // ourMission:           req.body.ourMission,
                        // about_image :         aboutImg,
                        // name_1:               req.body.name_1,
                        // role_1:               req.body.role_1,
                        // description_1:        req.body.description_1,
                        // image:              req.body.image1,
                    } 
                    // if(req.files){
							      //   var re = /(?:\.([^.]+))?$/;
                    //   if(req.files.image){
								    //     let image1 = req.files.image;
								    //     var ext1 = re.exec(image1.name)[1];
								    //     let name = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext1;
								    //     updateData.image = '/aboutImage/'+name;
                    //     if (fs.existsSync('./public/'+about.image) && about.image !='' && req.files && req.files.image) {
									  //         fs.unlink('./public/'+about.image, function (err) {
										//           if (err) {
										// 	          console.log('admin >> aboutImage--1---->>>File not deleted!',err);
										//           }
									  //         });
								    //     }
                    //     await image1.mv('./public/aboutImage/' + name, async function(err) {
									  //       if (err) {
										//           req.flash('error', 'Error Uploading',err);
                    //           return res.redirect('/backend/addAboutData');

									  //       }
								    //     });

                  //   }
                  // }
            await Sys.App.Services.TermServices.updateAboutData({ _id: req.params.id }, updateData)
            req.flash('success','About update successfully');
            res.redirect('/backend/addTermData');
            } else {
              req.flash('error', 'about not update successfully');
              res.redirect('/backend/addTermData');
              return; 
            }
          // await Sys.App.Services.UserServices.updateAboutData({ _id: req.params.id },req.body);
          // res.redirect('/backend/addAboutData')
        } catch (error) {
            console.log("Error in AboutController aboutUpdatePost",error);
        }
    },

    getTermDelete: async function(req,res){
        try {
          let about = await Sys.App.Services.TermServices.getByDataAbout({ _id: req.body.id });
          if ( about != null ) {
            await Sys.App.Services.TermServices.deleteAbout(req.body.id)
            return res.send("success");
          }else {
            return res.send("error");
          }
        } catch (e) {
            console.log("Error in getAboutDelete",e);
        }
    },

    // privacy policy

    privacy: async function(req, res) {
        try {
            console.log("==");
            
            let aboutCount = await Sys.App.Services.PrivacyServices.getAboutCount({}); //gets the no of docs
            console.log("count", aboutCount);

            let updateButtonShow = 'false';
            if (aboutCount > 0) {
              updateButtonShow = 'true';
            }
            var data = {
                App : req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                privacy : 'active',
                updateButtonShow: updateButtonShow,
                // showData   : showData
            };
            // if(aboutCount > 0){
            //   return res.render('about/addAbout',showData);
            // } else {
            //   return res.render('about/addAbout', data);
            // }
          
        } catch (error) {
            console.log("Error in about ", error);
        }
    },

    getPrivacy: async function(req,res){
          try {
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search.value;
    
            let query = {};
            if (search != '') {
              query = { heading: { $regex: '.*' + search + '.*' } };
            } else {
              query = { };
            }
    
            let aboutCount = await Sys.App.Services.PrivacyServices.getAboutCount(query);
    
    
            let data = await Sys.App.Services.PrivacyServices.getAboutDatatable(query, length, start);
            // console.log("data", data);
            var obj = {
              'draw': req.query.draw,
              'recordsTotal': aboutCount,
              'recordsFiltered': aboutCount,
              'data': data
            };
              res.send(obj);
          } catch (e) {
              console.log("Error",e);
          }
    },

    privacyAdd: async function(req, res){
        try {
          let about = await Sys.App.Services.PrivacyServices.getByDataAbout({ });
          console.log('about', about);
              var data = {
                App         : req.session.details,
                error       : req.flash("error"),
                success     : req.flash("success"),
                privacy : 'active',
                about       :  about,
            };
            return res.render('backend/privacy/addPrivacy',data);
        }catch (error) {
          console.log("Error in CmsController investorsAdd",error);
        }
    },

    privacyAddPost: async function(req, res){

      try {
        // console.log(req.files,"image");
        // //start of new code
        // let image = req.files.aboutImage;
        // console.log("Image", image);
        // var re = /(?:\.([^.]+))?$/;
        // var ext3 = re.exec(image.name)[1];
        // let aboutImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
        // let aboutImg = '/aboutImage/'+aboutImage;
        // // Use the mv() method to place the file somewhere on your server
        // await image.mv('./public/aboutImage/' + aboutImage, async function(err) {
        //     if (err) {
        //         req.flash('error', 'Error Uploading Image');
        //         return res.redirect('about/addAbout');
        //       }
        // });
        //end of newcode
        console.log("req.body-------------",req.body);
        let about = await Sys.App.Services.PrivacyServices.insertAboutData({
        //   heading:              req.body.heading,
        introduction:         req.body.introduction,
        //   ourFacts:             req.body.ourFacts,
        //   yearsExperience:      req.body.yearsExperience,
        //   yearlyProduction:     req.body.yearlyProduction,
        //   clients:              req.body.clients,
        //   ourValues:            req.body.ourValues,
        //   ourMission:           req.body.ourMission,
          // about_image :         aboutImg,

          // image:                aboutImg,
          // name_1:               req.body.name_1,
          // role_1:               req.body.role_1,
          // description_1:        req.body.description_1,

        });
        req.flash('success')
        return res.redirect('/backend/addPrivacyData');
      } catch (error) {
          console.log("Error in AboutController aboutAddPost",error);
      }
    },

    privacyUpdate: async function(req, res){
        try {
            let about = await Sys.App.Services.PrivacyServices.getByDataAbout({ _id: req.params.id});
            let showData = await Sys.App.Services.PrivacyServices.getByDataAbout({});
            console.log("data", showData);
            var data = {
                    App        : req.session.details,
                    error      : req.flash("error"),
                    success    : req.flash("success"),
                    about       :  about,
                    privacy : 'active',
                    // showData   : showData
                };
              // console.log("show data", showData);
            return res.render('backend/privacy/addPrivacy',data);
        } catch (error) {
            console.log("Error in CmsController investorsAdd",error);
        }
    },
  
    privacyUpdatePost: async function(req, res){
        try {
        // console.log(req.files,"kkkkkkkkkkkkimage");
        // let image = req.files.aboutImage;
        // console.log("Image", image);
        // var re = /(?:\.([^.]+))?$/;
        // console.log(image,"kjhgfdx");
        // var ext3 = re.exec(image.name)[1];
        // let aboutImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
        // let aboutImg = '/aboutImage/'+aboutImage;
        // // Use the mv() method to place the file somewhere on your server
        // await image.mv('./public/aboutImage/' + aboutImage, async function(err) {
        //     if (err) {
        //         req.flash('error', 'Error Uploading Image');
        //         return res.redirect('about/addAbout');
        //       }
        // });
          let about = await Sys.App.Services.PrivacyServices.getByDataAbout({ _id: req.params.id });
          if(about){
                    let updateData = {
                        // heading:              req.body.heading,
                        introduction:         req.body.introduction,
                        // ourFacts:             req.body.ourFacts,
                        // yearsExperience:      req.body.yearsExperience,
                        // yearlyProduction:     req.body.yearlyProduction,
                        // clients:              req.body.clients,
                        // ourValues:            req.body.ourValues,
                        // ourMission:           req.body.ourMission,
                        // about_image :         aboutImg,
                        // name_1:               req.body.name_1,
                        // role_1:               req.body.role_1,
                        // description_1:        req.body.description_1,
                        // image:              req.body.image1,
                    } 
                    // if(req.files){
							      //   var re = /(?:\.([^.]+))?$/;
                    //   if(req.files.image){
								    //     let image1 = req.files.image;
								    //     var ext1 = re.exec(image1.name)[1];
								    //     let name = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext1;
								    //     updateData.image = '/aboutImage/'+name;
                    //     if (fs.existsSync('./public/'+about.image) && about.image !='' && req.files && req.files.image) {
									  //         fs.unlink('./public/'+about.image, function (err) {
										//           if (err) {
										// 	          console.log('admin >> aboutImage--1---->>>File not deleted!',err);
										//           }
									  //         });
								    //     }
                    //     await image1.mv('./public/aboutImage/' + name, async function(err) {
									  //       if (err) {
										//           req.flash('error', 'Error Uploading',err);
                    //           return res.redirect('/backend/addAboutData');

									  //       }
								    //     });

                  //   }
                  // }
            await Sys.App.Services.PrivacyServices.updateAboutData({ _id: req.params.id }, updateData)
            req.flash('success','About update successfully');
            res.redirect('/backend/addPrivacyData');
            } else {
              req.flash('error', 'about not update successfully');
              res.redirect('/backend/addPrivacyData');
              return; 
            }
          // await Sys.App.Services.PrivacyServices.updateAboutData({ _id: req.params.id },req.body);
          // res.redirect('/backend/addAboutData')
        } catch (error) {
            console.log("Error in AboutController aboutUpdatePost",error);
        }
    },

    getPrivacyDelete: async function(req,res){
        try {
          let about = await Sys.App.Services.PrivacyServices.getByDataAbout({ _id: req.body.id });
          if ( about != null ) {
            await Sys.App.Services.PrivacyServices.deleteAbout(req.body.id)
            return res.send("success");
          }else {
            return res.send("error");
          }
        } catch (e) {
            console.log("Error in getAboutDelete",e);
        }
    },




}
