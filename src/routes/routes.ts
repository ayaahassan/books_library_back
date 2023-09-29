import { Router } from "express";
import { ApiVersion } from "../helpers/types/apiVersion.type";
import V1Routes from "./v1"
const router = Router();

router.use(ApiVersion.v1, V1Routes);


export default router;
