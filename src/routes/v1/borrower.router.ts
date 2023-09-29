import { Router } from "express";
import BorrowerController from "../../controllers/BorrowerController.controller"

const router = Router();
router.get('/',BorrowerController.getAll)
router.post('/',BorrowerController.createBorrower)
router.get('/:id',BorrowerController.getOneBorrower)
router.patch('/:id',BorrowerController.updateBorrower)
router.delete('/:id',BorrowerController.deleteBorrower)

export default router