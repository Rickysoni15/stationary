
	const mongoose = require('mongoose');
	const Schema = mongoose.Schema;
	const productCategorySchema = new Schema({

		productCategoryName: {
			type: 'string',
			required: true
		},

		category_name: {
			type: 'string',
			// required: true
		},

		account_id:{
			type:'string',
			default:null
		},

		is_deleted:{
			type: String,
			enum:['1','0'],
			default: '0'
		},

        main_productId: {
            type: 'string',
            default: null
        },

        main_sub_productId: {
            type: 'string',
            default: null
        },
        
        is_separateCategory: {
            type: 'string',
            default: false
        },

		product_name: {
			type: 'string'
		},
	
		product_image: {
			type: 'string'
		},
	
		product_description: {
			type: 'string'
		},
		
		pdf_heading: {
			type: 'string',
		
		},
		
		product_pdf: {
			type: 'array',
			default: [],
		},

		
		workProcess: {
			type: 'array',
			default: [],
		},

	

        // is_separateCategory: {
        //     type: String,
        //     enum:['1', '0'],
        //     default: '0'
        // },

		createdAt : { type: Date, default: Date.now() },
		updatedAt : { type: Date, default: Date.now() },

	},{ collection: 'productCategory',versionKey: false });
	mongoose.model('productCategory', productCategorySchema);
