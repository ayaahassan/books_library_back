
jest.mock('../config/database/data-source');
jest.mock('../helpers/validations/books/book.validation');
jest.mock('../helpers/responses/sendSuccessResponse');

import BookController from './BookController.controller';
import { Request, Response } from "express";
import * as bookValidationModule from '../helpers/validations/books/book.validation';
import * as dataSourceModule from '../config/database/data-source';
const mockedDataSource = dataSourceModule.dataSource as jest.Mocked<typeof dataSourceModule.dataSource>;
const mockedBookValidation = bookValidationModule.bookValidation as jest.Mocked<typeof bookValidationModule.bookValidation>;
const mockedSendSuccessResponse = require('../helpers/responses/sendSuccessResponse');


describe('BookController', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let jsonResponse: jest.Mock;
  
    beforeEach(() => {
      jest.resetAllMocks();
  
      jsonResponse = jest.fn();
      mockReq = {
        body: {
          title: "Sample Book",
          author: "Author",
        }
      };
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jsonResponse
      };
    });
  
    it('should validate and create a book', async () => {
      mockedBookValidation.validateAsync.mockResolvedValue(true);
  
      const mockRepository = {
        create: jest.fn().mockReturnValue(mockReq.body),
        save: jest.fn().mockResolvedValue(mockReq.body)
    };
    
(mockedDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);    
  
      await BookController.createBook(mockReq as Request, mockRes as Response);
  
      expect(mockedBookValidation.validateAsync).toHaveBeenCalledWith(mockReq.body, {
        abortEarly: false,
      });
      expect(mockedDataSource.getRepository).toHaveBeenCalled();
      expect(jsonResponse).toHaveBeenCalledWith(mockReq.body); 
    });
  
    it('should handle validation errors', async () => {
      const errorDetails = [{ message: 'Title is required.' }];
      mockedBookValidation.validateAsync.mockRejectedValue({ details: errorDetails });
  
      await BookController.createBook(mockReq as Request, mockRes as Response);
  
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(jsonResponse).toHaveBeenCalledWith({
        status: 'error',
        message: errorDetails.map(detail => detail.message)
      });
    });
  
  });
  