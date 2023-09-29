import { Router } from "express";
import BorrowingController from "../../controllers/BorrowingController.controller"
import { apiLimiter } from "../../helpers/constants/apiLimiter";

const router = Router();

router.post('/', BorrowingController.checkOutBook)
router.post('/returnBook', BorrowingController.returnBook)
router.get('/myBooks/:borrowerId', BorrowingController.getCurrentBooks)
router.get('/overdueBooks', BorrowingController.listOverdueBooks)
router.get('/report',BorrowingController.getBorrowingReport)
router.get('/overdueBorrows/lastMonth',apiLimiter,BorrowingController.exportOverdueBorrowsLastMonth)
router.get('/borrowingProcesses/lastMonth',apiLimiter,BorrowingController.exportBorrowingProcessesLastMonth)


export default router