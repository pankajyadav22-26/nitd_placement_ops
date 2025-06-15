import mongoose, { model, models, Schema } from "mongoose";

export interface BtechStudent {
    _id?: mongoose.Types.ObjectId;
    photo_url: string;
    college_email: string;
    personal_email: string;
    full_name: string;
    roll_no: number;
    branch: string;
    dob: string;
    gender: 'Male' | 'Female' | 'Other';
    cgpa: number;
    phone: string;
    nationality: string;
    address: string;
    class10_passing_year: number;
    class10_score: string;
    class10_board: string;
    class12_passing_year: number;
    class12_score: string;
    class12_board: string;
    resume_link: string;
    isAnyBacklog: 'Yes' | 'No';
}

const BtechStudentSchema = new Schema<BtechStudent>(
    {
        photo_url: { type: String, required: true },
        college_email: { type: String, required: true },
        personal_email: { type: String, required: true },
        full_name: { type: String, required: true },
        roll_no: { type: Number, required: true, unique: true },
        branch: { type: String, required: true },
        dob: { type: String, required: true },
        gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
        cgpa: { type: Number, required: true },
        phone: { type: String, required: true },
        nationality: { type: String, required: true },
        address: { type: String, required: true },
        class10_passing_year: { type: Number, required: true },
        class10_score: { type: String, required: true },
        class10_board: { type: String, required: true },
        class12_passing_year: { type: Number, required: true },
        class12_score: { type: String, required: true },
        class12_board: { type: String, required: true },
        resume_link: { type: String, required: true },
        isAnyBacklog: {type: String, enum: ["Yes", "No"], required: true}
    },
    {
        timestamps: true,
    }
);

const BtechStudentModel = models?.BtechStudent || model<BtechStudent>("BtechStudent", BtechStudentSchema)

export default BtechStudentModel;