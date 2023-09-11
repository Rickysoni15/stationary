const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrderSchema = new Schema({
 
  customer_id: {
    type: 'string',
  },
  orderNumber: {
    type: Number,
    default: 0
  },
  order_status: {
    type: 'string',
    default: 'pending'
  },
  products:{
    type:Array,
    default:[]
  },
  billing_address: {
    type: Array,
    default : []
  },
  delivery_address: {
    type: Array,
    default : []
  },
  delivery_method: {
    type: Array,
    default : []
  },
  payment_method: {
    type: Array,
    default : []
  },
  subTotal: {
    type: 'string',
    default: "0"
  },
  shipping_charge: {
    type: 'string',
    default: '0'
  },
  taxTotal: {
    type: 'string',
    default: "0"
  },
  grandTotal: {
    type: 'string',
    default: "0"
  },
  createdDate:{
    type:'string',
    default:""
  },



  shipping_detail: {
    type: Array,
    default : []
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
  
  
  shiprocket_orderid: {
    type: 'string',
  },
  
  base_amount: {
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
  
  payment_status: {
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
}, { collection: 'orderHistory' });
mongoose.model('orderHistory', OrderSchema);
