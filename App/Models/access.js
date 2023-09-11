const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const accessSchema = new Schema({

	userId: {
		type: 'string',
		required: true
	},
	studentList: {
		type: 'string',
		default: false
	},
	affiliateList: {
		type: 'string',
		default: false
	},
	courseManagement: {
		type: 'string',
		default: false
	},
	instructorRequest: {
		type: 'string',
		default: false
	},
	studentApplicationRequest: {
		type: 'string',
		default: false
	},
	coursePaymentRequest: {
		type: 'string',
		default: false
	},
	blog: {
		type: 'string',
		default: false
	},

	createdAt : { type: Date, default: Date.now() },
	updatedAt : { type: Date, default: Date.now() },

},{ collection: 'access',versionKey: false  });
mongoose.model('access', accessSchema);
