import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import JWT from "jsonwebtoken";
import { User } from "../models/user.model";


export const verifyJWT = asyncHandler(async (req, _, next) => {      // _ = res
  try {
    const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ", "")

    if (!token) {
      throw new ApiError(401, "unauthorized request !")
    }

    const decodedToken = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

    if (!user) {
      // todo: discuss about frontend
      throw new ApiError(401, "invalid access token !")
    }

    req.user = user;
    next()
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token !")
  }

}) 