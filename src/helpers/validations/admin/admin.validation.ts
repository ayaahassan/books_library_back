import Joi from 'joi'

export const adminValidation = Joi.object().keys({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
	
})