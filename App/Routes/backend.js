var express = require('express'),
    router = express.Router();
var Sys = require('../../Boot/Sys');

// add passport modules for social media integration
const passport = require('passport');
const passport_conf = require('../../Config/passport')(passport);

// Load Your Cutom Middlewares
// router.get('/backend', Sys.App.Middlewares.Frontend.frontRequestCheck, function(req, res) {
//     res.send('This is Backend');
// });


router.get('/testotp', function(req, res) {
    /*    let randomotp = Math.floor(100000 + Math.random() * 900000);
       console.log("Random Otp number:-", randomotp); */
});

//
/**
 * Auth Router
 */

router.get('/backend', Sys.App.Middlewares.Backend.loginCheck, Sys.App.Controllers.Auth.login);
router.post('/backend', Sys.App.Middlewares.Backend.loginCheck, Sys.App.Middlewares.Validator.loginPostValidate, Sys.App.Controllers.Auth.postLogin);

router.get('/logout', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.Auth.logout);


router.get('/register', Sys.App.Middlewares.Backend.loginCheck, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.Auth.register);


router.get('/profile', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.Auth.profile);
router.post('/profile/update', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.Auth.profileUpdate);

router.post('/profile/changePwd', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.Auth.changePassword);

router.post('/profile/changeAvatar', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.Auth.changeAvatar);

//registerVendor start

router.post('/registerVendor',  Sys.App.Controllers.VendorProfileController.registerVendor);
router.post('/vendorUpdateProfile',  Sys.App.Controllers.VendorAdminController.editVendorPostData);


