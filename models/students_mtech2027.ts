import mongoose, { model, models, Schema } from "mongoose";

export interface MtechStudent2027 {
  _id?: mongoose.Types.ObjectId;
  photo_url: string;           
  college_email: string;
  personal_email: string;
  full_name: string;
  roll_no: number;
  mtech_branch: string;
  btech_branch: string;
  btech_passing_year: string;
  btech_institution: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  cgpa: number;
  btech_cgpa: string;
  workExperience: "Yes" | "No";  
  phone: string;
  nationality: string;
  address: string;
  class10_passing_year: number;
  class10_score: string;
  class10_board: string;
  class12_passing_year: string;
  class12_score: string;
  class12_board: string;
  resume_link: string;
  academic_gaps: string;   
  isAnyBacklog: 'Yes' | 'No';   
}

const MtechStudent2027Schema = new Schema<MtechStudent2027>(
  {
    photo_url: { type: String, required: true },
    college_email: { type: String, required: true },
    personal_email: { type: String, required: true },
    roll_no: { type: Number, required: true, unique: true },
    full_name: { type: String, required: true },
    mtech_branch: { type: String, required: true },
    btech_branch: { type: String, required: true },
    btech_passing_year: { type: String, required: true },
    btech_institution: { type: String, required: true },
    dob: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    cgpa: { type: Number, required: true },
    btech_cgpa: { type: String, required: true },
    workExperience: { type: String, enum: ["Yes", "No"], required: true },
    phone: { type: String, required: true },
    nationality: { type: String, required: true },
    address: { type: String, required: true },
    class10_passing_year: { type: Number, required: true },
    class10_score: { type: String, required: true },
    class10_board: { type: String, required: true },
    class12_passing_year: { type: String, required: true },
    class12_score: { type: String, required: true },
    class12_board: { type: String, required: true },
    resume_link: { type: String, required: true },
    academic_gaps: { type: String, required: false },
    isAnyBacklog: {type: String, enum: ["Yes", "No"], required: true}
  },
  {
    timestamps: true,
  }
);

const MtechStudent2027Model =
  models?.MtechStudent2027 || model<MtechStudent2027>("MtechStudent2027", MtechStudent2027Schema);

export default MtechStudent2027Model;