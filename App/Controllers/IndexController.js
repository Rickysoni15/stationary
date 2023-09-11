var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");

var mongoose = require('mongoose');

module.exports = {


    list: async function(req,res){
		try {

			var data = {
				App 					: req.session.details,
				error 				    : req.flash("error"),
				success				    : req.flash("success"),
                applicationActive 	        : 'active',
                
			};
            // console.log("Datat", data);
			return res.render('backend/home/listHome',data);
		} catch (e) {
			console.log("Error in ApplicationController in list",e);
		}
	},
    //For Frontend
    getSingleApplicationData: async function(req,res){

		try {
            let data = await Sys.App.Services.HomeServices.getByData({});
            var sobj = {
            	'data': data
            };
           console.log("obj??????",sobj);
           return res.send(sobj);
        } catch (e) {
        	console.log("Error in ApplicationController in getSingleApplicationData",e);
        }
    },



    //End of Frontend

    getApplication: async function(req,res){

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

            let applicationCount = await Sys.App.Services.HomeServices.getHomeCount(query);
            let data = await Sys.App.Services.HomeServices.getHomeDatatable(query, length, start);
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
        	console.log("Error in ApplicationController in getApplication",e);
        }
    },

    addApplication: async function(req,res){
        try {
            let categoryData = await Sys.App.Services.HomeServices.getByData({ }); 

            var data = {
                App 					: req.session.details,
                error 				    : req.flash("error"),
                success				    : req.flash("success"),
                applicationActive 	        : 'active',
                categoryData            : categoryData
            };
            return res.render('backend/home/addHome',data);
      } catch (e) {
        console.log("Error in ApplicationController in addApplication",e);
      }
    },

    postApplication: async function(req, res){

        try {
          //start of new code
        //   let image = req.files.applicationImage;
        //   console.log("Image", image);
        //   var re = /(?:\.([^.]+))?$/;
        //   var ext3 = re.exec(image.name)[1];
        //   let applicationImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
        //   console.log("ext3",ext3);
        //   let applicationImg = '/homeImage/'+applicationImage;
        //   // Use the mv() method to place the file somewhere on your server
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
        let image = req.files.applicationImage;
        var applicationfile = [];          
        if (Array.isArray(req.files.applicationImage) != false) {
          for (let i = 0; i < image.length; i++) {
            var re = /(?:\.([^.]+))?$/;
            var extimg = re.exec(image[i].name)[1];
            let appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + extimg;
            // Use the mv() method to place the file somewhere on your server
            await image[i].mv('./public/home_image/' + appImage, async function(err) {
                if (err) {
                    req.flash('Error in ApplicationController in postApplication', err);
                    return res.redirect('/backend/addHome');

                  }
            });
            applicationfile.push({ path: '/home_image/' + appImage, fileName: req.files.applicationImage[i].name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
             }
          }
          else{
              let singleimage_c = req.files.applicationImage;
                console.log("Image", singleimage_c);
                var re = /(?:\.([^.]+))?$/;
                var ext6 = re.exec(singleimage_c.name)[1];
                let singleimage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext6;
                let singleImg = '/home_image/'+singleimage;
                // Use the mv() method to place the file somewhere on your server
                await singleimage_c.mv('./public/home_image/' + singleimage, async function(err) {
                    if (err) {
                        req.flash('Error in ApplicationController in postApplication', err);
                        return res.redirect('/backend/addHome');

                      }
                });
                applicationfile.push({ path: '/home_image/' + singleimage, fileName: req.files.applicationImage.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
              }   
          //end of newcode

          let home_image1="";
          let home_image2="";
          let home_image3="";
          let home_image4="";
          let home_image5="";
          let home_image6="";
          if(req.files){
            if(req.files.home_image1){
                    let image = req.files.home_image1;
                    console.log("Image", image);
                    var re = /(?:\.([^.]+))?$/;
                    var ext3 = re.exec(image.name)[1];
                    let home_image1 = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                    home_image1 = '/home_image1/'+home_image1;
                    // Use the mv() method to place the file somewhere on your server
                    await image.mv('./public/home_image/' + home_image1, async function(err) {
                        if (err) {
                            req.flash('error', 'Error Uploading Image');
                            return res.redirect('about/addAbout');
                            }
                    });
            }
            if(req.files.home_image2){
                let image = req.files.home_image2;
                console.log("Image", image);
                var re = /(?:\.([^.]+))?$/;
                var ext3 = re.exec(image.name)[1];
                let home_image2 = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                home_image2 = '/home_image2/'+home_image2;
                // Use the mv() method to place the file somewhere on your server
                await image.mv('./public/home_image/' + home_image2, async function(err) {
                    if (err) {
                        req.flash('error', 'Error Uploading Image');
                        return res.redirect('about/addAbout');
                        }
                });
            }
            if(req.files.home_image3){
                let image = req.files.home_image3;
                console.log("Image", image);
                var re = /(?:\.([^.]+))?$/;
                var ext3 = re.exec(image.name)[1];
                let home_image3 = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                home_image3 = '/home_image/'+home_image3;
                // Use the mv() method to place the file somewhere on your server
                await image.mv('./public/home_image/' + home_image3, async function(err) {
                    if (err) {
                        req.flash('error', 'Error Uploading Image');
                        return res.redirect('about/addAbout');
                        }
                });
            }
            if(req.files.home_image4){
                let image = req.files.home_image4;
                console.log("Image", image);
                var re = /(?:\.([^.]+))?$/;
                var ext3 = re.exec(image.name)[1];
                let home_image4 = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                home_image4 = '/home_image/'+home_image4;
                // Use the mv() method to place the file somewhere on your server
                await image.mv('./public/home_image/' + home_image4, async function(err) {
                    if (err) {
                        req.flash('error', 'Error Uploading Image');
                        return res.redirect('about/addAbout');
                        }
                });
            }
            if(req.files.home_image5){
                let image = req.files.home_image5;
                console.log("Image", image);
                var re = /(?:\.([^.]+))?$/;
                var ext3 = re.exec(image.name)[1];
                let home_image5 = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                home_image5 = '/home_image/'+home_image5;
                // Use the mv() method to place the file somewhere on your server
                await image.mv('./public/home_image/' + home_image5, async function(err) {
                    if (err) {
                        req.flash('error', 'Error Uploading Image');
                        return res.redirect('about/addAbout');
                        }
                });
            }
            if(req.files.home_image6){
                let image = req.files.home_image6;
                console.log("Image", image);
                var re = /(?:\.([^.]+))?$/;
                var ext3 = re.exec(image.name)[1];
                let home_image6 = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                home_image6 = '/home_image/'+home_image6;
                // Use the mv() method to place the file somewhere on your server
                await image.mv('./public/home_image/' + home_image6, async function(err) {
                    if (err) {
                        req.flash('error', 'Error Uploading Image');
                        return res.redirect('about/addAbout');
                        }
                });
            }
        }

          // let category = await Sys.App.Services.CategoryServices.getCategoryData({_id: req.body.categoryName});
          console.log("categoy",req.body);
          let application = await Sys.App.Services.HomeServices.insertHomeData({
            // title:              req.body.title,
            // headtext:              req.body.name,
            coverfiles:  applicationfile,
            home_image1: home_image1,
            home_image2: home_image2,
            home_image3: home_image3,
            home_image4: home_image4,
            home_image5: home_image5,
            home_image6: home_image6,
            // description:       req.body.description,
            // type : type
            // category_id:       category._id
          });
          req.flash('success')
          return res.redirect('/backend/home');
        } catch (error) {
            console.log("Error in ApplicationController in postApplication",error);
        }
    },

    applicationDelete: async function(req,res){
        try {
            let application = await Sys.App.Services.HomeServices.getHomeData({_id: req.body.id});
            if (application || application.length >0) {
                await Sys.App.Services.HomeServices.updateHomeData(
                                { _id: req.body.id},
                                {
                                    is_deleted : "1"
                                }
                            )
                return res.send("success");
            }else {
                return res.send("error in HomeController in applicationDelete");
            }
        } catch (e) {
            console.log("Erro in HomeController in applicationDelete",e);
        }
    },

    editApplication: async function(req,res){
        try {
            // let categoryData = await Sys.App.Services.CategoryServices.getByData({  }); 
            let application = await Sys.App.Services.HomeServices.getHomeData({
                _id: req.params.id
            });
            return res.render('backend/home/addHome',{application: application , applicationActive : 'active' });
        } catch (e) {
            console.log("Error in HomeController in editApplication",e);
        }
 
    },

    editApplicationPostData: async function(req,res){
        try {
            
          // let category = await Sys.App.Services.CategoryServices.getCategoryData({_id: req.body.categoryName})
          let application = await Sys.App.Services.HomeServices.getHomeData({_id: req.params.id});
          if (application) {
            let home_image1=application.home_image1;
            let home_image2=application.home_image2;
            let home_image3=application.home_image3;
            let home_image4=application.home_image4;
            let home_image5=application.home_image5;
            let home_image6=application.home_image6;
						let updateData; 
                        let imageName='';
						if (req.files) {
                    
                                let image1 = req.files.applicationImage;
                                var appImg=[];
                                        if (Array.isArray(req.files.applicationImage) != false) {
                                            for (let i = 0; i < image1.length; i++) {
                                              var re = /(?:\.([^.]+))?$/;
                                              var ext1 = re.exec(image1[i].name)[1];
                                              let name = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext1;
                                              // Use the mv() method to place the file somewhere on your server
                                              await image1[i].mv('./public/home_image/' + name, async function(err) {
                                                  if (err) {
                                                      req.flash('Error in ApplicationController in postProduct', err);
                                                      return res.redirect('/backend/addHome');
                                                    }
                                              });
                                              updated_img.push({ path: '/home_image/' + name, fileName: req.files.applicationImage[i].name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
                                               }
                                            }
                                            else{
                                                let singleimage_p = req.files.applicationImage;
                                                  console.log("Image", singleimage_p);
                                                  var re = /(?:\.([^.]+))?$/;
                                                  var ext6 = re.exec(singleimage_p.name)[1];
                                                  let singleImage_P = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext6;
                                                  let singleImg = '/home_image/'+singleImage_P;
                                                  // Use the mv() method to place the file somewhere on your server
                                                  await singleimage_p.mv('./public/home_image/' + singleImage_P, async function(err) {
                                                      if (err) {
                                                          req.flash('Error in ApplicationController in postOurTeam', err);
                                                          return res.redirect('/backend/addHome');

                                                        }
                                                  });
                                                  updated_img.push({ path: '/home_image/' + singleImage_P, fileName: req.files.applicationImage.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
                                            }
                                            if(req.files.home_image1){
                                                let image = req.files.home_image1;
                                                console.log("Image", image);
                                                var re = /(?:\.([^.]+))?$/;
                                                var ext3 = re.exec(image.name)[1];
                                                let home_image1 = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                                                home_image1 = '/home_image/'+home_image1;
                                                // Use the mv() method to place the file somewhere on your server
                                                await image.mv('./public/home_image/' + home_image1, async function(err) {
                                                    if (err) {
                                                        req.flash('error', 'Error Uploading Image');
                                                        return res.redirect('about/addAbout');
                                                        }
                                                });
                                        }
                                        if(req.files.home_image2){
                                            let image = req.files.home_image2;
                                            console.log("Image", image);
                                            var re = /(?:\.([^.]+))?$/;
                                            var ext3 = re.exec(image.name)[1];
                                            let home_image2 = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                                            home_image2 = '/home_image/'+home_image2;
                                            // Use the mv() method to place the file somewhere on your server
                                            await image.mv('./public/home_image/' + home_image2, async function(err) {
                                                if (err) {
                                                    req.flash('error', 'Error Uploading Image');
                                                    return res.redirect('about/addAbout');
                                                    }
                                            });
                                        }
                                        if(req.files.home_image3){
                                            let image = req.files.home_image3;
                                            console.log("Image", image);
                                            var re = /(?:\.([^.]+))?$/;
                                            var ext3 = re.exec(image.name)[1];
                                            let home_image3 = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                                            home_image3 = '/home_image/'+home_image3;
                                            // Use the mv() method to place the file somewhere on your server
                                            await image.mv('./public/home_image/' + home_image3, async function(err) {
                                                if (err) {
                                                    req.flash('error', 'Error Uploading Image');
                                                    return res.redirect('about/addAbout');
                                                    }
                                            });
                                        }
                                        if(req.files.home_image4){
                                            let image = req.files.home_image4;
                                            console.log("Image", image);
                                            var re = /(?:\.([^.]+))?$/;
                                            var ext3 = re.exec(image.name)[1];
                                            let home_image4 = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                                            home_image4 = '/home_image/'+home_image4;
                                            // Use the mv() method to place the file somewhere on your server
                                            await image.mv('./public/home_image/' + home_image4, async function(err) {
                                                if (err) {
                                                    req.flash('error', 'Error Uploading Image');
                                                    return res.redirect('about/addAbout');
                                                    }
                                            });
                                        }
                                        if(req.files.home_image5){
                                            let image = req.files.home_image5;
                                            console.log("Image", image);
                                            var re = /(?:\.([^.]+))?$/;
                                            var ext3 = re.exec(image.name)[1];
                                            let home_image5 = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                                            home_image5 = '/home_image/'+home_image5;
                                            // Use the mv() method to place the file somewhere on your server
                                            await image.mv('./public/home_image/' + home_image5, async function(err) {
                                                if (err) {
                                                    req.flash('error', 'Error Uploading Image');
                                                    return res.redirect('about/addAbout');
                                                    }
                                            });
                                        }
                                        if(req.files.home_image6){
                                            let image = req.files.home_image6;
                                            console.log("Image", image);
                                            var re = /(?:\.([^.]+))?$/;
                                            var ext3 = re.exec(image.name)[1];
                                            let home_image6 = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                                            home_image6 = '/home_image/'+home_image6;
                                            // Use the mv() method to place the file somewhere on your server
                                            await image.mv('./public/home_image/' + home_image6, async function(err) {
                                                if (err) {
                                                    req.flash('error', 'Error Uploading Image');
                                                    return res.redirect('about/addAbout');
                                                    }
                                            });
                                        }                
                  
                            updateData = {
                               
                                coverfiles: imageName,
                                home_image1: home_image1,
                                home_image2: home_image2,
                                home_image3: home_image3,
                                home_image4: home_image4,
                                home_image5: home_image5,
                                home_image6: home_image6,
                            }
						}

              await Sys.App.Services.HomeServices.updateHomeData({ _id: req.params.id },updateData)
              req.flash('success','Home updated successfully');
              return res.redirect('/backend/home');

          }else {
            req.flash('error', 'Home not update successfully');
            return res.redirect('/backend/home');
          }
        } catch (e) {
            console.log("Error",e);
        }
    },

    applicationImageDelete: async function(req, res){
        try {
            console.log("{{{{ ID}}}}", req.params);
            let application = await Sys.App.Services.ApplicationServices.getApplicationData({ _id: req.params.id });
            var new_deletedid = mongoose.Types.ObjectId(req.params.deleteid);
            
            console.log("================",req.params.id);
            console.log("deleteid",req.params.deleteid);
            console.log("[[[[[[[[[[[r_d_ImageDelete]]]]]]", application);
    
                if (application) {
                    for (let index = 0; index < application.image.length; index++) {
                        var element = application.image[index];
                        console.log("PDF DATA", element);
                        
    
                        if(element._id == req.params.deleteid){
                            console.log("CLICKED ID FOUND");
                           let result = await Sys.App.Services.ApplicationServices.updateApplicationData(
                                {_id: req.params.id,"image._id":new_deletedid},
                                {
                                    $set:{"image.$.is_deleted":"1"}},
                                // {
                                //     $pull:{'product_image':{_id: req.params.deleteid}},
                                //     is_deleted : "1"
                                // }
                            )
                            console.log("result",result);
                            return res.send("success");        
                        }
                    }
    
                }else {
                    return res.send("error in ApplicationController in applicationImageDelete");
                }
    
        } catch (error) {
            console.log("Error in ApplicationController in applicationImageDelete",error);
        }
    },

    list: async function (req, res) {

        try {

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                applicationActive 	        : 'active',

            };
            return res.render('backend/home/listHome',data);


        } catch (e) {
            console.log("Error in ProjectController in list", e);
        }
    },

    getProject: async function (req, res) {

        try {
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search.value;

            let query = {};
            if (search != '') {
                let capital = search;
                query = { project_name: { $regex: '.*' + search + '.*' }, is_deleted: "0" };
            } else {
                query = { is_deleted: "0" };
            }

            let projectCount = await Sys.App.Services.HomeServices.getProjectCount(query);
            let data = await Sys.App.Services.HomeServices.getProjectDatatable(query, length, start);
            // let projectCategoryname = await Sys.App.Services.ProjectCategoryServices.getProjectCategoryDatatable();
            var obj = {
                'draw': req.query.draw,
                'recordsTotal': projectCount,
                'recordsFiltered': projectCount,
                'data': data,
                // 'projectCategoryname': projectCategoryname
            };
            // console.log('data', data);
            // console.log("categrrrrrrrydata", categoryname);
            res.send(obj);
        } catch (e) {
            console.log("Error in ProjectController in getProject", e);
        }
    },

    addProject: async function (req, res) {
        try {

            let project = await Sys.App.Services.HomeServices.getByData({});
            if(project){
                project = project[0];
            }
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                home: 'active',
                project             : project

                // projectCategoryData: projectCategoryData
            };
            return res.render('backend/home/addHome',data);

        } catch (e) {
            console.log("Error in ProjectController in addProject", e);
        }
    },

    postProject: async function (req, res) {

        try {

            let appImage;

            //start of new code
            // if(req.files != null){

            if (req.files.projectImage) {
            let image = req.files.projectImage;
            var project_Img = [];
            if (Array.isArray(req.files.projectImage) != false) {
              for (let i = 0; i < image.length; i++) {
                var re = /(?:\.([^.]+))?$/;
                var ext3 = re.exec(image[i].name)[1];
                let project_image = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext3;
                let R_and_DImage = '/homeImage/' + project_image;
                // Use the mv() method to place the file somewhere on your server
                await image[i].mv('./public/homeImage/' + project_image, async function (err) {
                  if (err) {
                    req.flash('Error in ProjectController in postProject', err);
                    return res.redirect('/backend/addHome');
                  }
                });
                project_Img.push({ path: '/homeImage/' + project_image, fileName: req.files.projectImage[i].name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
                //end of newcode
              }
              if (req.files.apllication_img){ 
                let app_image = req.files.apllication_img;
                console.log("Image", app_image);
                var re = /(?:\.([^.]+))?$/;
                var ext3 = re.exec(app_image.name)[1];
                appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                var applicationImg = '/homeImage/'+appImage;
                // Use the mv() method to place the file somewhere on your server
                await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                    if (err) {
                        req.flash('Error in ProjectController in postProject', err);
                        return res.redirect('/backend/addHome');

                      }
                });
            }
            if (req.files.apllication_img2){ 
                let app_image = req.files.apllication_img2;
                console.log("Image", app_image);
                var re = /(?:\.([^.]+))?$/;
                var ext3 = re.exec(app_image.name)[1];
                appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                var applicationImg2 = '/homeImage/'+appImage;
                // Use the mv() method to place the file somewhere on your server
                await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                    if (err) {
                        req.flash('Error in ProjectController in postProject', err);
                        return res.redirect('/backend/addHome');

                      }
                });
            }
            if (req.files.apllication_img3){ 
                let app_image = req.files.apllication_img3;
                console.log("Image", app_image);
                var re = /(?:\.([^.]+))?$/;
                var ext3 = re.exec(app_image.name)[1];
                appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                var applicationImg3 = '/homeImage/'+appImage;
                // Use the mv() method to place the file somewhere on your server
                await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                    if (err) {
                        req.flash('Error in ProjectController in postProject', err);
                        return res.redirect('/backend/addHome');

                      }
                });
            }
            if (req.files.apllication_img4){ 
                let app_image = req.files.apllication_img4;
                console.log("Image", app_image);
                var re = /(?:\.([^.]+))?$/;
                var ext3 = re.exec(app_image.name)[1];
                appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                var applicationImg4 = '/homeImage/'+appImage;
                // Use the mv() method to place the file somewhere on your server
                await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                    if (err) {
                        req.flash('Error in ProjectController in postProject', err);
                        return res.redirect('/backend/addHome');

                      }
                });
            }
            if (req.files.apllication_img5){ 
                let app_image = req.files.apllication_img5;
                console.log("Image", app_image);
                var re = /(?:\.([^.]+))?$/;
                var ext3 = re.exec(app_image.name)[1];
                appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                var applicationImg5 = '/homeImage/'+appImage;
                // Use the mv() method to place the file somewhere on your server
                await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                    if (err) {
                        req.flash('Error in ProjectController in postProject', err);
                        return res.redirect('/backend/addHome');

                      }
                });
            }
            if (req.files.apllication_img6){ 
                let app_image = req.files.apllication_img6;
                console.log("Image", app_image);
                var re = /(?:\.([^.]+))?$/;
                var ext3 = re.exec(app_image.name)[1];
                appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                var applicationImg6 = '/homeImage/'+appImage;
                // Use the mv() method to place the file somewhere on your server
                await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                    if (err) {
                        req.flash('Error in ProjectController in postProject', err);
                        return res.redirect('/backend/addHome');

                      }
                });
            }
              console.log(project_Img, "arrayy>>>>>");        
            }else{      
            let projectimage = req.files.projectImage;
            console.log("Image", projectimage);
            var re = /(?:\.([^.]+))?$/;
            var ext4 = re.exec(projectimage.name)[1];
            let projectImage = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext4;
            let projectImg = '/homeImage/' + projectImage;
            // Use the mv() method to place the file somewhere on your server
            await projectimage.mv('./public/homeImage/' + projectImage, async function (err) {
                if (err) {
                    req.flash('Error in ProjectController in postProject', err);
                    return res.redirect('/backend/addHome');

                }
            });
            project_Img.push({ path: '/homeImage/' + projectImage, fileName: req.files.projectImage.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
            if (req.files.apllication_img){ 
                let app_image = req.files.apllication_img;
                console.log("Image", app_image);
                var re = /(?:\.([^.]+))?$/;
                var ext3 = re.exec(app_image.name)[1];
                appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                var applicationImg = '/homeImage/'+appImage;
                // Use the mv() method to place the file somewhere on your server
                await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                    if (err) {
                        req.flash('Error in ProjectController in postProject', err);
                        return res.redirect('/backend/addHome');

                      }
                });
            }
            if (req.files.apllication_img2){ 
                let app_image = req.files.apllication_img2;
                console.log("Image", app_image);
                var re = /(?:\.([^.]+))?$/;
                var ext3 = re.exec(app_image.name)[1];
                appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                var applicationImg2 = '/homeImage/'+appImage;
                // Use the mv() method to place the file somewhere on your server
                await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                    if (err) {
                        req.flash('Error in ProjectController in postProject', err);
                        return res.redirect('/backend/addHome');

                      }
                });
            }
            if (req.files.apllication_img3){ 
                let app_image = req.files.apllication_img3;
                console.log("Image", app_image);
                var re = /(?:\.([^.]+))?$/;
                var ext3 = re.exec(app_image.name)[1];
                appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                var applicationImg3 = '/homeImage/'+appImage;
                // Use the mv() method to place the file somewhere on your server
                await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                    if (err) {
                        req.flash('Error in ProjectController in postProject', err);
                        return res.redirect('/backend/addHome');

                      }
                });
            }
            if (req.files.apllication_img4){ 
                let app_image = req.files.apllication_img4;
                console.log("Image", app_image);
                var re = /(?:\.([^.]+))?$/;
                var ext3 = re.exec(app_image.name)[1];
                appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                var applicationImg4 = '/homeImage/'+appImage;
                // Use the mv() method to place the file somewhere on your server
                await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                    if (err) {
                        req.flash('Error in ProjectController in postProject', err);
                        return res.redirect('/backend/addHome');

                      }
                });
            }
            if (req.files.apllication_img5){ 
                let app_image = req.files.apllication_img5;
                console.log("Image", app_image);
                var re = /(?:\.([^.]+))?$/;
                var ext3 = re.exec(app_image.name)[1];
                appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                var applicationImg5 = '/homeImage/'+appImage;
                // Use the mv() method to place the file somewhere on your server
                await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                    if (err) {
                        req.flash('Error in ProjectController in postProject', err);
                        return res.redirect('/backend/addHome');

                      }
                });
            }
            if (req.files.apllication_img6){ 
                let app_image = req.files.apllication_img6;
                console.log("Image", app_image);
                var re = /(?:\.([^.]+))?$/;
                var ext3 = re.exec(app_image.name)[1];
                appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                var applicationImg6 = '/homeImage/'+appImage;
                // Use the mv() method to place the file somewhere on your server
                await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                    if (err) {
                        req.flash('Error in ProjectController in postProject', err);
                        return res.redirect('/backend/addHome');

                      }
                });
            }
        }  
    }      
