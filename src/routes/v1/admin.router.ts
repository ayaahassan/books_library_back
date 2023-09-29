import { Router } from "express";
import AdminController from "../../controllers/AdminController.controller"
const router = Router();
router.post('/login',AdminController.Login)
router.post('/register',AdminController.Register)

export default router