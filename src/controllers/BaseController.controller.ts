import { ObjectLiteral, Repository } from 'typeorm'
import { sendSuccessResponse } from '../helpers/responses/sendSuccessResponse'
import { Request, Response } from 'express'
import { sendNotFoundResponse } from '../helpers/responses/404.response'
import { sendErrorResponse } from '../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../helpers/constants/statusCodes'
import { formatValidationErrors } from '../helpers/methods/formatValidationErrors'

export abstract class BaseController<Entity extends ObjectLiteral> {
	 repository: Repository<Entity>
	constructor(repo: Repository<Entity>) {
		this.repository = repo
	}

	 async findAll(req: Request, res: Response, relations?: string[]) {
		try {
			const data: Entity[] = await this.repository.find({ relations })
			sendSuccessResponse<Entity[]>(res, data)
		} catch (error: any) {
			sendErrorResponse(
				formatValidationErrors(error),
				res,
				StatusCodes.NOT_ACCEPTABLE
			)
		}
	}

	 async findOne(req: Request, res: Response, relations?: string[]) {
		try {
			const id: number | undefined = +req.params.id
			const data = await this.repository.findOne({
				where: { id: id as any },
				relations,
			})
			if (data) {
				sendSuccessResponse<Entity>(res, data)
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

	 async create(req: Request, res: Response) {
		try {
			const entity = this.repository.create(req.body)
			const savedEntity = await this.repository.save(entity)
			sendSuccessResponse<Entity>(res, savedEntity)
		} catch (error: any) {
			sendErrorResponse(
				formatValidationErrors(error),
				res,
				StatusCodes.NOT_ACCEPTABLE
			)
		}
	}

	protected async update(req: Request, res: Response) {
		try {
			const id = +req.params.id
			await this.repository.update(id, req.body)
			const updatedEntity = await this.repository.findOne({
				where: { id: id as any },
			})
			if (updatedEntity) {
				sendSuccessResponse<Entity>(res, updatedEntity)
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

	 async delete(req: Request, res: Response) {
		try {
			const id = req.params.id
			const deletedEntity = await this.repository.delete(id)
			if (deletedEntity.affected && deletedEntity.affected > 0) {
				sendSuccessResponse(res, { message: 'Entity deleted successfully' })
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
}
