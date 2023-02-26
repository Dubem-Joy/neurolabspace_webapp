const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userModel = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        admin: { type: Boolean },
        role: { type: String, default: 'member' },
        password: { type: String, required: true },
        pic: {
            type: String,
            required: true,
            default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        },
    },
    {
        timestamps: true,
    }
);

// #authenticate login password
userModel.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// #encrypt password before saving user
userModel.pre('save', async function (next) {
    // *if password is not modified (encrypted), move on (dont run the next codes) 
    if (!this.isModified) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userModel)
module.exports = User;