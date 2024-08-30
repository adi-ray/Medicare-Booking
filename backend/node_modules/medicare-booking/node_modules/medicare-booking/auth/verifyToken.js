import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";

export const authenticate = async (req, res, next) => {
  // Get Token From Headers
  const authToken = req.headers.authorization;

  // Log the Authorization header
  console.log("Authorization Header:", authToken);

  // Check token exists or not
  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Token not found, authorization denied",
      });
  }

  try {
    const token = authToken.split(" ")[1];
    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.id;
    req.role = decoded.role;

    // Set doctorId if the role is "doctor"
    if (req.role === "doctor") {
      req.doctorId = req.userId; // assuming the doctor ID is the same as the user ID
    }

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token is expired" });
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  }
};

export const restrict = (roles) => async (req, res, next) => {
  const userId = req.userId;
  let user;
  const patient = await User.findById(userId);
  const doctor = await Doctor.findById(userId);

  // if (patient) {
  //   user = patient;
  // }
  // if (doctor) {
  //   user = doctor;
  // }

  // if (!roles.includes(user.role)) {
  //   return res
  //     .status(401)
  //     .json({ success: false, message: "You are not authorized" });
  // }
  if (patient) {
    user = patient;
  } else if (doctor) {
    user = doctor;
  } else {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Log the role and the roles allowed
  console.log(`User Role: ${user.role}, Allowed Roles: ${roles}`);

  if (!roles.includes(user.role)) {
    return res.status(401).json({
      success: false,
      message: "You are not authorized",
    });
  }

  next();
};
