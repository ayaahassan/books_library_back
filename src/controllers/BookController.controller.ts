import { Book } from "../entities/Book.entity";
import { BaseController } from "./BaseController.controller";
import { dataSource } from "../config/database/data-source";
import { Request, Response } from "express";
import { bookValidation } from "../helpers/validations/books/book.validation";
import { any } from "joi";
import { updateBookValidation } from "../helpers/validations/books/update-book.validation";
import { sendSuccessResponse } from "../helpers/responses/sendSuccessResponse";
import { Like } from "typeorm";
import { StatusCodes } from "../helpers/constants/statusCodes";

class BookController extends BaseController<Book> {
  constructor() {
    super(dataSource.getRepository(Book));
  }

  getAll = async (req: Request, res: Response) => {
    return await this.findAll(req, res);
  }
  getOneBook = async (req: Request, res: Response) => {
    return await this.findOne(req, res);
  }

  createBook = async (req: Request, res: Response) => {
    try {
      await bookValidation.validateAsync(
        req.body,
        {
          abortEarly: false,
        }
      )
      return await this.create(req, res);
    }
    catch (validationError: any) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: validationError.details.map((detail: any) => detail.message)
      });
    }
  }

  updateBook = async (req: Request, res: Response) => {
    try {
      await updateBookValidation.validateAsync(
        req.body,
        {
          abortEarly: false,
        }
      )
      return await this.update(req, res);
    }
    catch (validationError: any) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: validationError.details.map((detail: any) => detail.message)
      });
    }
  }

  deleteBook = async (req: Request, res: Response) => {
    return await this.delete(req, res);
  }
  searchBooks = async (req: Request, res: Response) => {
    try {
        const { title, author, ISBN } = req.query;
        const where: any[] = [];
        if (title) {
            where.push({ title: Like(`%${title}%`) });
        }

        if (author) {
            where.push({ author: Like(`%${author}%`) });
        }

        if (ISBN) {
            where.push({ ISBN });
        }

        const books = await this.repository.find({where});
        sendSuccessResponse<Book[]>(res, books);

    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
}

}
export default new BookController();
