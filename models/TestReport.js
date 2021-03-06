const mongoose = require("mongoose");
const { Schema } = mongoose;

const TestReportSchema = new Schema({
  labId: String,
  specimenNumber: String,
  sampleCollected: String,
  sampleRecievedDate: String,
  testResult: String,
  resultDate: String,
});

module.exports = mongoose.model("TestReport", TestReportSchema);
