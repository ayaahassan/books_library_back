import { Router } from "express";
import BorrowingController from "../../controllers/BorrowingController.controller"
import { apiLimiter } from "../../helpers/constants/apiLimiter";
import { isAuthenticated } from "../../middleware/isAuthenticated";

const router = Router();

router.get('/', BorrowingController.getAll)
router.post('/', BorrowingController.checkOutBook)
router.patch('/returnBook/:borrowerId/:bookId', BorrowingController.returnBook)
router.get('/myBooks/:borrowerId', BorrowingController.getCurrentBooks)
router.get('/overdueBooks', BorrowingController.listOverdueBooks)
router.get('/report',isAuthenticated,BorrowingController.getBorrowingReport)
router.get('/overdueBorrows/lastMonth',isAuthenticated,apiLimiter,BorrowingController.exportOverdueBorrowsLastMonth)
router.get('/borrowingProcesses/lastMonth',isAuthenticated,apiLimiter,BorrowingController.exportBorrowingProcessesLastMonth)


export default router