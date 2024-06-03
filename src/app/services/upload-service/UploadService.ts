import multer from 'multer';
import {Request, Response} from "express";
import {constants} from "node:http2";
import * as fs from "node:fs";
import path from "node:path";
import {Logger} from "../../../libs/logger/Logger";
import AdmZip from "adm-zip";
import {TEN_MB} from "../../../libs/consts/consts";

export class UploadService {

    private readonly _uploadDestination: string = "uploads";
    private _logger: Logger;

    constructor() {
        this._logger = new Logger("UploadService");
        this._checkUploadDestination();
    }

    process(req: Request, res: Response) {
        const multerResultFunction = multer({fileFilter: this.fileFilter, limits:{ fileSize: TEN_MB} }).array("bills");
        multerResultFunction(req, res,  async (err) => {
            if (err) {
                const status = constants.HTTP_STATUS_BAD_REQUEST;
                res.status(status).json({status, data: {message: err.message}});
                return;
            }
            const files = req.files as Express.Multer.File[];
            try{
              const savedPaths = this._saveFiles(files);
              this._unpackArchives(savedPaths);
            }catch(e: any){
                const status = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
                this._logger.error(`ERROR: MESSAGE: ${e.message} | STACK: ${e.stack}`);
                res.status(status).json({status, data: {message: "internal server error"}});
                return;
            }
            const status = constants.HTTP_STATUS_CREATED;
            res.status(status).json({status, data: {message: "upload successfully"}});
        });
    }

    private fileFilter(req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) {
        if (file.mimetype === "application/zip") {
            callback(null, true);
        } else {
            callback(new Error(`file ${file.originalname}  should have zip format`));
        }
    }

    private _saveFiles(files: Express.Multer.File[] ): string[] {
        const savedFiles: string[] = [];
        for (const file of files) {
            const pathToSave = path.resolve(this._uploadDestination, file.originalname);
            fs.writeFileSync(pathToSave , file.buffer);
            savedFiles.push(pathToSave);
        }
        return savedFiles;
    }

    private _checkUploadDestination() {
        if(!fs.existsSync(this._uploadDestination)) {
            fs.mkdirSync(this._uploadDestination);
        }
    }

    private _unpackArchives(savedPaths: string[]) {
        for (const savedPath of savedPaths) {
            const {name} = path.parse(savedPath);
            const pathToUnpack = path.join(this._uploadDestination, name.toLowerCase().replace(".", "_"));
            if(!fs.existsSync(pathToUnpack)) {
                fs.mkdirSync(pathToUnpack);
            }
            const zip = new AdmZip(savedPath);
            zip.extractAllTo(pathToUnpack, true);
        }
    }
}
