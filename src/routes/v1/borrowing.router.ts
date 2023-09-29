import { Router } from "express";
import BorrowingController from "../../controllers/BorrowingController.controller"
import { apiLimiter } from "../../config/util/apiLimiter";
import { isAuthenticated } from "../../middleware/isAuthenticated";

const router = Router();

router.get('/', BorrowingController.getAll)
router.post('/', BorrowingController.checkOutBook)
router.patch('/returnBook/:borrowerId/:bookId', BorrowingController.returnBook)
router.get('/myBooks/:borrowerId', BorrowingController.getCurrentBooks)
router.get('/overdueBooks', BorrowingController.listOverdueBooks)
router.get('/report',isAuthenticated,BorrowingController.getBorrowingReport)
router.get('/overdueBorrows/lastMonth',isAuthenticated,BorrowingController.exportOverdueBorrowsLastMonth)
router.get('/borrowingProcesses/lastMonth',isAuthenticated,BorrowingController.exportBorrowingProcessesLastMonth)


export default router