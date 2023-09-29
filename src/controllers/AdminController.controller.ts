import { Request, Response } from 'express'
import { Admin } from '../entities/admin.entity'
import { password } from '../config/util/Password'
import { sendNotFoundResponse } from '../helpers/responses/404.response'
import { sendAuthenticationResponse } from '../helpers/responses/sendAuthenticationResponse'
import { adminValidation } from '../helpers/validations/admin/admin.validation'
import { StatusCodes } from '../helpers/constants/statusCodes'
import { sendErrorResponse } from '../helpers/responses/sendErrorResponse'
import { formatValidationErrors } from '../helpers/methods/formatValidationErrors'
import { ValidationError } from 'joi'

class AdminController {
	Login = async (req: Request, res: Response) => {
    try{
    await adminValidation.validateAsync(
      req.body,
      {
        abortEarly: false,
      }
    )
		const foundAdmin = await Admin.findOne({ where: { email: req.body.email } })
		if (foundAdmin) {
			let check = password.verify(req.body.password, foundAdmin.password)
			if (check) {
				sendAuthenticationResponse(foundAdmin,res )
			} else {
				sendNotFoundResponse(res)
			}
		} else {
			sendNotFoundResponse(res)
		}
  }
  catch(error)
  {
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

  Register = async (req:Request, res:Response) => {
    try {
      await adminValidation.validateAsync(
        req.body,
        {
          abortEarly: false,
        }
      )
       const exitAdmin = await Admin.findOne({where:{ email: req.body.email }})
       if (!exitAdmin) {
 
          const hashedPassword = password.hash(req.body.password)
          const admin =  Admin.create({email:req.body.email,password:hashedPassword})
          admin.save();
          sendAuthenticationResponse(admin,res )
       }
       else { res.status(400).json({ success: false, data: "email should be unique" }) }
 
    }
    catch (error) {
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
 
}

export default new AdminController()
