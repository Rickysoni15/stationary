const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ReviewSchema = new Schema({
  product_id: {
    type: 'string',
    // required: true
  },
  customer_id: {
    type: 'string',
  },
  customer_img: {
    type: 'string',
  },
  customer_email:{

    type: 'string',
  },
  customer_name: {
    type: 'string',
  },
  comment: {
    type: 'string',
    // required: true
  },
  rating: {
    type: 'string',
    // required: true
  },
  rating_num: {
    type: 'string',
  },
  rating_no: {
    type: 'string',
  },
  review_date: {
    type: 'string',
  },
  is_deleted: {
    type: String,
    enum: ['1', '0'],
    default: '0'
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
}, { collection: 'review' });
mongoose.model('review', ReviewSchema);
