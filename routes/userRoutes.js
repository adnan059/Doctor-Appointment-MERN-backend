const express = require("express");
const {
  registerCtrl,
  loginCtrl,
  getUserDataCtrl,
  readAllNotificationsCtrl,
  deleteSeenNotificationsCtrl,
  bookAppointmentCtrl,
  checkBookingAvailabilityCtrl,
  getUserAppointmentsCtrl,
} = require("../controllers/userCtrls");
const { verifyToken } = require("../utils/verify");

const router = express.Router();

// register route
router.post("/register", registerCtrl);

// login route
router.post("/login", loginCtrl);

// get user data route
router.get("/getuserdata/:id", verifyToken, getUserDataCtrl);

// mark new notifications as read
router.put("/readallnotifications", verifyToken, readAllNotificationsCtrl);

// delete seen notifications
router.put(
  "/deleteseennotifications",
  verifyToken,
  deleteSeenNotificationsCtrl
);

// book appointment
router.post("/bookappointment", verifyToken, bookAppointmentCtrl);

// check booking availability
router.post("/book-availability", verifyToken, checkBookingAvailabilityCtrl);

// get all user appointments
router.get("/user-appointments/:userId", verifyToken, getUserAppointmentsCtrl);

module.exports = router;
