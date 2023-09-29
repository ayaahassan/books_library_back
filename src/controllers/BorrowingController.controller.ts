import { Request, Response } from 'express'
import { Between, IsNull, LessThan, Repository } from 'typeorm'
import { Borrowing } from '../entities/Borrowing.entity'
import { dataSource } from '../config/database/data-source'
import { Book } from '../entities/Book.entity'
import { sendSuccessResponse } from '../helpers/responses/sendSuccessResponse'
import { borrowingValidation } from '../helpers/validations/borrowing/borrowing.validation'
import { ValidationError } from 'joi'
import { Borrower } from '../entities/Borrower.entity'
import { exportToCSV } from '../helpers/methods/exportToCSV'
import { exportToXLSX } from '../helpers/methods/exportToXLSX'
import { sendNotFoundResponse } from '../helpers/responses/404.response'
import { sendErrorResponse } from '../helpers/responses/sendErrorResponse'
import { formatValidationErrors } from '../helpers/methods/formatValidationErrors'
import { StatusCodes } from '../helpers/constants/statusCodes'

class BorrowingController {
	borrowingRepo: Repository<Borrowing>
	constructor() {
		this.borrowingRepo = dataSource.getRepository(Borrowing)
	}
	checkOutBook = async (req: Request, res: Response) => {
		await borrowingValidation.validateAsync(req.body, {
			abortEarly: false,
		})
		const { borrowerId, bookId, dueDate } = req.body

		try {
			// Check if the book exists
			const book = await dataSource
				.getRepository(Book)
				.findOne({ where: { id: bookId } })
			if (!book) {
				sendNotFoundResponse(res)
			}

			// Check how many copies of the book are currently borrowed and not yet returned
			const currentlyBorrowedCount = await this.borrowingRepo.count({
				where: {
					book: { id: bookId },
					returnedOn: IsNull(),
				},
			})

			// Check if there are available copies to borrow
			if (book && book.quantity <= currentlyBorrowedCount) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ error: 'All copies of the book are currently borrowed' })
			}
			const borrower = await dataSource
				.getRepository(Borrower)
				.findOne({ where: { id: borrowerId } })
			if (!borrower) {
				sendNotFoundResponse(res)
			}
			// If all checks pass, proceed to borrow the book
			const newBorrowing = this.borrowingRepo.create({
				book: { id: bookId },
				borrower: { id: borrowerId },
				borrowedOn: new Date(),
				dueDate: dueDate,
			})
			await this.borrowingRepo.save(newBorrowing)
			sendSuccessResponse<Borrowing>(res, newBorrowing)
		} catch (error) {
			if (error instanceof ValidationError) {
				res.status(400).json({
					status: 'error',
					message: error.details.map((detail) => detail.message),
				})
			} else {
				sendErrorResponse(
					formatValidationErrors(error as any),
					res,
					StatusCodes.NOT_ACCEPTABLE
				)
			}
		}
	}

	returnBook = async (req: Request, res: Response) => {
		const { id } = req.params
		try {
			const borrowing = await this.borrowingRepo.findOne({
				where: { id: id as any },
			})
			if (borrowing) {
				borrowing.returnedOn = new Date()
				await this.borrowingRepo.save(borrowing)
				sendSuccessResponse<Borrowing>(res, borrowing)
			} else {
				sendNotFoundResponse(res)
			}
		} catch (error: any) {
			sendErrorResponse(
				formatValidationErrors(error),
				res,
				StatusCodes.NOT_ACCEPTABLE
			)
		}
	}

	getCurrentBooks = async (req: Request, res: Response) => {
		const { borrowerId } = req.params
		try {
			const currentBooks = await this.borrowingRepo.find({
				where: {
					borrower: { id: +borrowerId },
					returnedOn: IsNull(),
				},
				relations: ['book'],
			})
			const books = currentBooks.map((borrowing) => borrowing.book)
			sendSuccessResponse<Book[]>(res, books)
		} catch (error: any) {
			sendErrorResponse(
				formatValidationErrors(error),
				res,
				StatusCodes.NOT_ACCEPTABLE
			)
		}
	}

	listOverdueBooks = async (req: Request, res: Response) => {
		try {
			const overdueBooks = await this.borrowingRepo.find({
				where: {
					returnedOn: IsNull(),
					dueDate: LessThan(new Date()),
				},
				relations: { book: true },
			})
			sendSuccessResponse<Borrowing[]>(res, overdueBooks)
		} catch (error: any) {
			sendErrorResponse(
				formatValidationErrors(error),
				res,
				StatusCodes.NOT_ACCEPTABLE
			)
		}
	}

	getBorrowingReport = async (req: Request, res: Response) => {
		const { startDate, endDate, format } = req.query

		if (
			!startDate ||
			!endDate ||
			typeof startDate !== 'string' ||
			typeof endDate !== 'string'
		) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Please provide both startDate and endDate' })
		}
		const borrowings = await this.borrowingRepo.find({
			where: {
				borrowedOn: Between(new Date(startDate), new Date(endDate)),
			},
			relations: ['book', 'borrower'],
		})
		const columns = [
			{ header: 'ID', key: 'id', width: 10 },
			{ header: 'borrowedOn', key: 'borrowedOn', width: 20 },
			{ header: 'dueDate', key: 'dueDate', width: 20 },
			{ header: 'returnedOn', key: 'returnedOn', width: 20 },
			{ header: 'book', key: 'book', width: 30 },
			{ header: 'borrower', key: 'borrower', width: 30 },
		]
		switch (format) {
			case 'csv':
				return exportToCSV(res, borrowings)
			case 'xlsx':
				return exportToXLSX(res, borrowings, columns)
			default:
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ error: 'Unsupported format' })
		}
	}

	exportOverdueBorrowsLastMonth = async (req: Request, res: Response) => {
		const currentDate = new Date()
		const firstDayLastMonth = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth() - 1,
			1
		)
		const lastDayLastMonth = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			0
		)

		try {
			const overdueBorrowings = await this.borrowingRepo.find({
				where: {
					borrowedOn: Between(firstDayLastMonth, lastDayLastMonth),
					returnedOn: IsNull(),
					dueDate: LessThan(lastDayLastMonth),
				},
				relations: ['borrower'],
			})
			const overdueBorrowers = overdueBorrowings.map(borrow => borrow.borrower);
			return exportToCSV(res, overdueBorrowers)
		} catch (error: any) {
			sendErrorResponse(
				formatValidationErrors(error),
				res,
				StatusCodes.NOT_ACCEPTABLE
			)
		}
	}
	exportBorrowingProcessesLastMonth = async (req: Request, res: Response) => {
		const currentDate = new Date()
		const firstDayLastMonth = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth() - 1,
			1
		)
		const lastDayLastMonth = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			0
		)

		try {
			const borrowingProcesses = await this.borrowingRepo.find({
				where: {
					borrowedOn: Between(firstDayLastMonth, lastDayLastMonth),
				},
				relations: ['book', 'borrower'],
			})
			return exportToCSV(res, borrowingProcesses)
		} catch (error: any) {
			sendErrorResponse(
				formatValidationErrors(error),
				res,
				StatusCodes.NOT_ACCEPTABLE
			)
		}
	}
}
export default new BorrowingController()
