
	const mongoose = require('mongoose');
	const Schema = mongoose.Schema;
	const categorySchema = new Schema({

		categoryName: {
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

	},{ collection: 'category',versionKey: false });
	mongoose.model('category', categorySchema);
