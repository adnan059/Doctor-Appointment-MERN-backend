const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      unique: true,
      required: true,
    },
    // first name
    firstName: {
      type: String,
      minLength: [2, "minimum 2 characters"],
      maxLength: [20, "maximum 20 characters"],
      required: [true, "First name is required"],
    },

    // lastname
    lastName: {
      type: String,
      minLength: [2, "minimum 2 characters"],
      maxLength: [20, "maximum 20 characters"],
      required: [true, "Last name is required"],
    },

    // phone
    phone: {
      type: String,
      unique: true,
      required: [true, "Phone number is required"],
      validate: {
        validator: function (v) {
          return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/.test(
            v
          );
        },
        message: (props) => `${props.value} is not a valid US phone number`,
      },
      // for e.g => +1234567890 is a valid number
    },

    // email
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9]+([-_.]?[a-zA-Z0-9]+[_]?){1,}@([a-zA-Z0-9]{2,}\.){1,}[a-zA-Z]{2,4}$/.test(
            v
          );
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },

    // others
    website: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    specialization: {
      type: String,
      required: [true, "Specialization is require"],
    },
    experience: {
      type: String,
      required: [true, "Experience is required"],
    },

    feesPerConsultation: {
      type: Number,
      required: [true, "Fee is required"],
    },
    status: {
      type: String,
      default: "pending",
    },
    timings: {
      type: Object,
      required: [true, "Work timing is required"],
    },
  },
  { timestamps: true }
);

doctorSchema.plugin(uniqueValidator, {
  message:
    "Another user with the same {PATH} already exists. Please try with another one.",
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
