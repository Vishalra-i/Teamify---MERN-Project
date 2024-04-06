// team.controller.js
import { Team } from "../models/team.models.js";
import { User } from "../models/user.models.js";
import {asyncHandler} from "../utils/asynHandler.js";
import {ApiResponse} from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

// Create a new team by selecting users with unique domains and availability
const createTeam = asyncHandler(async (req, res) => {
    const { name, userIds } = req.body;

    // Check if name and userIds are provided
    if (!name || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
        throw new ApiError(400, 'Team name and selected users are required');
    }

    // Fetch users based on provided userIds
    const users = await User.find({ _id: { $in: userIds } });

    // Check if all provided userIds correspond to valid users
    if (users.length !== userIds.length) {
        throw new ApiError(400, 'One or more selected users do not exist');
    }

    // Check if selected users have unique domains and availability
    const uniqueDomains = new Set(users.map(user => user.domain));
    const uniqueAvailability = new Set(users.map(user => user.available));

    if (uniqueDomains.size !== users.length || uniqueAvailability.size !== 1) {
        throw new ApiError(400, 'Selected users must have unique domains and availability');
    }

    // Create a new team
    const team = await Team.create({
        name,
        users: userIds
    });

    return res.status(201).json(new ApiResponse(201, team, 'Team created successfully'));
});

export { createTeam };
