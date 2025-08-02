import { Router } from "express";
import { createMatch } from "../Controllers/Match.controller.js";

const router = Router()

router.route('/create').post(createMatch)

export default router