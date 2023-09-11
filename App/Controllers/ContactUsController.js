var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");
var mongoose = require('mongoose');
// const sendmail = require('sendmail')();
const flash = require('connect-flash');
const nodemailer = require('nodemailer');
// var transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//         user: Sys.Config.App.mailer.auth.user,
//         pass: Sys.Config.App.mailer.auth.pass
//     }
// });
let transporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com', // <= your smtp server here
    port: 587, // <= connection port
    // secure: true, // use SSL or not
    auth: {
        user: 'intrilogykira@gmail.com',
        pass: 'WLs8g7yk5GMd0mYV'
    }
});



module.exports = {
    // postApplication: async function (req, res) {
    //     console.log("contactus controller", req.body);
    //     try {
    //         console.log("try block start");
    //         let pdffiles = req.files;                  

    //         var pdfs = [];
    //         var institutepdfs = [];
    //         var interpdfs = [];

    //         var re = /(?:\.([^.]+))?$/;
    //         // if(req.files){
    //         //     if (req.files != null || req.files.uploadcv || req.files.uploadcv != undefined || req.files.uploadcv != null) {
    //         //         let product_pdf = req.files.uploadcv;
    //         //         var ext3 = re.exec(product_pdf.name)[1];

    //         //         var productPdf = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext3;
    //         //         // console.log("productPdf[[]]", productPdf);

    //         //         var productFile = '/contact_pdf/' + productPdf;
    //         //         // console.log("PRODUCT FILE inside for loop ", productFile);

    //         //         let pathpdf = './public/teamalfa_pdf/';
    //         //         await product_pdf.mv(pathpdf + productPdf, async function (err) {
    //         //             if (err) {
    //         //                 req.flash('Error in contactcontroller in postProduct', err);
    //         //                 return res.redirect('product/addProduct');
    //         //             }
    //         //         });
    //         //         pdfs.push({ path: '/teamalfa_pdf/' + productPdf, fileName: req.files.uploadcv.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
    //         //         console.log("Single file",);
    //         //     }
    //         //     else if(req.files != null || req.files.attachpdfoption || req.files.attachpdfoption != undefined || req.files.attachpdfoption != null ){
    //         //         let institute_pdfs = req.files.attachpdfoption;    
    //         //         var ext4 = re.exec(institute_pdfs.name)[1];

    //         //             var institutePdf = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext4;
    //         //             // console.log("institutePdf[[]]", institutePdf);

    //         //             var instituteFile = '/institute_pdf/' + institutePdf;
    //         //             // console.log("INSTITUTE FILE inside for loop ", instituteFile);

    //         //             await institute_pdfs.mv('./public/institute_pdf/' + institutePdf, async function (err) {

    //         //                 if (err) {
    //         //                     req.flash('Error in contactcontroller in postProduct', err);
    //         //                     return res.redirect('/contact');
    //         //                 }
    //         //             });
    //         //             institutepdfs.push({ path: '/institute_pdf/' + institutePdf, fileName: req.files.attachpdfoption.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
    //         //             // console.log("Mutiple file");
    //         //     }
    //         //     else if(req.body.files.uploadcvoption || req.body.files.uploadcvoption != undefined || req.body.files.uploadcvoption !=null ){   

    //         //     let inter_pdfs = req.files.uploadcvoption;
    //         //     var ext1 = re.exec(inter_pdfs.name)[1];                

    //         //     var interPdf = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext1;
    //         //     // console.log("interPdf[[]]", interPdf);              

    //         //     var interFile = '/teamalfa_pdf/' + interPdf;
    //         //     // console.log("INTER FILE inside for loop ", interFile);         

    //         //     await inter_pdfs.mv('./public/institute_pdf/' + interPdf, async function (err) {

    //         //         if (err) {
    //         //             req.flash('Error in contactcontroller in postProduct', err);
    //         //             return res.redirect('/contact');
    //         //         }
    //         //     });
    //         //     interpdfs.push({ path: '/intern_pdf/' + interPdf, fileName: req.files.uploadcvoption.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
    //         //     console.log("Mutiple file");
    //         //         }
    //         //     }
    //         let application = await Sys.App.Services.ContactUsServies.insertHomeData({
    //             name                    : req.body.name,
    //             email                   : req.body.email,
    //             profiletype             : req.body.company,
    //             phone                   : req.body.phone,
    //             message                 : req.body.message
    //         });

    //         var objvalues = Object.values(req.body);
    //         var entriesValue = Object.keys(req.body);
    //         let entries = Object.entries(req.body);          
    //         let newEntries = {};

    //         //   working code
    //         //   for(var k in entries){
    //         //     if(objvalues[k] !== '')
    //         //     newEntries[entriesValue[k]] = objvalues[k];
    //         //   }

    //          const splitKeyValue = obj => {
    //             const keys = Object.keys(obj);
    //             const res = [];
    //             for(let i = 0; i < keys.length; i++){
    //                 if(objvalues[i] !== ''){
    //                 res.push(                        
    //                      obj[keys[i]]
    //                  );
    //                 }
    //             };
    //             return res;
    //          };
    //         let result = splitKeyValue(entriesValue)
    //         let resultVal = splitKeyValue(objvalues)

    //         let ans = '' ;
    //         for(let i = 0; i < result.length; i++){
    //             ans += result[i] ;           
    //         }       

    //         let profileMail = '' ;
    //         let profileMailvalue = '';
    //         let bottomMail ;

    //          bottomMail =`<br/><div style ="color:#000; font-weight:600"></a> 
    //         </div><div style="text-align: left;
    //         margin-bottom: 10px;">Team Oemone</div></div><div></div></div></body></html>`

    //         for(let i = 0; i < result.length; i++){
    //             profileMail +=`<div style="font-size: 14px;text-align: left; line-height: 20px;  margin: 5px 0;"><b>${result[i]}</b>:${resultVal[i]} `  
    //         }       
    //         for(let i = 0; i < resultVal.length; i++){
    //             profileMailvalue += resultVal[i]                       
    //         }  
    //         let adminMail =`<html><body style="text-align: center; color:#000;background-color:
    //         #7f87ab;margin: 0 auto;font-family: Arial, Helvetica, sans-serif">
    //         <div style="position: relative;"><div style="position: relative; height: 250px; 
    //         background-color: #7f87ab;"><div style="padding: 70px 0;font-size: 24px;color: #fff; 
    //         text-align: center;"><b>Oemone</b></div></div><div style="background-color: #fff;
    //         width: 500px;margin: 0 auto;top: -75px;margin-bottom: 30px;position: relative;
    //         padding: 25px;z-index: 1"><div style="font-size: 14px;margin-bottom: 20px; 
    //         text-align: left;">Hello Admin,</div><div style="text-align: left;">A New contact request has submitted with following information</div><br/>${profileMail}<br/>${bottomMail}`            

    //         var mailOptions = {
    //             from: 'Oemone@gmail.com',
    //             to: req.body.email,
    //             subject: "Contact Us From Oemone",

    //             html: `<html><body style="text-align: center; color:#000;background-color:
    //             #7f87ab;margin: 0 auto;font-family: Arial, Helvetica, sans-serif">
    //             <div style="position: relative;"><div style="position: relative; height: 250px; 
    //             background-color: #7f87ab;"><div style="padding: 70px 0;font-size: 24px;color: #fff; 
    //             text-align: center;"><b>Oemone</b></div></div><div style="background-color: #fff;
    //             width: 500px;margin: 0 auto;top: -75px;margin-bottom: 30px;position: relative;
    //             padding: 25px;z-index: 1"><div style="font-size: 24px;margin-bottom: 20px; 
    //             text-align: center;">Greetings of the day</div><div style="font-size: 14px; 
    //             text-align: left; line-height: 20px; margin: 20px 0;"><b></b><br/><br/>
    //             Hello ${req.body.name},Thank You So much for reaching out! Just Confirming 
    //             that we've received your Message and will be in touch within few hours with 
    //             a more complete response.<br/><div style ="color:#000; font-weight:600"></a> 
    //             </div><div style="text-align: left;">Thank you</div><div style="text-align: left;
    //             margin-bottom: 10px;">Team Oemone</div></div><div><div style="font-size: 12px;
    //             text-align: center; position: relative; top: -75px;">Email sent from 
    //             <a href="https://www.Oemone.com/" target="_blank">https://www.Oemone.com/</a>
    //             </div></div></div></body></html>`                                
    //         }
    //         // sendmail({
    //         //     from: 'intrilogykira@gmail.com',
    //         //     to: req.body.Email,
    //         //     subject: "Contact Us From AlfaPumps",

    //         //     html: `<html><body style="text-align: center; color:#000;background-color:
    //         //     #7f87ab;margin: 0 auto;font-family: Arial, Helvetica, sans-serif">
    //         //     <div style="position: relative;"><div style="position: relative; height: 250px; 
    //         //     background-color: #7f87ab;"><div style="padding: 70px 0;font-size: 24px;color: #fff; 
    //         //     text-align: center;"><b>Alfa Pumps</b></div></div><div style="background-color: #fff;
    //         //     width: 500px;margin: 0 auto;top: -75px;margin-bottom: 30px;position: relative;
    //         //     padding: 25px;z-index: 1"><div style="font-size: 24px;margin-bottom: 20px; 
    //         //     text-align: center;">Greetings of the day</div><div style="font-size: 14px; 
    //         //     text-align: left; line-height: 20px; margin: 20px 0;"><b></b><br/><br/>
    //         //     Hello ${req.body.Name},Thank You So much for reaching out! Just Confirming 
    //         //     that we've received your Message and will be in touch within few hours with 
    //         //     a more complete response.<br/><div style ="color:#000; font-weight:600"></a> 
    //         //     </div><div style="text-align: left;">Thank you</div><div style="text-align: left;
    //         //     margin-bottom: 10px;">Team Alfa Pumps</div></div><div><div style="font-size: 12px;
    //         //     text-align: center; position: relative; top: -75px;">Email sent from 
    //         //     <a href="https://www.alfapumps.com/" target="_blank">https://www.alfapumps.com/</a>
    //         //     </div></div></div></body></html>`                                
    //         // }, function(err, reply) {
    //         //     if(err){
    //         //         console.log(err && err.stack);
    //         //         return res.send("error");
    //         //     }else{
    //         //         console.dir(reply);
    //         //         return res.send("success"); 
    //         //     }
    //         // });
    //         transporter.sendMail(mailOptions, function (error, info) {
    //             if (error) {
    //                 console.log(error);
    //                 transporter.close();                   
    //             } else {
    //                 console.log('Email sent: ' + info.response);
    //             }
    //         });            
    //         var mailOptionsAdmin = {
    //             from:'Oemone@gmail.com',
    //             to:'intrilogykira@gmail.com',
    //             subject: "Contact Us From Oemone",
    //             text: ` Hello ${req.body.name},Thank You So much for reaching out! Just Confirming that we've received 
    //             your Message and will be in touch within few hours with a more complete response.`,
    //             html:`${adminMail}`              

    //         }
    //         let temp = false;
    //         // sendmail({
    //         //     from:'intrilogykira@gmail.com',
    //         //     to:req.body.Email,
    //         //     subject: "Contact Us From AlfaPumps",
    //         //     text: ` Hello ${req.body.name},Thank You So much for reaching out! Just Confirming that we've received 
    //         //     your Message and will be in touch within few hours with a more complete response.`,
    //         //     html:`${adminMail}` 
    //         // }, function(err, reply) {
    //         //     if(err){
    //         //         console.log(err && err.stack);
    //         //         return res.send("error");
    //         //     }else{
    //         //         console.dir(reply);
    //         //         return res.send("success"); 
    //         //     }
    //         // });
    //         transporter.sendMail(mailOptionsAdmin, function (error, info) {
    //             if (error) {
    //                 console.log("inside error");
    //                 console.log(error); 
    //                 temp = true;  
    //                 transporter.close();        

    //                 if(temp == true){
    //                     return res.send("error");
    //                 }                             

    //             } else {
    //                 console.log('Email sent: ' + info.response);
    //                 return res.send("success");
    //             }
    //         });

    //         // return res.send(data);
    //       // return res.redirect('/contact');     

    //     } catch (error) {
    //         console.log("Error in ContactUsController in postApplication", error);
    //     }
    // },  

    postApplication: async function (req, res) {
        console.log("contactus controller", req.body);
        try {
            let application = await Sys.App.Services.ContactUsServies.insertHomeData({
                name: req.body.name,
                email: req.body.email,
                message: req.body.enquiry
            });

            var objvalues = Object.values(req.body);
            var entriesValue = Object.keys(req.body);
            let entries = Object.entries(req.body);
            let newEntries = {};

            for (var k in entries) {
                if (objvalues[k] !== '')
                    newEntries[entriesValue[k]] = objvalues[k];
            }

            const splitKeyValue = obj => {
                const keys = Object.keys(obj);
                const res = [];
                for (let i = 0; i < keys.length; i++) {
                    if (objvalues[i] !== '') {
                        res.push(
                            obj[keys[i]]
                        );
                    }
                };
                return res;
            };
            let result = splitKeyValue(entriesValue)
            let resultVal = splitKeyValue(objvalues)

            let ans = '';
            for (let i = 0; i < result.length; i++) {
                ans += result[i];
            }

            let profileMail = '';
            let profileMailvalue = '';
            let bottomMail;

            bottomMail = `<br/><div style ="color:#000; font-weight:600"></a> 
            </div><div style="text-align: left;
            margin-bottom: 10px;">Team BookClub</div></div><div></div></div></body></html>`

            console.log(":::result:::", result);
            console.log(":::resultVal:::", resultVal);

            for (let i = 0; i < result.length; i++) {
                profileMail += `<div style="font-size: 14px;text-align: left; line-height: 20px;  margin: 5px 0;"><b>${result[i]}</b>:${resultVal[i]} `
            }
            for (let i = 0; i < resultVal.length; i++) {
                profileMailvalue += resultVal[i]
            }

            console.log(":::profileMail:::",profileMail);

            // return res.redirect('/contact')

            let adminMail = `<html><body style="text-align: center; color:#000;background-color:
            #7f87ab;margin: 0 auto;font-family: Arial, Helvetica, sans-serif">
            <div style="position: relative;"><div style="position: relative; height: 250px; 
            background-color: #7f87ab;"><div style="padding: 70px 0;font-size: 24px;color: #fff; 
            text-align: center;"><b>BookClub</b></div></div><div style="background-color: #fff;
            width: 500px;margin: 0 auto;top: -75px;margin-bottom: 30px;position: relative;
            padding: 25px;z-index: 1"><div style="font-size: 14px;margin-bottom: 20px; 
            text-align: left;">Hello Admin,</div><div style="text-align: left;">A New contact request has submitted with following information</div><br/>${profileMail}<br/>${bottomMail}`

            var mailOptions = {
                from: 'intrilogykira@gmail.com',
                to: req.body.email,
                subject: "Contact Us From BookClub",

                html: `<html><body style="text-align: center; color:#000;background-color:
                #7f87ab;margin: 0 auto;font-family: Arial, Helvetica, sans-serif">
                <div style="position: relative;"><div style="position: relative; height: 250px; 
                background-color: #7f87ab;"><div style="padding: 70px 0;font-size: 24px;color: #fff; 
                text-align: center;"><b>BookClub</b></div></div><div style="background-color: #fff;
                width: 500px;margin: 0 auto;top: -75px;margin-bottom: 30px;position: relative;
                padding: 25px;z-index: 1"><div style="font-size: 24px;margin-bottom: 20px; 
                text-align: center;">Greetings of the day</div><div style="font-size: 14px; 
                text-align: left; line-height: 20px; margin: 20px 0;"><b></b><br/><br/>
                Hello ${req.body.name},Thank You So much for reaching out! Just Confirming 
                that we've received your Message and will be in touch within few hours with 
                a more complete response.<br/><div style ="color:#000; font-weight:600"></a> 
                </div><div style="text-align: left;">Thank you</div><div style="text-align: left;
                margin-bottom: 10px;">Team BookClub</div></div><div><div style="font-size: 12px;
                text-align: center; position: relative; top: -75px;">Email sent from 
                <a href="https://www.BookClub.com/" target="_blank">https://www.BookClub.com/</a>
                </div></div></div></body></html>`
            }
            // sendmail({
            //     from: 'intrilogykira@gmail.com',
            //     to: req.body.Email,
            //     subject: "Contact Us From AlfaPumps",

            //     html: `<html><body style="text-align: center; color:#000;background-color:
            //     #7f87ab;margin: 0 auto;font-family: Arial, Helvetica, sans-serif">
            //     <div style="position: relative;"><div style="position: relative; height: 250px; 
            //     background-color: #7f87ab;"><div style="padding: 70px 0;font-size: 24px;color: #fff; 
            //     text-align: center;"><b>Alfa Pumps</b></div></div><div style="background-color: #fff;
            //     width: 500px;margin: 0 auto;top: -75px;margin-bottom: 30px;position: relative;
            //     padding: 25px;z-index: 1"><div style="font-size: 24px;margin-bottom: 20px; 
            //     text-align: center;">Greetings of the day</div><div style="font-size: 14px; 
            //     text-align: left; line-height: 20px; margin: 20px 0;"><b></b><br/><br/>
            //     Hello ${req.body.Name},Thank You So much for reaching out! Just Confirming 
            //     that we've received your Message and will be in touch within few hours with 
            //     a more complete response.<br/><div style ="color:#000; font-weight:600"></a> 
            //     </div><div style="text-align: left;">Thank you</div><div style="text-align: left;
            //     margin-bottom: 10px;">Team Alfa Pumps</div></div><div><div style="font-size: 12px;
            //     text-align: center; position: relative; top: -75px;">Email sent from 
            //     <a href="https://www.alfapumps.com/" target="_blank">https://www.alfapumps.com/</a>
            //     </div></div></div></body></html>`                                
            // }, function(err, reply) {
            //     if(err){
            //         console.log(err && err.stack);
            //         return res.send("error");
            //     }else{
            //         console.dir(reply);
            //         return res.send("success"); 
            //     }
            // });
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    transporter.close();
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            var mailOptionsAdmin = {
                from: 'intrilogykira@gmail.com',
                to: 'rakesh.kiraintrilogy@gmail.com',
                subject: "Contact Us From BookClub",
                text: ` Hello ${req.body.name},Thank You So much for reaching out! Just Confirming that we've received 
                your Message and will be in touch within few hours with a more complete response.`,
                html: `${adminMail}`
            }
            let temp = false;
            // sendmail({
            //     from:'intrilogykira@gmail.com',
            //     to:req.body.Email,
            //     subject: "Contact Us From AlfaPumps",
            //     text: ` Hello ${req.body.name},Thank You So much for reaching out! Just Confirming that we've received 
            //     your Message and will be in touch within few hours with a more complete response.`,
            //     html:`${adminMail}` 
            // }, function(err, reply) {
            //     if(err){
            //         console.log(err && err.stack);
            //         return res.send("error");
            //     }else{
            //         console.dir(reply);
            //         return res.send("success"); 
            //     }
            // });
            transporter.sendMail(mailOptionsAdmin, function (error, info) {
                if (error) {
                    console.log("inside error");
                    console.log(error);
                    temp = true;
                    transporter.close();

                    if (temp == true) {
                        return res.send("error");
                    }

                } else {
                    console.log('Email sent: ' + info.response);
                    return res.send("success");
                }
            });

            // return res.send(data);
            // return res.redirect('/contact');     

            req.flash("success", "Thank you for your enquiry, we will get back to you within 24 hours.")
            return res.redirect('/contact')
        } catch (error) {
            console.log("Error in ContactUsController in postApplication", error);
        }
    },

}





















































