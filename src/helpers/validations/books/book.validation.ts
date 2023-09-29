import Joi from 'joi'

export const bookValidation = Joi.object().keys({
	title: Joi.string().min(3).required(),
    author: Joi.string().min(5).required(),
	ISBN: Joi.string().min(12).required(),
    quantity: Joi.number().min(0).required(),
	shelfLocation: Joi.string().min(2).required(),
})