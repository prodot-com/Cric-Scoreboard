import { Router } from "express";
import { addSummary, addToss, createMatch, deleteMatch, findMatch, getmatch } from "../Controllers/Match.controller.js";

const router = Router()

router.route('/create').post(createMatch)
router.route('/delete/:id').post(deleteMatch)
router.route('/get').get(getmatch)
router.route('/one/:id').get(findMatch)
router.route('/addtoss/:id').post(addToss)
router.route('/addsummary/:id').post(addSummary)


export default router