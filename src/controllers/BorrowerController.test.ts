// BorrowerController.test.ts
import BorrowerController from './BorrowerController.controller'
import { Request, Response } from 'express'
import * as borrowerValidationModule from '../helpers/validations/borrower/borrower.validation'
import * as dataSourceModule from '../config/database/data-source'
import * as updateBorrowerValidationModule from '../helpers/validations/borrower/update-borrower.validation'
import { StatusCodes } from '../helpers/constants/statusCodes'
import { Borrower } from '../entities/Borrower.entity'
import { borrowerValidation } from '../helpers/validations/borrower/borrower.validation'

jest.mock('../config/database/data-source')
jest.mock('../helpers/validations/borrower/borrower.validation')
jest.mock('../helpers/validations/borrower/update-borrower.validation')

const mockedUpdateBorrowerValidation = {
    validateAsync: jest.fn(),
}
const mockedDataSource = dataSourceModule.dataSource as jest.Mocked<
    typeof dataSourceModule.dataSource
>
const mockedBorrowerValidation =
    borrowerValidationModule.borrowerValidation as jest.Mocked<
        typeof borrowerValidationModule.borrowerValidation
    >

describe('BorrowerController', () => {
    let mockReq: Partial<Request>
    let mockRes: any
    let jsonResponse: jest.Mock

    beforeEach(() => {
        jest.resetAllMocks()

        jsonResponse = jest.fn()
      
    })
    it('should successfully create a borrower', async () => {
        const mockBorrowerData = {
            success:true,
            data:{
            name: 'John Doe',
            email: 'john.doe@example.com',
            registeredDate: new Date(),
        }
        };
    
        const mockReq: unknown = {
            body: mockBorrowerData,
        };
    
        const mockRes: unknown = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    
        const mockRepository = {
            create: jest.fn().mockReturnValue(mockBorrowerData.data),
            save: jest.fn().mockResolvedValue(mockBorrowerData.data),
        };

        const mockValidation = jest.fn().mockResolvedValue(true);

        BorrowerController.repository = mockRepository as any;
        borrowerValidation.validateAsync = mockValidation;

        await BorrowerController.createBorrower(mockReq as Request, mockRes as Response);

        expect((mockRes as any).status).toHaveBeenCalledWith(StatusCodes.SUCCESS);
        expect((mockRes as any).json).toHaveBeenCalledWith(mockBorrowerData);
    });
    it('should handle validation errors while creating borrower', async () => {
        mockReq = {
            body: {
                email: 'email@email.com',
                registeredDate: '2023-09-30',
            },
        }
        const mockRes: unknown = {
            status: jest.fn().mockReturnThis(),
            json: jsonResponse,
        };
        const errorDetails = [{ message: 'Name is required.' }]
        mockedBorrowerValidation.validateAsync.mockRejectedValue({
            details: errorDetails,
        })

        await BorrowerController.createBorrower(
            mockReq as Request,
            mockRes as Response
        )

        expect((mockRes as any).status).toHaveBeenCalledWith(400);
        expect(jsonResponse).toHaveBeenCalledWith({
            status: 'error',
            message: errorDetails.map((detail) => detail.message),
        })
    })

    it('should fetch and send all entities successfully', async () => {
        const mockEntities = {
            success: true,
            data: [
                {
                    id: 1,
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    registeredDate: new Date(),
                    borrowings: [],
                },
                {
                    id: 2,
                    name: 'Jane Smith',
                    email: 'jane.smith@example.com',
                    registeredDate: new Date(),
                    borrowings: [],
                },
            ],
        };

        const mockRes: unknown = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        const mockRepository = {
            find: jest.fn().mockResolvedValue(mockEntities.data),
        };

        BorrowerController.repository = mockRepository as any;

        await BorrowerController.getAll(mockReq as Request, mockRes as Response);

        expect((mockRes as any).status).toHaveBeenCalledWith(StatusCodes.SUCCESS);
        expect((mockRes as any).json).toHaveBeenCalledWith(mockEntities);
    });

    it('should retrieve and send an entity successfully', async () => {
        const mockEntity = {
            success: true,
            data: {
                id: 1,
                name: 'John Doe',
                email: 'john.doe@example.com',
                registeredDate: new Date(),
                borrowings: [],
            }
        };

        const mockReq: unknown = {
            params: {
                id: '1',
            },
        };
        const mockRes: unknown = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        const mockRepository = {
            findOne: jest.fn().mockResolvedValue(mockEntity.data),
        };

        BorrowerController.repository = mockRepository as any;

        await BorrowerController.getOneBorrower(mockReq as Request, mockRes as Response);

        expect((mockRes as any).status).toHaveBeenCalledWith(StatusCodes.SUCCESS);
        expect((mockRes as any).json).toHaveBeenCalledWith(mockEntity);
    });
    it('should send error when send invalid id ', async () => {
        const mockRes: unknown = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        const mockRepository = {
            findOne: jest.fn().mockResolvedValue(undefined),
        };

        BorrowerController.repository = mockRepository as any;

        await BorrowerController.getOneBorrower(mockReq as Request, mockRes as Response);

        expect((mockRes as any).status).toHaveBeenCalledWith(StatusCodes.NOT_ACCEPTABLE);
    });

    it('should successfully delete an entity', async () => {
        const mockReq: unknown = {
            params: {
                id: '3',
            },
        };
    
        const mockRes: unknown = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        const mockRepository = {
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
        };

        BorrowerController.repository = mockRepository as any;

        await BorrowerController.deleteBorrower(mockReq as Request, mockRes as Response);

        expect((mockRes as any).status).toHaveBeenCalledWith(StatusCodes.SUCCESS);
        expect((mockRes as any).json).toHaveBeenCalledWith({
            success: true,
            data: 'Entity deleted successfully',
        });
    });

})
