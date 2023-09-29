import Joi from 'joi'

export const borrowerValidation = Joi.object().keys({
	name: Joi.string().min(3).required(),
	email: Joi.string().email().required(),
    registeredDate: Joi.date().min(new Date().toISOString()).required()
	
})