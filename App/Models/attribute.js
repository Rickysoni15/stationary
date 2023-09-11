const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const attributeSchema = new Schema({
    name: {
		type: 'string',
		default: '',
    },
    subname: {
        type: 'string',
		default: '',
    },
    value: {
        type: 'string',
		default: '',
    },
	product_id:{
        type:'string',
        default:null
    },
    vendor_id:{
        type:'string',
        default:null
    },
    group_id:{
        type:'string',
        default:null
    },
    groupname:{
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

},{ collection: 'attribute',versionKey: false });
mongoose.model('attribute', attributeSchema);