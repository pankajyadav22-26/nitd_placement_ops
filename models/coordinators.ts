import mongoose, { model, models, Schema } from "mongoose";

export interface Coordinator {
    _id?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    resetToken: string;
    resetTokenExpiry: Date;

}

const CoordinatorSchema = new Schema<Coordinator>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        resetToken: { type: String },
        resetTokenExpiry: { type: Date },
    },
    { timestamps: true }
)

const CoordinatorModel = models?.Coordinator || model<Coordinator>("Coordinator", CoordinatorSchema)

export default CoordinatorModel;