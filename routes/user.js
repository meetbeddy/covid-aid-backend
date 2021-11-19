const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const staffController = require("../controllers/staffController");

router.post("/signin", authController.signIn);
router.post("/createuser", authController.createUser);
router.post("/submitcase", staffController.createCase);
router.post("/addcontact", staffController.addContact);
router.post("/testresult", staffController.submitTestResult);
router.post("/followup", staffController.addFollowUp);
router.get("/fetchcases", staffController.fetchCases);
router.get("/fetchcontact/:id", staffController.fetchContacts);

module.exports = router;
