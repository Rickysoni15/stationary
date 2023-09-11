const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const couponcodeSchema = new Schema({

	couponcode: {
		type: 'string',
		// required: true
	},
	couponcode_startdate: {
		type: 'string',
		// required: true
	},
    discount_amount: {
        type: 'string',
		// required: true
    },
    couponcode_text: {
        type: 'string',
    },
	couponcode_enddate: {
		type: 'string',
		default: '',
		//required: true
	},
	couponcode_type: {
		type: 'string',
		// required: true
	},
    is_expire: {
        type: 'string',
        default: 'false'
    },
    is_deleted: {
        type: 'string',
        default: '0'
    },
	createdAt: { type: Date, default: Date.now() },
	updatedAt: { type: Date, default: Date.now() },

}, { collection: 'couponcode', versionKey: false });
mongoose.model('couponcode', couponcodeSchema);
