const User = require("../models/User");

const Doctor = require("../models/Doctor");

// get all users for admin
const getAllUsersCtrl = async (req, res, next) => {
  try {
    const allUsers = await User.find({}).select({ password: 0 });
    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};

// get all doctors for admin
const getAllDoctorsCtrl = async (req, res, next) => {
  try {
    const allDoctors = await Doctor.find({});

    res.status(200).json(allDoctors);
  } catch (error) {
    next(error);
  }
};

const approveDoctorCtrl = async (req, res, next) => {
  try {
    const { doctorId, userId, status } = req.body;
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { status },
      { new: true }
    );
    const user = await User.findById(userId);
    const notifications = user.notifications;
    notifications.unshift({
      type: "doctor-account-request-updated",
      message: `Your Doctor Account Request Has Been ${status} `,
      createdAt: Date.now(),
      onClickPath: "/",
    });
    user.notifications = notifications;
    user.isDoctor = true;
    const updatedUser = await user.save();
    res.status(200).json({
      updatedUser: updatedUser._doc,
      updatedDoctor: updatedDoctor._doc,
    });
  } catch (error) {
    next(error);
  }
};

// delete doctor
const deleteDoctorCtrl = async (req, res, next) => {
  try {
    const { doctorId, userId } = req.body;
    await Doctor.findByIdAndDelete(doctorId);
    const user = await User.findById(userId);
    const notifications = user.notifications;

    notifications.unshift({
      type: "doctor-account-removed",
      message: `Your Doctor Account Has Been Removed `,
      onClickPath: "/notifications",
    });

    user.notifications = notifications;
    user.isDoctor = false;
    const updatedUser = await user.save();

    res
      .status(200)
      .json({ updatedUser: updatedUser._doc, message: "Doctor Removed!" });
  } catch (error) {
    next(error);
  }
};

// delete user
const deleteUserCtrl = async (req, res, next) => {
  try {
    const { userId } = req.body;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User successfully deleted!" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDoctorsCtrl,
  getAllUsersCtrl,
  approveDoctorCtrl,
  deleteDoctorCtrl,
  deleteUserCtrl,
};
