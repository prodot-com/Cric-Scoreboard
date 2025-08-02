import { Router } from "express";
import { createMatch, deleteMatch } from "../Controllers/Match.controller.js";

const router = Router()

router.route('/create').post(createMatch)
router.route('/delete/:id').post(deleteMatch)

export default router