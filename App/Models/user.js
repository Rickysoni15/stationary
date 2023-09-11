const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: {
    type: 'string',
    // required: true
  },
  firstName: {
    type: 'string',
  },
  lastName: {
    type: 'string',
  },
  email: {
    type: 'string',
    required: true
  },
  mobile: {
    type: 'string',
    required: true
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
  password: {
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
  wishlist_arr:{
    type:Array,
    default:[]
  }
}, { collection: 'user' });
mongoose.model('user', UserSchema);
