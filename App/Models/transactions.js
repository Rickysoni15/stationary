const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TransactionSchema = new Schema({
    userId: { type: 'string', required: true },
    userName: { type: 'string', required: true },
    courseId: {
        type: 'string',
        required: true
    },
    courseName: {
        type: 'string',
        required: true
    },
    collegeName: {
        type: 'string',
        required: true
    },
    amount: {
        type: 'string',
        required: true
    },
    type: { // application_fee, course_fee,
        type: 'string',
        required: true
    },
    status: { // paid, pending, unpaid
        type: 'string',
        required: true
    },
    razorpay_payment_id: {
        type: 'string',
        // required: true
    },
    razorpay_order_id: {
        type: 'string',
        required: true
    },
    razorpay_signature: {
        type: 'string',
        // required: true
    },
    createdAt: { type: Date, default: Date.now() },
}, { collection: 'transactions' });

mongoose.model('transactions', TransactionSchema);
