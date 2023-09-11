'use strict';

var express = require('express'),
    router = express.Router();
var Sys = require('../../Boot/Sys');

const passport = require('passport');
require('../Controllers/passportLocal')(passport);
require('../Controllers/googleAuth')(passport);

router.use(express.json())

// function checkAuth(req, res, next) {
//     if (req.isAuthenticated()) {
//         res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
//         console.log("iff");
        
//         next();
//     } else {
//         req.flash('error', "Please Login to continue !");
//         console.log("e;see");

//         res.redirect('/user_login');
//     }
// }
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email',] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/user_login' }), async (req, res) => {
    console.log("req.usererererse",req.user);
    req.session.login = true;
    req.session.details = {
    firstname: req.user.username,
    // lastname: user.lastname,
    id: req.user._id,
    // name: user.user_company,
    //   jwt_token: token,
    // avatar: 'user.png',
    //   is_admin: 'yes',
    role: req.user.role,
    // avatar: req.user.avatar_path
    // chips: vendor[0].chips,
    };
    console.log("Login successfully",req.session.details);
    console.log("Login successfully",req.session.login);
    req.flash('success', 'Login successfully');
    await req.session.save(async function (err) {
      // session saved
      console.log('session saved');
      return res.redirect('/');
    });
});

// router.get('/home', checkAuth, async (req, res) => {
//     // adding a new parameter for checking verification
//     console.log("req home",req.session.passport);
//     console.log("req home",req.session.passport.user);
//     var user = await Sys.App.Services.CustomerServices.getSingleUserData({ email: req.session.passport.user });
//     console.log("hhhoo",user);
//     req.session.login = true;
//     req.session.details = {
//     firstname: user.username,
//     // lastname: user.lastname,
//     id: user._id,
//     // name: user.user_company,
//     //   jwt_token: token,
//     avatar: 'user.png',
//     //   is_admin: 'yes',
//     role: user.role,
//     avatar: user.avatar_path
//     // chips: vendor[0].chips,
//     };
//     console.log("Login successfully",req.session.details);
//     console.log("Login successfully",req.session.login);
//     req.flash('success', 'Login successfully');
//     await req.session.save(async function (err) {
//       // session saved
//       console.log('session saved');
//       return res.redirect('/');
//     });
//     // res.render('profile', { username: req.user.username, verified : req.user.isVerified });

// });

// Load Controllers
//var mycont = require('../controllers/mycontroller');


router.get('/home', Sys.App.Controllers.HomeController.home);
router.get('/user_login', Sys.App.Controllers.HomeController.vendor_Login);
router.post('/register__User', Sys.App.Controllers.UserController.addUserPostData);
router.get('/register_User', Sys.App.Controllers.UserController.register);

router.get('/login', Sys.App.Controllers.UserController.login);
router.post('/login_User', Sys.App.Controllers.UserController.loginPost_user);

router.get('/verify_use_email/:id', Sys.App.Controllers.UserController.verify_use_email);

// router.post('/loginPost__vendor',Sys.App.Middlewares.Backend.loginCheck, Sys.App.Controllers.HomeController.loginPost_vendor);
router.post('/loginPost__vendor', Sys.App.Controllers.VendorProfileController.loginPost_vendor);
router.get('/login_vendor', Sys.App.Controllers.HomeController.login_vendor);
router.get('/aboutus', Sys.App.Controllers.HomeController.aboutus);
router.get('/privacypolicy', Sys.App.Controllers.HomeController.privacypolicy);
router.get('/termsconditions', Sys.App.Controllers.HomeController.termsconditions);

//products start
router.get('/products', Sys.App.Controllers.ProductController.products);

router.get('/quickView', Sys.App.Controllers.ProductController.quickView);

// Order functionality Route

router.post('/confirmOrder', Sys.App.Controllers.OrderController.confirmOrder);

router.get('/orderHistory',Sys.App.Controllers.OrderController.orderHistory );

