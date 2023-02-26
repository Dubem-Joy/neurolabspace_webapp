const mongoose = require('mongoose');

const emailauthModel = mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        admin: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

const AuthEmail = mongoose.model("AuthEmail", emailauthModel)
module.exports = AuthEmail;