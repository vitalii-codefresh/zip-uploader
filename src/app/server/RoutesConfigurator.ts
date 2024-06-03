import express, {Router} from "express";
import {UploadService} from "../services/upload-service/UploadService";

export class RoutesConfigurator {
    constructor(private readonly _uploadService: UploadService) {
    }

    getRouter(): Router {
        const router = express.Router();
        router.use((req: express.Request, res: express.Response, next) => {
            res.setHeader("Content-Type", "application/json");
            next();
        })
        router.get("/ping", (request, response) => {
            response.send("pong");
        })
        router.post("/uploadZip", (request, response)=>{
            this._uploadService.process(request, response)
        });
        return router;
    }
}