router.get('/vendor_Profile', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('vendor', 'custom'), Sys.App.Controllers.VendorAdminController.vendor_Profile);
router.get('/vendor_Profile/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.VendorAdminController.vendor_Profile__Admin);

// router.post('/vendor_Update_Profile/:id',Sys.App.Controllers.VendorAdminController.editVendorPostData);


//registerVendor end

/**
 * Dashboard Router
 */
 router.get('/vendor_dashboard', Sys.App.Middlewares.Frontend.isLoggedIn, Sys.App.Middlewares.Backend.HasRole('vendor', 'custom'), Sys.App.Controllers.Dashboard.vendor_Home);

router.get('/dashboard', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.Dashboard.home);


router.get('/backend/pendingInstructors', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.UserController.pendingInstructorsList);
router.get('/backend/user/getPendingAffiliates', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.UserController.getPendingAffiliates);
router.post('/backend/user/setAffiliate', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.UserController.setAffiliate);

 /// //Start of home routes
// router.get('/backend/home', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.list);

// router.get('/backend/getHome', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.getApplication);

// router.post('/backend/homeDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.applicationDelete);


// router.get('/backend/addHome', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.addApplication);

// router.post('/backend/addHome', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.postApplication);

// router.get('/backend/homeEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.editApplication);

// router.post('/backend/homeEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.editApplicationPostData);

//  //End of home Routes 

//Start of aboutUs routes

router.get('/backend/about', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.about);
router.get('/backend/getAbout', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.getAbout);
router.get('/backend/addAboutData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.aboutAdd);
router.post('/backend/addAboutData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.aboutAddPost);

router.get('/backend/editAboutData/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.aboutUpdate);
router.post('/backend/editAboutData/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.aboutUpdatePost);
router.post('/backend/about/getAboutDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.getAboutDelete);
// End of aboutUs routes

//product_setting routes start
router.get('/backend/product_setting', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductSettingAdminController.product_setting);
router.get('/backend/get_menu_product_settting', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductSettingAdminController.get_menu_product_settting);
router.get('/backend/product_setting/list/:menu_name', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductSettingAdminController.product_setting_list);
router.get('/backend/product_setting/list', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductSettingAdminController.product_setting_list);
router.get('/backend/product_setting/:menu_name', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductSettingAdminController.product_setting_menulist);
router.get('/backend/product_setting_add/:menu_name', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductSettingAdminController.product_setting_add);
router.post('/backend/product_setting_addpost', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductSettingAdminController.product_setting_addpost);
router.get('/backend/product_setting_add/:menu_name/:set_arrayid', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductSettingAdminController.product_setting_add);
router.post('/backend/product_setting_addpost', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductSettingAdminController.product_setting_addpost);
router.get('/backend/product_setting_delete/:menu_name/:set_arrayid', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductSettingAdminController.product_setting_delete);
router.get('/backend/add_setting_menu', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductSettingAdminController.add_setting_menu);
router.get('/backend/add_setting_menu/:_id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductSettingAdminController.add_setting_menu);
router.post('/backend/add_setting_menu_post', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductSettingAdminController.add_setting_menu_post);
router.get('/backend/delete_setting_menu/:_id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductSettingAdminController.delete_setting_menu);
//product_setting routes end

// //Start of project routes
// router.get('/backend/categorylist',  Sys.App.Controllers.ApplicationController.category);
router.get('/backend/product', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.list);
router.get('/backend/getProduct', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.getProduct);
router.get('/backend/defaultImageDelete/:id/:deleteid', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.defaultImageDelete);
router.get('/backend/productImageDelete/:id/:deleteid', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.productImageDelete);
router.post('/backend/productDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.productDelete);
// router.post('/backend/productUpdate', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.productCategoryUpdate);
router.get('/backend/pdfDelete/:id/:deleteid', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.pdfDelete);


// router.get('/backend/product_setting_edit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.product_setting_edit);
// router.post('/backend/product_setting_editpost/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.product_setting_editpost);


router.get('/backend/addProduct', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.addProduct);

router.post('/backend/addProduct', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.postProduct);

router.get('/backend/productEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.editProduct);

router.post('/backend/productEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.editProductPostData);
 //End of project Routes


 //discount
router.get('/backend/discount', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.DiscountAdminController.list);

router.get('/backend/getDiscount', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.DiscountAdminController.getDiscount);
 
router.get('/backend/discountAdd', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.DiscountAdminController.discountAdd);

router.post('/backend/discountAddPost', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.DiscountAdminController.discountAddPost);

router.get('/backend/discountEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.DiscountAdminController.discountEdit);

router.post('/backend/discountEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.DiscountAdminController.discountEditPost);

router.post('/backend/discountDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.DiscountAdminController.discountDelete);


//Start of projectCategory routes
router.get('/backend/productCategory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryAdminController.list);

router.get('/backend/getProductCategory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryAdminController.getProductCategory);

router.post('/backend/productCategoryDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryAdminController.productCategoryDelete);

router.post('/backend/pdfCategoryDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryAdminController.pdfDelete);

router.get('/backend/addProductCategory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryAdminController.addProductCategory);

router.post('/backend/addProductCategory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryAdminController.postProductCategory);

router.get('/backend/productCategoryEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryAdminController.editProductCategory);

router.post('/backend/productCategoryEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryAdminController.editProductCategoryPostData);

router.get('/backend/productCategory/add_sub_productCategory/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryAdminController.add_sub_productCategory);
router.get('/backend/productCategory/add_sub_productCategory/:id/:subid', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryAdminController.add_sub_productCategory);
router.get('/backend/productCategory/add_sub_productCategory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryAdminController.add_sub_productCategory);
router.get('/backend/productCategory/edit_sub_productCategory/:id/:main_productId', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryAdminController.edit_sub_productCategory);
router.get('/backend/productCategory/edit_sub_productCategory/:id/:main_productId/:subid', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryAdminController.edit_sub_productCategory);
router.get('/backend/productCategory/edit_sub_productCategory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryAdminController.edit_sub_productCategory);
router.post('/backend/productCategory/add_sub_post_productCategory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryAdminController.add_sub_post_productCategory);
router.post('/backend/productCategory/edit_sub_post_productCategory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryAdminController.edit_sub_post_productCategory);
router.get('/backend/productCategory/list_sub_productCategory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryAdminController.list_sub_productCategory);
router.get('/backend/productCategory/list_sub_productCategory/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryAdminController.list_sub_productCategory);
router.get('/backend/productCategory/list_sub_productCategory/:id/:main_productId', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryAdminController.list_sub_productCategory);
router.get('/backend/productCategory/get_sub_productCategory/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryAdminController.get_sub_productCategory);
router.get('/backend/productCategory/get_sub_productCategory/:id/:main_productId', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryAdminController.get_sub_productCategory);
router.post('/backend/productCategory/delete_sub_productCategory/:id/:main_productId', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryAdminController.delete_sub_productCategory);
router.post('/backend/productCategory/delete_sub_productCategory/:id/:main_productId/:subid', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryAdminController.delete_sub_productCategory);

//End of projectCategory Routes 





//Start of category routes
router.get('/backend/category', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CategoryController.list);

router.get('/backend/getCategory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CategoryController.getCategory);

router.post('/backend/categoryDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CategoryController.categoryDelete);


router.get('/backend/addCategory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CategoryController.addCategory);

router.post('/backend/addCategory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CategoryController.postCategory);

router.get('/backend/categoryEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CategoryController.editCategory);

router.post('/backend/categoryEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CategoryController.editCategoryPostData);
 //End of category Routes 


//Start of region routes
router.get('/backend/region', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.RegionController.list);

router.get('/backend/getRegion', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.RegionController.getRegion);

router.post('/backend/getRegionData',  Sys.App.Controllers.RegionController.getRegionData);
router.post('/backend/getSingleRegionData',Sys.App.Controllers.RegionController.getSingleRegionData);


router.post('/backend/regionDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.RegionController.regionDelete);


router.get('/backend/addRegion', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.RegionController.addRegion);

router.post('/backend/addRegion', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.RegionController.postRegion);


router.get('/backend/regionEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.RegionController.editRegion);

router.post('/backend/regionEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.RegionController.editRegionPostData);
 //End of region Routes 

 /// //Start of profileType routes

router.get('/backend/profileType', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProfileTypeController.list);

router.get('/backend/getProfileType', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProfileTypeController.getApplication);

router.post('/backend/profileTypeDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProfileTypeController.applicationDelete);


router.get('/backend/addProfileType', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProfileTypeController.addApplication);

router.post('/backend/addProfileType', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProfileTypeController.postApplication);

router.get('/backend/profileTypeEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProfileTypeController.editApplication);

router.post('/backend/profileTypeEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProfileTypeController.editApplicationPostData);
//  //End of profileType Routes

//Role Management
router.get('/backend/roleManagement', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.roleManagement);
router.get('/backend/roleManagement/getUsers', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.getCustomUsers);
router.get('/backend/addCustomUser', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.addCustomUser);
router.post('/backend/addCustomUser', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.addCustomUserPost);
router.get('/backend/setUserAccess/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.setUserAccess);
router.post('/backend/setUserAccess/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.setUserAccessPost);

// vendor start 
router.get('/backend/vendor', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.VendorAdminController.list);
router.get('/backend/getVendor', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.VendorAdminController.getVendor);
router.get('/backend/vendorEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.VendorAdminController.editVendor);
router.post('/backend/vendorDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.VendorAdminController.vendorDelete);
router.post('/approvedByAdmin', Sys.App.Controllers.VendorAdminController.approvedByAdmin);
router.post('/denyByAdmin', Sys.App.Controllers.VendorAdminController.approvedDeny);


// router.post('/notApprovedVendorList', Sys.App.Controllers.VendorAdminController.notApprovedVendorList);
// router.post('/verifyEmail', Sys.App.Controllers.VendorAdminController.verifyEmail);
// router.post('/denyRequest', Sys.App.Controllers.VendorAdminController.denyRequest);
router.get('/vendor_email_verify/:id', Sys.App.Controllers.VendorAdminController.vendor_email_verify);

//coupon code

router.get('/backend/couponcode', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CouponCodeAdminController.list);
router.get('/backend/getCouponcode', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CouponCodeAdminController.getCouponcode);
router.get('/backend/addCouponcode', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CouponCodeAdminController.addCouponcode);
router.post('/backend/addPostCouponcode', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CouponCodeAdminController.addPostCouponcode);
router.get('/backend/editCouponcode/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CouponCodeAdminController.editCouponcode);
router.post('/backend/editPostCouponcode', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CouponCodeAdminController.editPostCouponcode);
router.get('/backend/deleteCouponcode/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CouponCodeAdminController.deleteCouponcode);
// coupon code

//commision code

router.get('/backend/commision', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CommisionAdminController.list);
router.get('/backend/getCommision', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CommisionAdminController.getCommision);
router.get('/backend/addCommision', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CommisionAdminController.addCommision);
router.post('/backend/addPostCommision', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CommisionAdminController.addPostCommision);
router.get('/backend/editCommision/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CommisionAdminController.editCommision);
router.post('/backend/editPostCommision', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CommisionAdminController.editPostCommision);
router.get('/backend/deleteCommision/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CommisionAdminController.deleteCommision);
// commision code

//customer
router.get('/backend/customer', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.UserController.users);
router.get('/backend/getCustomer', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.UserController.getUser);
router.get('/backend/userEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.UserController.editUser);
router.post('/backend/addCustomUser', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.UserController.editUserPostData);
router.post('/backend/addCustomUser/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.UserController.editUserPostData);
router.post('/backend/getUserDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.UserController.getUserDelete);

//Start of TERM & CONDITION routes
router.get('/backend/term', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.term);
router.get('/backend/getTerm', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.getTerm);
router.get('/backend/addTermData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.termAdd);
router.post('/backend/addTermData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.termAddPost);
router.get('/backend/editTermData/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.termUpdate);
router.post('/backend/editTermData/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.termUpdatePost);
router.post('/backend/term/getTermDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.getTermDelete);
// End of TERM & CONDITION routes

//Start of PRIVACY POLICY routes
router.get('/backend/privacy', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.privacy);
router.get('/backend/getPrivacy', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.getPrivacy);
router.get('/backend/addPrivacyData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.privacyAdd);
router.post('/backend/addPrivacyData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.privacyAddPost);
router.get('/backend/editPrivacyData/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.privacyUpdate);
router.post('/backend/editPrivacyData/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.privacyUpdatePost);
router.post('/backend/privacy/getPrivacyDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.getPrivacyDelete);
// End of PRIVACY POLICY routes



router.get('/backend/add_attribute', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.add_attribute);
router.post('/backend/add_attribute', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.add_post_attribute);
router.get('/backend/add_attribute/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.add_attribute);
router.get('/backend/delete_attribute/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.delete_attribute);
router.get('/backend/get_attribute', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.get_attribute);
router.get('/backend/list_attribute', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.list_attribute);

//question


router.get('/backend/question_form', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.question_form);
router.get('/backend/add_question', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.add_question);
router.post('/backend/add_question', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.add_post_question);
router.get('/backend/add_question/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.add_question);
router.get('/backend/delete_question/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.delete_question);
router.get('/backend/get_question', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.get_question);

//question


//report 

router.get('/backend/report', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ReportAdminController.listReport);
router.get('/backend/getReport', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ReportAdminController.getReport);
router.post('/backend/getReportByDate', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ReportAdminController.getReportByDate);
router.get('/backend/getReport/:startDate/:endDate', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ReportAdminController.getReport);




//report

// commision report

router.get('/backend/commision/report', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ReportAdminController.listCommisionReport);
router.get('/backend/commision/getReport', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ReportAdminController.getCommisionReport);
router.post('/backend/commision/getReportByDate', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ReportAdminController.getCommisionReportByDate);
router.get('/backend/commision/getReport/:startDate/:endDate', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ReportAdminController.getCommisionReport);



// commision report 

// admin report start

router.get('/backend/getReportvendor', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ReportAdminController.getReportvendor);
router.get('/backend/getReportList/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ReportAdminController.getReportList);
router.get('/backend/reportOrderDetails/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ReportAdminController.reportOrderDetails);
router.get('/backend/getReportList/:startDate/:endDate/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ReportAdminController.getReportList);


// admin report end


//Order Management start

router.get('/backend/order', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OrderAdminController.listOrder);
router.get('/backend/getOrder', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OrderAdminController.getOrder);
router.get('/backend/orderDetails/:id/:vendorId', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OrderAdminController.editOrder);
router.get('/backend/orderDetails/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OrderAdminController.editOrder);
router.get('/backend/question_Show/:id/:orderId', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OrderAdminController.question_Form);
router.get('/backend/getOrder/:startDate/:endDate', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OrderAdminController.getOrder);
router.post('/backend/orderStatus', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OrderAdminController.orderStatus);


router.get('/backend/genrate_e_invoice/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OrderAdminController.genrate_e_invoice);
router.get('/backend/genrate_e_way_bill/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OrderAdminController.genrate_e_way_bill);

// router.post('/backend/orderEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductAdminController.editOrderPostData);


//Order Management end


// admin  Order Management start
router.get('/backend/adminOrderDetails', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OrderAdminController.getAdminOrderDetails);
router.get('/backend/getAdminOrder', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OrderAdminController.getAdminOrder);
router.get('/backend/adminOrderDetails/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OrderAdminController.adminOrderDetails);

router.get('/backend/getAdmindataOrder/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OrderAdminController.getAdmindataOrder);

// admin  Order Management end


// //Start of project routes
router.get('/backend/home', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.list);

router.get('/backend/getHome', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.getApplication);

router.post('/backend/homeDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.applicationDelete);


// router.get('/backend/categorylist',  Sys.App.Controllers.ApplicationController.category);
router.get('/backend/project', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.list);

router.get('/backend/getProject', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.getProject);

router.post('/backend/projectDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.projectDelete);

router.get('/backend/projectImageDelete/:id/:deleteid', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.projectImageDelete);

router.get('/backend/addHome', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.addProject);

router.post('/backend/addHome', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.postProject);

router.get('/backend/homeEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.editProject);

router.post('/backend/homeEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.editProjectPostData);
 //End of project Routes


 router.get('/backend/projectSingleImageDelete/:id/:mainid', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.projectSingleImageDelete);

module.exports = router
