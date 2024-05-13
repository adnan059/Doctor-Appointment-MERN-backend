const bcrypt = require("bcrypt");
const moment = require("moment");

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const createError = require("../utils/error");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

// register ctrl
const registerCtrl = async (req, res, next) => {
  try {
    const hashedPswd = await bcrypt.hash(req.body.password, 8);

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPswd,
    });

    const { _id, password, ...others } = newUser._doc;

    const token = jwt.sign({ id: _id }, process.env.SK, { expiresIn: "1d" });

    res.status(201).json({ _id, token, ...others });
  } catch (error) {
    next(error);
  }
};

// login ctrl
const loginCtrl = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(401, "Wrong Credentials!"));

    const isValidPswd = await bcrypt.compare(req.body.password, user.password);

    if (!isValidPswd) return next(createError(401, "Wrong Credentials!"));

    const { _id, isAdmin, password, ...others } = user._doc;

    const token = jwt.sign({ id: _id, isAdmin }, process.env.SK, {
      expiresIn: "1d",
    });

    res.status(200).json({ _id, token, isAdmin, ...others });
  } catch (error) {
    next(error);
  }
};

const getUserDataCtrl = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const user = await User.findById(req.params.id);
    const { password, ...others } = user;
    console.log(user);
    console.log(others);
    res.status(200).json(others);
  } catch (error) {
    next(error);
  }
};

// read all notifs
const readAllNotificationsCtrl = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.id);
    const notifications = user.notifications;

    user.seenNotifications.unshift(...notifications);

    user.notifications = [];
    const updatedUser = await user.save();
    const { password, ...others } = updatedUser._doc;
    res.status(200).json(others);
  } catch (error) {
    next(error);
  }
};

// delete old seen notifs
const deleteSeenNotificationsCtrl = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.id);
    user.seenNotifications = [];
    const updatedUser = await user.save();
    const { password, ...others } = updatedUser._doc;
    res.status(200).json(others);
  } catch (error) {
    next(error);
  }
};

// book an appointment
const bookAppointmentCtrl = async (req, res, next) => {
  try {
    if (
      req.body.date === "Invalid Date" ||
      req.body.time === "Invalid Date" ||
      !req.body.time ||
      !req.body.date
    ) {
      return next(createError(400, "invalid Date or Time"));
    }
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();

    const newAppointment = await Appointment.create(req.body);
    const user = await User.findById(req.body.doctorToBeBooked.userId);
    const notifs = user.notifications;
    notifs.unshift({
      type: "new-appointment-request",
      message: `A new appointment request from ${req.body.userInfo.name}`,
      onClickPath: "/doctor-appointments",
      createdAt: Date.now(),
    });
    user.notifications = notifs;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Appointment Booked Successfully at ",
      time: req.body.time,
      newAppointment,
    });
  } catch (error) {
    next(error);
  }
};

// check booking availability
const checkBookingAvailabilityCtrl = async (req, res, next) => {
  try {
    if (
      req.body.date === "Invalid Date" ||
      req.body.time === "Invalid Date" ||
      !req.body.time ||
      !req.body.date
    ) {
      return next(createError(400, "invalid Date or Time"));
    }

    const time = moment(req.body.time, "HH:mm").toISOString();

    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();

    const todaysDate = new Date().toISOString();
    console.log(todaysDate);

    const doctorId = req.body.doctorId;

    const doctor = await Doctor.findById(doctorId);

    if (time > doctor.timings[1] || time < doctor.timings[0]) {
      return next(createError(400, "Appointment Not Available"));
    }

    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(30, "minutes")
      .toISOString();

    const toTime = moment(req.body.time, "HH:mm")
      .add(30, "minutes")
      .toISOString();

    const appointments = await Appointment.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });

    if (appointments.length > 0) {
      return res.status(200).json({
        message: `Appointment not Availibale at `,
        time: moment(req.body.time, "HH:mm").toISOString(),

        isAvailable: false,
      });
    } else {
      return res.status(200).json({
        message: "Appointment available at ",
        time: moment(req.body.time, "HH:mm").toISOString(),
        isAvailable: true,
      });
    }
    //res.json({ message: "testing" });
  } catch (error) {
    next(error);
  }
};

// get user appoinments
const getUserAppointmentsCtrl = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const appointments = await Appointment.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  registerCtrl,
  loginCtrl,
  getUserDataCtrl,
  readAllNotificationsCtrl,
  deleteSeenNotificationsCtrl,
  bookAppointmentCtrl,
  checkBookingAvailabilityCtrl,
  getUserAppointmentsCtrl,
};
