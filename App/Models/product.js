const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({

    product_name: {
        type: 'string',
        default: null
    },

    attribute: {
        type: 'array',
        default: []
    },

    attribute_set: {
        type: 'string',
        default: null
    },
    product_image: {
        type: 'array',
        default: []
    },
    product_defaultImg: {
        type: 'array',
        default: []
    },
    product_description: {
        type: 'string',
        default: null
    },
    product_id: {
        type: 'string',
        default: null
    },
    venodor_id: {
        type: 'string',
        default: null
    },

    venodor_name: {
        type: 'string',
        default: null
    },
    pdf_heading: {
        type: 'string',
        default: null
        // required: true
    },
    product_pdf: {
        type: 'array',
        default: []
    },
    description: {
        type: 'string',
        default: null
    },
    Configurations: {
        type: 'string',
        default: null
    },
    oemone_attribute: {
        type: 'array',
        default: []
    },
    search_engine: {
        type: 'array',
        default: []
    },
    product_video: {
        type: 'string',
        default: null
    },
    product_sku: {
        type: 'string',
        default: null
    },
    product_price: {
        type: 'string',
        default: null
    },
    tax_class: {
        type: 'string',
        default: null
    },
    product_quantity: {
        type: 'string'
    },
    product_weight: {
        type: 'string',
        default: null
    },
    shipping_charge: {
        type: 'string',
    },
    product_category: {
        type: 'array',
        default: []
    },
    product_startdate: {
        type: 'string'
    },
    product_enddate: {
        type: 'string'
    },
    discount_endDate: {
        type: 'string'
    },
    discount_startDate: {
        type: 'string'
    },

    discount_start: {
        type: 'string',
        default: "false"
    },

    product_country_manufacture: {
        type: 'string',
        default: null
    },
    hsn_code: {
        type: 'string',
        default: null
    },
    product_color: {
        type: 'array',
        default: []
    },
    weight_type: {
        type: 'string',
        default: null
    },
    product_size: {
        type: 'array',
        default: []
    },
    relatable_product: {
        type: 'array',
        default: []
    },

    spares_product: {
        type: 'array',
        default: []
    },
    product_featured: {
        type: 'string',
        default: null
    },
    product_stock_status: {
        type: 'string',
        default: null
    },

    product_stock_quantity: {
        type: 'string',
        default: null
    },

    product_brand: {
        type: 'string',
        default: null
    },
    product_model_arr: {
        type: 'string',
        default: null
    },
    series_Type: {
        type: 'string',
        default: null
    },
    pump_Moc: {
        type: 'string',
        default: null
    },
    impeller_Moc: {
        type: 'string',
        default: null
    },
    flange_Conn: {
        type: 'string',
        default: null
    },
    inlet_Flange: {
        type: 'string',
        default: null
    },
    model_Number: {
        type: 'string',
        default: null
    },
    outlet_flange: {
        type: 'string',
        default: null
    },
    impeller_Type: {
        type: 'string',
        default: null
    },
    impeller_Size: {
        type: 'string',
        default: null
    },
    seal_Type: {
        type: 'string',
        default: null
    },
    seal_Size: {
        type: 'string',
        default: null
    },
    shaft_Sleeve: {
        type: 'string',
        default: null
    },
    shaft_Moc: {
        type: 'string',
        default: null
    },
    product_mawp: {
        type: 'string',
        default: null
    },
    product_mawt: {
        type: 'string',
        default: null
    },
    product_mcsf: {
        type: 'string',
        default: null
    },
    product_bep: {
        type: 'string',
        default: null
    },
    rated_Rpm: {
        type: 'string',
        default: null
    },
    driver_Range: {
        type: 'string',
        default: null
    },
    bearting_Ib: {
        type: 'string',
        default: null
    },
    bearting_Ob: {
        type: 'string',
        default: null
    },
    lubrication: {
        type: 'string',
        default: null
    },
    packing_Size: {
        type: 'string',
        default: null
    },
    weight_Kg: {
        type: 'string',
        default: null
    },
    pump_Tech: {
        type: 'string',
        default: null
    },
    product_url_Key: {
        type: 'string',
        default: null
    },
    meta_Title: {
        type: 'string',
        default: null
    },
    meta_Keywords: {
        type: 'string',
        default: null
    },
    meta_Decription: {
        type: 'string',
        default: null
    },

    vendor_Gstcode: {
        type: 'string',
        default: null
    },

    GST_rate: {
        type: 'string',
        default: "18"
    },

    is_discount: {
        type: 'string',
        default: '0'
    },

    discount_percentage: {
        type: 'string',
        default: null
    },

    discount_price: {
        type: 'string',
        default: '0'
    },

    discount_value: {
        type: 'string',
        default: null
    },

    attribute_set_id: {
        type: 'string',
        default: null
    },

    account_id: {
        type: 'string',
        default: null
    },
    product_visibility: {
        type: 'string',
        default: '0'
    },
    product_rating: {
        type: 'string',
        default: "0"
    },
    product_rating_num: {
        type: 'string',
        default: "0"
    },
    wishlist_arr: {
        type: 'string'
    },
    product_quantity_price: {
        type: 'string',
        default: null
    },
    is_deleted: {
        type: 'string',
        default: "0"
    },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },

}, { collection: 'product', versionKey: false });
mongoose.model('product', productSchema);