router.get('/orderInformation/:id',Sys.App.Controllers.OrderController.orderInformation );






router.get('/products/:id',Sys.App.Controllers.ProductController.mainProduct);

router.get('/products/subProducts/:id',Sys.App.Controllers.ProductController.subProductDetail);




// router.get('/backend/publication/getPublication', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.PublicationController.getPublication);
// router.get('/getProducts', Sys.App.Controllers.ProductController.getProducts);













router.get('/products/:id/:name', Sys.App.Controllers.ProductController.products);
router.get('/productsfilter/:id/:name/:value', Sys.App.Controllers.ProductController.products);
router.post('/filterData', Sys.App.Controllers.ProductController.products);


router.get('/productsModel/:id', Sys.App.Controllers.ProductController.productsModel);
router.get('/productDetails/:id/:name', Sys.App.Controllers.ProductController.productDetails);
// router.get('/productDetails/:id', Sys.App.Controllers.ProductController.productDetails);
router.get('/gridproducts', Sys.App.Controllers.ProductController.gridproducts);
router.get('/listproducts', Sys.App.Controllers.ProductController.listproducts);
router.get('/productCategoryDetails/:id', Sys.App.Controllers.ProductController.productCategoryDetails);
router.get('/separateproductcategory/:id', Sys.App.Controllers.ProductController.separateproductcategory);
//product end

router.get('/shoppingcart', Sys.App.Controllers.ProductController.shoppingcart);
router.get('/checkout', Sys.App.Controllers.ProductController.checkout);
router.post('/produtQuantity', Sys.App.Controllers.ProductController.produtQuantity);

router.post('/updateOrder', Sys.App.Controllers.ProductController.updateOrder);
router.get('/contact', Sys.App.Controllers.HomeController.contact);

// router.get('/privacyPolicy',Sys.App.Controllers.HomeController.privacyPolicy);

router.get('/deliveryInformation', Sys.App.Controllers.HomeController.deliveryInformation);


router.get('/myAccount', Sys.App.Controllers.HomeController.myAccount);

router.get('/getAccountInformation', Sys.App.Controllers.HomeController.getAccountInformation);

router.post('/editAccountInfromation', Sys.App.Controllers.HomeController.editAccountInfromation)





router.get('/getAddressBook', Sys.App.Controllers.HomeController.getAddressBook);

router.get('/addressBook', Sys.App.Controllers.HomeController.addressBook)

router.post('/addAddressBook', Sys.App.Controllers.HomeController.addAddressBook)

router.get('/editAddress/:id', Sys.App.Controllers.HomeController.editAddress)

router.post('/savetEditAddress/:id', Sys.App.Controllers.HomeController.savetEditAddress)

router.get('/deleteAddress/:id', Sys.App.Controllers.HomeController.deleteAddress)

router.get('/changePassword', Sys.App.Controllers.HomeController.changePassword)

router.post('/saveChangePassword', Sys.App.Controllers.HomeController.saveChangePassword)







router.get('/formData', Sys.App.Controllers.HomeController.formData);
router.post('/formData', Sys.App.Controllers.HomeController.postFormData);
router.post('/getGuote', Sys.App.Controllers.GetquoteController.postApplication);
router.post('/contactUs', Sys.App.Controllers.ContactUsController.postApplication);

// vendor start
router.post('/registerVendor', Sys.App.Controllers.VendorProfileController.registerVendor);
router.post('/validationGst', Sys.App.Controllers.VendorProfileController.gstValidation);
 

router.get('/frontend/logout', Sys.App.Controllers.UserController.logout);
router.get('/customer_profile', Sys.App.Controllers.HomeController.customer_profile);
router.post('/customer_profile_post', Sys.App.Controllers.HomeController.customer_profile_post);


router.get('/customer_address', Sys.App.Controllers.HomeController.customer_address);
router.post('/customer_address_post', Sys.App.Controllers.HomeController.customer_address_post);

