const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const User = require("../models/User");
const Contact = require("../models/Contact");
const Case = require("../models/Case");
const TestReport = require("../models/TestReport");
const FollowUp = require("../models/CaseFollowUp");

exports.createCase = async (req, res) => {
  const {
    fullName,
    email,
    age,
    birthDate,
    address,
    occupation,
    phone,
    gender,
    state,
    lga,
    town,
  } = req.body;

  try {
    const existingCase = await Case.findOne({ phone: phone });
    if (existingCase) {
      return res
        .status(404)
        .json({ message: "case with this phone number already exist" });
    }

    const newCase = await Case.create({
      fullName,
      email,
      gender,
      age,
      birthDate,
      address,
      occupation,
      phone,
      state,
      lga,
      town,
    });

    res.status(200).json({ message: "case successfully submitted", newCase });
  } catch (err) {
    res.status(500).json({ message: "something went wrong", err: err.message });
  }
};

exports.submitTestResult = async (req, res) => {
  const {
    labId,
    specimenNumber,
    sampleCollected,
    sampleRecievedDate,
    testResult,
    resultDate,
    caseId,
  } = req.body;

  try {
    const existingCase = await Case.findOne({ _id: caseId });

    if (testResult === "negative") {
      existingCase.status = "closed";
      await existingCase.save();
      return res.status(200).json({ message: "This case has being closed" });
    }

    let result = existingCase.testResult;

    const newTestResult = await new TestReport({
      labId,
      specimenNumber,
      sampleCollected,
      sampleRecievedDate,
      testResult,
      resultDate,
    }).save();

    if (result.length === 3) {
      result.shift();
    }
    result.push(newTestResult._id);
    existingCase.testResult = result;
    existingCase.status = "confirmed";
    existingCase.save();

    res.status(200).json({ message: "test result added successfully" });
  } catch (err) {
    res.status(500).json({ message: "something went wrong", err: err.message });
  }
};

exports.addContact = async (req, res) => {
  const {
    fullName,
    gender,
    birthDate,
    phone,
    age,
    email,
    occupation,
    address,
    state,
    lga,
    town,
    caseRelationship,
    lastContact,
    caseId,
  } = req.body;

  try {
    const existingCase = await Case.findOne({ phone: phone });
    if (existingCase) {
      return res
        .status(404)
        .json({ message: "case with this phone number already exist" });
    }

    const newContact = await Case.create({
      fullName,
      gender,
      birthDate,
      phone,
      age,
      email,
      occupation,
      state,
      lga,
      town,
      address,
      caseRelationship,
      lastContact,
      contacted: false,
    });

    let parentCase = await Contact.findOne({ caseId: caseId });
    if (!parentCase) {
      parentCase = await new Contact({
        caseId: caseId,
      }).save();
    }

    let contacts = parentCase.caseContacts;
    contacts.push(newContact._id);
    parentCase.caseContacts = contacts;
    parentCase.save();

    res
      .status(200)
      .json({ message: "contact successfully submitted", newContact });
  } catch (err) {
    res.status(500).json({ message: "something went wrong", err: err.message });
  }
};

exports.addFollowUp = async (req, res) => {
  const {
    healthStatus,
    treatmentCenter,
    treatmentStartDate,
    prescription,
    medTeamLeader,
    symptoms,
    bodyTemp,
    weight,
    height,
    caseId,
  } = req.body;

  try {
    const existingCase = await Case.findOne({ _id: caseId });

    let caseFollowUp = existingCase.followUp;

    const newFollowUp = await new FollowUp({
      healthStatus,
      treatmentCenter,
      treatmentStartDate,
      prescription,
      medTeamLeader,
      symptoms,
      bodyTemp,
      weight,
      height,
    }).save();

    caseFollowUp.push(newFollowUp._id);
    existingCase.caseFollowUp = caseFollowUp;

    await existingCase.save();
    if (
      healthStatus === "Recovered" ||
      healthStatus === "Dead" ||
      healthStatus === "Lost to Followup"
    ) {
      existingCase.status = "closed";
      await existingCase.save();
    }

    res
      .status(200)
      .json({ message: "follow up information saved", existingCase });
  } catch (err) {
    res.status(500).json({ message: "something went wrong", err: err.message });
  }
};

exports.fetchCases = async (req, res) => {
  try {
    const cases = await Case.find()
      .populate({
        path: "testResult",
        model: "TestReport",
      })
      .populate({
        path: "caseFollowUp",
        model: "CaseFollowUp",
      });

    res.status(200).json(cases);
  } catch (err) {
    res.status(500).json({ message: "something went wrong", err: err.message });
  }
};

exports.editCase = async (req, res) => {
  const {
    fullName,
    email,
    age,
    birthDate,
    address,
    occupation,
    phone,
    gender,
    state,
    lga,
    town,
    caseId,
  } = req.body;
  try {
    let filter = { _id: caseId };
    let update = {
      fullName,
      email,
      age,
      birthDate,
      address,
      occupation,
      phone,
      gender,
      state,
      lga,
      town,
    };

    const updated = await Case.findOneAndUpdate(filter, update, { new: true });

    res.status(200).json({ message: "updated successfully", updated });
  } catch (err) {
    res.status(500).json({ message: "something went wrong", err: err.message });
  }
};
exports.fetchContacts = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Contact.findOne({ caseId: id }).populate([
      {
        path: "caseContacts",
        model: "Case",
      },
    ]);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "something went wrong", err: err.message });
  }
};

exports.removeCase = async (req, res) => {
  try {
    const cases = await Case.findOneAndDelete({
      _id: req.body.id,
    });
    res.status(200).json({ message: "deleted successfully", cases });
  } catch (err) {
    res
      .status(500)
      .json({ message: "something went wrong", error: err.message });
  }
};
