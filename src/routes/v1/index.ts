import { Router } from "express";
import { routeModel } from "../../helpers/types/model.type";
import bookRouter from "./book.router";
import borrowerRouter from "./borrower.router";
import borrowingRouter from "./borrowing.router";


const router = Router();

router.use(routeModel.BOOK, bookRouter);
router.use(routeModel.BORROWER, borrowerRouter);
router.use(routeModel.BORROWING,borrowingRouter)


export default router;
