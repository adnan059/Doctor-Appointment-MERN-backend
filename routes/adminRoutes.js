const express = require("express");
const { verifyAdmin } = require("../utils/verify");
const {
  getAllUsersCtrl,
  getAllDoctorsCtrl,
  approveDoctorCtrl,
  deleteDoctorCtrl,
  deleteUserCtrl,
} = require("../controllers/adminCtrls");

const router = express.Router();

// get all users for admin
router.get("/allusers", verifyAdmin, getAllUsersCtrl);

// get all doctors for admin
router.get("/alldoctors", verifyAdmin, getAllDoctorsCtrl);

// approve doctor
router.put("/approvedoctor", verifyAdmin, approveDoctorCtrl);

// delete doctor
router.put("/deletedoctor", verifyAdmin, deleteDoctorCtrl);

// delete user
router.put("/deleteuser", verifyAdmin, deleteUserCtrl);

module.exports = router;
