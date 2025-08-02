import { Router } from "express";
import { createMatch, deleteMatch, getmatch } from "../Controllers/Match.controller.js";

const router = Router()

router.route('/create').post(createMatch)
router.route('/delete/:id').post(deleteMatch)
router.route('/get').get(getmatch)


export default router