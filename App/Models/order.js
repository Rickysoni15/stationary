const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrderSchema = new Schema({
  product_id: {
    type: 'string',
    // required: true
  },
  customer_id: {
    type: 'string',
  },
  product_status: {
    type: 'string',
    default: 'pending'
  },
  vendorId: {
    type: 'string',
    default: '0'
  },
  order_id: {
    type: 'string',
    default: '0'
  },
  product_quantity: {
    type: 'string',
    default: '0'
  },
  product_weight: {
    type: 'string',
    default: '0'
  },
  is_discount: {
    type: 'string',
    default: '0'
  },  
  discount_start: {
    type: 'string',
    default: '0'
  },  
  discount_value: {
    type: 'string',
    default: '0'
  },  
  product_name: {
    type: 'string',
    default: '0'
  },  
  product_price: {
    type: 'string',
    default: '0'
  },
  shipping_charge: {
    type: 'string',
    default: '0'
  },
  product_price: {
    type: 'string',
    default: "0"
  },
  customer_addresId: {
    type: 'string',
    default: "0"
  },
  shiprocket_orderid: {
    type: 'string',
  },
  product_basic_price: {
    type: 'string',
    default: "0"
  },
  base_amount: {
    type: 'string',
    default: "0"
  },

  withTax_amount: {
    type: 'string',
    default: "0"
  },

  withoutTax_amount: {
    type: 'string',
    default: "0"
  },

  tax_amount: {
    type: 'string',
    default: "0"
  },

  tax_percentage: {
    type: 'string',
    default: "0"
  },

  tax_type: {
    type: 'string',
    default: "0"
  },

  cgst: {
    type: 'string',
    default: "0"
  },

  sgst: {
    type: 'string',
    default: "0"
  },

  igst: {
    type: 'string',
    default: "0"
  },

  cgst_percentage: {
    type: 'string',
    default: "0"
  },

  sgst_percentage: {
    type: 'string',
    default: "0"
  },

  igst_percentage: {
    type: 'string',
    default: "0"
  },
  question_form: {
    type: 'array',
    default: []
  },

  pickup_order: {
    type: 'string',
    default: 'false'
  },

  order_type: {
    type: 'string',
    default: "Online"
  },
  payment_status: {
    type: 'string',
    default: null
  },
  order_status: {
    type: 'string',
    default: null
  },

  is_deleted: {
    type: String,
    enum: ['1', '0'],
    default: '0'
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
}, { collection: 'order' });
mongoose.model('order', OrderSchema);
