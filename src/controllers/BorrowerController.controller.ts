import { ValidationError } from 'joi'
import { dataSource } from '../config/database/data-source'
import { Borrower } from '../entities/Borrower.entity'
import { borrowerValidation } from '../helpers/validations/borrower/borrower.validation'
import { updateBorrowerValidation } from '../helpers/validations/borrower/update-borrower.validation'
import { BaseController } from './BaseController.controller'
import { Request, Response } from 'express'
import { sendErrorResponse } from '../helpers/responses/sendErrorResponse'
import { formatValidationErrors } from '../helpers/methods/formatValidationErrors'
import { StatusCodes } from '../helpers/constants/statusCodes'

class BorrowerController extends BaseController<Borrower> {
	constructor() {
		super(dataSource.getRepository(Borrower))
	}

	getAll = async (req: Request, res: Response) => {
		return await this.findAll(req, res)
	}
	getOneBorrower = async (req: Request, res: Response) => {
		return await this.findOne(req, res)
	}

	createBorrower = async (req: Request, res: Response) => {
		try {
			await borrowerValidation.validateAsync(req.body, {
				abortEarly: false,
			})
			return await this.create(req, res)
		} catch (validationError: any) {
			res.status(StatusCodes.BAD_REQUEST).json({
				status: 'error',
				message: validationError.details.map((detail: any) => detail.message),
			})
		}
	}

	updateBorrower = async (req: Request, res: Response) => {
		try {
			await updateBorrowerValidation.validateAsync(req.body, {
				abortEarly: false,
			})
			return await this.update(req, res)
		} catch (error) {
			if (error instanceof ValidationError) {
				res.status(StatusCodes.BAD_REQUEST).json({
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
	deleteBorrower = async (req: Request, res: Response) => {
		return await this.delete(req, res)
	}
}
export default new BorrowerController()
