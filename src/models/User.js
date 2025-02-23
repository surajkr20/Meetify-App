import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true }, // Ensure email is unique
    profilePicture: { type: String },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
