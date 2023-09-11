const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const menuSchema = new Schema({
	menu_name: {
		type: 'string',
		required: true
	},
    name: {
		type: 'string',
		required: true
	},
    set_array: {
		type: 'array',
		default: [],
    },
	// account_id:{
    //     type:'string',
    //     default:null
    // },
    is_deleted:{
		type: String,
		enum:['1','0'],
		default: '0'
	},
    createdAt : { type: Date, default: Date.now() },
	updatedAt : { type: Date, default: Date.now() },

},{ collection: 'menu',versionKey: false });
mongoose.model('menu', menuSchema);
