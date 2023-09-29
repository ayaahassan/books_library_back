import { Response } from 'express'
import jwt from 'jsonwebtoken'
import configurations from '../../config/configurations'
import { Admin } from '../../entities/admin.entity'

export const sendAuthenticationResponse = (admin: Admin, res: Response) => {
	
	const userData = {
		id: admin.id,
		email: admin.email,
	}
	jwt.sign(
		{ user: userData },
		configurations().secret,
		{ expiresIn: '1h' },
		(err: any, token: any) => {
			res.status(200).json({
				success: true,
				data: {
					access_token: token,
					user: userData,
				},
			})
		}
	)
}
