var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");

const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: Sys.Config.App.mailer.auth.user,
        pass: Sys.Config.App.mailer.auth.pass
    }
});



module.exports = {


    // list: async function(req,res){
    // 	try {

    // 		var data = {
    // 			App 					: req.session.details,
    // 			error 				    : req.flash("error"),
    // 			success				    : req.flash("success"),
    //             applicationActive 	        : 'active',

    // 		};
    //         // console.log("Datat", data);
    // 		return res.render('home/listHome',data);
    // 	} catch (e) {
    // 		console.log("Error in ApplicationController in list",e);
    // 	}
    // },
    //For Frontend
    // getSingleApplicationData: async function(req,res){

    // 	try {
    //         let data = await Sys.App.Services.HomeServices.getByData({ });
    //         var sobj = {
    //         	'data': data
    //         };
    //        console.log("obj??????",sobj);
    //        return res.send(sobj);
    //     } catch (e) {
    //     	console.log("Error in ApplicationController in getSingleApplicationData",e);
    //     }
    // },



    //End of Frontend

    // getApplication: async function(req,res){

    // 	try {
    // 		let start = parseInt(req.query.start);
    // 		let length = parseInt(req.query.length);
    // 		let search = req.query.search.value;

    // 		let query = {};
    // 		if (search != '') {
    // 			let capital = search;
    //             query = { name: { $regex: '.*' + search + '.*' }, is_deleted: "0" };
    //         } else {
    //         	query = { is_deleted: "0" };
    //         }

    //         let applicationCount = await Sys.App.Services.GetquoteServices.getHomeCount(query);
    //         let data = await Sys.App.Services.GetquoteServices.getHomeDatatable(query, length, start);
    //         // let categoryname = await Sys.App.Services.CategoryServices.getCategoryDatatable();
    //         var obj = {
    //         	'draw': req.query.draw,
    //         	'recordsTotal': applicationCount,
    //         	'recordsFiltered': applicationCount,
    //         	'data': data,
    //             // 'categoryname': categoryname
    //         };
    //         console.log('data', obj);
    //         // console.log("categrrrrrrrydata", categoryname);
    //         res.send(obj);
    //     } catch (e) {
    //     	console.log("Error in ApplicationController in getApplication",e);
    //     }
    // },

    // addApplication: async function(req,res){
    //     try {
    //         let categoryData = await Sys.App.Services.GetquoteServices.getByData({  }); 

    //         var data = {
    //             App 					: req.session.details,
    //             error 				    : req.flash("error"),
    //             success				    : req.flash("success"),
    //             applicationActive 	        : 'active',
    //             categoryData            : categoryData
    //         };
    //         return res.render('home/addHome',data);
    //   } catch (e) {
    //     console.log("Error in GetQuote ",e);
    //   }
    // },

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
            //end of newcode
            // let category = await Sys.App.Services.CategoryServices.getCategoryData({_id: req.body.categoryName});
            //   console.log("categoy",req.body);
            let application = await Sys.App.Services.GetquoteServices.insertHomeData({
                name: req.body.name,
                company: req.body.company,
                email: req.body.email,
                location: req.body.location,
                head: req.body.head,
                capacity: req.body.capacity,
                specificGravity: req.body.specificGravity,
                fluid: req.body.fluid,
                message: req.body.message,

            });
            console.log(req.body, "mil>>>>>>>>>>>>>>");
            var mailOptions = {
                from: 'example@gmail.com',
                to: 'example@gmail.com',
                subject: "Get Quote",
                text: ` Hello ${req.body.name},Thank You So much for reaching out! Just Confirming that we've received your Message and will be in touch within few hours with a more complete response.`,
                html: `<html>
            <head>
            <style>
            
            </style>
            </head>
            <body>
                <div>
                <p>Name:    ${req.body.name}</p><br>
                <p>Company Name:    ${req.body.company}</p><br>
                <p>Email:   ${req.body.email}</p><br>
                <p>Location:    ${req.body.location}</p><br>
                <p>Head:    ${req.body.head}</p><br>
                <p>Capacity:    ${req.body.capacity}</p><br>
                <p>Specific Gravity:    ${req.body.specificGravity}</p><br>
                <p>Fluid:   ${req.body.fluid}</p><br>
                <p>Message:   ${req.body.message}</p><br>                     
                </div> 
           
            
            </body>
            </html>`


            }

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    //Handle error here
                    // res.send('Please try again!');
                } else {
                    console.log('Email sent: ' + info.response);
                    // res.send('Thanks for Contact Us!');
                }
            });
            // req.flash('successful',"Quote Sent Suceesfully")
            //   return;
            return res.redirect('/home');
        } catch (error) {
            console.log("Error in ApplicationController in postApplication", error);
        }
    },

    // applicationDelete: async function(req,res){
    //     try {
    //         let application = await Sys.App.Services.GetquoteServices.getHomeData({_id: req.body.id});
    //         if (application || application.length >0) {
    //             await Sys.App.Services.HomeServices.deleteHome(
    //                             { _id: req.body.id},
    //                             {
    //                                 is_deleted : "1"
    //                             }
    //                         )
    //             return res.send("success");
    //         }else {
    //             return res.send("error in HomeController in applicationDelete");
    //         }
    //     } catch (e) {
    //         console.log("Erro in HomeController in applicationDelete",e);
    //     }
    // },

    // editApplication: async function(req,res){
    //     try {
    //         // let categoryData = await Sys.App.Services.CategoryServices.getByData({  }); 
    //         let application = await Sys.App.Services.GetquoteServices.getHomeData({
    //             _id: req.params.id
    //         });
    //         return res.render('home/addHome',{application: application , applicationActive : 'active' });
    //     } catch (e) {
    //         console.log("Error in HomeController in editApplication",e);
    //     }

    // },

    // editApplicationPostData: async function(req,res){
    //     try {

    //       // let category = await Sys.App.Services.CategoryServices.getCategoryData({_id: req.body.categoryName})
    //       let application = await Sys.App.Services.GetquoteServices.getHomeData({_id: req.params.id});
    //       if (application) {
    // 					let updateData; 
    //                     let imageName='';
    // 					if (req.files) {
    // 						var re = /(?:\.([^.]+))?$/;
    // 						if (req.files.applicationImage) {
    // 							let image1 = req.files.applicationImage;
    // 							var ext1 = re.exec(image1.name)[1];
    // 							let name = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext1;

    // 							imageName = '/homeImage/'+name;
    // 							if (fs.existsSync('./public/'+application.image) && application.image !='' && req.files && req.files.applicationImage) {
    // 								fs.unlink('./public/'+application.image, function (err) {
    // 									if (err) {
    // 										console.log('Error in HomeController in editOurTeamPostData',err);
    // 									}
    // 								});
    // 							}
    // 							await image1.mv('./public/homeImage/' + name, async function(err) {
    // 								if (err) {
    // 									req.flash('Error Uploading Profile Avatar', err);
    // 									return res.redirect('/backend/addHome');
    // 								}
    // 							});

    // 						}
    //                         let type='video';
    //                         if (ext1 != 'mp4'){
    //                             type ='image'
    //                         }
    //                         updateData = {
    //                             title        :req.body.title,
    //                             headtext	 :req.body.name,
    //                             description  :req.body.description,
    //                             type         :type,
    //                             file        :imageName
    //                             // category_id                 :   category._id,
    //                         }
    // 					}

    //           await Sys.App.Services.GetquoteServices.updateHomeData({ _id: req.params.id },updateData)
    //           req.flash('success','Home updated successfully');
    //           return res.redirect('/backend/home');

    //       }else {
    //         req.flash('error', 'Home not update successfully');
    //         return res.redirect('/backend/home');
    //       }
    //     } catch (e) {
    //         console.log("Error",e);
    //     }
    // },


}





















































