var Sys = require('../../Boot/Sys');
// const flash = require('flash');


module.exports = {
    list: async function(req,res){
		try {
			var data = {
				App 					: req.session.details,
				error 				    : req.flash("error"),
				success				    : req.flash("success"),
                regionActive 	        : 'active'
			};
			return res.render('backend/region/listRegion',data);
		} catch (e) {
			console.log("Error in RegionController in list",e);
		}
	},

    getRegion: async function(req,res){

		try {
			let start = parseInt(req.query.start);
			let length = parseInt(req.query.length);
			let search = req.query.search.value;

			let query = {};
			if (search != '') {
				let capital = search;
                query = { regionName: { $regex: '.*' + search + '.*' }, is_deleted: "0" };
            } else {
            	query = { is_deleted: "0" };
            }

            let regionCount = await Sys.App.Services.RegionServices.getRegionCount(query);
            let data = await Sys.App.Services.RegionServices.getRegionDatatable(query, length, start);
            var obj = {
            	'draw': req.query.draw,
            	'recordsTotal': regionCount,
            	'recordsFiltered': regionCount,
            	'data': data
            };
            res.send(obj);
        } catch (e) {
        	console.log("Error in RegionController in getRegion",e);
        }
    },


    //For Frontend
    getRegionData: async function(req,res){

		try {
            let data = await Sys.App.Services.RegionServices.getByData({_id: req.body.id});
            var obj = {
            	'data': data[0]
            };
           console.log("obj",obj);
           return res.send(obj);
        } catch (e) {
        	console.log("Error in RegionController in getRegion",e);
        }
    },
    //End of "For Frontend"

    getSingleRegionData: async function(req,res){

		try {
            let data = await Sys.App.Services.RegionServices.getRegionData({_id: req.body.id});
            var sobj = {
            	'data': data
            };
           console.log("obj",sobj);
           return res.send(sobj);
        } catch (e) {
        	console.log("Error in RegionController in getRegion",e);
        }
    },
    

    addRegion: async function(req,res){
        try {

            var data = {
                App 					: req.session.details,
                error 				    : req.flash("error"),
                success				    : req.flash("success"),
                regionActive 	        : 'active',

            };
            return res.render('backend/region/addRegion',data);
      } catch (e) {
        console.log("Error in RegionController in addRegion",e);
      }
    },

    postRegion: async function(req, res){
        console.log(req.body);
        try {
            let regionData = await Sys.App.Services.RegionServices.getRegionData({
                regionName: req.body.regionName,
 
            });
            console.log("===========================");
            console.log("===========================", regionData);
            console.log("===========================");
            if (regionData) {
                console.log("region already Exists")
                req.flash('error', "Region already Exists!");
                return res.redirect('/backend/region');
            } else {
                // res.redirect('/backend/addRegion')
                await Sys.App.Services.RegionServices.insertRegionData({
                    regionName: req.body.regionName,
                    address: req.body.address,
                    phone: req.body.phone,
                    email: req.body.email,
                    // profiletype : req.body.profiletype
              
                })
          
                req.flash("success", "Region Data inserted Successfully!")
                return res.redirect('/backend/region');
            }

        } catch (error) {
            console.log("Error in RegionController in postRegion",error);
        }
    },

    


    regionDelete: async function(req,res){
        try {
            let region = await Sys.App.Services.RegionServices.getRegionData({_id: req.body.id});
            if (region || region.length >0) {
                await Sys.App.Services.RegionServices.updateRegionData(
                                { _id: req.body.id},
                                {
                                    is_deleted : "1"
                                }
                            )
                return res.send("success");
            }else {
                return res.send("error in RegionController in regionDelete");
            }
        } catch (e) {
            console.log("Error in RegionController in regionDelete",e);
        }
    },

    

    editRegion: async function(req,res){
        try {
            let regionData = await Sys.App.Services.RegionServices.getByData({ _id: req.params.id});
            let region = await Sys.App.Services.RegionServices.getRegionData({_id: req.params.id});
            var data = {
                App 					: req.session.details,
                error 				    : req.flash("error"),
                success				    : req.flash("success"),
                region                  : region,
                regionActive 	        : 'active',
                regionData              : regionData,

            };
            return res.render('backend/region/addRegion',data);
        } catch (e) {
            console.log("Error in RegionController in editRegion",e);
        }
 
    },


    editRegionPostData: async function(req,res){
        try {

          let region = await Sys.App.Services.RegionServices.getRegionData({_id: req.params.id});
          console.log("=========================", req.body);
          console.log("=========================,", region);
          console.log("=========================", req.params);
        
          if (region.regionName && region.regionName.length > 0) {
            // let regionDATA = await Sys.App.Services.RegionServices.getByData({ regionName: req.body.regionName,});
              let dataObj = {};
              if(req.body.regionName){
                dataObj.regionName = req.body.regionName

              }
            //   if(req.body.profiletype){
            //     dataObj.profiletype = req.body.profiletype

            //   }
              if (req.body.address) {
                dataObj.address = req.body.address
              }
              if (req.body.phone) {
                dataObj.phone = req.body.phone
              }
              if (req.body.email) {
                dataObj.email = req.body.email
              }
              console.log("|||||||||||||||||||||||||||");
              console.log("|||||||||||||||||||||||||||", dataObj);
            //   console.log("??????????????????", dataObj.regionName);
            //   console.log("@@@@@@@@@@@@", regionDATA);

            //   if (regionDATA == dataObj.regionName) {
            //     console.log("region already Exists")
            //     req.flash('error', "Region already Exists!");
            //     return res.redirect('/backend/region');
            // } else {
                await Sys.App.Services.RegionServices.updateRegionData(
                    {
                        _id: req.params.id
                    }, dataObj
                )
                req.flash("success", "Region update successfully")
                res.redirect('/backend/region');
            // }
       
                

                
            } else {
                req.flash("error", 'No Region found')
                return res.redirect('/backend/region');
            }
        } catch (e) {
            console.log("Error",e);
        }
    },

   



}





















































