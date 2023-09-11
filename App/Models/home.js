const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const homeSchema = new Schema({

	
	coverfiles: {
        type: 'array',
        default: [],
    },
	home_image1:{
		type:'string',
		default:''
	},
	home_image2:{
		type:'string',
		default:''
	},
    home_image3: {
        type: 'string',
        default:''
    },
	home_image4: {
		type: 'string',
		default:''
	},
    home_image5: {
		type: 'string',
		default:''
	},
    home_image6: {
		type: 'string',
		default:''
	},
    is_deleted:{
		type: String,
		enum:['1','0'],
		default: '0'
	},



    createdAt : { type: Date, default: Date.now() },
	updatedAt : { type: Date, default: Date.now() },

},{ collection: 'home',versionKey: false });
mongoose.model('home', homeSchema);
