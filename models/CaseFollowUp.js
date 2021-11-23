const mongoose = require("mongoose");
const { Schema } = mongoose;

const caseFollowUpSchema = new Schema(
  {
    healthStatus: String,
    treatmentCenter: String,
    treatmentStartDate: String,
    prescription: String,
    medTeamLeader: String,
    symptoms: String,
    weight: String,
    height: String,
    bodyTemp: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("CaseFollowUp", caseFollowUpSchema);
