import mongoose, { model, models, Schema } from "mongoose";

export interface Admin {
    _id?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    resetToken: string;
    resetTokenExpiry: Date;
}

const AdminSchema = new Schema<Admin>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        resetToken: { type: String },
        resetTokenExpiry: { type: Date },
    },
    { timestamps: true }
)

const AdminModel = models?.Admin || model<Admin>("Admin", AdminSchema)

export default AdminModel;