import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
    },
    role: {
        type: String,
        enum: ['customer', 'manager', 'admin'],
        default: 'customer',
    },
    phone: {
        type: String,
    },
    licenseUrl: {
        type: String,
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: String,
    otp: String,
    otpExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true
});

// Password hashing middleware
userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
