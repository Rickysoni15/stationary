const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PaymentSchema = new Schema({
  product_id: {
    type: 'string',
    // required: true
  },
  customer_id: {
    type: 'string',
  },
  transaction_id: {
    type: 'string',
    default: null
  },
  order_id: {
    type: 'string',
    default: null
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
  entity: {
    type: 'string',
  },
  amount: {
    type: 'string',
  },
  amount_paid: {
    type: 'string',
  },
  amount_due: {
    type: 'string',
  },
  currency: {
    type: 'string',
  },
  receipt: {
    type: 'string',
  },
  offer_id: {
    type: 'string',
  },
  status: {
    type: 'string',
    default: 'pending'
  },
  pickup_order: {
    type: 'string',
    default: 'false'
  },
  attempts: {
    type: 'string',
  },
  payment_details: {
    type: 'array',
    default: [],
  },
  product_id: {
    type: 'array',
    default: [],
  },
  product_info: {
    type: 'array',
    default: [],
  },
  product_invoice: {
    type: 'array',
    default: []
  },
  invoice_id: {
    type: 'string',
  },
  customer_Address : {
    type : 'array',
    default : [],
  },
  shiprocket_orderid: {
    type: 'string',
  },
  shiprocket_order_create : {
    type : 'array',
    default : [],
  },
  shiprocket_courier_assign : {
    type : 'array',
    default : [],
  },
  shiprocket_generate_pickup : {
    type : 'array',
    default : [],
  },
  e_invoice_success: {
    type: 'array',
    default: []
  },
  e_invoice_error: {
    type: 'array',
    default: []
  },
  e_invoice_flag: {
    type: 'string',
    default: 'false'
  },
  qrCodeImage: {
    type: 'string',
  },
  irn: {
    type: 'string',
  },
  ackNo: {
    type: 'string',
  },
  e_way_bill_success: {
    type: 'array',
    default: []
  },
  e_way_bill_error: {
    type: 'array',
    default: []
  },
  e_way_bill_flag: {
    type: 'string',
    default: 'false'
  },
  e_invoiceRequestDetail: {
    type: 'array',
    default: []
  },
  ewbNo: {
    type: 'string',
    default: 'false'
  },
  ewbDate: {
    type: 'string',
    default: 'false'
  },
  ewbValidTill: {
    type: 'string',
    default: 'false'
  },
  ewbDetails: {
    type: 'array',
    default: []
  },
  eWayBillRequestDetail: {
    type: 'array',
    default: []
  },
  is_coupon: {
    type: 'string',
    default: 'false'
  },
  coupon_name: {
    type: 'string',
  },
  coupon_amount: {
    type: 'string',
  },
  coupon_id: {
    type: 'string',
  },
  coupon_type: {
    type: 'string',
  },
  shiprocket_shipmentId: {
    type: 'string',
  },
  shiprocket_orderId: {
    type: 'string',
  },
  shiprocket_order_label: {
    type: 'string',
  },
  shiprocket_awb_code: {
    type: 'string',
  },
  track_order_data: {
    type : 'array',
    default : [],
  },
  shipping_charge: {
    type: 'string',
    default: '0'
  },
  pickup_order: {
    type: 'string',
    default: 'false'
  },
  order_type: {
    type: 'string',
    default: null
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
}, { collection: 'payment' });
mongoose.model('payment', PaymentSchema);