router.get('/customer_edit_address/:id', Sys.App.Controllers.HomeController.customer_edit_address);
router.post('/customer_remove_address', Sys.App.Controllers.HomeController.customer_remove_address);
router.post('/customer_edit_address_post', Sys.App.Controllers.HomeController.customer_edit_address_post);
router.get('/close_account', Sys.App.Controllers.HomeController.close_account);
router.post('/close_account_post', Sys.App.Controllers.HomeController.close_account_post);


router.post('/wishlist_call', Sys.App.Controllers.ProductController.wishlist_call);
router.get('/wishlist', Sys.App.Controllers.ProductController.wishlist_get);
router.post('/wishlist_remove', Sys.App.Controllers.ProductController.wishlist_remove);


router.post('/contactMail', Sys.App.Controllers.ContactUsController.postApplication);

router.post('/review_post', Sys.App.Controllers.ProductController.review_post);

router.post('/addtocart_get', Sys.App.Controllers.ProductController.addtocart_get);
router.post('/addtocart_call', Sys.App.Controllers.ProductController.addtocart_call);
router.post('/addtocart_remove', Sys.App.Controllers.ProductController.addtocart_remove);
router.post('/product_quantity', Sys.App.Controllers.ProductController.product_quantity);

router.get('/verify_otp/:id/:otp', Sys.App.Controllers.UserController.verify_otp);
router.post('/verify_otp_post', Sys.App.Controllers.UserController.verify_otp_post);
router.post('/set_password_post', Sys.App.Controllers.UserController.set_password_post);
router.get('/set_password', Sys.App.Controllers.UserController.set_password);

router.post('/forgot_User', Sys.App.Controllers.UserController.forgotPost_user);
router.get('/forgot', Sys.App.Controllers.UserController.forgot_otp);
router.get('/forgot_password', Sys.App.Controllers.UserController.forgot_password);

router.get('/vendor_verify_otp/:id/:otp', Sys.App.Controllers.VendorProfileController.verify_otp);
router.post('/vendor_verify_otp_post', Sys.App.Controllers.VendorProfileController.verify_otp_post);
router.post('/vendor_set_password_post', Sys.App.Controllers.VendorProfileController.set_password_post);
router.get('/vendor_set_password', Sys.App.Controllers.VendorProfileController.set_password);



router.post('/vendorforgot_User', Sys.App.Controllers.VendorProfileController.forgotPost_user);
router.get('/vendorforgot', Sys.App.Controllers.VendorProfileController.forgot_otp);
router.get('/vendorforgot_password', Sys.App.Controllers.VendorProfileController.forgot_password);

// payment route start
router.get('/payments', Sys.App.Controllers.ProductController.payments);
router.post('/api/payment/order', Sys.App.Controllers.ProductController.payments_order);
// router.get('/payment_verify/:razorpay_order_id/:razorpay_payment_id/:razorpay_signature/:product_id', Sys.App.Controllers.ProductController.payments_verify);
router.post('/payment_verify', Sys.App.Controllers.ProductController.payments_verify);
router.get('/paymentmsg/:orderid', Sys.App.Controllers.ProductController.paymentmsg);
router.get('/paymentfail', Sys.App.Controllers.ProductController.paymentfail);

// payment route end


router.get('/otp_verify', Sys.App.Controllers.UserController.otp_verify);
router.get('/otp_verify/:id', Sys.App.Controllers.UserController.otp_verify);
router.post('/login_User_otp', Sys.App.Controllers.UserController.loginPost_user_otp);
router.post('/userlogin_otp_post', Sys.App.Controllers.UserController.userlogin_otp_post);


router.post('/default_address', Sys.App.Controllers.HomeController.default_address);


router.post('/productGst', Sys.App.Controllers.ProductController.productGst);

router.get('/order_data', Sys.App.Controllers.ProductController.order_data);

router.get('/orders_list', Sys.App.Controllers.ProductController.orders_list);

router.post('/ordersFilter', Sys.App.Controllers.ProductController.ordersFilter);




module.exports = router
