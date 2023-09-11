const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commisionSchema = new Schema({

	commision: {
		type: 'string',
		// required: true
	},
    is_deleted: {
        type: 'string',
        default: '0'
    },
	createdAt: { type: Date, default: Date.now() },
	updatedAt: { type: Date, default: Date.now() },

}, { collection: 'commision', versionKey: false });
mongoose.model('commision', commisionSchema);
