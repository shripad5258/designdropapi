import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { validationResult } from "express-validator";

import User from "../model/user.js";

dotenv.config();

export const singupUser = async (request, response) => {
  const { firstname, lastname, email, password } = request.body;
  // validation
  let success = false;
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ success, errors: errors.array() });
  }

  try {
    let exituser = await User.findOne({ email: email });
    if (exituser) {
      return response.status(409).json({ success, msg: "User Already Exits" });
    }
    // const salt = await bcrypt.genSalt();
    // const hashedPassword = await bcrypt.hash(request.body.password, salt);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedPassword,
    };
    const newUser = new User(user);
    await newUser.save();
    const accessToken = jwt.sign(
      { user_id: newUser._id, email: newUser.email },
      process.env.ACCESS_SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );
    response.status(200).json({
      success: true,
      accessToken: accessToken,
      firstname: user.firstname,
      lastname: user.lastname,
      msg: "Signup successfull",
    });
  } catch (error) {
    response.status(500).json({ success, msg: "error while login the user" });
  }
};

///LOGIN USER

export const loginUser = async (request, response) => {
  const { email, password } = request.body;
  let success = false;
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ success, errors: errors.array() });
  }

  let user = await User.findOne({ email: email });
  if (!user) {
    return response.status(400).json({ success, msg: "email does not match" });
  }

  try {
    let match = await bcrypt.compare(password, user.password);
    if (match) {
      const accessToken = jwt.sign(
        { user_id: user._id, email: user.email },
        process.env.ACCESS_SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );

      response.status(200).json({
        success: true,
        accessToken: accessToken,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        msg: "Login successfull",
      });
    } else {
      response.status(400).json({ success, msg: "Password does not match" });
    }
  } catch (error) {
    response.status(500).json({ success, msg: "error while login the user" });
  }
};

//LOG-OUT USER

export const logoutUser = async (request, response) => {
  let success = false;
  const token = request.body.token;
  await token.deleteOne({ token: token });

  response.status(204).json({ success, msg: "logout successfull" });
};
