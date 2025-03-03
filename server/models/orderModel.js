
const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
    {
        products: [
            {
                product: {
                    type: mongoose.Types.ObjectId,
                    ref: 'Product',
                },
                quantity: Number,
                color: String,
                price: Number,
                thumb: String,
                title: String,
            },
        ],
        status: {
            type: String,
            default: 'Processing',
            enum: ['Canceled', 'Processing', 'Succeed'],
        },
        total: Number,
        orderBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
        // paymentMethod: {
        //     type: String,
        //     enum: ['PayPal', 'MoMo', 'COD'], // Thêm phương thức thanh toán
        //     required: true,
        // },
        transactionId: {
            type: String, // Lưu transactionId từ PayPal hoặc MoMo để tracking giao dịch
        },
    },
    {
        timestamps: true,
    },
);

//Export the model
module.exports = mongoose.model('Order', orderSchema);
