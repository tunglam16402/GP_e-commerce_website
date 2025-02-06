const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt'); //hash password
const crypto = require('crypto'); //random data

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        avatar: {
            type: String,
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: [2002, 2006],
            default: 2006,
        },
        cart: [
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
        address: {
            type: String,
        },
        //Id sản phẩm người dùng yêu thích trỏ đến bảng Product
        wishlist: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
        // kiểm tra có bị khóa tài khoản hay không
        isBlocked: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String,
        },
        //quên mật khẩu
        passwordChangedAt: {
            type: String,
        },
        passwordResetToken: {
            type: String,
        },
        //thời gian hết hạn token được gửi qua email
        passwordResetExpires: {
            type: String,
        },
        registerToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);
// hash password trước khi thực hiện lưu
userSchema.pre('save', async function (next) {
    //pw thay đổi thì mới gọi hàm hash
    if (!this.isModified('password')) {
        next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods = {
    //so sánh password với password trong db
    isCorrectPassword: async function (password) {
        return await bcrypt.compare(password, this.password);
    },
    //tạo token lưu trong db để gửi cho user khi post email để reset pw
    createPasswordChangeToken: function () {
        //Tạo chuỗi random gồm 32 ký tự
        const resetToken = crypto.randomBytes(32).toString('hex');
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        //tạo tg hết hạn là 15p
        this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
        return resetToken;
    },
};

//Export the model
module.exports = mongoose.model('User', userSchema);
