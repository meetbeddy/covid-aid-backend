const mongoose = require("mongoose");
const { Schema } = mongoose;

const caseSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  gender: String,
  phone: { type: String, required: true },
  address: { type: String, required: true },
  birthDate: { type: String, required: true },
  age: { type: String, required: true },
  occupation: { type: String, required: true },
  state: { type: String, required: true },
  lga: { type: String, required: true },
  town: { type: String, required: true },
  status: {
    type: String,
    enum: ["suspected", "confirmed", "closed"],
    default: "suspected",
  },
  caseRelationship: String,
  lastContact: String,
  contacted: Boolean,
  caseFollowUp: [{ type: Schema.Types.ObjectId, ref: "CaseFollowUp" }],
  testResult: [{ type: Schema.Types.ObjectId, ref: "TestReport" }],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
module.exports = mongoose.model("Case", caseSchema);
