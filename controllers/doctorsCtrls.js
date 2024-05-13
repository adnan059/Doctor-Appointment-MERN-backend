const Doctor = require("../models/Doctor");
const User = require("../models/User");
const createError = require("../utils/error");
const Appointment = require("../models/Appointment");
const moment = require("moment");

// get approved doctors
const getApprovedDoctors = async (req, res, next) => {
  try {
    const approvedDoctors = await Doctor.find({ status: "approved" });
    res.status(200).json(approvedDoctors);
  } catch (error) {
    next(error);
  }
};

// get single doctor by user id
const getSingleDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.params.userId });
    res.status(200).json(doctor);
  } catch (error) {
    next(error);
  }
};

// get single doctor by doctor id
const getSingleDoctorByDoctorId = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.params.doctorId });
    res.status(200).json(doctor);
  } catch (error) {
    next(error);
  }
};

// apply doctor ctrl
const applyDoctorCtrl = async (req, res, next) => {
  try {
    // const timings = [
    //   moment(req.body.timings[0], "HH:mm").toISOString(),
    //   moment(req.body.timings[1], "HH:mm").toISOString(),
    // ];
    const newDoctor = await Doctor.create({
      ...req.body,
      // timings,
      userId: req.user.id,
    });
    const { firstName, lastName, _id } = newDoctor._doc;

    const adminUser = await User.findOne({ isAdmin: true });

    const notifications = adminUser.notifications;

    notifications.unshift({
      type: "apply-doctor-request",
      message: `${firstName} ${lastName} has applied for a doctor account`,
      createdAt: Date.now(),
      onClickPath: "/admin/doctors",
    });

    await User.findByIdAndUpdate(
      adminUser._id,
      { notifications },
      { new: true }
    );

    res.status(201).json(newDoctor._doc);
  } catch (error) {
    next(error);
  }
};

// update doctor
const updateDoctor = async (req, res, next) => {
  try {
    const { doctorId, doctorData, userId } = req.body;
    if (req.user.id.toString() !== userId.toString()) {
      return next(createError(400, "You are not authorized"));
    }
    const updatedDoctor = await Doctor.findByIdAndUpdate(doctorId, doctorData, {
      new: true,
    });
    res.status(200).json(updatedDoctor);
  } catch (error) {
    next(error);
  }
};

// get doctor appointments
const getDoctorAppointmentsCtrl = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.find({ doctorId }).sort({
      createdAt: -1,
    });
    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

// aprove doctor appoinment
const approveDoctorAppoinmnetCtrl = async (req, res, next) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    const user = await User.findById(req.body.userId);
    const notifs = user.notifications;
    notifs.unshift({
      type: "appointment approved",
      message: `Dr. ${updatedAppointment?.doctorToBeBooked.firstName} ${updatedAppointment?.doctorToBeBooked.lastName} has approved your appointment`,
      onClickPath: "/user-appointments",
      createdAt: Date.now(),
    });

    user.notifications = notifs;
    await user.save();
    res.status(200).json({ message: "Appoinment is approved" });
  } catch (error) {
    next(error);
  }
};

// aprove doctor appoinment
const rejectDoctorAppoinmnetCtrl = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    const user = await User.findById(req.body.userId);
    const notifs = user.notifications;
    notifs.unshift({
      type: "appointment rejected",
      message: `Dr. ${appointment?.doctorToBeBooked.firstName} ${appointment?.doctorToBeBooked.lastName} has rejected your appointment`,
      onClickPath: "/user-appointments",
      createdAt: Date.now(),
    });
    user.notifications = notifs;
    await user.save();
    await Appointment.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Appoinment is rejected" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyDoctorCtrl,
  getSingleDoctor,
  updateDoctor,
  getApprovedDoctors,
  getSingleDoctorByDoctorId,
  getDoctorAppointmentsCtrl,
  approveDoctorAppoinmnetCtrl,
  rejectDoctorAppoinmnetCtrl,
};
