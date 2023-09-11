const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contactUsSchema = new Schema({

	name: {
		type: 'string',
		required: true
	},
	
	email:{
		type:'string',
		required: true,
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

},{ collection: 'contactus',versionKey: false });
mongoose.model('contactus', contactUsSchema);
