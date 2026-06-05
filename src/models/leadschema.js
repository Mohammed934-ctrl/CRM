import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    PhoneNumber: {
      type: String,
      required: [true, "phonenumber is required"],
    },
    company: {
      type: String,
      required: [true, "compnay name is required"],
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Converted", "Lost"],
      default: "New",
    },
    source:{
      type:String,
      enum:['Website','Referral','LinkedIn','Event','Cold Outreach','other'],
      default:"other",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const Leads = mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
