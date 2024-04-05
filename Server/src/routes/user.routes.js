import { Router } from "express";
import { UpdateUser, createNewUser, deleteUser, getAllUser, getUserById, getUsers } from "../controller/user.controller.js";

const router = Router();

//Get All User  and create new user
router.route("/users").get(getAllUser).post(createNewUser)

//Get User By ID
router.route("/:id").get(getUserById).put(UpdateUser).delete(deleteUser)

// Route to retrieve users with filtering, searching, and pagination
router.route("/search").get(getUsers)


export default router;