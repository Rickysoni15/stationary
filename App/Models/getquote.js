const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const getquoteSchema = new Schema({

	
	name: {
		type: 'string',
		required: true
	},
	company:{
		type:'string',
		required: true,
	},
	email:{
		type:'string',
		required: true,
	},

    location: {
        type: 'string',
        required: true
    },

	head: {
		type: 'string',
		required: true
	},
	capacity: {
		type: 'string',
		required: true
	},
	specificGravity: {
		type: 'string',
		required: true
	},
	fluid: {
		type: 'string',
		required: true
	},
	message: {
		type: 'string',
		required: true
	},
    is_deleted:{
		type: String,
		enum:['1','0'],
		default: '0'
	},



    createdAt : { type: Date, default: Date.now() },
	updatedAt : { type: Date, default: Date.now() },

},{ collection: 'getquote',versionKey: false });
mongoose.model('getquote', getquoteSchema);
