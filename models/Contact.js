const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema({
  caseId: {
    type: Schema.Types.ObjectId,
    ref: "Case",
  },
  caseContacts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Case",
    },
  ],
});

module.exports = mongoose.model("Contact", contactSchema);
