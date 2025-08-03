import { Router } from "express";
import { addToss, createMatch, deleteMatch, findMatch, getmatch } from "../Controllers/Match.controller.js";

const router = Router()

router.route('/create').post(createMatch)
router.route('/delete/:id').post(deleteMatch)
router.route('/get').get(getmatch)
router.route('/one/:id').get(findMatch)
router.route('/add/:id').get(addToss)


export default router