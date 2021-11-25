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
router.put("/editcase", staffController.editCase);
router.get("/fetchcases", staffController.fetchCases);
router.get("/fetchcontact/:id", staffController.fetchContacts);
router.delete("/removecase", staffController.removeCase);

module.exports = router;
