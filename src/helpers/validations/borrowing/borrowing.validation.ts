import Joi from 'joi'

export const borrowingValidation = Joi.object().keys({
	borrowerId: Joi.number().min(1).required(),
	bookId: Joi.number().min(1).required(),
    dueDate: Joi.date().min(new Date().toISOString()).required()
	
})