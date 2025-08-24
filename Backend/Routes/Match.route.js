import { Router } from "express";
import { addSummary, addToss, createMatch, deleteMatch, fetchSummary, findMatch, getmatch, setMatchComplete } from "../Controllers/Match.controller.js";

const router = Router()

router.route('/create').post(createMatch)
router.route('/delete/:id').post(deleteMatch)
router.route('/get').get(getmatch)
router.route('/one/:id').get(findMatch)
router.route('/addtoss/:id').post(addToss)
router.route('/addsummary/:id').post(addSummary)
router.route('/fetchsummary/:id').get(fetchSummary)
router.route('/update/:id').put(setMatchComplete)


export default router