// }
            //end of newcode         
            // let projectCategory = await Sys.App.Services.ProjectCategoryServices.getProjectCategoryData({ _id: req.body.projectCategoryName });
            //   console.log("Projectcategory",req.body);
            // let projectid = "";
            //     if (projectCategory) {
            //         projectid = projectCategory.id
            // }
            let project = await Sys.App.Services.HomeServices.insertProjectData({
                coverfiles        : project_Img,
                home_image1      : applicationImg,
                home_image2      : applicationImg2,
                home_image3      : applicationImg3,
                home_image4      : applicationImg4,
                home_image5      : applicationImg5,
                home_image6      : applicationImg6,

            });
            req.flash('success',"Project Data Inseted Successfully")
            return res.redirect('/backend/addHome');
        
        } catch (error) {
            console.log("Error in ProjectController in postApplication", error);
        }
    },

    projectDelete: async function (req, res) {
        try {
            let project = await Sys.App.Services.HomeServices.getProjectData({ _id: req.body.id });
            if (project || project.length > 0) {
                await Sys.App.Services.HomeServices.updateProjectData(
                    { _id: req.body.id },
                    {
                        is_deleted: "1"
                    }
                )
                return res.send("success");
            } else {
                return res.send("error in ProjectController in projectDelete");
            }
        } catch (e) {
            console.log("Erro in ProjectController in projectDelete", e);
        }
    },

    editProject: async function (req, res) {
        try {
            console.log("projectprojectCategoryDataE>>>>>>", req.params.id);

            // let projectCategoryData = await Sys.App.Services.ProjectCategoryServices.getByData({});
            let project = await Sys.App.Services.HomeServices.getProjectData({ _id: req.params.id});
            var data = {
                App                 : req.session.details,
                error               : req.flash("error"),
                success             : req.flash("success"),
                projectActive       : 'active',
                project             : project,
                // projectCategoryData : projectCategoryData 
            };
            return res.render('backend/home/addHome',data);

        } catch (e) {
            console.log("Error in ProjectController in editProject", e);
        }

    }, 

    projectImageDelete: async function(req, res){
        try {
            console.log("{{{{ ID}}}}", req.params);
            let project = await Sys.App.Services.HomeServices.getProjectData({ _id: req.params.id });
            var new_deletedid = mongoose.Types.ObjectId(req.params.deleteid);
            console.log("================",req.params.id);
            console.log("deleteid",req.params.deleteid);
    
                if (project) {
                    for (let index = 0; index < project.coverfiles.length; index++) {
                        var element = project.coverfiles[index];
                        console.log("element", element._id);                       
    
                        if(element._id == req.params.deleteid){
                            console.log("CLICKED ID FOUND");
                        
                           let result = await Sys.App.Services.HomeServices.updateProjectData(
                                {_id: req.params.id,"coverfiles._id": new_deletedid },
                                {
                                    $set:{"coverfiles.$.is_deleted":"1"}},                                
                            )
                            console.log("result",result);
                            return res.send("success");        
                        }
                    }
    
                }else {
                    return res.send("error in ProjectController in projectImageDelete");
                }
    
        } catch (error) {
            console.log("Error in ProjectController in projectImageDelete",error);
        }
    },

    projectSingleImageDelete: async function (req, res) {
        try {
            console.log("req.params.id",req.params.id,req.params.mainid);
            let project = await Sys.App.Services.HomeServices.getProjectData({_id:req.params.mainid});
            if(req.params.id == "home_image1"){
                if (project || project.length > 0) {
                    await Sys.App.Services.HomeServices.updateProjectData(
                        { _id: project._id },
                        {
                            home_image1: ""
                        }
                    )
                    return res.send("success");
                } else {
                    return res.send("error in ProjectController in projectDelete");
                }
            }
            if(req.params.id == "home_image2"){
                if (project || project.length > 0) {
                    await Sys.App.Services.HomeServices.updateProjectData(
                        { _id: project._id },
                        {
                            home_image2: ""
                        }
                    )
                    return res.send("success");
                } else {
                    return res.send("error in ProjectController in projectDelete");
                }
            }
            if(req.params.id == "home_image3"){
                if (project || project.length > 0) {
                    await Sys.App.Services.HomeServices.updateProjectData(
                        { _id: project._id },
                        {
                            home_image3: ""
                        }
                    )
                    return res.send("success");
                } else {
                    return res.send("error in ProjectController in projectDelete");
                }
            }
            if(req.params.id == "home_image4"){
                if (project || project.length > 0) {
                    await Sys.App.Services.HomeServices.updateProjectData(
                        { _id: project._id },
                        {
                            home_image4: ""
                        }
                    )
                    return res.send("success");
                } else {
                    return res.send("error in ProjectController in projectDelete");
                }
            }
            if(req.params.id == "home_image5"){
                if (project || project.length > 0) {
                    await Sys.App.Services.HomeServices.updateProjectData(
                        { _id: project._id },
                        {
                            home_image5: ""
                        }
                    )
                    return res.send("success");
                } else {
                    return res.send("error in ProjectController in projectDelete");
                }
            }
            if(req.params.id == "home_image6"){
                if (project || project.length > 0) {
                    await Sys.App.Services.HomeServices.updateProjectData(
                        { _id: project._id },
                        {
                            home_image6: ""
                        }
                    )
                    return res.send("success");
                } else {
                    return res.send("error in ProjectController in projectDelete");
                }
            }
           
        } catch (e) {
            console.log("Erro in ProjectController in projectDelete", e);
        }
    },

    editProjectPostData: async function (req, res) {
        try {
            console.log("update files ========>>>>>>>>", req.files);

            // let projectCategory = await Sys.App.Services.ProjectCategoryServices.getProjectCategoryData({ _id: req.body.projectCategoryName })
            let project = await Sys.App.Services.HomeServices.getProjectData({ _id:req.params.id });
            var updated_img = project.coverfiles;
            let appImage; 
                        
            if (project) {
                if (req.files != null) {
                    if (req.files.apllication_img){ 
                        let app_image = req.files.apllication_img;
                        console.log("Image", app_image);
                        var re = /(?:\.([^.]+))?$/;
                        var ext3 = re.exec(app_image.name)[1];
                        appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                        var applicationImg = '/homeImage/'+appImage;
                        // Use the mv() method to place the file somewhere on your server
                        await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                            if (err) {
                                req.flash('Error in ProjectController in EditpostProject', err);
                                return res.redirect('/backend/addHome');
                              }
                        });
                    }
                    if (req.files.apllication_img2){ 
                        let app_image = req.files.apllication_img2;
                        console.log("Image", app_image);
                        var re = /(?:\.([^.]+))?$/;
                        var ext3 = re.exec(app_image.name)[1];
                        appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                        var applicationImg2 = '/homeImage/'+appImage;
                        // Use the mv() method to place the file somewhere on your server
                        await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                            if (err) {
                                req.flash('Error in ProjectController in EditpostProject', err);
                                return res.redirect('/backend/addHome');
                              }
                        });
                    }
                    if (req.files.apllication_img3){ 
                        let app_image = req.files.apllication_img3;
                        console.log("Image", app_image);
                        var re = /(?:\.([^.]+))?$/;
                        var ext3 = re.exec(app_image.name)[1];
                        appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                        var applicationImg3 = '/homeImage/'+appImage;
                        // Use the mv() method to place the file somewhere on your server
                        await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                            if (err) {
                                req.flash('Error in ProjectController in EditpostProject', err);
                                return res.redirect('/backend/addHome');
                              }
                        });
                    }
                    if (req.files.apllication_img4){ 
                        let app_image = req.files.apllication_img4;
                        console.log("Image", app_image);
                        var re = /(?:\.([^.]+))?$/;
                        var ext3 = re.exec(app_image.name)[1];
                        appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                        var applicationImg4 = '/homeImage/'+appImage;
                        // Use the mv() method to place the file somewhere on your server
                        await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                            if (err) {
                                req.flash('Error in ProjectController in EditpostProject', err);
                                return res.redirect('/backend/addHome');
                              }
                        });
                    }
                    if (req.files.apllication_img5){ 
                        let app_image = req.files.apllication_img5;
                        console.log("Image", app_image);
                        var re = /(?:\.([^.]+))?$/;
                        var ext3 = re.exec(app_image.name)[1];
                        appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                        var applicationImg5 = '/homeImage/'+appImage;
                        // Use the mv() method to place the file somewhere on your server
                        await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                            if (err) {
                                req.flash('Error in ProjectController in EditpostProject', err);
                                return res.redirect('/backend/addHome');
                              }
                        });
                    }
                    if (req.files.apllication_img6){ 
                        let app_image = req.files.apllication_img6;
                        console.log("Image", app_image);
                        var re = /(?:\.([^.]+))?$/;
                        var ext3 = re.exec(app_image.name)[1];
                        appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                        var applicationImg6 = '/homeImage/'+appImage;
                        // Use the mv() method to place the file somewhere on your server
                        await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                            if (err) {
                                req.flash('Error in ProjectController in EditpostProject', err);
                                return res.redirect('/backend/addHome');
                              }
                        });
                    }
                }
                let updateData = {
                    home_image1      : applicationImg,
                    home_image2      : applicationImg2,
                    home_image3      : applicationImg3,
                    home_image4      : applicationImg4,
                    home_image5      : applicationImg5,
                    home_image6      : applicationImg6,
                }
                if (req.files != null) {
                  if (req.files.projectImage) {
                  let image = req.files.projectImage;

                    if (Array.isArray(req.files.projectImage) != false) {
                        for (let i = 0; i < image.length; i++) {
                          var re = /(?:\.([^.]+))?$/;
                          var ext3 = re.exec(image[i].name)[1];
                          let project_image = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext3;
                          let R_and_DImage = '/homeImage/' + project_image;
                          // Use the mv() method to place the file somewhere on your server
                          await image[i].mv('./public/homeImage/' + project_image, async function (err) {
                            if (err) {
                              req.flash('Error in ProjectController in EditpostProject', err);
                              return res.redirect('/backend/addHome');
                            }
                          });
                          updated_img.push({ path: '/homeImage/' + project_image, fileName: req.files.projectImage[i].name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
                          //end of newcode
                          if (req.files.apllication_img){ 
                            let app_image = req.files.apllication_img;
                            console.log("Image", app_image);
                            var re = /(?:\.([^.]+))?$/;
                            var ext3 = re.exec(app_image.name)[1];
                            appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                            var applicationImg = '/homeImage/'+appImage;
                            // Use the mv() method to place the file somewhere on your server
                            await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                                if (err) {
                                    req.flash('Error in ProjectController in EditpostProject', err);
                                    return res.redirect('/backend/addHome');
                                  }
                            });
                        }
                        if (req.files.apllication_img2){ 
                            let app_image = req.files.apllication_img2;
                            console.log("Image", app_image);
                            var re = /(?:\.([^.]+))?$/;
                            var ext3 = re.exec(app_image.name)[1];
                            appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                            var applicationImg2 = '/homeImage/'+appImage;
                            // Use the mv() method to place the file somewhere on your server
                            await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                                if (err) {
                                    req.flash('Error in ProjectController in EditpostProject', err);
                                    return res.redirect('/backend/addHome');
                                  }
                            });
                        }
                        if (req.files.apllication_img3){ 
                            let app_image = req.files.apllication_img3;
                            console.log("Image", app_image);
                            var re = /(?:\.([^.]+))?$/;
                            var ext3 = re.exec(app_image.name)[1];
                            appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                            var applicationImg3 = '/homeImage/'+appImage;
                            // Use the mv() method to place the file somewhere on your server
                            await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                                if (err) {
                                    req.flash('Error in ProjectController in EditpostProject', err);
                                    return res.redirect('/backend/addHome');
                                  }
                            });
                        }
                        if (req.files.apllication_img4){ 
                            let app_image = req.files.apllication_img4;
                            console.log("Image", app_image);
                            var re = /(?:\.([^.]+))?$/;
                            var ext3 = re.exec(app_image.name)[1];
                            appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                            var applicationImg4 = '/homeImage/'+appImage;
                            // Use the mv() method to place the file somewhere on your server
                            await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                                if (err) {
                                    req.flash('Error in ProjectController in EditpostProject', err);
                                    return res.redirect('/backend/addHome');
                                  }
                            });
                        }
                        if (req.files.apllication_img5){ 
                            let app_image = req.files.apllication_img5;
                            console.log("Image", app_image);
                            var re = /(?:\.([^.]+))?$/;
                            var ext3 = re.exec(app_image.name)[1];
                            appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                            var applicationImg5 = '/homeImage/'+appImage;
                            // Use the mv() method to place the file somewhere on your server
                            await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                                if (err) {
                                    req.flash('Error in ProjectController in EditpostProject', err);
                                    return res.redirect('/backend/addHome');
                                  }
                            });
                        }
                        if (req.files.apllication_img6){ 
                            let app_image = req.files.apllication_img6;
                            console.log("Image", app_image);
                            var re = /(?:\.([^.]+))?$/;
                            var ext3 = re.exec(app_image.name)[1];
                            appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                            var applicationImg6 = '/homeImage/'+appImage;
                            // Use the mv() method to place the file somewhere on your server
                            await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                                if (err) {
                                    req.flash('Error in ProjectController in EditpostProject', err);
                                    return res.redirect('/backend/addHome');
                                  }
                            });
                        }
                        }
                      }else{      
                     if(req.files.projectImage != undefined){  

                      let projectimage = req.files.projectImage;
                      console.log("Image", projectimage);
                      var re = /(?:\.([^.]+))?$/;
                      var ext4 = re.exec(projectimage.name)[1];
                      let projectImage = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext4;
                      let projectImg = '/homeImage/' + projectImage;
                      // Use the mv() method to place the file somewhere on your server
                      await projectimage.mv('./public/homeImage/' + projectImage, async function (err) {
                          if (err) {
                              req.flash('Error in ProjectController in EditpostProject', err);
                              return res.redirect('/backend/addHome');
                          }
                      });
                      updated_img.push({ path: '/homeImage/' + projectImage, fileName: req.files.projectImage.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
                      if(req.files != null){
                      
                      if (req.files.apllication_img){ 
                        let app_image = req.files.apllication_img;
                        console.log("Image", app_image);
                        var re = /(?:\.([^.]+))?$/;
                        var ext3 = re.exec(app_image.name)[1];
                        appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                        var applicationImg = '/homeImage/'+appImage;
                        // Use the mv() method to place the file somewhere on your server
                        await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                            if (err) {
                                req.flash('Error in ProjectController in EditpostProject', err);
                                return res.redirect('/backend/addHome');
                              }
                        });
                    }
                    if (req.files.apllication_img2){ 
                        let app_image = req.files.apllication_img2;
                        console.log("Image", app_image);
                        var re = /(?:\.([^.]+))?$/;
                        var ext3 = re.exec(app_image.name)[1];
                        appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                        var applicationImg2 = '/homeImage/'+appImage;
                        // Use the mv() method to place the file somewhere on your server
                        await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                            if (err) {
                                req.flash('Error in ProjectController in EditpostProject', err);
                                return res.redirect('/backend/addHome');
                              }
                        });
                    }
                    if (req.files.apllication_img3){ 
                        let app_image = req.files.apllication_img3;
                        console.log("Image", app_image);
                        var re = /(?:\.([^.]+))?$/;
                        var ext3 = re.exec(app_image.name)[1];
                        appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                        var applicationImg3 = '/homeImage/'+appImage;
                        // Use the mv() method to place the file somewhere on your server
                        await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                            if (err) {
                                req.flash('Error in ProjectController in EditpostProject', err);
                                return res.redirect('/backend/addHome');
                              }
                        });
                    }
                    if (req.files.apllication_img4){ 
                        let app_image = req.files.apllication_img4;
                        console.log("Image", app_image);
                        var re = /(?:\.([^.]+))?$/;
                        var ext3 = re.exec(app_image.name)[1];
                        appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                        var applicationImg4 = '/homeImage/'+appImage;
                        // Use the mv() method to place the file somewhere on your server
                        await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                            if (err) {
                                req.flash('Error in ProjectController in EditpostProject', err);
                                return res.redirect('/backend/addHome');
                              }
                        });
                    }
                    if (req.files.apllication_img5){ 
                        let app_image = req.files.apllication_img5;
                        console.log("Image", app_image);
                        var re = /(?:\.([^.]+))?$/;
                        var ext3 = re.exec(app_image.name)[1];
                        appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                        var applicationImg5 = '/homeImage/'+appImage;
                        // Use the mv() method to place the file somewhere on your server
                        await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                            if (err) {
                                req.flash('Error in ProjectController in EditpostProject', err);
                                return res.redirect('/backend/addHome');
                              }
                        });
                    }
                    if (req.files.apllication_img6){ 
                        let app_image = req.files.apllication_img6;
                        console.log("Image", app_image);
                        var re = /(?:\.([^.]+))?$/;
                        var ext3 = re.exec(app_image.name)[1];
                        appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                        var applicationImg6 = '/homeImage/'+appImage;
                        // Use the mv() method to place the file somewhere on your server
                        await app_image.mv('./public/homeImage/' + appImage, async function(err) {
                            if (err) {
                                req.flash('Error in ProjectController in EditpostProject', err);
                                return res.redirect('/backend/addHome');
                              }
                        });
                    }
                 }
              }                   
            }
          }
        }
            
                console.log("updated_img",updated_img);
                updateData.coverfiles = updated_img;
                updateData.home_image1 = applicationImg;
                updateData.home_image2 = applicationImg2,
                updateData.home_image3 = applicationImg3,
                updateData.home_image4 = applicationImg4,
                updateData.home_image5 = applicationImg5,
                updateData.home_image6 = applicationImg6,
                await Sys.App.Services.HomeServices.updateProjectData({ _id: req.params.id }, updateData)
                req.flash('success', 'project updated successfully');
                return res.redirect('/backend/addHome');


            } else {
                req.flash('error', 'project not update successfully');
                return res.redirect('/backend/addHome');

            }
        } catch (e) {
            console.log("Error", e);
        }
    },



}





















































