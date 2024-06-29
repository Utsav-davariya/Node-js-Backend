import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // step to write code of controller alogorithem

    // get user details from frontend (postman)
    // validation - not empty,email format
    // check if user already exists : email,username
    // check for images, check for avtar file
    // upload them to cloudinary , avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation 
    // return response 



    const { fullname, email, username, password } = req.body
    console.log("detail of users : ", fullname, email, username, password);

    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "all fields are must required !")
    }
    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "user with email or username already exists !")
    }

    const avatarLocalpath = req.files?.avater[0]?.path;
    const coverImageLocalpath = req.files?.coverImage[0]?.path;


    if (!avatarLocalpath) {
        throw new ApiError(400, "avatar file is required !")
    }

    const avatar = await uploadOnCloudinary(avatarLocalpath)
    const coverImage = await uploadOnCloudinary(coverImageLocalpath)

    if (!avatar) {
        throw new ApiError(400, "avatar file is required !")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "somthing went erong while registering user !")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registered Successfuly")
    )
})

export { registerUser }