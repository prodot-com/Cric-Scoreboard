import { Router } from "express";
import {addFirstSummary, addOpeners, addSecondSummary, addToss, createMatch, deleteMatch, fetchFirstSummary, fetchSummary, findMatch, getmatch, setMatchComplete } from "../Controllers/Match.controller.js";

const router = Router()

router.route('/create').post(createMatch)
router.route('/delete/:id').post(deleteMatch)
router.route('/get').get(getmatch)
router.route('/one/:id').get(findMatch)
router.route('/addtoss/:id').post(addToss)
router.route('/addOpeners/:id').put(addOpeners)
// router.route('/addsummary/:id').post(addSummary)
router.route('/fetchsummary/:id').get(fetchSummary)
router.route('/update/:id').put(setMatchComplete)
router.route('/addFirstSummary/:id').put(addFirstSummary)
router.route('/addSecondSummary/:id').put(addSecondSummary)
router.route('/fetchFirst/:id').get(fetchFirstSummary)


export default router