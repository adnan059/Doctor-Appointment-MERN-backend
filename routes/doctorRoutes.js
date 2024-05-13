const express = require("express");
const { verifyToken } = require("../utils/verify");
const {
  applyDoctorCtrl,
  getSingleDoctor,
  updateDoctor,
  getApprovedDoctors,
  getSingleDoctorByDoctorId,
  getDoctorAppointmentsCtrl,
  approveDoctorAppoinmnetCtrl,
  rejectDoctorAppoinmnetCtrl,
} = require("../controllers/doctorsCtrls");

const router = express.Router();

// apply doctor route
router.post("/apply-doctor", verifyToken, applyDoctorCtrl);

// get approved doctors
router.get("/find/approveddoctors", verifyToken, getApprovedDoctors);

// get single doctor by user id
router.get("/find/:userId", verifyToken, getSingleDoctor);

// get single doctor by doctor id
router.get("/find-doctor/:doctorId", verifyToken, getSingleDoctorByDoctorId);

// get doctor appointments
router.get(
  "/doctor-appointments/:doctorId",
  verifyToken,
  getDoctorAppointmentsCtrl
);

// update a doctor
router.put("/update", verifyToken, updateDoctor);

// approve doctor appointment
router.put(
  "/approve-appointment/:id",
  verifyToken,
  approveDoctorAppoinmnetCtrl
);

// reject doctor appointment
router.put("/reject-appointment/:id", verifyToken, rejectDoctorAppoinmnetCtrl);

module.exports = router;
