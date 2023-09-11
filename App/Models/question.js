const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const questionSchema = new Schema({
    name: {
		type: 'string',
		default: '',
    },
    type: {
		type: 'string',
		default: '',
    },
    value: {
		type: 'string',
		default: '',
    },
    checkbox_name_one: {
        type: 'string',
		default: '',
    },
    checkbox_name_two: {
        type: 'string',
		default: '',
    },
	product_id:{
        type:'string',
        default:null
    },
    customer_id:{
        type:'string',
        default:null
    },
    vendor_id:{
        type:'string',
        default:null
    },
    is_deleted:{
		type: String,
		enum:['1','0'],
		default: '0'
	},
    createdAt : { type: Date, default: Date.now() },
	updatedAt : { type: Date, default: Date.now() },

},{ collection: 'question',versionKey: false, strict: false });
mongoose.model('question', questionSchema);
