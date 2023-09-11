const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CustomerSchema = new Schema({
  name: {
    type: 'string',
    // required: true
  },
  userName: {
    type: 'string',
  },
  username: {
    type: 'string',
  },
  firstname: {
    type: 'string',
    default: ""
  },
  lastname: {
    type: 'string',
    default: ""
  },
  email: {
    type: 'string',
    required: true
  },
  mobile: {
    type: 'string',
    // required: true
  },
  role: { //admin, affiliate, user
    type: 'string',
    default: 'user'
    // required: true
  },
  user_gst_no: {
    type: 'string',
    // required: true
  },
  state_code: {
    type: 'string',
  },
  user_gst_companyName: {
    type: 'string',
  },
  password: {
    type: 'string',
    // required: true
  },
  password_string: {
    type: 'string',
    // required: true
  },
  googleId: {
    type: 'string',
    // required: true
  },
  provider: {
    type: 'string',
    // required: true
  },
  avatar: {
    type: 'string'
  },
  status: {
    type: 'string',
    defaultsTo: 'active'
  },
  resetPasswordToken: {
    type: 'string',
  },
  resetPasswordExpires: {
    type: 'string',
  },
  status: {
    type: 'string',
    default: 'active'
  },
  affiliateCode: {
    type: 'string',
    default: ''
  },
  parentAffiliateCode: {
    type: 'string',
    default: ''
  },
  parentAffiliateId: {
    type: 'string',
    default: ''
  },
  isSignupCompleted: {
    type: 'boolean',
    default: false
  },
  isMobileVerified: {
    type: 'boolean',
    default: false
  },
  otp: {
    type: 'string'
  },
  resetPassword: {
    type: 'boolean',
    default: false
  },
  is_deleted: {
    type: String,
    enum: ['1', '0'],
    default: '0'
  },

  is_login: {
    type: String,
    enum: ['1', '0'],
    default: '0'
  },

  address_arr: {
    type: [],
    default : null
  },

  coupon_arr: {
    type: [],
    default : null
  },

  wishlist_arr: {
    type: [],
    default : null
  },
  
  close_reason: {
    type:'string',
    default:null
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
}, { collection: 'customer' });
mongoose.model('customer', CustomerSchema);
