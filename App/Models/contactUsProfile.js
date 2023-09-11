const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const profiletypeSchema = new Schema({
	
	profiletype: {
		type: 'string',
		required: true
	},

	
	
	createdAt : { type: Date, default: Date.now() },
	updatedAt : { type: Date, default: Date.now() },
	
},{ collection: 'profiletype' });
mongoose.model('profiletype', profiletypeSchema);
