import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import configurations from "../config/configurations";
import { sendErrorResponse } from "../helpers/responses/sendErrorResponse";
import { formatValidationErrors } from "../helpers/methods/formatValidationErrors";
import { StatusCodes } from "../helpers/constants/statusCodes";


const isAuthenticated = async (
  req: Request,
  res: Response,
  next: () => void
) => {
  const bearerHeader = req.headers["authorization"];

  if (bearerHeader !== undefined && bearerHeader.includes("Bearer ")) {
    const Token = bearerHeader.split(" ")[1];
    try {
      jwt.verify(
        Token,
        configurations().secret,
       
      );
      next();
    } catch (e: any) {
      sendErrorResponse(formatValidationErrors(e), res, StatusCodes.NOT_AUTHORIZED);
    }
  } else {
    sendErrorResponse(["Not Authorized"], res, StatusCodes.NOT_AUTHORIZED);
  }
};

export { isAuthenticated };
