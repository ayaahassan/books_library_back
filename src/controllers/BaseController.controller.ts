import { ObjectLiteral, Repository } from "typeorm";
import { sendSuccessResponse } from "../helpers/responses/sendSuccessResponse";
import { Request, Response } from 'express'

export abstract class BaseController<Entity extends ObjectLiteral>{
    protected repository: Repository<Entity>;
    constructor(repo: Repository<Entity>) {
        this.repository = repo;
    }

    protected async findAll(req: Request, res: Response, relations?: string[]) {
        try {
            const data: Entity[] = await this.repository.find({ relations });
            sendSuccessResponse<Entity[]>(res, data);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    protected async findOne(req: Request, res: Response, relations?: string[]) {
        try {
            const id: number | undefined = +req.params.id
            const data = await this.repository.findOne({ where: { id: id as any }, relations }); if (data) {
                sendSuccessResponse<Entity>(res, data);
            } else {
                res.status(404).json({ error: 'Entity not found' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    protected async create(req: Request, res: Response) {
        try {
            const entity = this.repository.create(req.body);
            const savedEntity = await this.repository.save(entity);
            sendSuccessResponse<Entity>(res, savedEntity);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    protected async update(req: Request, res: Response) {
        try {
            const id = +req.params.id;
            await this.repository.update(id, req.body);
            const updatedEntity = await this.repository.findOne({ where: { id: id as any } });
            if (updatedEntity) {
                sendSuccessResponse<Entity>(res, updatedEntity);
            } else {
                res.status(404).json({ error: 'Entity not found' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    protected async delete(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const deletedEntity = await this.repository.delete(id);
            if (deletedEntity.affected && deletedEntity.affected > 0) {
                sendSuccessResponse(res, { message: 'Entity deleted successfully' });
            } else {
                res.status(404).json({ error: 'Entity not found' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}