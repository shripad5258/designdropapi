import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticateToken = (request, response, next) => {
  const token = request.header("auth-token");

  if (token == null) {
    return response.status(401).json({ msg: "token is missing" });
  }

  try {
    const data = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
    request.user = data.user;
    next();
  } catch (error) {
    response
      .status(401)
      .send({ error: "Please authenticate using a valid token" });
  }
};
