import { Router } from "express";
import BookController from "../../controllers/BookController.controller"
const router = Router();
router.get('/',BookController.getAll)
router.post('/',BookController.createBook)
router.get('/search',BookController.searchBooks)
router.get('/:id',BookController.getOneBook)
router.patch('/:id',BookController.updateBook)
router.delete('/:id',BookController.deleteBook)



export default router