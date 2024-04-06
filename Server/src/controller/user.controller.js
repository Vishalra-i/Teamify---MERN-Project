import {asyncHandler} from "../utils/asynHandler.js";
import {ApiResponse} from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import {User} from "../models/user.models.js"

//Get All User with pagination
const getAllUser = asyncHandler(async(req,res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    //calculate the skip value
    const skip = (page - 1) * limit;

    //Query for finding all user with pagination
    const user = await User.find()
                 .skip(skip)
                 .limit(limit)

    console.log(user)

    if(!user){
        throw  new ApiError(404,"No User Found")
    }  
    
    return res.status(200)
              .json(new ApiResponse(200,{user},"Fetched all users"))
})

//Create new User
const createNewUser = asyncHandler(async (req, res) => {
    const { first_name, last_name, email, gender, domain, available } = req.body;

    if (
        [first_name, last_name, email, gender, domain, available].some(field => !field || field.trim() === '')
    ) {
        throw new ApiError(400, 'All fields are required');
    }

    const existedUser = await User.findOne({
        email  
      })

      if (existedUser) {
        throw new ApiError(400, 'User already exists');
      }
      

    const user = await User.create({
        id: (await User.countDocuments()) + 1,
        first_name,
        last_name,
        email,
        gender,
        domain,
        avatar: `https://robohash.org/${first_name + last_name}`,
        available: available === "true" ? true : false,
    });

    if (!user) {
        throw new ApiError(400, "User not created");
    }

    const createdUser = await User.findById(user._id);

    if (!createdUser) {
        throw new ApiError(400, "User creation failed. Please try again later.");
    }

    return res.status(201)
        .json(new ApiResponse(201, { createdUser }, "User Created Successfully"));
});

//Get User by ID
const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "User ID is required");
    }
    if (isNaN(id)) {
        throw new ApiError(400, "User ID must be a number ");
    }

    const user = await User.findOne({
        id
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200)
        .json(new ApiResponse(200, { user }, "User fetched successfully"));

})
//Update An existing user
const UpdateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, gender, domain, available, avatar } = req.body;
    
    // Check if at least one detail is provided to update
    if (!(first_name || last_name || email || gender || domain || available || avatar)) {
        throw new ApiError(400, "At least one field must be provided to update");
    }

    // Validate user ID
    if (!id) {
        throw new ApiError(400, "User ID is required");
    }
    if (isNaN(id)) {
        throw new ApiError(400, "User ID must be a number");
    }

    // Find the user in the database based on ID
    let user = await User.findOne({ id });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Update user details if provided
    const updateObj = {};
    if (first_name) updateObj.first_name = first_name;
    if (last_name) updateObj.last_name = last_name;
    if (email) updateObj.email = email;
    if (gender) updateObj.gender = gender;
    if (domain) updateObj.domain = domain;
    if (avatar) updateObj.avatar = `https://robohash.org/${avatar}`;
    if (available) {
        available = available === "true" ? true : false
        updateObj.available = available
    }

    // Update the user in the database using $set
    const updatedUser = await User.findOneAndUpdate({_id : user._id }, { $set: updateObj }, { new: true });

    if (!updatedUser) {
        throw new ApiError(400, "User update failed. Please try again later.");
    }

    // Respond with the updated user details
    return res.status(200).json(new ApiResponse(200, updatedUser, "User Updated Successfully"));
});

//Delete an user 
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Validate user ID
    if (!id) {
        throw new ApiError(400, "User ID is required");
    }
    if (isNaN(id)) {
        throw new ApiError(400, "User ID must be a number");
    }
    const user = await User.findOne({ id });

    if (!user) {
        throw new ApiError(404, "User not found or already deleted");
    }
    // Find the user in the database based on ID and delete
    await User.findByIdAndDelete({_id : user._id});


    // Respond with success message
    return res.status(200).json(new ApiResponse(200, null, `${user.first_name} details Deleted Successfully`));
});


// Retrieve users with filtering, searching, and pagination
const searchUser = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, domain, gender, availability, search } = req.query;
    const skip = (page - 1) * limit;
    let query = {};
  
    // Apply filtering
    if (domain) query.domain = domain;
    if (gender) query.gender = gender;
    if (availability) query.availability = availability === "true";
  
    // Apply searching
    if (search) {
      query.$or = [
        { first_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } }
      ];
    }
  
    const users = await User.find(query)
      .skip(skip)
      .limit(parseInt(limit));
  
    // Get total count of users for pagination
    const totalCount = await User.countDocuments(query);
  
    return res.status(200).json(new ApiResponse(200, {totalCount, users }, "Users retrieved successfully"));
  });
  



export {
    getAllUser,
    createNewUser,
    getUserById,
    UpdateUser,
    deleteUser,
    searchUser
}




