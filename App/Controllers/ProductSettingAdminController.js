var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");
var mongoose = require('mongoose');
const { session } = require('passport');



module.exports = {

    product_setting: async function (req, res) {
        try {
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                product_setting: 'active',
            };
            return res.render('backend/product_setting/get_menu_product_settting', data);
        } catch (e) {
            console.log("Error in product setting", e);
        }
    },

    product_setting_list: async function (req, res) {
        try {
            let attributemodel = "";
            let attributeone = "";
            if(req.params.menu_name == "attribute_set"){
                attributemodel = "active";
                attributeone = "active";
            }
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                product_setting: 'active',
                menu_name: req.params.menu_name,
                attributemodel: attributemodel,
                attributeone: attributeone,
                modelopen:"menu-open"
            };
            
            console.log("data$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", data);
            // req.session.reload(function(err){
            return res.render('backend/product_setting/product_setting_list', data);

            //  });
        } catch (e) {
            console.log("Error in product setting", e);
        }
    },

    product_setting_menulist: async function (req, res) {

        try {
            console.log("req.params.menu_name==========>>>>", req.params.menu_name);
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = '';
            if (req.query.search) {
                search = req.query.search.value;
            }
            let query = {};

            if (search != '') { query = { menu_name: req.params.menu_name, is_deleted: "0" }; }
            else { query = { menu_name: req.params.menu_name, is_deleted: "0" }; }

            let menuCount = await Sys.App.Services.MenuServices.getMenuCount(query);
            let data = await Sys.App.Services.MenuServices.getMenuDatatable(query, length, start);


            // console.log("color check  =================>>>",data);
            // return false;
            var make_array = [];
            if (data) {
                data = data[0]
                if (data.set_array != null) {
                    for (let d = 0; d < data.set_array.length; d++) {
                        if (data.set_array[d].is_deleted == "0" && data.set_array[d].account_id == req.session.details.account_id) {
                            make_array.push({ _id: data._id, name: data.name, set_array: data.set_array, menu_name: data.menu_name, setname: data.set_array[d].menu_name, set_name: data.set_array[d].name })
                        }


                    }
                    data = make_array;
                }
            }


            var obj = {
                'draw': req.query.draw,
                'recordsTotal': menuCount,
                'recordsFiltered': menuCount,
                'data': data,
            };
            // console.log('product_setting_menulist data', data);
            res.send(obj);

        } catch (e) {
            console.log("Error in ProductController in product_setting_menulist", e);
        }
    },

    get_menu_product_settting: async function (req, res) {

        try {
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search.value;

            let query = {};
            if (search != '') { let capital = search; query = { "is_deleted": "0" }; }
            else { query = { "is_deleted": "0" }; }
            // console.log("is_dele",query);
            let menuCount = await Sys.App.Services.MenuServices.getMenuCount(query);
            let data = await Sys.App.Services.MenuServices.getMenuDatatable(query, length, start);

            var obj = {
                'draw': req.query.draw,
                'recordsTotal': menuCount,
                'recordsFiltered': menuCount,
                'data': data,
            };
            // console.log('get_menu_product_settting data', data);
            // console.log("categrrrrrrrydata", categoryname);
            res.send(obj);
        } catch (e) {
            console.log("Error in ProductController in get_menu_product_settting", e);
        }
    },

    product_setting_add: async function (req, res) {
        try {
            console.log("req,", req.params);
            console.log("req,", req.body);
            let menudata = await Sys.App.Services.MenuServices.getMenuData({ menu_name: req.params.menu_name });
            let set_arrayid;
            if (req.params.set_arrayid) {
                for (let m = 0; m < menudata.set_array.length; m++) {
                    if (req.params.set_arrayid == menudata.set_array[m].menu_name) {
                        set_arrayid = menudata.set_array[m].name;
                    }
                }
            }
            // console.log("menudata-----------",menudata);
            // console.log("set_arrayid-----------",set_arrayid);
            let attributemodel = "";
            let attributeone = '';
            if(req.params.menu_name == "attribute_set"){
                attributemodel = "active";
                attributeone = 'active';
            }
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                product_setting: 'active',
                menudata: menudata,
                set_arrayid: set_arrayid,
                attributemodel: attributemodel,
                attributeone: attributeone,
                modelopen:"menu-open"
            };


            // console.log("product setting add data ", menudata);

            return res.render('backend/product_setting/product_setting_add', data);

        } catch (e) {
            console.log("Error in ProductController in product_setting_addpost", e);
        }
    },

    product_setting_addpost: async function (req, res) {


        console.log("product_setting_addpost session =====>>>>>", req.session.details);

        // return false;
        try {
            console.log("filesss>>>>post>>>>>>>>", req.body);

            let subMenu_Name = req.body.attribute_name;
            subMenu_Name = subMenu_Name.trim();
            subMenu_Name = subMenu_Name.toLowerCase();
            subMenu_Name = subMenu_Name.split(' ').join('_');
            let replacementString = '-';
            subMenu_Name = subMenu_Name.replace(/\//g, replacementString);

            console.log("subMenu_Name==>>===========>>>>>>>",subMenu_Name);
            let subMenuSetting;
            let flagg = false;
            if(req.body.menu_name == "attribute_set"){
                console.log("kkk");
                subMenuSetting = await Sys.App.Services.MenuServices.getMenuData({menu_name: "attribute_set"},{'set_array': { $elemMatch: { menu_name: subMenu_Name, account_id: req.session.details.account_id, is_deleted: '0' } } });
                console.log("subMenuSetting=====>>>",subMenuSetting.set_array);
                if(subMenuSetting){
                    if(subMenuSetting.set_array){
                        let sarr = subMenuSetting.set_array;
                        for (let s = 0; s < sarr.length; s++) {
                            console.log("subMenuSetting.set_array[s].menu_Name != subMenu_Name",subMenuSetting.set_array[s].menu_name , subMenu_Name);
                            if(subMenuSetting.set_array[s].menu_name == subMenu_Name){
                                flagg = true;
                            }
                        }
                    }
                }
            }else{
            
                subMenuSetting = await Sys.App.Services.MenuServices.getMenuData({'set_array': { $elemMatch: { menu_name: subMenu_Name, account_id: req.session.details.account_id, is_deleted: '0' } } });
            }
            // let subMenuSetting = await Sys.App.Services.MenuServices.getMenuData({'set_array': { $elemMatch: { menu_name: subMenu_Name, account_id: req.session.details.account_id, is_deleted: '0' } } });

            console.log("menudata =====>>>>", subMenuSetting);

            let menudata = await Sys.App.Services.MenuServices.getMenuData({ menu_name: req.body.menu_name });

            // console.log("menudata name =======>>>>>",menudata);

            // return false;

            
            if (subMenuSetting && flagg == true) {
                let subMsg = menudata.name + " " + " Already Exists";

                req.flash('error', subMsg);
            } else {

                if (req.body.set_arrayid) {
                    await Sys.App.Services.MenuServices.updateMenuData(
                        { _id: menudata._id, "set_array.name": req.body.set_arrayid },
                        { $set: { "set_array.$.name": req.body.attribute_name, "set_array.$.menu_name": subMenu_Name, "set_array.$.account_id": req.session.details.account_id } });
                    req.flash('success', 'Updated SuccessFully');
                } else {
                    if (menudata) {
                        let str = req.body.attribute_name;
                        str = str.toLowerCase()
                        str = str.split(' ').join('_');
                        let replacementString = '-';
                        str = str.replace(/\//g, replacementString);
                        console.log("str==================>>>>>>>>>>>>>>>.", str);
                        await Sys.App.Services.MenuServices.updateMenuData({
                            _id: menudata._id
                        }, { $push: { set_array: { id: create_Id(), name: req.body.attribute_name, menu_name: str, account_id: req.session.details.account_id, is_deleted: "0" } } });
                        console.log("update");
                    }
                    req.flash('success', 'Added SuccessFully');
                }
            }
            //   req.flash('success')
            let attributemodel = "";
            if(req.body.menu_name == "attribute_set"){
                attributemodel = "active";
            }
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                product_setting: 'active',
                menudata: menudata,
                attributemodel: attributemodel,
                menu_name: req.body.menu_name
            };
            console.log("data flash ===================================>>>>>>>>>>>", data);
            if(req.body.menu_name == "attribute_set"){
                return res.redirect('/backend/product_setting/list/attribute_set');
            }else{
                return res.render('backend/product_setting/product_setting_list', data);
            }

            // return res.redirect(`/backend/product_setting_add/${req.body.menu_name}/${req.body.set_arrayid}`);
        } catch (error) {
            console.log("Error in ProductController in postApplication", error);
        }
    },

    product_setting_delete: async function (req, res) {
        try {

            // let query = {};
            // query = {is_separateCategory: "false" };
            console.log(">>>>>>>delete>>>>>", req.params);

            let menudata = await Sys.App.Services.MenuServices.getMenuData({ menu_name: req.params.menu_name });
            if (req.params.set_arrayid) {
                // console.log("heheheheheheheheheh");
                await Sys.App.Services.MenuServices.updateMenuData(
                    { _id: menudata._id, "set_array.menu_name": req.params.set_arrayid },
                    { $set: { "set_array.$.is_deleted": "1" } })
            }
            req.flash('success')
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                product_setting: 'active',
                menudata: menudata,
                menu_name: req.params.menu_name
            };
            console.log("delete");
            return res.send('success');
            //   return false;
            //   return res.redirect(`/backend/product_setting/list/${req.params.menu_name}`);
        } catch (e) {
            console.log("Error in ProductController in product_setting_addpost", e);
        }
    },

    add_setting_menu: async function (req, res) {
        try {
            console.log("req,", req.params);
            console.log("req,", req.body);
            let menudata = await Sys.App.Services.MenuServices.getMenuData({ _id: req.params._id });

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                product_setting: 'active',
                menudata: menudata,
            };

            return res.render('backend/product_setting/add_setting_menu', data);

        } catch (e) {
            console.log("Error in ProductController in add_setting_menu", e);
        }
    },

    add_setting_menu_post: async function (req, res) {

        console.log("session on setting ===add_setting_menu_post >>>", req.session.details.account_id);

        // return false;
        try {
            let menudata
            // console.log("add_setting_menu_post =====>>>>>>>>", req.body);
            if (req.body.menu_id) {
                menudata = await Sys.App.Services.MenuServices.getMenuData({ _id: req.body.menu_id });
                // console.log("menudata data ==== >>>", menudata);
            }
            let menu_Name = req.body.menu_name;
            menu_Name = menu_Name.toLowerCase();
            menu_Name = menu_Name.split(' ').join('_');


            // console.log("menu_Name ===========>>>>>>>>",menu_Name);

            // return false;

            menudataSetting = await Sys.App.Services.MenuServices.getMenuData({ menu_name: menu_Name, is_deleted: '0' });

            // console.log("menudataSetting ==== >>>", menudataSetting);

            if (menudataSetting) {

                let settingMsg = menudataSetting.name + " " + " Already Exists";
                req.flash('error', settingMsg);

            } else {

                if (menudata) {
                    let menuname = req.body.menu_name;
                    menuname = menuname.trim();
                    menuname = menuname.toLowerCase();
                    menuname = menuname.split(' ').join('_');
                    await Sys.App.Services.MenuServices.updateMenuData(
                        { _id: menudata._id },
                        { $set: { "menu_name": menuname, "name": req.body.menu_name } });
                    req.flash('success', 'Updated SuccessFully');
                } else {
                    let menuname = req.body.menu_name;
                    menuname = menuname.toLowerCase();
                    menuname = menuname.split(' ').join('_');
                    await Sys.App.Services.MenuServices.insertMenuData({
                        menu_name: menuname,
                        name: req.body.menu_name,
                        set_array: [],
                        is_deleted: "0"
                    });
                    req.flash('success', 'Added SuccessFully');
                }
            }

            //   req.flash('success')
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                product_setting: 'active',
                menudata: menudata,
                menu_name: req.body.menu_name
            };
            console.log("data flash", data);
            return res.render('backend/product_setting/get_menu_product_settting', data);
        } catch (error) {
            console.log("Error in ProductController in postApplication", error);
        }
    },

    delete_setting_menu: async function (req, res) {
        try {

            // let query = {};
            // query = {is_separateCategory: "false" };
            console.log(">>>>>>>cfjsfklsdjfdsklfjsdklfjkfjs>>>>>", req.params);

            let menudata = await Sys.App.Services.MenuServices.getMenuData({ _id: req.params._id });
            console.log("menudata----------------------------", menudata);
            if (menudata) {
                await Sys.App.Services.MenuServices.updateMenuData(
                    { _id: menudata._id },
                    { $set: { "is_deleted": "1" } })
            }
            req.flash('success')
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                product_setting: 'active',
                //   menudata:menudata,
                //   menu_name:req.params._id
            };
            return res.send('success');
            console.log("delete");
            //   return false;
            //   return res.redirect('backend/product_setting');
        } catch (e) {
            console.log("Error in ProductController in delete_setting_menu", e);
        }
    },
}

function create_Id() {
    var dt = new Date().getTime();
    var uuid = 'xxyxyxxyx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}





















































