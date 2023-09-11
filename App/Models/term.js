const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const termSchema = new Schema({
	
	// heading: {
	// 	type: 'string',
	// 	// required: true
	// },

	introduction: {
		type: 'string',
		// required: true
	},
	// ourFacts: {
	// 	type: 'string',
	// 	required: true
	// },
	// yearsExperience: {
	// 	type: 'number',
	// 	// required: true
	// },
	// yearlyProduction: {
	// 	type: 'number',
	// 	// required: true
	// },
	// clients: {
	// 	type: 'number',
	// 	// required: true
	// },
	// ourValues: {
	// 	type: 'string',
	// 	// required: true
	// },
	// ourMission: {
	// 	type: 'string',
	// 	// required: true
	// },
	// about_image: {
	// 	type: 'string',
	// 	// required: true
	// },

	//For Uploading Image 1
	// image: {
	// 	type: 'string',
	// 	required: true
	// },
	// name_1:{
	// 	type: 'string',
	// 	required: true
	// },

	// role_1:{
	// 	type: 'string',
	// 	required: true
	// },

	// description_1:{
	// 	type: 'string',
	// 	required: true
	// },
	
	createdAt : { type: Date, default: Date.now() },
	updatedAt : { type: Date, default: Date.now() },
	
},{ collection: 'term' });
mongoose.model('term', termSchema);
