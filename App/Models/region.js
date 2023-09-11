
	const mongoose = require('mongoose');
	const Schema = mongoose.Schema;
	const regionSchema = new Schema({

		regionName: {
			type: 'string',
			required: true
		},

        address: {
            type: [String],
            default: []
            // required: true
        },
        
        phone: {
            type: [String],
            default: []
            // required: true
        },
        
        email: {
            type: [String],
            default: []
            // required: true
        },

		// profiletype: {
        //     type: [String],
        //     default: []
        //     // required: true
        // },



		is_deleted:{
			type: String,
			enum:['1','0'],
			default: '0'
		},

		createdAt : { type: Date, default: Date.now() },
		updatedAt : { type: Date, default: Date.now() },

	},{ collection: 'region',versionKey: false });
	mongoose.model('region', regionSchema);
