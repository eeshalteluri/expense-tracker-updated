import express from "express"
import {homeDashboard, addPersonalExpense, updatePersonalExpense, deletePersonalExpense, completeUserDetails, updateUser} from "../controllers/home.js"

const router = express.Router()

router.get('/', homeDashboard)
router.post('/', addPersonalExpense)
router.put('/', updatePersonalExpense)
router.delete('/', deletePersonalExpense)

router.get('/settings', completeUserDetails)
router.put('/settings', updateUser)

export default router