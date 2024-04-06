import { Router } from "express";
import { createTeam, getTeamById } from "../controller/team.controller.js";

const router = Router();

router.route("/").post(createTeam)
router.route("/:id").get(getTeamById)


export default router ;