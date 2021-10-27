const mongoose = require("mongoose");
const { Schema } = mongoose;

const caseFollowUpSchema = new Schema({});

module.exports = mongoose.model("CaseFollowUp", caseFollowUpSchema);
