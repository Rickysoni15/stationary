const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const vendorSchema = new Schema({

	vendor_first_name: {
		type: 'string',
		// required: true
	},

	vendor_last_name: {
		type: 'string',
		// required: true
	},

	vendor_username: {
		type: 'string',
		default: '',
		//required: true
	},

	vendor_company: {
		type: 'string',
		// required: true
	},

	vendor_image: {
		type: 'array',
		default: [],
		required: true
		// type: 'string',
		// default: '',
		//required: true
	},

	otp: {
		type: 'string'
	},

	// kyc_image: {
	// 	type: 'string',
	// 	default: '',
	// 	// required: true
	// },

	kyc_image: {
		type: 'array',
		default: [],
		required: true
	},

	pan_image: {
		type: 'array',
		default: [],
		required: true
	},


	vendor_contactinformation: {
		type: 'array',
		default: [],
		//required: true
	},

	vendor_bankinfo: {
		type: 'array',
		default: [],
		//required: true
	},

	vendor_pan_no: {
		type: 'string',
		default: '',
		// required: true
	},

	vendor_address :{
		type: 'string',
		default: '',
	},

	vendor_Gstcode :{
		type: 'string',
		default: '',
	},

	vendor_gst_no: {
		type: 'string',
		// required: true
	},

	vendor_id: {
		type: 'string',
		default: '',
		//required: true
	},

	vendor_tax: {
		type: 'array',
		default: [],
		// required: true
	},

	vendor_term_condition: {
		type: 'string',
		default: '',
		// required: true
	},

	vendor_email: {
		type: 'string',
		default: '',
	},

	vendor_phone: {
		type: 'string',
		default: '',
	},

	vendor_password: {
		type: 'string',
		default: '',
	},

	vendor_totalSale: {
		type: 'number',
		default: 0,
	},

	vendor_commission: {
		type: 'string',
		default: '',
	},


	vendor_pin :{
		type: 'string',
		default: null,
	},

	vendor_flatNo :{
		type: 'string',
		default: null,
	},

	vendor_area :{
		type: 'string',
		default: null,
	},

	vendor_Landmark :{
		type: 'string',
		default: null,
	},

	vendor_town:{
		type: 'string',
		default: null,
	},

	vendor_state :{
		type: 'string',
		default: null,
	},
	pickup_address_lable :{
		type: 'string',
		default: null,
	},

	pickup_address :{
		type: 'array',
		default: [],
	},


	account_id: {
		type: 'string',
		default: null,
	},
	role: {
		type: 'string',
		default: 'vendor',
	},

	status: {
		type: 'string',
		default: 'active'
	},

	is_login: {
		type: String,
		enum: ['1', '0'],
		default: '0'
	},
	is_gst: {
		type: String,
		enum: ['1', '0'],
		default: '0'
	},
	is_deleted: {
		type: String,
		enum: ['1', '0'],
		default: '0'
	},

	vendorApproval: {
		type: Boolean,
		default: false
	},

	emailVerified: {
		type: Boolean,
		default: false
	},

	createdAt: { type: Date, default: Date.now() },
	updatedAt: { type: Date, default: Date.now() },

}, { collection: 'vendor', versionKey: false });
mongoose.model('vendor', vendorSchema);
