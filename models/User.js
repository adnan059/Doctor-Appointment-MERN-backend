const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema(
  {
    // name
    name: {
      type: String,
      required: [true, "Name is required"],
      minLength: [2, "Not less than 2 characters is allowed"],
      maxLength: [40, "Not more than 40 characters is allowed"],
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

    // password
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: function (v) {
          return /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(
            v
          );
        },
        message: (props) =>
          `Min 8 Chars: upperCase, lowerCase, number/special Char needed`,
      },
    },

    // others
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isDoctor: {
      type: Boolean,
      default: false,
    },
    notifications: {
      type: [Object],
      default: [],
    },
    seenNotifications: {
      type: [Object],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator, {
  message:
    "Another user with the same {PATH} already exists. Please try with another one.",
});

const User = mongoose.model("User", userSchema);

module.exports = User;
